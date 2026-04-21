import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  alternates: { canonical: BASE },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: "आफ्नो Kirana",
      description:
        "Free POS and inventory management system for Nepali kirana shops.",
      inLanguage: ["ne-NP", "en-US"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE}/#app`,
      name: "आफ्नो Kirana",
      url: BASE,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NPR",
      },
      description:
        "Simple POS and inventory management for Nepali kirana shops. Create bills in seconds, track stock, manage udhari, and view daily sales reports.",
      featureList: [
        "Fast bill creation",
        "Inventory tracking with low-stock alerts",
        "Udhari (credit) management",
        "Daily, weekly and monthly sales reports",
        "QR-code receipts for customers",
        "Google sign-in",
      ],
      screenshot: `${BASE}/opengraph-image`,
      inLanguage: "ne-NP",
    },
    {
      "@type": "Organization",
      "@id": `${BASE}/#org`,
      name: "आफ्नो Kirana",
      url: BASE,
      logo: `${BASE}/favicon.ico`,
    },
  ],
};
import {
  ShoppingCart,
  Receipt,
  Package,
  HandCoins,
  BarChart2,
  Tag,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    Icon: Receipt,
    title: "Fast Billing",
    desc: "Create bills in seconds. Search products by name or barcode, apply discounts, and choose cash, card, or digital payment.",
  },
  {
    Icon: Package,
    title: "Inventory Tracking",
    desc: "Know exactly what's in stock. Get low-stock alerts before you run out, and restock with a single tap.",
  },
  {
    Icon: HandCoins,
    title: "Udhari Management",
    desc: "Track credit given to customers. See who owes how much and mark bills as paid when they settle up.",
  },
  {
    Icon: BarChart2,
    title: "Sales Reports",
    desc: "Daily, weekly, and monthly summaries. See your top-selling products and profit at a glance.",
  },
  {
    Icon: Tag,
    title: "Multi-category Products",
    desc: "Organize products across grocery, dairy, beverages, snacks, household, and more.",
  },
  {
    Icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Your shop data belongs to you. Each shop owner gets their own isolated account.",
  },
];

export default async function LandingPage() {
  const token = await getServerToken();
  if (token) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <ShoppingCart size={20} className="text-gray-900" />
            <span className="font-bold text-lg tracking-tight">आफ्नो Kirana</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/signin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Made for Nepal
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl mb-6">
          Run your kirana shop
          <br />
          <span className="text-green-600">without the chaos</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
          आफ्नो Kirana is a simple POS and inventory system built for small shops. Bill customers,
          track stock, manage udhari, and understand your sales — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/signup"
            className="px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors text-sm"
          >
            Start for free
          </Link>
          <Link
            href="/signin"
            className="px-8 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            I already have an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Everything your shop needs</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              No training required. If you can use a phone, you can use आफ्नो Kirana.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <Icon size={17} className="text-gray-700" />
                </div>
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-16 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "< 30s", label: "to create a bill" },
            { value: "8", label: "product categories" },
            { value: "100%", label: "your data" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get organised?</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Set up your shop in minutes. No credit card, no complicated setup.
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm"
        >
          Create your free account
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} आफ्नो Kirana. Built for Nepali shopkeepers.
      </footer>
    </div>
  );
}
