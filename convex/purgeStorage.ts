import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// Post-migration cleanup. Every image and video now lives in Cloudinary, so
// the files left in Convex file storage are unreferenced and only consume the
// free-tier quota. These are internal functions, run deliberately with
// `npx convex run --prod`, never reachable from the browser.

export const count = internalQuery({
  args: {},
  handler: async (ctx) => {
    const files = await ctx.db.system.query("_storage").collect();
    return {
      files: files.length,
      bytes: files.reduce((sum, f) => sum + f.size, 0),
    };
  },
});

// Deletes in bounded batches so a large storage set can't blow the mutation's
// transaction limits; re-run until it reports 0 remaining.
export const purge = internalMutation({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 100 }) => {
    const files = await ctx.db.system.query("_storage").take(limit);
    for (const file of files) {
      await ctx.storage.delete(file._id);
    }
    const remaining = (await ctx.db.system.query("_storage").take(1)).length;
    return { deleted: files.length, moreRemaining: remaining > 0 };
  },
});
