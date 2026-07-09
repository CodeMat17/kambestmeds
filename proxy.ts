import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
    "/not-permitted",
    "/about-us",
    "/contact-us",
    "/privacy",
    "/terms",
  "/products",
  "/admin-access"
]);

const isAdminRoute = createRouteMatcher(["/dashboard", "/dashboard/(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminRoute(req)) {
    const ADMIN_ROLES = [
      "kambest-admin",
    ];
    const role = (sessionClaims?.metadata as { role?: string } | undefined)
      ?.role;

    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.redirect(new URL("/not-permitted", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
