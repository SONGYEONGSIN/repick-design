// Deterministic seed data for the Loupe Journal blog index.
// No Math.random / Date.now / new Date() anywhere per page-brief-core §2 — every date, count and
// ranking below is a fixed literal so the page renders identically on every request and every gate
// run, and so the timeline's month grouping never has to parse a date at runtime.

export const BRAND = "Loupe";
export const PUBLICATION = "The Loupe Journal";

export type Tag = "Craft" | "Product" | "Remote Teams" | "Case Studies" | "Engineering";

export const TAGS: Tag[] = ["Craft", "Product", "Remote Teams", "Case Studies", "Engineering"];

export type PostVariant = "feature-image" | "feature-quote" | "compact-image" | "compact";

export type Post = {
  id: string;
  title: string;
  monthGroup: string;
  dateLabel: string;
  dateISO: string;
  tag: Tag;
  minutes: number;
  variant: PostVariant;
  excerpt: string;
  quote?: string;
  imageSeed?: string;
  imageAlt?: string;
  pinned?: boolean;
};

// Ordered newest-first — the order the timeline renders in, and the order month markers appear.
export const POSTS: Post[] = [
  {
    id: "p1",
    title: "The pause button is the most underrated tool in creative review",
    monthGroup: "August 2026",
    dateLabel: "Aug 1, 2026",
    dateISO: "2026-08-01",
    tag: "Craft",
    minutes: 8,
    variant: "feature-image",
    pinned: true,
    excerpt:
      "Real-time comments feel productive, but the best critique happens after a beat of silence. We reviewed forty recorded sessions to find out when the notes that actually shipped were written.",
    imageSeed: "loupe-01",
    imageAlt: "A creative director annotating a paused video frame on a large studio monitor.",
  },
  {
    id: "p2",
    title: "Async critique doesn't have to mean slow critique",
    monthGroup: "July 2026",
    dateLabel: "Jul 22, 2026",
    dateISO: "2026-07-22",
    tag: "Remote Teams",
    minutes: 6,
    variant: "compact-image",
    excerpt:
      "Five habits that cut our own design review cycle from four days to under thirty-six hours, without adding a single new meeting.",
    imageSeed: "loupe-02",
    imageAlt: "A laptop screen showing a threaded comment list beside a design mockup.",
  },
  {
    id: "p3",
    title: "How a 200-person studio replaced six review tools with one shared timeline",
    monthGroup: "July 2026",
    dateLabel: "Jul 15, 2026",
    dateISO: "2026-07-15",
    tag: "Case Studies",
    minutes: 11,
    variant: "feature-image",
    excerpt:
      "Six tools became one after Fernwood Studio traced every missed deadline back to feedback that had arrived in the wrong app, days too late.",
    imageSeed: "loupe-03",
    imageAlt: "A studio wall covered in printed storyboard frames arranged in a timeline.",
  },
  {
    id: "p4",
    title: "Version stacking is now live for video and motion files",
    monthGroup: "July 2026",
    dateLabel: "Jul 8, 2026",
    dateISO: "2026-07-08",
    tag: "Product",
    minutes: 4,
    variant: "compact",
    excerpt:
      "Compare up to six cuts side by side, scrub them in lockstep, and drop a single frame-accurate comment that follows the edit across every version.",
  },
  {
    id: "p5",
    title: "Why we rebuilt our frame-accurate scrubber from scratch",
    monthGroup: "June 2026",
    dateLabel: "Jun 27, 2026",
    dateISO: "2026-06-27",
    tag: "Engineering",
    minutes: 9,
    variant: "compact-image",
    excerpt:
      "The old player drifted by up to four frames on long timelines. Here is the buffering model that got us back to zero drift.",
    imageSeed: "loupe-05",
    imageAlt: "Close-up of a video editing timeline with waveform and frame markers.",
  },
  {
    id: "p6",
    title: "Good feedback names the problem, not the fix",
    monthGroup: "June 2026",
    dateLabel: "Jun 18, 2026",
    dateISO: "2026-06-18",
    tag: "Craft",
    minutes: 7,
    variant: "feature-quote",
    quote: "The moment a reviewer writes “make it pop,” the file is already worse off than before they opened it.",
    excerpt:
      "We studied six months of comment threads across our own client base and found the notes that shipped fastest shared one trait: they described what was wrong and let the maker solve it.",
  },
  {
    id: "p7",
    title: "A time-zone-proof rhythm for weekly design reviews",
    monthGroup: "June 2026",
    dateLabel: "Jun 10, 2026",
    dateISO: "2026-06-10",
    tag: "Remote Teams",
    minutes: 5,
    variant: "compact",
    excerpt:
      "No meeting, three time zones, one deadline. The recorded-walkthrough format that finally stuck for our own team.",
  },
  {
    id: "p8",
    title: "Mobile review is out of beta",
    monthGroup: "June 2026",
    dateLabel: "Jun 3, 2026",
    dateISO: "2026-06-03",
    tag: "Product",
    minutes: 3,
    variant: "compact-image",
    excerpt:
      "Approve a comp from a train platform. Every gesture syncs back to the same thread your desktop team is already reading.",
    imageSeed: "loupe-08",
    imageAlt: "A hand holding a phone displaying a design approval screen.",
  },
  {
    id: "p9",
    title: "Inside the pitch deck that got Fernwood Studio its biggest client",
    monthGroup: "May 2026",
    dateLabel: "May 26, 2026",
    dateISO: "2026-05-26",
    tag: "Case Studies",
    minutes: 10,
    variant: "feature-image",
    excerpt:
      "Forty-one comment rounds, three formats, one deadline that never moved. A look at how a six-person agency ran the highest-stakes review of its year.",
    imageSeed: "loupe-09",
    imageAlt: "A small agency team gathered around a printed pitch deck spread across a table.",
  },
  {
    id: "p10",
    title: "The critique sandwich is dead. Here's what replaced it",
    monthGroup: "May 2026",
    dateLabel: "May 19, 2026",
    dateISO: "2026-05-19",
    tag: "Craft",
    minutes: 6,
    variant: "compact",
    excerpt:
      "Praise, problem, praise was never really about kindness — it just slowed teams down. What our best reviewers do instead.",
  },
  {
    id: "p11",
    title: "Notifications that respect a maker's focus time",
    monthGroup: "May 2026",
    dateLabel: "May 12, 2026",
    dateISO: "2026-05-12",
    tag: "Engineering",
    minutes: 5,
    variant: "compact-image",
    excerpt:
      "We rebuilt our alert system around one rule: nothing interrupts a block of focus time except a note from your own reviewer.",
    imageSeed: "loupe-11",
    imageAlt: "A desk setup with a notifications panel dimmed in the corner of a monitor.",
  },
  {
    id: "p12",
    title: "Running a design crit across four continents",
    monthGroup: "May 2026",
    dateLabel: "May 5, 2026",
    dateISO: "2026-05-05",
    tag: "Remote Teams",
    minutes: 7,
    variant: "compact",
    excerpt:
      "A distributed illustration team on handing critique forward like a relay baton, one waking time zone at a time.",
  },
  {
    id: "p13",
    title: "Custom fields for review requests are here",
    monthGroup: "April 2026",
    dateLabel: "Apr 28, 2026",
    dateISO: "2026-04-28",
    tag: "Product",
    minutes: 3,
    variant: "compact-image",
    excerpt:
      "Tag a round with a deadline, a client name, or a priority level, then filter your whole queue by any of them.",
    imageSeed: "loupe-13",
    imageAlt: "A queue of review request cards labeled with colored priority tags.",
  },
  {
    id: "p14",
    title: "Every review is a small negotiation about taste",
    monthGroup: "April 2026",
    dateLabel: "Apr 20, 2026",
    dateISO: "2026-04-20",
    tag: "Craft",
    minutes: 8,
    variant: "feature-quote",
    quote: "Nobody owes their opinion instant deference just because they said it first.",
    excerpt:
      "On separating a reviewer's authority from their taste, and why the best creative leads make that distinction explicit before the first comment ever lands.",
  },
];

export const INITIAL_VISIBLE = 8;
export const LOAD_STEP = 6;

export type MostReadEntry = {
  rank: number;
  postId: string;
  reads: number;
};

export const MOST_READ_WEEK: MostReadEntry[] = [
  { rank: 1, postId: "p1", reads: 3120 },
  { rank: 2, postId: "p4", reads: 2460 },
  { rank: 3, postId: "p2", reads: 2115 },
  { rank: 4, postId: "p8", reads: 1780 },
  { rank: 5, postId: "p5", reads: 1440 },
];

export const MOST_READ_MONTH: MostReadEntry[] = [
  { rank: 1, postId: "p3", reads: 9840 },
  { rank: 2, postId: "p6", reads: 8215 },
  { rank: 3, postId: "p1", reads: 7660 },
  { rank: 4, postId: "p9", reads: 6390 },
  { rank: 5, postId: "p10", reads: 5205 },
];

export const CONTRIBUTOR_COUNT = 12;
export const TOTAL_POST_COUNT = POSTS.length;
