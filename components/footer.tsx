"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, ArrowUpRight } from "lucide-react";
import { buildWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/contact";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/contact-us", label: "Contact Us" },
];

const locations = [
  {
    city: "Port Harcourt",
    address:
      "3A Aggrey Road, opposite UBA Bank, by Lagos Bus Stop, Port Harcourt, Rivers State.",
  },
  {
    city: "Lekki / Ajah",
    address:
      "Shop B9, Road 2, Ikota Shopping Complex, VGC, Lekki/Ajah, Lagos State.",
  },
];

const phones = ["08033591663", "08035720060"];

export type FooterContact = {
  facebookUrl?: string;
  instagramUrl?: string;
} | null;

export function Footer({ contact }: { contact?: FooterContact }) {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const facebookUrl = contact?.facebookUrl || FACEBOOK_URL;
  const instagramUrl = contact?.instagramUrl || INSTAGRAM_URL;

  return (
    <footer className="relative overflow-hidden border-t border-rule bg-paper-deep">
      {/* Closing statement — the footer opens with the brand line at scale
          rather than starting cold with a link column. */}
      <div className="mx-auto max-w-6xl px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Kambest Health Solutions</span>
            <p className="mt-6 text-title text-balance">
              Rooted in nature.
              <br />
              <span className="text-primary">Proven in results.</span>
            </p>
          </div>
          <Button
            size="xl"
            className="shrink-0"
            render={
              <a
                href={buildWhatsAppLink(
                  WHATSAPP_NUMBER,
                  "Hi KAMBEST, I'd like to know more about your herbal products.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <WhatsAppIcon className="size-5" />
            Chat with us
          </Button>
        </div>

        <hr className="rule mt-16" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Image
            src="/logo_v1.webp"
            alt="Kambest"
            width={130}
            height={36}
            className="h-10 w-auto rounded-full"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Generations of Nigerian tradomedical knowledge, prepared with modern
            care and delivered with genuine follow-up.
          </p>
          <div className="mt-7 flex gap-2">
            <SocialLink
              href={facebookUrl}
              label="Kambest on Facebook"
              icon={<FacebookIcon className="size-5" />}
            />
            <SocialLink
              href={instagramUrl}
              label="Kambest on Instagram"
              icon={<InstagramIcon className="size-5" />}
            />
            <SocialLink
              href={buildWhatsAppLink(
                WHATSAPP_NUMBER,
                "Hi KAMBEST, I'd like to know more about your herbal products.",
              )}
              label="Chat with Kambest on WhatsApp"
              icon={<WhatsAppIcon className="size-5" />}
            />
          </div>
        </div>

        {/* Navigate */}
        <div className="lg:col-span-2">
          <h3 className="text-eyebrow uppercase text-muted-foreground">
            Navigate
          </h3>
          <ul className="mt-6 space-y-3.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="link-underline font-semibold text-foreground/80 transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Locations */}
        <div className="lg:col-span-3">
          <h3 className="text-eyebrow uppercase text-muted-foreground">
            Visit us
          </h3>
          <ul className="mt-6 space-y-6 text-sm">
            {locations.map((loc) => (
              <li key={loc.city}>
                <div className="flex items-center gap-2 font-bold">
                  <MapPin className="size-3.5 text-primary" />
                  {loc.city}
                </div>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">
                  {loc.address}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3">
          <h3 className="text-eyebrow uppercase text-muted-foreground">
            Get in touch
          </h3>
          <ul className="mt-6 space-y-3.5 text-sm">
            {phones.map((phone) => (
              <li key={phone}>
                <a
                  href={`tel:${phone}`}
                  className="group inline-flex items-center gap-2 font-semibold text-foreground/80 transition-colors hover:text-primary"
                >
                  <Phone className="size-3.5 text-primary" />
                  {phone}
                </a>
              </li>
            ))}
            <li>
              <a
                href={buildWhatsAppLink(
                  WHATSAPP_NUMBER,
                  "Hi KAMBEST, I'd like to know more about your herbal products.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                <WhatsAppIcon className="size-3.5 text-primary" />
                Chat on WhatsApp
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-7 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <span>© {year} Kambest Health Solutions. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            {!isDashboard && (
              <Link href="/admin-access" className="hover:text-primary">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-11 items-center justify-center rounded-full text-muted-foreground ring-1 ring-rule transition-colors duration-300 hover:bg-primary hover:text-primary-foreground hover:ring-primary"
    >
      {icon}
    </Link>
  );
}
