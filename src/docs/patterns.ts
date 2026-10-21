export const installation = `import { HolidayCalendar } from "@qentrah/react-calendar";
import "@qentrah/react-calendar/styles.css";

export default function Holidays() {
  return <HolidayCalendar
    defaultYear={2026}
    defaultStates={["johor", "kelantan"]}
    showJumpButton={false}
  />;
}`;
export const controlled = `import { useState } from "react";
import { HolidayCalendar, type CalendarView } from "@qentrah/react-calendar";
import "@qentrah/react-calendar/styles.css";

export default function Holidays() {
  const [year, setYear] = useState(2026);
  const [states, setStates] = useState(["johor"]);
  const [view, setView] = useState<CalendarView>("grid");
  return <HolidayCalendar
    year={year} onYearChange={setYear}
    states={states} onStatesChange={setStates}
    view={view} onViewChange={setView}
    showJumpButton={false}
  />;
}`;
export const filtered = `import { CalendarList, filterCalendarEvents, malaysiaHolidayData }
  from "@qentrah/react-calendar";
import "@qentrah/react-calendar/styles.css";

const events = filterCalendarEvents(
  malaysiaHolidayData[2026],
  ["johor"],
  { public: true, school: false, annualLeave: false }
);

export default function PublicHolidays() {
  return <div className="bc-calendar" data-theme="dark">
    <CalendarList events={events} />
  </div>;
}`;
export const styled = `import { CalendarIcon } from "@qentrah/react-calendar";
import "@qentrah/react-calendar/styles.css";

export default function ViewButton() {
  return <div className="bc-calendar" data-theme="light">
    <button type="button" aria-label="Calendar view"
      style={{ padding: 12, color: "#171717" }}>
      <CalendarIcon type="grid" />
    </button>
  </div>;
}`;
export interface CustomModel {
  title: string;
  date: string;
  region: string;
  theme: "dark" | "light";
  view: "grid" | "month" | "list";
}
export const defaultModel: CustomModel = {
  title: "Team planning day",
  date: "2026-06-15",
  region: "nationwide",
  theme: "dark",
  view: "list",
};
export function customDataCode(model: CustomModel) {
  const year = Number(model.date.slice(0, 4));
  return `import { HolidayCalendar, type HolidayDataset } from "@qentrah/react-calendar";
import "@qentrah/react-calendar/styles.css";

const data: HolidayDataset = {
  ${year}: {
    year: ${year},
    publicHolidays: [{
      date: ${JSON.stringify(model.date)},
      name: ${JSON.stringify(model.title)},
      regions: [${JSON.stringify(model.region)}]
    }],
    schoolHolidays: []
  }
};

export default function CustomCalendar() {
  return <HolidayCalendar data={data} defaultYear={${year}}
    defaultStates={[]} defaultView=${JSON.stringify(model.view)}
    defaultTheme=${JSON.stringify(model.theme)}
    defaultVisibility={{ public: true, school: false, annualLeave: false }}
    showRelatedLinks={false} showFooter={false} showJumpButton={false} />;
}`;
}

export function isModelDate(value: string): boolean {
  if (!/^20[2-9]\d-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}
