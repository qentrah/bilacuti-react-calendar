import { useId, useMemo, useState } from "react";
import {
  CalendarFooter,
  CalendarGrid,
  CalendarIcon,
  CalendarList,
  CalendarRelatedLinks,
  CalendarToolbar,
  HolidayCalendar,
  HolidayTooltip,
  filterCalendarEvents,
  malaysiaHolidayData,
  states,
} from "../lib";
import type { CalendarEvent, CalendarView, HolidayVisibility } from "../lib";
import { initialSettings, propsByComponent } from "./model";
import type { ComponentName, PlaygroundSettings } from "./model";

export type UpdateSettings = <K extends keyof PlaygroundSettings>(
  key: K,
  value: PlaygroundSettings[K],
) => void;
export function PlaygroundControls({
  name,
  settings: s,
  onChange: set,
  onReset,
}: {
  name: ComponentName;
  settings: PlaygroundSettings;
  onChange: UpdateSettings;
  onReset: () => void;
}) {
  const calendar = [
    "HolidayCalendar",
    "CalendarToolbar",
    "CalendarGrid",
    "CalendarList",
  ].includes(name);
  const hasStates = calendar || name === "HolidayTooltip";
  const hasYear = calendar || name === "CalendarRelatedLinks";
  const hasView = [
    "HolidayCalendar",
    "CalendarToolbar",
    "CalendarGrid",
  ].includes(name);
  const hasWeek = [
    "HolidayCalendar",
    "CalendarToolbar",
    "CalendarGrid",
  ].includes(name);
  const bool = (
    key:
      | "public"
      | "school"
      | "annualLeave"
      | "showFooter"
      | "showRelatedLinks"
      | "showJumpButton",
    label: string,
  ) => (
    <label className="playground-check" key={key}>
      <input
        type="checkbox"
        checked={s[key]}
        onChange={(e) => set(key, e.target.checked)}
      />
      {label}
    </label>
  );
  return (
    <div className="playground-controls">
      <div className="playground-controls-title">
        <h3>Customize example</h3>
        <button
          type="button"
          className="docs-copy"
          onClick={onReset}
          aria-label={`Reset ${name} example`}
        >
          Reset
        </button>
      </div>
      <div className="playground-control-grid">
        {hasYear && (
          <label>
            Year
            <select
              value={s.year}
              onChange={(e) => set("year", Number(e.target.value))}
            >
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </label>
        )}
        {name !== "CalendarIcon" && (
          <label>
            {[
              "CalendarList",
              "CalendarRelatedLinks",
              "CalendarFooter",
            ].includes(name)
              ? "Wrapper theme"
              : "Theme"}
            <select
              value={s.theme}
              onChange={(e) =>
                set("theme", e.target.value as PlaygroundSettings["theme"])
              }
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
        )}
        {hasView && (
          <label>
            View
            <select
              value={
                s.view === "list" && name === "CalendarGrid" ? "grid" : s.view
              }
              onChange={(e) => set("view", e.target.value as CalendarView)}
            >
              <option value="grid">Grid</option>
              <option value="month">Month</option>
              {name !== "CalendarGrid" && <option value="list">List</option>}
            </select>
          </label>
        )}
        {hasWeek && (
          <label>
            Week starts on
            <select
              value={s.weekStart}
              onChange={(e) =>
                set(
                  "weekStart",
                  e.target.value as PlaygroundSettings["weekStart"],
                )
              }
            >
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
          </label>
        )}
        <label>
          {name === "HolidayCalendar" ? "Root" : "Wrapper"} padding (px)
          <input
            type="number"
            min={0}
            max={80}
            value={s.padding}
            onChange={(e) =>
              set("padding", Math.max(0, Math.min(80, Number(e.target.value))))
            }
          />
        </label>
        {name === "HolidayCalendar" && (
          <label>
            className
            <input
              type="text"
              value={s.className}
              placeholder="Optional CSS class"
              maxLength={100}
              onChange={(e) => set("className", e.target.value)}
            />
          </label>
        )}
        {name === "HolidayTooltip" && (
          <>
            <label>
              Event name
              <input
                value={s.title}
                maxLength={160}
                onChange={(e) => set("title", e.target.value)}
              />
            </label>
            <label>
              Event date
              <input
                type="date"
                value={s.date}
                onChange={(e) => {
                  if (e.target.value) set("date", e.target.value);
                }}
              />
            </label>
            <label>
              Event kind
              <select
                value={s.kind}
                onChange={(e) =>
                  set("kind", e.target.value as PlaygroundSettings["kind"])
                }
              >
                <option value="public">Public holiday</option>
                <option value="school">School holiday</option>
                <option value="leave">Annual leave</option>
              </select>
            </label>
          </>
        )}
        {name === "CalendarIcon" && (
          <>
            <label>
              type
              <select
                value={s.icon}
                onChange={(e) =>
                  set("icon", e.target.value as PlaygroundSettings["icon"])
                }
              >
                {["grid", "month", "list", "settings", "chevron"].map(
                  (icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label>
              Wrapper color
              <input
                type="color"
                value={s.color}
                onChange={(e) => set("color", e.target.value)}
              />
            </label>
          </>
        )}
      </div>
      {hasStates && (
        <details className="playground-states">
          <summary>
            States ·{" "}
            {s.states.length
              ? s.states
                  .map(
                    (slug) =>
                      states.find((state) => state.slug === slug)?.name ?? slug,
                  )
                  .join(", ")
              : "All states"}
          </summary>
          <div className="playground-state-actions">
            <button
              type="button"
              className="docs-copy"
              onClick={() => set("states", [])}
            >
              All states
            </button>
            <button
              type="button"
              className="docs-copy"
              onClick={() => set("states", ["nationwide"])}
            >
              Nationwide only
            </button>
          </div>
          <div className="playground-state-grid">
            {states.map((state) => (
              <label className="playground-check" key={state.slug}>
                <input
                  type="checkbox"
                  checked={s.states.includes(state.slug)}
                  onChange={(e) =>
                    set(
                      "states",
                      e.target.checked
                        ? [
                            ...s.states.filter((slug) => slug !== "nationwide"),
                            state.slug,
                          ]
                        : s.states.filter((slug) => slug !== state.slug),
                    )
                  }
                />
                {state.name}
              </label>
            ))}
          </div>
        </details>
      )}
      {calendar && (
        <fieldset className="playground-visibility">
          <legend>Holiday visibility</legend>
          {bool("public", "Public holidays")}
          {bool("school", "School holidays")}
          {bool("annualLeave", "Annual leave suggestions")}
        </fieldset>
      )}
      {name === "HolidayCalendar" && (
        <fieldset className="playground-visibility">
          <legend>Calendar sections</legend>
          {bool("showFooter", "Footer")}
          {bool("showRelatedLinks", "Related links")}
          {bool("showJumpButton", "Jump button")}
        </fieldset>
      )}
      {[
        "CalendarFooter",
        "CalendarRelatedLinks",
        "CalendarIcon",
        "CalendarList",
      ].includes(name) && (
        <p className="playground-note">
          Theme, color, and padding are preview wrapper styles, not additional
          component props.
        </p>
      )}
    </div>
  );
}
function TooltipPreview({ settings: s }: { settings: PlaygroundSettings }) {
  const id = useId();
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const events = useMemo<CalendarEvent[]>(
    () => [
      {
        name: s.title,
        date: s.date,
        kind: s.kind,
        regions: s.states.length ? s.states : ["nationwide"],
      },
    ],
    [s.title, s.date, s.kind, s.states],
  );
  return (
    <>
      <button
        type="button"
        aria-describedby={anchor ? id : undefined}
        onBlur={() => setAnchor(null)}
        onClick={(e) => setAnchor(anchor ? null : e.currentTarget)}
        style={{ padding: 12, border: "1px solid #e85d04", borderRadius: 8 }}
      >
        {s.date} · View holiday
      </button>
      {anchor && (
        <HolidayTooltip
          id={id}
          anchor={anchor}
          events={events}
          theme={s.theme}
          onDismiss={() => setAnchor(null)}
        />
      )}
    </>
  );
}
export function LivePreview({
  name,
  settings: s,
  onChange: set,
}: {
  name: ComponentName;
  settings: PlaygroundSettings;
  onChange: UpdateSettings;
}) {
  const id = useId();
  const visibility = useMemo<HolidayVisibility>(
    () => ({ public: s.public, school: s.school, annualLeave: s.annualLeave }),
    [s.public, s.school, s.annualLeave],
  );
  const events = useMemo(
    () =>
      filterCalendarEvents(malaysiaHolidayData[s.year], s.states, visibility),
    [s.year, s.states, visibility],
  );
  const setVisibility = (next: HolidayVisibility) => {
    set("public", next.public);
    set("school", next.school);
    set("annualLeave", next.annualLeave);
  };
  if (name === "HolidayCalendar")
    return (
      <HolidayCalendar
        year={s.year}
        onYearChange={(value) => set("year", value)}
        states={s.states}
        onStatesChange={(value) => set("states", value)}
        theme={s.theme}
        onThemeChange={(value) => set("theme", value)}
        view={s.view}
        onViewChange={(value) => set("view", value)}
        weekStart={s.weekStart}
        onWeekStartChange={(value) => set("weekStart", value)}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        showFooter={s.showFooter}
        showRelatedLinks={s.showRelatedLinks}
        showJumpButton={s.showJumpButton}
        className={s.className}
        style={{ padding: s.padding, margin: "auto" }}
      />
    );
  if (name === "CalendarIcon")
    return (
      <span
        style={{ color: s.color, display: "inline-flex", padding: s.padding }}
      >
        <CalendarIcon type={s.icon === "chevron" ? undefined : s.icon} />
      </span>
    );
  return (
    <div
      className="bc-calendar"
      data-theme={s.theme}
      style={{ padding: s.padding, margin: "auto" }}
    >
      {name === "CalendarToolbar" && (
        <CalendarToolbar
          years={[2026, 2027]}
          year={s.year}
          onYearChange={(value) => set("year", value)}
          selectedStates={s.states}
          onStatesChange={(value) => set("states", value)}
          theme={s.theme}
          onThemeChange={(value) => set("theme", value)}
          view={s.view}
          onViewChange={(value) => set("view", value)}
          weekStart={s.weekStart}
          onWeekStartChange={(value) => set("weekStart", value)}
          visibility={visibility}
          onVisibilityChange={setVisibility}
        />
      )}
      {name === "CalendarGrid" && (
        <CalendarGrid
          year={s.year}
          events={events}
          view={s.view === "list" ? "grid" : s.view}
          theme={s.theme}
          weekStart={s.weekStart}
          idPrefix={id}
        />
      )}
      {name === "CalendarList" && <CalendarList events={events} />}
      {name === "HolidayTooltip" && <TooltipPreview settings={s} />}
      {name === "CalendarRelatedLinks" && (
        <CalendarRelatedLinks year={s.year} />
      )}
      {name === "CalendarFooter" && <CalendarFooter />}
    </div>
  );
}
export function PropsTable({ name }: { name: ComponentName }) {
  const rows = propsByComponent[name];
  return (
    <details className="playground-props" open>
      <summary>
        Props reference{" "}
        <span>
          {rows.length} {rows.length === 1 ? "prop" : "props"}
        </span>
      </summary>
      <div
        className="playground-table-scroll"
        tabIndex={0}
        role="region"
        aria-label={`${name} props table`}
      >
        <table>
          <caption className="playground-sr-only">
            {name} props, types, defaults, and descriptions
          </caption>
          <thead>
            <tr>
              <th scope="col">Prop</th>
              <th scope="col">Type</th>
              <th scope="col">Default</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <th scope="row">No component props</th>
                <td>—</td>
                <td>—</td>
                <td>
                  Customize the wrapper theme and padding using the controls
                  above.
                </td>
              </tr>
            )}
            {rows.map((prop) => (
              <tr key={prop.name}>
                <th scope="row">
                  <code>{prop.name}</code>
                  {prop.required && (
                    <span className="playground-required">required</span>
                  )}
                </th>
                <td>
                  <code>{prop.type}</code>
                </td>
                <td>
                  <code>{prop.defaultValue}</code>
                </td>
                <td>{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
export function usePlaygroundSettings() {
  return useState<PlaygroundSettings>(() => ({
    ...initialSettings,
    states: [...initialSettings.states],
  }));
}
