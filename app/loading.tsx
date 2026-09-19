import { ProductGridSkeleton } from "@/components/loading-skeleton";

export default function GlobalLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
      <ProductGridSkeleton />
    </div>
  );
}
