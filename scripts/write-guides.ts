import { mkdirSync, writeFileSync } from "node:fs";
import {
  installation,
  controlled,
  filtered,
  defaultModel,
  customDataCode,
} from "../src/docs/patterns";
const site = "https://qentrah.github.io/bilacuti-react-calendar/library/";
const block = (code: string) => `\n\`\`\`tsx\n${code}\n\`\`\`\n`;
mkdirSync("docs/patterns", { recursive: true });
writeFileSync(
  "docs/installation.md",
  `# Install Bila Cuti React Calendar\n\nUse an existing React 18.3 or React 19 app.\n\n1. Run \`npm install @qentrah/react-calendar\`.\n2. Import the component and stylesheet.\n${block(installation)}\n3. Open your app. The calendar should show 2026 with Johor and Kelantan selected.\n\n[Try the component preview](${site}components/holiday-calendar/). For Next.js, use a client component and import CSS in your app's supported global stylesheet entry.\n`,
);
writeFileSync(
  "docs/patterns/controlled-state.md",
  `# Keep calendar selections in app state\n\nUse controlled props when other UI needs the same year, states, or view. Each controlled value has a matching change callback.\n${block(controlled)}\nCalendar interactions call the change handlers. React updates the app state, then renders the selected values. Use defaultYear, defaultStates, and defaultView when the calendar can own its state. Avoid switching a prop between controlled and uncontrolled during its lifetime.\n\n[Read all props](${site}components/holiday-calendar/api/).\n`,
);
writeFileSync(
  "docs/patterns/filter-holidays.md",
  `# Build a regional holiday list\n\nFilter the bundled dataset before passing events to CalendarList or CalendarGrid.\n${block(filtered)}\nAn empty state array includes every region. A specific state includes its regional public holidays plus nationwide public holidays. ['nationwide'] limits public holidays to nationwide events; school visibility follows its own rules. Use school: false for public holidays only.\n\n[Try event filters](${site}components/calendar-list/configure/).\n`,
);
writeFileSync(
  "docs/patterns/custom-data.md",
  `# Use your own holiday data\n\nPass a HolidayDataset to replace the bundled data. No server is required.\n\n## Model\n\nEach numeric year maps to an object with year, publicHolidays, and schoolHolidays. Public events have date, name, and regions. School ranges have startDate, endDate, name, and group A or B, with optional regions. Dates use YYYY-MM-DD and school ranges include both endpoints. Include at least one year; an empty dataset throws an error. An unsupported selected year falls back to the first dataset year.\n\n## Sample event\n\nThis team-planning event is sample data, not an official holiday.\n${block(customDataCode(defaultModel))}\n[Edit the model and preview the result](${site}patterns/custom-data/build/). The builder saves changes in your browser tab; its Code page includes the edited event. It does not publish your data or change the bundled dataset.\n`,
);
