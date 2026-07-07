/**
 * Fishing Score factor weights. These sum to 100 when tide applies.
 * Documented rationale per factor is in `factors.ts` next to its scoring
 * function — this file only owns the point budget.
 */
export const FACTOR_WEIGHTS = {
  pressure: 18, // absolute level + stability/trend
  wind: 14, // speed sweet-spot + gust penalty
  temperature: 8, // comfort range + swing
  precipitation: 10, // probability + intensity
  cloudCover: 7, // overcast sweet-spot
  humidity: 4,
  dewPoint: 4, // dew point spread
  moonPhase: 9, // solunar: new/full peaks
  moonProximity: 5, // near moonrise/moonset (solunar minor period)
  sunProximity: 7, // near sunrise/sunset/twilight (solunar major period)
  season: 2,
  tide: 12, // rate of change + proximity to high/low turn
} as const;

export type FactorKey = keyof typeof FACTOR_WEIGHTS;

export const FACTOR_LABELS: Record<FactorKey, string> = {
  pressure: "Pressão",
  wind: "Vento",
  temperature: "Temperatura",
  precipitation: "Chuva",
  cloudCover: "Nebulosidade",
  humidity: "Umidade",
  dewPoint: "Ponto de orvalho",
  moonPhase: "Fase lunar",
  moonProximity: "Proximidade lunar",
  sunProximity: "Proximidade do sol",
  season: "Estação",
  tide: "Maré",
};

/** Short "what it looks at" description shown in the score-methodology dialog. */
export const FACTOR_DESCRIPTIONS: Record<FactorKey, string> = {
  pressure: "nível absoluto (1013-1025 hPa = ideal) + estabilidade/tendência nas últimas 3h",
  wind: 'velocidade "doce" 2-20 km/h ideal + penalidade por rajadas',
  tide: "velocidade de movimento da água + proximidade da virada (alta/baixa)",
  precipitation: "garoa leve = bônus (estimula alimentação); chuva forte = penalidade pesada",
  moonPhase: "teoria solunar — lua nova e cheia são os picos",
  temperature: "conforto térmico (15-26°C) + baixa variação no dia",
  cloudCover: 'céu parcialmente encoberto (40-85%) é o "clássico dia de peixe"',
  sunProximity: 'bônus perto do nascer/pôr do sol (período solunar "maior")',
  moonProximity: 'bônus perto do nascer/pôr da lua (período solunar "menor")',
  humidity: "50-90% é o ideal",
  dewPoint: "amplitude pequena = ar estável",
  season: "bônus leve em estações de transição — heurística grosseira, não calibrada por espécie/região",
};

const TOTAL_WITH_TIDE = Object.values(FACTOR_WEIGHTS).reduce((a, b) => a + b, 0); // 100

/**
 * When a city has no meaningful tide (e.g. inland Curitiba), the tide
 * factor is dropped and its weight is redistributed proportionally across
 * every remaining factor so the total still adds up to 100.
 */
export function getEffectiveWeights(hasTide: boolean): Record<FactorKey, number> {
  if (hasTide) return { ...FACTOR_WEIGHTS };

  const withoutTide = TOTAL_WITH_TIDE - FACTOR_WEIGHTS.tide;
  const scale = TOTAL_WITH_TIDE / withoutTide;

  const scaled = {} as Record<FactorKey, number>;
  for (const key of Object.keys(FACTOR_WEIGHTS) as FactorKey[]) {
    scaled[key] = key === "tide" ? 0 : FACTOR_WEIGHTS[key] * scale;
  }
  return scaled;
}
