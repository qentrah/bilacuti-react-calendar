import test from "node:test";
import assert from "node:assert/strict";
import {
  dateKey,
  eventsOnDate,
  filterCalendarEvents,
  monthOffset,
} from "../src/lib/calendar";
import { malaysiaHolidayData } from "../src/lib/data";
import type { HolidayVisibility, HolidayYear } from "../src/lib/types";
const visible: HolidayVisibility = {
  public: true,
  school: true,
  annualLeave: false,
};
test("selected states include nationwide and exclude other regional public holidays", () => {
  const events = filterCalendarEvents(
    malaysiaHolidayData[2026],
    ["johor", "kelantan"],
    visible,
  );
  assert(events.some((e) => e.name === "Chinese New Year"));
  assert(events.some((e) => e.name === "Birthday of Sultan of Johor"));
  assert(!events.some((e) => e.name === "New Year's Day"));
  assert(!events.some((e) => e.name === "Sarawak Day"));
});
test("nationwide selection restricts public events but keeps both school groups", () => {
  const events = filterCalendarEvents(
    malaysiaHolidayData[2026],
    ["nationwide"],
    visible,
  );
  assert(
    events
      .filter((e) => e.kind === "public")
      .every((e) => e.regions.includes("nationwide")),
  );
  assert(events.some((e) => e.kind === "school" && e.group === "A"));
  assert(events.some((e) => e.kind === "school" && e.group === "B"));
});
test("empty selection includes all states; visibility is independent", () => {
  const all = filterCalendarEvents(malaysiaHolidayData[2026], [], visible);
  assert.equal(
    all.filter((e) => e.kind === "public").length,
    malaysiaHolidayData[2026].publicHolidays.length,
  );
  assert.equal(
    filterCalendarEvents(malaysiaHolidayData[2026], [], {
      public: false,
      school: false,
      annualLeave: false,
    }).length,
    0,
  );
});
test("school ranges include both boundaries and obey explicit regional exceptions", () => {
  const events = filterCalendarEvents(
    malaysiaHolidayData[2026],
    ["sarawak"],
    visible,
  );
  const deepavali = events.filter(
    (e) => e.kind === "school" && e.name === "Cuti Perayaan Deepavali",
  );
  assert.equal(deepavali.length, 1);
  assert.equal(deepavali[0].date, "2026-11-09");
  assert.equal(eventsOnDate(deepavali, "2026-11-08").length, 0);
  assert.equal(eventsOnDate(deepavali, "2026-11-09").length, 1);
  assert.equal(eventsOnDate(deepavali, "2026-11-10").length, 0);
});
test("leave recommendations deduplicate bridges and never cover an existing holiday", () => {
  const year: HolidayYear = {
    year: 2026,
    schoolHolidays: [],
    publicHolidays: [
      { date: "2026-02-17", name: "Tuesday", regions: ["nationwide"] },
      { date: "2026-02-17", name: "Same Tuesday", regions: ["nationwide"] },
      { date: "2026-02-19", name: "Thursday", regions: ["nationwide"] },
      { date: "2026-02-20", name: "Friday holiday", regions: ["nationwide"] },
    ],
  };
  const leave = filterCalendarEvents(year, [], {
    public: false,
    school: false,
    annualLeave: true,
  });
  assert.deepEqual(
    leave.map((e) => e.date),
    ["2026-02-16"],
  );
});
test("date helpers handle leap years and both week starts", () => {
  assert.equal(dateKey(2028, 1, 29), "2028-02-29");
  assert.equal(monthOffset(2026, 0, false), 3);
  assert.equal(monthOffset(2026, 0, true), 4);
});
