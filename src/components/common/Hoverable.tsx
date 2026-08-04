"use client";

import { useRef, type ReactNode } from "react";

interface HoverableProps {
  children: ReactNode;
  className?: string;
}

export default function Hoverable({ children, className = "" }: HoverableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    ref.current?.removeAttribute("data-tapped");
  };

  const handleTouchStart = () => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) {
      clear();
      ref.current?.setAttribute("data-tapped", "true");
    }
  };

  const handleTouchEnd = () => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) {
      timer.current = setTimeout(clear, 600);
    }
  };

  return (
    <div
      ref={ref}
      data-hoverable
      className={`group ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseLeave={clear}
    >
      {children}
    </div>
  );
}
