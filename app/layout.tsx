import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalTicker } from "@/components/layout/GlobalTicker";
import { SearchDialogProvider } from "@/components/layout/SearchDialog";
import { SavedProvider } from "@/lib/saved";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "World Dashboard — Global perspective. Real time.",
    template: "%s · World Dashboard",
  },
  description:
    "A global intelligence and news command centre: world news, analytics, regions, topics and long-form insight reports in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${grotesk.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SavedProvider>
          <SearchDialogProvider>
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main id="main" className="min-w-0 flex-1 pb-14">
                {children}
              </main>
            </div>
            <GlobalTicker />
          </SearchDialogProvider>
        </SavedProvider>
      </body>
    </html>
  );
}
