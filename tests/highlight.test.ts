import test from "node:test";
import assert from "node:assert/strict";
import { highlightCode } from "../src/docs/highlight";
import { detectLanguage } from "../src/docs/code-language";
test("VS Code highlighting preserves TSX including custom event text in both themes", async () => {
  const code =
    'const title = "<script>plain event text</script>";\nexport default () => <span>{title}</span>;';
  const lines = await highlightCode(code, "tsx");
  assert.equal(
    lines.map((line) => line.map((t) => t.content).join("")).join("\n"),
    code,
  );
  const dark = new Set(lines.flat().map((t) => t.variants.dark.color));
  assert.ok(dark.size > 2);
  assert.ok(lines.flat().every((t) => t.variants.light.color));
});
test("install commands use shell grammar and preserve the exact command", async () => {
  const code = "npm install @qentrah/react-calendar";
  assert.equal(detectLanguage(code, "Install from npm"), "shellscript");
  const lines = await highlightCode(code, "shellscript");
  assert.equal(lines[0].map((t) => t.content).join(""), code);
});
