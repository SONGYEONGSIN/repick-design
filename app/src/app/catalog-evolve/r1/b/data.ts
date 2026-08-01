// Deterministic catalog data for the Overlook archive. No Math.random / Date.now / new Date
// anywhere — every ordering field is a plain literal so filtering and sorting are reproducible
// and hydration-safe.

export type Topic =
  | "Technology"
  | "Culture"
  | "Business"
  | "Science"
  | "Design"
  | "Politics";

export type Format = "Essay" | "Report" | "Interview" | "Data Story";

export type Access = "free" | "members";

export type SortKey = "newest" | "most-read" | "longest" | "shortest";

export interface Article {
  id: string;
  title: string;
  dek: string;
  author: string;
  dateLabel: string;
  /** Higher = more recent. A plain rank, not a timestamp. */
  dateRank: number;
  topic: Topic;
  format: Format;
  access: Access;
  readMinutes: number;
  views: number;
  imageId: string;
  imageAlt: string;
}

export const TOPICS: Topic[] = [
  "Technology",
  "Culture",
  "Business",
  "Science",
  "Design",
  "Politics",
];

export const FORMATS: Format[] = ["Essay", "Report", "Interview", "Data Story"];

export const SORTS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "most-read", label: "Most read" },
  { value: "longest", label: "Longest read" },
  { value: "shortest", label: "Shortest read" },
];

const AUTHORS = [
  "Priya Nathan",
  "Marcus Ade",
  "Lena Ostrowski",
  "Devon Cole",
  "Ibrahim Al-Sayed",
  "Naomi Frid",
  "Tomas Reyes",
  "Ada Kowalski",
];

const IMAGES: { id: string; alt: string }[] = [
  { id: "1518770660439-4636190af475", alt: "Macro photograph of a circuit board with visible solder joints" },
  { id: "1461749280684-dccba630e2f6", alt: "Sunlight breaking through a dense green forest canopy" },
  { id: "1519389950473-47ba0277781c", alt: "Colleagues gathered around a table during a meeting" },
  { id: "1526374965328-7f61d4dc18c5", alt: "Cascading green code characters on a dark computer screen" },
  { id: "1470071459604-3b5ec3a7fe05", alt: "Layered mountain silhouettes at dusk under a pale sky" },
  { id: "1497436072909-60f360e1d4b1", alt: "Spiral galaxy glowing against a dark starfield" },
  { id: "1504384308090-c894fdcc538d", alt: "Two people reviewing printed documents across a wooden desk" },
  { id: "1552664730-d307ca884978", alt: "Abstract arrangement of overlapping paper sheets and shadows" },
  { id: "1500530855697-b586d89ba3ee", alt: "Wide mountain range under a soft overcast sky" },
  { id: "1441974231531-c6227db76b6e", alt: "Sunbeams filtering through tall pine trees in a forest" },
  { id: "1451187580459-43490279c0fa", alt: "Curved view of Earth's horizon photographed from orbit" },
  { id: "1531297484001-80022131f5a1", alt: "Open laptop on a desk displaying lines of text" },
];

interface Seed {
  title: string;
  dek: string;
  topic: Topic;
  readMinutes: number;
  views: number;
}

// Grouped by topic on purpose (four per topic) — the filter chips read cleanly against it. Dates,
// authors, formats and images are assigned by position below so none of those axes trivially
// correlate with topic.
const SEEDS: Seed[] = [
  { title: "The Quiet Death of the Desktop App", dek: "Native software didn't disappear. It just stopped announcing itself.", topic: "Technology", readMinutes: 7, views: 48200 },
  { title: "Inside the Chip Shortage No One Saw Coming", dek: "A single ingredient shortfall has quietly reshaped three unrelated industries.", topic: "Technology", readMinutes: 12, views: 6100 },
  { title: "Why Encryption Backdoors Keep Coming Back", dek: "Every decade, the same proposal returns wearing a different justification.", topic: "Technology", readMinutes: 5, views: 12400 },
  { title: "The Last Mile Problem in Machine Translation", dek: "Models nailed grammar years ago. Idiom is the part nobody solved.", topic: "Technology", readMinutes: 9, views: 31500 },
  { title: "What We Lost When Record Stores Closed", dek: "Discovery used to require a stranger's opinion. Now it requires none.", topic: "Culture", readMinutes: 15, views: 2300 },
  { title: "The Second Life of Analog Photography", dek: "Film sales are up for the fourth straight year, and not out of nostalgia.", topic: "Culture", readMinutes: 4, views: 89100 },
  { title: "Museums Are Quietly Rewriting Their Own History", dek: "Wall text is being rewritten faster than most visitors notice.", topic: "Culture", readMinutes: 11, views: 15600 },
  { title: "The Podcast Boom Was Never About Podcasts", dek: "It was about the thing radio stopped being allowed to do.", topic: "Culture", readMinutes: 22, views: 4200 },
  { title: "The Hidden Cost of Same-Day Delivery", dek: "The math only works if somebody upstream absorbs the difference.", topic: "Business", readMinutes: 6, views: 22800 },
  { title: "Why Middle Managers Are Disappearing", dek: "The layer that translated strategy into work is being automated out.", topic: "Business", readMinutes: 8, views: 7300 },
  { title: "Inside the Slow Collapse of Mall Culture", dek: "What replaces a dead mall says more than what killed it.", topic: "Business", readMinutes: 3, views: 53400 },
  { title: "The Founders Who Never Wanted to Scale", dek: "A growing number of small companies are refusing to become big ones.", topic: "Business", readMinutes: 18, views: 990 },
  { title: "The Ocean Floor Mapping Race Nobody Is Talking About", dek: "We have better maps of Mars than of most of our own seabed.", topic: "Science", readMinutes: 10, views: 18700 },
  { title: "What Octopus Cognition Tells Us About Minds", dek: "Intelligence evolved twice on this planet, in completely different shapes.", topic: "Science", readMinutes: 6, views: 26100 },
  { title: "The Quiet Return of Nuclear Power", dek: "The politics shifted faster than the plants can be built.", topic: "Science", readMinutes: 14, views: 3400 },
  { title: "How Permafrost Thaw Rewrites the Carbon Math", dek: "A number long treated as fixed just became a variable.", topic: "Science", readMinutes: 5, views: 61200 },
  { title: "The Case Against Infinite Scroll", dek: "The pattern that maximized attention is now being quietly reversed.", topic: "Design", readMinutes: 9, views: 9800 },
  { title: "Why Airports Keep Getting Harder to Read", dek: "Signage complexity grew with terminal size, not passenger comprehension.", topic: "Design", readMinutes: 7, views: 14300 },
  { title: "Typography's Quiet Power Struggle", dek: "Every operating system update is also a small ideological statement.", topic: "Design", readMinutes: 12, views: 41700 },
  { title: "The Return of the Physical Button", dek: "Touchscreens won the interior. Now the dashboard is fighting back.", topic: "Design", readMinutes: 4, views: 5600 },
  { title: "The Redistricting Fight No One's Watching", dek: "The maps being drawn this year outlast most of the people drawing them.", topic: "Politics", readMinutes: 20, views: 72900 },
  { title: "How Small Cities Are Rewriting Zoning Law", dek: "The most consequential housing policy is happening below the headlines.", topic: "Politics", readMinutes: 8, views: 1800 },
  { title: "The Slow Bureaucracy of Disaster Relief", dek: "Aid arrives fast. The paperwork that unlocks it does not.", topic: "Politics", readMinutes: 6, views: 27600 },
  { title: "Inside the Fight Over Municipal Broadband", dek: "Twenty states still restrict cities from building their own networks.", topic: "Politics", readMinutes: 11, views: 10200 },
];

const DATE_LABELS = [
  "Jul 31, 2026", "Jul 30, 2026", "Jul 29, 2026", "Jul 27, 2026",
  "Jul 26, 2026", "Jul 24, 2026", "Jul 23, 2026", "Jul 21, 2026",
  "Jul 20, 2026", "Jul 18, 2026", "Jul 17, 2026", "Jul 15, 2026",
  "Jul 14, 2026", "Jul 12, 2026", "Jul 11, 2026", "Jul 9, 2026",
  "Jul 8, 2026", "Jul 6, 2026", "Jul 5, 2026", "Jul 3, 2026",
  "Jul 2, 2026", "Jun 30, 2026", "Jun 29, 2026", "Jun 27, 2026",
];

export const ARTICLES: Article[] = SEEDS.map((seed, i) => {
  const format = FORMATS[i % FORMATS.length];
  const access: Access = i % 3 === 2 ? "members" : "free";
  const image = IMAGES[i % IMAGES.length];
  return {
    id: `dispatch-${i + 1}`,
    title: seed.title,
    dek: seed.dek,
    author: AUTHORS[i % AUTHORS.length],
    dateLabel: DATE_LABELS[i],
    dateRank: SEEDS.length - i,
    topic: seed.topic,
    format,
    access,
    readMinutes: seed.readMinutes,
    views: seed.views,
    imageId: image.id,
    imageAlt: image.alt,
  };
});

export function filterArticles(
  articles: Article[],
  opts: { topics: Topic[]; access: Access | "all"; format: Format | "all" },
): Article[] {
  return articles.filter((a) => {
    if (opts.topics.length > 0 && !opts.topics.includes(a.topic)) return false;
    if (opts.access !== "all" && a.access !== opts.access) return false;
    if (opts.format !== "all" && a.format !== opts.format) return false;
    return true;
  });
}

export function sortArticles(articles: Article[], sort: SortKey): Article[] {
  const list = [...articles];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => b.dateRank - a.dateRank);
    case "most-read":
      return list.sort((a, b) => b.views - a.views);
    case "longest":
      return list.sort((a, b) => b.readMinutes - a.readMinutes);
    case "shortest":
      return list.sort((a, b) => a.readMinutes - b.readMinutes);
  }
}

export function formatViews(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k >= 10 ? Math.round(k) : Math.round(k * 10) / 10}K`;
  }
  return String(n);
}

export type CardVariant = "feature" | "wide" | "standard";

/** Position-based magazine rhythm: one hero card, a wide card every sixth slot, standard elsewhere.
 *  Column-span only (never row-span) so a short row never fights an oversized neighbor for height. */
export function cardVariant(positionInVisibleList: number): CardVariant {
  if (positionInVisibleList === 0) return "feature";
  if (positionInVisibleList % 6 === 3) return "wide";
  return "standard";
}
