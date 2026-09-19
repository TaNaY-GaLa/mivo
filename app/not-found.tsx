import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center justify-center text-center space-y-6">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
        <Compass className="h-7 w-7" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          404 — Page Not Found
        </span>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          This piece isn&apos;t here.
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          The page or product you&apos;re looking for couldn&apos;t be found or may have been moved.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/">
          <Button className="gap-2 rounded-xl px-6 py-5 text-xs font-medium">
            <ArrowLeft className="h-4 w-4" />
            Return to Storefront
          </Button>
        </Link>
      </div>
    </div>
  );
}
