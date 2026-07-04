"use client";

import { useMemo, useState } from "react";
import type { CityForecast } from "@/types";
import { FiltersBar } from "@/components/forecast/FiltersBar";
import { DayCard } from "@/components/forecast/DayCard";
import { matchesFilter, sortDays, type DayFilter, type SortBy } from "@/lib/forecastUtils";

export function ForecastView({ forecast }: { forecast: CityForecast }) {
  const [filter, setFilter] = useState<DayFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");

  const visibleDays = useMemo(() => {
    const filtered = forecast.days.filter((d) => matchesFilter(d.bestRating, filter));
    return sortDays(filtered, sortBy);
  }, [forecast.days, filter, sortBy]);

  return (
    <div className="space-y-4">
      <FiltersBar filter={filter} onFilterChange={setFilter} sortBy={sortBy} onSortChange={setSortBy} />

      {visibleDays.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          Nenhum dia corresponde a esse filtro.
        </p>
      ) : (
        <div className="space-y-2.5">
          {visibleDays.map((day) => (
            <DayCard key={day.date} day={day} />
          ))}
        </div>
      )}
    </div>
  );
}
