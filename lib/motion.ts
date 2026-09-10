import type { Variants } from "framer-motion";

// A single easing curve across the whole site. Long tail, no overshoot —
// motion should feel like weight settling, not like a bounce.
export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EDITORIAL_EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EDITORIAL_EASE } },
};

export const staggerChildren: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EDITORIAL_EASE },
  },
};

// Headline entrance: a slight upward slide from behind a clip edge, which
// reads as typographic rather than as a generic fade.
export const riseIn: Variants = {
  hidden: { opacity: 0, y: "28%" },
  show: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.9, ease: EDITORIAL_EASE },
  },
};

// Hairline rules drawing themselves in. Used under section headings.
export const drawRule: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.9, ease: EDITORIAL_EASE },
  },
};
