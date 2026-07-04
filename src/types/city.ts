/**
 * City configuration. This is the single extension point for adding new
 * locations to the app: to add a city, add one entry to `CITIES` in
 * `lib/cities.ts` with lat/lon/timezone/country. No other code needs to
 * change — the Data Provider picks adapters based on `country` and
 * `hasTide`, and everything else (UI, Fishing Engine) is city-agnostic.
 */
export type CountryCode = "NL" | "BR";

export interface City {
  /** Stable slug used in the UI and as a cache key, e.g. "zaandam" */
  id: string;
  name: string;
  /** Emoji flag shown in the UI */
  flag: string;
  country: CountryCode;
  countryName: string;
  latitude: number;
  longitude: number;
  /** IANA timezone, e.g. "Europe/Amsterdam" */
  timezone: string;
  /**
   * Whether tidal data is meaningful for this location (coastal/estuarine).
   * Inland cities (e.g. Curitiba) have no ocean tide, so the Fishing Engine
   * redistributes the tide factor's weight across the remaining factors.
   */
  hasTide: boolean;
}
