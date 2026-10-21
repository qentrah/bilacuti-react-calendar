import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ThemedTokenWithVariants } from "shiki/core";
import { detectLanguage } from "./code-language";
export function CodeBlock({
  code,
  label = "TypeScript",
}: {
  code: string;
  label?: string;
}) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const language = detectLanguage(code, label);
  const terminal = language === "shellscript";
  const [highlighted, setHighlighted] = useState<{
    code: string;
    tokens: ThemedTokenWithVariants[][];
  } | null>(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    let cancelled = false;
    import("./highlight")
      .then((m) => m.highlightCode(code, language))
      .then((tokens) => {
        if (!cancelled) setHighlighted({ code, tokens });
      })
      .catch(() => {
        /* Plain code remains usable if highlighting cannot load. */
      });
    return () => {
      cancelled = true;
    };
  }, [code, language]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Copied");
    } catch {
      setStatus("Select the code to copy manually.");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 4000);
  }
  const tokens = highlighted?.code === code ? highlighted.tokens : null;
  return (
    <section
      className={`docs-source ${terminal ? "docs-terminal" : "docs-editor"}`}
      aria-label={`${label} code panel`}
    >
      <div className="docs-editor-tabs">
        <span className="docs-file-tab">
          <span
            className={`docs-file-icon ${terminal ? "docs-shell-icon" : ""}`}
            aria-hidden="true"
          >
            {terminal
              ? ">_"
              : language === "json"
                ? "{}"
                : language === "css"
                  ? "#"
                  : "TS"}
          </span>
          {label}
        </span>
        <div className="docs-code-actions">
          <span role="status">{status}</span>
          <button
            className="docs-copy"
            onClick={copy}
            aria-label={`Copy ${label}`}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                d="M6 3V1.5h8.5V11H13M2 5h8.5v9.5H2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            {status === "Copied" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <pre tabIndex={0} aria-label={label}>
        <code>
          {code.split("\n").map((line, i) => (
            <span className="docs-code-line" key={i}>
              <span className="docs-line-number" aria-hidden="true">
                {terminal ? "$" : i + 1}
              </span>
              <span className="docs-line-content">
                {tokens?.[i]
                  ? tokens[i].map((token, j) => (
                      <span
                        key={j}
                        className="docs-token"
                        style={
                          {
                            "--code-dark": token.variants.dark.color,
                            "--code-light": token.variants.light.color,
                            fontStyle:
                              token.variants.dark.fontStyle === 1
                                ? "italic"
                                : undefined,
                          } as CSSProperties
                        }
                      >
                        {token.content}
                      </span>
                    ))
                  : line || " "}
              </span>
            </span>
          ))}
        </code>
      </pre>
      <div className="docs-editor-status">
        <span>
          {terminal
            ? "Shell"
            : language === "tsx"
              ? "TypeScript React"
              : language.toUpperCase()}
        </span>
        <span>
          UTF-8 <span aria-hidden="true">·</span>{" "}
          {terminal ? "npm" : "Spaces: 2"}
        </span>
      </div>
    </section>
  );
}
