import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type { CodeLanguage } from "./code-language";
let highlighter: ReturnType<typeof createHighlighterCore> | undefined;
export function getHighlighter() {
  return (highlighter ??= createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    themes: [
      import("@shikijs/themes/dark-plus"),
      import("@shikijs/themes/light-plus"),
    ],
    langs: [
      import("@shikijs/langs/tsx"),
      import("@shikijs/langs/shellscript"),
      import("@shikijs/langs/json"),
      import("@shikijs/langs/css"),
    ],
  }));
}
export async function highlightCode(code: string, language: CodeLanguage) {
  return (await getHighlighter()).codeToTokensWithThemes(code, {
    lang: language,
    themes: { dark: "dark-plus", light: "light-plus" },
  });
}
