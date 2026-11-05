import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getTrendingProperties } from "@/service/home.service";
import { getSavedPropertyIds } from "@/service/getSavedPropertyIds";
import PropertyCard from "../properties/_component/PropertyCard";

export default async function TrendingSection() {
  const [trending, savedIds] = await Promise.all([getTrendingProperties(4), getSavedPropertyIds()]);
  if (trending.length === 0) return null;

  return (
    <section className="border-y bg-muted/30 py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Smart ranking
            </span>
            <h2 className="mt-3 text-3xl font-bold">Trending right now</h2>
            <p className="mt-2">Ranked automatically from rental requests, saves, reviews and ratings.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/properties?sort=rating">See top rated <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((p) => (
            <PropertyCard key={p.id} property={p} initialSaved={savedIds.includes(p.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}