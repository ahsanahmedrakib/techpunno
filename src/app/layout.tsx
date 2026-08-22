import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import Providers from "@/components/common/Providers";
import SiteChrome from "@/components/common/SiteChrome";
import { site } from "@/features/shared/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "TechPunno",
    "Bangladesh",
    "cyber security",
    "digital literacy",
    "NGO",
    "youth platform",
    "cyber awareness",
    "online safety",
    "digital Bangladesh",
    "volunteer",
    "technology education",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [site.ogImage],
    creator: site.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.name,
              url: site.url,
              logo: `${site.url}${site.logo}`,
              description: site.description,
              foundingDate: String(site.foundedYear),
              address: {
                "@type": "PostalAddress",
                addressLocality: "Gopalganj",
                addressCountry: "BD",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: site.phone,
                email: site.email,
                contactType: "customer service",
              },
              sameAs: [site.facebook, site.youtube],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}

