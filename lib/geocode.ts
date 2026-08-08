/**
 * Lightweight gazetteer for placing live headlines on the world map.
 *
 * RSS feeds carry no coordinates, so location is inferred by matching place
 * names in the headline and summary. Entries are matched longest-first so
 * "South Korea" wins over "Korea" and "New York" over "York". This is a
 * best-effort hint for map display, not authoritative geocoding — stories
 * with no confident match simply carry no marker.
 */

/** Dashboard region ids, matching /data/regions.ts. */
export type RegionId = "europe" | "americas" | "asia" | "africa" | "oceania";

export interface Place {
  name: string;
  lat: number;
  lon: number;
  /** Extra spellings/demonyms that should resolve to this place. */
  aliases?: string[];
  region?: RegionId;
}

/**
 * Region assignment by longitude/latitude band, used for any place that
 * doesn't state its region explicitly. Deliberately coarse — this drives
 * "which regional tab does this headline belong under", not cartography.
 */
function regionFromCoords(lat: number, lon: number): RegionId {
  if (lon >= 110 && lat < 0) return "oceania";
  if (lon >= -30 && lon <= 60 && lat < 38) return "africa";
  if (lon >= 40) return "asia";
  if (lon < -25) return "americas";
  return "europe";
}

const PLACES: Place[] = [
  // Europe
  { name: "Ukraine", lat: 50.45, lon: 30.52, aliases: ["Ukrainian", "Kyiv", "Kiev", "Kharkiv", "Odesa", "Dnipro"] },
  { name: "Russia", lat: 55.75, lon: 37.62, aliases: ["Russian", "Moscow", "Kremlin", "St Petersburg"] },
  { name: "United Kingdom", lat: 51.51, lon: -0.13, aliases: ["Britain", "British", "London", "England", "Scotland", "Wales", "UK"] },
  { name: "Ireland", lat: 53.35, lon: -6.26, aliases: ["Irish", "Dublin"] },
  { name: "France", lat: 48.86, lon: 2.35, aliases: ["French", "Paris", "Marseille"] },
  { name: "Germany", lat: 52.52, lon: 13.4, aliases: ["German", "Berlin", "Munich"] },
  { name: "Spain", lat: 40.42, lon: -3.7, aliases: ["Spanish", "Madrid", "Barcelona", "Catalonia"] },
  { name: "Portugal", lat: 38.72, lon: -9.14, aliases: ["Portuguese", "Lisbon"] },
  { name: "Italy", lat: 41.9, lon: 12.5, aliases: ["Italian", "Rome", "Milan"] },
  { name: "Greece", lat: 37.98, lon: 23.73, aliases: ["Greek", "Athens"] },
  { name: "Netherlands", lat: 52.37, lon: 4.9, aliases: ["Dutch", "Amsterdam", "The Hague"] },
  { name: "Belgium", lat: 50.85, lon: 4.35, aliases: ["Belgian", "Brussels"] },
  { name: "Switzerland", lat: 46.95, lon: 7.45, aliases: ["Swiss", "Geneva", "Zurich", "Davos"] },
  { name: "Austria", lat: 48.21, lon: 16.37, aliases: ["Austrian", "Vienna"] },
  { name: "Poland", lat: 52.23, lon: 21.01, aliases: ["Polish", "Warsaw"] },
  { name: "Sweden", lat: 59.33, lon: 18.07, aliases: ["Swedish", "Stockholm"] },
  { name: "Norway", lat: 59.91, lon: 10.75, aliases: ["Norwegian", "Oslo"] },
  { name: "Denmark", lat: 55.68, lon: 12.57, aliases: ["Danish", "Copenhagen"] },
  { name: "Finland", lat: 60.17, lon: 24.94, aliases: ["Finnish", "Helsinki"] },
  { name: "Hungary", lat: 47.5, lon: 19.04, aliases: ["Hungarian", "Budapest"] },
  { name: "Romania", lat: 44.43, lon: 26.1, aliases: ["Romanian", "Bucharest"] },
  { name: "Serbia", lat: 44.79, lon: 20.45, aliases: ["Serbian", "Belgrade"] },
  { name: "Croatia", lat: 45.81, lon: 15.98, aliases: ["Croatian", "Zagreb"] },
  { name: "Czech Republic", lat: 50.08, lon: 14.44, aliases: ["Czech", "Prague"] },
  { name: "Belarus", lat: 53.9, lon: 27.57, aliases: ["Belarusian", "Minsk"] },
  { name: "Iceland", lat: 64.15, lon: -21.94, aliases: ["Reykjavik"] },
  { name: "European Union", lat: 50.85, lon: 4.35, aliases: ["EU", "Brussels summit"] },

  // Middle East & North Africa.
  // The Middle East sits inside the coordinate band that otherwise resolves
  // to Africa, so these carry an explicit region.
  { name: "Israel", lat: 31.78, lon: 35.22, aliases: ["Israeli", "Jerusalem", "Tel Aviv"], region: "asia" },
  { name: "Gaza", lat: 31.5, lon: 34.47, aliases: ["Palestinian", "Palestine", "Rafah", "Khan Younis", "West Bank"], region: "asia" },
  { name: "Lebanon", lat: 33.89, lon: 35.5, aliases: ["Lebanese", "Beirut", "Hezbollah"], region: "asia" },
  { name: "Syria", lat: 33.51, lon: 36.29, aliases: ["Syrian", "Damascus", "Aleppo"], region: "asia" },
  { name: "Iran", lat: 35.69, lon: 51.39, aliases: ["Iranian", "Tehran"], region: "asia" },
  { name: "Iraq", lat: 33.31, lon: 44.36, aliases: ["Iraqi", "Baghdad"], region: "asia" },
  { name: "Turkey", lat: 39.93, lon: 32.86, aliases: ["Turkish", "Ankara", "Istanbul", "Türkiye"], region: "asia" },
  { name: "Saudi Arabia", lat: 24.71, lon: 46.68, aliases: ["Saudi", "Riyadh"], region: "asia" },
  { name: "United Arab Emirates", lat: 25.2, lon: 55.27, aliases: ["UAE", "Dubai", "Abu Dhabi"], region: "asia" },
  { name: "Qatar", lat: 25.29, lon: 51.53, aliases: ["Qatari", "Doha"], region: "asia" },
  { name: "Oman", lat: 23.59, lon: 58.41, aliases: ["Muscat", "Hormuz"], region: "asia" },
  { name: "Yemen", lat: 15.35, lon: 44.21, aliases: ["Yemeni", "Sanaa", "Houthi", "Houthis"], region: "asia" },
  { name: "Egypt", lat: 30.04, lon: 31.24, aliases: ["Egyptian", "Cairo"], region: "africa" },
  { name: "Libya", lat: 32.89, lon: 13.19, aliases: ["Libyan", "Tripoli"] },
  { name: "Tunisia", lat: 36.81, lon: 10.18, aliases: ["Tunisian", "Tunis"] },
  { name: "Algeria", lat: 36.75, lon: 3.06, aliases: ["Algerian", "Algiers"] },
  { name: "Morocco", lat: 33.97, lon: -6.85, aliases: ["Moroccan", "Rabat", "Casablanca", "Ceuta"] },
  { name: "Jordan", lat: 31.95, lon: 35.93, aliases: ["Jordanian", "Amman"], region: "asia" },
  { name: "Afghanistan", lat: 34.53, lon: 69.17, aliases: ["Afghan", "Kabul", "Taliban"], region: "asia" },

  // Africa
  { name: "Nigeria", lat: 9.06, lon: 7.49, aliases: ["Nigerian", "Abuja", "Lagos"] },
  { name: "Kenya", lat: -1.29, lon: 36.82, aliases: ["Kenyan", "Nairobi"] },
  { name: "Ethiopia", lat: 9.03, lon: 38.74, aliases: ["Ethiopian", "Addis Ababa", "Tigray"] },
  { name: "Sudan", lat: 15.5, lon: 32.56, aliases: ["Sudanese", "Khartoum", "Darfur", "El Fasher"] },
  { name: "South Sudan", lat: 4.85, lon: 31.58, aliases: ["Juba"] },
  { name: "Somalia", lat: 2.05, lon: 45.32, aliases: ["Somali", "Mogadishu"] },
  { name: "South Africa", lat: -26.2, lon: 28.05, aliases: ["Johannesburg", "Cape Town", "Pretoria"] },
  { name: "Democratic Republic of the Congo", lat: -4.32, lon: 15.31, aliases: ["DRC", "Congo", "Kinshasa", "Goma"] },
  { name: "Ghana", lat: 5.6, lon: -0.19, aliases: ["Ghanaian", "Accra"] },
  { name: "Uganda", lat: 0.35, lon: 32.58, aliases: ["Ugandan", "Kampala"] },
  { name: "Tanzania", lat: -6.79, lon: 39.21, aliases: ["Tanzanian", "Dar es Salaam"] },
  { name: "Zimbabwe", lat: -17.83, lon: 31.05, aliases: ["Harare"] },
  { name: "Mali", lat: 12.64, lon: -8.0, aliases: ["Malian", "Bamako"] },
  { name: "Niger", lat: 13.51, lon: 2.13, aliases: ["Niamey"] },
  { name: "Burkina Faso", lat: 12.37, lon: -1.52, aliases: ["Ouagadougou"] },
  { name: "Senegal", lat: 14.72, lon: -17.47, aliases: ["Dakar"] },
  { name: "Mozambique", lat: -25.97, lon: 32.58, aliases: ["Maputo"] },
  { name: "Rwanda", lat: -1.95, lon: 30.06, aliases: ["Kigali"] },
  { name: "Sahel", lat: 15.0, lon: 0.0 },

  // Asia
  { name: "China", lat: 39.9, lon: 116.4, aliases: ["Chinese", "Beijing", "Shanghai", "Hong Kong"] },
  { name: "Taiwan", lat: 25.03, lon: 121.57, aliases: ["Taiwanese", "Taipei"] },
  { name: "Japan", lat: 35.68, lon: 139.69, aliases: ["Japanese", "Tokyo"] },
  { name: "South Korea", lat: 37.57, lon: 126.98, aliases: ["Seoul"] },
  { name: "North Korea", lat: 39.04, lon: 125.76, aliases: ["Pyongyang"] },
  { name: "India", lat: 28.61, lon: 77.21, aliases: ["Indian", "Delhi", "New Delhi", "Mumbai"] },
  { name: "Pakistan", lat: 33.68, lon: 73.05, aliases: ["Pakistani", "Islamabad", "Karachi"] },
  { name: "Bangladesh", lat: 23.81, lon: 90.41, aliases: ["Dhaka"] },
  { name: "Sri Lanka", lat: 6.93, lon: 79.86, aliases: ["Colombo"] },
  { name: "Nepal", lat: 27.72, lon: 85.32, aliases: ["Kathmandu"] },
  { name: "Myanmar", lat: 16.87, lon: 96.2, aliases: ["Burma", "Yangon"] },
  { name: "Thailand", lat: 13.76, lon: 100.5, aliases: ["Thai", "Bangkok"] },
  { name: "Vietnam", lat: 21.03, lon: 105.85, aliases: ["Vietnamese", "Hanoi"] },
  { name: "Philippines", lat: 14.6, lon: 120.98, aliases: ["Filipino", "Manila"] },
  { name: "Indonesia", lat: -6.21, lon: 106.85, aliases: ["Indonesian", "Jakarta"] },
  { name: "Malaysia", lat: 3.14, lon: 101.69, aliases: ["Malaysian", "Kuala Lumpur"] },
  { name: "Singapore", lat: 1.35, lon: 103.82 },
  { name: "Cambodia", lat: 11.56, lon: 104.92, aliases: ["Phnom Penh"] },
  { name: "Kazakhstan", lat: 51.17, lon: 71.43, aliases: ["Astana"] },

  // Americas
  { name: "United States", lat: 38.9, lon: -77.04, aliases: ["US", "USA", "American", "Washington", "White House", "Trump", "Congress"] },
  { name: "New York", lat: 40.71, lon: -74.01, aliases: ["Manhattan", "Wall Street"] },
  { name: "California", lat: 34.05, lon: -118.24, aliases: ["Los Angeles", "San Francisco", "Silicon Valley"] },
  { name: "Texas", lat: 30.27, lon: -97.74, aliases: ["Houston", "Dallas", "Austin"] },
  { name: "Florida", lat: 25.76, lon: -80.19, aliases: ["Miami"] },
  { name: "Canada", lat: 45.42, lon: -75.7, aliases: ["Canadian", "Ottawa", "Toronto", "Vancouver"] },
  { name: "Mexico", lat: 19.43, lon: -99.13, aliases: ["Mexican", "Mexico City"] },
  { name: "Brazil", lat: -15.79, lon: -47.88, aliases: ["Brazilian", "Brasilia", "Rio de Janeiro", "Sao Paulo", "Amazon rainforest"] },
  { name: "Argentina", lat: -34.6, lon: -58.38, aliases: ["Argentine", "Buenos Aires"] },
  { name: "Chile", lat: -33.45, lon: -70.67, aliases: ["Chilean", "Santiago"] },
  { name: "Colombia", lat: 4.71, lon: -74.07, aliases: ["Colombian", "Bogota"] },
  { name: "Venezuela", lat: 10.48, lon: -66.9, aliases: ["Venezuelan", "Caracas"] },
  { name: "Peru", lat: -12.05, lon: -77.04, aliases: ["Peruvian", "Lima"] },
  { name: "Bolivia", lat: -16.5, lon: -68.15, aliases: ["La Paz"] },
  { name: "Ecuador", lat: -0.18, lon: -78.47, aliases: ["Quito"] },
  { name: "Cuba", lat: 23.11, lon: -82.37, aliases: ["Cuban", "Havana"] },
  { name: "Haiti", lat: 18.59, lon: -72.31, aliases: ["Haitian", "Port-au-Prince"] },

  // Oceania & poles
  { name: "Australia", lat: -33.87, lon: 151.21, aliases: ["Australian", "Sydney", "Melbourne", "Canberra"] },
  { name: "New Zealand", lat: -41.29, lon: 174.78, aliases: ["Wellington", "Auckland"] },
  { name: "Fiji", lat: -18.12, lon: 178.44, aliases: ["Suva"] },
  { name: "Papua New Guinea", lat: -9.44, lon: 147.18, aliases: ["Port Moresby"] },
  { name: "Antarctica", lat: -75.0, lon: 0.0, aliases: ["Antarctic"], region: "oceania" },
  { name: "Arctic", lat: 78.0, lon: 15.0, aliases: ["Greenland", "Svalbard"], region: "europe" },
];

// Pre-build a longest-first list of (needle, place) pairs so specific names win.
const NEEDLES: { needle: string; place: Place }[] = PLACES.flatMap((place) => [
  { needle: place.name.toLowerCase(), place },
  ...(place.aliases ?? []).map((a) => ({ needle: a.toLowerCase(), place })),
]).sort((a, b) => b.needle.length - a.needle.length);

/** Escape a needle and match it only on word boundaries. */
function mentions(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "i").test(haystack);
}

export function geocodeText(
  text: string
): { lat: number; lon: number; label: string; region: RegionId } | undefined {
  const hay = text.toLowerCase();
  let best: { place: Place; index: number; length: number } | undefined;

  for (const { needle, place } of NEEDLES) {
    if (!mentions(hay, needle)) continue;
    const index = hay.indexOf(needle);
    if (index === -1) continue;
    // Whichever place is named first wins; longer names break ties, so
    // "Typhoon hits Japan as China braces" resolves to Japan.
    if (!best || index < best.index || (index === best.index && needle.length > best.length)) {
      best = { place, index, length: needle.length };
    }
  }

  if (!best) return undefined;
  const { place } = best;
  return {
    lat: place.lat,
    lon: place.lon,
    label: place.name,
    region: place.region ?? regionFromCoords(place.lat, place.lon),
  };
}
