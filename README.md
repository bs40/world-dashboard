# World Dashboard

A global intelligence and news command centre — world news, geopolitics, markets,
climate, health, regional intelligence, a conflict tracker and long-form insight
reports, presented in a restrained, cinematic dark interface.

> All content in this build is **clearly-marked demo/mock data**. The architecture
> is designed so live feeds and public datasets can be wired in without touching
> the UI layer.

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

## Source adapters — adding a live feed

Sources are declared in `data/sources.ts`:

```ts
{
  id: "global-wire",
  name: "Global Wire",
  region: "Worldwide",
  category: "wire",
  trustTier: "primary",
  rssUrl: "https://example.org/feed.xml",   // ← add this to go live
  enabled: true,
}
```

`lib/sources/index.ts` routes every enabled source through an adapter:

- `rssUrl` → `lib/sources/rss.ts` (fetch + XML parse, server-side, cached with `revalidate`)
- `apiUrl` → `lib/sources/api.ts` (official JSON APIs; keys via `process.env`)
- neither → the demo content in `data/news.ts` keeps the UI populated

Rules baked into the design: fetching happens **server-side only** (route handlers /
server components), keys live in **environment variables**, and only official APIs
or publisher-offered RSS feeds should be used — no scraping against terms of service.

## Public datasets

`lib/api/datasets.ts` declares provider configs for World Bank, IMF, UN, WHO, OECD,
Our World in Data, NASA, NOAA, USGS and Eurostat, and exposes
`fetchSeries(provider, indicator)` which currently returns deterministic mock series.
Implement the per-provider request/parse in that file; every consumer already goes
through this seam.

## Design system

Colour, typography, panel treatments, glows and animations are defined once in
`app/globals.css` (`@theme` block + utility classes `panel`, `label-caps`, `numeric`,
`edge-glow`, `skeleton`). Components never hard-code colours — semantic tones
(pos/warn/elev/sev/tech/env) communicate state alongside text labels, never colour
alone. Reduced-motion preferences are respected globally.
