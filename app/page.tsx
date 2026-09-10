import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { Section, Container, SectionHeading } from "@/components/section";
import { ProductCard } from "@/components/product-card";
import { LabGallery } from "@/components/lab-gallery";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { HeroMotion } from "@/components/hero-motion";
import { staggerChildren, fadeUp } from "@/lib/motion";
import {
  products as staticProducts,
  isVideo,
  type ProductView,
} from "@/lib/products";
import { buildWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { imageUrl } from "@/lib/cloudinary";
import { getProducts, getHomeContent, getLabMedia } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Natural Healing, Real Results",
  description:
    "Trusted herbal solutions for fibroid, hepatitis, fertility and more. KAMBEST Tradomedical Services — rooted in nature, proven in results.",
};

const fallbackFeatures = [
  {
    title: "100% Natural",
    body: "Every remedy is crafted from pure, ethically-sourced herbs — no synthetic fillers, no shortcuts.",
  },
  {
    title: "Trusted by Thousands",
    body: "Years of consistent results have made KAMBEST a trusted name in herbal healing across Nigeria.",
  },
  {
    title: "Fast, Visible Relief",
    body: "Our formulations are designed to work with your body — many clients feel a difference within days.",
  },
  {
    title: "Nigerian-Rooted Expertise",
    body: "Generations of tradomedical knowledge, refined and delivered with modern care.",
  },
];

const fallbackTestimonials = [
  {
    quote:
      "After months of struggling, the Fibroid Cure gave me real relief within weeks. I finally feel like myself again.",
    name: "Chiamaka",
    place: "Port Harcourt",
  },
  {
    quote:
      "KAMBEST's liver detox helped me recover faster than my doctor expected. Forever grateful.",
    name: "Emeka",
    place: "Lagos",
  },
  {
    quote:
      "Genuine herbs, genuine care. The team even followed up to check on my progress.",
    name: "Ngozi",
    place: "Lekki",
  },
];

const fallback = {
  heroBadge: "Rooted in Nature. Proven in Results.",
  heroTitle: "KAMBEST Tradomedical Services.",
  heroSubtitle:
    "Natural Healing, Real Results. Trusted herbal solutions. Empowering your body to heal naturally with safe herbs.",
  heroImageUrl: "/about2.webp",
  whyTitle: "Why Choose Tradomedicals",
  whySubtitle: "Safe, natural, and effective — the KAMBEST difference.",
  features: fallbackFeatures,
  productsTitle: "Our Latest Products",
  productsSubtitle:
    "A glimpse of the herbal solutions trusted by clients across Nigeria.",
  testimonialsTitle: "What Our Clients Say",
  testimonials: fallbackTestimonials,
  ctaTitle: "Ready to start healing naturally?",
  ctaSubtitle:
    "Chat with our team on WhatsApp for guidance on the right herbal solution for you.",
  ctaWhatsappMessage:
    "Hi KAMBEST, I'd like to know more about your herbal products.",
};

// Must be a literal for Next's static segment-config analysis; keep in sync
// with SITE_REVALIDATE in lib/site-data.ts.
export const revalidate = 3600;

export default async function Home() {
  const [dbProducts, homeContent, labMedia] = await Promise.all([
    getProducts(),
    getHomeContent(),
    getLabMedia(),
  ]);

  const featuredProducts: ProductView[] =
    dbProducts.length > 0
      ? dbProducts.slice(0, 3).map((p) => ({
          key: p._id,
          src: imageUrl(p.image, { width: 800, crop: "fill" }),
          video: false,
          unoptimized: true,
          name: p.name,
          cures: p.cures,
          instructions: p.instructions,
          amount: p.amount,
        }))
      : staticProducts.slice(0, 3).map((p) => ({
          key: p.image,
          src: `/products/${p.image}`,
          video: isVideo(p.image),
          name: p.name,
          cures: p.cures,
          instructions: p.instructions,
          amount: p.amount,
        }));

  const heroBadge = homeContent?.heroBadge || fallback.heroBadge;
  const heroTitle = homeContent?.heroTitle || fallback.heroTitle;
  const heroSubtitle = homeContent?.heroSubtitle || fallback.heroSubtitle;
  // A Cloudinary hero is already optimised; the bundled fallback is not.
  const heroImage = homeContent?.heroImage;
  const heroImageUrl = heroImage
    ? imageUrl(heroImage, { width: 1920, crop: "fill" })
    : fallback.heroImageUrl;
  const whyTitle = homeContent?.whyTitle || fallback.whyTitle;
  const whySubtitle = homeContent?.whySubtitle || fallback.whySubtitle;
  const features =
    homeContent?.features.length === 4 ? homeContent.features : fallbackFeatures;
  const productsTitle = homeContent?.productsTitle || fallback.productsTitle;
  const productsSubtitle =
    homeContent?.productsSubtitle || fallback.productsSubtitle;
  const testimonialsTitle =
    homeContent?.testimonialsTitle || fallback.testimonialsTitle;
  const testimonials = homeContent?.testimonials.length
    ? homeContent.testimonials
    : fallbackTestimonials;
  const ctaTitle = homeContent?.ctaTitle || fallback.ctaTitle;
  const ctaSubtitle = homeContent?.ctaSubtitle || fallback.ctaSubtitle;
  const ctaWhatsappMessage =
    homeContent?.ctaWhatsappMessage || fallback.ctaWhatsappMessage;

  const [leadTestimonial, ...restTestimonials] = testimonials;

  return (
    <>
      <WhatsAppFab />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-svh items-end overflow-hidden bg-primary">
        <Image
          src={heroImageUrl}
          unoptimized={Boolean(heroImage)}
          alt="Kambest herbal tradomedical artifacts"
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Two stacked scrims: a vertical one for text legibility, a warm
            radial one to keep the photograph from going cold grey. */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-black/35" />
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 100%, oklch(0.435 0.093 156 / 0.9), transparent 65%)",
          }}
        />
        <div aria-hidden className="grain absolute inset-0 text-white" />

        <HeroMotion
          badge={heroBadge}
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      </section>

      {/* ── Why choose ───────────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <span className="eyebrow">The Kambest difference</span>
                <h2 className="mt-5 text-title text-balance">{whyTitle}</h2>
                <p className="mt-6 text-lede text-pretty text-muted-foreground">
                  {whySubtitle}
                </p>
                <Button
                  size="pill"
                  variant="outline"
                  className="mt-8"
                  render={<Link href="/about-us" />}
                >
                  Read our story
                  <ArrowUpRight className="size-4" />
                </Button>
              </Reveal>
            </div>
          </div>

          {/* A numbered list divided by hairlines — an editorial index, not a
              grid of boxed cards. */}
          <Reveal variants={staggerChildren} className="lg:col-span-7">
            <dl>
              {features.map((f, i) => (
                <Reveal key={f.title} variants={fadeUp}>
                  <div className="group grid grid-cols-[auto_1fr] gap-5 border-t border-rule py-8 transition-colors last:border-b sm:gap-8 sm:py-9">
                    <span className="pt-1 text-eyebrow text-muted-foreground transition-colors group-hover:text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <dt className="text-subtitle text-balance">{f.title}</dt>
                      <dd className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                        {f.body}
                      </dd>
                    </div>
                  </div>
                </Reveal>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* ── Latest products ──────────────────────────────────────────────── */}
      <Section tone="deep" width="full">
        <Container>
          <SectionHeading
            eyebrow="The apothecary"
            title={productsTitle}
            lede={productsSubtitle}
            action={
              <Button
                size="pill"
                variant="outline"
                render={<Link href="/products" />}
              >
                View all
                <ArrowUpRight className="size-4" />
              </Button>
            }
          />

          <Reveal
            variants={staggerChildren}
            className="mt-14 grid gap-6  lg:gap-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featuredProducts.map((p) => (
              <Reveal key={p.key} variants={fadeUp} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* ── Lab gallery ──────────────────────────────────────────────────── */}
      <LabGallery
        eyebrow="Behind the remedy"
        title="Inside the KAMBEST lab"
        subtitle="The machines, hands and processes behind every bottle we produce."
        items={labMedia}
      />

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <Section tone="deep">
        <SectionHeading
          eyebrow="In their words"
          title={testimonialsTitle}
          align="center"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* The lead testimonial is set as a pull-quote at display scale; the
              rest sit quietly beside it. */}
          {leadTestimonial && (
            <Reveal variants={fadeUp} className="lg:col-span-2">
              <figure className="relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-xl bg-primary p-8 text-primary-foreground sm:p-12">
                <div aria-hidden className="grain absolute inset-0 text-white" />
                <Quote
                  aria-hidden
                  className="size-10 shrink-0 text-primary-foreground/30"
                />
                <blockquote className="relative text-subtitle text-balance">
                  {leadTestimonial.quote}
                </blockquote>
                <figcaption className="relative flex items-center gap-3 border-t border-primary-foreground/20 pt-6">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary-foreground/15 text-sm font-extrabold">
                    {leadTestimonial.name[0]}
                  </span>
                  <span className="text-sm">
                    <span className="block font-bold">
                      {leadTestimonial.name}
                    </span>
                    <span className="block text-primary-foreground/70">
                      {leadTestimonial.place}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          )}

          <div className="flex flex-col gap-6">
            {restTestimonials.map((t) => (
              <Reveal key={t.name} variants={fadeUp} className="h-full">
                <figure className="flex h-full flex-col justify-between gap-6 rounded-xl bg-card p-7 shadow-raise ring-1 ring-rule">
                  <blockquote className="leading-relaxed text-muted-foreground">
                    {t.quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-rule pt-5">
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                      {t.name[0]}
                    </span>
                    <span className="text-sm">
                      <span className="block font-bold">{t.name}</span>
                      <span className="block text-muted-foreground">
                        {t.place}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <Section className="pb-24 pt-0 sm:pb-32 sm:pt-0">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-2xl bg-primary px-6 py-20 text-center text-primary-foreground sm:px-14 sm:py-24">
            <div aria-hidden className="grain absolute inset-0 text-white" />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 opacity-60"
              style={{
                background:
                  "radial-gradient(70% 120% at 50% 0%, oklch(0.7 0.104 72 / 0.45), transparent 60%)",
              }}
            />
            <span className="eyebrow eyebrow-center relative text-primary-foreground/70">
              Start here
            </span>
            <h2 className="relative mx-auto mt-6 max-w-3xl text-title text-balance">
              {ctaTitle}
            </h2>
            <p className="relative mx-auto mt-6 max-w-xl text-lede text-pretty text-primary-foreground/80">
              {ctaSubtitle}
            </p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-3">
              <Button
                size="xl"
                variant="brass"
                render={
                  <a
                    href={buildWhatsAppLink(
                      WHATSAPP_NUMBER,
                      ctaWhatsappMessage,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Chat on WhatsApp
              </Button>
              <Button
                size="xl"
                variant="on-dark"
                render={<Link href="/contact-us" />}
              >
                Visit a clinic
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
