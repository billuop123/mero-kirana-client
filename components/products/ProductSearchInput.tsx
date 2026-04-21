"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Product } from "@/lib/types";

type Props = { defaultValue?: string };

export default function ProductSearchInput({ defaultValue = "" }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 1) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        const data: Product[] = await res.json();
        setSuggestions(data ?? []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function selectSuggestion(product: Product) {
    setQuery(product.name);
    setOpen(false);
    router.push(`/dashboard/products?search=${encodeURIComponent(product.name)}`);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    if (query.trim()) {
      router.push(`/dashboard/products?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/dashboard/products");
    }
  }

  function clearSearch() {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    router.push("/dashboard/products");
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <form onSubmit={submitSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Search products…"
            className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm pl-9 pr-8 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all"
          />
          {loading && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
          )}
          {!loading && query && (
            <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute z-20 top-full mt-1.5 left-0 right-12 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          {suggestions.map((p) => (
            <button
              key={p.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectSuggestion(p)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400 capitalize">{p.category} · {p.unit}</p>
              </div>
              <p className="text-sm font-semibold text-gray-500 group-hover:text-gray-900 transition-colors">
                Rs. {p.sellingPrice}
              </p>
            </button>
          ))}
        </div>
      )}

      {open && query.trim().length > 0 && suggestions.length === 0 && !loading && (
        <div className="absolute z-20 top-full mt-1.5 left-0 right-12 bg-white rounded-xl border border-gray-200 shadow-lg px-4 py-3">
          <p className="text-sm text-gray-400">No products found for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
