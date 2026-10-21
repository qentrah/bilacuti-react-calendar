# Install Bila Cuti React Calendar

Use an existing React 18.3 or React 19 app.

1. Run `npm install @qentrah/react-calendar`.
2. Import the component and stylesheet.

```tsx
import { HolidayCalendar } from "@qentrah/react-calendar";
import "@qentrah/react-calendar/styles.css";

export default function Holidays() {
  return (
    <HolidayCalendar
      defaultYear={2026}
      defaultStates={["johor", "kelantan"]}
      showJumpButton={false}
    />
  );
}
```

3. Open your app. The calendar should show 2026 with Johor and Kelantan selected.

[Try the component preview](https://qentrah.github.io/bilacuti-react-calendar/library/components/holiday-calendar/). For Next.js, use a client component and import CSS in your app's supported global stylesheet entry.
