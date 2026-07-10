import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Leaf, ShieldCheck, Zap, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { LabGallery } from "@/components/lab-gallery";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { HeroMotion } from "@/components/hero-motion";
import { fetchQuery } from "convex/nextjs";
import { staggerChildren, fadeUp } from "@/lib/motion";
import { products as staticProducts, isVideo, type ProductView } from "@/lib/products";
import { buildWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { api } from "@/convex/_generated/api";

export const metadata: Metadata = {
  title: "Natural Healing, Real Results",
  description:
    "Trusted herbal solutions for fibroid, hepatitis, fertility and more. KAMBEST Tradomedical Services — rooted in nature, proven in results.",
};

const featureIcons = [Leaf, ShieldCheck, Zap, Sprout];

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
  heroTitle: "KAMBEST Tradomedical Services — Natural Healing, Real Results.",
  heroSubtitle:
    "Trusted herbal solutions. Empowering your body to heal naturally with safe herbs.",
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
  ctaWhatsappMessage: "Hi KAMBEST, I'd like to know more about your herbal products.",
};

export default async function Home() {
  const [dbProducts, homeContent, labMedia] = await Promise.all([
    fetchQuery(api.products.list, {}),
    fetchQuery(api.home.get, {}),
    fetchQuery(api.labMedia.list, {}),
  ]);

  const featuredProducts: ProductView[] =
    dbProducts.length > 0
      ? dbProducts.slice(0, 4).map((p) => ({
          key: p._id,
          src: p.imageUrl ?? "",
          video: false,
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
  const heroImageUrl = homeContent?.heroImageUrl || fallback.heroImageUrl;
  const whyTitle = homeContent?.whyTitle || fallback.whyTitle;
  const whySubtitle = homeContent?.whySubtitle || fallback.whySubtitle;
  const features = homeContent?.features.length === 4 ? homeContent.features : fallbackFeatures;
  const productsTitle = homeContent?.productsTitle || fallback.productsTitle;
  const productsSubtitle = homeContent?.productsSubtitle || fallback.productsSubtitle;
  const testimonialsTitle = homeContent?.testimonialsTitle || fallback.testimonialsTitle;
  const testimonials = homeContent?.testimonials.length
    ? homeContent.testimonials
    : fallbackTestimonials;
  const ctaTitle = homeContent?.ctaTitle || fallback.ctaTitle;
  const ctaSubtitle = homeContent?.ctaSubtitle || fallback.ctaSubtitle;
  const ctaWhatsappMessage = homeContent?.ctaWhatsappMessage || fallback.ctaWhatsappMessage;

  return (
    <>
      <WhatsAppFab />

      {/* Hero */}
      <section className='relative flex min-h-[88vh] items-end overflow-hidden sm:min-h-[92vh]'>
        <Image
          src={heroImageUrl}
          alt='Kambest herbal tradomedical artifacts'
          fill
          priority
          sizes='100vw'
          className='object-cover object-bottom'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/25' />
        <HeroMotion />

        <div className='relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:px-6 sm:pb-24'>
          <div className='max-w-2xl'>
            <span className='inline-block rounded-full bg-accent/90 px-4 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground'>
              {heroBadge}
            </span>
            <h1 className='mt-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl'>
              {heroTitle}
            </h1>
            <p className='mt-4 max-w-xl text-base text-white/90 sm:text-lg'>
              {heroSubtitle}
            </p>
            <div className='mt-8 flex flex-wrap gap-3'>
              <Button
                size='lg'
                className='h-12 px-6 text-base'
                render={<Link href='/products' />}>
                See Products
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='h-12 border-white/40 bg-white/10 px-6 text-base text-white hover:bg-white/20 hover:text-white'
                render={<Link href='/about-us' />}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className='mx-auto max-w-6xl px-4 py-20 sm:px-6'>
        <Reveal className='text-center'>
          <h2 className='text-2xl font-extrabold sm:text-3xl'>{whyTitle}</h2>
          <p className='mx-auto mt-3 max-w-2xl text-muted-foreground'>
            {whySubtitle}
          </p>
        </Reveal>

        <Reveal
          variants={staggerChildren}
          className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <Reveal key={f.title} variants={fadeUp}>
                <Card className='h-full gap-3 p-6'>
                  <Icon className='size-8 text-primary' />
                  <h3 className='font-bold'>{f.title}</h3>
                  <p className='text-sm text-muted-foreground'>{f.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </Reveal>
      </section>

      {/* Latest Products */}
      <section className='bg-secondary/40 py-20'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6'>
          <Reveal className='text-center'>
            <h2 className='text-2xl font-extrabold sm:text-3xl'>
              {productsTitle}
            </h2>
            <p className='mx-auto mt-3 max-w-2xl text-muted-foreground'>
              {productsSubtitle}
            </p>
          </Reveal>

          <Reveal
            variants={staggerChildren}
            className='mt-12 grid gap-4 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {featuredProducts.map((p) => (
              <Reveal key={p.key} variants={fadeUp}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </Reveal>

          <div className='mt-10 flex justify-center'>
            <Button size='lg' render={<Link href='/products' />}>
              See All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Lab Gallery */}
      <LabGallery
        title='Inside the KAMBEST Lab'
        subtitle='A look at the machines and processes behind every herbal remedy we produce.'
        items={labMedia}
      />

      {/* Testimonials */}
      <section className='mx-auto max-w-6xl px-4 py-20 sm:px-6'>
        <Reveal className='text-center'>
          <h2 className='text-2xl font-extrabold sm:text-3xl'>
            {testimonialsTitle}
          </h2>
        </Reveal>

        <Reveal
          variants={staggerChildren}
          className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {testimonials.map((t) => (
            <Reveal key={t.name} variants={fadeUp}>
              <Card className='h-full gap-4 p-6'>
                <p className='text-sm italic text-foreground/90'>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarFallback className='bg-primary/15 text-primary font-bold'>
                      {t.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className='text-sm'>
                    <div className='font-bold'>{t.name}</div>
                    <div className='text-muted-foreground'>{t.place}</div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className='mx-auto max-w-6xl px-4 pb-20 sm:px-6'>
        <Reveal>
          <div className='flex flex-col items-center gap-5 rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12'>
            <h2 className='text-2xl font-extrabold sm:text-3xl'>{ctaTitle}</h2>
            <p className='max-w-xl text-primary-foreground/90'>{ctaSubtitle}</p>
            <Button
              size='lg'
              variant='secondary'
              className='h-12 px-8 text-base'
              render={
                <a
                  href={buildWhatsAppLink(WHATSAPP_NUMBER, ctaWhatsappMessage)}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              }>
              Chat on WhatsApp
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
