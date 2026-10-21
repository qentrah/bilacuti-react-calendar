# Use your own holiday data

Pass a HolidayDataset to replace the bundled data. No server is required.

## Model

Each numeric year maps to an object with year, publicHolidays, and schoolHolidays. Public events have date, name, and regions. School ranges have startDate, endDate, name, and group A or B, with optional regions. Dates use YYYY-MM-DD and school ranges include both endpoints. Include at least one year; an empty dataset throws an error. An unsupported selected year falls back to the first dataset year.

## Sample event

This team-planning event is sample data, not an official holiday.

```tsx
import { HolidayCalendar, type HolidayDataset } from "@qentrah/react-calendar";
import "@qentrah/react-calendar/styles.css";

const data: HolidayDataset = {
  2026: {
    year: 2026,
    publicHolidays: [
      {
        date: "2026-06-15",
        name: "Team planning day",
        regions: ["nationwide"],
      },
    ],
    schoolHolidays: [],
  },
};

export default function CustomCalendar() {
  return (
    <HolidayCalendar
      data={data}
      defaultYear={2026}
      defaultStates={[]}
      defaultView="list"
      defaultTheme="dark"
      defaultVisibility={{ public: true, school: false, annualLeave: false }}
      showRelatedLinks={false}
      showFooter={false}
      showJumpButton={false}
    />
  );
}
```

[Edit the model and preview the result](https://qentrah.github.io/bilacuti-react-calendar/library/patterns/custom-data/build/). The builder saves changes in your browser tab; its Code page includes the edited event. It does not publish your data or change the bundled dataset.
