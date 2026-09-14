import type { CabinImage } from "../components/CabinImageDropzone";

export type SplitImagesResult = {
  keepExisting: string[];
  newFiles: File[];       
};

export function splitImages(images: CabinImage[]): SplitImagesResult {
  const keepExisting: string[] = [];
  const newFiles: File[] = [];

  for (const image of images) {
    if (image.file) {
      newFiles.push(image.file);
    } else if (image.src) {
      keepExisting.push(image.src);
    }
  }

  return { keepExisting, newFiles };
}