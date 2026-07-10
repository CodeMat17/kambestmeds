import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { staggerChildren, fadeUp } from "@/lib/motion";

type LabMediaItem = {
  _id: string;
  mediaUrl: string | null;
  type: "image" | "video";
  caption?: string;
};

export function LabGallery({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: LabMediaItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal className="text-center">
        <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
        )}
      </Reveal>

      <Reveal
        variants={staggerChildren}
        className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {items.map((item) => (
          <Reveal key={item._id} variants={fadeUp}>
            <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-muted">
              {item.mediaUrl && item.type === "image" && (
                <Image
                  src={item.mediaUrl}
                  alt={item.caption ?? "KAMBEST lab machine"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              )}
              {item.mediaUrl && item.type === "video" && (
                <video
                  src={item.mediaUrl}
                  muted
                  playsInline
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  className="size-full object-contain"
                />
              )}
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-sm font-medium text-white">{item.caption}</p>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </Reveal>
    </section>
  );
}
