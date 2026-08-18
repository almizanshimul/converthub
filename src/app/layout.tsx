import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/seo/json-ld";
import { websiteSchema, organizationSchema } from "@/lib/seo/schema";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "ConvertHub — Unit Converters, Calculators & Land Info",
    template: "%s — ConvertHub",
  },
  description:
    "Free online unit converters, calculators, currency conversion, and region-specific land measurement tools.",
  // The actual image comes from the opengraph-image.png / twitter-image.alt.txt
  // file convention in src/app/[locale]/ (Next.js wires up og:image and
  // twitter:image automatically from that file) — this just tells Twitter/X to
  // render it as the large-image card instead of the small "summary" thumbnail.
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // NOTE: lang is intentionally static here (not derived from the [locale] segment) so this
  // shell keeps full static generation. [locale]/layout.tsx below sets the real per-locale
  // <html lang>/dir via a tiny client sync — see LocaleHtmlAttrs.
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema()} />
        {children}
      </body>
    </html>
  );
}
