import type { ComponentName } from "../playground/model";
export const components: {
  name: ComponentName;
  slug: string;
  description: string;
  hint: string;
  tall?: boolean;
}[] = [
  {
    name: "HolidayCalendar",
    slug: "holiday-calendar",
    description: "A complete Malaysian holiday calendar.",
    hint: "Use the year, state, and view controls in the calendar.",
    tall: true,
  },
  {
    name: "CalendarToolbar",
    slug: "calendar-toolbar",
    description: "Year, state, view, and display controls.",
    hint: "Select a year or state. The example code follows your changes.",
  },
  {
    name: "CalendarGrid",
    slug: "calendar-grid",
    description: "Dates arranged by month, with holiday markers.",
    hint: "Select a date to read its holidays.",
    tall: true,
  },
  {
    name: "CalendarList",
    slug: "calendar-list",
    description: "Public and school holidays in date order.",
    hint: "Scroll inside the preview to see more dates.",
    tall: true,
  },
  {
    name: "HolidayTooltip",
    slug: "holiday-tooltip",
    description: "Holiday details anchored to a date.",
    hint: "Select the date to open the popover. Escape dismisses it.",
  },
  {
    name: "CalendarRelatedLinks",
    slug: "calendar-related-links",
    description: "Links to the original holiday planning guides.",
    hint: "Links open the original Bilacuti guides.",
  },
  {
    name: "CalendarFooter",
    slug: "calendar-footer",
    description: "Source credits and feedback links.",
    hint: "This component has no props.",
  },
  {
    name: "CalendarIcon",
    slug: "calendar-icon",
    description: "The five icons used by calendar controls.",
    hint: "The icon is decorative. Label its parent button.",
  },
];
export const guides = [
  {
    path: "start/installation",
    title: "Installation",
    group: "Start",
    description: "Install the package and render your first calendar.",
  },
  {
    path: "start/styling",
    title: "Themes & styling",
    group: "Start",
    description: "Choose a theme and style standalone components.",
  },
  {
    path: "patterns/controlled-state",
    title: "Controlled state",
    group: "Patterns",
    description:
      "Keep the calendar year, states, and view in your application.",
  },
  {
    path: "patterns/filter-holidays",
    title: "Filter holidays",
    group: "Patterns",
    description: "Build a list from regional holiday data.",
  },
  {
    path: "patterns/custom-data",
    title: "Custom holiday data",
    group: "Patterns",
    description: "Understand the dataset shape, then build a working example.",
  },
  {
    path: "patterns/custom-data/build",
    title: "Build a dataset",
    group: "Custom data",
    description: "Edit a holiday and see it in a live calendar.",
  },
  {
    path: "patterns/custom-data/code",
    title: "Copy the example",
    group: "Custom data",
    description: "Use your edited dataset in a React component.",
  },
];
export const componentViews = ["preview", "configure", "code", "api"] as const;
export type ComponentView = (typeof componentViews)[number];
export const routePaths = [
  "",
  ...guides.map((g) => g.path),
  ...components.flatMap((c) =>
    componentViews.map(
      (v) => `components/${c.slug}${v === "preview" ? "" : `/${v}`}`,
    ),
  ),
];
export function parseDocRoute(path: string) {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const [, slug, view = "preview"] = clean.split("/");
  const component =
    routePaths.includes(clean) && clean.startsWith("components/")
      ? components.find((c) => c.slug === slug)
      : undefined;
  return {
    path: clean,
    component,
    view: componentViews.includes(view as ComponentView)
      ? (view as ComponentView)
      : "preview",
    guide: guides.find((g) => g.path === clean),
    valid: routePaths.includes(clean),
  };
}
