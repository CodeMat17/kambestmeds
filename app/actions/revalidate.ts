"use server";

import { updateTag } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { CACHE_TAGS, type CacheTag } from "@/lib/site-data";

const VALID_TAGS = new Set<string>(Object.values(CACHE_TAGS));

// Public pages read Convex through a long-lived cache (see lib/site-data.ts).
// The dashboard calls this after a successful save so an edit is visible right
// away instead of waiting out the revalidate window.
export async function revalidateSite(tag: CacheTag) {
  const { userId } = await auth();
  if (!userId) return;
  if (!VALID_TAGS.has(tag)) return;
  updateTag(tag);
}
