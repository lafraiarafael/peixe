import type { FishingRating } from "@/types";

export interface RatingInfo {
  label: string;
  emoji: string;
  badgeClass: string;
  barClass: string;
  textClass: string;
}

/** 0-25 Ruim (🟥) · 26-50 Regular (🟨) · 51-75 Bom (🟩) · 76-100 Ótimo (🟦) */
export const RATING_INFO: Record<FishingRating, RatingInfo> = {
  ruim: {
    label: "Ruim",
    emoji: "🟥",
    badgeClass: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
    barClass: "bg-red-500",
    textClass: "text-red-600 dark:text-red-400",
  },
  regular: {
    label: "Regular",
    emoji: "🟨",
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    barClass: "bg-amber-500",
    textClass: "text-amber-600 dark:text-amber-400",
  },
  bom: {
    label: "Bom",
    emoji: "🟩",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    barClass: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
  },
  otimo: {
    label: "Ótimo",
    emoji: "🟦",
    badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    barClass: "bg-blue-500",
    textClass: "text-blue-600 dark:text-blue-400",
  },
};

export const RATING_ORDER: FishingRating[] = ["ruim", "regular", "bom", "otimo"];

export function meetsMinimumRating(rating: FishingRating, minimum: FishingRating): boolean {
  return RATING_ORDER.indexOf(rating) >= RATING_ORDER.indexOf(minimum);
}
