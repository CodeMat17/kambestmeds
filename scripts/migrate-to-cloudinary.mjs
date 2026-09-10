// First half of the migration: uploads every file captured by
// scripts/backup-convex.mjs into Cloudinary and records the mapping that
// scripts/reseed-convex.mjs then writes into Convex. Safe to re-run — uploads
// reuse the old Convex storage id as the public_id, with overwrite.
//
//   node --env-file=.env.local scripts/migrate-to-cloudinary.mjs backups/<stamp>
//
// Requires the Cloudinary env vars. See MIGRATION.md for the full cutover.
import { v2 as cloudinary } from "cloudinary";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.argv[2];
if (!root) throw new Error("Usage: node scripts/migrate-to-cloudinary.mjs backups/<stamp>");

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const files = JSON.parse(await readFile(join(root, "files.json"), "utf8"));

// storageId -> Cloudinary pointer, the exact shape convex/lib/media.ts expects.
const mapping = {};

for (const entry of files) {
  const isVideo = entry.contentType.startsWith("video/");
  const result = await cloudinary.uploader.upload(join(root, "files", entry.file), {
    folder: "kambest",
    // Reusing the old Convex storage id keeps the migration re-runnable and
    // makes it obvious in the Cloudinary console where each asset came from.
    public_id: entry.storageId,
    resource_type: isVideo ? "video" : "image",
    overwrite: true,
    invalidate: true,
  });

  mapping[entry.storageId] = {
    publicId: result.public_id,
    version: result.version,
    format: result.format,
    resourceType: isVideo ? "video" : "image",
    width: result.width,
    height: result.height,
  };
  console.log(`  uploaded ${entry.storageId} -> ${result.public_id}`);
}

await writeFile(join(root, "cloudinary-map.json"), JSON.stringify(mapping, null, 2));
console.log(`\n${Object.keys(mapping).length} assets in Cloudinary.`);
console.log(`Mapping written to ${join(root, "cloudinary-map.json")}.`);
console.log("Next: node --env-file=.env.local scripts/reseed-convex.mjs " + root);
