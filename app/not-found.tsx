import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  { href: "/products", label: "Browse every remedy" },
  { href: "/about-us", label: "Read our story" },
  { href: "/contact-us", label: "Find a clinic" },
];

export default function NotFound() {
  return (
    <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-paper-deep">
      <div aria-hidden className="grain absolute inset-0 text-foreground" />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <div className="max-w-2xl">
          <span className="eyebrow">Error 404</span>
          <h1 className="mt-6 text-display text-balance">
            This path doesn&rsquo;t lead anywhere.
          </h1>
          <p className="mt-6 max-w-md text-lede text-pretty text-muted-foreground">
            The page you were looking for has moved or never existed. Here are a
            few places worth going instead.
          </p>

          <Button size="xl" className="mt-10" render={<Link href="/" />}>
            Back to home
          </Button>

          <ul className="mt-14 max-w-md">
            {suggestions.map((s) => (
              <li key={s.href} className="border-t border-rule last:border-b">
                <Link
                  href={s.href}
                  className="group flex items-center justify-between py-5 font-bold tracking-tight transition-colors hover:text-primary"
                >
                  {s.label}
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
