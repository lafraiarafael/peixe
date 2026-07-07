import type {
  AstronomyDay,
  City,
  FactorScore,
  FishingRating,
  ForecastDay,
  ForecastHour,
  ScoreReason,
  TideDataset,
  WeatherDataset,
  WeatherDailySummary,
} from "@/types";
import { weekdayLabel } from "@/utils/time";
import {
  cloudCoverFactor,
  dewPointFactor,
  humidityFactor,
  moonPhaseFactor,
  moonProximityFactor,
  precipitationFactor,
  pressureFactor,
  seasonFactor,
  sunProximityFactor,
  temperatureFactor,
  tideFactor,
  windFactor,
  type FactorResult,
} from "./factors";
import { FACTOR_LABELS, getEffectiveWeights, type FactorKey } from "./weights";

/** 0-50 Ruim · 51-79 Regular · 80-94 Bom · 95-100 Ótimo */
function ratingFromScore(score: number): FishingRating {
  if (score <= 50) return "ruim";
  if (score <= 79) return "regular";
  if (score <= 94) return "bom";
  return "otimo";
}

function isDaylight(time: string, astronomy: AstronomyDay): boolean {
  return time >= astronomy.sunrise && time <= astronomy.sunset;
}

function localDate(iso: string): string {
  return iso.slice(0, 10);
}

interface EngineInput {
  city: City;
  weather: WeatherDataset;
  tide: TideDataset | null;
  astronomyDays: AstronomyDay[];
}

export function buildForecast({ city, weather, tide, astronomyDays }: EngineInput): ForecastDay[] {
  const astronomyByDate = new Map(astronomyDays.map((a) => [a.date, a]));
  const dailyByDate = new Map(weather.daily.map((d) => [d.date, d]));
  const tideIndexByTime = new Map((tide?.hours ?? []).map((h, i) => [h.time, i]));
  const weights = getEffectiveWeights(Boolean(tide));

  const hoursByDate = new Map<string, ForecastHour[]>();

  weather.hours.forEach((hour, globalIndex) => {
    const dateStr = localDate(hour.time);
    const astronomy = astronomyByDate.get(dateStr);
    if (!astronomy) return; // outside the requested date range

    const dailySummary: WeatherDailySummary | undefined = dailyByDate.get(dateStr);

    const results: Partial<Record<FactorKey, FactorResult>> = {
      pressure: pressureFactor(weather.hours, globalIndex),
      wind: windFactor(weather.hours, globalIndex),
      temperature: temperatureFactor(
        weather.hours,
        globalIndex,
        dailySummary?.temperatureMin ?? hour.temperature,
        dailySummary?.temperatureMax ?? hour.temperature,
      ),
      precipitation: precipitationFactor(weather.hours, globalIndex),
      cloudCover: cloudCoverFactor(weather.hours, globalIndex),
      humidity: humidityFactor(weather.hours, globalIndex),
      dewPoint: dewPointFactor(weather.hours, globalIndex),
      moonPhase: moonPhaseFactor(astronomy),
      moonProximity: moonProximityFactor(hour.time, astronomy),
      sunProximity: sunProximityFactor(hour.time, astronomy),
      season: seasonFactor(dateStr, city.latitude),
    };

    if (tide) {
      const tideIndex = tideIndexByTime.get(hour.time);
      results.tide =
        tideIndex !== undefined
          ? tideFactor(tide.hours, tide.extremes, tideIndex)
          : { ratio: 0.5, reasons: [] };
    }

    const factors: FactorScore[] = [];
    const reasons: ScoreReason[] = [];
    let total = 0;

    for (const key of Object.keys(weights) as FactorKey[]) {
      const weight = weights[key];
      if (weight <= 0) continue;
      const result = results[key];
      if (!result) continue;
      const points = result.ratio * weight;
      total += points;
      factors.push({ key, label: FACTOR_LABELS[key], points, weight });
      reasons.push(...result.reasons);
    }

    const score = Math.round(Math.min(100, Math.max(0, total)));

    const forecastHour: ForecastHour = {
      time: hour.time,
      weather: hour,
      tide: tide ? (tide.hours.find((h) => h.time === hour.time) ?? null) : null,
      isDaylight: isDaylight(hour.time, astronomy),
      fishingScore: { score, rating: ratingFromScore(score), factors, reasons },
    };

    const bucket = hoursByDate.get(dateStr) ?? [];
    bucket.push(forecastHour);
    hoursByDate.set(dateStr, bucket);
  });

  const days: ForecastDay[] = [];
  for (const [dateStr, hours] of hoursByDate) {
    const astronomy = astronomyByDate.get(dateStr)!;
    const dailySummary = dailyByDate.get(dateStr);
    const best = hours.reduce((a, b) => (b.fishingScore.score > a.fishingScore.score ? b : a));

    days.push({
      date: dateStr,
      weekday: weekdayLabel(dateStr, city.timezone),
      temperatureMin: dailySummary?.temperatureMin ?? Math.min(...hours.map((h) => h.weather.temperature)),
      temperatureMax: dailySummary?.temperatureMax ?? Math.max(...hours.map((h) => h.weather.temperature)),
      weatherCode: dailySummary?.weatherCode ?? hours[Math.floor(hours.length / 2)].weather.weatherCode,
      astronomy,
      tideExtremes: (tide?.extremes ?? []).filter((e) => localDate(e.time) === dateStr),
      hours,
      bestScore: best.fishingScore.score,
      bestRating: best.fishingScore.rating,
    });
  }

  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
}
