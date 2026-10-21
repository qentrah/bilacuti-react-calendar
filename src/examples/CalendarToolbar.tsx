import { useState } from "react";
import { CalendarToolbar } from "../lib";
import type {
  CalendarTheme,
  CalendarView,
  HolidayVisibility,
  WeekStart,
} from "../lib";

export default function CalendarToolbarExample() {
  const [year, setYear] = useState(2026);
  const [states, setStates] = useState(["johor", "kelantan"]);
  const [view, setView] = useState<CalendarView>("grid");
  const [theme, setTheme] = useState<CalendarTheme>("dark");
  const [weekStart, setWeekStart] = useState<WeekStart>("monday");
  const [visibility, setVisibility] = useState<HolidayVisibility>({
    public: true,
    school: true,
    annualLeave: false,
  });
  return (
    <div
      className="bc-calendar"
      data-theme={theme}
      style={{ padding: 16, margin: "auto" }}
    >
      <CalendarToolbar
        years={[2026, 2027]}
        year={year}
        onYearChange={setYear}
        selectedStates={states}
        onStatesChange={setStates}
        view={view}
        onViewChange={setView}
        theme={theme}
        onThemeChange={setTheme}
        weekStart={weekStart}
        onWeekStartChange={setWeekStart}
        visibility={visibility}
        onVisibilityChange={setVisibility}
      />
      <p
        aria-live="polite"
        style={{ fontSize: 13, color: "#888", lineHeight: 1.8 }}
      >
        {year} · {states.length ? states.join(", ") : "all states"} · {view} ·{" "}
        {weekStart}
        <br />
        Public: {visibility.public ? "on" : "off"} · School:{" "}
        {visibility.school ? "on" : "off"}
        {visibility.annualLeave ? " · Annual leave: on" : ""}
      </p>
    </div>
  );
}
