import Image from "next/image";
import {
  imageUrl,
  videoUrl,
  videoPosterUrl,
  type CloudinaryMedia,
} from "@/lib/cloudinary";
import { Reveal } from "@/components/reveal";
import { Section, SectionHeading } from "@/components/section";
import { staggerChildren, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type LabMediaItem = {
  _id: string;
  media: CloudinaryMedia;
  caption?: string;
};

export function LabGallery({
  eyebrow,
  title,
  subtitle,
  items,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: LabMediaItem[];
}) {
  if (items.length === 0) return null;

  return (
    <Section>
      <SectionHeading eyebrow={eyebrow} title={title} lede={subtitle} />

      {/* Editorial mosaic: the first frame is given twice the weight, so the
          grid reads as a composed spread rather than a uniform contact sheet. */}
      <Reveal
        variants={staggerChildren}
        className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-fr lg:grid-cols-4"
      >
        {items.map((item, i) => {
          const featured = i === 0;
          return (
            <Reveal
              key={item._id}
              variants={fadeUp}
              className={cn("min-w-0", featured && "col-span-2 lg:row-span-2")}
            >
              <figure
                className={cn(
                  // `w-full` is load-bearing: without a definite width, an
                  // aspect-ratio box stretched by `h-full` resolves its width
                  // *from* that height and overflows the column.
                  "frame group relative w-full rounded-xl",
                  featured
                    ? "aspect-4/3 lg:aspect-auto lg:h-full"
                    : "aspect-3/4",
                )}
              >
                {item.media.resourceType === "image" && (
                  <Image
                    src={imageUrl(item.media, {
                      width: featured ? 1200 : 800,
                      crop: "fill",
                    })}
                    unoptimized
                    alt={item.caption ?? "KAMBEST lab machine"}
                    fill
                    sizes={
                      featured
                        ? "(max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    }
                    className="object-cover transition-transform duration-900 ease-editorial group-hover:scale-105"
                  />
                )}
                {item.media.resourceType === "video" && (
                  <video
                    src={videoUrl(item.media)}
                    poster={videoPosterUrl(item.media)}
                    muted
                    playsInline
                    controls
                    controlsList="nodownload noremoteplayback"
                    disablePictureInPicture
                    className="size-full bg-black object-contain"
                  />
                )}

                {item.caption && item.media.resourceType === "image" && (
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/25 to-transparent p-4 pt-10">
                    <span className="text-eyebrow uppercase text-white/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-1.5 text-sm font-semibold leading-snug text-white">
                      {item.caption}
                    </p>
                  </figcaption>
                )}
              </figure>
            </Reveal>
          );
        })}
      </Reveal>
    </Section>
  );
}
