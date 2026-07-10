"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
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
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/contact-us", label: "Contact Us" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg">
          <Image src="/logo_v1.webp" alt="Kambest logo" width={130} height={36} className="rounded-full" priority />
         
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === l.href ? "text-primary" : "text-foreground/80"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Show when="signed-in">
            <UserButton />
          </Show>
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="size-5" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>
                    <Image src="/logo_v1.webp" alt="Kambest logo" width={130} height={36} className="rounded-full" priority />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4">
                  {links.map((l) => (
                    <SheetClose
                      key={l.href}
                      render={
                        <Link
                          href={l.href}
                          className={cn(
                            "rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname === l.href ? "text-primary" : "text-foreground/80"
                          )}
                        >
                          {l.label}
                        </Link>
                      }
                    />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
