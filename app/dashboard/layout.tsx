"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Package,
  Info,
  FileText,
  ShieldCheck,
  Phone,
  ArrowLeft,
  Images,
  UsersRound,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Show, UserButton } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";

const groups = [
  {
    label: "Overview",
    links: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Storefront",
    links: [
      { href: "/dashboard/home", label: "Home Page", icon: Home },
      { href: "/dashboard/products", label: "Products", icon: Package },
      { href: "/dashboard/lab", label: "Lab Gallery", icon: Images },
      { href: "/dashboard/team", label: "Our Team", icon: UsersRound },
    ],
  },
  {
    label: "Pages",
    links: [
      { href: "/dashboard/about-us", label: "About Us", icon: Info },
      { href: "/dashboard/contact-us", label: "Contact Us", icon: Phone },
      { href: "/dashboard/terms", label: "Terms", icon: FileText },
      { href: "/dashboard/privacy", label: "Privacy", icon: ShieldCheck },
    ],
  },
];

const allLinks = groups.flatMap((g) => g.links);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const current = allLinks.find((l) => isActive(l.href));

  return (
    <ConvexClientProvider>
      <div className="min-h-dvh bg-paper-deep">
        <div className="mx-auto flex w-full max-w-[100rem]">
          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-rule bg-sidebar lg:flex">
            <div className="flex h-16 items-center border-b border-rule px-5">
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/logo_v1.webp"
                  alt="Kambest"
                  width={130}
                  height={36}
                  className="h-8 w-auto rounded-full"
                />
              </Link>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
              {groups.map((group) => (
                <div key={group.label} className="mb-6 last:mb-0">
                  <p className="px-3 pb-2.5 text-eyebrow uppercase text-muted-foreground">
                    {group.label}
                  </p>
                  <ul className="space-y-0.5">
                    {group.links.map((l) => {
                      const active = isActive(l.href);
                      return (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            className={cn(
                              "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                            )}
                          >
                            {active && (
                              <span
                                aria-hidden
                                className="absolute inset-y-1.5 -left-3 w-0.5 rounded-full bg-primary"
                              />
                            )}
                            <l.icon className="size-4 shrink-0" />
                            {l.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="border-t border-rule p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                render={<Link href="/" />}
              >
                <ArrowLeft className="size-4" />
                Back to site
              </Button>
            </div>
          </aside>

          {/* ── Content column ───────────────────────────────────────────── */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-40 border-b border-rule bg-background/85 backdrop-blur-xl">
              <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    aria-label="Open navigation"
                    className="lg:hidden"
                    onClick={() => setNavOpen((o) => !o)}
                  >
                    {navOpen ? (
                      <X className="size-5" />
                    ) : (
                      <Menu className="size-5" />
                    )}
                  </Button>
                  <div className="min-w-0">
                    <p className="text-eyebrow uppercase text-muted-foreground">
                      Admin
                    </p>
                    <h1 className="mt-1 truncate text-base font-extrabold tracking-tight">
                      {current?.label ?? "Dashboard"}
                    </h1>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex lg:hidden"
                    render={<Link href="/" />}
                  >
                    <ArrowLeft className="size-4" />
                    Site
                  </Button>
                  <ThemeToggle />
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </div>
              </div>

              {/* Mobile nav drawer, inline under the bar so it never covers
                  the editor the admin is working in. */}
              {navOpen && (
                <nav className="max-h-[60dvh] overflow-y-auto border-t border-rule px-3 py-4 lg:hidden">
                  {groups.map((group) => (
                    <div key={group.label} className="mb-5 last:mb-0">
                      <p className="px-3 pb-2 text-eyebrow uppercase text-muted-foreground">
                        {group.label}
                      </p>
                      <ul className="space-y-0.5">
                        {group.links.map((l) => {
                          const active = isActive(l.href);
                          return (
                            <li key={l.href}>
                              <Link
                                href={l.href}
                                onClick={() => setNavOpen(false)}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                                  active
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                                )}
                              >
                                <l.icon className="size-4 shrink-0" />
                                {l.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </nav>
              )}
            </header>

            <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ConvexClientProvider>
  );
}
