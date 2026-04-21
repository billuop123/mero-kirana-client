import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "आफ्नो Kirana — Simple POS for Nepali Kirana Shops",
    template: "%s | आफ्नो Kirana",
  },
  description:
    "Free POS and inventory management system for Nepali kirana shops. Create bills in seconds, track stock, manage udhari, and see daily sales reports.",
  keywords: [
    "kirana shop software Nepal",
    "POS Nepal",
    "billing software Nepal",
    "inventory management Nepal",
    "udhari tracking Nepal",
    "shop management Nepal",
    "किराना पसल सफ्टवेयर",
    "billing software kirana",
    "free POS Nepal",
  ],
  authors: [{ name: "आफ्नो Kirana" }],
  creator: "आफ्नो Kirana",
  publisher: "आफ्नो Kirana",
  category: "Business Software",
  openGraph: {
    type: "website",
    locale: "ne_NP",
    alternateLocale: "en_US",
    url: BASE,
    siteName: "आफ्नो Kirana",
    title: "आफ्नो Kirana — Simple POS for Nepali Kirana Shops",
    description:
      "Free POS and inventory management system for Nepali kirana shops. Create bills in seconds, track stock, manage udhari, and see daily sales reports.",
  },
  twitter: {
    card: "summary_large_image",
    title: "आफ्नो Kirana — Simple POS for Nepali Kirana Shops",
    description:
      "Free POS and inventory management for Nepali kirana shops. Bill customers, track stock, manage udhari.",
    creator: "@aafnokirana",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE,
    languages: {
      "ne-NP": `${BASE}/ne`,
      "en-US": BASE,
    },
  },
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION ?? "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ne"
      className={`${plusJakarta.variable} ${notoDevanagari.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#111827" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
