import Link from "next/link";

import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Props } from "@/types/property";
import { getProperties } from "@/service/property.service";
import { getSavedPropertyIds } from "@/service/getSavedPropertyIds";
import PropertyFilters from "./_component/PropertyFilters";
import PropertyCard from "./_component/PropertyCard";

const PAGE_SIZE = 12; // 3 rows of 4

const PropertiesPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [{ data: properties, meta }, { data: all }, savedIds] = await Promise.all([
    getProperties({ ...params, page, limit: PAGE_SIZE }),
    getProperties({ limit: "all" }), // only used to build the filter option lists
    getSavedPropertyIds(),
  ]);

  const cities = Array.from(new Set(all.map((p) => p.city))).sort();
  const categories = Array.from(new Set(all.map((p) => p.category.name))).sort();
  const prices = all.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const pageUrl = (n: number) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") q.set(k, String(v));
    });
    q.set("page", String(n));
    return `/properties?${q.toString()}`;
  };

  const pages = (): (number | "...")[] => {
    const total = meta.totalPage;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const out: (number | "...")[] = [1];
    if (page > 3) out.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) out.push(i);
    if (page < total - 2) out.push("...");
    out.push(total);
    return out;
  };

   return (
    <div className="min-h-screen bg-muted/30">
      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl font-bold">Browse Rentals</h1>
          <p className="mt-1 text-muted-foreground">
            {meta.total} home{meta.total === 1 ? "" : "s"} match your filters
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <PropertyFilters
  cities={cities}
  categories={categories}
  minPrice={minPrice}
  maxPrice={maxPrice}
/>

        {properties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} initialSaved={savedIds.includes(property.id)} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-muted-foreground">No properties match your filters.</p>
        )}

        {meta.totalPage > 1 && (
  <Pagination>
    <PaginationContent>
      {page > 1 && (
        <PaginationItem>
          <PaginationPrevious href={pageUrl(page - 1)} />
        </PaginationItem>
      )}

      {pages().map((n, i) => (
        <PaginationItem key={`${n}-${i}`}>
          {n === "..." ? (
            <PaginationEllipsis />
          ) : (
            <PaginationLink
              href={pageUrl(n)}
              isActive={n === page}
            >
              {n}
            </PaginationLink>
          )}
        </PaginationItem>
      ))}

      {page < meta.totalPage && (
        <PaginationItem>
          <PaginationNext href={pageUrl(page + 1)} />
        </PaginationItem>
      )}
    </PaginationContent>
  </Pagination>
)}
      </div>
    </div>
  );
};

export default PropertiesPage;