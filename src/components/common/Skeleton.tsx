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
    <div className="relative overflow-hidden pt-18">
      <div className="relative flex min-h-[calc(100svh-4.5rem)] items-center bg-linear-to-br from-primary-tint via-cream to-primary-lighter px-4 py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="max-w-xl">
            <Skeleton className="mb-5 h-7 w-28 rounded-full" />
            <Skeleton className="mb-3 h-12 w-full" />
            <Skeleton className="mb-3 h-12 w-4/5" />
            <Skeleton className="mb-3 h-5 w-full" />
            <Skeleton className="mb-8 h-5 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-40 rounded-full" />
              <Skeleton className="h-12 w-48 rounded-full" />
            </div>
          </div>

          <div className="relative mx-auto hidden h-85 w-85 sm:h-105 sm:w-105 lg:block">
            <Skeleton className="h-full w-full rounded-full" />
            <div className="absolute left-0 top-8 h-12 w-36 rounded-2xl" />
            <div className="absolute right-0 bottom-16 h-12 w-36 rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="relative border-t border-ink/5 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 py-6 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center gap-3 px-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonTeamCard() {
  return (
    <div className="h-full rounded-3xl p-0.5 shadow-sm bg-gradient-admin">
      <div className="flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-white">
        <Skeleton className="aspect-4/3 w-full rounded-none" />
        <div className="flex flex-1 flex-col items-center px-6 py-6">
          <Skeleton className="mb-3 h-5 w-2/3" />
          <Skeleton className="mb-3 h-6 w-1/2 rounded-full" />
          <Skeleton className="h-4 w-full" />
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
    <div>
      <div className="overflow-hidden rounded-3xl bg-ink shadow-2xl shadow-ink/20 ring-1 ring-ink/10">
        <div className="relative aspect-video w-full overflow-hidden bg-black/25">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
      <div className="mt-5 flex items-start gap-3">
        <span className="relative mt-1 block h-8 w-8 shrink-0 overflow-hidden rounded-full bg-secondary/30">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/40 to-transparent" />
        </span>
        <div className="relative mt-2.5 h-5 max-w-md flex-1 overflow-hidden rounded bg-ink/10">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonVideoItem() {
  return (
    <div className="flex w-full gap-4 rounded-2xl border border-ink/5 bg-white p-3 shadow-sm">
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-ink/10">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/50 to-transparent" />
      </div>
      <div className="min-w-0 flex-1 py-1">
        <div className="relative h-4 w-full overflow-hidden rounded bg-ink/10">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/50 to-transparent" />
        </div>
        <div className="relative mt-2.5 h-4 w-2/3 overflow-hidden rounded bg-ink/10">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCourseCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border-2 border-primary/40 bg-white shadow-sm">
      <div className="relative h-44 shrink-0 bg-ink/10">
        <Skeleton className="absolute left-4 top-4 h-6 w-20 rounded-full" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-ink/5 pt-4">
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
