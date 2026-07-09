import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

const featureItem = v.object({ title: v.string(), body: v.string() });
const testimonialItem = v.object({
  quote: v.string(),
  name: v.string(),
  place: v.string(),
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const doc = await ctx.db
      .query("homeContent")
      .withIndex("by_key", (q) => q.eq("key", "home"))
      .unique();
    if (!doc) return null;
    return {
      ...doc,
      heroImageUrl: doc.heroImageId
        ? await ctx.storage.getUrl(doc.heroImageId)
        : null,
    };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const upsert = mutation({
  args: {
    heroBadge: v.optional(v.string()),
    heroTitle: v.optional(v.string()),
    heroSubtitle: v.optional(v.string()),
    heroImageId: v.optional(v.id("_storage")),
    whyTitle: v.optional(v.string()),
    whySubtitle: v.optional(v.string()),
    features: v.optional(v.array(featureItem)),
    productsTitle: v.optional(v.string()),
    productsSubtitle: v.optional(v.string()),
    testimonialsTitle: v.optional(v.string()),
    testimonials: v.optional(v.array(testimonialItem)),
    ctaTitle: v.optional(v.string()),
    ctaSubtitle: v.optional(v.string()),
    ctaWhatsappMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("homeContent")
      .withIndex("by_key", (q) => q.eq("key", "home"))
      .unique();

    if (!existing) {
      await ctx.db.insert("homeContent", {
        key: "home",
        heroBadge: args.heroBadge ?? "",
        heroTitle: args.heroTitle ?? "",
        heroSubtitle: args.heroSubtitle ?? "",
        heroImageId: args.heroImageId,
        whyTitle: args.whyTitle ?? "",
        whySubtitle: args.whySubtitle ?? "",
        features: args.features ?? [],
        productsTitle: args.productsTitle ?? "",
        productsSubtitle: args.productsSubtitle ?? "",
        testimonialsTitle: args.testimonialsTitle ?? "",
        testimonials: args.testimonials ?? [],
        ctaTitle: args.ctaTitle ?? "",
        ctaSubtitle: args.ctaSubtitle ?? "",
        ctaWhatsappMessage: args.ctaWhatsappMessage ?? "",
      });
      return;
    }

    const { heroImageId, ...rest } = args;
    await ctx.db.patch(existing._id, {
      ...rest,
      ...(heroImageId ? { heroImageId } : {}),
    });

    if (heroImageId && existing.heroImageId && existing.heroImageId !== heroImageId) {
      await ctx.storage.delete(existing.heroImageId);
    }
  },
});
