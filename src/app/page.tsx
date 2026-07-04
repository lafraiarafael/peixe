import { CITIES } from "@/lib/cities";
import { CityButton } from "@/components/home/CityButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            🎣 Fishing Forecast
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Escolha uma cidade para ver a previsão de pesca dos próximos 15 dias
          </p>
        </div>

        <div className="space-y-3">
          {CITIES.map((city) => (
            <CityButton key={city.id} city={city} />
          ))}
        </div>
      </div>
    </div>
  );
}
