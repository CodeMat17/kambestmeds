"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EDITORIAL_EASE, riseIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

const proofPoints = [
  { figure: "20+", label: "Years of practice" },
  { figure: "2", label: "Clinics nationwide" },
  { figure: "100%", label: "Natural formulation" },
];

/**
 * Animated hero copy. Kept as a small leaf client component so the hero image
 * and the rest of the page stay server-rendered.
 */
export function HeroMotion({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-5 pb-14 pt-32 sm:px-8">
      <div className="w-full max-w-3xl">
        <motion.span
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
          className="eyebrow text-white/70"
        >
          {badge}
        </motion.span>

        {/* Clipped rise, one line at a time — reads as typesetting rather
            than as a generic fade-in. */}
        <h1 className="mt-7 text-5xl sm:text-6xl md:text-7xl font-black text-balance text-white max-w-3xl">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              initial="hidden"
              animate="show"
              variants={riseIn}
              transition={{ delay: 0.1 }}
              className="block"
            >
              {title}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EDITORIAL_EASE }}
          className="mt-7 max-w-xl text-lede text-pretty text-white/80"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EDITORIAL_EASE }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button size="xl" variant="brass" render={<Link href="/products" />}>
            Explore remedies
          </Button>
          <Button size="xl" variant="on-dark" render={<Link href="/about-us" />}>
            Our story
          </Button>
        </motion.div>
      </div>

      {/* Proof row, divided by hairlines rather than boxed into cards. */}
      <motion.dl
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: EDITORIAL_EASE }}
        className="mt-14 grid w-full max-w-2xl grid-cols-3 overflow-hidden border-y border-white/15 sm:mt-20"
      >
        {proofPoints.map((p, i) => (
          <div
            key={p.label}
            className={cn(
              "min-w-0 py-5",
              i > 0
                ? "border-l border-white/15 pl-3 sm:pl-5"
                : "pr-3 sm:pr-5",
            )}
          >
            <dt className="sr-only">{p.label}</dt>
            <dd>
              <span className="block text-xl font-extrabold tracking-tight text-white sm:text-3xl">
                {p.figure}
              </span>
              <span className="mt-1.5 block text-[0.625rem] uppercase leading-snug tracking-[0.08em] text-white/55 sm:text-[0.6875rem] sm:tracking-[0.16em]">
                {p.label}
              </span>
            </dd>
          </div>
        ))}
      </motion.dl>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="mt-12 hidden items-center gap-3 text-[0.6875rem] uppercase tracking-[0.2em] text-white/50 lg:flex"
      >
        <ArrowDown className="size-3.5 animate-bounce" />
        Scroll
      </motion.div>
    </div>
  );
}
