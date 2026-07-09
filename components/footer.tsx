"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { buildWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { FACEBOOK_URL } from "@/lib/contact";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { AdminAccessDialog } from "@/components/admin-access-dialog";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/contact-us", label: "Contact Us" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <footer className='border-t border-border/60 bg-secondary/40'>
      <div className='mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4'>
        <div>
          <Image
            src='/logo_v1.webp'
            alt='Kambest logo'
            width={130}
            height={36}
            className='rounded-full'
          />
         
          <p className='mt-3 text-sm text-muted-foreground'>
            Natural healing, real results. Trusted herbal solutions — rooted in
            nature, proven in results.
          </p>
          <Link
            href={FACEBOOK_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Kambest on Facebook'
            className='mt-4 inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground'>
            <FacebookIcon className='size-10' />
          </Link>
        </div>

        <div>
          <div className='text-sm font-bold uppercase tracking-wide text-foreground/70'>
            Quick Links
          </div>
          <ul className='mt-3 space-y-2 text-sm'>
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className='text-muted-foreground hover:text-primary'>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className='text-sm font-bold uppercase tracking-wide text-foreground/70'>
            Visit Us
          </div>
          <ul className='mt-3 space-y-3 text-sm text-muted-foreground'>
            <li className='flex gap-2'>
              <MapPin className='mt-0.5 size-4 shrink-0 text-primary' />
              3A Aggrey Road, opposite UBA Bank, by Lagos Bus Stop, Port
              Harcourt, Rivers State.
            </li>
            <li className='flex gap-2'>
              <MapPin className='mt-0.5 size-4 shrink-0 text-primary' />
              Shop B9, Road 2, Ikota Shopping Complex, VGC, Lekki/Ajah, Lagos
              State.
            </li>
          </ul>
        </div>

        <div>
          <div className='text-sm font-bold uppercase tracking-wide text-foreground/70'>
            Get In Touch
          </div>
          <ul className='mt-3 space-y-3 text-sm text-muted-foreground'>
            <li className='flex gap-2'>
              <Phone className='mt-0.5 size-4 shrink-0 text-primary' />
              <a href='tel:08033591663' className='hover:text-primary'>
                08033591663
              </a>
            </li>
            <li className='flex gap-2'>
              <Phone className='mt-0.5 size-4 shrink-0 text-primary' />
              <a href='tel:08035720060' className='hover:text-primary'>
                08035720060
              </a>
            </li>
            <li className='flex gap-2'>
              <WhatsAppIcon className='mt-0.5 size-4 shrink-0 text-primary' />
              <a
                href={buildWhatsAppLink(
                  WHATSAPP_NUMBER,
                  "Hi KAMBEST, I'd like to know more about your herbal products.",
                )}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-primary'>
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className='border-t border-border/60 px-4 py-5 sm:px-6'>
        <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row'>
          <span>© {year} Kambest Health Solutions. All rights reserved.</span>
          <div className='flex gap-4'>
            <Link href='/privacy' className='hover:text-primary'>
              Privacy
            </Link>
            <Link href='/terms' className='hover:text-primary'>
              Terms
            </Link>
            {!isDashboard && (
              <AdminAccessDialog>
                <button type='button' className='hover:text-primary'>
                  Admin
                </button>
              </AdminAccessDialog>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
