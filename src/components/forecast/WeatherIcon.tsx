import {
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloud,
  Sun,
  Moon,
  type LucideProps,
} from "lucide-react";
import { getWeatherCodeInfo } from "@/lib/weatherCodes";

const ICONS = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

export function WeatherIcon({
  code,
  isDaylight = true,
  ...props
}: { code: number; isDaylight?: boolean } & LucideProps) {
  const { iconKey } = getWeatherCodeInfo(code);
  const Icon = iconKey === "sun" && !isDaylight ? Moon : ICONS[iconKey];
  return <Icon {...props} />;
}
