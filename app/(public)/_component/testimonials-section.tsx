import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { PublicStats } from "@/service/stats.service";

export default function Testimonials({ reviews }: { reviews: PublicStats["reviews"] }) {
  if (!reviews.length) return null;
  return (
    <section className="border-y bg-muted/30 py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold">What tenants say</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <Card key={r.id} className="h-full">
              <CardContent className="flex h-full flex-col gap-4">
                <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="flex-1 text-foreground">&ldquo;{r.comment}&rdquo;</p>
                <div className="text-sm">
                  <p className="font-semibold">{r.tenant.name}</p>
                  <Link href={`/properties/${r.property.id}`} className="text-muted-foreground hover:text-primary">{r.property.title}, {r.property.city}</Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}