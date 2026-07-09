import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { staggerChildren, fadeUp } from "@/lib/motion";
import { products as staticProducts, isVideo, type ProductView } from "@/lib/products";
import { api } from "@/convex/_generated/api";

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Browse KAMBEST's full range of herbal tradomedical products — fibroid cure, hepatitis & liver detox, sperm booster, BP & cholesterol and more. Order or enquire directly on WhatsApp.",
};

export default async function ProductsPage() {
  const dbProducts = await fetchQuery(api.products.list, {});

  const products: ProductView[] =
    dbProducts.length > 0
      ? dbProducts.map((p) => ({
          key: p._id,
          src: p.imageUrl ?? "",
          video: false,
          name: p.name,
          cures: p.cures,
          amount: p.amount,
        }))
      : staticProducts.map((p) => ({
          key: p.image,
          src: `/products/${p.image}`,
          video: isVideo(p.image),
          name: p.name,
          cures: p.cures,
          amount: p.amount,
        }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal className="text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Our Products</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Natural, tradomedical herbal solutions — rooted in nature, proven in
          results. Tap a product to learn more, place an order, or send an
          enquiry straight to WhatsApp.
        </p>
      </Reveal>

      <Reveal
        variants={staggerChildren}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((p) => (
          <Reveal key={p.key} variants={fadeUp}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </Reveal>
    </section>
  );
}
