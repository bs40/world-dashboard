import { NextResponse } from "next/server";
import { ingestAll } from "@/lib/sources";
import { resolveLiveTv } from "@/lib/sources/livetv";

/**
 * Live news endpoint.
 *
 * The browser polls this on the user's chosen interval; feed fetching itself
 * happens here on the server, which keeps publisher requests off the client
 * (no CORS dependency) and lets Next cache each upstream feed for a few
 * minutes regardless of how many browsers are connected.
 */

// Aggregation is cheap but the upstream fetches are cached per-feed in rss.ts.
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [{ stories, statuses, fetchedAt }, liveTv] = await Promise.all([
      ingestAll(),
      resolveLiveTv(),
    ]);
    const live = statuses.filter((s) => s.ok).length;

    return NextResponse.json(
      {
        ok: stories.length > 0,
        stories,
        fetchedAt,
        sources: { live, total: statuses.length },
        statuses,
        liveTv,
      },
      {
        headers: {
          // Allow a brief shared cache window, then serve stale while revalidating.
          "cache-control": "public, s-maxage=120, stale-while-revalidate=240",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        stories: [],
        fetchedAt: new Date().toISOString(),
        sources: { live: 0, total: 0 },
        statuses: [],
        error: error instanceof Error ? error.message : "Feed ingestion failed",
      },
      { status: 200 } // the client falls back to demo data; not a hard error
    );
  }
}
