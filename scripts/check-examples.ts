import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import {
  componentNames,
  generateExample,
  initialSettings,
} from "../src/playground/model";
import {
  installation,
  controlled,
  filtered,
  styled,
  customDataCode,
  defaultModel,
} from "../src/docs/patterns";
const temporary = mkdtempSync(resolve(".example-check-"));
try {
  const variants = [
    initialSettings,
    {
      ...initialSettings,
      year: 2027,
      theme: "light" as const,
      view: "month" as const,
      states: ["selangor"],
      weekStart: "sunday" as const,
      public: false,
      school: true,
      annualLeave: true,
      showFooter: true,
      showRelatedLinks: true,
      showJumpButton: true,
      padding: 24,
      className: "custom-calendar",
      title: 'A custom "holiday"',
      date: "2027-02-07",
      kind: "school" as const,
      icon: "chevron" as const,
      color: "#ff6600",
    },
  ];
  const files: string[] = [];
  for (const [index, settings] of variants.entries())
    for (const name of componentNames) {
      const file = join(temporary, `${name}-${index}.tsx`);
      writeFileSync(file, generateExample(name, settings));
      files.push(file);
    }
  const patterns = [
    installation,
    controlled,
    filtered,
    styled,
    customDataCode(defaultModel),
    customDataCode({
      ...defaultModel,
      title: 'A "quoted" event',
      date: "2027-03-11",
      region: "johor",
      view: "grid",
      theme: "light",
    }),
  ];
  for (const [index, source] of patterns.entries()) {
    const file = join(temporary, `pattern-${index}.tsx`);
    writeFileSync(file, source);
    files.push(file);
  }
  execFileSync(
    resolve("node_modules/.bin/tsc"),
    [
      "--noEmit",
      "--strict",
      "--skipLibCheck",
      "--jsx",
      "react-jsx",
      "--module",
      "NodeNext",
      "--moduleResolution",
      "NodeNext",
      "--target",
      "ES2022",
      ...files,
    ],
    { stdio: "inherit" },
  );
  console.log(
    `Compiled ${files.length} generated examples against the package declarations.`,
  );
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
