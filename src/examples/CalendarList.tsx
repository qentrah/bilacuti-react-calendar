import {
  CalendarList,
  filterCalendarEvents,
  malaysiaHolidayData,
} from "../lib";

const events = filterCalendarEvents(malaysiaHolidayData[2026], ["johor"], {
  public: true,
  school: false,
  annualLeave: false,
});

export default function CalendarListExample() {
  return (
    <div
      className="bc-calendar"
      data-theme="dark"
      style={{ padding: 16, margin: "auto" }}
    >
      <CalendarList events={events} />
    </div>
  );
}
