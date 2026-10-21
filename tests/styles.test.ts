import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import postcss from 'postcss';
test('library stylesheet scopes every rule to calendar and bundles local font', () => {
  const stylesheet = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
  const css = postcss.parse(stylesheet);
  css.walkRules(rule => {
    assert(rule.selectors.every(selector => selector.startsWith('.bc-calendar')), `Unscoped selector: ${rule.selector}`);
  });
  assert(!stylesheet.includes('@import'));
  assert(stylesheet.includes('./fonts/geist.woff2'));
});
