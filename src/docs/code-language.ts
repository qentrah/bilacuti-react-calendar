export type CodeLanguage = "tsx" | "shellscript" | "json" | "css";
export function detectLanguage(code: string, label: string): CodeLanguage {
  if (
    /terminal|install from npm|shell/i.test(label) ||
    /^(npm|pnpm|yarn|bun|npx|git|cd)\s/.test(code.trim())
  )
    return "shellscript";
  if (label.endsWith(".json")) return "json";
  if (label.endsWith(".css")) return "css";
  return "tsx";
}
