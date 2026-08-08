import type { Metadata } from "next";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { demoSources, sources } from "@/data/sources";
import { guardianKey } from "@/lib/sources/api";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-4 p-4 lg:p-5">
      <h1 className="font-display text-xl font-semibold tracking-wide text-frost">SETTINGS</h1>

      <Panel>
        <SectionHeader title="Live sources" as="h2">
          <span className="label-caps-sm text-steel-dim">{sources.length} feeds</span>
        </SectionHeader>
        <p className="mb-3 text-xs leading-relaxed text-steel">
          Headlines, summaries and thumbnails are pulled from each publisher&apos;s own
          syndication feed, server-side, and always link back to the original article.
          Feeds are configured in{" "}
          <code className="rounded bg-panel2 px-1 py-0.5 text-cyanpale">/data/sources.ts</code>;
          adapters live in{" "}
          <code className="rounded bg-panel2 px-1 py-0.5 text-cyanpale">/lib/sources</code>.
        </p>
        <ul className="divide-y divide-edge-soft">
          {sources.map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-2.5">
              <span
                aria-hidden
                className={cn("h-1.5 w-1.5 rounded-full", s.enabled ? "bg-pos" : "bg-steel-dim")}
              />
              <span className="text-sm text-frost">{s.name}</span>
              <span className="label-caps-sm text-steel-dim">{s.region}</span>
              <span className="label-caps-sm ml-auto rounded-sm border border-edge px-1.5 py-0.5 text-steel">
                {s.trustTier}
              </span>
              <span className="label-caps-sm w-12 text-right text-steel-dim">
                {s.apiUrl && guardianKey() ? "API" : s.rssUrl ? "RSS" : "—"}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <SectionHeader title="Guardian Content API" as="h2">
          <span className={cn("label-caps-sm", guardianKey() ? "text-pos" : "text-warn")}>
            {guardianKey() ? "Key configured" : "Not configured"}
          </span>
        </SectionHeader>
        <p className="text-xs leading-relaxed text-steel">
          {guardianKey() ? (
            <>
              A Guardian Open Platform key is present, so the four Guardian sources use the
              Content API — richer summaries and larger images than their RSS feeds.
            </>
          ) : (
            <>
              Guardian content is currently coming from public RSS. To upgrade it, put a free
              Open Platform key in a{" "}
              <code className="rounded bg-panel2 px-1 py-0.5 text-cyanpale">.env.local</code> file
              as <code className="rounded bg-panel2 px-1 py-0.5 text-cyanpale">GUARDIAN_API_KEY</code>{" "}
              and restart the dev server. See{" "}
              <code className="rounded bg-panel2 px-1 py-0.5 text-cyanpale">.env.example</code>.
            </>
          )}
        </p>
      </Panel>

      <Panel>
        <SectionHeader title="Demo placeholders" as="h2" />
        <p className="mb-3 text-xs leading-relaxed text-steel">
          Fictional publishers used only by the bundled sample content that appears if every
          live feed is unreachable. They are never fetched, and demo stories are never
          attributed to a real newsroom.
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          {demoSources.map((s) => (
            <li key={s.id} className="label-caps-sm flex items-center gap-1.5 text-steel-dim">
              <span aria-hidden className="h-1 w-1 rounded-full bg-steel-dim" />
              {s.name}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <SectionHeader title="Data providers" as="h2" />
        <p className="text-xs leading-relaxed text-steel">
          Public dataset adapters (World Bank, IMF, UN, WHO, OECD, Our World in Data, NASA, NOAA,
          USGS, Eurostat) are prepared in{" "}
          <code className="rounded bg-panel2 px-1 py-0.5 text-cyanpale">/lib/api/datasets.ts</code>.
          Provider credentials are read from environment variables server-side and are never
          exposed to the browser.
        </p>
      </Panel>

      <Panel>
        <SectionHeader title="Appearance" as="h2" />
        <p className="text-xs leading-relaxed text-steel">
          World Dashboard ships with a single dark command-centre theme driven by CSS variables in{" "}
          <code className="rounded bg-panel2 px-1 py-0.5 text-cyanpale">app/globals.css</code>.
          Motion respects your system&apos;s reduced-motion preference.
        </p>
      </Panel>
    </div>
  );
}
