import { useEffect, useRef, useState } from "react";
import {
  LivePreview,
  PlaygroundControls,
  PropsTable,
  usePlaygroundSettings,
} from "./playground/Playground";
import { generateExample, initialSettings } from "./playground/model";
import type { ComponentName } from "./playground/model";
import { HolidayCalendar } from "./lib";
import "./library-page.css";

interface Example {
  name: ComponentName;
  description: string;
  hint: string;
  tall?: boolean;
}
const examples: Example[] = [
  {
    name: "HolidayCalendar",
    description: "The complete calendar, ready to embed.",
    hint: "Change the year, select states, or open a holiday.",
    tall: true,
  },
  {
    name: "CalendarToolbar",
    description: "Controlled filters and display preferences.",
    hint: "Try the dropdowns and settings, then switch to Code to see the updated state.",
  },
  {
    name: "CalendarGrid",
    description: "A year of dates with public and school holiday markers.",
    hint: "Switch between grid and month layouts. Scroll to explore the year.",
    tall: true,
  },
  {
    name: "CalendarList",
    description: "Holiday events in chronological order.",
    hint: "Customize the event filters and scroll for all months.",
    tall: true,
  },
  {
    name: "HolidayTooltip",
    description: "A positioned popover that stays inside the viewport.",
    hint: "Click the date to open. Press Escape or move focus to dismiss.",
  },
  {
    name: "CalendarRelatedLinks",
    description: "A collection of holiday guides and planning resources.",
    hint: "These links open the original Bilacuti holiday guides.",
  },
  {
    name: "CalendarFooter",
    description: "Source attribution and feedback links.",
    hint: "Use this independently or include it in the full calendar.",
  },
  {
    name: "CalendarIcon",
    description: "Five small SVG icons for calendar controls.",
    hint: "Icons are decorative; add an accessible label to their parent button.",
  },
];
function CopyCode({ code, label }: { code: string; label: string }) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Copied");
    } catch {
      setStatus("Select the code below to copy manually");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 4000);
  }
  return (
    <div className="docs-copy-wrap">
      <span role="status" className="docs-copy-status">
        {status}
      </span>
      <button
        type="button"
        className="docs-copy"
        aria-label={`Copy ${label}`}
        onClick={copy}
      >
        {status === "Copied" ? "✓ Copied" : "Copy code"}
      </button>
    </div>
  );
}
function ExampleCard({ example, index }: { example: Example; index: number }) {
  const [settings, setSettings] = usePlaygroundSettings();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const update = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => setSettings((current) => ({ ...current, [key]: value }));
  const source = generateExample(example.name, settings);
  return (
    <section
      className="docs-example"
      id={example.name}
      aria-labelledby={`${example.name}-title`}
    >
      <div className="docs-example-heading">
        <span className="docs-eyebrow">
          COMPONENT / {String(index + 1).padStart(2, "0")}
        </span>
        <h1 id={`${example.name}-title`}>{example.name}</h1>
        <p>{example.description}</p>
      </div>
      <div className="docs-example-panel">
        <div className="docs-preview-heading">
          <div
            className="docs-tabs"
            role="group"
            aria-label={`${example.name} example view`}
          >
            <button
              aria-pressed={tab === "preview"}
              onClick={() => setTab("preview")}
            >
              Preview
            </button>
            <button
              aria-pressed={tab === "code"}
              onClick={() => setTab("code")}
            >
              Code
            </button>
          </div>
          <span className="docs-ts-badge">
            {settings.theme === "light" ? "Light" : "Dark"} · React + TS
          </span>
        </div>
        <div className="docs-workbench">
          <div className="docs-stage">
            <div hidden={tab !== "preview"}>
              <div
                className={`docs-preview ${example.tall ? "docs-preview-tall" : ""}`}
                tabIndex={example.tall ? 0 : undefined}
                role={example.tall ? "region" : undefined}
                aria-label={
                  example.tall
                    ? `${example.name} scrollable preview`
                    : undefined
                }
              >
                <LivePreview
                  name={example.name}
                  settings={settings}
                  onChange={update}
                />
              </div>
              <p className="docs-hint">{example.hint}</p>
            </div>
            <div className="docs-source" hidden={tab !== "code"}>
              <div className="docs-code-toolbar">
                <span>{example.name}Example.tsx</span>
                <CopyCode code={source} label={`${example.name} TypeScript`} />
              </div>
              <pre tabIndex={0} aria-label={`${example.name} TypeScript code`}>
                <code>{source}</code>
              </pre>
              <p className="docs-hint">
                Includes imports, state, and the stylesheet. Changes to the
                preview update this example.
              </p>
            </div>
          </div>
          <PlaygroundControls
            name={example.name}
            settings={settings}
            onChange={update}
            onReset={() =>
              setSettings({
                ...initialSettings,
                states: [...initialSettings.states],
              })
            }
          />
        </div>
      </div>
      <div className="docs-api-heading">
        <h2>API reference</h2>
        <p>
          Component props and their defaults. Preview wrapper styles are listed
          separately in the controls.
        </p>
      </div>
      <PropsTable name={example.name} />
    </section>
  );
}
const base = import.meta.env.BASE_URL;
const repository = "https://github.com/qentrah/bilacuti-react-calendar";
const install = "npm install ./bilacuti-react-calendar-1.0.0.tgz";
const quickstart = `import { HolidayCalendar } from "@bilacuti/react-calendar";
import "@bilacuti/react-calendar/styles.css";

export default function App() {
  return (
    <HolidayCalendar
      defaultYear={2026}
      defaultStates={["johor", "kelantan"]}
      showJumpButton={false}
    />
  );
}`;
export function LibraryPage() {
  const [active, setActive] = useState(
    () => decodeURIComponent(location.hash.slice(1)) || "overview",
  );
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const change = () => {
      if (location.hash === "#docs-content") return;
      setActive(decodeURIComponent(location.hash.slice(1)) || "overview");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  const selected = examples.some((e) => e.name === active)
    ? active
    : "overview";
  useEffect(() => {
    document.title = `${selected === "overview" ? "Documentation" : selected} · Bila Cuti`;
  }, [selected]);
  return (
    <div className="docs-page" data-theme={theme}>
      <a className="docs-skip" href="#docs-content">
        Skip to content
      </a>
      <header className="docs-topbar">
        <a href="#overview" className="docs-brand">
          <img src={`${base}brand/logo.png`} width="32" height="32" alt="" />
          <span>bila cuti</span>
          <span className="docs-brand-label">/ docs</span>
        </a>
        <div className="docs-top-actions">
          <a href={repository}>GitHub ↗</a>
          <button
            className="docs-theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch documentation to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? "☼" : "☾"}
          </button>
          <a className="docs-demo-link" href={`${base}?state=johor%2Ckelantan`}>
            Calendar ↗
          </a>
        </div>
      </header>
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <nav aria-label="Documentation">
            <label className="docs-search">
              <span className="playground-sr-only">Find a component</span>
              <input
                type="search"
                placeholder="Find a component…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <p>DOCUMENTATION</p>
            <a
              aria-current={selected === "overview" ? "page" : undefined}
              href="#overview"
            >
              Overview
            </a>
            <p>
              COMPONENTS <span>08</span>
            </p>
            {examples
              .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
              .map((e) => (
                <a
                  aria-current={selected === e.name ? "page" : undefined}
                  href={`#${e.name}`}
                  key={e.name}
                >
                  <i
                    className={e.name.includes("Holiday") ? "orange" : "blue"}
                  />
                  {e.name}
                </a>
              ))}
            {query &&
              !examples.some((e) =>
                e.name.toLowerCase().includes(query.toLowerCase()),
              ) && (
                <span className="docs-empty" role="status">
                  No components found.
                </span>
              )}
            <div className="docs-sidebar-note">
              <span>v1.0.0</span>
              <span>MIT license</span>
              <a href={`${repository}/issues`}>Report an issue ↗</a>
            </div>
          </nav>
        </aside>
        <main className="docs-main" id="docs-content" tabIndex={-1}>
          <div hidden={selected !== "overview"}>
            <section className="docs-intro" id="overview">
              <span className="docs-eyebrow">BILA CUTI / REACT CALENDAR</span>
              <h1>
                A little more
                <br />
                <span>time off.</span>
              </h1>
              <p>
                Malaysia’s public and school holidays, in a calendar you can
                make your own.
              </p>
              <div className="docs-intro-actions">
                <a className="docs-primary" href="#HolidayCalendar">
                  Explore the calendar <span>→</span>
                </a>
                <a href={repository}>View source ↗</a>
              </div>
            </section>
            <section
              className="docs-overview-preview"
              aria-label="Interactive calendar preview"
            >
              <div className="docs-preview-heading">
                <span>
                  <i />
                  Live calendar
                </span>
                <span className="docs-ts-badge">2026 — 2027</span>
              </div>
              <div
                className="docs-overview-calendar"
                tabIndex={0}
                role="region"
                aria-label="Scrollable calendar demo"
              >
                <HolidayCalendar
                  defaultStates={["johor", "kelantan"]}
                  theme={theme}
                  showFooter={false}
                  showRelatedLinks={false}
                  showJumpButton={false}
                  style={{ padding: "32px 24px" }}
                />
              </div>
              <div className="docs-preview-caption">
                <span>
                  <i className="orange" /> Public holidays
                </span>
                <span>
                  <i className="blue" /> School holidays
                </span>
                <a href="#HolidayCalendar">Customize →</a>
              </div>
            </section>
            <section className="docs-install" aria-labelledby="install-title">
              <div className="docs-section-label">01 / GET STARTED</div>
              <h2 id="install-title">Add it to your app</h2>
              <p>
                Download the package archive, then install it in your React
                project. Supports React 18.3 and 19.
              </p>
              <a
                className="docs-download"
                href={`${base}downloads/bilacuti-react-calendar-1.0.0.tgz`}
                download
              >
                Download v1.0.0 ↓
              </a>
              <div className="docs-install-command">
                <code>{install}</code>
                <CopyCode code={install} label="install command" />
              </div>
              <p className="docs-install-note">
                Distributed as an archive. This package is not published on npm.
              </p>
              <div className="docs-source">
                <div className="docs-code-toolbar">
                  <span>App.tsx</span>
                  <CopyCode code={quickstart} label="quick start TypeScript" />
                </div>
                <pre tabIndex={0} aria-label="Quick start TypeScript">
                  <code>{quickstart}</code>
                </pre>
              </div>
            </section>
            <section className="docs-composition">
              <div className="docs-section-label">02 / COMPOSE</div>
              <h2>
                Use the whole calendar.
                <br />
                Or just the pieces you need.
              </h2>
              <div className="docs-component-index">
                {examples.map((e, i) => (
                  <a href={`#${e.name}`} key={e.name}>
                    <span className="docs-index-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <strong>{e.name}</strong>
                      <small>{e.description}</small>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </section>
            <section className="docs-notes">
              <div>
                <h2>Styling & composition</h2>
                <p>
                  Import the stylesheet once. Standalone components belong
                  inside a <code>.bc-calendar</code> wrapper with{" "}
                  <code>data-theme="dark"</code> or <code>"light"</code>. The
                  full calendar adds its own wrapper.
                </p>
                <p>
                  Each component page includes editable controls, a working
                  preview, a props table, and complete TypeScript.
                </p>
              </div>
              <div>
                <h2>Holiday data</h2>
                <p>
                  Includes a static 2026–2027 Malaysia holiday dataset. Select
                  states to filter regional dates, or supply your own{" "}
                  <code>HolidayDataset</code>.
                </p>
                <p>
                  Dates do not update automatically. Annual leave suggestions
                  use a simple long-weekend heuristic. Check official
                  announcements before making plans.
                </p>
              </div>
            </section>
          </div>
          {examples.map((example, index) => (
            <div hidden={selected !== example.name} key={example.name}>
              <ExampleCard example={example} index={index} />
            </div>
          ))}
          <footer className="docs-bottom">
            <span>
              Bila Cuti <span className="docs-footer-muted">by Qentrah</span>
            </span>
            <a href={`${repository}/blob/main/THIRD_PARTY_NOTICES.md`}>
              Credits & licenses ↗
            </a>
            <a href={repository}>Contribute ↗</a>
          </footer>
        </main>
      </div>
    </div>
  );
}
