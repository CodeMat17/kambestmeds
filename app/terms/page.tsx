import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import DOMPurify from "isomorphic-dompurify";
import { api } from "@/convex/_generated/api";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "KAMBEST Tradomedical Center's terms of service.",
};

const fallback = {
  title: "Terms of Service",
  body: "<p>By ordering from or contacting KAMBEST Health Solutions, you agree that product information is provided as part of our herbal wellness guidance as a qualified health practitioner. For serious medical conditions, please reach out to our team directly for proper guidance.</p>",
};

export default async function TermsPage() {
  let content: { title: string; body: string } = fallback;
  try {
    const result = await fetchQuery(api.content.get, { key: "terms" });
    if (result?.title && result?.body) {
      content = { title: result.title, body: result.body };
    }
  } catch (error) {
    console.error("Failed to load terms content from Convex:", error);
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
