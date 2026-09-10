import { v } from "convex/values";

// Media itself lives in Cloudinary (see lib/cloudinary.ts). Convex keeps only
// this pointer so the free-tier file-storage and bandwidth quotas aren't spent
// on photos and videos.
export const mediaValidator = v.object({
  publicId: v.string(),
  version: v.number(),
  format: v.string(),
  resourceType: v.union(v.literal("image"), v.literal("video")),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
});
