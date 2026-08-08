import type { NewsStory } from "@/types";
import { editorsPicks, topStories } from "./news";
import { climateNews } from "./topics";
import { developments } from "./conflicts";
import { regions } from "./regions";
import { getSource } from "./sources";

// Article layer: full-page body copy for every clickable story.
// Bodies are hand-written demo prose for the main stories; anything without an
// entry gets a deterministic category-templated fallback so no article 404s
// on body content. All of it is clearly illustrative mock journalism.

export const articleBodies: Record<string, string[]> = {
  "climate-finance-pact": [
    "Negotiators from more than 190 countries approved a new climate finance framework late on Thursday, committing to mobilise $1.3 trillion annually by 2030 for adaptation and clean-energy programmes in vulnerable economies. The agreement caps two weeks of talks that repeatedly stalled over how contributions should be split between public treasuries and private capital.",
    "The framework introduces a phased review mechanism beginning in 2027, under which pledges will be measured against verified disbursements rather than announcements — a first for an accord of this scale. Small-island negotiators, who had threatened to walk out earlier in the week, called the verification clause the deal's most consequential feature.",
    "Implementation now shifts to national capitals, where finance ministries must translate the headline number into budget lines and guarantee instruments. Analysts caution that previous funds have taken years to reach full capacity, and the first tranche reviews in 2027 will be the real test of whether this agreement behaves differently.",
  ],
  "aid-corridor": [
    "A convoy of 120 relief trucks entered Gaza on Tuesday through a newly opened inspection corridor, the largest single delivery since the ceasefire took effect. Aid agencies said the route, agreed after weeks of shuttle diplomacy, could triple daily throughput if it remains open.",
    "The corridor operates under a joint monitoring arrangement, with scanning stations on both sides and a shared manifest system intended to cut inspection times from days to hours. Officials described the first day as orderly, though flour and fuel stocks inside the territory remain critically low.",
    "Humanitarian coordinators warn that the ceasefire's durability and the corridor's capacity are now linked: any interruption would push warehouses back below the one-week buffer that agencies consider the minimum for stable distribution.",
  ],
  "markets-inflation": [
    "Global equities advanced on Wednesday after inflation prints in three major economies came in below consensus, reinforcing expectations that central banks will begin easing in the autumn. The broad global index rose 1.3 per cent, with rate-sensitive sectors leading the move.",
    "Core goods prices have now decelerated for five consecutive months, and services inflation — the stickier component that policymakers watch most closely — showed its first meaningful cooling this cycle. Futures markets moved to price two quarter-point cuts by year-end, up from one a week ago.",
    "Strategists cautioned that the rally rests on a narrow data window. Energy base effects reverse in the fourth quarter, and wage growth remains above levels consistent with target inflation in most advanced economies.",
  ],
  "alzheimers-breakthrough": [
    "A late-stage trial of a dual-target therapy slowed cognitive decline by 38 per cent over 18 months in patients with early Alzheimer's disease, researchers reported on Monday — the strongest result yet for a treatment addressing both amyloid and tau pathology.",
    "Unlike earlier antibody therapies, the new regimen showed benefit in patients who began treatment after symptom onset, a group that has historically seen little effect. Rates of brain swelling, the side effect that has constrained the current generation of drugs, were roughly half those reported in comparable trials.",
    "Regulators in three jurisdictions have granted the therapy priority review. Health systems, meanwhile, face a familiar question: diagnostic and infusion capacity, not drug supply, is expected to be the binding constraint on rollout.",
  ],
  "peace-talks": [
    "Delegations returned to the negotiating table in Eastern Europe on Friday for the first direct talks in four months, meeting under heavy security at an undisclosed venue. Officials on both sides described the opening session as procedural but confirmed a second round for next week.",
    "The agenda is understood to cover prisoner exchanges, grain-corridor guarantees and a framework for local ceasefires around critical infrastructure. Mediators have deliberately kept territorial questions off the table for this round, arguing that confidence-building measures must come first.",
    "Diplomats familiar with the process cautioned against expectations of a breakthrough, noting that both sides continue to reinforce positions along the front. Still, the resumption of direct contact is the first procedural progress since talks collapsed in January.",
  ],
  "heatwave-asia": [
    "A prolonged heatwave intensified across South and Southeast Asia on Thursday, with temperatures exceeding 45°C in parts of northern India and Pakistan for the sixth consecutive day. Authorities in three countries extended school closures and issued maximum-level health alerts.",
    "Electricity grids are operating at record load as cooling demand surges, forcing rotating outages in several regions precisely when they are most dangerous. Hospitals report sharp rises in heatstroke admissions, with outdoor workers and the elderly most affected.",
    "Meteorologists link the event's persistence to a stalled high-pressure ridge and above-average sea-surface temperatures. Attribution scientists say heatwaves of this intensity have become roughly thirty times more likely in the region compared with the pre-industrial baseline.",
  ],
  "energy-treaty": [
    "Twenty-seven nations signed a binding energy-transition treaty in Brussels on Wednesday, committing to interconnect grids, jointly procure storage capacity and phase down unabated coal generation on a common timetable. It is the first treaty to make grid interconnection targets legally enforceable.",
    "The pact creates a shared investment vehicle seeded with €50 billion to underwrite cross-border transmission projects, which planners identify as the single largest bottleneck to renewable expansion. Three additional countries signalled intent to join within the year.",
    "Energy economists called the treaty's procurement pooling its most significant clause: by aggregating national storage tenders, signatories expect to cut battery costs by up to a fifth and accelerate deployment timelines that currently stretch past 2030.",
  ],
  "sudan-crisis": [
    "The humanitarian situation in Sudan deteriorated further this week as fighting spread to previously stable corridors, cutting off aid routes to an estimated two million people. Agencies now describe the crisis as the world's largest displacement emergency.",
    "Warehouses in three regional hubs report stocks below two weeks' supply, and convoy movements have fallen by half since checkpoints multiplied along the main western routes. Negotiations over a humanitarian corridor continue in Geneva, so far without agreement on monitoring arrangements.",
    "Aid officials stress that the crisis remains severely underfunded: the response plan is less than a third financed at midyear, forcing ration cuts even in accessible areas.",
  ],
  "us-jobs": [
    "U.S. employers added significantly more jobs than forecast in April while wage growth moderated, a combination economists described as the most favourable reading of the year for the soft-landing scenario. Payroll gains were broad-based across services and construction.",
    "Average hourly earnings rose at the slowest annual pace since 2021, easing pressure on the central bank ahead of its June meeting. Labour-force participation among prime-age workers touched a two-decade high, suggesting supply rather than cooling demand is doing the adjustment work.",
    "Markets responded by trimming the probability of further tightening to near zero. Attention now turns to whether the productivity gains that accompanied recent hiring can be sustained through the second half.",
  ],
  "chip-supply": [
    "The geography of semiconductor manufacturing is shifting measurably, according to industry data released this week, with regional fabrication hubs in three continents now accounting for a third of new capacity investment — up from a fifth two years ago.",
    "Subsidy programmes in the United States, Europe and Japan have pulled forward fab construction that executives say would otherwise have concentrated in East Asia. Analysts note, however, that advanced packaging and key chemical inputs remain heavily clustered, leaving the supply chain exposed at different chokepoints.",
    "The reshuffling carries a cost premium: chips from newer regional fabs run an estimated 15 to 30 per cent more expensive, a gap governments are covering with incentives that expire within the decade.",
  ],
  "coral-recovery": [
    "Marine surveys across the Coral Sea recorded localised coral recovery for the second consecutive season, with juvenile coral density on monitored reefs reaching its highest level since systematic tracking began.",
    "Scientists attribute the rebound to two summers without mass bleaching, combined with expanded crown-of-thorns control and larval reseeding trials that appear to be establishing on damaged substrate. Recovery remains patchy, with sheltered mid-shelf reefs improving fastest.",
    "Researchers caution that the gains are fragile: recovery windows between marine heatwaves are shortening, and a single severe bleaching event could erase much of the observed regrowth.",
  ],
  "election-mexico": [
    "Electoral authorities in Mexico published final results from Sunday's regional votes, confirming a fragmented map in which no party secured a governing majority in two of the five contested states.",
    "Turnout reached 61 per cent, the highest for a regional cycle in a decade, with observers crediting expanded early voting and a closely fought security debate for the surge. International monitors reported isolated irregularities but described the process as orderly.",
    "Coalition negotiations begin this week and are expected to shape the national political landscape ahead of the mid-term calendar, particularly on energy and security legislation where regional governments hold implementation power.",
  ],
  "amazon-deforestation": [
    "Deforestation in the Brazilian Amazon fell for a second consecutive year, satellite monitoring showed on Tuesday, with primary forest loss down 28 per cent from the previous twelve-month period.",
    "Officials attribute the decline to restored enforcement budgets, real-time alert systems and coordinated action against illegal supply chains in beef and timber. Scientists welcomed the trend while noting that degradation — logging and fire damage short of clearance — has not fallen as fast.",
    "Attention now shifts to whether the trajectory survives the next agricultural expansion cycle, and to neighbouring countries where clearance rates have moved in the opposite direction.",
  ],
  "canada-housing": [
    "Canada unveiled a national housing plan on Thursday that ties federal infrastructure transfers to municipal zoning reform, aiming to double the pace of homebuilding within seven years.",
    "The plan pairs low-cost financing for purpose-built rentals with a standardised pre-approved design catalogue intended to compress permitting timelines from years to months. Provinces that liberalise density rules near transit gain access to an accelerated funding stream.",
    "Economists broadly endorsed the supply-side focus while questioning whether construction-labour capacity can absorb the targeted volumes; the plan includes expanded skilled-trade immigration streams to address exactly that constraint.",
  ],
  "storm-us": [
    "A powerful storm system swept across the southern United States overnight, producing damaging winds, large hail and at least six confirmed tornadoes. More than 400,000 customers lost power at the event's peak.",
    "Emergency services conducted dozens of water rescues as training thunderstorms dropped over 250 millimetres of rain on already-saturated ground. Two fatalities have been confirmed, with damage assessments ongoing across four states.",
    "Forecasters warn the same frontal boundary will re-energise this weekend as it interacts with record Gulf moisture, keeping a broad corridor under flood watches through Monday.",
  ],
  "ai-framework": [
    "Momentum behind a common framework for artificial-intelligence regulation accelerated this week as two additional jurisdictions aligned their draft legislation with the risk-tier model already adopted in Europe.",
    "The converging approach classifies systems by application risk rather than by underlying technology, imposing audit and transparency duties that scale with potential harm. Industry response has split: larger developers welcome predictability, while open-model advocates warn compliance costs could concentrate the field.",
    "Negotiators aim to agree mutual-recognition provisions by year-end, which would let audits performed in one jurisdiction satisfy obligations in another — the clearest signal yet that AI governance is consolidating rather than fragmenting.",
  ],
  wilderness: [
    "From the boreal forest belt to the last free-flowing river basins, a coalition of scientists and governments is racing to map and protect the planet's remaining intact wilderness before development pressure closes the window.",
    "New satellite analysis identifies roughly 23 per cent of terrestrial land as ecologically intact — a figure that has fallen by a tenth in just two decades. The coalition's proposal would place the largest contiguous blocks under permanent protection, financed by biodiversity credits audited against habitat outcomes.",
    "The effort faces its hardest tests where wilderness overlaps mineral frontiers. Negotiations continue with several governments weighing extraction revenue against conservation finance that, for the first time, approaches competitive scale.",
  ],
  "cancer-research": [
    "Researchers reported a significant advance in cancer treatment this week: an engineered cell therapy that maintained durable remission in a majority of trial patients with a hard-to-treat solid tumour — a category where cell therapies have repeatedly failed.",
    "The approach arms immune cells with a logic-gated receptor that activates only when two tumour markers are present simultaneously, sharply reducing damage to healthy tissue. Eighteen-month follow-up data showed remissions holding in 62 per cent of responders.",
    "Oncologists called the results a proof of principle that could extend cell therapy beyond blood cancers, while stressing that larger trials and manufacturing scale-up remain years-long undertakings.",
  ],
  "future-cities": [
    "Urban planners are converging on a new template for the mid-century city: dense, transit-anchored districts that produce much of their own energy and treat housing, mobility and climate adaptation as one integrated system.",
    "Pilot districts on three continents now pair district-scale geothermal and rooftop solar with mandates that new construction be retrofit-ready. Early data suggest per-capita emissions in these districts run 60 per cent below their metropolitan averages, at living costs comparable to conventional development.",
    "The harder question is retrofit: the overwhelming majority of 2050's urban fabric already exists. The most closely watched experiments are therefore not new districts but block-by-block conversions of ageing postwar housing stock.",
  ],
  "renewable-push": [
    "Renewable generation reached 34 per cent of global electricity in the latest annual accounting, a record share driven by the steepest solar deployment curve the industry has ever recorded.",
    "Cost declines continue to outpace forecasts: utility-scale solar with storage now undercuts new fossil generation in markets covering four-fifths of global demand. The constraint has shifted decisively to grids, with connection queues in major markets holding projects worth more than a year of global deployment.",
    "Analysts expect the share to pass 40 per cent within three years if interconnection reforms now in legislation take effect — and to stall well short of it if they do not.",
  ],
};

// ── Adapters: fold auxiliary card content into full NewsStory records ──

const climateStories: NewsStory[] = climateNews.map((n) => ({
  id: n.id,
  headline: n.headline,
  category: "environment",
  sourceId: "climate-bureau",
  publishedAgoMin: n.agoH * 60,
  sourcesCount: n.sourcesCount,
  image: n.image,
}));

const conflictStories: NewsStory[] = developments.map((d) => ({
  id: d.id,
  headline: d.title,
  category: "conflicts",
  sourceId: "international-desk",
  publishedAgoMin: d.agoH * 60,
  sourcesCount: d.sourcesCount,
  image: d.image,
}));

const regionStories: NewsStory[] = regions.flatMap((r) =>
  r.headlines.map((h) => ({ ...h, image: h.image ?? "/images/skyline.svg" }))
);

const seen = new Set<string>();
export const allStories: NewsStory[] = [
  ...topStories,
  ...editorsPicks,
  ...climateStories,
  ...conflictStories,
  ...regionStories,
].filter((s) => {
  if (seen.has(s.id)) return false;
  seen.add(s.id);
  return true;
});

export function getStory(id: string): NewsStory | undefined {
  return allStories.find((s) => s.id === id);
}

// Deterministic fallback prose for stories without a hand-written body.
function fallbackBody(story: NewsStory): string[] {
  const source = getSource(story.sourceId)?.name ?? "the newsroom";
  const place = story.location?.label ?? "the region";
  const lead = story.headline.endsWith(".") ? story.headline : `${story.headline}.`;
  const byCategory: Record<string, [string, string]> = {
    politics: [
      `Officials confirmed the development in ${place} on the record, while opposition figures called for parliamentary scrutiny of the decision's implementation timeline. Correspondents for ${source} report that negotiations behind the announcement ran for several weeks longer than publicly acknowledged.`,
      "Analysts say the immediate question is sequencing: which commitments carry statutory force, which depend on coalition arithmetic, and how quickly institutions can absorb the change. A fuller legislative picture is expected within the month.",
    ],
    conflicts: [
      `Field reports collated by ${source} describe a fluid situation, with independent verification still limited in several affected districts. Humanitarian access remains the immediate concern for agencies operating in the area.`,
      "Monitors caution that early casualty and displacement figures are provisional and typically revised as access improves. Diplomatic channels remain open, though officials on all sides describe expectations as guarded.",
    ],
    economy: [
      `Market participants read the news as broadly consistent with the soft-landing scenario, though positioning data suggests conviction remains thin. Desk economists at ${source} note the release aligns with leading indicators published earlier this quarter.`,
      "The next data points to watch are the monthly trade and inflation series, which will show whether the trend survives contact with the second half of the year.",
    ],
    environment: [
      `Scientists tracking the situation say the observations are consistent with long-term trend lines, while stressing the difference between single events and the underlying signal. Regional authorities in ${place} have activated standing response protocols.`,
      "Researchers expect a fuller attribution analysis within weeks. The economic dimension — insurance exposure, crop impacts and infrastructure stress — will take longer to quantify.",
    ],
    society: [
      `The measure follows months of consultation, and early reaction from community organisations has been cautiously positive, according to reporting by ${source}. Implementation is expected to phase in over the coming year.`,
      "Researchers point out that comparable programmes elsewhere took several years to show measurable outcomes, and that consistent funding — more than design — predicted their success.",
    ],
    technology: [
      `Industry response split along familiar lines, with incumbents emphasising stability and challengers warning about compliance burden. Technical analysts consulted by ${source} describe the underlying shift as more significant than the announcement suggests.`,
      "The practical effects will surface first in procurement cycles and hiring patterns, both of which typically move two to three quarters ahead of public metrics.",
    ],
    health: [
      `Clinicians welcomed the development while noting that trial populations rarely match real-world caseloads; effectiveness data from broader rollout will be decisive. Health authorities in ${place} say planning for capacity is already under way.`,
      "Regulators in several jurisdictions are reviewing the evidence in parallel, and a coordinated guidance update is expected before year-end.",
    ],
    science: [
      `The finding has circulated widely among specialists since appearing in preprint, and independent groups are already attempting replication. Reviewers consulted by ${source} describe the methodology as unusually robust for the field.`,
      "As with any single result, the significance depends on what follows: replication timelines suggest a clearer picture within the year.",
    ],
  };
  const [p2, p3] = byCategory[story.category] ?? byCategory.politics;
  return [lead + " The following report summarises what is currently known and what remains unverified.", p2, p3];
}

export interface Article {
  story: NewsStory;
  body: string[];
  related: NewsStory[];
}

export function getArticle(id: string): Article | undefined {
  const story = getStory(id);
  if (!story) return undefined;
  const body = articleBodies[id] ?? fallbackBody(story);
  const seenHeadlines = new Set([story.headline]);
  const related = allStories
    .filter((s) => {
      if (s.id === id || s.category !== story.category) return false;
      if (seenHeadlines.has(s.headline)) return false;
      seenHeadlines.add(s.headline);
      return true;
    })
    .slice(0, 4);
  return { story, body, related };
}
