import { PublicStats } from "@/service/stats.service";

type StatsProps = { listings: number; cities: number; categories: number; averageRating: number };

export default function StatsSection({ stats: s }: { stats: PublicStats }) {
  const stats = [
    { value: String(s.totalProperties), label: "Listings available" },
    { value: String(s.totalTenants), label: "Registered renters" },
    { value: s.totalReviews ? String(s.avgRating) : "–", label: "Average property rating" },
    { value: String(s.rentedCount), label: "Rentals started" },
  ];

  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <h3 className="text-4xl font-bold tracking-tight text-primary lg:text-5xl">{stat.value}</h3>
              <p className="mt-3 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}