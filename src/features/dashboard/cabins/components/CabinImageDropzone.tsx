"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  type DragEvent,
} from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

export type CabinImage = {
  id: string;
  src: string;
  file?: File;
};

interface CabinImageDropzoneProps {
  value: CabinImage[];
  onChange: (images: CabinImage[]) => void;
  maxImages?: number;
}

const MAX_FILE_SIZE_MB = 15;
const THUMBNAIL_MAX_DIMENSION = 320;
const THUMBNAIL_QUALITY = 0.8;

async function createThumbnailUrl(file: File): Promise<string> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      THUMBNAIL_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no-2d-context");

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", THUMBNAIL_QUALITY),
    );
    if (!blob) throw new Error("thumbnail-blob-failed");

    return URL.createObjectURL(blob);
  } catch {
    return URL.createObjectURL(file);
  }
}

interface ImageThumbnailItemProps {
  image: CabinImage;
  index: number;
  isMain: boolean;
  onRemove: (id: string) => void;
}

function ImageThumbnailItemBase({
  image,
  index,
  isMain,
  onRemove,
}: ImageThumbnailItemProps) {
  return (
    <div className="border-border bg-surface relative size-25 overflow-hidden rounded-lg border">
      {/* eslint-disable-next-line */}
      <img
        src={image.src}
        alt={`پیش‌نمایش عکس ${index + 1}`}
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
      />

      {isMain && (
        <span className="bg-primary-400 absolute right-1.5 bottom-1.5 rounded-md px-2 py-1 text-[10px] font-bold text-black">
          عکس اصلی
        </span>
      )}

      <button
        type="button"
        aria-label={`حذف عکس ${index + 1}`}
        onClick={(event) => {
          event.stopPropagation();
          onRemove(image.id);
        }}
        className="hover:bg-danger absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full bg-black/70 text-white backdrop-blur-sm transition"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

// Memoized so that unrelated re-renders of the parent form (e.g. typing in
// another field) don't force every thumbnail to re-render/repaint.
const ImageThumbnailItem = memo(ImageThumbnailItemBase);

function CabinImageDropzoneBase({
  value,
  onChange,
  maxImages = 10,
}: CabinImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const previousValueRef = useRef(value);

  // Single source of truth for blob URL cleanup: revoke any URL that
  // leaves `value`, whether that happens because the user removed an
  // image OR because the parent reset the form (e.g. switching cabin in
  // edit mode). This closes the leak the old removeImage-only cleanup had.
  useEffect(() => {
    const previous = previousValueRef.current;
    const currentIds = new Set(value.map((image) => image.id));

    previous.forEach((image) => {
      if (!currentIds.has(image.id) && image.src.startsWith("blob:")) {
        URL.revokeObjectURL(image.src);
      }
    });

    previousValueRef.current = value;
  }, [value]);

  useEffect(() => {
    return () => {
      previousValueRef.current.forEach((image) => {
        if (image.src.startsWith("blob:")) {
          URL.revokeObjectURL(image.src);
        }
      });
    };
  }, []);

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter((file) =>
        file.type.startsWith("image/"),
      );

      const oversized = files.filter(
        (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024,
      );
      if (oversized.length > 0) {
        toast.error(
          `حجم هر عکس باید کمتر از ${MAX_FILE_SIZE_MB} مگابایت باشد.`,
        );
      }

      const validFiles = files.filter(
        (file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
      );

      const availableSlots = maxImages - value.length;
      if (availableSlots <= 0 || validFiles.length === 0) return;

      const filesToProcess = validFiles.slice(0, availableSlots);
      if (filesToProcess.length < validFiles.length) {
        toast.error(
          `به دلیل محدودیت تعداد، فقط ${filesToProcess.length} عکس اضافه شد.`,
        );
      }

      setIsProcessing(true);
      try {
        const nextImages = await Promise.all(
          filesToProcess.map(async (file) => ({
            id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
            src: await createThumbnailUrl(file),
            file,
          })),
        );
        onChange([...value, ...nextImages]);
      } finally {
        setIsProcessing(false);
      }
    },
    [maxImages, value, onChange],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      void addFiles(event.dataTransfer.files);
    },
    [addFiles],
  );

  const removeImage = useCallback(
    (id: string) => {
      onChange(value.filter((item) => item.id !== id));
    },
    [value, onChange],
  );

  const isFull = value.length >= maxImages;

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!isFull) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isFull && inputRef.current?.click()}
        role="button"
        tabIndex={isFull ? -1 : 0}
        aria-disabled={isFull}
        onKeyDown={(event) => {
          if (!isFull && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={[
          "border-border bg-background rounded-2xl border-2 border-dashed p-6 text-center transition-all",
          isFull ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          isDragging
            ? "border-primary-400 bg-primary-400/10"
            : "hover:border-primary-400/60 hover:bg-surface-raised",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          disabled={isFull}
          onChange={(event) => {
            if (event.target.files) void addFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          <div className="bg-primary-400/15 text-primary-600 dark:text-primary-300 grid size-12 place-items-center rounded-xl">
            {isDragging ? (
              <Upload className="size-6" />
            ) : (
              <ImagePlus className="size-6" />
            )}
          </div>

          <div>
            <p className="text-text font-semibold">
              {isFull
                ? "حداکثر تعداد عکس انتخاب شده است"
                : isProcessing
                  ? "در حال پردازش عکس‌ها..."
                  : "عکس‌ها را بکشید و اینجا رها کنید"}
            </p>
            <p className="text-text-gray mt-1 text-sm">
              یا برای انتخاب عکس کلیک کنید — حداکثر {maxImages} عکس
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-text-gray text-xs">
          اولین عکسی که آپلود شود، به صورت پیش‌فرض عکس اصلی سوییت ثبت می‌شود.
        </p>
        <span className="text-text shrink-0 text-xs font-semibold">
          {value.length} / {maxImages}
        </span>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((image, index) => (
            <ImageThumbnailItem
              key={image.id}
              image={image}
              index={index}
              isMain={index === 0}
              onRemove={removeImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Skips re-rendering the whole dropzone (and every thumbnail) when the
// parent form re-renders for unrelated reasons (typing in another field,
// validation state changes, etc.) as long as `value`/`onChange` haven't
// actually changed.
export default memo(CabinImageDropzoneBase);
