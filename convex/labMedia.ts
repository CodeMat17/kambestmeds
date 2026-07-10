import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const MAX_ITEMS = 8;

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("labMedia").withIndex("by_order").order("asc").collect();
    return await Promise.all(
      items.map(async (item) => ({
        ...item,
        mediaUrl: await ctx.storage.getUrl(item.storageId),
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
    storageId: v.id("_storage"),
    type: v.union(v.literal("image"), v.literal("video")),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const count = (await ctx.db.query("labMedia").collect()).length;
    if (count >= MAX_ITEMS) {
      throw new Error(`Maximum of ${MAX_ITEMS} lab gallery items reached.`);
    }

    const last = await ctx.db.query("labMedia").withIndex("by_order").order("desc").first();
    const order = last ? last.order + 1 : 0;
    return await ctx.db.insert("labMedia", { ...args, order });
  },
});

export const remove = mutation({
  args: { id: v.id("labMedia") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) return;
    await ctx.db.delete(id);
    await ctx.storage.delete(existing.storageId);
  },
});
