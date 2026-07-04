/**
 * WMO weather interpretation codes (used by Open-Meteo and most official
 * services), mapped to a Portuguese label and an icon key resolved by
 * `components/forecast/WeatherIcon.tsx`.
 */
export interface WeatherCodeInfo {
  label: string;
  iconKey: "sun" | "cloud-sun" | "cloud" | "fog" | "drizzle" | "rain" | "snow" | "storm";
}

const CODES: Record<number, WeatherCodeInfo> = {
  0: { label: "Céu limpo", iconKey: "sun" },
  1: { label: "Poucas nuvens", iconKey: "cloud-sun" },
  2: { label: "Parcialmente nublado", iconKey: "cloud-sun" },
  3: { label: "Nublado", iconKey: "cloud" },
  45: { label: "Nevoeiro", iconKey: "fog" },
  48: { label: "Nevoeiro com geada", iconKey: "fog" },
  51: { label: "Garoa fraca", iconKey: "drizzle" },
  53: { label: "Garoa", iconKey: "drizzle" },
  55: { label: "Garoa forte", iconKey: "drizzle" },
  56: { label: "Garoa congelante", iconKey: "drizzle" },
  57: { label: "Garoa congelante forte", iconKey: "drizzle" },
  61: { label: "Chuva fraca", iconKey: "rain" },
  63: { label: "Chuva", iconKey: "rain" },
  65: { label: "Chuva forte", iconKey: "rain" },
  66: { label: "Chuva congelante", iconKey: "rain" },
  67: { label: "Chuva congelante forte", iconKey: "rain" },
  71: { label: "Neve fraca", iconKey: "snow" },
  73: { label: "Neve", iconKey: "snow" },
  75: { label: "Neve forte", iconKey: "snow" },
  77: { label: "Grãos de neve", iconKey: "snow" },
  80: { label: "Pancadas de chuva fracas", iconKey: "rain" },
  81: { label: "Pancadas de chuva", iconKey: "rain" },
  82: { label: "Pancadas de chuva fortes", iconKey: "rain" },
  85: { label: "Pancadas de neve fracas", iconKey: "snow" },
  86: { label: "Pancadas de neve fortes", iconKey: "snow" },
  95: { label: "Trovoada", iconKey: "storm" },
  96: { label: "Trovoada com granizo fraco", iconKey: "storm" },
  99: { label: "Trovoada com granizo forte", iconKey: "storm" },
};

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  return CODES[code] ?? { label: "Indefinido", iconKey: "cloud" };
}
