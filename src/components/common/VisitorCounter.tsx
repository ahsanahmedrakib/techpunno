"use client";

import Skeleton from "@/components/common/Skeleton";
import { useEffect, useState } from "react";

export default function VisitorCounter() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/visitors", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && typeof data.total === "number") {
          setTotal(data.total);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const display = total !== null ? total.toLocaleString() : "\u2014";

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-6">
      {total === null ? (
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-4 w-28 rounded-lg" />
        </div>
      ) : (
        <>
          <span className="text-3xl font-extrabold text-gradient">
            {display}
          </span>
          <span className="text-sm font-medium text-ink-soft">Visitors</span>
        </>
      )}
    </div>
  );
}
