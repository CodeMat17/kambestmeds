"use client";

import { motion } from "framer-motion";

export function HeroMotion() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.12 }}
      transition={{ duration: 1.2 }}
      className="pointer-events-none absolute -right-10 top-16 hidden text-[14rem] leading-none sm:block"
    >
      🌿
    </motion.div>
  );
}
