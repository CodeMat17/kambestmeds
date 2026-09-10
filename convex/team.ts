import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { mediaValidator } from "./lib/media";

export const MAX_ITEMS = 4;

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teamMembers").withIndex("by_order").order("asc").collect();
  },
});

export const create = mutation({
  args: { photo: mediaValidator },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // take(MAX_ITEMS) reads at most the cap instead of scanning the
    // whole table on every create.
    const count = (await ctx.db.query("teamMembers").take(MAX_ITEMS)).length;
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
    if (!existing) return { orphaned: null };
    await ctx.db.delete(id);
    return { orphaned: existing.photo };
  },
});
