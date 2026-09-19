export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-4 animate-pulse">
      <div className="aspect-4/3 w-full rounded-xl bg-neutral-200 dark:bg-neutral-800 mb-4" />
      <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
      <div className="h-5 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded mb-3" />
      <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded mb-1" />
      <div className="h-3 w-4/5 bg-neutral-200 dark:bg-neutral-800 rounded mb-6" />
      <div className="flex justify-between items-center pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-8 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-20 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
          <div className="h-12 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
