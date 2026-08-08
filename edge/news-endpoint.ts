/**
 * Bunny Edge Script entry: serves the /api/news payload from Bunny's edge.
 *
 * Reuses the exact same ingestion code as the Next.js route handler
 * (lib/sources/*), bundled into a single file by scripts/build-edge.mjs.
 * Deployed as a standalone Edge Script with its own hostname; the static site
 * fetches it via NEXT_PUBLIC_NEWS_ENDPOINT baked in at build time.
 *
 * GUARDIAN_API_KEY is configured as an environment variable on the script in
 * Bunny — never in this code.
 */

// Deno doesn't define `process`; lib/sources/api.ts reads process.env at call
// time, so provide a bridge before any request handling.
declare const Deno:
  | { env: { toObject(): Record<string, string>; get(name: string): string | undefined } }
  | undefined;

const g = globalThis as { process?: { env: Record<string, string | undefined> } };
if (!g.process) {
  let env: Record<string, string | undefined> = {};
  try {
    if (typeof Deno !== "undefined") env = Deno.env.toObject();
  } catch {
    // Env access denied — Guardian adapter simply stays on RSS.
  }
  g.process = { env };
}

import * as BunnySDK from "@bunny.net/edgescript-sdk";
import { ingestAll, type IngestResult } from "../lib/sources";

/** Serve cached results for this long before re-hitting publisher feeds. */
const CACHE_TTL_MS = 240_000;

let cached: { at: number; result: IngestResult } | null = null;
let pending: Promise<IngestResult> | null = null;

async function getNews(): Promise<IngestResult> {
  const now = Date.now();
  if (cached && now - cached.at < CACHE_TTL_MS) return cached.result;
  // Collapse concurrent cold-cache requests into one upstream sweep.
  if (!pending) {
    pending = ingestAll()
      .then((result) => {
        cached = { at: Date.now(), result };
        return result;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

const CORS_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type",
};

BunnySDK.net.http.serve(async (request: Request): Promise<Response> => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  try {
    const { stories, statuses, fetchedAt } = await getNews();
    const live = statuses.filter((s) => s.ok).length;
    return new Response(
      JSON.stringify({
        ok: stories.length > 0,
        stories,
        fetchedAt,
        sources: { live, total: statuses.length },
        statuses,
      }),
      {
        headers: {
          ...CORS_HEADERS,
          "content-type": "application/json; charset=utf-8",
          "cache-control": "public, s-maxage=120, stale-while-revalidate=240",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        stories: [],
        fetchedAt: new Date().toISOString(),
        sources: { live: 0, total: 0 },
        statuses: [],
        error: error instanceof Error ? error.message : "Feed ingestion failed",
      }),
      { headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" } }
    );
  }
});
