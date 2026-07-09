"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type ProductView, formatNaira } from "@/lib/products";
import { buildWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: ProductView }) {
  const [seeMoreOpen, setSeeMoreOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const [qty, setQty] = useState("1");
  const [orderName, setOrderName] = useState("");
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryText, setEnquiryText] = useState("");

  const { video, src } = product;

  function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!orderName.trim() || Number(qty) < 1) {
      toast.error("Please fill in your name and a valid quantity.");
      return;
    }
    const message = `Hello KAMBEST, I'd like to order: ${product.name}, Qty: ${qty}, Name: ${orderName}`;
    window.open(buildWhatsAppLink(WHATSAPP_NUMBER, message), "_blank", "noopener,noreferrer");
    toast.success("Redirecting to WhatsApp…");
    setOrderOpen(false);
    setOrderName("");
    setQty("1");
  }

  function submitEnquiry(e: React.FormEvent) {
    e.preventDefault();
    if (!enquiryName.trim() || !enquiryText.trim()) {
      toast.error("Please fill in your name and your question.");
      return;
    }
    const message = `Hello KAMBEST, I have a question about: ${product.name}. ${enquiryText} — From ${enquiryName}`;
    window.open(buildWhatsAppLink(WHATSAPP_NUMBER, message), "_blank", "noopener,noreferrer");
    toast.success("Redirecting to WhatsApp…");
    setEnquiryOpen(false);
    setEnquiryName("");
    setEnquiryText("");
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="relative aspect-4/3 bg-muted">
        {video ? (
          <video
            src={src}
            muted
            playsInline
            controls
            className="size-full object-cover"
          />
        ) : (
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-4">
        <h3 className="line-clamp-1 font-bold">{product.name}</h3>
        <p className="text-sm font-semibold text-primary">{formatNaira(product.amount)}</p>
      </div>

      <div className="grid grid-cols-3 gap-1 border-t border-border/60 p-2">
        <Sheet open={seeMoreOpen} onOpenChange={setSeeMoreOpen}>
          <SheetTrigger render={<Button variant="ghost" size="sm" className="text-xs" />}>
            See more
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{product.name}</SheetTitle>
              <SheetDescription>{formatNaira(product.amount)}</SheetDescription>
            </SheetHeader>
            <div className="px-4">
              <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
                {video ? (
                  <video src={src} muted playsInline controls className="size-full object-cover" />
                ) : (
                  <Image src={src} alt={product.name} fill sizes="400px" className="object-cover" />
                )}
              </div>
              <h4 className="mt-4 text-sm font-bold">What it helps with</h4>
              <p className="mt-1 text-sm text-muted-foreground">{product.cures}</p>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet open={orderOpen} onOpenChange={setOrderOpen}>
          <SheetTrigger render={<Button variant="secondary" size="sm" className="text-xs" />}>
            Order
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Order {product.name}</SheetTitle>
              <SheetDescription>We&rsquo;ll confirm your order on WhatsApp.</SheetDescription>
            </SheetHeader>
            <form onSubmit={submitOrder} className="flex flex-1 flex-col gap-4 px-4">
              <div className="grid gap-1.5">
                <Label>Product</Label>
                <Input value={product.name} readOnly disabled />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`qty-${product.key}`}>Quantity</Label>
                <Input
                  id={`qty-${product.key}`}
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`name-${product.key}`}>Your name</Label>
                <Input
                  id={`name-${product.key}`}
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  placeholder="e.g. Chiamaka Okoro"
                  required
                />
              </div>
              <SheetFooter>
                <Button type="submit">Order via WhatsApp</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        <Sheet open={enquiryOpen} onOpenChange={setEnquiryOpen}>
          <SheetTrigger render={<Button variant="outline" size="sm" className="text-xs" />}>
            Enquiry
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Ask about {product.name}</SheetTitle>
              <SheetDescription>We&rsquo;ll reply on WhatsApp.</SheetDescription>
            </SheetHeader>
            <form onSubmit={submitEnquiry} className="flex flex-1 flex-col gap-4 px-4">
              <div className="grid gap-1.5">
                <Label>Product</Label>
                <Input value={product.name} readOnly disabled />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`ename-${product.key}`}>Your name</Label>
                <Input
                  id={`ename-${product.key}`}
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                  placeholder="e.g. Emeka Obi"
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`etext-${product.key}`}>Your question</Label>
                <Textarea
                  id={`etext-${product.key}`}
                  value={enquiryText}
                  onChange={(e) => setEnquiryText(e.target.value)}
                  placeholder="What would you like to know?"
                  required
                />
              </div>
              <SheetFooter>
                <Button type="submit">Send Enquiry via WhatsApp</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </Card>
  );
}
