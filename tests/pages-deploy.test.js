import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const workflow = await readFile(
  new URL("../.github/workflows/deploy-pages.yml", import.meta.url),
  "utf8",
);
const { buildPages } = await import("../scripts/build-pages.mjs");

test("package exposes a GitHub Pages build script", () => {
  assert.equal(packageJson.scripts["build:pages"], "node ./scripts/build-pages.mjs");
});

test("workflow deploys the built static artifact to GitHub Pages", () => {
  assert.match(workflow, /actions\/configure-pages@/);
  assert.match(workflow, /actions\/upload-pages-artifact@/);
  assert.match(workflow, /actions\/deploy-pages@/);
  assert.match(workflow, /npm run build:pages/);
});

test("buildPages creates a clean dist directory with only public assets", async () => {
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), "zhuyin-pages-"));
  const outputDir = path.join(outputRoot, "dist");

  try {
    await buildPages(outputDir);

    const entries = (await readdir(outputDir)).sort();
    assert.deepEqual(entries, [
      ".nojekyll",
      "app.js",
      "data",
      "icons",
      "index.html",
      "lib",
      "manifest.json",
      "style.css",
      "sw.js",
    ]);

    const manifestStat = await stat(path.join(outputDir, "manifest.json"));
    const indexStat = await stat(path.join(outputDir, "index.html"));
    const iconStat = await stat(path.join(outputDir, "icons", "app-icon-512.png"));

    assert.ok(manifestStat.isFile());
    assert.ok(indexStat.isFile());
    assert.ok(iconStat.size > 0);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
