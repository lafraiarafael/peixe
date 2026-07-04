import type { City, CityForecast } from "@/types";
import { computeAstronomyRange } from "@/services/astronomy/astronomyService";
import { fetchWeatherForCity } from "@/services/weather";
import { fetchTideForCity } from "@/services/tide";
import { buildForecast } from "@/services/engine/fishingEngine";
import { nextLocalDates } from "@/utils/time";

const FORECAST_DAYS = 15;
const CACHE_TTL_MS = 30 * 60 * 1000;

interface CacheEntry {
  forecast: CityForecast;
  expiresAt: number;
}

/**
 * Per-city, in-memory cache (module scope survives across requests on the
 * same warm serverless instance, e.g. Vercel Fluid Compute). Fresh data is
 * never served stale past `CACHE_TTL_MS`; each underlying fetch() call also
 * carries its own `next.revalidate` as a second cache layer, so a cold
 * instance still avoids hammering the upstream APIs.
 */
const cache = new Map<string, CacheEntry>();

function estimateReliability(
  city: City,
  weatherUsedFallback: boolean,
  hasTideDataset: boolean,
  tideUsedFallback: boolean,
): number {
  let reliability = 90;
  if (weatherUsedFallback) reliability -= 5; // official national source not yet configured, using Open-Meteo
  if (city.hasTide) {
    if (!hasTideDataset) reliability -= 15; // tide factor dropped from the score entirely
    else if (tideUsedFallback) reliability -= 5; // dedicated tide-gauge API not yet configured
  }
  return Math.max(50, Math.min(98, reliability));
}

async function assembleForecast(city: City): Promise<CityForecast> {
  const dates = nextLocalDates(city.timezone, FORECAST_DAYS);

  const [weatherResult, tideResult] = await Promise.all([
    fetchWeatherForCity(city, FORECAST_DAYS),
    fetchTideForCity(city, FORECAST_DAYS),
  ]);

  const astronomyDays = computeAstronomyRange(dates, city.latitude, city.longitude, city.timezone);

  const days = buildForecast({
    city,
    weather: weatherResult.dataset,
    tide: tideResult.dataset,
    astronomyDays,
  });

  return {
    city,
    days,
    fetchedAt: new Date().toISOString(),
    sources: {
      weather: weatherResult.dataset.source,
      tide: tideResult.dataset?.source ?? null,
      astronomy: "SunCalc (cálculo astronômico local)",
    },
    reliability: estimateReliability(
      city,
      weatherResult.usedFallback,
      Boolean(tideResult.dataset),
      tideResult.usedFallback,
    ),
  };
}

/**
 * Returns the forecast for a city, serving from the 30-minute cache when
 * fresh. This is the single entry point the UI/server components call —
 * it hides which adapters were used and how caching/fallback works.
 */
export async function getForecastForCity(city: City): Promise<CityForecast> {
  const cached = cache.get(city.id);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.forecast;
  }

  const forecast = await assembleForecast(city);
  cache.set(city.id, { forecast, expiresAt: Date.now() + CACHE_TTL_MS });
  return forecast;
}
