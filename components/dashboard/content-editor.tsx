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
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";

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
    heroImageUrl: content?.heroImageUrl ?? null,
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

function useHeroUpload() {
  const generateUploadUrl = useMutation(api.content.generateUploadUrl);
  const optimizeUpload = useAction(api.images.optimizeUpload);

  async function upload(file: File) {
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
  const uploadHero = useHeroUpload();
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
      let heroImageId;
      const file = fileInputRef.current?.files?.[0];
      if (file) heroImageId = await uploadHero(file);

      await upsert({ key: "about-us", title, heroImageId });
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
          <Label htmlFor="about-title">Title</Label>
          <Input id="about-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="about-hero">Hero image (leave empty to keep current)</Label>
          {heroImageUrl && (
            <div className="relative aspect-4/3 w-40 overflow-hidden rounded-lg bg-muted">
              <Image src={heroImageUrl} alt="" fill sizes="160px" className="object-cover" />
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
          <p className="text-xs text-muted-foreground">Automatically optimized to under 150KB on upload.</p>
        </div>
        <Button type="submit" disabled={submitting} className="w-fit">
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
      toast.success("Body section saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <h2 className="font-bold">Story / body</h2>
        <div className="grid gap-1.5">
          <Label htmlFor="about-body">Body (separate paragraphs with a blank line)</Label>
          <Textarea
            id="about-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            required
          />
        </div>
        <Button type="submit" disabled={submitting} className="w-fit">
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
      toast.success("Quote section saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <h2 className="font-bold">Pull quote</h2>
        <div className="grid gap-1.5">
          <Label htmlFor="about-quote">Quote</Label>
          <Textarea id="about-quote" value={quote} onChange={(e) => setQuote(e.target.value)} rows={2} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="about-quote-author">Attribution</Label>
          <Input
            id="about-quote-author"
            value={quoteAuthor}
            onChange={(e) => setQuoteAuthor(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={submitting} className="w-fit">
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
      toast.success("Values section saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <h2 className="font-bold">Our values (4 cards)</h2>
        {values.map((v, i) => (
          <div key={i} className="grid gap-2 rounded-lg border border-border p-3">
            <div className="grid gap-1.5">
              <Label htmlFor={`value-title-${i}`}>Title {i + 1}</Label>
              <Input
                id={`value-title-${i}`}
                value={v.title}
                onChange={(e) => updateValue(i, { title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-1.5">
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
        <Button type="submit" disabled={submitting} className="w-fit">
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
  const uploadHero = useHeroUpload();
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
      let heroImageId;
      const file = fileInputRef.current?.files?.[0];
      if (withHeroImage && file) heroImageId = await uploadHero(file);

      await upsert({ key: contentKey, title, body, heroImageId, richText: true });
      toast.success("Saved.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="max-w-2xl p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor={`${contentKey}-title`}>Title</Label>
          <Input id={`${contentKey}-title`} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${contentKey}-body`}>Body</Label>
          <RichTextEditor value={body} onChange={setBody} />
        </div>
        {withHeroImage && (
          <div className="grid gap-1.5">
            <Label htmlFor={`${contentKey}-hero`}>Hero image (leave empty to keep current)</Label>
            {heroImageUrl && (
              <div className="relative aspect-4/3 w-40 overflow-hidden rounded-lg bg-muted">
                <Image src={heroImageUrl} alt="" fill sizes="160px" className="object-cover" />
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
            <p className="text-xs text-muted-foreground">Automatically optimized to under 150KB on upload.</p>
          </div>
        )}
        <Button type="submit" disabled={submitting} className="w-fit">
          {submitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
