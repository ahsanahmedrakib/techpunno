import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Providers from "@/components/common/Providers";
import SiteChrome from "@/components/common/SiteChrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechPunno — Building a Safe Digital Society",
  description:
    "TechPunno is a non-profit technology organization in Bangladesh working on cyber awareness, digital literacy and a safe digital society.",
  keywords: [
    "TechPunno",
    "Bangladesh",
    "cyber security",
    "digital literacy",
    "NGO",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}

