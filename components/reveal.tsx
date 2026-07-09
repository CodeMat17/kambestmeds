"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export function Reveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
