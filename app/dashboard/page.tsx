"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import {
  Home,
  Package,
  Info,
  FileText,
  ShieldCheck,
  Phone,
  ArrowRight,
  Sparkles,
  Images,
  UsersRound,
} from "lucide-react";

const quickLinks = [
  {
    href: "/dashboard/home",
    label: "Home Page",
    description: "Edit the hero, features, testimonials, and CTA on the homepage.",
    icon: Home,
  },
  {
    href: "/dashboard/products",
    label: "Products",
    description: "Add, edit, or remove products shown on the storefront.",
    icon: Package,
  },
  {
    href: "/dashboard/lab",
    label: "Lab Gallery",
    description: "Manage the photos and videos shown in the lab gallery.",
    icon: Images,
  },
  {
    href: "/dashboard/team",
    label: "Our Team",
    description: "Manage the team member photos shown on the site.",
    icon: UsersRound,
  },
  {
    href: "/dashboard/about-us",
    label: "About Us",
    description: "Update the story and image on the About page.",
    icon: Info,
  },
  {
    href: "/dashboard/contact-us",
    label: "Contact Us",
    description: "Manage addresses, phone numbers, email, and social links.",
    icon: Phone,
  },
  {
    href: "/dashboard/terms",
    label: "Terms",
    description: "Edit the Terms & Conditions content.",
    icon: FileText,
  },
  {
    href: "/dashboard/privacy",
    label: "Privacy",
    description: "Edit the Privacy Policy content.",
    icon: ShieldCheck,
  },
];

export default function DashboardPage() {
  const products = useQuery(api.products.list);

  const productCount = products?.length ?? null;

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="size-4" />
          Welcome back
        </div>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          Let&apos;s keep the site up to date
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          This is your control center for KamBest. From here you can manage
          the products customers see, and keep your About, Terms, and
          Privacy pages current. Pick a section below to get started.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="gap-2 p-4">
          <p className="text-sm text-muted-foreground">Total products</p>
          <p className="text-3xl font-extrabold">
            {productCount === null ? "—" : productCount}
          </p>
        </Card>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold">Manage your site</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group">
              <Card className="h-full gap-3 p-5 transition-colors group-hover:border-primary/50 group-hover:bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <link.icon className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <h4 className="font-semibold">{link.label}</h4>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
