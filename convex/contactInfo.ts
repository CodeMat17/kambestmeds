import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

const addressItem = v.object({ city: v.string(), text: v.string() });

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("contactInfo")
      .withIndex("by_key", (q) => q.eq("key", "contact"))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    addresses: v.array(addressItem),
    phoneNumbers: v.array(v.string()),
    email: v.optional(v.string()),
    facebookUrl: v.string(),
    whatsappNumber: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("contactInfo")
      .withIndex("by_key", (q) => q.eq("key", "contact"))
      .unique();

    if (!existing) {
      await ctx.db.insert("contactInfo", { key: "contact", ...args });
      return;
    }

    await ctx.db.patch(existing._id, args);
  },
});
