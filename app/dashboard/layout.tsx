"use client";

import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Show, UserButton } from "@clerk/nextjs";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/home", label: "Home Page", icon: Home },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/about-us", label: "About Us", icon: Info },
  { href: "/dashboard/contact-us", label: "Contact Us", icon: Phone },
  { href: "/dashboard/terms", label: "Terms", icon: FileText },
  { href: "/dashboard/privacy", label: "Privacy", icon: ShieldCheck },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className='mx-auto max-w-6xl px-4 py-10 sm:px-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-extrabold'>Admin Dashboard</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Manage products and site pages for KamBest.
          </p>
        </div>
        <div className='hidden sm:flex items-center gap-2'>
          <Show when='signed-in'>
            <UserButton />
          </Show>
          <ThemeToggle />
          <Button variant='outline' size='sm' render={<Link href='/' />}>
            <ArrowLeft className='size-4' />
            Back to Site
          </Button>
        </div>

        <div className='sm:hidden flex items-center gap-2'>
          <Button variant='outline' size='sm' render={<Link href='/' />}>
            <ArrowLeft className='size-4' />
            Back to Site
          </Button>
          <ThemeToggle />
          <Show when='signed-in'>
            <UserButton />
          </Show>
        </div>
      </div>
      <nav className='mt-6 flex flex-wrap gap-2 border-b border-border/60 pb-4'>
        {links.map((l) => {
          const isActive =
            l.href === "/dashboard"
              ? pathname === l.href
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}>
              <l.icon className='size-4' />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className='mt-8'>{children}</div>
    </div>
  );
}
