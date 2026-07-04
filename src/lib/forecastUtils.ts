import type { FishingRating, ForecastDay, ForecastHour } from "@/types";
import { RATING_ORDER } from "@/lib/rating";

/** The hour closest to local noon — used to summarize a day on its collapsed card. */
export function representativeHour(day: ForecastDay): ForecastHour {
  return day.hours.reduce((closest, hour) => {
    const hourOfDay = Number(hour.time.slice(11, 13));
    const closestHourOfDay = Number(closest.time.slice(11, 13));
    return Math.abs(hourOfDay - 12) < Math.abs(closestHourOfDay - 12) ? hour : closest;
  }, day.hours[0]);
}

export type DayFilter = "all" | "otimo" | "bom" | "regular";

export const DAY_FILTER_LABELS: Record<DayFilter, string> = {
  all: "Todos",
  otimo: "Apenas Ótimos",
  bom: "Bom ou melhor",
  regular: "Regular ou melhor",
};

export function matchesFilter(rating: FishingRating, filter: DayFilter): boolean {
  if (filter === "all") return true;
  if (filter === "otimo") return rating === "otimo";
  return RATING_ORDER.indexOf(rating) >= RATING_ORDER.indexOf(filter);
}

export type SortBy = "date" | "score";

export function sortDays(days: ForecastDay[], sortBy: SortBy): ForecastDay[] {
  const copy = [...days];
  if (sortBy === "score") {
    copy.sort((a, b) => b.bestScore - a.bestScore);
  } else {
    copy.sort((a, b) => a.date.localeCompare(b.date));
  }
  return copy;
}

export function formatDayLabel(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}
