import type { City } from "@/types";

/**
 * EXTENSION POINT: add a new city here.
 *
 * That's the only change required to support a new location — the Data
 * Provider (`services/*`) picks weather/tide adapters based on `country`
 * and `hasTide`, and the UI/Fishing Engine are city-agnostic.
 */
export const CITIES: City[] = [
  {
    id: "zaandam",
    name: "Zaandam",
    flag: "🇳🇱",
    country: "NL",
    countryName: "Países Baixos",
    latitude: 52.4389,
    longitude: 4.8271,
    timezone: "Europe/Amsterdam",
    hasTide: true,
  },
  {
    id: "guaratuba",
    name: "Guaratuba",
    flag: "🇧🇷",
    country: "BR",
    countryName: "Brasil",
    latitude: -25.8836,
    longitude: -48.5753,
    timezone: "America/Sao_Paulo",
    hasTide: true,
  },
  {
    id: "curitiba",
    name: "Curitiba",
    flag: "🇧🇷",
    country: "BR",
    countryName: "Brasil",
    latitude: -25.4284,
    longitude: -49.2733,
    timezone: "America/Sao_Paulo",
    hasTide: false,
  },
  {
    id: "telemaco-borba",
    name: "Telêmaco Borba",
    flag: "🇧🇷",
    country: "BR",
    countryName: "Brasil",
    latitude: -24.3239,
    longitude: -50.6156,
    timezone: "America/Sao_Paulo",
    hasTide: false,
  },
];

export function getCityById(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}
