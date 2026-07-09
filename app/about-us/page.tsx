import Image from "next/image";
import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { HeartHandshake, Sparkles, Users, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { staggerChildren, fadeUp } from "@/lib/motion";
import { api } from "@/convex/_generated/api";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet KAMBEST Health Solutions — founded by Orji Nkemdilim Moses, a trusted Nigerian herbal and tradomedical brand rooted in nature and proven in results.",
};

const valueIcons = [Leaf, Sparkles, Users, HeartHandshake];

const fallbackValues = [
  { title: "Natural Care", body: "Pure, safe herbs — always." },
  { title: "Excellence", body: "Consistency and quality in every remedy." },
  { title: "Community", body: "A companion in every client's wellness journey." },
  { title: "Integrity", body: "Trusted relationships, one client at a time." },
];

const fallback = {
  title: "Natural Healing. Real Results.",
  body: "KAMBEST Tradomedical Services exists on one belief: the body already knows how to heal — it just needs the right support. Every remedy we offer is a trusted herbal solution, formulated to empower your body to heal naturally, using safe, carefully sourced herbs. No shortcuts, no synthetic compromises — just results our clients can feel.\n\nOrji Nkemdilim Moses — popularly known as KAMBEST — is a respected entrepreneur and the founder of KAMBEST Health Solutions, a trusted health and wellness brand now serving customers across Nigeria.\n\nToday, KAMBEST Health Solutions stands as a name built on consistency, integrity, and genuine care — one healed client, one trusted relationship, at a time.",
  heroImageUrl: "/about1.webp",
  quote: "Rooted in Nature. Proven in Results.",
  quoteAuthor: "Orji Nkemdilim Moses, Founder",
  values: fallbackValues,
};

export default async function AboutUsPage() {
  const content = (await fetchQuery(api.content.get, { key: "about-us" })) ?? fallback;
  const heroImageUrl = content.heroImageUrl ?? "/about1.webp";
  const quote = content.quote?.trim() || fallback.quote;
  const quoteAuthor = content.quoteAuthor?.trim() || fallback.quoteAuthor;
  const values = content.values?.length ? content.values : fallbackValues;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-wide text-primary">
              About KAMBEST
            </span>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
              {content.title}
            </h1>
          </Reveal>
          <Reveal variants={fadeUp} delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src={heroImageUrl}
                alt="Kambest herbal tradomedical artifacts"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-6 px-4 pb-16 sm:px-6">
        <Reveal>
          {content.body.split("\n\n").map((para, i) => (
            <p key={i} className="mt-3 whitespace-pre-line text-muted-foreground">
              {para}
            </p>
          ))}
        </Reveal>

        <Reveal className="rounded-2xl bg-primary/10 p-6">
          <p className="text-lg font-semibold italic text-primary">&ldquo;{quote}&rdquo;</p>
          <p className="mt-1 text-sm text-muted-foreground">— {quoteAuthor}</p>
        </Reveal>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="text-center">
            <h2 className="text-2xl font-extrabold">Our Values</h2>
          </Reveal>
          <Reveal
            variants={staggerChildren}
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((v, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <Reveal key={v.title} variants={fadeUp}>
                  <Card className="h-full items-center gap-2 p-6 text-center">
                    <Icon className="size-8 text-primary" />
                    <h3 className="font-bold">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.body}</p>
                  </Card>
                </Reveal>
              );
            })}
          </Reveal>
        </div>
      </section>
    </>
  );
}
