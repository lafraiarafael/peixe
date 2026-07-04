import type { TideDataset } from "@/types";

export interface TideProviderParams {
  latitude: number;
  longitude: number;
  timezone: string;
  days: number;
}

/**
 * Contract every tide source must implement. Same extension pattern as
 * `services/weather/types.ts`: implement, register, done.
 */
export interface TideProvider {
  name: string;
  fetchTideForecast(params: TideProviderParams): Promise<TideDataset | null>;
}
