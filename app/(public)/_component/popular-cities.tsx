import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PopularCities({ cities }: { cities: { city: string; state: string; count: number }[] }) {
  if (!cities.length) return null;
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold">Popular cities</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c) => (
            <Link key={c.city} href={`/properties?city=${encodeURIComponent(c.city)}`}>
              <Card className="h-full transition hover:shadow-lg">
                <CardContent className="flex items-center gap-4 py-5">
                  <div className="rounded-full bg-primary/10 p-3 text-primary"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-semibold">{c.city}, {c.state}</h3>
                    <p className="text-sm text-muted-foreground">{c.count} home{c.count === 1 ? "" : "s"} to rent</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}