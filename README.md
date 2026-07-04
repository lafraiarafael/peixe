# 🎣 Fishing Forecast

Assistente inteligente de pesca: analisa os próximos 15 dias e classifica cada
dia e cada hora em **Ruim · Regular · Bom · Ótimo**, com base em dados reais
de meteorologia, marés e astronomia — nunca mockados.

Cidades suportadas: Zaandam (NL), Guaratuba (BR) e Curitiba (BR).

## Stack

Next.js (App Router) + TypeScript · Tailwind CSS · shadcn/ui · Lucide Icons ·
Recharts · Server Components.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Arquitetura

- `src/types/` — contratos de dados (cidade, clima, maré, astronomia, previsão, score).
- `src/services/weather/`, `src/services/tide/` — Data Provider: adapters por
  fonte (Open-Meteo real hoje; ECMWF/NOAA/KNMI/INMET/Stormglass/WorldTides
  como stubs documentados, ativados ao configurar a API key correspondente —
  ver `.env.example`), com fallback automático.
- `src/services/astronomy/` — sol/lua via `suncalc`.
- `src/services/dataProvider.ts` — orquestra as fontes acima com cache de ~30min por cidade.
- `src/services/engine/` — **Fishing Engine**: calcula o Fishing Score (0-100)
  por hora a partir de pesos documentados (`weights.ts`), com funções de
  pontuação por fator (`factors.ts`) e o **Fishing Analyzer** embutido que
  gera as explicações ✔/✖ de cada score.
- `src/lib/cities.ts` — **ponto de extensão para novas cidades**: basta
  adicionar lat/long/timezone/país.

## Variáveis de ambiente

Veja [.env.example](.env.example) — nenhuma é obrigatória para rodar; são
chaves opcionais para fontes oficiais futuras (ECMWF, NOAA, KNMI, INMET,
Stormglass, WorldTides).
