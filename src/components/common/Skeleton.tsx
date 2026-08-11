"use client";

export default function Skeleton({
  className = "",
  count = 1,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-xl bg-ink/10 ${className}`}
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/50 to-transparent" />
        </div>
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
      <Skeleton className="h-5 w-2/3 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative flex min-h-[80vh] items-center bg-cream px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Skeleton className="mb-4 h-6 w-32 rounded-full" />
        <Skeleton className="mb-3 h-12 w-full" />
        <Skeleton className="mb-3 h-12 w-4/5" />
        <Skeleton className="mb-6 h-5 w-full" />
        <Skeleton className="mb-6 h-5 w-3/4" />
        <Skeleton className="h-12 w-40 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTeamCard() {
  return (
    <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonBlogCard() {
  return (
    <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm">
      <Skeleton className="mb-3 h-40 w-full rounded-xl" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function SkeletonEventCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border-2 border-primary/40 bg-white shadow-sm">
      <div className="relative h-44 shrink-0 bg-ink/10">
        <Skeleton className="absolute right-4 top-4 h-12 w-16" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-5 flex items-center justify-between border-t border-ink/5 pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonVideoCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-sm">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4">
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  );
}
