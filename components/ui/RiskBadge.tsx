import type { Severity } from "@/types";
import { StatusPill, type PillTone } from "./StatusPill";

const SEVERITY_TONE: Record<Severity, PillTone> = {
  low: "pos",
  moderate: "warn",
  high: "elev",
  extreme: "sev",
};

const SEVERITY_LABEL: Record<Severity, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  extreme: "Extreme",
};

export function RiskBadge({ severity, prefix }: { severity: Severity; prefix?: string }) {
  return (
    <StatusPill tone={SEVERITY_TONE[severity]}>
      {prefix ? `${prefix}: ` : ""}
      {SEVERITY_LABEL[severity]}
    </StatusPill>
  );
}
