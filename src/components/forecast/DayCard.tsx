"use client";

import { useState } from "react";
import { ChevronDown, Moon as MoonIcon, Sunrise, Sunset, Wind, Gauge } from "lucide-react";
import type { ForecastDay } from "@/types";
import { Card } from "@/components/ui/card";
import { RatingBadge } from "@/components/forecast/RatingBadge";
import { WeatherIcon } from "@/components/forecast/WeatherIcon";
import { HourRow } from "@/components/forecast/HourRow";
import { HourRowLegend } from "@/components/forecast/HourRowLegend";
import { getWeatherCodeInfo } from "@/lib/weatherCodes";
import { representativeHour } from "@/lib/forecastUtils";
import { cn } from "@/lib/utils";

export function DayCard({ day }: { day: ForecastDay }) {
  const [expanded, setExpanded] = useState(false);
  const midday = representativeHour(day);
  const weatherInfo = getWeatherCodeInfo(day.weatherCode);
  const [weekday, dayNum, month] = formatHeader(day.date, day.weekday);

  return (
    <Card className="overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex flex-col items-center w-14 shrink-0">
          <span className="text-xs uppercase text-muted-foreground font-medium">{weekday}</span>
          <span className="text-lg font-bold tabular-nums leading-tight">{dayNum}</span>
          <span className="text-[11px] text-muted-foreground">{month}</span>
        </div>

        <WeatherIcon code={day.weatherCode} className="size-7 shrink-0 text-muted-foreground" />

        <div className="hidden xs:flex sm:hidden md:flex flex-col text-xs text-muted-foreground w-24 shrink-0">
          <span>{weatherInfo.label}</span>
        </div>

        <div className="flex items-center gap-1 text-sm tabular-nums shrink-0">
          <span className="font-semibold">{Math.round(day.temperatureMax)}°</span>
          <span className="text-muted-foreground">/{Math.round(day.temperatureMin)}°</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
          <span className="flex items-center gap-1">
            <Gauge className="size-3.5" />
            {Math.round(midday.weather.pressureMsl)}hPa
          </span>
          <span className="flex items-center gap-1">
            <Wind className="size-3.5" />
            {Math.round(midday.weather.windSpeed)}km/h
          </span>
          <span className="flex items-center gap-1">
            <MoonIcon className="size-3.5" />
            {Math.round(day.astronomy.moonIllumination * 100)}%
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <RatingBadge rating={day.bestRating} score={day.bestScore} />
          <ChevronDown
            className={cn("size-4 text-muted-foreground transition-transform", expanded && "rotate-180")}
          />
        </div>
      </button>

      {expanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border/60 p-3 sm:p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground px-1">
            <span className="flex items-center gap-1">
              <Sunrise className="size-3.5" /> {day.astronomy.sunrise.slice(11, 16)}
            </span>
            <span className="flex items-center gap-1">
              <Sunset className="size-3.5" /> {day.astronomy.sunset.slice(11, 16)}
            </span>
            <span>{day.astronomy.moonPhaseName}</span>
            {day.tideExtremes.length > 0 && (
              <span className="flex flex-wrap gap-2">
                {day.tideExtremes.map((e, i) => (
                  <span key={i}>
                    {e.type === "high" ? "Maré alta" : "Maré baixa"} {e.time.slice(11, 16)}
                  </span>
                ))}
              </span>
            )}
          </div>
          <div>
            <HourRowLegend />
            {day.hours.map((hour) => (
              <HourRow key={hour.time} hour={hour} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function formatHeader(date: string, weekday: string): [string, string, string] {
  const [, month, day] = date.split("-");
  const months = [
    "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez",
  ];
  return [weekday, day, months[Number(month) - 1]];
}
