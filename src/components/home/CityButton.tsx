import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import type { City } from "@/types";
import { Card } from "@/components/ui/card";

export function CityButton({ city }: { city: City }) {
  return (
    <Link href={`/forecast/${city.id}`} className="block">
      <Card className="group flex flex-row items-center gap-4 p-5 sm:p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]">
        <span className="text-4xl sm:text-5xl leading-none">{city.flag}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{city.name}</h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {city.countryName}
          </p>
        </div>
        <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </Card>
    </Link>
  );
}
