import type { AstronomyDay, ScoreReason, TideExtreme, TideHour, WeatherHour } from "@/types";

export interface FactorResult {
  /** 0-1 quality ratio; multiplied by the factor's weight to get points. */
  ratio: number;
  reasons: ScoreReason[];
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function ok(text: string): ScoreReason {
  return { symbol: "✔", text };
}
function bad(text: string): ScoreReason {
  return { symbol: "✖", text };
}

/**
 * Pressure: absolute level (55%) + 3h stability/trend (45%).
 * Fishing lore treats stable-to-slowly-rising, moderate-high pressure as
 * the strongest signal; rapid drops (incoming fronts) as the weakest.
 */
export function pressureFactor(hours: WeatherHour[], index: number): FactorResult {
  const reasons: ScoreReason[] = [];
  const current = hours[index].pressureMsl;
  const prevIndex = Math.max(0, index - 3);
  const delta = current - hours[prevIndex].pressureMsl;

  let absRatio: number;
  if (current >= 1013 && current <= 1025) {
    absRatio = 1;
    reasons.push(ok(`Pressão em faixa ideal (${Math.round(current)} hPa)`));
  } else if ((current >= 1005 && current < 1013) || (current > 1025 && current <= 1030)) {
    absRatio = 0.7;
    reasons.push(ok(`Pressão em faixa boa (${Math.round(current)} hPa)`));
  } else if (current < 1000 || current > 1035) {
    absRatio = 0.15;
    reasons.push(bad(`Pressão em nível extremo (${Math.round(current)} hPa)`));
  } else {
    absRatio = 0.45;
  }

  let trendRatio: number;
  if (Math.abs(delta) < 1) {
    trendRatio = 1;
    reasons.push(ok("Pressão estável nas últimas horas"));
  } else if (delta >= 1 && delta <= 3) {
    trendRatio = 0.75;
    reasons.push(ok("Pressão em leve alta"));
  } else if (delta < -3) {
    trendRatio = 0.1;
    reasons.push(bad("Pressão caindo rapidamente"));
  } else if (delta < 0) {
    trendRatio = 0.4;
    reasons.push(bad("Pressão em queda"));
  } else {
    trendRatio = 0.35;
    reasons.push(bad("Pressão subindo rápido demais (frente se aproximando)"));
  }

  return { ratio: absRatio * 0.55 + trendRatio * 0.45, reasons };
}

/** Wind: speed sweet-spot (65%) + gust penalty (35%). */
export function windFactor(hours: WeatherHour[], index: number): FactorResult {
  const reasons: ScoreReason[] = [];
  const { windSpeed: speed, windGusts: gust } = hours[index];

  let speedRatio: number;
  if (speed < 2) {
    speedRatio = 0.5;
    reasons.push(bad("Vento quase nulo (pouca movimentação na água)"));
  } else if (speed <= 20) {
    speedRatio = 1;
    reasons.push(ok(`Vento em intensidade ideal (${Math.round(speed)} km/h)`));
  } else if (speed <= 30) {
    speedRatio = 0.5;
    reasons.push(bad(`Vento forte (${Math.round(speed)} km/h)`));
  } else {
    speedRatio = 0.1;
    reasons.push(bad(`Vento muito forte (${Math.round(speed)} km/h)`));
  }

  const gustDelta = gust - speed;
  let gustRatio: number;
  if (gustDelta < 8) {
    gustRatio = 1;
  } else if (gustDelta < 15) {
    gustRatio = 0.6;
    reasons.push(bad("Rajadas de vento perceptíveis"));
  } else {
    gustRatio = 0.2;
    reasons.push(bad("Rajadas fortes, água agitada"));
  }

  return { ratio: speedRatio * 0.65 + gustRatio * 0.35, reasons };
}

/** Temperature: comfort range (60%) + intraday swing (40%). */
export function temperatureFactor(
  hours: WeatherHour[],
  index: number,
  dailyMin: number,
  dailyMax: number,
): FactorResult {
  const reasons: ScoreReason[] = [];
  const temp = hours[index].temperature;

  let absRatio: number;
  if (temp >= 15 && temp <= 26) {
    absRatio = 1;
    reasons.push(ok("Temperatura confortável"));
  } else if ((temp >= 10 && temp < 15) || (temp > 26 && temp <= 30)) {
    absRatio = 0.6;
  } else {
    absRatio = 0.2;
    reasons.push(bad(`Temperatura extrema (${Math.round(temp)}°C)`));
  }

  const swing = dailyMax - dailyMin;
  let swingRatio: number;
  if (swing <= 6) {
    swingRatio = 1;
    reasons.push(ok("Baixa variação térmica no dia"));
  } else if (swing <= 10) {
    swingRatio = 0.6;
  } else {
    swingRatio = 0.25;
    reasons.push(bad("Grande variação térmica no dia"));
  }

  return { ratio: absRatio * 0.6 + swingRatio * 0.4, reasons };
}

/** Precipitation: probability + intensity. Light rain gets a mild bonus, storms are heavily penalized. */
export function precipitationFactor(hours: WeatherHour[], index: number): FactorResult {
  const { precipitation: amt, precipitationProbability: prob } = hours[index];
  if (amt >= 4 || prob >= 80) {
    return { ratio: 0.05, reasons: [bad("Alto risco de chuva forte")] };
  }
  if (amt > 0.1 && amt < 2 && prob >= 20 && prob <= 60) {
    return { ratio: 0.9, reasons: [ok("Chuva leve prevista — pode estimular a alimentação")] };
  }
  if (prob < 20 && amt === 0) {
    return { ratio: 0.75, reasons: [ok("Sem previsão de chuva")] };
  }
  return { ratio: 0.45, reasons: [bad("Risco moderado de chuva")] };
}

/** Cloud cover: moderate-to-high overcast is the classic "good bite" sky. */
export function cloudCoverFactor(hours: WeatherHour[], index: number): FactorResult {
  const cc = hours[index].cloudCover;
  if (cc >= 40 && cc <= 85) {
    return { ratio: 1, reasons: [ok(`Nebulosidade favorável (${Math.round(cc)}%)`)] };
  }
  if (cc < 20) {
    return { ratio: 0.3, reasons: [bad("Céu muito limpo, luz intensa")] };
  }
  if (cc > 95) {
    return { ratio: 0.55, reasons: [bad("Céu totalmente encoberto")] };
  }
  return { ratio: 0.65, reasons: [] };
}

export function humidityFactor(hours: WeatherHour[], index: number): FactorResult {
  const h = hours[index].relativeHumidity;
  if (h >= 50 && h <= 90) {
    return { ratio: 1, reasons: [ok("Umidade adequada")] };
  }
  if (h < 30) {
    return { ratio: 0.3, reasons: [bad("Ar muito seco")] };
  }
  return { ratio: 0.6, reasons: [] };
}

export function dewPointFactor(hours: WeatherHour[], index: number): FactorResult {
  const spread = hours[index].temperature - hours[index].dewPoint;
  if (spread >= 2 && spread <= 6) {
    return { ratio: 1, reasons: [ok("Ponto de orvalho indica ar estável")] };
  }
  if (spread > 10) {
    return { ratio: 0.5, reasons: [bad("Ar muito seco (grande amplitude do ponto de orvalho)")] };
  }
  return { ratio: 0.65, reasons: [] };
}

/** Solunar theory: activity peaks near new and full moon. */
export function moonPhaseFactor(astronomy: AstronomyDay): FactorResult {
  const distanceToPeak = Math.min(astronomy.moonIllumination, 1 - astronomy.moonIllumination);
  const ratio = clamp(1 - 2 * distanceToPeak, 0, 1);
  const reasons: ScoreReason[] = [];
  if (ratio > 0.8) reasons.push(ok(`Fase lunar favorável (${astronomy.moonPhaseName})`));
  else if (ratio < 0.3) reasons.push(bad(`Fase lunar pouco favorável (${astronomy.moonPhaseName})`));
  return { ratio, reasons };
}

function hoursBetween(isoA: string, isoB: string): number {
  return Math.abs(new Date(isoA).getTime() - new Date(isoB).getTime()) / 3_600_000;
}

/** Solunar "minor period": bonus near moonrise/moonset. */
export function moonProximityFactor(hourTime: string, astronomy: AstronomyDay): FactorResult {
  const distances = [astronomy.moonrise, astronomy.moonset]
    .filter((t): t is string => Boolean(t))
    .map((t) => hoursBetween(hourTime, t));
  if (distances.length === 0) return { ratio: 0.4, reasons: [] };

  const minDist = Math.min(...distances);
  if (minDist <= 1) return { ratio: 1, reasons: [ok("Próximo do nascer/pôr da lua (período solunar)")] };
  if (minDist <= 2) return { ratio: 0.6, reasons: [] };
  return { ratio: 0.25, reasons: [] };
}

/** Solunar "major period": bonus near sunrise/sunset golden hours. */
export function sunProximityFactor(hourTime: string, astronomy: AstronomyDay): FactorResult {
  const minDist = Math.min(
    hoursBetween(hourTime, astronomy.sunrise),
    hoursBetween(hourTime, astronomy.sunset),
  );
  if (minDist <= 1) return { ratio: 1, reasons: [ok("Dentro do horário nobre (nascer/pôr do sol)")] };
  if (minDist <= 2) return { ratio: 0.6, reasons: [] };
  return { ratio: 0.25, reasons: [] };
}

/** Coarse seasonal adjustment: transitional seasons get a small bonus. Placeholder for future refinement per species/region. */
export function seasonFactor(dateStr: string, latitude: number): FactorResult {
  const month = Number(dateStr.slice(5, 7));
  const isNorthern = latitude >= 0;
  const transitionalMonths = isNorthern ? [3, 4, 5, 9, 10, 11] : [3, 4, 5, 9, 10, 11].map((m) => ((m + 5) % 12) + 1);
  if (transitionalMonths.includes(month)) {
    return { ratio: 0.8, reasons: [ok("Estação de transição, atividade geralmente boa")] };
  }
  return { ratio: 0.5, reasons: [] };
}

/** Tide: rate of change (movement/current, 50%) + proximity to a high/low turn (50%). */
export function tideFactor(
  tideHours: TideHour[],
  tideExtremes: TideExtreme[],
  tideIndex: number,
): FactorResult {
  const reasons: ScoreReason[] = [];
  const next = tideHours[tideIndex + 1] ?? tideHours[tideIndex];
  const prev = tideHours[tideIndex - 1] ?? tideHours[tideIndex];
  const rate = Math.abs(next.height - prev.height) / 2;

  let rateRatio: number;
  if (rate >= 0.15) {
    rateRatio = 1;
    reasons.push(ok("Maré em movimento (boa correnteza)"));
  } else if (rate >= 0.05) {
    rateRatio = 0.6;
  } else {
    rateRatio = 0.2;
    reasons.push(bad("Maré parada (baixa correnteza)"));
  }

  let proximityRatio = 0.3;
  if (tideExtremes.length > 0) {
    const minDist = Math.min(
      ...tideExtremes.map((e) => hoursBetween(tideHours[tideIndex].time, e.time)),
    );
    if (minDist <= 1) {
      proximityRatio = 1;
      reasons.push(ok("Próximo da virada de maré (pico de atividade)"));
    } else if (minDist <= 2) {
      proximityRatio = 0.6;
    }
  }

  return { ratio: rateRatio * 0.5 + proximityRatio * 0.5, reasons };
}
