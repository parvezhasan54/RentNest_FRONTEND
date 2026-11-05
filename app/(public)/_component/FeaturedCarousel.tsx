
"use client";

import { useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { Property } from "@/types/property";
import PropertyCard from "../properties/_component/PropertyCard";

export default function FeaturedCarousel({
  properties,
  savedIds = [],
}: {
  properties: Property[];
  savedIds?: string[];
}) {
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 3500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  if (!properties.length) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <h3 className="font-semibold">No featured properties yet</h3>
        <p className="mt-2 text-sm">
          Check back later for hand-picked property listings.
        </p>
      </div>
    );
  }

  return (
    <Carousel
      plugins={[autoplay]}
      opts={{
        loop: properties.length > 4,
        align: "start",
      }}
    >
      <CarouselContent className="-ml-4">
        {properties.map((property) => (
          <CarouselItem
            key={property.id}
            className="basis-full pl-4 sm:basis-1/2 lg:basis-1/4"
          >
            <PropertyCard
              property={property}
              initialSaved={savedIds.includes(property.id)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
