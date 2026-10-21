import { schoolGroupA, schoolGroupB } from "./data.js";
import type { CalendarEvent, HolidayVisibility, HolidayYear } from "./types.js";
/** Empty selection means all states; nationwide restricts public holidays only. */
export function filterCalendarEvents(
  data: HolidayYear,
  selected: readonly string[],
  visibility: HolidayVisibility,
): CalendarEvent[] {
  const matches = (regions: string[]) =>
    selected.length === 0 ||
    regions.includes("nationwide") ||
    selected.some((s) => regions.includes(s));
  const publicHolidays = data.publicHolidays.filter((e) =>
    selected.includes("nationwide")
      ? e.regions.includes("nationwide")
      : matches(e.regions),
  );
  const events: CalendarEvent[] = visibility.public
    ? publicHolidays.map((e) => ({ ...e, kind: "public" }))
    : [];
  if (visibility.school) {
    for (const holiday of data.schoolHolidays) {
      const regions =
        holiday.regions ??
        (holiday.group === "A" ? schoolGroupA : schoolGroupB);
      if (selected.includes("nationwide") || matches(regions))
        events.push({
          ...holiday,
          date: holiday.startDate,
          regions,
          kind: "school",
        });
    }
  }
  if (visibility.annualLeave) {
    const dates = new Set<string>();
    for (const holiday of publicHolidays) {
      const date = new Date(`${holiday.date}T12:00:00Z`);
      const weekday = date.getUTCDay();
      if (weekday !== 2 && weekday !== 4) continue;
      date.setUTCDate(date.getUTCDate() + (weekday === 2 ? -1 : 1));
      const key = date.toISOString().slice(0, 10);
      if (
        date.getUTCFullYear() === data.year &&
        !publicHolidays.some((e) => e.date === key)
      )
        dates.add(key);
    }
    for (const date of dates)
      events.push({
        date,
        name: "Recommended annual leave",
        kind: "leave",
        regions: [...selected],
      });
  }
  return events.sort((a, b) => a.date.localeCompare(b.date));
}
export function eventsOnDate(
  events: readonly CalendarEvent[],
  date: string,
): CalendarEvent[] {
  return events.filter((e) => e.date <= date && date <= (e.endDate ?? e.date));
}
export function monthOffset(
  year: number,
  month: number,
  sundayFirst: boolean,
): number {
  return (
    (new Date(Date.UTC(year, month, 1)).getUTCDay() + (sundayFirst ? 0 : 6)) % 7
  );
}
export function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
