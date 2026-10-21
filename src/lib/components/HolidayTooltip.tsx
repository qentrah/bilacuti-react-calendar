import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { regionName } from "../data.js";
import type { CalendarEvent, CalendarTheme } from "../types.js";
export interface HolidayTooltipProps {
  id: string;
  anchor: HTMLElement;
  events: readonly CalendarEvent[];
  theme: CalendarTheme;
  onDismiss: () => void;
}
/** Body portal avoids sticky-toolbar stacking contexts and container clipping. */
export function HolidayTooltip({
  id,
  anchor,
  events,
  theme,
  onDismiss,
}: HolidayTooltipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    arrow: 16,
    below: false,
    ready: false,
  });
  useLayoutEffect(() => {
    const update = () => {
      const tip = ref.current;
      if (!tip || !anchor.isConnected) {
        onDismiss();
        return;
      }
      const rect = anchor.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewportHeight) {
        onDismiss();
        return;
      }
      const width = tip.offsetWidth,
        height = tip.offsetHeight,
        gap = 10,
        padding = 8;
      const below = rect.top - height - gap < padding;
      const left = Math.max(
        padding,
        Math.min(rect.left, viewportWidth - width - padding),
      );
      const top = Math.max(
        padding,
        Math.min(
          below ? rect.bottom + gap : rect.top - height - gap,
          viewportHeight - height - padding,
        ),
      );
      setPosition({
        left,
        top,
        below,
        arrow: Math.max(
          12,
          Math.min(rect.left + rect.width / 2 - left, width - 12),
        ),
        ready: true,
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const observer = new ResizeObserver(update);
    if (ref.current) observer.observe(ref.current);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [anchor, events, onDismiss]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    const outside = (e: PointerEvent) => {
      if (
        e.target instanceof Node &&
        !anchor.contains(e.target) &&
        !ref.current?.contains(e.target)
      )
        onDismiss();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, [anchor, onDismiss]);
  return createPortal(
    <div className="bc-calendar bc-portal" data-theme={theme}>
      <div
        ref={ref}
        id={id}
        role="tooltip"
        className={`tooltip portal-tooltip ${position.below ? "below" : ""}`}
        style={
          {
            left: position.left,
            top: position.top,
            visibility: position.ready ? "visible" : "hidden",
            "--bc-arrow-x": `${position.arrow}px`,
          } as CSSProperties
        }
      >
        {events.map((event, index) => (
          <div key={`${event.name}-${index}`}>
            <b>
              <i
                className={
                  event.kind === "public"
                    ? "orange"
                    : event.kind === "school"
                      ? "blue"
                      : "green"
                }
              />
              {event.name}
            </b>
            <small>
              {event.regions.length
                ? event.regions.map(regionName).join(", ")
                : "Nationwide"}
            </small>
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
}
