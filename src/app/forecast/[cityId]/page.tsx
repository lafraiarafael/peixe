import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCityById } from "@/lib/cities";
import { getForecastForCity } from "@/services/dataProvider";
import { ForecastHeader } from "@/components/forecast/ForecastHeader";
import { ForecastView } from "@/components/forecast/ForecastView";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ForecastPage({
  params,
}: {
  params: Promise<{ cityId: string }>;
}) {
  const { cityId } = await params;
  const city = getCityById(cityId);
  if (!city) notFound();

  const forecast = await getForecastForCity(city);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:py-8 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="gap-1.5 -ml-2"
          render={
            <Link href="/">
              <ArrowLeft className="size-4" />
              Cidades
            </Link>
          }
        />
        <ThemeToggle />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <span>{city.flag}</span>
          {city.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Previsão de pesca para os próximos 15 dias
        </p>
      </div>

      <ForecastHeader forecast={forecast} />
      <ForecastView forecast={forecast} />
    </div>
  );
}
