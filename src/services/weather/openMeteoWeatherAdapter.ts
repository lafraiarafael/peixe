import type { WeatherDataset, WeatherHour, WeatherDailySummary } from "@/types";
import { zonedToUtc, utcToZonedIso } from "@/utils/time";
import type { WeatherProvider, WeatherProviderParams } from "./types";

const HOURLY_VARS = [
  "temperature_2m",
  "apparent_temperature",
  "pressure_msl",
  "wind_speed_10m",
  "wind_gusts_10m",
  "wind_direction_10m",
  "precipitation",
  "precipitation_probability",
  "cloud_cover",
  "relative_humidity_2m",
  "dew_point_2m",
  "weather_code",
].join(",");

const DAILY_VARS = [
  "temperature_2m_max",
  "temperature_2m_min",
  "weather_code",
  "precipitation_sum",
  "wind_speed_10m_max",
].join(",");

interface OpenMeteoResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    pressure_msl: number[];
    wind_speed_10m: number[];
    wind_gusts_10m: number[];
    wind_direction_10m: number[];
    precipitation: number[];
    precipitation_probability: number[];
    cloud_cover: number[];
    relative_humidity_2m: number[];
    dew_point_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
}

/**
 * Real, always-on data source (no API key required):
 * https://open-meteo.com/en/docs
 *
 * This is the primary weather source for every city in v1. It also acts as
 * the universal fallback target for the key-gated adapters (ECMWF/NOAA/KNMI/
 * INMET) when their API keys aren't configured yet.
 */
export const openMeteoWeatherAdapter: WeatherProvider = {
  name: "Open-Meteo",
  async fetchHourlyForecast({
    latitude,
    longitude,
    timezone,
    days,
  }: WeatherProviderParams): Promise<WeatherDataset | null> {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("hourly", HOURLY_VARS);
    url.searchParams.set("daily", DAILY_VARS);
    url.searchParams.set("timezone", timezone);
    url.searchParams.set("forecast_days", String(days));

    try {
      const res = await fetch(url, { next: { revalidate: 1800 } });
      if (!res.ok) return null;
      const data = (await res.json()) as OpenMeteoResponse;

      const hours: WeatherHour[] = data.hourly.time.map((t, i) => {
        const utc = zonedToUtc(t, timezone);
        return {
          time: utcToZonedIso(utc, timezone),
          temperature: data.hourly.temperature_2m[i],
          apparentTemperature: data.hourly.apparent_temperature[i],
          pressureMsl: data.hourly.pressure_msl[i],
          windSpeed: data.hourly.wind_speed_10m[i],
          windGusts: data.hourly.wind_gusts_10m[i],
          windDirection: data.hourly.wind_direction_10m[i],
          precipitation: data.hourly.precipitation[i],
          precipitationProbability: data.hourly.precipitation_probability[i],
          cloudCover: data.hourly.cloud_cover[i],
          relativeHumidity: data.hourly.relative_humidity_2m[i],
          dewPoint: data.hourly.dew_point_2m[i],
          weatherCode: data.hourly.weather_code[i],
        };
      });

      const daily: WeatherDailySummary[] = data.daily.time.map((date, i) => ({
        date,
        temperatureMin: data.daily.temperature_2m_min[i],
        temperatureMax: data.daily.temperature_2m_max[i],
        weatherCode: data.daily.weather_code[i],
        precipitationSum: data.daily.precipitation_sum[i],
        windSpeedMax: data.daily.wind_speed_10m_max[i],
      }));

      return { hours, daily, source: openMeteoWeatherAdapter.name };
    } catch {
      return null;
    }
  },
};
