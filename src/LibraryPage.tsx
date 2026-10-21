import { useEffect, useState } from "react";
import {
  LivePreview,
  PlaygroundControls,
  PropsTable,
  usePlaygroundSettings,
} from "./playground/Playground";
import { generateExample, initialSettings } from "./playground/model";
import {
  components,
  guides,
  parseDocRoute,
  componentViews,
} from "./docs/routes";
import type { ComponentView } from "./docs/routes";
import { CodeBlock } from "./docs/CodeBlock";
import { CustomData } from "./docs/CustomData";
import { installation, controlled, filtered, styled } from "./docs/patterns";
import "./library-page.css";
const base = import.meta.env.BASE_URL;
const repo = "https://github.com/qentrah/bilacuti-react-calendar";
const npm = "https://www.npmjs.com/package/@qentrah/react-calendar";
const url = (path = "") => `${base}library/${path}${path ? "/" : ""}`;
function readPath() {
  const path = location.pathname
    .slice(base.length)
    .replace(/^library\/?/, "")
    .replace(/\/$/, "");
  const legacy = components.find((c) => `#${c.name}` === location.hash);
  return legacy ? `components/${legacy.slug}` : path;
}
const viewLabels: Record<ComponentView, string> = {
  preview: "Preview",
  configure: "Configure",
  code: "Code",
  api: "API reference",
};
function ComponentPage({
  component,
  view,
}: {
  component: (typeof components)[number];
  view: ComponentView;
}) {
  const [settings, setSettings] = usePlaygroundSettings(component.name);
  const update = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => setSettings((s) => ({ ...s, [key]: value }));
  return (
    <>
      <header className="docs-page-heading">
        <p className="docs-breadcrumb">Components / {component.name}</p>
        <h1>{component.name}</h1>
        <p>{component.description}</p>
      </header>
      <nav className="docs-subnav" aria-label={`${component.name} pages`}>
        {componentViews.map((v) => (
          <a
            key={v}
            aria-current={view === v ? "page" : undefined}
            href={url(
              `components/${component.slug}${v === "preview" ? "" : `/${v}`}`,
            )}
          >
            {viewLabels[v]}
          </a>
        ))}
      </nav>
      {view === "preview" && (
        <>
          <div className="docs-example-panel">
            <div className="docs-preview-heading">
              <span>Live preview</span>
              <a href={url(`components/${component.slug}/configure`)}>
                Configure example →
              </a>
            </div>
            <div
              className={`docs-preview ${component.tall ? "docs-preview-tall" : ""}`}
              tabIndex={component.tall ? 0 : undefined}
              role={component.tall ? "region" : undefined}
              aria-label={
                component.tall
                  ? `${component.name} scrollable preview`
                  : undefined
              }
            >
              <LivePreview
                name={component.name}
                settings={settings}
                onChange={update}
              />
            </div>
            <p className="docs-hint">{component.hint}</p>
          </div>
          <div className="docs-next-task">
            <p>Need to change the example?</p>
            <a href={url(`components/${component.slug}/configure`)}>
              Choose settings →
            </a>
            <a href={url(`components/${component.slug}/code`)}>
              Copy this example →
            </a>
          </div>
        </>
      )}
      {view === "configure" && (
        <>
          <p className="docs-lead">
            These controls change this example only. The live preview shows the
            result. Your selections are kept in this browser tab and included on
            the Code page.
          </p>
          <div className="docs-config-layout">
            <PlaygroundControls
              name={component.name}
              settings={settings}
              onChange={update}
              onReset={() =>
                setSettings({
                  ...initialSettings,
                  states: [...initialSettings.states],
                })
              }
            />
            <section
              className="docs-example-panel"
              aria-label={`${component.name} configured preview`}
            >
              <div className="docs-preview-heading">
                <span>Result</span>
                <a href={url(`components/${component.slug}/code`)}>
                  Copy TypeScript →
                </a>
              </div>
              <div
                className={`docs-preview ${component.tall ? "docs-preview-tall" : ""}`}
                tabIndex={0}
                role="region"
                aria-label="Configured live preview"
              >
                <LivePreview
                  name={component.name}
                  settings={settings}
                  onChange={update}
                />
              </div>
            </section>
          </div>
          <p className="docs-hint">
            For your own dates and event names, use the{" "}
            <a href={url("patterns/custom-data")}>
              custom holiday data pattern
            </a>
            .
          </p>
        </>
      )}
      {view === "code" && (
        <>
          <p className="docs-lead">
            A complete example using your current settings. Includes imports,
            state, and the stylesheet.
          </p>
          <CodeBlock
            code={generateExample(component.name, settings)}
            label={`${component.name}Example.tsx`}
          />
          <p className="docs-hint">
            Install <a href={npm}>@qentrah/react-calendar</a> first.{" "}
            <a href={url(`components/${component.slug}/configure`)}>
              Change settings →
            </a>
          </p>
        </>
      )}
      {view === "api" && (
        <>
          <p className="docs-lead">
            The public props accepted by {component.name}. Canvas styling
            belongs to the wrapper and is shown in the example code.
          </p>
          <PropsTable name={component.name} />
        </>
      )}
    </>
  );
}
function Guide({ path }: { path: string }) {
  if (path === "start/installation")
    return (
      <>
        <ol className="docs-steps">
          <li>
            <h2>Install the package</h2>
            <p>Use an existing React 18.3 or React 19 project.</p>
            <CodeBlock
              code="npm install @qentrah/react-calendar"
              label="Terminal"
            />
          </li>
          <li>
            <h2>Import the component and stylesheet</h2>
            <CodeBlock code={installation} label="Holidays.tsx" />
          </li>
          <li>
            <h2>Check the result</h2>
            <p>
              You should see the 2026 calendar with Johor and Kelantan selected.
              Change the year or view using its toolbar.
            </p>
            <a href={url("components/holiday-calendar")}>
              Open the calendar preview →
            </a>
          </li>
        </ol>
        <p className="docs-hint">
          Using Next.js? Put interactive calendar code in a client component
          with <code>"use client"</code> at the top. Import the stylesheet in
          your app’s supported global CSS entry.
        </p>
      </>
    );
  if (path === "start/styling")
    return (
      <>
        <h2>Choose a component theme</h2>
        <p>
          Use <code>defaultTheme="dark"</code> or{" "}
          <code>defaultTheme="light"</code> on HolidayCalendar. Use{" "}
          <code>theme</code> and <code>onThemeChange</code> when your app owns
          the selection.
        </p>
        <h2>Style standalone components</h2>
        <p>
          Import the stylesheet once. Composed components use a{" "}
          <code>.bc-calendar</code> wrapper and <code>data-theme</code>. Their
          styles stay inside this wrapper.
        </p>
        <CodeBlock code={styled} label="ViewButton.tsx" />
        <h2>Control the canvas</h2>
        <p>
          Root padding and <code>className</code> change layout, not holiday
          data. In Configure, open Canvas styling only if you need to test
          spacing.
        </p>
        <a href={url("components/holiday-calendar/configure")}>
          Configure the full calendar →
        </a>
      </>
    );
  if (path === "patterns/controlled-state")
    return (
      <>
        <p className="docs-lead">
          Use controlled props when other parts of your app need the same
          selection.
        </p>
        <CodeBlock code={controlled} label="ControlledCalendar.tsx" />
        <h2>How the state moves</h2>
        <ol>
          <li>The app passes the current year, states, and view.</li>
          <li>A calendar interaction calls its matching change handler.</li>
          <li>React updates the app state and renders the new selection.</li>
        </ol>
        <p>
          For a self-contained calendar, use <code>defaultYear</code>,{" "}
          <code>defaultStates</code>, and <code>defaultView</code> instead.
          Avoid switching a prop between controlled and uncontrolled during a
          component’s lifetime.
        </p>
        <a href={url("components/holiday-calendar/api")}>
          Read the controlled props →
        </a>
      </>
    );
  if (path === "patterns/filter-holidays")
    return (
      <>
        <p className="docs-lead">
          Derive events from the bundled data before passing them to a list or
          grid.
        </p>
        <CodeBlock code={filtered} label="PublicHolidays.tsx" />
        <h2>Choose the region scope</h2>
        <ul>
          <li>
            <code>[]</code>: all regions.
          </li>
          <li>
            <code>["johor"]</code>: nationwide public holidays plus Johor’s
            regional holidays.
          </li>
          <li>
            <code>["nationwide"]</code>: nationwide public holidays. School
            holidays still follow their own visibility and group rules.
          </li>
        </ul>
        <p>
          Set <code>school: false</code> for a public-holiday-only list.
          Exported <code>states</code> contains the supported slugs and labels.
        </p>
        <a href={url("components/calendar-list/configure")}>
          Try event filters →
        </a>
      </>
    );
  if (path === "patterns/custom-data/build") return <CustomData />;
  if (path === "patterns/custom-data/code") return <CustomData code />;
  if (path === "patterns/custom-data")
    return (
      <>
        <p className="docs-lead">
          Pass a HolidayDataset to replace the bundled data. No API or server is
          required.
        </p>
        <h2>The data model</h2>
        <div className="docs-model-table">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>data[year]</code>
                </td>
                <td>One entry per year, with a matching numeric year field.</td>
              </tr>
              <tr>
                <td>
                  <code>publicHolidays</code>
                </td>
                <td>Events with an ISO date, name, and region slugs.</td>
              </tr>
              <tr>
                <td>
                  <code>schoolHolidays</code>
                </td>
                <td>
                  Ranges with startDate, endDate, name, and school group A or B.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Dates use <code>YYYY-MM-DD</code>. School ranges include both
          endpoints. An empty dataset throws an error; include at least one
          year. An unsupported selected year falls back to the first year in
          your dataset.
        </p>
        <div className="docs-next-task">
          <a href={url("patterns/custom-data/build")}>
            Build a sample dataset →
          </a>
          <a href={url("patterns/custom-data/code")}>View its TypeScript →</a>
        </div>
      </>
    );
  return null;
}
export function LibraryPage() {
  const route = parseDocRoute(readPath());
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      return sessionStorage.getItem("bilacuti-docs-theme") === "light"
        ? "light"
        : "dark";
    } catch {
      return "dark";
    }
  });
  const title = route.component
    ? route.component.name
    : route.guide?.title || (route.valid ? "Documentation" : "Page not found");
  useEffect(() => {
    document.title = `${title} · Bila Cuti`;
    try {
      sessionStorage.setItem("bilacuti-docs-theme", theme);
    } catch {
      /* Optional storage. */
    }
    if (location.hash && components.some((c) => `#${c.name}` === location.hash))
      history.replaceState({}, "", url(route.path));
  }, [title, theme, route.path]);
  return (
    <div className="docs-page" data-theme={theme}>
      <a className="docs-skip" href="#docs-content">
        Skip to content
      </a>
      <header className="docs-topbar">
        <a className="docs-brand" href={url()}>
          <img src={`${base}brand/logo.png`} width="32" height="32" alt="" />
          <span>bila cuti</span>
          <span className="docs-brand-label">/ docs</span>
        </a>
        <div className="docs-top-actions">
          <a href={npm}>npm ↗</a>
          <a href={repo}>GitHub ↗</a>
          <button
            className="docs-theme"
            aria-label={`Switch documentation to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☼" : "☾"}
          </button>
          <a className="docs-demo-link" href={base}>
            Calendar ↗
          </a>
        </div>
      </header>
      <div className="docs-mobile-nav">
        <label>
          Documentation page
          <select
            value={
              route.component
                ? `components/${route.component.slug}`
                : route.path
            }
            onChange={(e) => {
              location.href = url(e.target.value);
            }}
          >
            <option value="">Overview</option>
            {["Start", "Patterns", "Custom data"].map((group) => (
              <optgroup label={group} key={group}>
                {guides
                  .filter((g) => g.group === group)
                  .map((g) => (
                    <option key={g.path} value={g.path}>
                      {g.title}
                    </option>
                  ))}
              </optgroup>
            ))}
            <optgroup label="Components">
              {components.map((c) => (
                <option value={`components/${c.slug}`} key={c.slug}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
      </div>
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <nav aria-label="Documentation">
            <label className="docs-search">
              <span className="playground-sr-only">Find documentation</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a page…"
              />
            </label>
            <a
              href={url()}
              aria-current={route.path === "" ? "page" : undefined}
            >
              Overview
            </a>
            {["Start", "Components", "Patterns", "Custom data"].map((group) => (
              <div className="docs-nav-group" key={group}>
                <h2>{group}</h2>
                {group === "Components"
                  ? components
                      .filter((c) =>
                        c.name.toLowerCase().includes(query.toLowerCase()),
                      )
                      .map((c) => (
                        <a
                          key={c.slug}
                          href={url(`components/${c.slug}`)}
                          aria-current={
                            route.component?.slug === c.slug
                              ? "page"
                              : undefined
                          }
                        >
                          {c.name}
                        </a>
                      ))
                  : guides
                      .filter(
                        (g) =>
                          g.group === group &&
                          g.title.toLowerCase().includes(query.toLowerCase()),
                      )
                      .map((g) => (
                        <a
                          key={g.path}
                          href={url(g.path)}
                          aria-current={
                            route.path === g.path ? "page" : undefined
                          }
                        >
                          {g.title}
                        </a>
                      ))}
              </div>
            ))}
            {query &&
              !components.some((c) =>
                c.name.toLowerCase().includes(query.toLowerCase()),
              ) &&
              !guides.some((g) =>
                g.title.toLowerCase().includes(query.toLowerCase()),
              ) && <p role="status">No pages found.</p>}
            <div className="docs-sidebar-note">
              <a href={`${repo}/issues`}>Report an issue ↗</a>
              <span>MIT · React 18.3 / 19</span>
            </div>
          </nav>
        </aside>
        <main className="docs-main" id="docs-content" tabIndex={-1}>
          {route.component ? (
            <ComponentPage
              key={route.component.name}
              component={route.component}
              view={route.view}
            />
          ) : (
            <>
              <header className="docs-page-heading">
                <p className="docs-breadcrumb">
                  {route.guide?.group || "Bila Cuti"}
                </p>
                <h1>{title}</h1>
                {route.guide && <p>{route.guide.description}</p>}
              </header>
              {!route.valid ? (
                <p>
                  This page does not exist.{" "}
                  <a href={url()}>Open documentation →</a>
                </p>
              ) : route.guide ? (
                <>
                  {route.path.startsWith("patterns/custom-data") && (
                    <nav className="docs-subnav" aria-label="Custom data pages">
                      {guides
                        .filter((g) =>
                          g.path.startsWith("patterns/custom-data"),
                        )
                        .map((g) => (
                          <a
                            key={g.path}
                            href={url(g.path)}
                            aria-current={
                              route.path === g.path ? "page" : undefined
                            }
                          >
                            {g.path.endsWith("build")
                              ? "Live builder"
                              : g.path.endsWith("code")
                                ? "Code"
                                : "Data model"}
                          </a>
                        ))}
                    </nav>
                  )}
                  <article className="docs-article">
                    <Guide path={route.path} />
                  </article>
                </>
              ) : (
                <>
                  <p className="docs-lead">
                    React components for Malaysia’s public and school holidays.
                    Start with installation, or choose a component to try it.
                  </p>
                  <CodeBlock
                    code="npm install @qentrah/react-calendar"
                    label="Install from npm"
                  />
                  <div className="docs-task-index">
                    <h2>Start</h2>
                    {guides
                      .filter((g) => g.group === "Start")
                      .map((g) => (
                        <a key={g.path} href={url(g.path)}>
                          <strong>{g.title}</strong>
                          <span>{g.description}</span>
                          <b aria-hidden="true">→</b>
                        </a>
                      ))}
                    <h2>Components</h2>
                    {components.map((c) => (
                      <a key={c.slug} href={url(`components/${c.slug}`)}>
                        <strong>{c.name}</strong>
                        <span>{c.description}</span>
                        <b aria-hidden="true">→</b>
                      </a>
                    ))}
                    <h2>Patterns</h2>
                    {guides
                      .filter((g) => g.group === "Patterns")
                      .map((g) => (
                        <a key={g.path} href={url(g.path)}>
                          <strong>{g.title}</strong>
                          <span>{g.description}</span>
                          <b aria-hidden="true">→</b>
                        </a>
                      ))}
                  </div>
                  <p className="docs-hint">
                    Bundled holiday data is a static 2026–2027 snapshot. Check
                    official announcements before making plans.
                  </p>
                </>
              )}
            </>
          )}
          <footer className="docs-bottom">
            <a href={repo}>Source & issues ↗</a>
            <a href={`${repo}/blob/main/THIRD_PARTY_NOTICES.md`}>
              Credits & licenses ↗
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
