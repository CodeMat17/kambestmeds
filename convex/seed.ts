import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { mediaValidator } from "./lib/media";

// Restore path for the Cloudinary migration. This is an internalMutation, so
// it is unreachable from the browser and needs no Clerk identity — it is run
// deliberately from a trusted machine with `npx convex run`.
//
// Every table is replaced wholesale, which makes the migration re-runnable:
// running it twice produces the same database rather than duplicate rows.
export const restore = internalMutation({
  args: {
    products: v.array(
      v.object({
        name: v.string(),
        cures: v.string(),
        instructions: v.optional(v.string()),
        amount: v.string(),
        image: mediaValidator,
        order: v.number(),
      })
    ),
    labMedia: v.array(
      v.object({
        media: mediaValidator,
        caption: v.optional(v.string()),
        order: v.number(),
      })
    ),
    teamMembers: v.array(
      v.object({ photo: mediaValidator, order: v.number() })
    ),
    home: v.optional(v.any()),
    contactInfo: v.optional(v.any()),
    siteContent: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    async function clear(table: "products" | "labMedia" | "teamMembers" | "homeContent" | "contactInfo" | "siteContent") {
      const rows = await ctx.db.query(table).collect();
      for (const row of rows) await ctx.db.delete(row._id);
    }

    await clear("products");
    for (const product of args.products) await ctx.db.insert("products", product);

    await clear("labMedia");
    for (const item of args.labMedia) await ctx.db.insert("labMedia", item);

    await clear("teamMembers");
    for (const member of args.teamMembers) await ctx.db.insert("teamMembers", member);

    await clear("homeContent");
    if (args.home) await ctx.db.insert("homeContent", { ...args.home, key: "home" });

    await clear("contactInfo");
    if (args.contactInfo) {
      await ctx.db.insert("contactInfo", { ...args.contactInfo, key: "contact" });
    }

    await clear("siteContent");
    for (const doc of args.siteContent) await ctx.db.insert("siteContent", doc);

    return {
      products: args.products.length,
      labMedia: args.labMedia.length,
      teamMembers: args.teamMembers.length,
      siteContent: args.siteContent.length,
    };
  },
});
