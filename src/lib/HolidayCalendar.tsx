import { useId, useMemo, useRef } from "react";
import { filterCalendarEvents } from "./calendar.js";
import { malaysiaHolidayData, monthNames } from "./data.js";
import { useControllable } from "./hooks/useControllable.js";
import { CalendarGrid } from "./components/CalendarGrid.js";
import { CalendarList } from "./components/CalendarList.js";
import { CalendarToolbar } from "./components/CalendarToolbar.js";
import {
  CalendarFooter,
  CalendarRelatedLinks,
} from "./components/CalendarFooter.js";
import type { HolidayCalendarProps, HolidayVisibility } from "./types.js";
const defaultVisibility: HolidayVisibility = {
  public: true,
  school: true,
  annualLeave: false,
};
/** Standalone calendar. No document styles, URL mutations, or app-level side effects. */
export function HolidayCalendar(props: HolidayCalendarProps) {
  const data = props.data ?? malaysiaHolidayData;
  const years = Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b);
  if (!years.length)
    throw new Error(
      "HolidayCalendar requires at least one year of holiday data.",
    );
  const [requestedYear, setYear] = useControllable(
    props.year,
    props.defaultYear ?? years[0],
    props.onYearChange,
  );
  const year = data[requestedYear] ? requestedYear : years[0];
  const [selectedStates, setStates] = useControllable(
    props.states,
    props.defaultStates ?? [],
    props.onStatesChange,
  );
  const [theme, setTheme] = useControllable(
    props.theme,
    props.defaultTheme ?? "dark",
    props.onThemeChange,
  );
  const [view, setView] = useControllable(
    props.view,
    props.defaultView ?? "grid",
    props.onViewChange,
  );
  const [weekStart, setWeekStart] = useControllable(
    props.weekStart,
    props.defaultWeekStart ?? "monday",
    props.onWeekStartChange,
  );
  const [visibility, setVisibility] = useControllable(
    props.visibility,
    props.defaultVisibility ?? defaultVisibility,
    props.onVisibilityChange,
  );
  const events = useMemo(
    () => filterCalendarEvents(data[year], selectedStates, visibility),
    [data, year, selectedStates, visibility],
  );
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const today = new Date();
  const jumpMonth = today.getFullYear() === year ? today.getMonth() : 0;
  return (
    <div
      ref={root}
      className={`bc-calendar ${props.className ?? ""}`}
      data-theme={theme}
      style={props.style}
    >
      <header>
        <h1>
          Malaysia <span className="public-pill">Public</span> and
          <br />
          <span className="school-pill">School</span> Holidays
        </h1>
        <div className="legend">
          <span>
            <i className="orange" />
            Public holiday
          </span>
          <span>
            <i className="blue" />
            School holiday
          </span>
        </div>
      </header>
      <CalendarToolbar
        years={years}
        year={year}
        onYearChange={setYear}
        selectedStates={selectedStates}
        onStatesChange={setStates}
        theme={theme}
        onThemeChange={setTheme}
        view={view}
        onViewChange={setView}
        weekStart={weekStart}
        onWeekStartChange={setWeekStart}
        visibility={visibility}
        onVisibilityChange={setVisibility}
      />
      {view === "list" ? (
        <CalendarList events={events} />
      ) : (
        <CalendarGrid
          key={`${year}-${view}-${selectedStates.join(",")}-${JSON.stringify(visibility)}`}
          year={year}
          events={events}
          view={view}
          theme={theme}
          weekStart={weekStart}
          idPrefix={id}
          onDateSelect={props.onDateSelect}
        />
      )}
      {props.showRelatedLinks !== false && <CalendarRelatedLinks year={year} />}
      {props.showFooter !== false && <CalendarFooter />}
      {props.showJumpButton !== false && view !== "list" && (
        <button
          type="button"
          className="go-month"
          onClick={() => {
            const target = root.current?.querySelector<HTMLElement>(
              `[id="${id}-month-${jumpMonth}"]`,
            );
            target?.scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "auto"
                : "smooth",
              block: "start",
            });
          }}
        >
          ↓ Go to {monthNames[jumpMonth]}
        </button>
      )}
    </div>
  );
}
