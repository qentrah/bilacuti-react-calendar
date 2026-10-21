import { useId, useState } from "react";
import {
  CalendarGrid,
  filterCalendarEvents,
  malaysiaHolidayData,
} from "../lib";
import type { CalendarView } from "../lib";

const events = filterCalendarEvents(
  malaysiaHolidayData[2026],
  ["johor", "kelantan"],
  {
    public: true,
    school: true,
    annualLeave: false,
  },
);

export default function CalendarGridExample() {
  const id = useId();
  const [view, setView] = useState<Exclude<CalendarView, "list">>("grid");
  return (
    <div
      className="bc-calendar"
      data-theme="dark"
      style={{ padding: 16, margin: "auto" }}
    >
      <button
        type="button"
        onClick={() => setView(view === "grid" ? "month" : "grid")}
        style={{ padding: 8, border: "1px solid #555", borderRadius: 6 }}
      >
        Switch to {view === "grid" ? "month" : "grid"} view
      </button>
      <CalendarGrid
        year={2026}
        events={events}
        view={view}
        weekStart="monday"
        theme="dark"
        idPrefix={id}
      />
    </div>
  );
}
