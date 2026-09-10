"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Show, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { buildWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact-us", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The home hero is a full-bleed dark photograph, so the bar floats over it
  // in white until the first scroll, then settles onto paper.
  const hasHero = pathname === "/";
  const overlay = hasHero && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500",
        overlay
          ? "border-b border-white/10 bg-transparent"
          : "border-b border-rule bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/65",
      )}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-3 px-5 sm:gap-6 sm:px-8">
        <Link
          href="/"
          aria-label="Kambest — home"
          className="flex shrink-0 items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo_v1.webp"
            alt="Kambest"
            width={130}
            height={36}
            className={cn(
              "h-8 w-auto rounded-full transition-all duration-500 sm:h-9",
              overlay && "brightness-0 invert",
            )}
            preload
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "link-underline relative py-1 text-[0.8125rem] font-bold uppercase tracking-[0.14em] transition-colors",
                  overlay
                    ? "text-white/75 hover:text-white"
                    : active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
                {active && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full",
                      overlay ? "bg-white" : "bg-primary",
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Show when="signed-in">
            <UserButton />
          </Show>

          <ThemeToggle className={cn(overlay && "text-white hover:bg-white/15")} />

          <Button
            size="pill"
            variant={overlay ? "on-dark" : "default"}
            className="ml-1 hidden lg:inline-flex"
            render={
              <a
                href={buildWhatsAppLink(
                  WHATSAPP_NUMBER,
                  "Hi KAMBEST, I'd like to speak with a herbal consultant.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Speak to a consultant
          </Button>

          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    aria-label="Open menu"
                    className={cn(overlay && "text-white hover:bg-white/15")}
                  >
                    <Menu className="size-5" />
                  </Button>
                }
              />
              <SheetContent
                side="right"
                showCloseButton={false}
                className="flex h-dvh w-full flex-col border-l-rule bg-background p-0 sm:max-w-sm"
              >
                <SheetHeader className="flex-row items-center justify-between border-b border-rule px-5 py-4">
                  <SheetTitle className="flex items-center">
                    <Image
                      src="/logo_v1.webp"
                      alt="Kambest"
                      width={130}
                      height={36}
                      className="h-9 w-auto rounded-full"
                    />
                  </SheetTitle>
                  <SheetClose
                    render={
                      <Button variant="ghost" size="icon-lg" aria-label="Close menu">
                        <X className="size-5" />
                      </Button>
                    }
                  />
                </SheetHeader>

                <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-4">
                  {links.map((l, i) => {
                    const active =
                      l.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(l.href);
                    return (
                      <SheetClose
                        key={l.href}
                        render={
                          <Link
                            href={l.href}
                            className={cn(
                              "group flex items-baseline justify-between border-b border-rule py-5 transition-colors",
                              active
                                ? "text-primary"
                                : "text-foreground hover:text-primary",
                            )}
                          >
                            <span className="flex items-baseline gap-4">
                              <span className="text-eyebrow text-muted-foreground">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="text-subtitle">{l.label}</span>
                            </span>
                            <ArrowUpRight className="size-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        }
                      />
                    );
                  })}

                  <Button
                    size="xl"
                    className="mt-8 w-full"
                    render={
                      <a
                        href={buildWhatsAppLink(
                          WHATSAPP_NUMBER,
                          "Hi KAMBEST, I'd like to speak with a herbal consultant.",
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    Speak to a consultant
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
