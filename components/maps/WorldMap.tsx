"use client";

import { useMemo, useState } from "react";
import { INLAND_SEAS, LANDMASSES, project, toPath, WORLD_WINDOW } from "@/lib/geo";
import { cn } from "@/lib/utils";
import type { Category, MapMarker, Severity } from "@/types";

export const CATEGORY_COLORS: Record<Category, string> = {
  politics: "var(--color-cyan)",
  conflicts: "var(--color-sev)",
  economy: "var(--color-pos)",
  environment: "var(--color-env)",
  society: "var(--color-warn)",
  technology: "var(--color-tech)",
  health: "var(--color-sev)",
  science: "var(--color-tech)",
};

const SEVERITY_RADIUS: Record<Severity, number> = {
  low: 3,
  moderate: 4,
  high: 5,
  extreme: 6.5,
};

interface WorldMapProps {
  markers?: MapMarker[];
  /** Heat cells: intensity 1–5 rendered as soft radial glows. */
  heat?: { lat: number; lon: number; intensity: number; label?: string }[];
  window?: typeof WORLD_WINDOW;
  className?: string;
  grid?: boolean;
  interactive?: boolean;
  height?: string;
  ariaLabel?: string;
}

const VIEW_W = 1000;

/**
 * Reusable stylised world map. Renders simplified landmasses with a faint
 * lat/lon graticule; supports category markers (with floating info cards)
 * and heat overlays. Pure SVG — no tile server required.
 */
export function WorldMap({
  markers = [],
  heat = [],
  window: win = WORLD_WINDOW,
  className,
  grid = true,
  interactive = true,
  height,
  ariaLabel = "World map",
}: WorldMapProps) {
  const aspect = (win.latMax - win.latMin) / (win.lonMax - win.lonMin) * 1.55;
  const VIEW_H = Math.round(VIEW_W * aspect);
  const [active, setActive] = useState<string | null>(null);

  const landPaths = useMemo(
    () => LANDMASSES.map((poly) => toPath(poly, VIEW_W, VIEW_H, win)),
    [VIEW_H, win]
  );
  const seaPaths = useMemo(
    () => INLAND_SEAS.map((poly) => toPath(poly, VIEW_W, VIEW_H, win)),
    [VIEW_H, win]
  );

  const gridLines = useMemo(() => {
    if (!grid) return { v: [], h: [] };
    const v: number[] = [];
    const h: number[] = [];
    for (let lon = Math.ceil(win.lonMin / 30) * 30; lon <= win.lonMax; lon += 30)
      v.push(project(lon, 0, VIEW_W, VIEW_H, win).x);
    for (let lat = Math.ceil(win.latMin / 20) * 20; lat <= win.latMax; lat += 20)
      h.push(project(0, lat, VIEW_W, VIEW_H, win).y);
    return { v, h };
  }, [grid, VIEW_H, win]);

  const activeMarker = markers.find((m) => m.id === active);
  const activePos = activeMarker
    ? project(activeMarker.lon, activeMarker.lat, VIEW_W, VIEW_H, win)
    : null;

  return (
    <div className={cn("relative", className)} style={height ? { height } : undefined}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-full w-full"
        role="img"
        aria-label={ariaLabel}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Graticule */}
        {gridLines.v.map((x) => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={VIEW_H} stroke="var(--color-edge-soft)" strokeWidth={0.5} opacity={0.5} />
        ))}
        {gridLines.h.map((y) => (
          <line key={`h${y}`} x1={0} y1={y} x2={VIEW_W} y2={y} stroke="var(--color-edge-soft)" strokeWidth={0.5} opacity={0.5} />
        ))}

        {/* Landmasses */}
        {landPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="var(--color-panel2)"
            stroke="var(--color-edge)"
            strokeWidth={0.7}
            strokeLinejoin="round"
          />
        ))}
        {seaPaths.map((d, i) => (
          <path key={`sea${i}`} d={d} fill="var(--color-navy)" stroke="var(--color-edge-soft)" strokeWidth={0.5} />
        ))}

        {/* Heat overlay */}
        {heat.map((cell, i) => {
          const { x, y } = project(cell.lon, cell.lat, VIEW_W, VIEW_H, win);
          const color =
            cell.intensity >= 5
              ? "var(--color-sev)"
              : cell.intensity >= 4
                ? "var(--color-elev)"
                : cell.intensity >= 3
                  ? "var(--color-warn)"
                  : cell.intensity >= 2
                    ? "var(--color-warn)"
                    : "var(--color-pos)";
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={8 + cell.intensity * 5} fill={color} opacity={0.1} />
              <circle cx={x} cy={y} r={4 + cell.intensity * 2.4} fill={color} opacity={0.22} />
              <circle cx={x} cy={y} r={2.4} fill={color} opacity={0.9}>
                <title>{cell.label}</title>
              </circle>
            </g>
          );
        })}

        {/* Markers */}
        {markers.map((m) => {
          const { x, y } = project(m.lon, m.lat, VIEW_W, VIEW_H, win);
          const color = CATEGORY_COLORS[m.category];
          const r = SEVERITY_RADIUS[m.severity ?? "moderate"];
          const isActive = active === m.id;
          return (
            <g
              key={m.id}
              tabIndex={interactive ? 0 : -1}
              role={interactive ? "button" : undefined}
              aria-label={`${m.label}: ${m.detail ?? m.category}`}
              onMouseEnter={() => interactive && setActive(m.id)}
              onMouseLeave={() => interactive && setActive(null)}
              onFocus={() => interactive && setActive(m.id)}
              onBlur={() => interactive && setActive(null)}
              className={interactive ? "cursor-pointer outline-none" : undefined}
            >
              <circle cx={x} cy={y} r={r + 6} fill={color} opacity={isActive ? 0.25 : 0.12} className="transition-opacity" />
              <circle cx={x} cy={y} r={r} fill={color} opacity={0.9} stroke="var(--color-ink)" strokeWidth={1} />
              {(m.severity === "extreme" || m.severity === "high") && (
                <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={1} className="animate-ping-slow" style={{ transformOrigin: `${x}px ${y}px` }} />
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating info card */}
      {activeMarker && activePos && (
        <div
          className="panel pointer-events-none absolute z-10 w-48 -translate-x-1/2 border-edge px-3 py-2 shadow-glow"
          style={{
            left: `${(activePos.x / VIEW_W) * 100}%`,
            top: `calc(${(activePos.y / VIEW_H) * 100}% - 8px)`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: CATEGORY_COLORS[activeMarker.category] }}
            />
            <span className="label-caps-sm text-steel">{activeMarker.label}</span>
          </div>
          {activeMarker.detail && <p className="mt-1 text-xs leading-snug text-frost">{activeMarker.detail}</p>}
          {activeMarker.agoLabel && <p className="label-caps-sm mt-1 text-steel-dim">{activeMarker.agoLabel}</p>}
        </div>
      )}
    </div>
  );
}
