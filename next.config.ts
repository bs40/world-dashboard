import type { NextConfig } from "next";

/**
 * Two build modes:
 *
 *  - Default (local dev / any Node host): full Next server. /api/news runs as a
 *    route handler and /news/[id] can server-render live stories.
 *
 *  - BUILD_STATIC=1 (Bunny.net deploy): `next build` emits a fully static site
 *    to /out. The /api/news route handler is excluded via pageExtensions
 *    (route.ts is the only .ts route file in /app), and the client fetches the
 *    Bunny Edge Script endpoint baked in via NEXT_PUBLIC_NEWS_ENDPOINT.
 *    trailingSlash makes every page a folder/index.html, which Bunny Storage
 *    serves natively for directory URLs.
 */
const isStatic = process.env.BUILD_STATIC === "1";

const nextConfig: NextConfig = {
  ...(isStatic
    ? {
        output: "export" as const,
        pageExtensions: ["tsx"],
      }
    : {}),
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
