import type { FishingRating } from "@/types";
import { RATING_INFO } from "@/lib/rating";
import { cn } from "@/lib/utils";

export function RatingBadge({
  rating,
  score,
  compact = false,
  className,
}: {
  rating: FishingRating;
  score?: number;
  /** Drops the text label, keeping just the emoji + score — for dense hourly rows. */
  compact?: boolean;
  className?: string;
}) {
  const info = RATING_INFO[rating];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium whitespace-nowrap",
        compact ? "px-1.5 py-0.5 text-[0.7rem] gap-0.5" : "gap-1.5 px-2.5 py-1 text-xs",
        info.badgeClass,
        className,
      )}
    >
      <span>{info.emoji}</span>
      {!compact && info.label}
      {score !== undefined && <span className="opacity-70">{compact ? score : `· ${score}`}</span>}
    </span>
  );
}
