import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/service/property.service";
import { getSavedPropertyIds } from "@/service/getSavedPropertyIds";
import PropertyCard from "../properties/_component/PropertyCard";

export default async function LatestListings() {
  const { data } = await getProperties({ sort: "newest", limit: 4 });
  const savedIds = await getSavedPropertyIds();
  if (!data.length) return null;
  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold">Just listed</h2>
          <Button asChild variant="outline"><Link href="/properties?sort=newest">See all new <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((p) => <PropertyCard key={p.id} property={p} initialSaved={savedIds.includes(p.id)} />)}
        </div>
      </div>
    </section>
  );
}