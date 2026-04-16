import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const defaultOutputDir = path.join(projectRoot, "dist");

const publicEntries = [
  "app.js",
  "data",
  "icons",
  "index.html",
  "lib",
  "manifest.json",
  "style.css",
  "sw.js",
];

export async function buildPages(outputDir = defaultOutputDir) {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  for (const entry of publicEntries) {
    await cp(path.join(projectRoot, entry), path.join(outputDir, entry), {
      recursive: true,
    });
  }

  await writeFile(path.join(outputDir, ".nojekyll"), "", "utf8");
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  await buildPages();
  console.log(`Built GitHub Pages artifact at ${defaultOutputDir}`);
}
