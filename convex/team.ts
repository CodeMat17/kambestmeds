import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const MAX_ITEMS = 4;

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("teamMembers").withIndex("by_order").order("asc").collect();
    return await Promise.all(
      items.map(async (item) => ({
        ...item,
        photoUrl: await ctx.storage.getUrl(item.storageId),
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
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const count = (await ctx.db.query("teamMembers").collect()).length;
    if (count >= MAX_ITEMS) {
      throw new Error(`Maximum of ${MAX_ITEMS} team members reached.`);
    }

    const last = await ctx.db.query("teamMembers").withIndex("by_order").order("desc").first();
    const order = last ? last.order + 1 : 0;
    return await ctx.db.insert("teamMembers", { ...args, order });
  },
});

export const remove = mutation({
  args: { id: v.id("teamMembers") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) return;
    await ctx.db.delete(id);
    await ctx.storage.delete(existing.storageId);
  },
});
