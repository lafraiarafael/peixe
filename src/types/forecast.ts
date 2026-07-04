export type FishingRating = "ruim" | "regular" | "bom" | "otimo";

export interface ScoreReason {
  /** "✔" for a positive contribution, "✖" for a negative one */
  symbol: "✔" | "✖";
  text: string;
}

export interface FactorScore {
  key: string;
  label: string;
  /** Points earned out of `weight`, already weight-adjusted */
  points: number;
  weight: number;
}

export interface FishingScore {
  score: number; // 0-100
  rating: FishingRating;
  factors: FactorScore[];
  reasons: ScoreReason[];
}

export interface ForecastHour {
  time: string; // ISO local
  weather: import("./weather").WeatherHour;
  tide: import("./weather").TideHour | null;
  isDaylight: boolean;
  fishingScore: FishingScore;
}

export interface ForecastDay {
  date: string; // YYYY-MM-DD local
  weekday: string;
  temperatureMin: number;
  temperatureMax: number;
  weatherCode: number;
  astronomy: import("./weather").AstronomyDay;
  tideExtremes: import("./weather").TideExtreme[];
  hours: ForecastHour[];
  /** Best (highest) score among the day's hours — used for sorting/badging */
  bestScore: number;
  bestRating: FishingRating;
}

export interface CityForecast {
  city: import("./city").City;
  days: ForecastDay[];
  fetchedAt: string; // ISO instant when this dataset was assembled
  sources: {
    weather: string;
    tide: string | null;
    astronomy: string;
  };
  /** Rough confidence estimate (0-100) based on which sources were live vs. fallback */
  reliability: number;
}
