import type { City, TideDataset } from "@/types";
import { openMeteoMarineTideAdapter } from "./openMeteoMarineTideAdapter";
import { stormglassAdapter, worldTidesAdapter } from "./officialAdapters";
import type { TideProvider, TideProviderParams } from "./types";

export type { TideProvider, TideProviderParams };

function providersForCity(): TideProvider[] {
  return [stormglassAdapter, worldTidesAdapter, openMeteoMarineTideAdapter];
}

export interface TideResult {
  dataset: TideDataset | null;
  usedFallback: boolean;
}

/**
 * Returns null dataset (not an error) for cities without meaningful tide
 * (`city.hasTide === false`, e.g. inland Curitiba) or when every source —
 * including the Open-Meteo fallback — fails to produce a usable series.
 * The Fishing Engine treats a null tide dataset as "factor not applicable"
 * and redistributes its scoring weight (see `services/engine/weights.ts`).
 */
export async function fetchTideForCity(city: City, days: number): Promise<TideResult> {
  if (!city.hasTide) return { dataset: null, usedFallback: false };

  const providers = providersForCity();
  const params: TideProviderParams = {
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone,
    days,
  };

  for (let i = 0; i < providers.length; i++) {
    const dataset = await providers[i].fetchTideForecast(params);
    if (dataset) {
      return { dataset, usedFallback: i > 0 };
    }
  }

  return { dataset: null, usedFallback: true };
}
