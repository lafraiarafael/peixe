import { Droplets, Wind } from "lucide-react";

export function HourRowLegend() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-3 px-1 pb-1.5 text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wide text-muted-foreground/70 font-medium">
      <span className="w-9 sm:w-11 shrink-0">Hora</span>
      <span className="size-4 shrink-0" aria-hidden />
      <span className="w-9 sm:w-11 shrink-0">Temp</span>
      <span className="w-7 sm:w-16 shrink-0 flex justify-end sm:justify-start">
        <Wind className="size-3 sm:hidden" />
        <span className="hidden sm:inline">Vento</span>
      </span>
      <span className="w-9 sm:w-14 shrink-0 flex justify-end sm:justify-start">
        <Droplets className="size-3 sm:hidden" />
        <span className="hidden sm:inline">Chuva</span>
      </span>
      <span className="ml-auto">Score</span>
    </div>
  );
}
