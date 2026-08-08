// Bundles edge/news-endpoint.ts (including the Bunny SDK) into a single
// self-contained file for Bunny Edge Scripting's Deno runtime.
import { build } from "esbuild";
import { mkdirSync, statSync } from "node:fs";

const OUT_DIR = "edge/dist";
const OUT_FILE = `${OUT_DIR}/news-endpoint.js`;

mkdirSync(OUT_DIR, { recursive: true });

await build({
  entryPoints: ["edge/news-endpoint.ts"],
  outfile: OUT_FILE,
  bundle: true,
  format: "esm",
  platform: "browser",
  mainFields: ["module", "main"],
  target: "es2022",
  alias: { "@": "." },
  legalComments: "none",
});

console.log(`bundled ${OUT_FILE} (${(statSync(OUT_FILE).size / 1024).toFixed(1)} KB)`);
