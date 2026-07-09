import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import DOMPurify from "isomorphic-dompurify";
import { api } from "@/convex/_generated/api";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "KAMBEST Tradomedical Center's privacy policy.",
};

const fallback = {
  title: "Privacy Policy",
  body: "<p>KAMBEST Health Solutions respects your privacy. Information you share with us — such as your name, phone number, or order details — is used solely to process your orders and enquiries via WhatsApp, and is never sold or shared with third parties.</p>",
};

export default async function PrivacyPage() {
  let content: { title: string; body: string } = fallback;
  try {
    const result = await fetchQuery(api.content.get, { key: "privacy" });
    if (result?.title && result?.body) {
      content = { title: result.title, body: result.body };
    }
  } catch (error) {
    console.error("Failed to load privacy content from Convex:", error);
  }
  const body = DOMPurify.sanitize(content.body, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "a", "h2", "h3"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold">{content.title}</h1>
      <div className="richtext mt-4" dangerouslySetInnerHTML={{ __html: body }} />
    </section>
  );
}
