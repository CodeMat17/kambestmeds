import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { mediaValidator } from "./lib/media";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // No per-item storage URL lookups any more: the Cloudinary pointer stored
    // on the document is enough for the caller to build a delivery URL.
    return await ctx.db.query("products").withIndex("by_order").order("asc").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    cures: v.string(),
    instructions: v.optional(v.string()),
    amount: v.string(),
    image: mediaValidator,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    // Newest first: sit one slot ahead of the current head rather than
    // renumbering every row. `order` is free to go negative.
    const first = await ctx.db.query("products").withIndex("by_order").order("asc").first();
    const order = first ? first.order - 1 : 0;
    return await ctx.db.insert("products", { ...args, order });
  },
});

// Mutations can't reach Cloudinary, so any asset the write orphans is returned
// to the caller, which deletes it through the `destroyAsset` Server Action.
export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    cures: v.string(),
    instructions: v.optional(v.string()),
    amount: v.string(),
    image: v.optional(mediaValidator),
  },
  handler: async (ctx, { id, image, ...rest }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Product not found.");

    await ctx.db.patch(id, { ...rest, ...(image ? { image } : {}) });

    if (image && existing.image.publicId !== image.publicId) {
      return { orphaned: existing.image };
    }
    return { orphaned: null };
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) return { orphaned: null };
    await ctx.db.delete(id);
    return { orphaned: existing.image };
  },
});
