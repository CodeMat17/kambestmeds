import { ConvexError } from "convex/values";
import type { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";

const ADMIN_ROLES = ["kambest-admin"];

export async function requireAdmin(
  ctx: QueryCtx | MutationCtx | ActionCtx
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Not authenticated.");
  }

  const role =
    (identity as unknown as { metadata?: { role?: string } }).metadata
      ?.role ?? (identity as unknown as { role?: string }).role;

  if (!role || !ADMIN_ROLES.includes(role)) {
    throw new ConvexError("Not authorized.");
  }

  return identity;
}
