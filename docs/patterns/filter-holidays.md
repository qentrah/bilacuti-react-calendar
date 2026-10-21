# Build a regional holiday list

Filter the bundled dataset before passing events to CalendarList or CalendarGrid.

```tsx
import {
  CalendarList,
  filterCalendarEvents,
  malaysiaHolidayData,
} from "@qentrah/react-calendar";
import "@qentrah/react-calendar/styles.css";

const events = filterCalendarEvents(malaysiaHolidayData[2026], ["johor"], {
  public: true,
  school: false,
  annualLeave: false,
});

export default function PublicHolidays() {
  return (
    <div className="bc-calendar" data-theme="dark">
      <CalendarList events={events} />
    </div>
  );
}
```

An empty state array includes every region. A specific state includes its regional public holidays plus nationwide public holidays. ['nationwide'] limits public holidays to nationwide events; school visibility follows its own rules. Use school: false for public holidays only.

[Try event filters](https://qentrah.github.io/bilacuti-react-calendar/library/components/calendar-list/configure/).
