/**
 * Runsheet — deterministic dummy data for the editorial content-calendar console.
 * No Math.random / Date.now anywhere: every date is a fixed (year, month, day) triple and every
 * derived value (month grids, per-channel counts, per-status counts) is computed from that fixed
 * list, so subtotals always sum to totals and server/client renders are byte-identical.
 * `new Date(y, m, d)` (explicit args) is used only for weekday/label math — never the bare,
 * zero-argument `new Date()` that the determinism gate forbids.
 */

import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Eye,
  Layers,
  type LucideIcon,
  Mail,
  Mic2,
  PenLine,
  Rss,
  Settings,
  Share2,
  Users,
  Video,
  Lightbulb,
} from "lucide-react";

/* ------------------------------------------------------------------ Brand */

export const BRAND = { name: "Runsheet", tagline: "Editorial Operations Console" };

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces`;
}

export type Workspace = { id: string; name: string; plan: string };

export const WORKSPACES: Workspace[] = [
  { id: "ws-northfall", name: "Northfall Studio", plan: "Editorial plan" },
  { id: "ws-sandbox", name: "Sandbox", plan: "Free plan" },
];

/** Fictional persona — never real session/account data. */
export const CURRENT_USER = {
  name: "Priya Nakamura",
  role: "Content Operations Lead",
  email: "priya.nakamura@northfall.studio",
  avatarId: "1502685104226-ee32379fefbe",
};

/* -------------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "content",
    title: "Content",
    items: [
      { id: "calendar", label: "Calendar", Icon: CalendarDays, active: true },
      { id: "queue", label: "Queue", Icon: Layers, disabled: true },
      { id: "library", label: "Library", Icon: Rss, disabled: true },
    ],
  },
  {
    id: "team",
    title: "Team",
    items: [
      { id: "channels", label: "Channels", Icon: Share2, disabled: true },
      { id: "contributors", label: "Contributors", Icon: Users, disabled: true },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [{ id: "settings", label: "Settings", Icon: Settings, disabled: true }],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "“The Weekly Northfall: Late Summer Slowdown” is scheduled for Aug 14, 8:00 AM.", time: "1h ago" },
  { id: "n2", text: "Callum Reyes moved “The Case for a Four-Day Editorial Sprint” to In review.", time: "3h ago" },
  { id: "n3", text: "The September theme brief is ready for the team.", time: "1d ago" },
];

/* ------------------------------------------------------------------ Channels */

export type ChannelId = "newsletter" | "blog" | "social" | "video" | "podcast";

export type Channel = { id: ChannelId; label: string; Icon: LucideIcon };

export const CHANNELS: Channel[] = [
  { id: "newsletter", label: "Newsletter", Icon: Mail },
  { id: "blog", label: "Blog", Icon: Rss },
  { id: "social", label: "Social", Icon: Share2 },
  { id: "video", label: "Video", Icon: Video },
  { id: "podcast", label: "Podcast", Icon: Mic2 },
];

export const CHANNEL_BY_ID: Record<ChannelId, Channel> = CHANNELS.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<ChannelId, Channel>,
);

/* ------------------------------------------------------------------- Status */

export type Status = "idea" | "draft" | "review" | "scheduled" | "published";

export const STATUSES: { id: Status; label: string; Icon: LucideIcon }[] = [
  { id: "idea", label: "Idea", Icon: Lightbulb },
  { id: "draft", label: "Draft", Icon: PenLine },
  { id: "review", label: "In review", Icon: Eye },
  { id: "scheduled", label: "Scheduled", Icon: CalendarClock },
  { id: "published", label: "Published", Icon: CheckCircle2 },
];

export const STATUS_BY_ID: Record<Status, { id: Status; label: string; Icon: LucideIcon }> = STATUSES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<Status, { id: Status; label: string; Icon: LucideIcon }>,
);

/* --------------------------------------------------------------- Contributors */

export type ContributorKey = "callum" | "owen" | "marisol" | "devon" | "ingrid";

export const CONTRIBUTORS: Record<ContributorKey, { name: string; role: string; initials: string }> = {
  callum: { name: "Callum Reyes", role: "Staff Writer", initials: "CR" },
  owen: { name: "Owen Castellanos", role: "Social Lead", initials: "OC" },
  marisol: { name: "Marisol Trent", role: "Video Producer", initials: "MT" },
  devon: { name: "Devon Okafor", role: "Newsletter Editor", initials: "DO" },
  ingrid: { name: "Ingrid Solheim", role: "Podcast Producer", initials: "IS" },
};

/* ------------------------------------------------------------- Months / today */

/** Navigable months — index 1 (August 2026) is the console's default view. */
export const MONTHS: { year: number; month: number }[] = [
  { year: 2026, month: 6 }, // July
  { year: 2026, month: 7 }, // August
  { year: 2026, month: 8 }, // September
];
export const DEFAULT_MONTH_INDEX = 1;

/** Fixed reference "today" — never the real wall clock. */
export const TODAY = { year: 2026, month: 7, day: 13 };

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function dateKey(year: number, month: number, day: number): string {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

export const TODAY_KEY = dateKey(TODAY.year, TODAY.month, TODAY.day);

/* ---------------------------------------------------------------- Content items */

export type ContentItem = {
  id: string;
  year: number;
  month: number;
  day: number;
  channel: ChannelId;
  status: Status;
  time: string;
  title: string;
  owner: ContributorKey;
};

type Raw = [month: number, day: number, channel: ChannelId, status: Status, time: string, title: string, owner: ContributorKey];

const RAW_ITEMS: Raw[] = [
  // ---- July 2026 (6) — all published, sets the "before today" baseline
  [6, 2, "blog", "published", "09:00", "Five Small Studios Redesigning the Home Office", "callum"],
  [6, 3, "social", "published", "12:30", "Studio tour teaser: behind the scenes", "owen"],
  [6, 6, "newsletter", "published", "08:00", "The Weekly Northfall: Slow Living Issue", "devon"],
  [6, 7, "video", "published", "15:00", "Kitchen Renovation Diaries, Episode 4", "marisol"],
  [6, 9, "podcast", "published", "07:00", "Office Hours: Talking Craft with Elin Bergman", "ingrid"],
  [6, 10, "social", "published", "11:00", "Reader poll: favorite summer reads", "owen"],
  [6, 13, "blog", "published", "09:00", "A Field Guide to Rooftop Gardens", "callum"],
  [6, 14, "newsletter", "published", "08:00", "The Weekly Northfall: Rooftop Season", "devon"],
  [6, 16, "video", "published", "15:00", "Five-Minute Fixes for Small Kitchens", "marisol"],
  [6, 17, "social", "published", "11:00", "Poll results and reader picks", "owen"],
  [6, 20, "blog", "published", "09:00", "Why Slow Travel Is Having a Moment", "callum"],
  [6, 21, "podcast", "published", "07:00", "Office Hours: Remote Teams, Real Culture", "ingrid"],
  [6, 23, "newsletter", "published", "08:00", "The Weekly Northfall: Travel Issue", "devon"],
  [6, 27, "video", "published", "15:00", "Studio Visit: A Ceramicist in Lisbon", "marisol"],
  [6, 30, "social", "published", "11:00", "Monthly recap carousel", "owen"],
  [6, 31, "blog", "published", "09:00", "July Wrap: What Readers Loved Most", "callum"],

  // ---- August 2026 (7) — default month; mixes published (before day 13) with the live pipeline
  [7, 3, "newsletter", "published", "08:00", "The Weekly Northfall: Back to Routine", "devon"],
  [7, 4, "blog", "published", "09:00", "Desk Setups That Actually Work", "callum"],
  [7, 5, "social", "published", "12:00", "Desk tour reel", "owen"],
  [7, 6, "video", "published", "15:00", "Studio Visit: A Furniture Maker in Porto", "marisol"],
  [7, 7, "podcast", "published", "07:00", "Office Hours: Designing for Focus", "ingrid"],
  [7, 10, "newsletter", "published", "08:00", "The Weekly Northfall: Focus Issue", "devon"],
  [7, 11, "blog", "review", "09:00", "The Case for a Four-Day Editorial Sprint", "callum"],
  [7, 12, "social", "scheduled", "12:00", "Sneak peek: September issue theme", "owen"],
  [7, 13, "video", "scheduled", "15:00", "Studio Visit: A Letterpress Shop in Ghent", "marisol"],
  [7, 13, "podcast", "draft", "07:00", "Office Hours: The Editorial Sprint, Part 1", "ingrid"],
  [7, 14, "newsletter", "scheduled", "08:00", "The Weekly Northfall: Late Summer Slowdown", "devon"],
  [7, 17, "blog", "scheduled", "09:00", "Reader Mailbag: Your Best Small-Space Wins", "callum"],
  [7, 18, "social", "scheduled", "12:00", "Poll: what should we cover in September", "owen"],
  [7, 19, "video", "draft", "15:00", "Five-Minute Fixes: Balcony Gardens", "marisol"],
  [7, 20, "podcast", "scheduled", "07:00", "Office Hours: The Editorial Sprint, Part 2", "ingrid"],
  [7, 21, "newsletter", "draft", "08:00", "The Weekly Northfall: September Preview", "devon"],
  [7, 24, "blog", "idea", "09:00", "Mapping the Slow-Travel Season Ahead", "callum"],
  [7, 25, "social", "idea", "12:00", "September theme reveal teaser", "owen"],
  [7, 26, "video", "idea", "15:00", "Studio Visit: A Bookbinder in Kyoto", "marisol"],
  [7, 27, "newsletter", "scheduled", "08:00", "The Weekly Northfall: Reader Mailbag", "devon"],
  [7, 28, "podcast", "idea", "07:00", "Office Hours: Planning the Fall Slate", "ingrid"],
  [7, 31, "blog", "scheduled", "09:00", "August Wrap: What Readers Loved Most", "callum"],

  // ---- September 2026 (8) — forward month, mostly early-pipeline
  [8, 1, "newsletter", "scheduled", "08:00", "The Weekly Northfall: September Issue", "devon"],
  [8, 2, "social", "scheduled", "12:00", "September theme reveal", "owen"],
  [8, 3, "blog", "idea", "09:00", "The Best Small Studios of Autumn", "callum"],
  [8, 4, "video", "idea", "15:00", "Studio Visit: A Weaver in Oaxaca", "marisol"],
  [8, 7, "podcast", "idea", "07:00", "Office Hours: Fall Slate Kickoff", "ingrid"],
  [8, 8, "newsletter", "idea", "08:00", "The Weekly Northfall: Fall Rituals", "devon"],
  [8, 10, "blog", "idea", "09:00", "Cold-Weather Workspaces That Still Feel Warm", "callum"],
  [8, 11, "social", "idea", "12:00", "Reader submissions: your fall setups", "owen"],
  [8, 14, "video", "idea", "15:00", "Five-Minute Fixes: Entryway Edition", "marisol"],
  [8, 15, "newsletter", "idea", "08:00", "The Weekly Northfall: Entryway Issue", "devon"],
  [8, 17, "podcast", "idea", "07:00", "Office Hours: Editing for Voice", "ingrid"],
  [8, 21, "blog", "idea", "09:00", "A Field Guide to Autumn Markets", "callum"],
  [8, 24, "social", "idea", "12:00", "Market finds carousel", "owen"],
  [8, 28, "newsletter", "idea", "08:00", "The Weekly Northfall: October Preview", "devon"],
];

export const ITEMS: ContentItem[] = RAW_ITEMS.map(([month, day, channel, status, time, title, owner], i) => ({
  id: `ct-${i + 1}`,
  year: 2026,
  month,
  day,
  channel,
  status,
  time,
  title,
  owner,
}));

export const ITEMS_BY_DATE: Record<string, ContentItem[]> = {};
for (const item of ITEMS) {
  const key = dateKey(item.year, item.month, item.day);
  (ITEMS_BY_DATE[key] ??= []).push(item);
}
for (const key of Object.keys(ITEMS_BY_DATE)) {
  ITEMS_BY_DATE[key].sort((a, b) => a.time.localeCompare(b.time));
}

export function itemsForMonth(year: number, month: number): ContentItem[] {
  return ITEMS.filter((i) => i.year === year && i.month === month);
}

export function countByChannel(items: ContentItem[]): Record<ChannelId, number> {
  const counts: Record<ChannelId, number> = { newsletter: 0, blog: 0, social: 0, video: 0, podcast: 0 };
  for (const it of items) counts[it.channel] += 1;
  return counts;
}

export function countByStatus(items: ContentItem[]): Record<Status, number> {
  const counts: Record<Status, number> = { idea: 0, draft: 0, review: 0, scheduled: 0, published: 0 };
  for (const it of items) counts[it.status] += 1;
  return counts;
}

/* ------------------------------------------------------------ Month grid math */

export type DayCell = { key: string; year: number; month: number; day: number; inMonth: boolean };

function prevMonthOf(year: number, month: number): { year: number; month: number } {
  return month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
}
function nextMonthOf(year: number, month: number): { year: number; month: number } {
  return month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };
}
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
export function firstWeekdayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Always 42 cells (6 fixed rows of 7) so switching months never shifts grid height. */
export function buildMonthMatrix(year: number, month: number): DayCell[] {
  const cells: DayCell[] = [];
  const total = daysInMonth(year, month);
  const startWeekday = firstWeekdayOfMonth(year, month);
  const prev = prevMonthOf(year, month);
  const prevTotal = daysInMonth(prev.year, prev.month);

  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = prevTotal - i;
    cells.push({ key: dateKey(prev.year, prev.month, day), year: prev.year, month: prev.month, day, inMonth: false });
  }
  for (let day = 1; day <= total; day++) {
    cells.push({ key: dateKey(year, month, day), year, month, day, inMonth: true });
  }
  const next = nextMonthOf(year, month);
  let nextDay = 1;
  while (cells.length < 42) {
    cells.push({ key: dateKey(next.year, next.month, nextDay), year: next.year, month: next.month, day: nextDay, inMonth: false });
    nextDay += 1;
  }
  return cells;
}

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* --------------------------------------------------------------------- Format */

const MONTH_FORMAT = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
export function monthLabel(year: number, month: number): string {
  return MONTH_FORMAT.format(new Date(year, month, 1));
}

const FULL_DAY_FORMAT = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });
export function fullDayLabel(year: number, month: number, day: number): string {
  return FULL_DAY_FORMAT.format(new Date(year, month, day));
}

const SHORT_DAY_FORMAT = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
export function shortDayLabel(year: number, month: number, day: number): string {
  return SHORT_DAY_FORMAT.format(new Date(year, month, day));
}

const TIME_FORMAT = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return TIME_FORMAT.format(new Date(2000, 0, 1, h, m));
}
