"use client";

import { useMemo, useState } from "react";
import {
  getWordsForPeriod,
  PERIODS,
  PERIOD_LABEL,
  SECTION_IDS,
  SENTIMENT_LABEL,
  type Period,
  type Sentiment,
} from "./data";
import { Card, CardTitle } from "./ui";
import { SegmentedControl, type SegmentedOption } from "./segmented-control";
import { WordCloud } from "./word-cloud";
import { FrequencyTable } from "./frequency-table";

const NUMBER_FORMAT = new Intl.NumberFormat("en-US");

const PERIOD_OPTIONS: SegmentedOption<Period>[] = PERIODS.map((p) => ({
  value: p,
  label: p.toUpperCase(),
  ariaLabel: PERIOD_LABEL[p],
}));

type SentimentFilter = "all" | Sentiment;

const SENTIMENT_OPTIONS: SegmentedOption<SentimentFilter>[] = [
  { value: "all", label: "All" },
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negative" },
];

/**
 * Owns the one selection mechanism this page uses: a sentiment filter that
 * recomputes the word cloud and the frequency table together, from the same
 * filtered array, in place. No second, competing selection axis is layered
 * on top (see the route's concept notes for why).
 */
export function FeedbackExplorer() {
  const [period, setPeriod] = useState<Period>("30d");
  const [sentiment, setSentiment] = useState<SentimentFilter>("all");

  const periodWords = useMemo(() => getWordsForPeriod(period), [period]);

  const filteredWords = useMemo(() => {
    if (sentiment === "all") return periodWords;
    return periodWords.filter((w) => w.sentiment === sentiment);
  }, [periodWords, sentiment]);

  const viewTotal = useMemo(() => filteredWords.reduce((sum, w) => sum + w.count, 0), [filteredWords]);

  const filterSuffix =
    sentiment === "all" ? "all sentiments" : `${SENTIMENT_LABEL[sentiment]} only`;
  const captionSuffix = `${PERIOD_LABEL[period]}, ${filterSuffix}`;

  return (
    <section id={SECTION_IDS.explorer} aria-labelledby="explorer-heading" className="mt-8 min-w-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h2 id="explorer-heading" className="text-base font-bold tracking-tight text-zinc-50">
            Mentions Explorer
          </h2>
          <p className="mt-1 text-sm font-normal tabular-nums text-zinc-400">
            {NUMBER_FORMAT.format(viewTotal)} mentions across {filteredWords.length} word
            {filteredWords.length === 1 ? "" : "s"} · {captionSuffix}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SegmentedControl
            options={PERIOD_OPTIONS}
            value={period}
            onChange={setPeriod}
            ariaLabel="Select time period"
          />
          <SegmentedControl
            options={SENTIMENT_OPTIONS}
            value={sentiment}
            onChange={setSentiment}
            ariaLabel="Filter by sentiment"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 min-w-0 lg:col-span-6">
          <Card id={SECTION_IDS.wordCloud}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <CardTitle id="word-cloud-heading">Word Cloud</CardTitle>
              <span className="hidden text-xs font-normal text-zinc-400 sm:inline">
                Size = frequency · Color = sentiment
              </span>
            </div>
            <div aria-labelledby="word-cloud-heading">
              <WordCloud words={filteredWords} />
            </div>
          </Card>
        </div>

        <div className="col-span-12 min-w-0 lg:col-span-6">
          <Card id={SECTION_IDS.frequencyTable}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <CardTitle id="frequency-table-heading">Frequency List</CardTitle>
              <span className="text-xs font-normal text-zinc-400">Exact counts</span>
            </div>
            <FrequencyTable words={filteredWords} captionSuffix={captionSuffix} />
          </Card>
        </div>
      </div>
    </section>
  );
}
