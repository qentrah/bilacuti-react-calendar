import { CalendarRelatedLinks } from "../lib";

export default function CalendarRelatedLinksExample() {
  return (
    <div
      className="bc-calendar"
      data-theme="dark"
      style={{ padding: 16, margin: "auto" }}
    >
      <CalendarRelatedLinks year={2026} />
    </div>
  );
}
