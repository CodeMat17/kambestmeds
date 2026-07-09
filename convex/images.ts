"use node";

import { v } from "convex/values";
import { Jimp, JimpMime } from "jimp";
import { action } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

const MAX_BYTES = 150 * 1024;
const MAX_DIMENSION = 1600;
const MIN_DIMENSION = 480;

// Re-encodes an uploaded image as JPEG, shrinking quality/size until it
// fits under MAX_BYTES so product images never slow the page down. Uses
// a pure-JS codec (no native binaries) so it bundles reliably as a Convex
// Node action regardless of the deployment's runtime platform.
export const optimizeUpload = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    await requireAdmin(ctx);

    const blob = await ctx.storage.get(storageId);
    if (!blob) throw new Error("Uploaded file not found.");
    const input = Buffer.from(await blob.arrayBuffer());

    const original = await Jimp.read(input);

    let width = Math.min(original.bitmap.width, MAX_DIMENSION);
    let quality = 80;

    async function render(w: number, q: number) {
      const clone = original.clone().resize({ w });
      return await clone.getBuffer(JimpMime.jpeg, { quality: q });
    }

    let output = await render(width, quality);

    while (output.byteLength > MAX_BYTES && (quality > 30 || width > MIN_DIMENSION)) {
      if (quality > 30) {
        quality -= 10;
      } else {
        width = Math.round(width * 0.85);
      }
      output = await render(width, quality);
    }

    const optimizedId = await ctx.storage.store(
      new Blob([new Uint8Array(output)], { type: "image/jpeg" })
    );

    await ctx.storage.delete(storageId);

    return optimizedId;
  },
});
