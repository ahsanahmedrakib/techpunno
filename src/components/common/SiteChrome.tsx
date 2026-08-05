"use client";

import { usePathname } from "next/navigation";
import FloatingActions from "./FloatingActions";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showChrome = !pathname.startsWith("/admin");

  return (
    <>
      {showChrome && <Navbar />}
      {showChrome && <FloatingActions />}
      {children}
      {showChrome && <Footer />}
    </>
  );
}
