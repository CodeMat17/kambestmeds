"use server";

import { revalidatePath, updateTag } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { CACHE_TAGS, type CacheTag } from "@/lib/site-data";

const VALID_TAGS = new Set<string>(Object.values(CACHE_TAGS));

// `updateTag` only expires the cached Convex read (lib/site-data.ts). The
// public pages are prerendered with `export const revalidate = 3600`, and that
// full-route cache entry is not tagged, so without an explicit revalidatePath
// visitors keep getting the stale HTML for up to an hour after a dashboard
// edit. Every page that reads a tag has to be listed here.
const TAG_PATHS: Record<CacheTag, string[]> = {
  [CACHE_TAGS.products]: ["/", "/products"],
  [CACHE_TAGS.home]: ["/"],
  [CACHE_TAGS.labMedia]: ["/"],
  [CACHE_TAGS.team]: ["/about-us"],
  // Contact details render in the root layout, so they reach every page.
  [CACHE_TAGS.contact]: [],
  [CACHE_TAGS.content]: ["/about-us", "/terms", "/privacy"],
};

// Public pages read Convex through a long-lived cache (see lib/site-data.ts).
// The dashboard calls this after a successful save so an edit is visible right
// away instead of waiting out the revalidate window.
export async function revalidateSite(tag: CacheTag) {
  const { userId } = await auth();
  if (!userId) return;
  if (!VALID_TAGS.has(tag)) return;

  updateTag(tag);

  if (tag === CACHE_TAGS.contact) {
    revalidatePath("/", "layout");
    return;
  }
  for (const path of TAG_PATHS[tag]) revalidatePath(path);
}
