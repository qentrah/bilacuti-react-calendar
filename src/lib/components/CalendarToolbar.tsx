import { useEffect, useLayoutEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { regionName, states } from "../data.js";
import type {
  CalendarTheme,
  CalendarView,
  HolidayVisibility,
  WeekStart,
} from "../types.js";
import { CalendarIcon } from "./Icon.js";
export interface CalendarToolbarProps {
  years: number[];
  year: number;
  onYearChange: (year: number) => void;
  selectedStates: string[];
  onStatesChange: (states: string[]) => void;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  theme: CalendarTheme;
  onThemeChange: (theme: CalendarTheme) => void;
  weekStart: WeekStart;
  onWeekStartChange: (start: WeekStart) => void;
  visibility: HolidayVisibility;
  onVisibilityChange: (visibility: HolidayVisibility) => void;
}
type Menu = "year" | "states" | "settings" | null;
export function CalendarToolbar(props: CalendarToolbarProps) {
  const [menu, setMenu] = useState<Menu>(null);
  const root = useRef<HTMLElement>(null);
  const id = useId();
  const [menuHeight, setMenuHeight] = useState(320);
  useLayoutEffect(() => {
    if (!menu) return;
    const measure = () => {
      const element = root.current?.querySelector<HTMLElement>(
        `#${CSS.escape(`${id}-${menu}`)}`,
      );
      if (element)
        setMenuHeight(
          Math.max(
            80,
            Math.min(
              320,
              window.innerHeight - element.getBoundingClientRect().top - 8,
            ),
          ),
        );
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [menu, id]);
  const reducedMotion = useReducedMotion();
  const trigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setMenu(null);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  useEffect(() => {
    if (!menu) return;
    root.current
      ?.querySelector<HTMLElement>(`#${CSS.escape(`${id}-${menu}`)} button`)
      ?.focus();
  }, [menu, id]);
  const open = (next: Menu, button: HTMLButtonElement) => {
    trigger.current = button;
    setMenu((current) => (current === next ? null : next));
  };
  const close = () => {
    setMenu(null);
    trigger.current?.focus();
  };
  const popup = (name: Exclude<Menu, null>, content: ReactNode) =>
    menu === name && (
      <motion.div
        id={`${id}-${name}`}
        className={`popup ${name}`}
        style={{ maxHeight: menuHeight, overflowY: "auto" }}
        initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            close();
          }
          if (
            event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Home" ||
            event.key === "End"
          ) {
            const buttons = Array.from(
              event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
            );
            const index = buttons.indexOf(
              document.activeElement as HTMLButtonElement,
            );
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? buttons.length - 1
                  : (index +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      buttons.length) %
                    buttons.length;
            event.preventDefault();
            buttons[next]?.focus();
          }
        }}
      >
        {content}
      </motion.div>
    );
  const selectedLabel = !props.selectedStates.length
    ? "All states"
    : props.selectedStates.length === 1
      ? regionName(props.selectedStates[0])
      : `${props.selectedStates.length} states`;
  const settings: {
    key: keyof HolidayVisibility;
    name: string;
    subtitle: string;
    color: string;
  }[] = [
    {
      key: "public",
      name: "Public holidays",
      subtitle: "Jabatan Perdana Menteri",
      color: "orange",
    },
    {
      key: "school",
      name: "School holidays",
      subtitle: "Kementerian Pendidikan Malaysia",
      color: "blue",
    },
    {
      key: "annualLeave",
      name: "Annual leaves",
      subtitle: "Recommendations for long weekend",
      color: "orange",
    },
  ];
  return (
    <nav
      ref={root}
      className="toolbar"
      aria-label="Calendar controls"
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setMenu(null);
      }}
    >
      <div className="selectors">
        <div data-menu>
          <button
            type="button"
            className="control"
            aria-expanded={menu === "year"}
            aria-controls={menu === "year" ? `${id}-year` : undefined}
            onClick={(e) => open("year", e.currentTarget)}
          >
            {props.year}
            <CalendarIcon />
          </button>
          {popup(
            "year",
            props.years.map((year) => (
              <button
                type="button"
                key={year}
                aria-pressed={year === props.year}
                onClick={() => {
                  props.onYearChange(year);
                  close();
                }}
              >
                {year}
                <span>{year === props.year ? "✓" : ""}</span>
              </button>
            )),
          )}
        </div>
        <div data-menu>
          <button
            type="button"
            className="control state"
            aria-expanded={menu === "states"}
            aria-controls={menu === "states" ? `${id}-states` : undefined}
            onClick={(e) => open("states", e.currentTarget)}
          >
            {selectedLabel}
            <CalendarIcon />
          </button>
          {popup(
            "states",
            <>
              <button
                type="button"
                aria-pressed={!props.selectedStates.length}
                onClick={() => props.onStatesChange([])}
              >
                All states
              </button>
              <button
                type="button"
                aria-pressed={props.selectedStates.includes("nationwide")}
                onClick={() => props.onStatesChange(["nationwide"])}
              >
                Nationwide only
              </button>
              <hr />
              {states.map((state) => {
                const selected = props.selectedStates.includes(state.slug);
                return (
                  <button
                    type="button"
                    key={state.slug}
                    className={selected ? "chosen" : ""}
                    role="checkbox"
                    aria-checked={selected}
                    onClick={() =>
                      props.onStatesChange(
                        selected
                          ? props.selectedStates.filter((s) => s !== state.slug)
                          : [
                              ...props.selectedStates.filter(
                                (s) => s !== "nationwide",
                              ),
                              state.slug,
                            ],
                      )
                    }
                  >
                    <span
                      className={`checkmark ${selected ? "checked" : ""}`}
                      aria-hidden="true"
                    >
                      {selected ? "✓" : ""}
                    </span>
                    {state.name}
                  </button>
                );
              })}
            </>,
          )}
        </div>
      </div>
      <div className="right-controls">
        <div className="views" aria-label="Calendar view">
          {(["grid", "month", "list"] as const).map((view) => (
            <button
              type="button"
              key={view}
              aria-label={`${view} view`}
              aria-pressed={props.view === view}
              className={props.view === view ? "active" : ""}
              onClick={() => props.onViewChange(view)}
            >
              <CalendarIcon type={view} />
            </button>
          ))}
        </div>
        <div data-menu>
          <button
            type="button"
            className="gear"
            aria-label="Settings"
            aria-expanded={menu === "settings"}
            aria-controls={menu === "settings" ? `${id}-settings` : undefined}
            onClick={(e) => open("settings", e.currentTarget)}
          >
            <CalendarIcon type="settings" />
          </button>
          {popup(
            "settings",
            <>
              {settings.map((setting) => (
                <button
                  type="button"
                  key={setting.key}
                  className="setting-row"
                  role="switch"
                  aria-checked={props.visibility[setting.key]}
                  onClick={() =>
                    props.onVisibilityChange({
                      ...props.visibility,
                      [setting.key]: !props.visibility[setting.key],
                    })
                  }
                >
                  <span>
                    {setting.name}
                    <small>{setting.subtitle}</small>
                  </span>
                  <span
                    className={`switch ${props.visibility[setting.key] ? setting.color : ""}`}
                    aria-hidden="true"
                  >
                    <i />
                  </span>
                </button>
              ))}
              <hr />
              <div className="setting-row">
                <span>Color theme</span>
                <div className="segmented">
                  {(["light", "dark"] as const).map((theme) => (
                    <button
                      type="button"
                      key={theme}
                      aria-label={`${theme} theme`}
                      aria-pressed={props.theme === theme}
                      className={props.theme === theme ? "active" : ""}
                      onClick={() => props.onThemeChange(theme)}
                    >
                      {theme === "light" ? "☀" : "☾"}
                    </button>
                  ))}
                </div>
              </div>
              <hr />
              <div className="setting-row">
                <span>Week starts on</span>
                <div className="segmented">
                  {(["monday", "sunday"] as const).map((start) => (
                    <button
                      type="button"
                      key={start}
                      aria-pressed={props.weekStart === start}
                      className={props.weekStart === start ? "active" : ""}
                      onClick={() => props.onWeekStartChange(start)}
                    >
                      {start === "monday" ? "Mon" : "Sun"}
                    </button>
                  ))}
                </div>
              </div>
            </>,
          )}
        </div>
      </div>
    </nav>
  );
}
