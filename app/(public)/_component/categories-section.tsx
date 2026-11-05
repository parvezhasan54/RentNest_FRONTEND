
import Link from "next/link";
import { Building, Building2, DoorOpen, Home, Landmark, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const icons: Record<string, LucideIcon> = { Apartment: Building2, House: Home, Condo: Building, Studio: DoorOpen, Townhouse: Landmark };

export default function CategoriesSection({ categories }: { categories: { id: string; name: string; count: number }[] }) {
  if (!categories.length) return null;
  return (
    <section id="categories" className="py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold">Browse by property type</h2>
        <p className="mt-2 text-muted-foreground">Jump straight to the kind of home you are looking for.</p>
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => {
            const Icon = icons[c.name] ?? Home;
            return (
              <Link key={c.id} href={`/properties?category=${encodeURIComponent(c.name)}`}>
                <Card className="h-full transition hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary"><Icon className="h-6 w-6" /></div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.count} listing{c.count === 1 ? "" : "s"}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}