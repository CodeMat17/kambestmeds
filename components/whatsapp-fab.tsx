"use client";

import { motion } from "framer-motion";
import { buildWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

export function WhatsAppFab() {
  return (
    <motion.a
      href={buildWhatsAppLink(WHATSAPP_NUMBER, "Hi KAMBEST, I'd like to know more about your herbal products.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="size-7" />
    </motion.a>
  );
}
