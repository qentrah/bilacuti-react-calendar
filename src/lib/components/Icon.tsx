export interface CalendarIconProps {
  type?: "grid" | "month" | "list" | "settings";
}
export function CalendarIcon({ type }: CalendarIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      {type === "grid" ? (
        [3, 14].flatMap((x) =>
          [3, 14].map((y) => (
            <rect key={`${x},${y}`} x={x} y={y} width="7" height="7" rx="1" />
          )),
        )
      ) : type === "list" ? (
        <path d="M3 5h18M3 12h18M3 19h18" />
      ) : type === "month" ? (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4m10-4v4M3 10h18" />
        </>
      ) : type === "settings" ? (
        <>
          <path d="m9 3-1 3-3 1v3l-2 2 2 2v3l3 1 1 3h6l1-3 3-1v-3l2-2-2-2V7l-3-1-1-3Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <path d="m7 10 5 5 5-5" />
      )}
    </svg>
  );
}
