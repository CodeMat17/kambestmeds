import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").withIndex("by_order").order("asc").collect();
    return await Promise.all(
      products.map(async (p) => ({
        ...p,
        imageUrl: await ctx.storage.getUrl(p.imageId),
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    cures: v.string(),
    instructions: v.optional(v.string()),
    amount: v.string(),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const last = await ctx.db.query("products").withIndex("by_order").order("desc").first();
    const order = last ? last.order + 1 : 0;
    return await ctx.db.insert("products", { ...args, order });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    cures: v.string(),
    instructions: v.optional(v.string()),
    amount: v.string(),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { id, imageId, ...rest }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Product not found.");

    await ctx.db.patch(id, {
      ...rest,
      ...(imageId ? { imageId } : {}),
    });

    if (imageId && existing.imageId !== imageId) {
      await ctx.storage.delete(existing.imageId);
    }
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) return;
    await ctx.db.delete(id);
    await ctx.storage.delete(existing.imageId);
  },
});
