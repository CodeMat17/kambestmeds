"use client";

import { motion } from "framer-motion";
import { buildWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { EDITORIAL_EASE } from "@/lib/motion";

export function WhatsAppFab() {
  return (
    <motion.a
      href={buildWhatsAppLink(
        WHATSAPP_NUMBER,
        "Hi KAMBEST, I'd like to know more about your herbal products.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.7, ease: EDITORIAL_EASE }}
      /* Collapsed to a disc, expanding to reveal its label on hover — keeps
         the corner quiet until the visitor reaches for it. */
      className="group fixed bottom-6 right-5 z-40 flex h-14 items-center gap-0 overflow-hidden rounded-full bg-[#25D366] pl-4 pr-4 text-white shadow-float ring-1 ring-black/10 transition-[gap,padding] duration-500 ease-editorial hover:gap-2.5 hover:pr-6 sm:bottom-8 sm:right-8"
    >
      <WhatsAppIcon className="size-6 shrink-0" />
      <span className="max-w-0 whitespace-nowrap text-sm font-bold tracking-tight opacity-0 transition-[max-width,opacity] duration-500 ease-editorial group-hover:max-w-40 group-hover:opacity-100">
        Chat with us
      </span>
    </motion.a>
  );
}
