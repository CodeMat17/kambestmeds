"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { buildWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in your name and message.");
      return;
    }
    const text = `Hello KAMBEST, my name is ${name}. ${message}`;
    window.open(
      buildWhatsAppLink(WHATSAPP_NUMBER, text),
      "_blank",
      "noopener,noreferrer",
    );
    toast.success("Redirecting to WhatsApp…");
    setName("");
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="contact-name" className="text-eyebrow uppercase">
          Your name
        </Label>
        <Input
          id="contact-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Chiamaka Okoro"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact-message" className="text-eyebrow uppercase">
          Message
        </Label>
        <Textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help you?"
          rows={6}
          required
        />
      </div>
      <Button type="submit" size="xl" className="w-full">
        <WhatsAppIcon className="size-5" />
        Send via WhatsApp
      </Button>
    </form>
  );
}
