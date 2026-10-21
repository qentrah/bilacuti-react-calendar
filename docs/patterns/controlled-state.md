# Keep calendar selections in app state

Use controlled props when other UI needs the same year, states, or view. Each controlled value has a matching change callback.

```tsx
import { useState } from "react";
import { HolidayCalendar, type CalendarView } from "@qentrah/react-calendar";
import "@qentrah/react-calendar/styles.css";

export default function Holidays() {
  const [year, setYear] = useState(2026);
  const [states, setStates] = useState(["johor"]);
  const [view, setView] = useState<CalendarView>("grid");
  return (
    <HolidayCalendar
      year={year}
      onYearChange={setYear}
      states={states}
      onStatesChange={setStates}
      view={view}
      onViewChange={setView}
      showJumpButton={false}
    />
  );
}
```

Calendar interactions call the change handlers. React updates the app state, then renders the selected values. Use defaultYear, defaultStates, and defaultView when the calendar can own its state. Avoid switching a prop between controlled and uncontrolled during its lifetime.

[Read all props](https://qentrah.github.io/bilacuti-react-calendar/library/components/holiday-calendar/api/).
