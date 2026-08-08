import type { Metadata } from "next";
import { NewsRoom } from "@/components/news/NewsRoom";

export const metadata: Metadata = { title: "News" };

export default function NewsPage() {
  return <NewsRoom />;
}
