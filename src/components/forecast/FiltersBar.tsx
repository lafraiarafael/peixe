"use client";

import { ArrowDownAZ, TrendingUp } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DAY_FILTER_LABELS, type DayFilter, type SortBy } from "@/lib/forecastUtils";

export function FiltersBar({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
}: {
  filter: DayFilter;
  onFilterChange: (v: DayFilter) => void;
  sortBy: SortBy;
  onSortChange: (v: SortBy) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <ToggleGroup
        value={[filter]}
        onValueChange={(v) => v[0] && onFilterChange(v[0] as DayFilter)}
        className="flex-wrap justify-start"
      >
        {(Object.keys(DAY_FILTER_LABELS) as DayFilter[]).map((key) => (
          <ToggleGroupItem key={key} value={key} className="text-xs sm:text-sm px-3">
            {DAY_FILTER_LABELS[key]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <ToggleGroup
        value={[sortBy]}
        onValueChange={(v) => v[0] && onSortChange(v[0] as SortBy)}
        className="ml-0 sm:ml-auto"
      >
        <ToggleGroupItem value="date" className="text-xs sm:text-sm gap-1.5 px-3">
          <ArrowDownAZ className="size-3.5" />
          Data
        </ToggleGroupItem>
        <ToggleGroupItem value="score" className="text-xs sm:text-sm gap-1.5 px-3">
          <TrendingUp className="size-3.5" />
          Melhor Score
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
