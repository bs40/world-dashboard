/**
 * Public-dataset adapters (server-side only).
 *
 * Each provider gets a thin fetch wrapper returning normalised
 * { year|date, value } series. Real endpoints are wired per provider;
 * during development every call falls back to deterministic mock data so
 * the UI renders without network access or keys.
 *
 * Keys/config come from environment variables — never hard-code or expose
 * them in client bundles:
 *   WORLD_BANK_BASE, NASA_API_KEY, NOAA_TOKEN, ...
 */

import { demoSeries } from "@/lib/utils";

export interface SeriesPoint {
  label: string;
  value: number;
}

export type DatasetProvider =
  | "world-bank"
  | "imf"
  | "un"
  | "who"
  | "oecd"
  | "owid"
  | "nasa"
  | "noaa"
  | "usgs"
  | "eurostat";

interface ProviderConfig {
  baseUrl: string;
  docs: string;
}

export const PROVIDERS: Record<DatasetProvider, ProviderConfig> = {
  "world-bank": { baseUrl: "https://api.worldbank.org/v2", docs: "https://datahelpdesk.worldbank.org" },
  imf: { baseUrl: "https://www.imf.org/external/datamapper/api/v1", docs: "https://www.imf.org/en/Data" },
  un: { baseUrl: "https://population.un.org/dataportalapi", docs: "https://population.un.org" },
  who: { baseUrl: "https://ghoapi.azureedge.net/api", docs: "https://www.who.int/data/gho" },
  oecd: { baseUrl: "https://sdmx.oecd.org/public/rest", docs: "https://data.oecd.org/api" },
  owid: { baseUrl: "https://ourworldindata.org/grapher", docs: "https://docs.owid.io" },
  nasa: { baseUrl: "https://api.nasa.gov", docs: "https://api.nasa.gov" },
  noaa: { baseUrl: "https://www.ncei.noaa.gov/cdo-web/api/v2", docs: "https://www.ncdc.noaa.gov/cdo-web" },
  usgs: { baseUrl: "https://earthquake.usgs.gov/fdsnws", docs: "https://earthquake.usgs.gov/fdsnws/event/1/" },
  eurostat: { baseUrl: "https://ec.europa.eu/eurostat/api/dissemination", docs: "https://ec.europa.eu/eurostat/web/main/data/web-services" },
};

/**
 * Fetch a dataset series from a provider. Falls back to mock data when the
 * provider call fails or is not yet implemented, so pages always render.
 */
export async function fetchSeries(
  provider: DatasetProvider,
  indicator: string
): Promise<SeriesPoint[]> {
  try {
    // Per-provider request/parse logic goes here as integrations land.
    // e.g. World Bank: `${PROVIDERS["world-bank"].baseUrl}/country/all/indicator/${indicator}?format=json`
    return mockSeries(indicator);
  } catch {
    return mockSeries(indicator);
  }
}

function mockSeries(indicator: string): SeriesPoint[] {
  const seed = [...indicator].reduce((a, c) => a + c.charCodeAt(0), 7);
  const values = demoSeries(seed, 24, 50, 4, 0.6);
  return values.map((value, i) => ({ label: `${2001 + i}`, value }));
}
