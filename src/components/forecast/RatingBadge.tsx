import type { FishingRating } from "@/types";
import { RATING_INFO } from "@/lib/rating";
import { cn } from "@/lib/utils";

export function RatingBadge({
  rating,
  score,
  className,
}: {
  rating: FishingRating;
  score?: number;
  className?: string;
}) {
  const info = RATING_INFO[rating];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        info.badgeClass,
        className,
      )}
    >
      <span>{info.emoji}</span>
      {info.label}
      {score !== undefined && <span className="opacity-70">· {score}</span>}
    </span>
  );
}
