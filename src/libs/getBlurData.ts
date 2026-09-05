import { getPlaiceholder } from "plaiceholder";

export async function getBlurData(src: string) {
  const res = await fetch(src);
  const buffer = Buffer.from(await res.arrayBuffer());
  const { base64 } = await getPlaiceholder(buffer);
  return base64;
}