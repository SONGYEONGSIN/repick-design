/**
 * Nudge — deterministic dummy data for the survey/form builder.
 * No Math.random / Date.now anywhere. All counts are fixed seed integers whose funnel totals
 * reconcile: entering[n+1] === entering[n] - dropoff[n] for every question in order.
 */

import type { LucideIcon } from "lucide-react";
import { AlignLeft, ClipboardList, Gauge, Inbox, LayoutTemplate, ListChecks, Plug, Settings, Star } from "lucide-react";

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/* --------------------------------------------------------------- Brand */

export const BRAND = { name: "Nudge", tagline: "Forms that read the room" };

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces`;
}

export type Workspace = { id: string; name: string; plan: string };

export const WORKSPACES: Workspace[] = [
  { id: "ws-northwind", name: "Northwind Product", plan: "Growth plan" },
  { id: "ws-sandbox", name: "Sandbox", plan: "Free plan" },
];

/** Fictional persona — never real session data. */
export const CURRENT_USER = {
  name: "Talia Brennan",
  role: "Product Manager",
  email: "talia.brennan@nudgeforms.io",
  avatarId: "1580489944761-15a19d654956",
};

/* -------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "overview", label: "Overview", Icon: Settings, disabled: true },
      { id: "inbox", label: "Response inbox", Icon: Inbox, disabled: true },
    ],
  },
  {
    id: "build",
    title: "Build",
    items: [
      { id: "surveys", label: "Surveys", Icon: ClipboardList, active: true },
      { id: "templates", label: "Templates", Icon: LayoutTemplate, disabled: true },
      { id: "integrations", label: "Integrations", Icon: Plug, disabled: true },
    ],
  },
];

/* ------------------------------------------------------------ Survey meta */

export const SURVEY = {
  title: "Onboarding Pulse Survey",
  audience: "Sent to Product & Growth workspace members after their first 14 active days",
  status: "Live" as const,
};

/* --------------------------------------------------------------- Questions */

export type QuestionType = "nps" | "multiple_choice" | "rating" | "short_text";

export const QUESTION_TYPE_META: Record<QuestionType, { label: string; Icon: LucideIcon }> = {
  nps: { label: "NPS score", Icon: Gauge },
  multiple_choice: { label: "Multiple choice", Icon: ListChecks },
  rating: { label: "Rating", Icon: Star },
  short_text: { label: "Short text", Icon: AlignLeft },
};

export type LogicBranch = { conditionLabel: string; targetId: string; arc?: "above" | "below" };

export type Question = {
  id: string;
  type: QuestionType;
  label: string;
  prompt: string;
  helperText?: string;
  options?: string[];
  placeholder?: string;
  required: boolean;
  /** Respondents who reached this question. Undefined = added at runtime, never published. */
  entering?: number;
  /** Respondents who left without answering/continuing. */
  dropoff?: number;
  logic?: LogicBranch[];
};

export const SURVEY_QUESTIONS: Question[] = [
  {
    id: "q1",
    type: "nps",
    label: "NPS score",
    prompt: "How likely are you to recommend Nudge to a colleague?",
    helperText: "0 = Not at all likely, 10 = Extremely likely",
    required: true,
    entering: 2400,
    dropoff: 180,
    logic: [
      { conditionLabel: "Score 0–6 (Detractor)", targetId: "q3", arc: "above" },
      { conditionLabel: "Score 9–10 (Promoter)", targetId: "q4", arc: "above" },
    ],
  },
  {
    id: "q2",
    type: "multiple_choice",
    label: "Reason for score",
    prompt: "What's the main reason for your score?",
    helperText: "Shown to Passives (score 7–8) only",
    options: ["Ease of use", "Customer support", "Missing features", "Price", "Something else"],
    required: false,
    entering: 2220,
    dropoff: 96,
  },
  {
    id: "q3",
    type: "short_text",
    label: "Open feedback",
    prompt: "Anything you'd like us to improve or fix?",
    placeholder: "Type your answer…",
    helperText: "Shown to Detractors, or after Q2",
    required: false,
    entering: 2124,
    dropoff: 240,
  },
  {
    id: "q4",
    type: "multiple_choice",
    label: "Discovery channel",
    prompt: "How did you hear about Nudge?",
    options: ["Search engine", "Social media", "Colleague referral", "Newsletter", "Other"],
    required: true,
    entering: 1884,
    dropoff: 54,
    logic: [{ conditionLabel: "Answer = “Other”", targetId: "q7", arc: "below" }],
  },
  {
    id: "q5",
    type: "rating",
    label: "Setup ease",
    prompt: "How easy was it to get started with Nudge?",
    helperText: "1 = Very difficult, 5 = Very easy",
    required: true,
    entering: 1830,
    dropoff: 402,
  },
  {
    id: "q6",
    type: "multiple_choice",
    label: "Role",
    prompt: "Which best describes your role?",
    options: ["Product manager", "Engineer", "Designer", "Founder / exec", "Other"],
    required: false,
    entering: 1428,
    dropoff: 88,
  },
  {
    id: "q7",
    type: "short_text",
    label: "Follow-up email",
    prompt: "Leave your email if we can follow up on your feedback.",
    placeholder: "you@company.com",
    helperText: "Optional — used only for follow-up",
    required: false,
    entering: 1340,
    dropoff: 150,
  },
];

/** completing = entering - dropoff (also the "entering" count of the next question in order). */
export function completing(q: Question): number | undefined {
  if (q.entering === undefined || q.dropoff === undefined) return undefined;
  return q.entering - q.dropoff;
}

/** Completion rate as a 0-100 percentage, one decimal, or undefined if never published. */
export function completionRatePct(q: Question): number | undefined {
  const c = completing(q);
  if (c === undefined || q.entering === undefined || q.entering === 0) return undefined;
  return round2((c / q.entering) * 1000) / 10;
}

export const nf = new Intl.NumberFormat("en-US");
export const pf1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Sensible defaults applied when a question's type is switched in the settings sub-panel. */
export function defaultsForType(type: QuestionType): Pick<Question, "options" | "placeholder" | "helperText"> {
  switch (type) {
    case "nps":
      return { options: undefined, placeholder: undefined, helperText: "0 = Not at all likely, 10 = Extremely likely" };
    case "multiple_choice":
      return { options: ["Option A", "Option B", "Option C"], placeholder: undefined, helperText: undefined };
    case "rating":
      return { options: undefined, placeholder: undefined, helperText: "1 = Very difficult, 5 = Very easy" };
    case "short_text":
      return { options: undefined, placeholder: "Type your answer…", helperText: undefined };
  }
}

/**
 * Deterministic id/label generator for questions added at runtime via the command palette.
 * `existingCount` (the current list length at call time) drives the sequence number so this
 * never depends on Math.random/Date.now or module-level mutable state.
 */
export function nextAddedQuestion(type: QuestionType, existingCount: number): Question {
  const n = existingCount + 1;
  return {
    id: `added-${n}`,
    type,
    label: `New question ${n}`,
    prompt: "Untitled question — edit this prompt before publishing.",
    required: false,
    ...defaultsForType(type),
    // entering/dropoff intentionally left undefined: "Not live yet", never published.
  };
}
