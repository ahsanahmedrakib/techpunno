"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom"
  | "flip"
  | "blur";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Animation style. Defaults to fade-up which adapts to scroll direction. */
  variant?: RevealVariant;
  /** Delay in ms before the animation starts (used to stagger siblings). */
  delay?: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Pixel distance to slide when entering the viewport. */
  distance?: number;
  /** Optional initial scale (e.g. 0.9) for a zoom-in effect. */
  scale?: number;
  /** When false the element re-animates every time it re-enters the viewport (scrolling up or down). */
  once?: boolean;
};

export default function Reveal({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
  duration = 700,
  distance = 36,
  scale,
  once = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dirRef = useRef<"down" | "up">("down");
  const [shown, setShown] = useState(false);
  const [fromTop, setFromTop] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let prevY = typeof window !== "undefined" ? window.scrollY : 0;
    const onScroll = () => {
      const y = window.scrollY;
      dirRef.current = y < prevY ? "up" : "down";
      prevY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            setFromTop(dirRef.current === "up");
            if (once) {
              io.unobserve(entry.target);
              window.removeEventListener("scroll", onScroll);
            }
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [once]);

  const hidden = !shown;
  const dir = fromTop ? -1 : 1;
  const transform = shown
    ? "none"
    : variant === "zoom"
      ? `scale(${scale ?? 0.85})`
      : variant === "fade-left"
        ? `translateX(${-distance}px)`
        : variant === "fade-right"
          ? `translateX(${distance}px)`
          : variant === "fade-down"
            ? `translateY(${-distance}px)`
            : variant === "flip"
              ? `perspective(1200px) rotateX(${30 * dir}deg)`
              : variant === "blur"
                ? `translateY(${dir * distance}px) blur(8px)`
                : `translateY(${dir * distance}px)${
                    scale ? ` scale(${scale})` : ""
                  }`;

  const style: CSSProperties = {
    opacity: hidden ? 0 : 1,
    transform,
    transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    willChange: "opacity, transform, filter",
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
