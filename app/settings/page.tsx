import type { Metadata } from "next";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sources } from "@/data/sources";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-4 p-4 lg:p-5">
      <h1 className="font-display text-xl font-semibold tracking-wide text-frost">SETTINGS</h1>

      <Panel>
        <SectionHeader title="Configured sources" as="h2" />
        <p className="mb-3 text-xs leading-relaxed text-steel">
          Sources are defined in <code className="rounded bg-panel2 px-1 py-0.5 text-cyanpale">/data/sources.ts</code>.
          Add an RSS or API endpoint to a source to switch it from demo content to live ingestion —
          adapters live in <code className="rounded bg-panel2 px-1 py-0.5 text-cyanpale">/lib/sources</code>.
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
              <span className="label-caps-sm w-14 text-right text-steel-dim">
                {s.rssUrl || s.apiUrl ? "Live" : "Demo"}
              </span>
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
