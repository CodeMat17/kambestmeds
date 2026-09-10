import type { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";
import { getSiteContent } from "@/lib/site-data";
import { Section, PageHeader } from "@/components/section";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "KAMBEST Tradomedical Center's terms of service.",
};

const fallback = {
  title: "Terms of Service",
  body: "<p>By ordering from or contacting KAMBEST Health Solutions, you agree that product information is provided as part of our herbal wellness guidance as a qualified health practitioner. For serious medical conditions, please reach out to our team directly for proper guidance.</p>",
};

// Must be a literal for Next's static segment-config analysis; keep in sync
// with SITE_REVALIDATE in lib/site-data.ts.
export const revalidate = 3600;

export default async function TermsPage() {
  let content: { title: string; body: string } = fallback;
  try {
    const result = await getSiteContent("terms");
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
