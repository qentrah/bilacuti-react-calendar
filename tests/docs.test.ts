import test from "node:test";
import assert from "node:assert/strict";
import {
  components,
  componentViews,
  routePaths,
  parseDocRoute,
} from "../src/docs/routes";
import {
  customDataCode,
  defaultModel,
  isModelDate,
} from "../src/docs/patterns";
test("each component task has a unique directly buildable documentation route", () => {
  assert.equal(new Set(routePaths).size, 40);
  for (const c of components)
    for (const view of componentViews) {
      const path = `components/${c.slug}${view === "preview" ? "" : `/${view}`}`;
      const parsed = parseDocRoute(path);
      assert.equal(parsed.valid, true);
      assert.equal(parsed.component?.name, c.name);
      assert.equal(parsed.view, view);
    }
  assert.equal(
    parseDocRoute("components/holiday-calendar/missing").valid,
    false,
  );
  assert.equal(
    parseDocRoute("components/holiday-calendar/missing").component,
    undefined,
  );
});
test("custom data pattern serializes names and years as safe TypeScript literals", () => {
  const code = customDataCode({
    ...defaultModel,
    title: 'A "quoted" event\nsecond line',
    date: "2029-05-10",
    region: "johor",
  });
  assert.ok(code.includes("2029:"));
  assert.ok(code.includes('name: "A \\"quoted\\" event\\nsecond line"'));
  assert.ok(code.includes('regions: ["johor"]'));
  assert.ok(code.includes("data={data}"));
});

test("custom model accepts real supported dates and rejects incomplete or impossible dates", () => {
  assert.equal(isModelDate("2027-04-12"), true);
  assert.equal(isModelDate("2028-02-29"), true);
  for (const invalid of [
    "2027-02-29",
    "2026-06-31",
    "2027-04",
    "not-a-date",
    "1900-01-01",
  ])
    assert.equal(isModelDate(invalid), false);
});
