import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ProductsLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Skeleton className="mx-auto h-9 w-64" />
        <Skeleton className="mx-auto mt-4 h-4 w-full" />
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden p-0">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
