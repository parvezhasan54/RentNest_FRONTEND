"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props { cities: string[]; categories: string[]; minPrice: number; maxPrice: number }

const selectCls =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function PropertyFilters({ cities, categories, minPrice, maxPrice }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [min, setMin] = useState(sp.get("minPrice") ?? "");
  const [max, setMax] = useState(sp.get("maxPrice") ?? "");

  const push = (changes: Record<string, string>) => {
    const p = new URLSearchParams(sp.toString());
    Object.entries(changes).forEach(([k, v]) => (!v || v.startsWith("All") ? p.delete(k) : p.set(k, v)));
    p.delete("page");
    router.push(`/properties?${p.toString()}`);
  };

  // debounce text + price inputs so we don't push on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      const next = { q: q.trim(), minPrice: min, maxPrice: max };
      const cur = { q: sp.get("q") ?? "", minPrice: sp.get("minPrice") ?? "", maxPrice: sp.get("maxPrice") ?? "" };
      if (JSON.stringify(next) !== JSON.stringify(cur)) push(next);
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, min, max]);

  const reset = () => { setQ(""); setMin(""); setMax(""); router.push("/properties"); };

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, city, neighborhood or address" className="h-10 pl-9" />
        </div>

        <select className={selectCls} value={sp.get("city") ?? "All cities"} onChange={(e) => push({ city: e.target.value })} aria-label="City">
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select className={selectCls} value={sp.get("category") ?? "All categories"} onChange={(e) => push({ category: e.target.value })} aria-label="Property type">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select className={selectCls} value={sp.get("bedrooms") ?? ""} onChange={(e) => push({ bedrooms: e.target.value })} aria-label="Bedrooms">
          <option value="">Any bedrooms</option>
          <option value="0">Studio</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option>
        </select>

        <select className={selectCls} value={sp.get("minRating") ?? ""} onChange={(e) => push({ minRating: e.target.value })} aria-label="Minimum rating">
          <option value="">Any rating</option><option value="3">3★ & up</option><option value="4">4★ & up</option><option value="4.5">4.5★ & up</option>
        </select>

        <Input type="number" min={0} value={min} onChange={(e) => setMin(e.target.value)} placeholder={`Min $ (${minPrice})`} className="h-10" />
        <Input type="number" min={0} value={max} onChange={(e) => setMax(e.target.value)} placeholder={`Max $ (${maxPrice})`} className="h-10" />

        <select className={selectCls} value={sp.get("sort") ?? ""} onChange={(e) => push({ sort: e.target.value })} aria-label="Sort">
          <option value="">Recommended</option><option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option><option value="newest">Newest</option><option value="rating">Top rated</option>
        </select>

        <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
      </div>
    </div>
  );
}