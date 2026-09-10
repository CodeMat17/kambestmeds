import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Navigation, Mail } from "lucide-react";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { Section, PageHeader } from "@/components/section";
import { ContactForm } from "@/components/contact-form";
import { staggerChildren, fadeUp } from "@/lib/motion";
import {
  buildWhatsAppLink,
  WHATSAPP_NUMBER as FALLBACK_WHATSAPP_NUMBER,
} from "@/lib/whatsapp";
import {
  ADDRESSES as FALLBACK_ADDRESSES,
  PHONE_NUMBERS as FALLBACK_PHONE_NUMBERS,
  CONTACT_EMAIL as FALLBACK_CONTACT_EMAIL,
  FACEBOOK_URL as FALLBACK_FACEBOOK_URL,
} from "@/lib/contact";
import { getContactInfo } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach KAMBEST Tradomedical Center in Port Harcourt or Lekki/Ajah, Lagos. Call, WhatsApp, or email us — we're here to help with your herbal wellness journey.",
};

// Must be a literal for Next's static segment-config analysis; keep in sync
// with SITE_REVALIDATE in lib/site-data.ts.
export const revalidate = 3600;

export default async function ContactUsPage() {
  const contact = await getContactInfo();

  const ADDRESSES = contact?.addresses.length
    ? contact.addresses
    : FALLBACK_ADDRESSES;
  const PHONE_NUMBERS = contact?.phoneNumbers.length
    ? contact.phoneNumbers
    : FALLBACK_PHONE_NUMBERS;
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        eyebrow="Contact"
        title="Let's talk about what you need"
        lede="Orders, enquiries, or herbal guidance — reach us however you prefer. WhatsApp is fastest, and a real person always replies."
      >
        <div className="flex flex-wrap gap-3">
          <Button
            size="xl"
            render={
              <a
                href={buildWhatsAppLink(
                  WHATSAPP_NUMBER,
                  "Hi KAMBEST, I'd like to get in touch.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <WhatsAppIcon className="size-5" />
            Chat on WhatsApp
          </Button>
          {PHONE_NUMBERS[0] && (
            <Button
              size="xl"
              variant="outline"
              render={<a href={`tel:${PHONE_NUMBERS[0]}`} />}
            >
              <Phone className="size-4" />
              Call {PHONE_NUMBERS[0]}
            </Button>
          )}
        </div>
      </PageHeader>

      {/* ── Clinics ──────────────────────────────────────────────────────── */}
      <Section className="pb-0 sm:pb-0">
        <Reveal>
          <span className="eyebrow">Our clinics</span>
        </Reveal>

        <Reveal
          variants={staggerChildren}
          className="mt-10 grid gap-px sm:grid-cols-2"
        >
          {ADDRESSES.map((a, i) => (
            <Reveal key={a.city} variants={fadeUp} className="h-full">
              <div className="group flex h-full flex-col gap-5 border-t-2 border-rule pt-7 transition-colors duration-500 hover:border-primary sm:pr-10">
                <span className="text-eyebrow uppercase text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h2 className="flex items-center gap-2 text-subtitle">
                    <MapPin className="size-5 shrink-0 text-primary" />
                    {a.city}
                  </h2>
                  <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">
                    {a.text}
                  </p>
                </div>
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex w-fit items-center gap-2 text-sm font-bold text-primary"
                >
                  <Navigation className="size-4" /> Get directions
                </Link>
              </div>
            </Reveal>
          ))}
        </Reveal>
      </Section>

      {/* ── Direct lines + form ──────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow">Direct lines</span>
            <h2 className="mt-5 text-title text-balance">Reach us directly</h2>
            <p className="mt-6 text-lede text-pretty text-muted-foreground">
              Phone lines are open during clinic hours. WhatsApp is monitored
              through the day.
            </p>

            <ul className="mt-10">
              {PHONE_NUMBERS.map((p) => (
                <li key={p} className="border-t border-rule">
                  <a
                    href={`tel:${p}`}
                    className="group flex items-center gap-4 py-5 transition-colors hover:text-primary"
                  >
                    <Phone className="size-4 shrink-0 text-primary" />
                    <span className="font-bold tracking-tight">{p}</span>
                  </a>
                </li>
              ))}

              {CONTACT_EMAIL && (
                <li className="border-t border-rule">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="group flex items-center gap-4 py-5 transition-colors hover:text-primary"
                  >
                    <Mail className="size-4 shrink-0 text-primary" />
                    <span className="font-bold tracking-tight">
                      {CONTACT_EMAIL}
                    </span>
                  </a>
                </li>
              )}

              <li className="border-y border-rule">
                <Link
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-5 transition-colors hover:text-primary"
                >
                  <FacebookIcon className="size-4 shrink-0 text-primary" />
                  <span className="font-bold tracking-tight">
                    Follow us on Facebook
                  </span>
                </Link>
              </li>
            </ul>
          </Reveal>

          <Reveal variants={fadeUp} delay={0.1} className="lg:col-span-7">
            <div className="rounded-2xl bg-card p-7 shadow-lift ring-1 ring-rule sm:p-10">
              <span className="eyebrow">Send a message</span>
              <h2 className="mt-5 text-subtitle text-balance">
                Write to us and we&rsquo;ll reply on WhatsApp
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                No email address required — your message opens a WhatsApp chat
                with our team.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
