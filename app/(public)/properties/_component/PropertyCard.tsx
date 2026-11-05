
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";
import SaveButton from "./SaveButton";

interface PropertyCardProps { property: Property; initialSaved?: boolean }

const FALLBACK = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80";

const PropertyCard = ({ property, initialSaved = false }: PropertyCardProps) => (
  <Card className="flex h-full flex-col overflow-hidden">
    <div className="relative h-48 w-full shrink-0 overflow-hidden">
      <Image src={property.images?.[0] || FALLBACK} alt={property.title} fill sizes="(min-width:1024px) 25vw, 50vw"
        className="object-cover transition-transform duration-500 hover:scale-105" />
      <div className="absolute right-3 top-3"><SaveButton propertyId={property.id} initialSaved={initialSaved} /></div>
      {property.available === false && (
        <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-medium text-white">Not Available</span>
      )}
    </div>

    <CardContent className="flex flex-1 flex-col gap-2 p-4">
      <h3 className="line-clamp-1 text-base font-semibold">{property.title}</h3>
      <p className="line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">{property.description}</p>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1"><MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{property.city}, {property.state}</span></span>
        {property.rating > 0 && (
          <span className="flex items-center gap-1 text-foreground"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {property.rating}{property.reviewCount > 0 && <span className="text-muted-foreground">({property.reviewCount})</span>}</span>
        )}
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{property.bedrooms ?? 0} Beds</span><span>{property.bathrooms ?? 0} Baths</span><span>{property.sqft ?? "–"} sqft</span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t pt-3">
        <div><span className="text-lg font-bold">${property.price.toLocaleString()}</span><span className="text-sm text-muted-foreground">/mo</span></div>
        <Button asChild size="sm"><Link href={`/properties/${property.id}`}>View Details</Link></Button>
      </div>
    </CardContent>
  </Card>
);

export default PropertyCard;