// Media lives in Cloudinary; Convex only stores the pointer below. Keeping the
// pointer (rather than a full URL) means delivery options — format, quality,
// width — are decided at render time instead of being baked in at upload.

export type CloudinaryResourceType = "image" | "video";

export type CloudinaryMedia = {
  publicId: string;
  version: number;
  format: string;
  resourceType: CloudinaryResourceType;
  width?: number;
  height?: number;
};

export const CLOUDINARY_FOLDER = "kambest";

export function cloudName() {
  const name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!name) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set.");
  return name;
}

type ImageOptions = {
  /** Target display width in CSS pixels. Cloudinary caps at the original size. */
  width?: number;
  /** `fill` crops to the box, `limit` shrinks to fit without cropping. */
  crop?: "fill" | "limit";
};

// f_auto/q_auto let Cloudinary pick AVIF/WebP and a per-image quality, which is
// what replaces the old Jimp re-encode step. Because the CDN already returns an
// optimised file, these URLs are rendered with next/image `unoptimized` so we
// don't pay to optimise them a second time at the edge.
export function imageUrl(media: CloudinaryMedia, options: ImageOptions = {}) {
  const { width, crop = "limit" } = options;
  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`, `c_${crop}`);
  if (crop === "fill") transforms.push("g_auto");
  return `https://res.cloudinary.com/${cloudName()}/image/upload/${transforms.join(",")}/v${media.version}/${media.publicId}`;
}

export function videoUrl(media: CloudinaryMedia) {
  return `https://res.cloudinary.com/${cloudName()}/video/upload/f_auto,q_auto/v${media.version}/${media.publicId}`;
}

// Poster frame for a video, so the gallery shows something before playback.
export function videoPosterUrl(media: CloudinaryMedia, width = 800) {
  return `https://res.cloudinary.com/${cloudName()}/video/upload/f_auto,q_auto,w_${width},c_limit/v${media.version}/${media.publicId}.jpg`;
}

export function mediaUrl(media: CloudinaryMedia, options: ImageOptions = {}) {
  return media.resourceType === "video" ? videoUrl(media) : imageUrl(media, options);
}
