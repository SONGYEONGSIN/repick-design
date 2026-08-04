// app/src/app/blog-evolve/r1/a/data.ts
//
// Deterministic content for the Northbeam blog index. Every post carries both a display date
// string and a zero-padded sortable `dateKey` so "newest first" is a plain string comparison —
// no `Date` object is ever constructed (page-brief-core §2 bans `new Date()`/`Date.now()`).
import type { LucideIcon } from "lucide-react";
import { Waypoints, LayoutGrid, Terminal, Database, BookOpenText, Building2 } from "lucide-react";

export type CategoryId = "attribution" | "product" | "engineering" | "data-culture" | "guides" | "company";

export type Category = {
  id: CategoryId;
  label: string;
  /** Hue used by both the filter chip accent and the post's generated cover art. */
  hue: number;
  icon: LucideIcon;
};

export const CATEGORIES: Category[] = [
  { id: "attribution", label: "Attribution", hue: 14, icon: Waypoints },
  { id: "product", label: "Product", hue: 178, icon: LayoutGrid },
  { id: "engineering", label: "Engineering", hue: 212, icon: Terminal },
  { id: "data-culture", label: "Data Culture", hue: 84, icon: Database },
  { id: "guides", label: "Guides", hue: 32, icon: BookOpenText },
  { id: "company", label: "Company", hue: 350, icon: Building2 },
];

export function categoryOf(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id)!;
}

export type AuthorId = "dana" | "marcus" | "priya" | "tom" | "elena";

export type Author = {
  id: AuthorId;
  name: string;
  role: string;
  initials: string;
  /** Avatar tint — curated per person rather than hashed, so the five stay visually distinct. */
  hue: number;
};

export const AUTHORS: Author[] = [
  { id: "dana", name: "Dana Okafor", role: "Head of Product", initials: "DO", hue: 14 },
  { id: "marcus", name: "Marcus Feld", role: "Staff Engineer", initials: "MF", hue: 212 },
  { id: "priya", name: "Priya Raman", role: "Data Scientist", initials: "PR", hue: 84 },
  { id: "tom", name: "Tom Halvorsen", role: "Founder & CEO", initials: "TH", hue: 350 },
  { id: "elena", name: "Elena Cho", role: "Content Lead", initials: "EC", hue: 32 },
];

export function authorOf(id: AuthorId): Author {
  return AUTHORS.find((a) => a.id === id)!;
}

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  categoryId: CategoryId;
  authorId: AuthorId;
  dateLabel: string;
  /** YYYYMMDD, sortable as a plain number/string — no Date parsing involved. */
  dateKey: string;
  readMinutes: number;
  reads: number;
  featured?: boolean;
};

export const POSTS: Post[] = [
  {
    id: 1,
    slug: "multi-touch-attribution-is-dead",
    title: "Multi-touch attribution is dead. Here's what replaced it.",
    excerpt:
      "We spent three years defending weighted models to finance before we admitted the weights were fiction. What we built instead treats every channel as a lever, not a credit line — and it survived its first board meeting.",
    categoryId: "attribution",
    authorId: "tom",
    dateLabel: "Jul 29, 2026",
    dateKey: "20260729",
    readMinutes: 11,
    reads: 15200,
    featured: true,
  },
  {
    id: 2,
    slug: "pipeline-math-breaks-new-channel",
    title: "Why your pipeline math breaks the moment marketing adds a channel",
    excerpt:
      "Adding a fifth channel doesn't cost you one column in a spreadsheet — it invalidates every ratio the other four were built on. A walkthrough of the recompute we ship on every channel add.",
    categoryId: "attribution",
    authorId: "dana",
    dateLabel: "Jul 24, 2026",
    dateKey: "20260724",
    readMinutes: 8,
    reads: 9800,
  },
  {
    id: 3,
    slug: "new-event-pipeline-90-seconds",
    title: "Inside Northbeam's new event pipeline: from 40-minute batches to 90 seconds",
    excerpt:
      "The old pipeline was correct and slow. The new one is correct and fast, and the difference was never the compute — it was refusing to wait for a clock we didn't control.",
    categoryId: "engineering",
    authorId: "marcus",
    dateLabel: "Jul 18, 2026",
    dateKey: "20260718",
    readMinutes: 12,
    reads: 7400,
  },
  {
    id: 4,
    slug: "dashboard-nobody-opens-postmortem",
    title: "The dashboard nobody opens: a postmortem",
    excerpt:
      "It had every metric we were asked for and a login count of four. What we shipped to replace it has fewer numbers and a return visit rate seven times higher.",
    categoryId: "product",
    authorId: "dana",
    dateLabel: "Jul 10, 2026",
    dateKey: "20260710",
    readMinutes: 6,
    reads: 11200,
  },
  {
    id: 5,
    slug: "three-person-data-team-400-reps",
    title: "Building a data team of three that supports four hundred sales reps",
    excerpt:
      "Headcount was never coming. Here's the request-intake system, the two dashboards we refuse to add a third to, and the Friday ritual that keeps the backlog from becoming the job.",
    categoryId: "data-culture",
    authorId: "priya",
    dateLabel: "Jul 2, 2026",
    dateKey: "20260702",
    readMinutes: 9,
    reads: 6100,
  },
  {
    id: 6,
    slug: "field-guide-utm-hygiene",
    title: "A field guide to UTM hygiene (that people will actually follow)",
    excerpt:
      "Naming conventions fail for the same reason diets do: too many rules to hold in your head mid-task. Four rules, one validator, and the campaign-builder change that made both stick.",
    categoryId: "guides",
    authorId: "elena",
    dateLabel: "Jun 26, 2026",
    dateKey: "20260626",
    readMinutes: 7,
    reads: 13400,
  },
  {
    id: 7,
    slug: "onboarding-rebuilt-one-number",
    title: "We rebuilt our onboarding around one number. Activation went up 34%.",
    excerpt:
      "Every step used to earn its place by intuition. We replaced that with a single downstream metric and cut the flow from eleven screens to four.",
    categoryId: "product",
    authorId: "dana",
    dateLabel: "Jun 19, 2026",
    dateKey: "20260619",
    readMinutes: 10,
    reads: 8700,
  },
  {
    id: 8,
    slug: "series-b-and-the-roadmap",
    title: "Series B, and the roadmap that got us there",
    excerpt:
      "Sixty million dollars, and the three product bets the round actually rewarded — including the one that looked like a mistake for a full two quarters.",
    categoryId: "company",
    authorId: "tom",
    dateLabel: "Jun 11, 2026",
    dateKey: "20260611",
    readMinutes: 5,
    reads: 5200,
  },
  {
    id: 9,
    slug: "cohort-retention-curves-lying",
    title: "Cohort retention curves are lying to you. Here's the fix.",
    excerpt:
      "Smoothing a curve to make a slide look better is a decision, even when nobody made it on purpose. The correction is smaller than the apology it requires.",
    categoryId: "data-culture",
    authorId: "priya",
    dateLabel: "Jun 3, 2026",
    dateKey: "20260603",
    readMinutes: 9,
    reads: 10300,
  },
  {
    id: 10,
    slug: "query-latency-6x-no-rewrite",
    title: "How we cut query latency 6x without a rewrite",
    excerpt:
      "No new engine, no new language, no six-month migration. Three indexes we should have had a year ago and one join we finally admitted was unnecessary.",
    categoryId: "engineering",
    authorId: "marcus",
    dateLabel: "May 27, 2026",
    dateKey: "20260527",
    readMinutes: 11,
    reads: 4800,
  },
  {
    id: 11,
    slug: "attribution-windows-explained-with-math",
    title: "Attribution windows, explained with actual math",
    excerpt:
      "Not a rule of thumb — the actual decay curve, the actual cutoff logic, and the actual spreadsheet you can hand to your finance team without flinching.",
    categoryId: "guides",
    authorId: "elena",
    dateLabel: "May 20, 2026",
    dateKey: "20260520",
    readMinutes: 8,
    reads: 12100,
  },
  {
    id: 12,
    slug: "shipping-to-50000-workspaces",
    title: "What we learned shipping to 50,000 workspaces",
    excerpt:
      "The tenth thousand workspace breaks different things than the first. A short list of the assumptions that quietly stopped being true along the way.",
    categoryId: "company",
    authorId: "tom",
    dateLabel: "May 14, 2026",
    dateKey: "20260514",
    readMinutes: 6,
    reads: 6600,
  },
];

export const FEATURED_POST = POSTS.find((p) => p.featured)!;
export const GRID_POSTS = POSTS.filter((p) => !p.featured);
