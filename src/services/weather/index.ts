import type { City, WeatherDataset } from "@/types";
import { openMeteoWeatherAdapter } from "./openMeteoWeatherAdapter";
import { ecmwfAdapter, noaaAdapter, knmiAdapter, inmetAdapter } from "./officialAdapters";
import type { WeatherProvider, WeatherProviderParams } from "./types";

export type { WeatherProvider, WeatherProviderParams };

/**
 * Per-country adapter priority. The first adapter that returns non-null
 * data wins; Open-Meteo is always last so there's always a real answer.
 * EXTENSION POINT: once an official adapter is implemented for real, just
 * reorder/add it here — this is the only place priority is decided.
 */
function providersForCity(city: City): WeatherProvider[] {
  switch (city.country) {
    case "NL":
      return [knmiAdapter, ecmwfAdapter, openMeteoWeatherAdapter];
    case "BR":
      return [inmetAdapter, noaaAdapter, openMeteoWeatherAdapter];
    default:
      return [openMeteoWeatherAdapter];
  }
}

export interface WeatherResult {
  dataset: WeatherDataset;
  /** True if we had to fall back all the way to Open-Meteo. */
  usedFallback: boolean;
}

export async function fetchWeatherForCity(
  city: City,
  days: number,
): Promise<WeatherResult> {
  const providers = providersForCity(city);
  const params: WeatherProviderParams = {
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone,
    days,
  };

  for (let i = 0; i < providers.length; i++) {
    const dataset = await providers[i].fetchHourlyForecast(params);
    if (dataset) {
      return { dataset, usedFallback: providers[i].name === openMeteoWeatherAdapter.name && i > 0 };
    }
  }

  throw new Error(`All weather providers failed for city ${city.id}`);
}
