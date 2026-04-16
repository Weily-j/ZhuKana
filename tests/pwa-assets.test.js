import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../style.css", import.meta.url), "utf8");
const appJs = await readFile(new URL("../app.js", import.meta.url), "utf8");
const swJs = await readFile(new URL("../sw.js", import.meta.url), "utf8");
const manifest = JSON.parse(
  await readFile(new URL("../manifest.json", import.meta.url), "utf8"),
);

test("index.html wires up the PWA shell and accessible controls", () => {
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /rel="manifest"/);
  assert.match(html, /id="text-display"/);
  assert.match(html, /id="candidate-rail"/);
  assert.match(html, /id="keyboard-grid"/);
  assert.match(html, /aria-label="複製輸出文字"/);
  assert.match(html, /aria-label="分享輸出文字"/);
  assert.match(html, /aria-label="長按清除所有文字"/);
  assert.match(html, /<script type="module" src="\.\/app\.js"><\/script>/);
});

test("manifest locks portrait mode with standalone chrome colors", () => {
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.orientation, "portrait");
  assert.equal(typeof manifest.name, "string");
  assert.equal(typeof manifest.short_name, "string");
  assert.equal(typeof manifest.theme_color, "string");
});

test("service worker caches all static assets for offline use", () => {
  assert.match(swJs, /index\.html/);
  assert.match(swJs, /style\.css/);
  assert.match(swJs, /app\.js/);
  assert.match(swJs, /data\/phonetic-map\.json/);
  assert.match(swJs, /data\/candidates\.json/);
  assert.match(appJs, /serviceWorker\.register/);
});

test("styles enforce safe-area, responsive layout, and candidate rail affordances", () => {
  assert.match(css, /100dvh/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /height:\s*44px/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /touch-action:\s*none/);
  assert.match(css, /orientation:\s*landscape/);
});
