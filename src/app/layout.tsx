import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.dadacetwala.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // --- Core ---
  title: {
    default: "DadaCETwala – #1 MHTCET Counseling in Maharashtra",
    template: "%s | DadaCETwala",
  },
  description:
    "DadaCETwala is Maharashtra's most trusted MHTCET counseling platform. Get expert guidance on college selection, option form filling, CAP rounds, and admission strategy from experienced counselors.",
  keywords: [
    "DadaCETwala",
    "dadacetwala",
    "MHTCET counseling",
    "MHT CET college predictor",
    "Maharashtra engineering admission",
    "CAP round guidance",
    "MHTCET 2024",
    "college admission Maharashtra",
    "option form filling",
  ],
  authors: [{ name: "DadaCETwala", url: BASE_URL }],
  creator: "DadaCETwala",
  publisher: "DadaCETwala",

  // --- Canonical & Indexing ---
  alternates: {
    canonical: BASE_URL,
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

  // --- Open Graph (Facebook, WhatsApp, LinkedIn) ---
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "DadaCETwala",
    title: "DadaCETwala – #1 MHTCET Counseling in Maharashtra",
    description:
      "Maharashtra's most trusted MHTCET counseling platform. Expert guidance on college selection, CAP rounds, option form filling & more.",
    locale: "en_IN",
  },

  // --- Twitter / X Card ---
  twitter: {
    card: "summary_large_image",
    title: "DadaCETwala – #1 MHTCET Counseling in Maharashtra",
    description:
      "Expert MHTCET counseling, college predictor & CAP round guidance. Trusted by thousands of Maharashtra students.",
    creator: "@dadacetwala",
    site: "@dadacetwala",
  },

  // --- Icons / Favicon ---
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
  },

  // --- Verification (add your Search Console token here when ready) ---
  // verification: {
  //   google: "YOUR_GOOGLE_SITE_VERIFICATION_TOKEN",
  // },
};

// JSON-LD Structured Data — tells Google this is the official Organisation website
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DadaCETwala",
  alternateName: "Dada CET Wala",
  url: BASE_URL,
  description:
    "Maharashtra's most trusted MHTCET counseling platform offering expert college selection, CAP round, and option form filling guidance.",
  sameAs: [
    "https://www.instagram.com/dadacetwala",
    "https://www.youtube.com/@dadacetwala",
    "https://twitter.com/dadacetwala",
  ],
};

import CollegeCompanion from "@/components/features/CollegeCompanion";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CollegeCompanion />
      </body>
    </html>
  );
}
