import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    cures: v.string(),
    instructions: v.optional(v.string()),
    amount: v.string(),
    imageId: v.id("_storage"),
    order: v.number(),
  }).index("by_order", ["order"]),

  contactInfo: defineTable({
    key: v.literal("contact"),
    addresses: v.array(v.object({ city: v.string(), text: v.string() })),
    phoneNumbers: v.array(v.string()),
    email: v.optional(v.string()),
    facebookUrl: v.string(),
    instagramUrl: v.optional(v.string()),
    whatsappNumber: v.string(),
  }).index("by_key", ["key"]),

  homeContent: defineTable({
    key: v.literal("home"),
    heroBadge: v.string(),
    heroTitle: v.string(),
    heroSubtitle: v.string(),
    heroImageId: v.optional(v.id("_storage")),
    whyTitle: v.string(),
    whySubtitle: v.string(),
    features: v.array(v.object({ title: v.string(), body: v.string() })),
    productsTitle: v.string(),
    productsSubtitle: v.string(),
    testimonialsTitle: v.string(),
    testimonials: v.array(
      v.object({ quote: v.string(), name: v.string(), place: v.string() })
    ),
    ctaTitle: v.string(),
    ctaSubtitle: v.string(),
    ctaWhatsappMessage: v.string(),
  }).index("by_key", ["key"]),

  labMedia: defineTable({
    storageId: v.id("_storage"),
    type: v.union(v.literal("image"), v.literal("video")),
    caption: v.optional(v.string()),
    order: v.number(),
  }).index("by_order", ["order"]),

  teamMembers: defineTable({
    storageId: v.id("_storage"),
    order: v.number(),
  }).index("by_order", ["order"]),

  siteContent: defineTable({
    key: v.union(
      v.literal("about-us"),
      v.literal("terms"),
      v.literal("privacy")
    ),
    title: v.string(),
    body: v.string(),
    heroImageId: v.optional(v.id("_storage")),
    quote: v.optional(v.string()),
    quoteAuthor: v.optional(v.string()),
    values: v.optional(
      v.array(v.object({ title: v.string(), body: v.string() }))
    ),
  }).index("by_key", ["key"]),
});
