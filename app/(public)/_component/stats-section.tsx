"use client";

import { Building2, Users, Star, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/motion/AnimatedCounter";
import type { PublicStats } from "@/service/stats.service";

export default function StatsSection({ stats: s }: { stats: PublicStats }) {
  const items = [
    { icon: Building2, value: s.totalProperties, label: "Listings available", decimals: 0 },
    { icon: Users, value: s.totalTenants, label: "Registered renters", decimals: 0 },
    { icon: Star, value: s.avgRating, label: "Average property rating", decimals: 1 },
    { icon: KeyRound, value: s.rentedCount, label: "Rentals started", decimals: 0 },
  ];

  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {items.map(({ icon: Icon, value, label, decimals }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-4xl font-bold tracking-tight text-primary lg:text-5xl">
                <AnimatedCounter value={value} decimals={decimals} />
              </h3>
              <p className="mt-3 text-sm">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}