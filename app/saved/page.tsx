import type { Metadata } from "next";
import { SavedList } from "@/components/saved/SavedList";

export const metadata: Metadata = { title: "Saved" };

export default function SavedPage() {
  return <SavedList />;
}
