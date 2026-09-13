export const MAX_LOGO_BYTES = 2 * 1024 * 1024;
export async function readLogo(file: File) {
  if (!file.size || file.size > MAX_LOGO_BYTES) throw new Error("Choose a PNG, JPEG, or WebP logo smaller than 2 MB.");
  const data = Buffer.from(await file.arrayBuffer());
  const png = data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpg = data[0] === 255 && data[1] === 216 && data[2] === 255;
  const webp = data.toString("ascii",0,4) === "RIFF" && data.toString("ascii",8,12) === "WEBP";
  const mime = png ? "image/png" : jpg ? "image/jpeg" : webp ? "image/webp" : "";
  if (!mime || mime !== file.type) throw new Error("Upload a valid PNG, JPEG, or WebP image.");
  return { data, mime, extension: png ? "png" : jpg ? "jpg" : "webp" };
}
