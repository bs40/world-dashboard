# World Dashboard

A global intelligence and news command centre — world news, geopolitics, markets,
climate, health, regional intelligence, a conflict tracker and long-form insight
reports, presented in a restrained, cinematic dark interface.

**News is live.** Headlines, summaries and photos are ingested server-side from
16 publisher syndication feeds (BBC, The Guardian, Al Jazeera, France 24,
Deutsche Welle, NPR, CBC, UN News, ScienceDaily), deduplicated across
publishers, auto-categorised, geocoded onto the world map, and refreshed on a
user-selected 5/15/30/60-minute cadence (picker in the header; the choice
persists in localStorage). Every story links back to the original article — the
dashboard shows only what each publisher offers for syndication, always with
attribution. If every feed is unreachable, the app falls back to clearly-marked
demo content attributed to fictional placeholder outlets.

Analytics, regions, topics and reports still use **clearly-marked demo data**;
their adapters in `lib/api/datasets.ts` are the seam for wiring real datasets.

## Quick start — how to run it

Requires **Node.js 20+** (built and tested on Node 24) and npm.

```bash
git clone https://github.com/bs40/world-dashboard.git
cd world-dashboard
npm install
npm run dev
```

Then open **http://localhost:3000** — it redirects to `/overview`.

The dev server keeps running in that terminal until you press **Ctrl+C**. If you
already have the project locally, starting it is just `npm run dev` from the
project folder.

### All commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload on http://localhost:3000 |
| `npm run build` | Production build (prerenders every route as static HTML) |
| `npm run start` | Serve the production build — faster than dev; run `npm run build` first |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | TypeScript type check |

**Port already in use?** Run `npm run dev -- -p 3001` to use a different port.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** — the whole visual theme is CSS variables in `app/globals.css`
- **Recharts** for time series / donut charts, plus hand-rolled SVG sparklines and bar rankings
- **Custom SVG cartography** (`lib/geo.ts` + `components/maps/WorldMap.tsx`) — a stylised
  low-poly world map with graticule, category markers, floating info cards and heat
  overlays. No tile server or API key required; it can be swapped for MapLibre GL later
  behind the same `WorldMap` props.
- **Framer Motion** only for the search-dialog transition
- **Lucide** icons · Inter / Space Grotesk / IBM Plex Mono via `next/font`

## Routes

| Route | Purpose |
|---|---|
| `/overview` | Global dashboard: top stories, markets, world map with category filters, planet metrics, live feed, conflicts overview, trending topics, regional focus, data insights, global ticker |
| `/news` | Newsroom: filterable top stories, hero story, live updates, news map, media sources |
| `/analytics` | Global risk/economy metric cards, sentiment series, top risks, risk heat map, market overview, energy mix, trade flow, tech adoption |
| `/regions` | Regional intelligence with region selector (`?region=europe`), key indicators, headlines, stats |
| `/topics` | Topic explorer (`?topic=climate-change`), follow button, temperature anomaly chart, affected regions |
| `/topics/conflicts` | Conflict tracker: active conflicts, intensity map, global impact, developments |
| `/insights` | Featured Weekly Outlook, key takeaways, data explorer, recent reports, insight feed |
| `/saved` | Bookmarked stories/reports/topics/regions (persisted in `localStorage`) |
| `/settings` | Source + provider configuration overview |

`Ctrl/Cmd + K` opens universal search (countries, regions, topics, stories, reports, datasets).

## Architecture

```
app/                  Routes (server components; metadata) — thin wrappers
components/
  layout/             Header, Sidebar, ClockUTC, GlobalTicker, SearchDialog
  ui/                 Panel, MetricCard, FilterTabs, StatusPill, RiskBadge,
                      TrendIndicator, SourceBadge, DataRow, SaveButton, …
  charts/             Sparkline, TimeSeriesChart, BarRanking, DonutChart, AnomalyBars
  maps/               WorldMap (stylised SVG cartography)
  news/ overview/ regions/ topics/ reports/ saved/   page-level compositions
data/                 All mock content (news, markets, regions, topics, conflicts,
                      reports, metrics, sources, search index) — no data in JSX
lib/
  geo.ts              Landmass outlines + equirectangular projection
  saved.tsx           Saved-items context (localStorage)
  sources/            Source ingestion adapters (RSS / API)
  api/datasets.ts     Public-dataset adapters (World Bank, IMF, UN, WHO, …)
types/                Shared domain types
public/images/        Procedural SVG editorial imagery (no copyrighted photos)
```

## Live news pipeline

```
publisher feeds ──► lib/sources/rss.ts    (RSS/RDF/Atom parse, image + date extraction)
                    lib/sources/api.ts    (Guardian Content API when a key is set)
                          │
                    lib/sources/index.ts  (fan-out, cross-publisher dedupe,
                          │                "N sources reporting" counts)
                    app/api/news/route.ts (JSON endpoint; upstream cached ~4 min)
                          │
                    lib/feed.tsx          (client store: polls on the sticky
                          │                5/15/30/60-min interval from lib/prefs.ts)
                    Overview · News · ticker · /news/[id]
```

- Sources are declared in `data/sources.ts` — add an entry with an `rssUrl` to add
  a publisher; set `enabled: false` to silence one.
- Category is inferred from headline keywords (`lib/sources/rss.ts`); map placement
  from a gazetteer of ~130 places (`lib/geocode.ts`), labelled as inferred.
- Live article pages show the publisher's own headline, summary and image with a
  prominent link to the full story — full text is never reproduced. Demo articles
  (fictional outlets) keep their generated body copy and are labelled as demo.
- Fetching is **server-side only**; each upstream feed response is cached ~4 minutes
  via `next: { revalidate }`, so many browsers don't multiply publisher load.

### Guardian Content API (optional)

Copy `.env.example` to `.env.local` and set `GUARDIAN_API_KEY` (free key from
[open-platform.theguardian.com](https://open-platform.theguardian.com/access/)).
The four Guardian sources then switch from RSS to the Content API — richer
summaries and larger images. Keys are read server-side only and never committed;
`.env.local` is gitignored.

## Public datasets

`lib/api/datasets.ts` declares provider configs for World Bank, IMF, UN, WHO, OECD,
Our World in Data, NASA, NOAA, USGS and Eurostat, and exposes
`fetchSeries(provider, indicator)` which currently returns deterministic mock series.
Implement the per-provider request/parse in that file; every consumer already goes
through this seam.

## Deployment (Bunny.net)

The production site runs entirely on Bunny.net:

- **Site**: static export (`BUILD_STATIC=1 next build` → `/out`) on the
  `world-dashboard` Storage Zone behind the `world-dashboard` Pull Zone —
  https://world-dashboard.b-cdn.net
- **Feed endpoint**: the same ingestion code bundled as a Bunny Edge Script
  (`edge/news-endpoint.ts` → `scripts/build-edge.mjs`), published as
  `world-dashboard-news` and reached through its own pull zone —
  https://world-dashboard-news.b-cdn.net — with `GUARDIAN_API_KEY` stored as a
  script environment variable and a 4-minute in-memory cache in front of the
  publisher feeds.

Deploys are one command (idempotent — zones and the script are created only if
missing):

```bash
node scripts/deploy-bunny.mjs all
```

`probe` inspects the account read-only; `script` and `site <endpoint-url>` run
the two halves separately. Credentials come from `.env.deploy`
(`BUNNY_API_KEY=…`, gitignored); the Guardian key is read from `.env.local` and
pushed to the script's environment, never committed.

To attach **world.bs40.com** later: add it as a custom hostname on the
`world-dashboard` pull zone (with free SSL) and point the domain's CNAME at
`world-dashboard.b-cdn.net`. No rebuild needed.

## Design system

Colour, typography, panel treatments, glows and animations are defined once in
`app/globals.css` (`@theme` block + utility classes `panel`, `label-caps`, `numeric`,
`edge-glow`, `skeleton`). Components never hard-code colours — semantic tones
(pos/warn/elev/sev/tech/env) communicate state alongside text labels, never colour
alone. Reduced-motion preferences are respected globally.
