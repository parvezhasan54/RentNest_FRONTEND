"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Building2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import SmartSearchBox from "@/components/shared/SmartSearchBox";
import Typewriter from "@/components/motion/Typewriter";
import type { PublicStats } from "@/service/stats.service";

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80`;

const slides = [
  {
    image: u("1568605114967-8130f3a36994"),
    title: "Find a rental you will actually want to live in.",
    text: "Real photos, transparent pricing and instant rental requests.",
  },
  {
    image: u("1502672260266-1c1ef2d93688"),
    title: "Request a home in minutes, not weeks.",
    text: "Send a request, get approved and pay securely online.",
  },
  {
    image: u("1560448204-e02f11c3d0e2"),
    title: "Landlords: list once, manage everything.",
    text: "Requests, approvals and payments from one dashboard.",
  },
];

export default function HeroSection({ stats }: { stats: PublicStats }) {
  const [i, setI] = useState(0);

  const cityWords = useMemo(
    () =>
      stats.cities.length
        ? stats.cities.map((c) => c.city)
        : ["your next home"],
    [stats.cities]
  );

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[65vh] min-h-[500px] overflow-hidden border-b">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={slides[i].image}
            alt=""
            fill
            priority={i === 0}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Fixed dark overlay keeps white text readable in both themes */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
        <div className="max-w-2xl text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold text-white md:text-5xl">
                Find a rental you will love in{" "}
                <span className="text-primary">
                  <Typewriter words={cityWords} />
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-lg !text-white/85">
                {slides[i].text}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8">
            <SmartSearchBox />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/85">
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <strong className="text-white">
                {stats.totalProperties}
              </strong>
              homes available now
            </span>

            {stats.totalReviews > 0 && (
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <strong className="text-white">{stats.avgRating}</strong>
                from {stats.totalReviews} tenant reviews
              </span>
            )}

            <Button asChild variant="secondary" size="sm">
              <Link href="/properties">Browse all</Link>
            </Button>
          </div>
        </div>

        {/* Floating statistic chips */}
        <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
          {[
            {
              label: "Homes available",
              value: stats.totalProperties,
            },
            {
              label: "Verified landlords",
              value: stats.totalLandlords,
            },
          ].map((c, n) => (
            <motion.div
              key={c.label}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4 + n,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-2xl border border-white/20 bg-black/40 px-5 py-3 text-white backdrop-blur"
            >
              <p className="text-2xl font-bold !text-white">{c.value}</p>
              <p className="text-xs !text-white/80">{c.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Slider navigation */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <div className="flex gap-2">
            {slides.map((_, n) => (
              <button
                key={n}
                aria-label={`Slide ${n + 1}`}
                onClick={() => setI(n)}
                className={`h-2 rounded-full transition-all ${
                  n === i ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>

          <a
            href="#categories"
            aria-label="Scroll to content"
            className="animate-bounce text-white/80"
          >
            <ArrowDown className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}