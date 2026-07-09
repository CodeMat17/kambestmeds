"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import {
  ADDRESSES as FALLBACK_ADDRESSES,
  PHONE_NUMBERS as FALLBACK_PHONE_NUMBERS,
  CONTACT_EMAIL as FALLBACK_CONTACT_EMAIL,
  FACEBOOK_URL as FALLBACK_FACEBOOK_URL,
} from "@/lib/contact";
import { WHATSAPP_NUMBER as FALLBACK_WHATSAPP_NUMBER } from "@/lib/whatsapp";

type AddressItem = { city: string; text: string };

export function ContactEditor() {
  const contact = useQuery(api.contactInfo.get, {});

  if (contact === undefined) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  const initial = {
    addresses: contact?.addresses.length ? contact.addresses : FALLBACK_ADDRESSES,
    phoneNumbers: contact?.phoneNumbers.length ? contact.phoneNumbers : FALLBACK_PHONE_NUMBERS,
    email: contact?.email ?? FALLBACK_CONTACT_EMAIL,
    facebookUrl: contact?.facebookUrl ?? FALLBACK_FACEBOOK_URL,
    whatsappNumber: contact?.whatsappNumber ?? FALLBACK_WHATSAPP_NUMBER,
  };

  return <ContactForm initial={initial} />;
}

function ContactForm({
  initial,
}: {
  initial: {
    addresses: AddressItem[];
    phoneNumbers: string[];
    email: string;
    facebookUrl: string;
    whatsappNumber: string;
  };
}) {
  const upsert = useMutation(api.contactInfo.upsert);
  const [addresses, setAddresses] = useState<AddressItem[]>(initial.addresses);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(initial.phoneNumbers);
  const [email, setEmail] = useState(initial.email);
  const [facebookUrl, setFacebookUrl] = useState(initial.facebookUrl);
  const [whatsappNumber, setWhatsappNumber] = useState(initial.whatsappNumber);
  const [submitting, setSubmitting] = useState(false);

  function updateAddress(index: number, patch: Partial<AddressItem>) {
    setAddresses((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  }

  function addAddress() {
    setAddresses((prev) => [...prev, { city: "", text: "" }]);
  }

  function removeAddress(index: number) {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  }

  function updatePhone(index: number, value: string) {
    setPhoneNumbers((prev) => prev.map((p, i) => (i === index ? value : p)));
  }

  function addPhone() {
    setPhoneNumbers((prev) => [...prev, ""]);
  }

  function removePhone(index: number) {
    setPhoneNumbers((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (addresses.some((a) => !a.city.trim() || !a.text.trim())) {
      toast.error("Please fill in all address fields.");
      return;
    }
    if (phoneNumbers.some((p) => !p.trim())) {
      toast.error("Please fill in all phone numbers, or remove empty ones.");
      return;
    }
    if (!facebookUrl.trim() || !whatsappNumber.trim()) {
      toast.error("Please fill in Facebook URL and WhatsApp number.");
      return;
    }

    setSubmitting(true);
    try {
      await upsert({
        addresses,
        phoneNumbers,
        email: email.trim() || undefined,
        facebookUrl,
        whatsappNumber,
      });
      toast.success("Contact info saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-2xl gap-6 mx-auto">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Addresses</h2>
          <Button type="button" variant="outline" size="sm" onClick={addAddress}>
            <Plus className="size-4" />
            Add address
          </Button>
        </div>
        <div className="mt-4 grid gap-3">
          {addresses.map((a, i) => (
            <div key={i} className="grid gap-2 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={`address-city-${i}`}>City / Location {i + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAddress(i)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <Input
                id={`address-city-${i}`}
                value={a.city}
                onChange={(e) => updateAddress(i, { city: e.target.value })}
                required
              />
              <Label htmlFor={`address-text-${i}`}>Full address</Label>
              <Input
                id={`address-text-${i}`}
                value={a.text}
                onChange={(e) => updateAddress(i, { text: e.target.value })}
                required
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Phone numbers</h2>
          <Button type="button" variant="outline" size="sm" onClick={addPhone}>
            <Plus className="size-4" />
            Add phone
          </Button>
        </div>
        <div className="mt-4 grid gap-2">
          {phoneNumbers.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={p}
                onChange={(e) => updatePhone(i, e.target.value)}
                required
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => removePhone(i)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-bold">Other contact details</h2>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="contact-email">Email (optional)</Label>
            <Input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="contact-facebook">Facebook URL</Label>
            <Input
              id="contact-facebook"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="contact-whatsapp">WhatsApp number (with country code, no +)</Label>
            <Input
              id="contact-whatsapp"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
            />
          </div>
        </div>
      </Card>

      <Button type="submit" disabled={submitting} className="w-fit">
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
