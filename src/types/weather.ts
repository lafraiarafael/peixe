/** Normalized hourly weather sample, independent of which provider produced it. */
export interface WeatherHour {
  /** ISO 8601 timestamp in the city's local timezone offset */
  time: string;
  temperature: number; // °C
  apparentTemperature: number; // °C
  pressureMsl: number; // hPa, mean sea level
  windSpeed: number; // km/h
  windGusts: number; // km/h
  windDirection: number; // degrees, 0 = N
  precipitation: number; // mm
  precipitationProbability: number; // 0-100
  cloudCover: number; // 0-100 %
  relativeHumidity: number; // 0-100 %
  dewPoint: number; // °C
  weatherCode: number; // WMO weather code
}

export interface WeatherDailySummary {
  date: string; // YYYY-MM-DD (local)
  temperatureMin: number;
  temperatureMax: number;
  weatherCode: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface WeatherDataset {
  hours: WeatherHour[];
  daily: WeatherDailySummary[];
  /** Name of the adapter that ultimately produced this data (after fallback) */
  source: string;
}

/** One high or low tide event. */
export interface TideExtreme {
  time: string; // ISO local
  height: number; // meters
  type: "high" | "low";
}

export interface TideHour {
  time: string; // ISO local
  height: number; // meters, relative sea surface height
}

export interface TideDataset {
  hours: TideHour[];
  extremes: TideExtreme[];
  source: string;
}

export interface AstronomyDay {
  date: string; // YYYY-MM-DD local
  sunrise: string;
  sunset: string;
  civilDawn: string;
  civilDusk: string;
  nauticalDawn: string;
  nauticalDusk: string;
  moonrise: string | null;
  moonset: string | null;
  /** 0 = new moon, 0.5 = full moon, 1 = new moon again */
  moonPhase: number;
  moonPhaseName: string;
  /** 0-1 fraction of the moon's visible disk illuminated */
  moonIllumination: number;
}
