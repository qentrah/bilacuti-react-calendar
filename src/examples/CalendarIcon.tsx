import { CalendarIcon } from "../lib";
import type { CalendarIconProps } from "../lib";

const icons: CalendarIconProps["type"][] = [
  "grid",
  "month",
  "list",
  "settings",
  undefined,
];

export default function CalendarIconExample() {
  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", padding: 24 }}>
      {icons.map((type) => (
        <span
          key={type ?? "chevron"}
          style={{ display: "grid", justifyItems: "center", gap: 12 }}
        >
          <CalendarIcon type={type} />
          <span style={{ fontSize: 12 }}>{type ?? "chevron"}</span>
        </span>
      ))}
    </div>
  );
}
