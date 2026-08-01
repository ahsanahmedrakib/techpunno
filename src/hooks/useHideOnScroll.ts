"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

export function useHideOnScroll() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const isScrollingDown = latest > previous;

    setHidden(isScrollingDown && latest > 160);
    setScrolled(latest > 24);
  });

  return { hidden, scrolled };
}
