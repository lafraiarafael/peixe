import { Clock, Database, ShieldCheck, Waves } from "lucide-react";
import type { CityForecast } from "@/types";
import { UpdatedAgo } from "@/components/forecast/UpdatedAgo";

export function ForecastHeader({ forecast }: { forecast: CityForecast }) {
  const { fetchedAt, sources, reliability, city } = forecast;
  const updatedTime = fetchedAt.slice(11, 16);

  const sourceLabel = [sources.weather, sources.tide].filter(Boolean).join(" + ");

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-xl border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Clock className="size-3.5" />
        Atualizado às {updatedTime} ({city.timezone.split("/")[1]?.replace("_", " ")}) ·{" "}
        <UpdatedAgo iso={fetchedAt} />
      </span>
      <span className="flex items-center gap-1.5">
        <Database className="size-3.5" />
        {sourceLabel}
      </span>
      <span className="flex items-center gap-1.5">
        <Waves className="size-3.5" />
        Astronomia: {sources.astronomy}
      </span>
      <span className="flex items-center gap-1.5">
        <ShieldCheck className="size-3.5" />
        Confiabilidade estimada: {reliability}%
      </span>
    </div>
  );
}
