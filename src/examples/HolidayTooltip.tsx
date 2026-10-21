import { useId, useState } from "react";
import { HolidayTooltip } from "../lib";
import type { CalendarEvent } from "../lib";

const events: CalendarEvent[] = [
  {
    name: "Chinese New Year (Second Day)",
    date: "2026-02-18",
    kind: "public",
    regions: ["nationwide"],
  },
];

export default function HolidayTooltipExample() {
  const id = useId();
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  return (
    <div className="bc-calendar" data-theme="dark" style={{ padding: 24 }}>
      <button
        type="button"
        aria-describedby={anchor ? id : undefined}
        onBlur={() => setAnchor(null)}
        onClick={(event) => setAnchor(anchor ? null : event.currentTarget)}
        style={{
          padding: "12px 16px",
          border: "1px solid #e85d04",
          borderRadius: 8,
        }}
      >
        18 February · View holiday
      </button>
      {anchor && (
        <HolidayTooltip
          id={id}
          anchor={anchor}
          events={events}
          theme="dark"
          onDismiss={() => setAnchor(null)}
        />
      )}
    </div>
  );
}
