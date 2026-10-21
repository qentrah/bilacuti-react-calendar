import { HolidayCalendar } from "../lib";

export default function HolidayCalendarExample() {
  return (
    <HolidayCalendar
      defaultYear={2026}
      defaultStates={["johor", "kelantan"]}
      showJumpButton={false}
      showRelatedLinks={false}
      showFooter={false}
      style={{ padding: "24px 12px", margin: "auto" }}
    />
  );
}
