import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth";
import {
  ShoppingBag,
  Receipt,
  Package,
  HandCoins,
  BarChart2,
  Tag,
  ShieldCheck,
  ArrowRight,
  Zap,
} from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  alternates: { canonical: BASE },
  title: "आफ्नो किराना — नेपाली किराना पसलको लागि सजिलो POS सफ्टवेयर",
  description:
    "आफ्नो किराना — नेपाली किराना पसलको लागि निःशुल्क POS र स्टक व्यवस्थापन सफ्टवेयर। छिटो बिल बनाउनुहोस्, स्टक ट्र्याक गर्नुहोस्, उधारी व्यवस्थापन गर्नुहोस्।",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: "आफ्नो Kirana",
      description: "Free POS and inventory management system for Nepali kirana shops.",
      inLanguage: ["ne-NP", "en-US"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE}/#app`,
      name: "आफ्नो Kirana",
      url: BASE,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "NPR" },
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

const features = [
  {
    Icon: Receipt,
    title: "Fast Billing",
    desc: "Create bills in seconds. Search by name or barcode, apply discounts, and accept cash, card, eSewa, or Khalti.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    Icon: Package,
    title: "Inventory Tracking",
    desc: "Know exactly what's in stock. Get low-stock alerts before you run out and restock with a single tap.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    Icon: HandCoins,
    title: "Udhari Management",
    desc: "Track credit given to customers. See who owes how much and mark bills as paid when they settle up.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    Icon: BarChart2,
    title: "Sales Reports",
    desc: "Daily, weekly, and monthly summaries. See your top-selling products and profit at a glance.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    Icon: Tag,
    title: "Multi-category Products",
    desc: "Organise products across grocery, dairy, beverages, snacks, household, and more.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    Icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Your shop data belongs to you. Each shop owner gets their own isolated, private account.",
    color: "bg-rose-100 text-rose-600",
  },
];

const testimonials = [
  {
    quote: "Pahila khata likhna ghanta lagthyo. Ab 30 second maa bill bancha.",
    name: "Ramesh Shrestha",
    role: "Kirana owner, Pokhara",
    initials: "RS",
  },
  {
    quote: "Udhari ko jhanjhat gayyo. Kasle kati liyeko chha thaha huncha.",
    name: "Sunita Tamang",
    role: "General store, Biratnagar",
    initials: "ST",
  },
  {
    quote: "आफ्नो किराना प्रयोग गरेपछि पसल चलाउन धेरै सजिलो भयो। स्टक सकिन लाग्दा अलर्ट आउँछ, उधारीको हिसाब मिल्छ।",
    name: "प्रकाश थापा",
    role: "किराना पसल, काठमाडौं",
    initials: "PT",
  },
  {
    quote: "अब कापीमा हिसाब लेख्न पर्दैन। आफ्नो किरानाले सबै गर्छ — बिल, स्टक, उधारी एकै ठाउँमा।",
    name: "मनिषा गुरुङ",
    role: "जनरल स्टोर, पोखरा",
    initials: "MG",
  },
];

export default async function LandingPage() {
  const token = await getServerToken();
  if (token) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navbar */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between bg-[#1c1917]/90 backdrop-blur-md border border-[#292524] rounded-2xl px-4 h-14 shadow-sm">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
              <ShoppingBag size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">आफ्नो Kirana</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/signin"
              className="text-sm font-medium text-stone-400 hover:text-white px-4 py-2 rounded-lg hover:bg-[#292524] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Get Started
            </Link>
          </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-36 pb-20 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-400 opacity-[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-orange-200">
            <Zap size={11} fill="currentColor" />
            आफ्नो किराना — नेपाली किराना पसलका लागि
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-3xl mb-6 text-stone-900">
            Run your kirana shop
            <br />
            <span className="text-orange-500">without the chaos</span>
          </h1>

          <p className="text-base text-orange-600 font-semibold mb-2">
            आफ्नो किराना — सजिलो, छिटो, र निःशुल्क किराना पसल व्यवस्थापन
          </p>

          <p className="text-lg text-stone-500 max-w-xl mb-10 leading-relaxed mx-auto">
            आफ्नो Kirana is a simple POS and inventory system built for small shops in Nepal.
            Bill customers, track stock, manage udhari — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all text-sm"
            >
              Start for free
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/signin"
              className="px-8 py-3.5 border border-stone-200 text-stone-700 font-semibold rounded-xl hover:bg-stone-100 transition-colors text-sm"
            >
              I already have an account
            </Link>
          </div>

          <p className="text-xs text-stone-400 mt-4">No credit card. No setup fee. Free forever.</p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-12 px-6 border-y border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "< 30s", label: "to create a bill" },
            { value: "8+", label: "product categories" },
            { value: "100%", label: "your data" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-orange-500 mb-1">{s.value}</div>
              <div className="text-sm text-stone-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-stone-900">
              Everything your shop needs
            </h2>
            <p className="text-stone-500 max-w-lg mx-auto">
              No training required. If you can use a phone, you can use आफ्नो Kirana.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-stone-100 hover:border-stone-200 hover:shadow-sm transition-all group"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}
                >
                  <Icon size={18} />
                </div>
                <h3 className="font-semibold text-base mb-2 text-stone-900">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nepali content block — targets "आफ्नो किराना" search */}
      <section className="py-16 px-6 bg-orange-50 border-y border-orange-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">
            आफ्नो किराना के हो?
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            <strong>आफ्नो किराना</strong> एक सरल र निःशुल्क POS (Point of Sale) सफ्टवेयर हो जुन
            नेपाली किराना पसलका लागि बनाइएको छ। यसले तपाईंलाई छिटो बिल बनाउन,
            स्टक ट्र्याक गर्न, उधारी व्यवस्थापन गर्न, र बिक्री रिपोर्ट हेर्न मद्दत गर्छ।
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {[
              { label: "छिटो बिलिङ", desc: "३० सेकेन्डमा बिल बनाउनुहोस्" },
              { label: "स्टक ट्र्याकिङ", desc: "कम स्टकमा अलर्ट पाउनुहोस्" },
              { label: "उधारी व्यवस्थापन", desc: "उधारीको हिसाब सजिलै राख्नुहोस्" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-4 border border-orange-100">
                <p className="font-semibold text-orange-600 mb-1">{item.label}</p>
                <p className="text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white border-y border-stone-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-orange-500 mb-10">
            Shopkeepers love it
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <p className="text-stone-700 text-sm leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0f0a05] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500 opacity-[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to get organised?</h2>
          <p className="text-stone-400 mb-8">
            Set up your shop in minutes. No credit card, no complicated setup.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all text-sm"
          >
            Create your free account
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#0f0a05] border-t border-[#1c1917] text-center text-sm text-stone-600">
        © {new Date().getFullYear()} आफ्नो Kirana — Built for Nepali shopkeepers.
      </footer>
    </div>
  );
}
