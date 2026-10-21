import type {
  CalendarTheme,
  CalendarView,
  HolidayKind,
  WeekStart,
} from "../lib";
export const componentNames = [
  "HolidayCalendar",
  "CalendarToolbar",
  "CalendarGrid",
  "CalendarList",
  "HolidayTooltip",
  "CalendarRelatedLinks",
  "CalendarFooter",
  "CalendarIcon",
] as const;
export type ComponentName = (typeof componentNames)[number];
export interface PlaygroundSettings {
  year: number;
  theme: CalendarTheme;
  view: CalendarView;
  states: string[];
  weekStart: WeekStart;
  public: boolean;
  school: boolean;
  annualLeave: boolean;
  showRelatedLinks: boolean;
  showFooter: boolean;
  showJumpButton: boolean;
  padding: number;
  className: string;
  title: string;
  date: string;
  kind: HolidayKind;
  icon: "grid" | "month" | "list" | "settings" | "chevron";
  color: string;
}
export const initialSettings: PlaygroundSettings = {
  year: 2026,
  theme: "dark",
  view: "grid",
  states: ["johor", "kelantan"],
  weekStart: "monday",
  public: true,
  school: true,
  annualLeave: false,
  showRelatedLinks: false,
  showFooter: false,
  showJumpButton: false,
  padding: 16,
  className: "",
  title: "Chinese New Year (Second Day)",
  date: "2026-02-18",
  kind: "public",
  icon: "grid",
  color: "#ededed",
};
export interface PropRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
  required?: boolean;
}
const row = (
  name: string,
  type: string,
  defaultValue: string,
  description: string,
  required = false,
): PropRow => ({ name, type, defaultValue, description, required });
const callback = (name: string, type: string, description: string) =>
  row(name, type, "—", description, true);
const events = row(
  "events",
  "readonly CalendarEvent[]",
  "—",
  "Events to display; date ranges are inclusive.",
  true,
);
const theme = row(
  "theme",
  '"light" | "dark"',
  "—",
  "Scoped color theme.",
  true,
);
export const propsByComponent: Record<ComponentName, PropRow[]> = {
  HolidayCalendar: [
    row(
      "data",
      "HolidayDataset",
      "malaysiaHolidayData",
      "Year-indexed public holidays and school ranges.",
    ),
    ...(
      ["year", "states", "theme", "view", "weekStart", "visibility"] as const
    ).flatMap((name) => {
      const types = {
        year: "number",
        states: "string[]",
        theme: "CalendarTheme",
        view: "CalendarView",
        weekStart: "WeekStart",
        visibility: "HolidayVisibility",
      };
      const defaults = {
        year: "first dataset year",
        states: "[] (all states)",
        theme: '"dark"',
        view: '"grid"',
        weekStart: '"monday"',
        visibility: "{ public: true, school: true, annualLeave: false }",
      };
      const capital = name[0].toUpperCase() + name.slice(1);
      return [
        row(
          name,
          types[name],
          "uncontrolled",
          `Controlled ${name}; provide its on${capital}Change handler.`,
        ),
        row(
          "default" + capital,
          types[name],
          defaults[name],
          `Initial ${name} in uncontrolled mode.`,
        ),
        row(
          "on" + capital + "Change",
          `(${name}: ${types[name]}) => void`,
          "—",
          `Called when ${name} changes.`,
        ),
      ];
    }),
    ...["showRelatedLinks", "showFooter", "showJumpButton"].map((name) =>
      row(
        name,
        "boolean",
        "true",
        "Show the corresponding section or jump button.",
      ),
    ),
    row("className", "string", '""', "Additional class on the calendar root."),
    row("style", "CSSProperties", "—", "Inline styles on the root."),
    row(
      "onDateSelect",
      "(date: string, events: CalendarEvent[]) => void",
      "—",
      "Called when a date is clicked.",
    ),
  ],
  CalendarToolbar: [
    row("years", "number[]", "—", "Available year options.", true),
    row("year", "number", "—", "Currently selected year.", true),
    callback(
      "onYearChange",
      "(year: number) => void",
      "Update the selected year.",
    ),
    row(
      "selectedStates",
      "string[]",
      "—",
      "State slugs; [] includes all states.",
      true,
    ),
    callback(
      "onStatesChange",
      "(states: string[]) => void",
      "Update the state selection.",
    ),
    row("view", "CalendarView", "—", "grid, month, or list.", true),
    callback(
      "onViewChange",
      "(view: CalendarView) => void",
      "Update the calendar view.",
    ),
    theme,
    callback(
      "onThemeChange",
      "(theme: CalendarTheme) => void",
      "Update the scoped theme.",
    ),
    row("weekStart", "WeekStart", "—", "monday or sunday.", true),
    callback(
      "onWeekStartChange",
      "(start: WeekStart) => void",
      "Update the first weekday.",
    ),
    row(
      "visibility",
      "HolidayVisibility",
      "—",
      "Public, school, and annual leave visibility.",
      true,
    ),
    callback(
      "onVisibilityChange",
      "(visibility: HolidayVisibility) => void",
      "Update holiday visibility.",
    ),
  ],
  CalendarGrid: [
    row("year", "number", "—", "Year used to calculate the date grid.", true),
    events,
    row(
      "view",
      '"grid" | "month"',
      "—",
      "Compact or expanded month layout.",
      true,
    ),
    row("weekStart", "WeekStart", "—", "monday or sunday.", true),
    theme,
    row(
      "idPrefix",
      "string",
      "—",
      "Unique prefix for month element IDs; use useId().",
      true,
    ),
    row(
      "onDateSelect",
      "(date: string, events: CalendarEvent[]) => void",
      "—",
      "Called when a date is clicked.",
    ),
  ],
  CalendarList: [events],
  HolidayTooltip: [
    row(
      "id",
      "string",
      "—",
      "Unique ID linked by the anchor aria-describedby.",
      true,
    ),
    row("anchor", "HTMLElement", "—", "Element used for positioning.", true),
    events,
    theme,
    callback(
      "onDismiss",
      "() => void",
      "Clear the open tooltip on Escape or when the anchor leaves view.",
    ),
  ],
  CalendarRelatedLinks: [
    row(
      "year",
      "number",
      "—",
      "Year used in guide links and holiday dates.",
      true,
    ),
  ],
  CalendarFooter: [],
  CalendarIcon: [
    row(
      "type",
      '"grid" | "month" | "list" | "settings"',
      "undefined (chevron)",
      "SVG glyph; accessible labels belong on the parent control.",
    ),
  ],
};
const json = (value: unknown) => JSON.stringify(value);
export function generateExample(
  name: ComponentName,
  s: PlaygroundSettings,
): string {
  const visibility = `{ public: ${s.public}, school: ${s.school}, annualLeave: ${s.annualLeave} }`;
  const wrapper = `className="bc-calendar" data-theme=${json(s.theme)} style={{ padding: ${s.padding}, margin: "auto" }}`;
  const imports = (values: string, react = "") =>
    `import "@qentrah/react-calendar/styles.css";\n${react ? `import { ${react} } from "react";\n` : ""}import { ${values} } from "@qentrah/react-calendar";\n`;
  const eventFilter = `const events = filterCalendarEvents(malaysiaHolidayData[${s.year}], ${json(s.states)}, ${visibility});`;
  const state = `  const [year, setYear] = useState(${s.year});\n  const [states, setStates] = useState<string[]>(${json(s.states)});\n  const [theme, setTheme] = useState<CalendarTheme>(${json(s.theme)});\n  const [view, setView] = useState<CalendarView>(${json(s.view)});\n  const [weekStart, setWeekStart] = useState<WeekStart>(${json(s.weekStart)});\n  const [visibility, setVisibility] = useState<HolidayVisibility>(${visibility});`;
  const typeImports =
    'import type { CalendarTheme, CalendarView, WeekStart, HolidayVisibility } from "@qentrah/react-calendar";\n';
  if (name === "HolidayCalendar")
    return (
      imports(name, "useState") +
      typeImports +
      `\nexport default function Example() {\n${state}\n  return <HolidayCalendar\n    year={year} onYearChange={setYear}\n    states={states} onStatesChange={setStates}\n    theme={theme} onThemeChange={setTheme}\n    view={view} onViewChange={setView}\n    weekStart={weekStart} onWeekStartChange={setWeekStart}\n    visibility={visibility} onVisibilityChange={setVisibility}\n    showRelatedLinks={${s.showRelatedLinks}} showFooter={${s.showFooter}} showJumpButton={${s.showJumpButton}}\n    className={${json(s.className)}} style={{ padding: ${s.padding}, margin: "auto" }}\n  />;\n}\n`
    );
  if (name === "CalendarToolbar")
    return (
      imports(name, "useState") +
      typeImports +
      `\nexport default function Example() {\n${state}\n  return <div className="bc-calendar" data-theme={theme} style={{ padding: ${s.padding} }}>\n    <CalendarToolbar years={[2026, 2027]} year={year} onYearChange={setYear}\n      selectedStates={states} onStatesChange={setStates}\n      theme={theme} onThemeChange={setTheme} view={view} onViewChange={setView}\n      weekStart={weekStart} onWeekStartChange={setWeekStart}\n      visibility={visibility} onVisibilityChange={setVisibility} />\n  </div>;\n}\n`
    );
  if (name === "CalendarGrid")
    return (
      imports(
        "CalendarGrid, filterCalendarEvents, malaysiaHolidayData",
        "useId",
      ) +
      `\n${eventFilter}\n\nexport default function Example() {\n  const id = useId();\n  return <div ${wrapper}>\n    <CalendarGrid year={${s.year}} events={events} view=${json(s.view === "list" ? "grid" : s.view)}\n      theme=${json(s.theme)} weekStart=${json(s.weekStart)} idPrefix={id} />\n  </div>;\n}\n`
    );
  if (name === "CalendarList")
    return (
      imports("CalendarList, filterCalendarEvents, malaysiaHolidayData") +
      `\n${eventFilter}\n\nexport default function Example() {\n  return <div ${wrapper}><CalendarList events={events} /></div>;\n}\n`
    );
  if (name === "HolidayTooltip")
    return (
      imports(name, "useId, useState") +
      'import type { CalendarEvent } from "@qentrah/react-calendar";\n' +
      `\nconst events: CalendarEvent[] = [{ name: ${json(s.title)}, date: ${json(s.date)}, kind: ${json(s.kind)}, regions: ${json(s.states.length ? s.states : ["nationwide"])} }];\n\nexport default function Example() {\n  const id = useId();\n  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);\n  return <div ${wrapper}>\n    <button type="button" aria-describedby={anchor ? id : undefined}\n      onBlur={() => setAnchor(null)}\n      onClick={event => setAnchor(anchor ? null : event.currentTarget)}\n      style={{ padding: 12, border: "1px solid #e85d04", borderRadius: 8 }}>\n      ${s.date} · View holiday\n    </button>\n    {anchor && <HolidayTooltip id={id} anchor={anchor} events={events}\n      theme=${json(s.theme)} onDismiss={() => setAnchor(null)} />}\n  </div>;\n}\n`
    );
  if (name === "CalendarRelatedLinks")
    return (
      imports(name) +
      `\nexport default function Example() {\n  return <div ${wrapper}><CalendarRelatedLinks year={${s.year}} /></div>;\n}\n`
    );
  if (name === "CalendarFooter")
    return (
      imports(name) +
      `\nexport default function Example() {\n  // CalendarFooter has no props; theme and padding belong to its wrapper.\n  return <div ${wrapper}><CalendarFooter /></div>;\n}\n`
    );
  return (
    imports(name) +
    `\nexport default function Example() {\n  return <span style={{ color: ${json(s.color)}, display: "inline-flex", padding: ${s.padding} }}>\n    <CalendarIcon${s.icon === "chevron" ? "" : ` type=${json(s.icon)}`} />\n  </span>;\n}\n`
  );
}
