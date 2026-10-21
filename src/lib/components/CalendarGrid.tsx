import { useCallback, useEffect, useId, useState } from "react";
import { dateKey, eventsOnDate, monthOffset } from "../calendar.js";
import { monthNames } from "../data.js";
import type {
  CalendarEvent,
  CalendarTheme,
  CalendarView,
  WeekStart,
} from "../types.js";
import { HolidayTooltip } from "./HolidayTooltip.js";
export interface CalendarGridProps {
  year: number;
  events: readonly CalendarEvent[];
  view: Exclude<CalendarView, "list">;
  weekStart: WeekStart;
  theme: CalendarTheme;
  idPrefix: string;
  onDateSelect?: (date: string, events: CalendarEvent[]) => void;
}
interface ActiveDay {
  anchor: HTMLButtonElement;
  date: string;
  events: CalendarEvent[];
  pinned: boolean;
}
export function CalendarGrid({
  year,
  events,
  view,
  weekStart,
  theme,
  idPrefix,
  onDateSelect,
}: CalendarGridProps) {
  const [active, setActive] = useState<ActiveDay | null>(null);
  const tooltipId = useId();
  useEffect(() => setActive(null), [year, events, view, weekStart]);
  const dismiss = useCallback(() => setActive(null), []);
  const show = (
    anchor: HTMLButtonElement,
    date: string,
    dayEvents: CalendarEvent[],
    pinned = false,
  ) => {
    if (dayEvents.length)
      setActive({ anchor, date, events: dayEvents, pinned });
    else setActive(null);
  };
  return (
    <>
      <div
        className={`calendar-grid ${view}`}
        onKeyDown={(e) => {
          if (e.key === "Escape") dismiss();
        }}
      >
        {monthNames.map((monthName, month) => (
          <section
            className="month"
            id={`${idPrefix}-month-${month}`}
            key={month}
          >
            <h2>{monthName}</h2>
            <div className="week">
              {(weekStart === "sunday"
                ? [6, 0, 1, 2, 3, 4, 5]
                : [0, 1, 2, 3, 4, 5, 6]
              ).map((i) => (
                <span key={i}>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ][i].slice(0, view === "month" ? 3 : 2)}
                </span>
              ))}
            </div>
            <div className="days">
              {Array.from(
                { length: monthOffset(year, month, weekStart === "sunday") },
                (_, i) => (
                  <div key={`blank-${i}`} />
                ),
              )}
              {Array.from(
                { length: new Date(Date.UTC(year, month + 1, 0)).getUTCDate() },
                (_, i) => {
                  const date = dateKey(year, month, i + 1),
                    dayEvents = eventsOnDate(events, date);
                  const publicDay = dayEvents.some((e) => e.kind === "public"),
                    schoolDay = dayEvents.some((e) => e.kind === "school"),
                    leave = dayEvents.some((e) => e.kind === "leave");
                  const kind = publicDay
                    ? "public"
                    : schoolDay
                      ? "school"
                      : leave
                        ? "leave"
                        : [0, 6].includes(
                              new Date(
                                Date.UTC(year, month, i + 1),
                              ).getUTCDay(),
                            )
                          ? "weekend"
                          : "";
                  return (
                    <div
                      className="day-wrap"
                      key={date}
                      onMouseLeave={() =>
                        setActive((current) =>
                          current?.date === date && !current.pinned
                            ? null
                            : current,
                        )
                      }
                    >
                      <button
                        type="button"
                        className={`day ${kind}`}
                        aria-label={`${i + 1} ${monthName} ${year}${dayEvents.length ? `, ${dayEvents.map((e) => e.name).join(", ")}` : ""}`}
                        aria-describedby={
                          active?.date === date ? tooltipId : undefined
                        }
                        onMouseEnter={(e) => {
                          if (!active?.pinned)
                            show(e.currentTarget, date, dayEvents);
                        }}
                        onFocus={(e) => show(e.currentTarget, date, dayEvents)}
                        onBlur={() =>
                          setActive((current) =>
                            current?.date === date ? null : current,
                          )
                        }
                        onClick={(e) => {
                          if (active?.date === date && active.pinned) dismiss();
                          else show(e.currentTarget, date, dayEvents, true);
                          onDateSelect?.(date, dayEvents);
                        }}
                      >
                        <span>{i + 1}</span>
                        <span className="dots">
                          {publicDay && <i className="orange" />}
                          {schoolDay && <i className="blue" />}
                          {leave && <i className="green" />}
                        </span>
                      </button>
                    </div>
                  );
                },
              )}
            </div>
          </section>
        ))}
      </div>
      {active && (
        <HolidayTooltip
          id={tooltipId}
          anchor={active.anchor}
          events={active.events}
          theme={theme}
          onDismiss={dismiss}
        />
      )}
    </>
  );
}
