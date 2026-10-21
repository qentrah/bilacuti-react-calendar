import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HolidayCalendar } from "./lib";
import type { CalendarTheme, CalendarView } from "./lib";
import "./style.css";
import "./demo.css";
import { LibraryPage } from "./LibraryPage";
function Demo() {
  const params = new URLSearchParams(location.search);
  const [year, setYear] = useState(params.get("year") === "2027" ? 2027 : 2026);
  const [states, setStates] = useState(
    params.get("state")?.split(",") ?? ["johor", "kelantan"],
  );
  const [view, setView] = useState<CalendarView>(
    params.get("view") === "month"
      ? "month"
      : params.get("view") === "list"
        ? "list"
        : "grid",
  );
  const [theme, setTheme] = useState<CalendarTheme>("dark");
  useEffect(() => {
    const url = new URL(location.href);
    states.length
      ? url.searchParams.set("state", states.join(","))
      : url.searchParams.delete("state");
    year === 2026
      ? url.searchParams.delete("year")
      : url.searchParams.set("year", String(year));
    view === "grid"
      ? url.searchParams.delete("view")
      : url.searchParams.set("view", view);
    history.replaceState({}, "", url);
  }, [states, year, view]);
  return (
    <div className={`demo-page ${theme}`}>
      <a
        className="demo-library-link"
        href={`${import.meta.env.BASE_URL}library/`}
      >
        Component library ↗
      </a>
      <HolidayCalendar
        year={year}
        onYearChange={setYear}
        states={states}
        onStatesChange={setStates}
        view={view}
        onViewChange={setView}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  location.pathname
    .replace(import.meta.env.BASE_URL, "/")
    .replace(/\/$/, "") === "/library" ? (
    <LibraryPage />
  ) : (
    <Demo />
  ),
);
