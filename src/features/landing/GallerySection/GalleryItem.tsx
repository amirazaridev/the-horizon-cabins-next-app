import { ZoomIn } from "lucide-react";
import { type ReactNode } from "react";

type Props = { span: string; src: string; id: number };

export default function GalleryItem({ src, span, id }: Props): ReactNode {
  return (
    <div
      className={`gallery-item ${span} group relative cursor-pointer overflow-hidden rounded-2xl`}
    >
      <img
        src={src}
        alt={`تصویر گالری ${id}`}
        className="h-full w-full object-cover transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white/10 backdrop-blur-sm">
          <ZoomIn className="text-text size-6" />
        </div>
      </div>
    </div>
  );
}
