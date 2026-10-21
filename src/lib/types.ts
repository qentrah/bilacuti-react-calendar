import type { CSSProperties } from "react";
export type CalendarTheme = "light" | "dark";
export type CalendarView = "grid" | "month" | "list";
export type WeekStart = "monday" | "sunday";
export type HolidayKind = "public" | "school" | "leave";
export interface PublicHoliday {
  date: string;
  name: string;
  regions: string[];
}
export interface SchoolHoliday {
  name: string;
  startDate: string;
  endDate: string;
  group: "A" | "B";
  regions?: string[];
}
export interface HolidayYear {
  year: number;
  publicHolidays: PublicHoliday[];
  schoolHolidays: SchoolHoliday[];
}
export type HolidayDataset = Record<number, HolidayYear>;
export interface CalendarEvent {
  name: string;
  kind: HolidayKind;
  date: string;
  endDate?: string;
  regions: string[];
  group?: "A" | "B";
}
export interface HolidayVisibility {
  public: boolean;
  school: boolean;
  annualLeave: boolean;
}
export interface HolidayCalendarProps {
  data?: HolidayDataset;
  year?: number;
  defaultYear?: number;
  onYearChange?: (year: number) => void;
  states?: string[];
  defaultStates?: string[];
  onStatesChange?: (states: string[]) => void;
  theme?: CalendarTheme;
  defaultTheme?: CalendarTheme;
  onThemeChange?: (theme: CalendarTheme) => void;
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  weekStart?: WeekStart;
  defaultWeekStart?: WeekStart;
  onWeekStartChange?: (weekStart: WeekStart) => void;
  visibility?: HolidayVisibility;
  defaultVisibility?: HolidayVisibility;
  onVisibilityChange?: (visibility: HolidayVisibility) => void;
  showRelatedLinks?: boolean;
  showFooter?: boolean;
  showJumpButton?: boolean;
  className?: string;
  style?: CSSProperties;
  onDateSelect?: (date: string, events: CalendarEvent[]) => void;
}
