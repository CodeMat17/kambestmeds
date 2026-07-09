"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useAction, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { ensureJimpDecodable } from "@/lib/image";

type FeatureItem = { title: string; body: string };
type TestimonialItem = { quote: string; name: string; place: string };

const FALLBACK_FEATURES: FeatureItem[] = [
  {
    title: "100% Natural",
    body: "Every remedy is crafted from pure, ethically-sourced herbs — no synthetic fillers, no shortcuts.",
  },
  {
    title: "Trusted by Thousands",
    body: "Years of consistent results have made KAMBEST a trusted name in herbal healing across Nigeria.",
  },
  {
    title: "Fast, Visible Relief",
    body: "Our formulations are designed to work with your body — many clients feel a difference within days.",
  },
  {
    title: "Nigerian-Rooted Expertise",
    body: "Generations of tradomedical knowledge, refined and delivered with modern care.",
  },
];

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "After months of struggling, the Fibroid Cure gave me real relief within weeks. I finally feel like myself again.",
    name: "Chiamaka",
    place: "Port Harcourt",
  },
  {
    quote: "KAMBEST's liver detox helped me recover faster than my doctor expected. Forever grateful.",
    name: "Emeka",
    place: "Lagos",
  },
  {
    quote: "Genuine herbs, genuine care. The team even followed up to check on my progress.",
    name: "Ngozi",
    place: "Lekki",
  },
];

const FALLBACK = {
  heroBadge: "Rooted in Nature. Proven in Results.",
  heroTitle: "KAMBEST Tradomedical Services — Natural Healing, Real Results.",
  heroSubtitle: "Trusted herbal solutions. Empowering your body to heal naturally with safe herbs.",
  heroImageUrl: "/about2.webp",
  whyTitle: "Why Choose Tradomedicals",
  whySubtitle: "Safe, natural, and effective — the KAMBEST difference.",
  features: FALLBACK_FEATURES,
  productsTitle: "Our Latest Products",
  productsSubtitle: "A glimpse of the herbal solutions trusted by clients across Nigeria.",
  testimonialsTitle: "What Our Clients Say",
  testimonials: FALLBACK_TESTIMONIALS,
  ctaTitle: "Ready to start healing naturally?",
  ctaSubtitle: "Chat with our team on WhatsApp for guidance on the right herbal solution for you.",
  ctaWhatsappMessage: "Hi KAMBEST, I'd like to know more about your herbal products.",
};

type HomeContent = typeof FALLBACK;

export function HomeEditor() {
  const content = useQuery(api.home.get, {});

  if (content === undefined) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  const initial: HomeContent = {
    heroBadge: content?.heroBadge || FALLBACK.heroBadge,
    heroTitle: content?.heroTitle || FALLBACK.heroTitle,
    heroSubtitle: content?.heroSubtitle || FALLBACK.heroSubtitle,
    heroImageUrl: content?.heroImageUrl || FALLBACK.heroImageUrl,
    whyTitle: content?.whyTitle || FALLBACK.whyTitle,
    whySubtitle: content?.whySubtitle || FALLBACK.whySubtitle,
    features: content?.features.length === 4 ? content.features : FALLBACK_FEATURES,
    productsTitle: content?.productsTitle || FALLBACK.productsTitle,
    productsSubtitle: content?.productsSubtitle || FALLBACK.productsSubtitle,
    testimonialsTitle: content?.testimonialsTitle || FALLBACK.testimonialsTitle,
    testimonials: content?.testimonials.length ? content.testimonials : FALLBACK_TESTIMONIALS,
    ctaTitle: content?.ctaTitle || FALLBACK.ctaTitle,
    ctaSubtitle: content?.ctaSubtitle || FALLBACK.ctaSubtitle,
    ctaWhatsappMessage: content?.ctaWhatsappMessage || FALLBACK.ctaWhatsappMessage,
  };

  return (
    <div className="grid max-w-2xl gap-6 mx-auto">
      <HeroSection initial={initial} />
      <WhySection initial={initial} />
      <ProductsSection initial={initial} />
      <TestimonialsSection initial={initial} />
      <CtaSection initial={initial} />
    </div>
  );
}

function useHeroUpload() {
  const generateUploadUrl = useMutation(api.home.generateUploadUrl);
  const optimizeUpload = useAction(api.images.optimizeUpload);

  async function upload(file: File) {
    file = await ensureJimpDecodable(file);
    const uploadUrl = await generateUploadUrl();
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) throw new Error("Upload failed.");
    const { storageId } = await res.json();
    return await optimizeUpload({ storageId });
  }

  return upload;
}

function HeroSection({ initial }: { initial: HomeContent }) {
  const upsert = useMutation(api.home.upsert);
  const uploadHero = useHeroUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [heroBadge, setHeroBadge] = useState(initial.heroBadge);
  const [heroTitle, setHeroTitle] = useState(initial.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(initial.heroSubtitle);
  const [heroImageUrl, setHeroImageUrl] = useState(initial.heroImageUrl);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!heroBadge.trim() || !heroTitle.trim() || !heroSubtitle.trim()) {
      toast.error("Please fill in the badge, title, and subtitle.");
      return;
    }
    setSubmitting(true);
    try {
      let heroImageId;
      const file = fileInputRef.current?.files?.[0];
      if (file) heroImageId = await uploadHero(file);

      await upsert({ heroBadge, heroTitle, heroSubtitle, heroImageId });
      toast.success("Hero section saved.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <h2 className="font-bold">Hero section</h2>
        <div className="grid gap-1.5">
          <Label htmlFor="home-hero-badge">Badge text</Label>
          <Input id="home-hero-badge" value={heroBadge} onChange={(e) => setHeroBadge(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="home-hero-title">Title</Label>
          <Textarea id="home-hero-title" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} rows={2} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="home-hero-subtitle">Subtitle</Label>
          <Textarea id="home-hero-subtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={2} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="home-hero-image">Hero image (leave empty to keep current)</Label>
          {heroImageUrl && (
            <div className="relative aspect-video w-48 overflow-hidden rounded-lg bg-muted">
              <Image src={heroImageUrl} alt="" fill sizes="192px" className="object-cover" />
            </div>
          )}
          <Input
            id="home-hero-image"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setHeroImageUrl(URL.createObjectURL(file));
            }}
          />
          <p className="text-xs text-muted-foreground">Automatically optimized to under 150KB on upload.</p>
        </div>
        <Button type="submit" disabled={submitting} className="w-fit">
          {submitting ? "Saving…" : "Save hero section"}
        </Button>
      </form>
    </Card>
  );
}

function WhySection({ initial }: { initial: HomeContent }) {
  const upsert = useMutation(api.home.upsert);
  const [whyTitle, setWhyTitle] = useState(initial.whyTitle);
  const [whySubtitle, setWhySubtitle] = useState(initial.whySubtitle);
  const [features, setFeatures] = useState<FeatureItem[]>(initial.features);
  const [submitting, setSubmitting] = useState(false);

  function updateFeature(index: number, patch: Partial<FeatureItem>) {
    setFeatures((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!whyTitle.trim() || !whySubtitle.trim()) {
      toast.error("Please fill in the title and subtitle.");
      return;
    }
    if (features.some((f) => !f.title.trim() || !f.body.trim())) {
      toast.error("Please fill in all feature titles and descriptions.");
      return;
    }
    setSubmitting(true);
    try {
      await upsert({ whyTitle, whySubtitle, features });
      toast.success("Why Choose section saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <h2 className="font-bold">Why Choose section</h2>
        <div className="grid gap-1.5">
          <Label htmlFor="home-why-title">Title</Label>
          <Input id="home-why-title" value={whyTitle} onChange={(e) => setWhyTitle(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="home-why-subtitle">Subtitle</Label>
          <Input id="home-why-subtitle" value={whySubtitle} onChange={(e) => setWhySubtitle(e.target.value)} required />
        </div>
        {features.map((f, i) => (
          <div key={i} className="grid gap-2 rounded-lg border border-border p-3">
            <div className="grid gap-1.5">
              <Label htmlFor={`home-feature-title-${i}`}>Feature {i + 1} title</Label>
              <Input
                id={`home-feature-title-${i}`}
                value={f.title}
                onChange={(e) => updateFeature(i, { title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor={`home-feature-body-${i}`}>Feature {i + 1} description</Label>
              <Textarea
                id={`home-feature-body-${i}`}
                value={f.body}
                onChange={(e) => updateFeature(i, { body: e.target.value })}
                rows={2}
                required
              />
            </div>
          </div>
        ))}
        <Button type="submit" disabled={submitting} className="w-fit">
          {submitting ? "Saving…" : "Save Why Choose section"}
        </Button>
      </form>
    </Card>
  );
}

function ProductsSection({ initial }: { initial: HomeContent }) {
  const upsert = useMutation(api.home.upsert);
  const [productsTitle, setProductsTitle] = useState(initial.productsTitle);
  const [productsSubtitle, setProductsSubtitle] = useState(initial.productsSubtitle);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!productsTitle.trim() || !productsSubtitle.trim()) {
      toast.error("Please fill in the title and subtitle.");
      return;
    }
    setSubmitting(true);
    try {
      await upsert({ productsTitle, productsSubtitle });
      toast.success("Products section saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <h2 className="font-bold">Latest Products section</h2>
        <p className="text-xs text-muted-foreground">
          Products themselves are managed on the Products page — this only edits the section heading.
        </p>
        <div className="grid gap-1.5">
          <Label htmlFor="home-products-title">Title</Label>
          <Input id="home-products-title" value={productsTitle} onChange={(e) => setProductsTitle(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="home-products-subtitle">Subtitle</Label>
          <Input
            id="home-products-subtitle"
            value={productsSubtitle}
            onChange={(e) => setProductsSubtitle(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={submitting} className="w-fit">
          {submitting ? "Saving…" : "Save Products section"}
        </Button>
      </form>
    </Card>
  );
}

function TestimonialsSection({ initial }: { initial: HomeContent }) {
  const upsert = useMutation(api.home.upsert);
  const [testimonialsTitle, setTestimonialsTitle] = useState(initial.testimonialsTitle);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initial.testimonials);
  const [submitting, setSubmitting] = useState(false);

  function updateTestimonial(index: number, patch: Partial<TestimonialItem>) {
    setTestimonials((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }

  function addTestimonial() {
    setTestimonials((prev) => [...prev, { quote: "", name: "", place: "" }]);
  }

  function removeTestimonial(index: number) {
    setTestimonials((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!testimonialsTitle.trim()) {
      toast.error("Please fill in the section title.");
      return;
    }
    if (testimonials.some((t) => !t.quote.trim() || !t.name.trim() || !t.place.trim())) {
      toast.error("Please fill in all testimonial fields, or remove empty ones.");
      return;
    }
    setSubmitting(true);
    try {
      await upsert({ testimonialsTitle, testimonials });
      toast.success("Testimonials saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Testimonials section</h2>
          <Button type="button" variant="outline" size="sm" onClick={addTestimonial}>
            <Plus className="size-4" />
            Add testimonial
          </Button>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="home-testimonials-title">Title</Label>
          <Input
            id="home-testimonials-title"
            value={testimonialsTitle}
            onChange={(e) => setTestimonialsTitle(e.target.value)}
            required
          />
        </div>
        {testimonials.map((t, i) => (
          <div key={i} className="grid gap-2 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`home-testimonial-quote-${i}`}>Testimonial {i + 1}</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeTestimonial(i)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
            <Textarea
              id={`home-testimonial-quote-${i}`}
              value={t.quote}
              onChange={(e) => updateTestimonial(i, { quote: e.target.value })}
              rows={2}
              placeholder="Quote"
              required
            />
            <Input
              value={t.name}
              onChange={(e) => updateTestimonial(i, { name: e.target.value })}
              placeholder="Name"
              required
            />
            <Input
              value={t.place}
              onChange={(e) => updateTestimonial(i, { place: e.target.value })}
              placeholder="Place"
              required
            />
          </div>
        ))}
        <Button type="submit" disabled={submitting} className="w-fit">
          {submitting ? "Saving…" : "Save testimonials"}
        </Button>
      </form>
    </Card>
  );
}

function CtaSection({ initial }: { initial: HomeContent }) {
  const upsert = useMutation(api.home.upsert);
  const [ctaTitle, setCtaTitle] = useState(initial.ctaTitle);
  const [ctaSubtitle, setCtaSubtitle] = useState(initial.ctaSubtitle);
  const [ctaWhatsappMessage, setCtaWhatsappMessage] = useState(initial.ctaWhatsappMessage);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ctaTitle.trim() || !ctaSubtitle.trim() || !ctaWhatsappMessage.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      await upsert({ ctaTitle, ctaSubtitle, ctaWhatsappMessage });
      toast.success("Final CTA saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <h2 className="font-bold">Final CTA section</h2>
        <div className="grid gap-1.5">
          <Label htmlFor="home-cta-title">Title</Label>
          <Input id="home-cta-title" value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="home-cta-subtitle">Subtitle</Label>
          <Textarea id="home-cta-subtitle" value={ctaSubtitle} onChange={(e) => setCtaSubtitle(e.target.value)} rows={2} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="home-cta-message">WhatsApp message</Label>
          <Textarea
            id="home-cta-message"
            value={ctaWhatsappMessage}
            onChange={(e) => setCtaWhatsappMessage(e.target.value)}
            rows={2}
            required
          />
        </div>
        <Button type="submit" disabled={submitting} className="w-fit">
          {submitting ? "Saving…" : "Save CTA section"}
        </Button>
      </form>
    </Card>
  );
}
