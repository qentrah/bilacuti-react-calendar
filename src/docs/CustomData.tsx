import { useEffect, useState } from "react";
import { HolidayCalendar, states } from "../lib";
import type { HolidayDataset } from "../lib";
import { defaultModel, customDataCode, isModelDate } from "./patterns";
import type { CustomModel } from "./patterns";
import { CodeBlock } from "./CodeBlock";
export function useCustomModel() {
  const [model, setModel] = useState<CustomModel>(() => {
    try {
      const s = JSON.parse(
        sessionStorage.getItem("bilacuti-custom-model") || "null",
      );
      if (s && isModelDate(s.date) && typeof s.title === "string")
        return { ...defaultModel, ...s };
    } catch {
      /* Optional storage. */
    }
    return defaultModel;
  });
  useEffect(() => {
    try {
      sessionStorage.setItem("bilacuti-custom-model", JSON.stringify(model));
    } catch {
      /* Optional storage. */
    }
  }, [model]);
  return [model, setModel] as const;
}
export function CustomData({ code = false }: { code?: boolean }) {
  const [model, setModel] = useCustomModel();
  const year = Number(model.date.slice(0, 4));
  const data: HolidayDataset = {
    [year]: {
      year,
      publicHolidays: [
        { date: model.date, name: model.title, regions: [model.region] },
      ],
      schoolHolidays: [],
    },
  };
  if (code)
    return (
      <>
        <p className="docs-lead">
          This example contains the holiday you edited in Build a dataset. It
          replaces the bundled data.
        </p>
        <CodeBlock code={customDataCode(model)} label="CustomCalendar.tsx" />
      </>
    );
  return (
    <>
      <p className="docs-lead">
        This is sample data, not an official holiday. Edit the fields and the
        calendar updates immediately.
      </p>
      <div className="docs-model-layout">
        <form className="docs-model-form" onSubmit={(e) => e.preventDefault()}>
          <h2>Holiday model</h2>
          <label>
            Holiday name
            <input
              value={model.title}
              maxLength={120}
              onChange={(e) => setModel({ ...model, title: e.target.value })}
            />
          </label>
          <label>
            Date
            <input
              type="date"
              min="2020-01-01"
              max="2099-12-31"
              value={model.date}
              onInput={(e) => {
                if (isModelDate(e.currentTarget.value))
                  setModel({ ...model, date: e.currentTarget.value });
              }}
            />
          </label>
          <label>
            Region
            <select
              value={model.region}
              onChange={(e) => setModel({ ...model, region: e.target.value })}
            >
              <option value="nationwide">Nationwide</option>
              {states.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Preview layout
            <select
              value={model.view}
              onChange={(e) =>
                setModel({
                  ...model,
                  view: e.target.value as CustomModel["view"],
                })
              }
            >
              <option value="list">Holiday list</option>
              <option value="month">Month cards</option>
              <option value="grid">Year grid</option>
            </select>
          </label>
          <label>
            Preview theme
            <select
              value={model.theme}
              onChange={(e) =>
                setModel({
                  ...model,
                  theme: e.target.value as CustomModel["theme"],
                })
              }
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
          <button
            className="docs-copy"
            type="button"
            onClick={() => setModel(defaultModel)}
          >
            Reset sample data
          </button>
        </form>
        <section
          className="docs-model-preview"
          aria-label="Custom dataset live preview"
        >
          <div className="docs-preview-heading">
            <span>Live preview</span>
            <span>1 event · {year}</span>
          </div>
          <div
            className="docs-preview docs-preview-tall"
            tabIndex={0}
            role="region"
            aria-label="Custom calendar preview"
          >
            <HolidayCalendar
              key={year}
              data={data}
              defaultYear={year}
              defaultStates={[]}
              view={model.view}
              onViewChange={(view) => setModel({ ...model, view })}
              theme={model.theme}
              onThemeChange={(theme) => setModel({ ...model, theme })}
              defaultVisibility={{
                public: true,
                school: false,
                annualLeave: false,
              }}
              showFooter={false}
              showRelatedLinks={false}
              showJumpButton={false}
              style={{ padding: 16 }}
            />
          </div>
        </section>
      </div>
    </>
  );
}
