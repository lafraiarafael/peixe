import * as SunCalc from "suncalc";
import type { AstronomyDay } from "@/types";
import { zonedToUtc, utcToZonedIso } from "@/utils/time";

/**
 * Astronomy is computed locally (no external API) via the `suncalc` library:
 * sun events (sunrise/sunset, civil/nautical twilight) and moon events
 * (rise/set, phase, illumination). This is deterministic and free, so it
 * never needs a fallback adapter the way weather/tide do.
 */
function moonPhaseName(phase: number): string {
  if (phase < 0.02 || phase > 0.98) return "Lua Nova";
  if (phase < 0.23) return "Crescente";
  if (phase < 0.27) return "Quarto Crescente";
  if (phase < 0.48) return "Crescente Gibosa";
  if (phase < 0.52) return "Lua Cheia";
  if (phase < 0.73) return "Minguante Gibosa";
  if (phase < 0.77) return "Quarto Minguante";
  return "Minguante";
}

export function computeAstronomyDay(
  dateStr: string,
  latitude: number,
  longitude: number,
  timezone: string,
): AstronomyDay {
  // Noon anchors the calculation to the correct local calendar day.
  const localNoonUtc = zonedToUtc(`${dateStr}T12:00:00`, timezone);

  const sun = SunCalc.getTimes(localNoonUtc, latitude, longitude);
  const moonTimes = SunCalc.getMoonTimes(localNoonUtc, latitude, longitude);
  const illumination = SunCalc.getMoonIllumination(localNoonUtc);

  // At extreme latitudes some twilight events don't occur (polar day/night);
  // solarNoon is always defined, so it's a safe fallback for our three
  // mid-latitude cities where this branch is never actually exercised.
  const at = (d: Date | null) => utcToZonedIso(d ?? sun.solarNoon, timezone);

  return {
    date: dateStr,
    sunrise: at(sun.sunrise),
    sunset: at(sun.sunset),
    civilDawn: at(sun.dawn),
    civilDusk: at(sun.dusk),
    nauticalDawn: at(sun.nauticalDawn),
    nauticalDusk: at(sun.nauticalDusk),
    moonrise: moonTimes.rise ? utcToZonedIso(moonTimes.rise, timezone) : null,
    moonset: moonTimes.set ? utcToZonedIso(moonTimes.set, timezone) : null,
    moonPhase: illumination.phase,
    moonPhaseName: moonPhaseName(illumination.phase),
    moonIllumination: illumination.fraction,
  };
}

export function computeAstronomyRange(
  dates: string[],
  latitude: number,
  longitude: number,
  timezone: string,
): AstronomyDay[] {
  return dates.map((d) => computeAstronomyDay(d, latitude, longitude, timezone));
}
