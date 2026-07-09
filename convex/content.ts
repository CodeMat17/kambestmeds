import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

const contentKey = v.union(
  v.literal("about-us"),
  v.literal("terms"),
  v.literal("privacy")
);

const valueItem = v.object({ title: v.string(), body: v.string() });

// Defense-in-depth: strip dangerous tags/attributes/URIs from rich-text HTML
// before it's persisted. The Tiptap editor's schema already restricts which
// tags can be produced, and the public pages re-sanitize with DOMPurify
// before rendering, but we never trust client input at the storage layer.
function sanitizeHtml(html: string): string {
  return html
    .replace(/<(script|style|iframe|object|embed|link|meta|form)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|iframe|object|embed|link|meta|form)[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*("javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi, "");
}

export const get = query({
  args: { key: contentKey },
  handler: async (ctx, { key }) => {
    const doc = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", key))
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
    key: contentKey,
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    heroImageId: v.optional(v.id("_storage")),
    quote: v.optional(v.string()),
    quoteAuthor: v.optional(v.string()),
    values: v.optional(v.array(valueItem)),
    richText: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    { key, title, body, heroImageId, quote, quoteAuthor, values, richText }
  ) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();

    const cleanBody = body !== undefined && richText ? sanitizeHtml(body) : body;

    if (!existing) {
      await ctx.db.insert("siteContent", {
        key,
        title: title ?? "",
        body: cleanBody ?? "",
        heroImageId,
        quote,
        quoteAuthor,
        values,
      });
      return;
    }

    await ctx.db.patch(existing._id, {
      ...(title !== undefined ? { title } : {}),
      ...(cleanBody !== undefined ? { body: cleanBody } : {}),
      ...(heroImageId ? { heroImageId } : {}),
      ...(quote !== undefined ? { quote } : {}),
      ...(quoteAuthor !== undefined ? { quoteAuthor } : {}),
      ...(values !== undefined ? { values } : {}),
    });

    if (
      heroImageId &&
      existing.heroImageId &&
      existing.heroImageId !== heroImageId
    ) {
      await ctx.storage.delete(existing.heroImageId);
    }
  },
});
