"use client";

import { signUpload } from "@/app/actions/cloudinary";
import type { CloudinaryMedia, CloudinaryResourceType } from "@/lib/cloudinary";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

// Single upload path shared by every dashboard editor: ask the server for a
// signature, then PUT the file straight to Cloudinary. Nothing large ever
// travels through our own server, and the caller gets back the small pointer
// object that is what actually gets stored in Convex.
export async function uploadMedia(file: File): Promise<CloudinaryMedia> {
  const resourceType: CloudinaryResourceType = file.type.startsWith("video/")
    ? "video"
    : "image";

  const limit = resourceType === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    throw new Error(
      `File is too large. Maximum ${Math.round(limit / 1024 / 1024)}MB for ${resourceType}s.`
    );
  }

  const { signature, timestamp, apiKey, cloudName, folder } = await signUpload();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Upload failed: ${detail.slice(0, 200)}`);
  }

  const result = await res.json();
  return {
    publicId: result.public_id,
    version: result.version,
    format: result.format,
    resourceType,
    width: result.width,
    height: result.height,
  };
}
