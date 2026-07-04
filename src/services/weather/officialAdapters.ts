import type { WeatherDataset } from "@/types";
import { openMeteoWeatherAdapter } from "./openMeteoWeatherAdapter";
import type { WeatherProvider, WeatherProviderParams } from "./types";

/**
 * STUBS — official national/institutional weather sources.
 *
 * Each of these requires a paid or registered API key that we don't have
 * yet. They are wired into the resolver in `services/weather/index.ts` with
 * the correct priority per country, but until the matching environment
 * variable is set they simply return null so the resolver falls through to
 * Open-Meteo. Implementing one for real is a two-step change:
 *   1. Fill in the fetch call below using the documented endpoint.
 *   2. Set the env var (see `.env.example`) — no other file needs to change.
 */
function stubAdapter(name: string, envVar: string): WeatherProvider {
  return {
    name,
    async fetchHourlyForecast(
      _params: WeatherProviderParams,
    ): Promise<WeatherDataset | null> {
      if (!process.env[envVar]) return null;
      // TODO: implement real request once `envVar` is configured.
      return null;
    },
  };
}

/** ECMWF (European Centre for Medium-Range Weather Forecasts) — global, paid API. */
export const ecmwfAdapter = stubAdapter("ECMWF", "ECMWF_API_KEY");

/** NOAA (US National Oceanic and Atmospheric Administration) — global/US, free but requires registration. */
export const noaaAdapter = stubAdapter("NOAA", "NOAA_API_KEY");

/** KNMI (Koninklijk Nederlands Meteorologisch Instituut) — best for Zaandam/Netherlands. */
export const knmiAdapter = stubAdapter("KNMI", "KNMI_API_KEY");

/** INMET (Instituto Nacional de Meteorologia) — best for Guaratuba/Curitiba, Brazil. */
export const inmetAdapter = stubAdapter("INMET", "INMET_API_KEY");

/** Fallback used by every stub above once real implementations land. */
export const weatherFallback = openMeteoWeatherAdapter;
