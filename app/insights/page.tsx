import type { Metadata } from "next";
import { InsightsHub } from "@/components/reports/InsightsHub";

export const metadata: Metadata = { title: "Insights & Reports" };

export default function InsightsPage() {
  return <InsightsHub />;
}
