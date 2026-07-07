"use client";

import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FACTOR_DESCRIPTIONS, FACTOR_LABELS, FACTOR_WEIGHTS, type FactorKey } from "@/services/engine/weights";

const RANKED_FACTORS = (Object.keys(FACTOR_WEIGHTS) as FactorKey[]).sort(
  (a, b) => FACTOR_WEIGHTS[b] - FACTOR_WEIGHTS[a],
);

export function ScoreInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Como o Fishing Score é calculado" className="rounded-full" />
        }
      >
        <Info className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Como o Fishing Score é calculado</DialogTitle>
          <DialogDescription>
            Cada hora recebe uma nota de 0 a 100: cada fator abaixo vira uma nota interna de 0
            a 1 (ex.: pressão ideal = 1,0), multiplicada pelo seu peso, e tudo é somado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
            Pesos, do mais pro menos importante
          </p>
          <div className="rounded-lg border divide-y overflow-hidden">
            {RANKED_FACTORS.map((key) => (
              <div key={key} className="flex items-start gap-3 px-3 py-2 text-sm">
                <span className="w-7 shrink-0 text-right font-semibold tabular-nums text-muted-foreground">
                  {FACTOR_WEIGHTS[key]}
                </span>
                <div className="min-w-0">
                  <p className="font-medium leading-tight">{FACTOR_LABELS[key]}</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {FACTOR_DESCRIPTIONS[key]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground px-1">
          Quando a cidade não tem maré (ex.: Curitiba, Telêmaco Borba), o peso da Maré é
          redistribuído proporcionalmente pelos outros fatores — não é descartado, só reencaixado.
        </p>

        <p className="text-xs text-muted-foreground px-1 border-t pt-3">
          Isso é uma métrica própria, não uma fórmula científica oficial: sintetiza o &ldquo;folclore
          de pescador&rdquo; mais repetido (teoria solunar, pressão barométrica, vento/nebulosidade
          favoráveis) — o mesmo tipo de heurística que apps de pesca usam por trás dos panos.
          Alguns fatores têm respaldo real (pressão, temperatura), outros são mais tradição do
          que ciência rígida (fase lunar). Não foi calibrado com dados reais de captura.
        </p>
      </DialogContent>
    </Dialog>
  );
}
