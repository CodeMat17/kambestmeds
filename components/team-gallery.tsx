import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { staggerChildren, fadeUp } from "@/lib/motion";

type TeamMember = {
  _id: string;
  photoUrl: string | null;
};

export function TeamGallery({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: TeamMember[];
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
        className="mt-12 flex flex-wrap justify-center gap-8"
      >
        {items.map((item) => (
          <Reveal
            key={item._id}
            variants={fadeUp}
            className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]"
          >
            <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
              {item.photoUrl && (
                <Image
                  src={item.photoUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              )}
            </div>
          </Reveal>
        ))}
      </Reveal>
    </section>
  );
}
