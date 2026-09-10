import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { Section, PageHeader } from "@/components/section";
import { ProductCard } from "@/components/product-card";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { staggerChildren, fadeUp } from "@/lib/motion";
import {
  products as staticProducts,
  isVideo,
  type ProductView,
} from "@/lib/products";
import { getProducts } from "@/lib/site-data";
import { imageUrl } from "@/lib/cloudinary";

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Browse KAMBEST's full range of herbal tradomedical products — fibroid cure, hepatitis & liver detox, sperm booster, BP & cholesterol and more. Order or enquire directly on WhatsApp.",
};

// Must be a literal for Next's static segment-config analysis; keep in sync
// with SITE_REVALIDATE in lib/site-data.ts.
export const revalidate = 3600;

export default async function ProductsPage() {
  const dbProducts = await getProducts();

  const products: ProductView[] =
    dbProducts.length > 0
      ? dbProducts.map((p) => ({
          key: p._id,
          src: imageUrl(p.image, { width: 800, crop: "fill" }),
          video: false,
          unoptimized: true,
          name: p.name,
          cures: p.cures,
          instructions: p.instructions,
          amount: p.amount,
        }))
      : staticProducts.map((p) => ({
          key: p.image,
          src: `/products/${p.image}`,
          video: isVideo(p.image),
          name: p.name,
          cures: p.cures,
          instructions: p.instructions,
          amount: p.amount,
        }));

  return (
    <>
      <WhatsAppFab />

      <PageHeader
        eyebrow="The apothecary"
        title="Every remedy, in one place"
        lede="Natural tradomedical herbal solutions — rooted in nature, proven in results. Open any remedy to read what it helps with, how to take it, and order straight through WhatsApp."
      >
        <p className="text-eyebrow uppercase text-muted-foreground">
          {products.length} {products.length === 1 ? "remedy" : "remedies"}{" "}
          available
        </p>
      </PageHeader>

      <Section className="pt-16 sm:pt-20">
        <Reveal
          variants={staggerChildren}
          className="grid gap-6 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((p) => (
            <Reveal key={p.key} variants={fadeUp} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </Reveal>

        <Reveal className="mt-20">
          <div className="flex flex-col items-center gap-6 border-t border-rule pt-16 text-center">
            <span className="eyebrow eyebrow-center">Not sure where to start?</span>
            <h2 className="max-w-xl text-subtitle text-balance">
              Tell us what you&rsquo;re dealing with and we&rsquo;ll point you to
              the right remedy.
            </h2>
            <Button size="xl" render={<Link href="/contact-us" />}>
              Speak to a consultant
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
