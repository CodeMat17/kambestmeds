import "server-only";
import { unstable_cache } from "next/cache";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

// Every public page reads its content from Convex. Without a cache in front,
// each visitor request would be a fresh Convex function call (plus a signed
// storage URL per image), which is what pushes a low-traffic marketing site
// past the free-tier quota. These wrappers collapse all traffic down to at
// most one Convex call per tag per SITE_REVALIDATE window, and the dashboard
// invalidates the relevant tag on save so edits still appear immediately.

export const SITE_REVALIDATE = 3600;

export const CACHE_TAGS = {
  products: "products",
  home: "home",
  labMedia: "lab-media",
  team: "team",
  contact: "contact",
  content: "site-content",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export const getProducts = unstable_cache(
  () => fetchQuery(api.products.list, {}),
  ["products-list"],
  { tags: [CACHE_TAGS.products], revalidate: SITE_REVALIDATE }
);

export const getHomeContent = unstable_cache(
  () => fetchQuery(api.home.get, {}),
  ["home-content"],
  { tags: [CACHE_TAGS.home], revalidate: SITE_REVALIDATE }
);

export const getLabMedia = unstable_cache(
  () => fetchQuery(api.labMedia.list, {}),
  ["lab-media-list"],
  { tags: [CACHE_TAGS.labMedia], revalidate: SITE_REVALIDATE }
);

export const getTeam = unstable_cache(
  () => fetchQuery(api.team.list, {}),
  ["team-list"],
  { tags: [CACHE_TAGS.team], revalidate: SITE_REVALIDATE }
);

export const getContactInfo = unstable_cache(
  () => fetchQuery(api.contactInfo.get, {}),
  ["contact-info"],
  { tags: [CACHE_TAGS.contact], revalidate: SITE_REVALIDATE }
);

type ContentKey = "about-us" | "terms" | "privacy";

export const getSiteContent = unstable_cache(
  (key: ContentKey) => fetchQuery(api.content.get, { key }),
  ["site-content"],
  { tags: [CACHE_TAGS.content], revalidate: SITE_REVALIDATE }
);
