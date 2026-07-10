/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as contactInfo from "../contactInfo.js";
import type * as content from "../content.js";
import type * as home from "../home.js";
import type * as images from "../images.js";
import type * as labMedia from "../labMedia.js";
import type * as lib_auth from "../lib/auth.js";
import type * as products from "../products.js";
import type * as team from "../team.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  contactInfo: typeof contactInfo;
  content: typeof content;
  home: typeof home;
  images: typeof images;
  labMedia: typeof labMedia;
  "lib/auth": typeof lib_auth;
  products: typeof products;
  team: typeof team;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
