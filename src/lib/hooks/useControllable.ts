import { useCallback, useState } from "react";
export function useControllable<T>(
  value: T | undefined,
  initialValue: T,
  onChange?: (value: T) => void,
): readonly [T, (value: T) => void] {
  const [internal, setInternal] = useState(initialValue);
  const set = useCallback(
    (next: T) => {
      if (value === undefined) setInternal(next);
      onChange?.(next);
    },
    [value, onChange],
  );
  return [value === undefined ? internal : value, set] as const;
}
