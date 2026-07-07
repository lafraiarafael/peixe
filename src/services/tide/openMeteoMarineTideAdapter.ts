import type { TideDataset, TideExtreme, TideHour } from "@/types";
import { zonedToUtc, utcToZonedIso } from "@/utils/time";
import type { TideProvider, TideProviderParams } from "./types";

interface MarineResponse {
  hourly: {
    time: string[];
    sea_level_height_msl: (number | null)[];
  };
}

/**
 * `sea_level_height_msl` is a modeled value that layers wind/wave/pressure
 * effects on top of the actual astronomical tide, so the raw hourly series
 * is noisy — naive hour-to-hour extrema detection was flagging every small
 * wiggle as a tide turn (e.g. 8 "highs/lows" in a single day on a coast that
 * physically has a semidiurnal, ~2-high/2-low pattern). A centered 5-hour
 * moving average smooths out that short-period noise while preserving the
 * much slower (~12h25m) tidal cycle, before extrema are detected on it.
 */
function smooth(hours: TideHour[], window = 5): number[] {
  const half = Math.floor(window / 2);
  return hours.map((_, i) => {
    const lo = Math.max(0, i - half);
    const hi = Math.min(hours.length, i + half + 1);
    const slice = hours.slice(lo, hi);
    return slice.reduce((sum, h) => sum + h.height, 0) / slice.length;
  });
}

function findExtremes(hours: TideHour[]): TideExtreme[] {
  const smoothed = smooth(hours);
  const extremes: TideExtreme[] = [];
  for (let i = 1; i < hours.length - 1; i++) {
    const prev = smoothed[i - 1];
    const curr = smoothed[i];
    const next = smoothed[i + 1];
    if (curr >= prev && curr >= next && curr > prev) {
      extremes.push({ time: hours[i].time, height: hours[i].height, type: "high" });
    } else if (curr <= prev && curr <= next && curr < prev) {
      extremes.push({ time: hours[i].time, height: hours[i].height, type: "low" });
    }
  }
  return extremes;
}

/**
 * Real data source (no API key required): Open-Meteo Marine API
 * https://open-meteo.com/en/docs/marine-weather-api
 *
 * `sea_level_height_msl` is a modeled sea-surface height that includes the
 * tidal component — a workable free proxy for tide height where a dedicated
 * tide gauge API isn't configured. Coverage is global-ocean, so results can
 * be thin for sheltered/inland waterways (e.g. Zaandam's canals); when the
 * API returns no usable series we return null and the app simply omits
 * tide from the score for that city/day rather than showing fabricated data.
 */
export const openMeteoMarineTideAdapter: TideProvider = {
  name: "Open-Meteo Marine",
  async fetchTideForecast({
    latitude,
    longitude,
    timezone,
    days,
  }: TideProviderParams): Promise<TideDataset | null> {
    const url = new URL("https://marine-api.open-meteo.com/v1/marine");
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("hourly", "sea_level_height_msl");
    url.searchParams.set("timezone", timezone);
    url.searchParams.set("forecast_days", String(days));

    try {
      const res = await fetch(url, { next: { revalidate: 1800 } });
      if (!res.ok) return null;
      const data = (await res.json()) as MarineResponse;

      const raw = data.hourly?.sea_level_height_msl ?? [];
      if (raw.every((v) => v === null || v === undefined)) return null;

      const hours: TideHour[] = data.hourly.time
        .map((t, i) => ({ time: t, height: raw[i] }))
        .filter((h): h is { time: string; height: number } => h.height != null)
        .map(({ time, height }) => ({
          time: utcToZonedIso(zonedToUtc(time, timezone), timezone),
          height,
        }));

      if (hours.length === 0) return null;

      return {
        hours,
        extremes: findExtremes(hours),
        source: openMeteoMarineTideAdapter.name,
      };
    } catch {
      return null;
    }
  },
};
