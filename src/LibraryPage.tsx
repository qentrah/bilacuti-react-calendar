import { useEffect, useRef, useState } from "react";
import {
  LivePreview,
  PlaygroundControls,
  PropsTable,
  usePlaygroundSettings,
} from "./playground/Playground";
import { generateExample, initialSettings } from "./playground/model";
import type { ComponentName } from "./playground/model";
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
    hint: "Try the dropdowns and settings. The state below updates live.",
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
        <span className="docs-number">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h2 id={`${example.name}-title`}>{example.name}</h2>
          <p>{example.description}</p>
        </div>
      </div>
      <div className="docs-example-panel">
        <div className="docs-preview-heading">
          <span>
            <i /> Live preview
          </span>
          <span className="docs-ts-badge">React + TypeScript</span>
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
        <p className="docs-hint">
          Controls and live interactions both update the TypeScript below.
        </p>
        <div
          className={`docs-preview ${example.tall ? "docs-preview-tall" : ""}`}
          tabIndex={example.tall ? 0 : undefined}
          role={example.tall ? "region" : undefined}
          aria-label={
            example.tall ? `${example.name} scrollable preview` : undefined
          }
        >
          <LivePreview
            name={example.name}
            settings={settings}
            onChange={update}
          />
        </div>
        <PropsTable name={example.name} />
        <details className="docs-source" open>
          <summary>TypeScript source</summary>
          <div className="docs-code-toolbar">
            <span>{example.name}Example.tsx</span>
            <CopyCode code={source} label={`${example.name} TypeScript`} />
          </div>
          <pre tabIndex={0} aria-label={`${example.name} TypeScript code`}>
            <code>{source}</code>
          </pre>
        </details>
      </div>
    </section>
  );
}
export function LibraryPage() {
  useEffect(() => {
    document.title = "Component library · Bila Cuti";
  }, []);
  return (
    <div className="docs-page">
      <header className="docs-topbar">
        <a href={import.meta.env.BASE_URL} className="docs-brand">
          bila<span>cuti</span>
          <span className="docs-brand-divider">/</span>
          <span className="docs-brand-label">Components</span>
        </a>
        <a
          href={`${import.meta.env.BASE_URL}?state=johor%2Ckelantan`}
          className="docs-demo-link"
        >
          Open calendar <span aria-hidden="true">↗</span>
        </a>
      </header>
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <nav aria-label="Component library">
            <a className="docs-overview" href="#overview">
              Getting started
            </a>
            <p>
              COMPONENTS <span>08</span>
            </p>
            {examples.map((e) => (
              <a href={`#${e.name}`} key={e.name}>
                {e.name}
              </a>
            ))}
            <div className="docs-sidebar-note">
              <span className="docs-ts-badge">v1.0.0</span>
              <p>
                Typed components.
                <br />
                Scoped styles.
                <br />
                Your application state.
              </p>
            </div>
          </nav>
        </aside>
        <main className="docs-main">
          <section className="docs-intro" id="overview">
            <span className="docs-eyebrow">BILA CUTI / REACT LIBRARY</span>
            <h1>
              Build with
              <br />
              <span>every component.</span>
            </h1>
            <p>
              Explore the calendar in pieces. Live examples, editable props, and
              TypeScript you can copy into your own app.
            </p>
            <div className="docs-intro-meta">
              <span>
                <i /> 8 live examples
              </span>
              <span>React 18.3+ / 19</span>
              <span>TypeScript</span>
            </div>
          </section>
          <section className="docs-install" aria-labelledby="install-title">
            <div>
              <h2 id="install-title">Start with the package</h2>
              <p>
                Download the archive, install it locally, then copy any example
                below.
              </p>
            </div>
            <a
              className="docs-download"
              href={`${import.meta.env.BASE_URL}downloads/bilacuti-react-calendar-1.0.0.tgz`}
              download
            >
              Download package ↓
            </a>
            <div className="docs-install-command">
              <code>npm install ./bilacuti-react-calendar-1.0.0.tgz</code>
              <CopyCode
                code="npm install ./bilacuti-react-calendar-1.0.0.tgz"
                label="install command"
              />
            </div>
            <p className="docs-install-note">
              Install React and React DOM in your app. Import the library
              stylesheet once. Individually composed components use a{" "}
              <code>.bc-calendar</code> wrapper, as shown in each example.
            </p>
          </section>
          {examples.map((example, index) => (
            <ExampleCard key={example.name} example={example} index={index} />
          ))}
          <footer className="docs-bottom">
            <span>Bila Cuti component library</span>
            <a href="https://github.com/qentrah/bilacuti-react-calendar">
              Source on GitHub ↗
            </a>
            <a href="#overview">Back to top ↑</a>
          </footer>
        </main>
      </div>
    </div>
  );
}
