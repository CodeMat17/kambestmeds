import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <>
      {/* Mirrors PageHeader so the transition into the real page has no jump. */}
      <div className="border-b border-rule bg-paper-deep">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-6 h-12 w-full max-w-xl" />
          <Skeleton className="mt-6 h-4 w-full max-w-lg" />
          <Skeleton className="mt-2 h-4 w-2/3 max-w-sm" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-card ring-1 ring-rule"
            >
              <Skeleton className="aspect-4/3 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <div className="flex items-center justify-between gap-3 border-t border-rule pt-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-9 w-20 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-11 rounded-full" />
                  <Skeleton className="h-11 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
