// Jimp (used server-side in convex/images.ts) cannot decode WebP, so we
// convert WebP files to PNG in the browser (which decodes WebP natively)
// before they're uploaded.
export async function ensureJimpDecodable(file: File): Promise<File> {
  if (file.type !== "image/webp") return file;

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  if (!blob) return file;

  return new File([blob], file.name.replace(/\.webp$/i, ".png"), {
    type: "image/png",
  });
}
