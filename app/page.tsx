"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Client-side redirect: server redirects aren't available in static export.
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/overview");
  }, [router]);

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Link href="/overview" className="label-caps text-cyan hover:text-cyanpale">
        Opening World Dashboard…
      </Link>
    </div>
  );
}
