"use client";

import { site } from "@/features/shared/data/site";
import Hoverable from "@/components/common/Hoverable";
import { useEffect, useState } from "react";
import { MessengerIcon, WhatsappIcon } from "./SocialIcons";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fixed bottom-2 right-2 z-50 flex flex-col items-end gap-2">
      {showTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="animate-float-in grid h-8 w-8 mr-2 place-items-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      )}

      <Hoverable>
        <a
          href={site.messenger}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on Messenger with Techpunno"
          title="Chat on Messenger with Techpunno"
          className="animate-float-in grid h-12 w-12 place-items-center rounded-full bg-[#0084FF] text-white transition-transform hover:-translate-y-1"
        >
          <MessengerIcon size={22} />
        </a>
      </Hoverable>

      <Hoverable>
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp with Techpunno"
          title="Chat on WhatsApp with Techpunno"
          className="animate-float-in grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white transition-transform hover:-translate-y-1"
        >
          <WhatsappIcon size={22} />
        </a>
      </Hoverable>
    </div>
  );
}
