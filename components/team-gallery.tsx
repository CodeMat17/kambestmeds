import Image from "next/image";
import { imageUrl, type CloudinaryMedia } from "@/lib/cloudinary";
import { Reveal } from "@/components/reveal";
import { Section, SectionHeading } from "@/components/section";
import { staggerChildren, fadeUp } from "@/lib/motion";

type TeamMember = {
  _id: string;
  photo: CloudinaryMedia;
};

export function TeamGallery({
  eyebrow,
  title,
  subtitle,
  items,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: TeamMember[];
}) {
  if (items.length === 0) return null;

  return (
    <Section tone="deep">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        lede={subtitle}
        align="center"
      />

      <Reveal
        variants={staggerChildren}
        className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item) => (
          <Reveal key={item._id} variants={fadeUp} className="min-w-0">
            {/* Portrait crop rather than 16:9 — people should be framed like
                portraits, not like video thumbnails. */}
            <div className="frame group aspect-4/5 w-full rounded-xl">
              {item.photo && (
                <Image
                  src={imageUrl(item.photo, { width: 800, crop: "fill" })}
                  unoptimized
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-900 ease-editorial group-hover:scale-105"
                />
              )}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>
          </Reveal>
        ))}
      </Reveal>
    </Section>
  );
}
