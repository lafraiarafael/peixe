import type { WeatherDataset } from "@/types";

export interface WeatherProviderParams {
  latitude: number;
  longitude: number;
  timezone: string;
  days: number;
}

/**
 * Contract every weather source must implement. Adding a new official
 * source (once you have an API key) means writing one adapter with this
 * shape and registering it in `services/weather/index.ts` — nothing else
 * in the app needs to change.
 */
export interface WeatherProvider {
  name: string;
  /** Returns null (never throws) when the source can't serve this request, so the resolver can fall back. */
  fetchHourlyForecast(params: WeatherProviderParams): Promise<WeatherDataset | null>;
}
