"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ForecastHour } from "@/types";
import { RatingBadge } from "@/components/forecast/RatingBadge";
import { WeatherIcon } from "@/components/forecast/WeatherIcon";
import { RATING_INFO } from "@/lib/rating";
import { cn } from "@/lib/utils";

export function HourRow({ hour }: { hour: ForecastHour }) {
  const [expanded, setExpanded] = useState(false);
  const time = hour.time.slice(11, 16);
  const info = RATING_INFO[hour.fishingScore.rating];

  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-1.5 sm:gap-3 py-2.5 px-1 text-left hover:bg-muted/40 rounded-lg transition-colors"
      >
        <span className="w-9 sm:w-11 shrink-0 text-xs sm:text-sm font-medium tabular-nums">
          {time}
        </span>
        <WeatherIcon
          code={hour.weather.weatherCode}
          isDaylight={hour.isDaylight}
          className="size-4 shrink-0 text-muted-foreground"
        />
        <span className="w-9 sm:w-11 shrink-0 text-xs sm:text-sm tabular-nums">
          {Math.round(hour.weather.temperature)}°
        </span>
        <span className="w-7 sm:w-16 shrink-0 text-xs text-muted-foreground tabular-nums text-right sm:text-left">
          <span className="sm:hidden">{Math.round(hour.weather.windSpeed)}</span>
          <span className="hidden sm:inline">{Math.round(hour.weather.windSpeed)} km/h</span>
        </span>
        <span className="w-9 sm:w-14 shrink-0 text-xs text-muted-foreground tabular-nums text-right sm:text-left">
          {Math.round(hour.weather.precipitationProbability)}%
        </span>

        <span className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <RatingBadge
            rating={hour.fishingScore.rating}
            score={hour.fishingScore.score}
            compact
            className="sm:hidden"
          />
          <RatingBadge
            rating={hour.fishingScore.rating}
            score={hour.fishingScore.score}
            className="hidden sm:inline-flex"
          />
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        </span>
      </button>

      {expanded && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200 px-1 pb-3 pl-1 sm:pl-14">
          <div className="rounded-lg bg-muted/40 p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className={cn("font-semibold", info.textClass)}>
                Fishing Score: {hour.fishingScore.score}/100
              </span>
            </div>
            {hour.fishingScore.reasons.map((reason, i) => (
              <p
                key={i}
                className={cn(
                  "text-xs flex gap-1.5",
                  reason.symbol === "✔"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                <span>{reason.symbol}</span>
                <span className="text-foreground/80">{reason.text}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
