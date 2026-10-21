import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import {
  propsByComponent,
  componentNames,
  generateExample,
  initialSettings,
} from "../src/playground/model";
test("props reference covers every public component interface without invented props", () => {
  const interfaces = [
    ["HolidayCalendar", "src/lib/types.ts", "HolidayCalendarProps"],
    [
      "CalendarToolbar",
      "src/lib/components/CalendarToolbar.tsx",
      "CalendarToolbarProps",
    ],
    [
      "CalendarGrid",
      "src/lib/components/CalendarGrid.tsx",
      "CalendarGridProps",
    ],
    [
      "CalendarList",
      "src/lib/components/CalendarList.tsx",
      "CalendarListProps",
    ],
    [
      "HolidayTooltip",
      "src/lib/components/HolidayTooltip.tsx",
      "HolidayTooltipProps",
    ],
    ["CalendarIcon", "src/lib/components/Icon.tsx", "CalendarIconProps"],
  ] as const;
  for (const [name, path, type] of interfaces) {
    const source = ts.createSourceFile(
      path,
      readFileSync(path, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const declaration = source.statements.find(
      (node) => ts.isInterfaceDeclaration(node) && node.name.text === type,
    ) as ts.InterfaceDeclaration;
    assert.ok(declaration, type);
    const actual = declaration.members
      .map((member) => member.name?.getText(source))
      .sort();
    const documented = propsByComponent[name].map((prop) => prop.name).sort();
    assert.deepEqual(documented, actual, name);
  }
  assert.deepEqual(
    propsByComponent.CalendarRelatedLinks.map((p) => p.name),
    ["year"],
  );
  assert.equal(propsByComponent.CalendarFooter.length, 0);
});
test("generated examples are standalone package consumers with a single exported example", () => {
  for (const name of componentNames) {
    const source = generateExample(name, initialSettings);
    assert.ok(source.includes("@bilacuti/react-calendar"));
    assert.ok(!source.includes("../lib"));
    assert.equal(
      (source.match(/export default function Example/g) ?? []).length,
      1,
    );
  }
});
test("list preserves chronological years and formats cross-month ranges correctly", async () => {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { CalendarList } =
    await import("../src/lib/components/CalendarList.js");
  const html = renderToStaticMarkup(
    createElement(CalendarList, {
      events: [
        {
          name: "Midyear",
          date: "2026-05-22",
          endDate: "2026-06-06",
          regions: [],
          kind: "school",
        },
        {
          name: "Carry over",
          date: "2025-12-19",
          endDate: "2026-01-10",
          regions: [],
          kind: "school",
        },
      ],
    }),
  );
  assert.ok(html.indexOf("December 2025") < html.indexOf("May 2026"));
  assert.ok(html.includes("22 May 2026 – 6 Jun 2026"));
  assert.ok(html.includes("19 Dec 2025 – 10 Jan 2026"));
});
