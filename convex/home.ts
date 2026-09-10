import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { mediaValidator } from "./lib/media";

const featureItem = v.object({ title: v.string(), body: v.string() });
const testimonialItem = v.object({
  quote: v.string(),
  name: v.string(),
  place: v.string(),
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    // The document already carries the Cloudinary pointer, so there is no
    // signed-storage-URL round trip to make here.
    return await ctx.db
      .query("homeContent")
      .withIndex("by_key", (q) => q.eq("key", "home"))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    heroBadge: v.optional(v.string()),
    heroTitle: v.optional(v.string()),
    heroSubtitle: v.optional(v.string()),
    heroImage: v.optional(mediaValidator),
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
        heroImage: args.heroImage,
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
      return { orphaned: null };
    }

    const { heroImage, ...rest } = args;
    await ctx.db.patch(existing._id, {
      ...rest,
      ...(heroImage ? { heroImage } : {}),
    });

    // Convex can't call Cloudinary; the replaced asset goes back to the caller,
    // which deletes it via the `destroyAsset` Server Action.
    if (
      heroImage &&
      existing.heroImage &&
      existing.heroImage.publicId !== heroImage.publicId
    ) {
      return { orphaned: existing.heroImage };
    }
    return { orphaned: null };
  },
});
