import type { Metadata } from "next";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { MapPin, Phone, Navigation } from "lucide-react";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { staggerChildren, fadeUp } from "@/lib/motion";
import { buildWhatsAppLink, WHATSAPP_NUMBER as FALLBACK_WHATSAPP_NUMBER } from "@/lib/whatsapp";
import {
  ADDRESSES as FALLBACK_ADDRESSES,
  PHONE_NUMBERS as FALLBACK_PHONE_NUMBERS,
  CONTACT_EMAIL as FALLBACK_CONTACT_EMAIL,
  FACEBOOK_URL as FALLBACK_FACEBOOK_URL,
} from "@/lib/contact";
import { api } from "@/convex/_generated/api";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach KAMBEST Tradomedical Center in Port Harcourt or Lekki/Ajah, Lagos. Call, WhatsApp, or email us — we're here to help with your herbal wellness journey.",
};

export default async function ContactUsPage() {
  const contact = await fetchQuery(api.contactInfo.get, {});

  const ADDRESSES = contact?.addresses.length ? contact.addresses : FALLBACK_ADDRESSES;
  const PHONE_NUMBERS = contact?.phoneNumbers.length ? contact.phoneNumbers : FALLBACK_PHONE_NUMBERS;
  const CONTACT_EMAIL = contact?.email || FALLBACK_CONTACT_EMAIL;
  const FACEBOOK_URL = contact?.facebookUrl || FALLBACK_FACEBOOK_URL;
  const WHATSAPP_NUMBER = contact?.whatsappNumber || FALLBACK_WHATSAPP_NUMBER;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "KAMBEST Tradomedical Center",
    image: "https://www.kambestmeds.com/about1.webp",
    telephone: PHONE_NUMBERS,
    ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
    address: ADDRESSES.map((a) => ({
      "@type": "PostalAddress",
      streetAddress: a.text,
      addressLocality: a.city,
      addressCountry: "NG",
    })),
    sameAs: [FACEBOOK_URL],
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Reveal className="text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          We&rsquo;d love to hear from you — reach out for orders, enquiries, or
          herbal guidance.
        </p>
      </Reveal>

      <div className="mt-10 flex justify-center">
        <Button
          size="lg"
          className="h-12 gap-2 bg-[#25D366] px-8 text-base text-white hover:bg-[#1ebd5a]"
          render={
            <a
              href={buildWhatsAppLink(WHATSAPP_NUMBER, "Hi KAMBEST, I'd like to get in touch.")}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <WhatsAppIcon className="size-5" />
          Chat on WhatsApp
        </Button>
      </div>

      <Reveal
        variants={staggerChildren}
        className="mt-12 grid gap-5 sm:grid-cols-2"
      >
        {ADDRESSES.map((a) => (
          <Reveal key={a.city} variants={fadeUp}>
            <Card className="h-full gap-3 p-6">
              <div className="flex items-center gap-2 font-bold">
                <MapPin className="size-5 text-primary" />
                {a.city}
              </div>
              <p className="text-sm text-muted-foreground">{a.text}</p>
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                <Navigation className="size-4" /> Get Directions
              </Link>
            </Card>
          </Reveal>
        ))}
      </Reveal>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <Reveal className="space-y-4">
          <h2 className="text-xl font-extrabold">Reach Us Directly</h2>
          <ul className="space-y-3 text-sm">
            {PHONE_NUMBERS.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <Phone className="size-4 text-primary" />
                <a href={`tel:${p}`} className="hover:text-primary">{p}</a>
              </li>
            ))}
            <li className="flex items-center gap-3">
              <FacebookIcon className="size-4 text-primary" />
              <Link href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                Follow us on Facebook
              </Link>
            </li>
          </ul>
        </Reveal>

        <Reveal variants={fadeUp} delay={0.1}>
          <Card className="p-6">
            <h2 className="text-xl font-extrabold">Send a Message</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We&rsquo;ll respond via WhatsApp — no email needed.
            </p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
