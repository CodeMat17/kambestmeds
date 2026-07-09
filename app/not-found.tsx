import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <span className="text-6xl">🌿</span>
      <h1 className="mt-4 text-3xl font-extrabold">Page Not Found</h1>
      <p className="mt-3 text-muted-foreground">
        This path doesn&rsquo;t lead anywhere on our tradomedical journey — let&rsquo;s
        get you back on track.
      </p>
      <Button size="lg" className="mt-6" render={<Link href="/" />}>
        Back to Home
      </Button>
    </section>
  );
}
