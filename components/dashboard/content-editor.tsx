"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { revalidateSite } from "@/app/actions/revalidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import { uploadMedia } from "@/lib/upload-media";
import { destroyAsset } from "@/app/actions/cloudinary";
import { imageUrl } from "@/lib/cloudinary";

type ContentKey = "about-us" | "terms" | "privacy";
type ValueItem = { title: string; body: string };
type Content = {
  title: string;
  body: string;
  heroImageUrl: string | null;
  quote: string;
  quoteAuthor: string;
  values: ValueItem[];
};

const DEFAULT_VALUES: ValueItem[] = [
  { title: "Natural Care", body: "Pure, safe herbs — always." },
  { title: "Excellence", body: "Consistency and quality in every remedy." },
  { title: "Community", body: "A companion in every client's wellness journey." },
  { title: "Integrity", body: "Trusted relationships, one client at a time." },
];

export function ContentEditor({
  contentKey,
  withHeroImage = false,
}: {
  contentKey: ContentKey;
  withHeroImage?: boolean;
}) {
  const content = useQuery(api.content.get, { key: contentKey });

  if (content === undefined) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  const initial: Content = {
    title: content?.title ?? "",
    body: content?.body ?? "",
    heroImageUrl: content?.heroImage
      ? imageUrl(content.heroImage, { width: 800, crop: "fill" })
      : null,
    quote: content?.quote ?? "",
    quoteAuthor: content?.quoteAuthor ?? "",
    values: content?.values?.length ? content.values : DEFAULT_VALUES,
  };

  if (contentKey === "about-us") {
    return <AboutUsSections initial={initial} />;
  }

  return (
    <RichTextForm
      contentKey={contentKey}
      initial={initial}
      withHeroImage={withHeroImage}
    />
  );
}

function AboutUsSections({ initial }: { initial: Content }) {
  return (
    <div className="grid max-w-2xl gap-6 mx-auto">
      <HeroSection initial={initial} />
      <BodySection initial={initial} />
      <QuoteSection initial={initial} />
      <ValuesSection initial={initial} />
    </div>
  );
}

function HeroSection({ initial }: { initial: Content }) {
  const upsert = useMutation(api.content.upsert);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initial.title);
  const [heroImageUrl, setHeroImageUrl] = useState(initial.heroImageUrl);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please fill in the title.");
      return;
    }
    setSubmitting(true);
    try {
      const file = fileInputRef.current?.files?.[0];
      const heroImage = file ? await uploadMedia(file) : undefined;

      const { orphaned } = await upsert({ key: "about-us", title, heroImage });
      // Replacing the hero leaves the old asset unreferenced; Convex mutations
      // can't reach Cloudinary, so it is deleted here.
      if (orphaned) await destroyAsset(orphaned.publicId, orphaned.resourceType);
      await revalidateSite("site-content");
      toast.success("Hero section saved.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="gap-0 p-7">
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div>
          <h2 className="text-eyebrow uppercase text-muted-foreground">Hero section</h2>
          <hr className="rule mt-4" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="about-title">Title</Label>
          <Input id="about-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="about-hero">Hero image (leave empty to keep current)</Label>
          {heroImageUrl && (
            <div className="relative aspect-4/3 w-40 overflow-hidden rounded-lg bg-muted">
              <Image src={heroImageUrl} unoptimized alt="" fill sizes="160px" className="object-cover" />
            </div>
          )}
          <Input
            id="about-hero"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setHeroImageUrl(URL.createObjectURL(file));
            }}
          />
          <p className="text-xs text-muted-foreground">Delivered through Cloudinary, automatically compressed and format-converted per visitor.</p>
        </div>
        <Button type="submit" disabled={submitting} size="pill" className="w-fit">
          {submitting ? "Saving…" : "Save hero section"}
        </Button>
      </form>
    </Card>
  );
}

function BodySection({ initial }: { initial: Content }) {
  const upsert = useMutation(api.content.upsert);
  const [body, setBody] = useState(initial.body);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) {
      toast.error("Please fill in the body.");
      return;
    }
    setSubmitting(true);
    try {
      await upsert({ key: "about-us", body });
      await revalidateSite("site-content");
      toast.success("Body section saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="gap-0 p-7">
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div>
          <h2 className="text-eyebrow uppercase text-muted-foreground">Story / body</h2>
          <hr className="rule mt-4" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="about-body">Body (separate paragraphs with a blank line)</Label>
          <Textarea
            id="about-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            required
          />
        </div>
        <Button type="submit" disabled={submitting} size="pill" className="w-fit">
          {submitting ? "Saving…" : "Save body section"}
        </Button>
      </form>
    </Card>
  );
}

function QuoteSection({ initial }: { initial: Content }) {
  const upsert = useMutation(api.content.upsert);
  const [quote, setQuote] = useState(initial.quote);
  const [quoteAuthor, setQuoteAuthor] = useState(initial.quoteAuthor);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await upsert({ key: "about-us", quote, quoteAuthor });
      await revalidateSite("site-content");
      toast.success("Quote section saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="gap-0 p-7">
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div>
          <h2 className="text-eyebrow uppercase text-muted-foreground">Pull quote</h2>
          <hr className="rule mt-4" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="about-quote">Quote</Label>
          <Textarea id="about-quote" value={quote} onChange={(e) => setQuote(e.target.value)} rows={2} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="about-quote-author">Attribution</Label>
          <Input
            id="about-quote-author"
            value={quoteAuthor}
            onChange={(e) => setQuoteAuthor(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={submitting} size="pill" className="w-fit">
          {submitting ? "Saving…" : "Save quote section"}
        </Button>
      </form>
    </Card>
  );
}

function ValuesSection({ initial }: { initial: Content }) {
  const upsert = useMutation(api.content.upsert);
  const [values, setValues] = useState<ValueItem[]>(initial.values);
  const [submitting, setSubmitting] = useState(false);

  function updateValue(index: number, patch: Partial<ValueItem>) {
    setValues((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (values.some((v) => !v.title.trim() || !v.body.trim())) {
      toast.error("Please fill in all value titles and descriptions.");
      return;
    }
    setSubmitting(true);
    try {
      await upsert({ key: "about-us", values });
      await revalidateSite("site-content");
      toast.success("Values section saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="gap-0 p-7">
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div>
          <h2 className="text-eyebrow uppercase text-muted-foreground">Our values (4 cards)</h2>
          <hr className="rule mt-4" />
        </div>
        {values.map((v, i) => (
          <div key={i} className="grid gap-2 rounded-lg border border-border p-3">
            <div className="grid gap-2">
              <Label htmlFor={`value-title-${i}`}>Title {i + 1}</Label>
              <Input
                id={`value-title-${i}`}
                value={v.title}
                onChange={(e) => updateValue(i, { title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`value-body-${i}`}>Description {i + 1}</Label>
              <Input
                id={`value-body-${i}`}
                value={v.body}
                onChange={(e) => updateValue(i, { body: e.target.value })}
                required
              />
            </div>
          </div>
        ))}
        <Button type="submit" disabled={submitting} size="pill" className="w-fit">
          {submitting ? "Saving…" : "Save values section"}
        </Button>
      </form>
    </Card>
  );
}

function RichTextForm({
  contentKey,
  withHeroImage,
  initial,
}: {
  contentKey: ContentKey;
  withHeroImage: boolean;
  initial: Content;
}) {
  const upsert = useMutation(api.content.upsert);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);
  const [heroImageUrl, setHeroImageUrl] = useState(initial.heroImageUrl);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Please fill in the title and body.");
      return;
    }

    setSubmitting(true);
    try {
      const file = fileInputRef.current?.files?.[0];
      const heroImage =
        withHeroImage && file ? await uploadMedia(file) : undefined;

      const { orphaned } = await upsert({ key: contentKey, title, body, heroImage, richText: true });
      if (orphaned) await destroyAsset(orphaned.publicId, orphaned.resourceType);
      await revalidateSite("site-content");
      toast.success("Saved.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="max-w-2xl gap-0 p-7">
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor={`${contentKey}-title`}>Title</Label>
          <Input id={`${contentKey}-title`} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${contentKey}-body`}>Body</Label>
          <RichTextEditor value={body} onChange={setBody} />
        </div>
        {withHeroImage && (
          <div className="grid gap-2">
            <Label htmlFor={`${contentKey}-hero`}>Hero image (leave empty to keep current)</Label>
            {heroImageUrl && (
              <div className="relative aspect-4/3 w-40 overflow-hidden rounded-lg bg-muted">
                <Image src={heroImageUrl} unoptimized alt="" fill sizes="160px" className="object-cover" />
              </div>
            )}
            <Input
              id={`${contentKey}-hero`}
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setHeroImageUrl(URL.createObjectURL(file));
              }}
            />
            <p className="text-xs text-muted-foreground">Delivered through Cloudinary, automatically compressed and format-converted per visitor.</p>
          </div>
        )}
        <Button type="submit" disabled={submitting} size="pill" className="w-fit">
          {submitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
