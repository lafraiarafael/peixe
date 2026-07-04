import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { addDays } from "date-fns";

/** Local calendar date string (YYYY-MM-DD) for "today" in the given timezone. */
export function todayInTimeZone(timezone: string): string {
  return formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
}

/** The next `count` local calendar dates (YYYY-MM-DD), starting today, in the given timezone. */
export function nextLocalDates(timezone: string, count: number): string[] {
  const start = todayInTimeZone(timezone);
  const startDate = fromZonedTime(`${start}T00:00:00`, timezone);
  return Array.from({ length: count }, (_, i) =>
    formatInTimeZone(addDays(startDate, i), timezone, "yyyy-MM-dd"),
  );
}

/** Converts a local wall-clock date/time in `timezone` to a UTC Date instant. */
export function zonedToUtc(localDateTime: string, timezone: string): Date {
  return fromZonedTime(localDateTime, timezone);
}

/** Formats a UTC Date instant as an ISO-like string with the offset of `timezone`. */
export function utcToZonedIso(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

const WEEKDAY_LABELS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function weekdayLabel(dateStr: string, timezone: string): string {
  const date = fromZonedTime(`${dateStr}T12:00:00`, timezone);
  // 'i' is the locale-independent ISO day-of-week token (1=Monday..7=Sunday).
  const isoDay = Number(formatInTimeZone(date, timezone, "i"));
  return WEEKDAY_LABELS_PT[isoDay % 7];
}

export function timeOfDayLabel(isoLocal: string, timezone: string): string {
  return formatInTimeZone(new Date(isoLocal), timezone, "HH:mm");
}
