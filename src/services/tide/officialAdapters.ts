import type { TideDataset } from "@/types";
import type { TideProvider, TideProviderParams } from "./types";

/**
 * STUBS — dedicated tide-gauge APIs that need a registered key.
 *
 * Wired into the resolver in `services/tide/index.ts` ahead of the free
 * Open-Meteo Marine fallback. Until the env var is set they return null.
 * To go live: implement the fetch below and set the key in `.env`.
 */
function stubAdapter(name: string, envVar: string): TideProvider {
  return {
    name,
    async fetchTideForecast(_params: TideProviderParams): Promise<TideDataset | null> {
      if (!process.env[envVar]) return null;
      // TODO: implement real request once `envVar` is configured.
      return null;
    },
  };
}

/** Stormglass.io — global tide/marine data, free tier available with an API key. */
export const stormglassAdapter = stubAdapter("Stormglass", "STORMGLASS_API_KEY");

/** WorldTides.info — global tide predictions, paid API key. */
export const worldTidesAdapter = stubAdapter("WorldTides", "WORLDTIDES_API_KEY");
