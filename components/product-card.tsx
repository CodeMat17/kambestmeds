"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

export function ProductCard({ product }: { product: ProductView }) {
  const [seeMoreOpen, setSeeMoreOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const [qty, setQty] = useState("1");
  const [orderName, setOrderName] = useState("");
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryText, setEnquiryText] = useState("");

  const { video, src, unoptimized } = product;

  function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!orderName.trim() || Number(qty) < 1) {
      toast.error("Please fill in your name and a valid quantity.");
      return;
    }
    const message = `Hello KAMBEST, I'd like to order: ${product.name}, Qty: ${qty}, Name: ${orderName}`;
    window.open(
      buildWhatsAppLink(WHATSAPP_NUMBER, message),
      "_blank",
      "noopener,noreferrer",
    );
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
    window.open(
      buildWhatsAppLink(WHATSAPP_NUMBER, message),
      "_blank",
      "noopener,noreferrer",
    );
    toast.success("Redirecting to WhatsApp…");
    setEnquiryOpen(false);
    setEnquiryName("");
    setEnquiryText("");
  }

  const media = (sizes: string, className = "object-contain") =>
    video ? (
      <video
        src={src}
        muted
        playsInline
        controls
        className={`size-full ${className}`}
      />
    ) : (
      <Image
        src={src}
        unoptimized={unoptimized}
        alt={product.name}
        fill
        sizes={sizes}
        className={`${className} transition-transform duration-700 ease-editorial group-hover/card:scale-[1.04]`}
      />
    );

  return (
    <Card className=" pt-0 transition-shadow duration-500 hover:shadow-lift">
      {/* Filled edge to edge so the grid reads as a row of equal tiles; the
          details sheet below shows the photo uncropped. */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {media(
          "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
          "object-cover",
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        />
      </div>

      <CardHeader className="flex-1">
        <CardTitle className="text-balance font-extrabold tracking-tight">
          {product.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {product.cures}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between gap-3 border-t border-rule pt-4">
          <span>
            <span className="block text-eyebrow uppercase text-muted-foreground">
              Price
            </span>
            <span className="mt-1.5 block text-lg font-extrabold tracking-tight text-primary">
              {formatNaira(product.amount)}
            </span>
          </span>

          <Sheet open={seeMoreOpen} onOpenChange={setSeeMoreOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" size="pill" className="shrink-0" />
              }
            >
              Details
              <ArrowUpRight className="size-3.5" />
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader className="border-b border-rule">
                <SheetTitle className="text-subtitle">
                  {product.name}
                </SheetTitle>
                <SheetDescription className="font-bold text-primary">
                  {formatNaira(product.amount)}
                </SheetDescription>
              </SheetHeader>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
                <div className="frame relative aspect-square overflow-hidden rounded-xl bg-muted">
                  {media("400px")}
                </div>

                <h4 className="mt-8 text-eyebrow uppercase text-muted-foreground">
                  What it helps with
                </h4>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {product.cures}
                </p>

                {product.instructions?.trim() && (
                  <>
                    <hr className="rule my-7" />
                    <h4 className="text-eyebrow uppercase text-muted-foreground">
                      How to take it
                    </h4>
                    <ol className="mt-4 space-y-3">
                      {product.instructions
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line, i) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[0.625rem] font-extrabold text-primary">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed text-muted-foreground">
                              {line}
                            </span>
                          </li>
                        ))}
                    </ol>
                  </>
                )}
              </div>

              <SheetFooter className="grid grid-cols-2 gap-2 border-t border-rule">
                <Button
                  size="pill"
                  variant="outline"
                  onClick={() => {
                    setSeeMoreOpen(false);
                    setEnquiryOpen(true);
                  }}
                >
                  Ask a question
                </Button>
                <Button
                  size="pill"
                  onClick={() => {
                    setSeeMoreOpen(false);
                    setOrderOpen(true);
                  }}
                >
                  Order now
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2">
        <Sheet open={orderOpen} onOpenChange={setOrderOpen}>
          <SheetTrigger render={<Button  className="w-full" />}>
            Order
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader className="border-b border-rule">
              <SheetTitle className="text-subtitle">
                Order {product.name}
              </SheetTitle>
              <SheetDescription>
                We&rsquo;ll confirm your order on WhatsApp.
              </SheetDescription>
            </SheetHeader>
            <form
              onSubmit={submitOrder}
              className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-6"
            >
              <div className="frame flex items-center gap-4 rounded-xl bg-secondary/60 p-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {media("64px", "object-cover")}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{product.name}</p>
                  <p className="mt-0.5 text-sm font-extrabold text-primary">
                    {formatNaira(product.amount)}
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`qty-${product.key}`}>Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-lg"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setQty((q) => String(Math.max(1, Number(q) - 1)))
                    }
                  >
                    <Minus className="size-4" />
                  </Button>
                  <Input
                    id={`qty-${product.key}`}
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    required
                    className="h-9 text-center font-bold"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-lg"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => String(Number(q) + 1))}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`name-${product.key}`}>Your name</Label>
                <Input
                  id={`name-${product.key}`}
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  placeholder="e.g. Chiamaka Okoro"
                  required
                />
              </div>

              <SheetFooter className="mt-auto border-t border-rule px-0">
                <Button type="submit" size="xl" className="w-full">
                  <WhatsAppIcon className="size-5" />
                  Order via WhatsApp
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        <Sheet open={enquiryOpen} onOpenChange={setEnquiryOpen}>
          <SheetTrigger
            render={<Button variant="outline" className="w-full" />}
          >
            Enquire
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader className="border-b border-rule">
              <SheetTitle className="text-subtitle">
                Ask about {product.name}
              </SheetTitle>
              <SheetDescription>
                We&rsquo;ll reply on WhatsApp.
              </SheetDescription>
            </SheetHeader>
            <form
              onSubmit={submitEnquiry}
              className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-6"
            >
              <div className="frame flex items-center gap-4 rounded-xl bg-secondary/60 p-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {media("64px", "object-cover")}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{product.name}</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`ename-${product.key}`}>Your name</Label>
                <Input
                  id={`ename-${product.key}`}
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                  placeholder="e.g. Emeka Obi"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`etext-${product.key}`}>Your question</Label>
                <Textarea
                  id={`etext-${product.key}`}
                  value={enquiryText}
                  onChange={(e) => setEnquiryText(e.target.value)}
                  placeholder="What would you like to know?"
                  rows={5}
                  required
                />
              </div>

              <SheetFooter className="mt-auto border-t border-rule px-0">
                <Button type="submit" size="xl" className="w-full">
                  <WhatsAppIcon className="size-5" />
                  Send enquiry
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
}
