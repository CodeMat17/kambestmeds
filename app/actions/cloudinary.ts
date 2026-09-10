"use server";

import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_FOLDER, type CloudinaryResourceType } from "@/lib/cloudinary";

// The API secret never leaves the server. Browsers upload straight to
// Cloudinary using a short-lived signature minted here, which keeps the 17MB+
// lab videos out of the 1MB Server Action body limit entirely.
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated.");
  return userId;
}

export type UploadSignature = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

export async function signUpload(): Promise<UploadSignature> {
  await requireAdmin();

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!apiKey || !apiSecret || !cloudName) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  // Only the params signed here may be sent by the browser; Cloudinary rejects
  // the upload if the client adds or changes anything else.
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: CLOUDINARY_FOLDER },
    apiSecret
  );

  return { signature, timestamp, apiKey, cloudName, folder: CLOUDINARY_FOLDER };
}

// Called after the Convex document is deleted, so a removed product or team
// photo doesn't linger in the Cloudinary account and count against its quota.
export async function destroyAsset(
  publicId: string,
  resourceType: CloudinaryResourceType
) {
  await requireAdmin();
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    // A failed cleanup must not surface as a failed delete — the document is
    // already gone, and an orphaned asset can be swept up later.
    console.error(`Cloudinary destroy failed for ${publicId}:`, error);
  }
}
