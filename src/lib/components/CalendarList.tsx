import { regionName } from "../data.js";
import type { CalendarEvent } from "../types.js";
export interface CalendarListProps {
  events: readonly CalendarEvent[];
}
const formatDate = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
export function CalendarList({ events }: CalendarListProps) {
  const groups = new Map<string, CalendarEvent[]>();
  for (const event of [...events].sort((a, b) => a.date.localeCompare(b.date))) {
    const key = event.date.slice(0, 7);
    const group = groups.get(key) ?? [];
    group.push(event);
    groups.set(key, group);
  }
  return <div className="event-list">{Array.from(groups, ([month, monthEvents]) => <section key={month}>
    <h2>{new Date(`${month}-01T12:00:00Z`).toLocaleDateString("en", { month: "long", year: "numeric", timeZone: "UTC" })}</h2>
    {monthEvents.map((event, i) => <div className="event-row" key={`${event.name}-${i}`}>
      <span className="event-date">{new Date(`${event.date}T12:00:00Z`).toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })}</span>
      <div className={`event-info ${event.kind}`}><h3>{event.name}</h3>
        {event.endDate && <small>{formatDate(event.date)}{event.endDate !== event.date && ` – ${formatDate(event.endDate)}`}</small>}
        <small>{event.regions.length ? event.regions.map(regionName).join(", ") : "Nationwide"}</small>
      </div>
    </div>)}
  </section>)}</div>;
}
