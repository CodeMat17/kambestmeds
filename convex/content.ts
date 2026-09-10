import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { mediaValidator } from "./lib/media";

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
    return await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    key: contentKey,
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    heroImage: v.optional(mediaValidator),
    quote: v.optional(v.string()),
    quoteAuthor: v.optional(v.string()),
    values: v.optional(v.array(valueItem)),
    richText: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    { key, title, body, heroImage, quote, quoteAuthor, values, richText }
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
        heroImage,
        quote,
        quoteAuthor,
        values,
      });
      return { orphaned: null };
    }

    await ctx.db.patch(existing._id, {
      ...(title !== undefined ? { title } : {}),
      ...(cleanBody !== undefined ? { body: cleanBody } : {}),
      ...(heroImage ? { heroImage } : {}),
      ...(quote !== undefined ? { quote } : {}),
      ...(quoteAuthor !== undefined ? { quoteAuthor } : {}),
      ...(values !== undefined ? { values } : {}),
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
