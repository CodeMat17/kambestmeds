"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Home,
  Package,
  Info,
  FileText,
  ShieldCheck,
  Phone,
  ArrowRight,
  Images,
  UsersRound,
} from "lucide-react";

const quickLinks = [
  {
    href: "/dashboard/home",
    label: "Home Page",
    description: "Hero, features, testimonials and the closing call to action.",
    icon: Home,
  },
  {
    href: "/dashboard/products",
    label: "Products",
    description: "Add, edit or remove the remedies shown on the storefront.",
    icon: Package,
  },
  {
    href: "/dashboard/lab",
    label: "Lab Gallery",
    description: "Photos and videos shown in the lab gallery.",
    icon: Images,
  },
  {
    href: "/dashboard/team",
    label: "Our Team",
    description: "Team member photos shown on the About page.",
    icon: UsersRound,
  },
  {
    href: "/dashboard/about-us",
    label: "About Us",
    description: "The founder story, pull-quote and brand values.",
    icon: Info,
  },
  {
    href: "/dashboard/contact-us",
    label: "Contact Us",
    description: "Addresses, phone numbers, email and social links.",
    icon: Phone,
  },
  {
    href: "/dashboard/terms",
    label: "Terms",
    description: "Terms & conditions content.",
    icon: FileText,
  },
  {
    href: "/dashboard/privacy",
    label: "Privacy",
    description: "Privacy policy content.",
    icon: ShieldCheck,
  },
];

export default function DashboardPage() {
  const products = useQuery(api.products.list);
  const productCount = products?.length ?? null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10">
      {/* Greeting band — quiet, not a marketing hero. */}
      <section className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12">
        <div aria-hidden className="grain absolute inset-0 text-white" />
        <div className="relative max-w-2xl">
          <span className="eyebrow text-primary-foreground/70">
            Kambest admin
          </span>
          <h2 className="mt-5 text-subtitle text-balance">
            Everything customers see, editable from here.
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-primary-foreground/80">
            Changes publish to the live site within the hour. Pick a section
            below to get started.
          </p>
        </div>
      </section>

      {/* Stats — hairline-divided figures rather than boxed cards. */}
      <section>
        <h3 className="text-eyebrow uppercase text-muted-foreground">
          At a glance
        </h3>
        <dl className="mt-5 grid gap-px sm:grid-cols-3">
          <Stat
            label="Products live"
            value={productCount === null ? "—" : String(productCount)}
          />
          <Stat label="Editable pages" value="8" />
          <Stat label="Clinics listed" value="2" />
        </dl>
      </section>

      {/* Sections */}
      <section>
        <h3 className="text-eyebrow uppercase text-muted-foreground">
          Manage your site
        </h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-4 rounded-xl bg-card p-5 shadow-raise ring-1 ring-rule transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <link.icon className="size-5" />
                </span>
                <ArrowRight className="mt-1 size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <div>
                <h4 className="font-extrabold tracking-tight">{link.label}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t-2 border-rule pt-4 sm:pr-8">
      <dt className="text-eyebrow uppercase text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-3xl font-extrabold tracking-tight">{value}</dd>
    </div>
  );
}
