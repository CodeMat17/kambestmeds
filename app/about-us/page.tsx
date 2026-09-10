import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { HeartHandshake, Sparkles, Users, Leaf, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { Section, Container, SectionHeading } from "@/components/section";
import { TeamGallery } from "@/components/team-gallery";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { staggerChildren, fadeUp } from "@/lib/motion";
import { getSiteContent, getTeam } from "@/lib/site-data";
import { imageUrl } from "@/lib/cloudinary";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet KAMBEST Health Solutions — founded by Orji Nkemdilim Moses, a trusted Nigerian herbal and tradomedical brand rooted in nature and proven in results.",
};

const valueIcons = [Leaf, Sparkles, Users, HeartHandshake];

const fallbackValues = [
  { title: "Natural Care", body: "Pure, safe herbs — always." },
  { title: "Excellence", body: "Consistency and quality in every remedy." },
  {
    title: "Community",
    body: "A companion in every client's wellness journey.",
  },
  { title: "Integrity", body: "Trusted relationships, one client at a time." },
];

const fallback = {
  title: "Natural Healing. Real Results.",
  body: "KAMBEST Tradomedical Services exists on one belief: the body already knows how to heal — it just needs the right support. Every remedy we offer is a trusted herbal solution, formulated to empower your body to heal naturally, using safe, carefully sourced herbs. No shortcuts, no synthetic compromises — just results our clients can feel.\n\nOrji Nkemdilim Moses — popularly known as KAMBEST — is a respected entrepreneur and the founder of KAMBEST Health Solutions, a trusted health and wellness brand now serving customers across Nigeria.\n\nToday, KAMBEST Health Solutions stands as a name built on consistency, integrity, and genuine care — one healed client, one trusted relationship, at a time.",
  heroImage: undefined,
  quote: "Rooted in Nature. Proven in Results.",
  quoteAuthor: "Orji Nkemdilim Moses, Founder",
  values: fallbackValues,
};

// Must be a literal for Next's static segment-config analysis; keep in sync
// with SITE_REVALIDATE in lib/site-data.ts.
export const revalidate = 3600;

export default async function AboutUsPage() {
  const [rawContent, teamMembers] = await Promise.all([
    getSiteContent("about-us"),
    getTeam(),
  ]);
  const content = rawContent ?? fallback;
  // Cloudinary heroes are pre-optimised; the bundled fallback still goes
  // through next/image.
  const heroImage = content.heroImage;
  const heroImageUrl = heroImage
    ? imageUrl(heroImage, { width: 1200, crop: "fill" })
    : "/about1.webp";
  const quote = content.quote?.trim() || fallback.quote;
  const quoteAuthor = content.quoteAuthor?.trim() || fallback.quoteAuthor;
  const values = content.values?.length ? content.values : fallbackValues;
  const paragraphs = content.body.split("\n\n").filter(Boolean);

  return (
    <>
      <WhatsAppFab />

      {/* ── Masthead ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-rule bg-paper-deep">
        <div aria-hidden className="grain absolute inset-0 text-foreground" />
        <Container className="relative py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-6">
              <span className="eyebrow">About KAMBEST</span>
              <h1 className="mt-6 text-display text-balance">{content.title}</h1>
            </Reveal>

            <Reveal variants={fadeUp} delay={0.1} className="lg:col-span-6">
              <div className="frame aspect-4/5 rounded-2xl shadow-lift sm:aspect-4/3 lg:aspect-4/5">
                <Image
                  src={heroImageUrl}
                  unoptimized={Boolean(heroImage)}
                  alt="Kambest herbal tradomedical artifacts"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  preload
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── The story ────────────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-3">
            <Reveal>
              <span className="eyebrow lg:sticky lg:top-32">Our story</span>
            </Reveal>
          </div>

          {/* Drop cap on the first paragraph — the cheapest, strongest
              editorial cue available without a display face. */}
          <Reveal className="lg:col-span-8 lg:col-start-5">
            <div className="richtext richtext-lead">
              {paragraphs.map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Founder pull-quote ───────────────────────────────────────────── */}
      <Section tone="deep" className="py-0 sm:py-0">
        <div className="grid items-stretch gap-0 border-y border-rule sm:grid-cols-12">
          <Reveal variants={fadeUp} className="min-w-0 sm:col-span-5 lg:col-span-4">
            <div className="frame relative aspect-4/5 h-full w-full min-h-80 rounded-none sm:aspect-auto">
              <Image
                src="/kambest_ceo.webp"
                alt={quoteAuthor}
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>
          </Reveal>

          <Reveal className="flex flex-col justify-center gap-8 px-6 py-14 sm:col-span-7 sm:px-12 lg:col-span-8 lg:px-20">
            <span className="eyebrow">From the founder</span>
            <blockquote className="text-title text-balance text-primary">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <cite className="not-italic">
              <span className="block text-sm font-bold">{quoteAuthor}</span>
            </cite>
          </Reveal>
        </div>
      </Section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="What we stand for"
          title="Our values"
          lede="Four commitments that decide what we make, how we make it, and how we treat the people who trust us."
        />

        <Reveal
          variants={staggerChildren}
          className="mt-14 grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4"
        >
          {values.map((v, i) => {
            const Icon = valueIcons[i % valueIcons.length];
            return (
              <Reveal key={v.title} variants={fadeUp} className="h-full">
                <div className="group flex h-full flex-col gap-5 border-t-2 border-rule pt-7 transition-colors duration-500 hover:border-primary sm:pr-8">
                  <Icon className="size-7 text-primary" />
                  <div>
                    <h3 className="text-subtitle">{v.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      {v.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </Reveal>
      </Section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <TeamGallery
        eyebrow="The people"
        title="Our team"
        subtitle="The hands and hearts behind every remedy — dedicated to your wellness."
        items={teamMembers.slice(0, 4)}
      />

      {/* ── Closing ──────────────────────────────────────────────────────── */}
      <Section className="pb-24 sm:pb-32">
        <Reveal className="flex flex-col items-center gap-7 border-t border-rule pt-16 text-center">
          <span className="eyebrow eyebrow-center">Come and see us</span>
          <h2 className="max-w-2xl text-title text-balance">
            Two clinics, one standard of care.
          </h2>
          <Button size="xl" render={<Link href="/contact-us" />}>
            Find a clinic
            <ArrowUpRight className="size-4" />
          </Button>
        </Reveal>
      </Section>
    </>
  );
}
