// Shared sentiment -> icon/color mapping so the word cloud, the frequency
// table and the KPI strip all use the exact same visual language for a given
// sentiment. Color conveys sentiment, but every usage below pairs it with the
// matching icon or text label too — never color alone.
import { Smile, Meh, Frown } from "lucide-react";
import type { Sentiment } from "./data";

export const SENTIMENT_ICON: Record<Sentiment, typeof Smile> = {
  positive: Smile,
  neutral: Meh,
  negative: Frown,
};

/** Text color classes — each independently AA-checked against zinc-950/zinc-900. */
export const SENTIMENT_TEXT_CLASS: Record<Sentiment, string> = {
  positive: "text-teal-300",
  neutral: "text-zinc-300",
  negative: "text-rose-300",
};

/** Word-cloud tile background + border treatment per sentiment. */
export const SENTIMENT_TILE_CLASS: Record<Sentiment, string> = {
  positive: "border-teal-500/30 bg-teal-500/10 text-teal-300",
  neutral: "border-white/15 bg-white/5 text-zinc-300",
  negative: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

/** Solid fill classes for the Progress mini-bars. */
export const SENTIMENT_FILL_CLASS: Record<Sentiment, string> = {
  positive: "bg-teal-400",
  neutral: "bg-zinc-400",
  negative: "bg-rose-400",
};

export const SENTIMENT_BADGE_TONE: Record<Sentiment, "positive" | "neutral" | "negative"> = {
  positive: "positive",
  neutral: "neutral",
  negative: "negative",
};
