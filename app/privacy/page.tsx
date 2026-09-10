import type { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";
import { getSiteContent } from "@/lib/site-data";
import { Section, PageHeader } from "@/components/section";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "KAMBEST Tradomedical Center's privacy policy.",
};

const fallback = {
  title: "Privacy Policy",
  body: "<p>KAMBEST Health Solutions respects your privacy. Information you share with us — such as your name, phone number, or order details — is used solely to process your orders and enquiries via WhatsApp, and is never sold or shared with third parties.</p>",
};

// Must be a literal for Next's static segment-config analysis; keep in sync
// with SITE_REVALIDATE in lib/site-data.ts.
export const revalidate = 3600;

export default async function PrivacyPage() {
  let content: { title: string; body: string } = fallback;
  try {
    const result = await getSiteContent("privacy");
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
    <>
      <PageHeader eyebrow="Legal" title={content.title} />

      <Section className="py-16 sm:py-20" width="narrow">
        <Reveal>
          <div
            className="richtext"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Reveal>
      </Section>
    </>
  );
}
