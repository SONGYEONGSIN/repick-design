"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ScanLine } from "lucide-react";

import {
  ACCENT,
  CAPTION,
  DEFAULT_LISTING,
  DEFAULT_MARK,
  DEFAULT_MODE,
  EYEBROW,
  FOCUS,
  FOCUS_TIGHT,
  LISTINGS,
  MODES,
  SOURCES,
  type Listing,
  type Mark,
  type ViewMode,
  cx,
  discountVsRetail,
  fairPrice,
  gap,
  markById,
  money,
  signedMoney,
  tally,
} from "./data";

/**
 * The hero. One fold holds four surfaces that all recompute together:
 *
 *   1. the marked-up document,      2. the price ledger the marks add up to,
 *   3. the evidence for one mark,   4. four fully tagged listings that are also the switcher.
 *
 * Nothing here is hidden behind a scroll or a hover. The divergence — a struck sentence sitting
 * next to its verified replacement — is the resting state, and every control strengthens it rather
 * than revealing it.
 */
export default function RedlineHero() {
  const reduced = useReducedMotion();
  const [listingId, setListingId] = useState(DEFAULT_LISTING);
  const [mode, setMode] = useState<ViewMode>(DEFAULT_MODE);
  const [markId, setMarkId] = useState(DEFAULT_MARK);
  const [announcement, setAnnouncement] = useState("");

  const listing = useMemo(
    () => LISTINGS.find((l) => l.id === listingId) ?? LISTINGS[0],
    [listingId],
  );
  const mark = markById(listing, markId);
  const fair = fairPrice(listing);
  const spread = gap(listing);
  const counts = tally(listing);

  function selectListing(next: Listing) {
    setListingId(next.id);
    setMarkId(next.marks[1]?.id ?? next.marks[0].id);
    setAnnouncement(
      `Now marking up ${next.title}. ${tally(next).checked} claims checked, verified price ${money(fairPrice(next))}.`,
    );
  }

  function selectMark(next: Mark) {
    setMarkId(next.id);
    setAnnouncement(
      `Evidence for ${next.struck}. Source ${SOURCES[next.source].label}, confidence ${next.confidence} percent, price effect ${signedMoney(next.delta)}.`,
    );
  }

  function selectMode(next: ViewMode) {
    setMode(next);
    setAnnouncement(
      next === "listed"
        ? "Showing the description as the seller wrote it."
        : next === "verified"
          ? `Showing the verified description. Verified price ${money(fair)}.`
          : "Showing the redline: struck text beside its verified replacement.",
    );
  }

  const modeHint = MODES.find((m) => m.id === mode)?.hint ?? "";
  const footnote =
    mode === "verified" && counts.removed > 0
      ? `${counts.removed} claim was struck with no replacement and does not appear above.`
      : mode === "listed"
        ? "Nothing above has been checked. This is the listing every other marketplace would show you."
        : modeHint;

  return (
    <section aria-labelledby="hero-title" className="border-b border-[#E4E1DA]">
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className="mx-auto w-full max-w-[1180px] px-5 pb-10 pt-8 sm:px-6 md:px-8 md:pb-14 md:pt-10">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-x-10">
          {/* ---------------------------------------------------------------- headline + document */}
          <div className="order-1 min-w-0 lg:col-span-7">
            <p
              className={cx(EYEBROW, "animate-[rise_500ms_ease-out_backwards] text-[#5B5862] motion-reduce:animate-none")}
            >
              repick - listing inspection
            </p>

            <h1
              id="hero-title"
              style={{ fontFamily: "var(--font-display-wide)" }}
              className="mt-3 animate-[rise_560ms_ease-out_60ms_backwards] text-[clamp(1.85rem,4.1vw,2.9rem)] font-bold leading-[1.06] tracking-[-0.02em] text-[#141317] motion-reduce:animate-none"
            >
              We do not summarise the listing.
              <br />
              We mark it up.
            </h1>

            <p className="mt-3 max-w-[560px] animate-[rise_600ms_ease-out_120ms_backwards] text-[0.95rem] leading-[1.6] text-[#5B5862] motion-reduce:animate-none sm:text-base">
              Every claim a seller makes is checked against their own photographs, the maker&rsquo;s
              records and ninety days of closed trades. What did not survive is struck. What replaced
              it is priced.
            </p>

            <div className="mt-5 animate-[rise_640ms_ease-out_180ms_backwards] motion-reduce:animate-none">
              <ModeSwitch mode={mode} onSelect={selectMode} />
            </div>

            {/* the document itself */}
            <article className="mt-4 animate-[rise_680ms_ease-out_220ms_backwards] rounded-lg border border-[#E4E1DA] bg-white motion-reduce:animate-none">
              <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[#E4E1DA] px-4 py-3 sm:px-5">
                <h2 className="min-w-0 text-[0.95rem] font-semibold tracking-[-0.01em] text-[#141317]">
                  {listing.brand} <span className="text-[#5B5862]">/</span> {listing.title}
                </h2>
                <p className={cx(CAPTION, "text-[#5B5862]")}>
                  {listing.posted}
                </p>
              </header>

              <div className="px-4 py-5 sm:px-5">
                <p className="max-w-[600px] text-[1.0625rem] leading-[2.05] text-[#141317]">
                  {listing.body.map((part, index) =>
                    typeof part === "string" ? (
                      <span key={`text-${index}`}>{part}</span>
                    ) : (
                      <MarkSpan
                        key={part.mark}
                        mark={markById(listing, part.mark)}
                        mode={mode}
                        selected={markId === part.mark}
                        onSelect={selectMark}
                      />
                    ),
                  )}
                </p>

                <p className="mt-4 border-t border-dashed border-[#E4E1DA] pt-3 text-[0.8125rem] leading-[1.55] text-[#5B5862]">
                  {footnote}
                </p>
              </div>

              <footer className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-[#E4E1DA] bg-[#FAF9F6] px-4 py-2.5 sm:px-5">
                <TallyItem value={counts.checked} label="claims checked" />
                <TallyItem value={counts.confirmed} label="confirmed" />
                <TallyItem value={counts.rewritten} label="rewritten" />
                <TallyItem value={counts.removed} label="struck out" />
              </footer>
            </article>
          </div>

          {/* ---------------------------------------------------------------- ledger + evidence */}
          <div className="order-2 min-w-0 lg:col-span-5">
            <div className="animate-[rise_700ms_ease-out_260ms_backwards] rounded-lg border border-[#E4E1DA] bg-white p-4 motion-reduce:animate-none sm:p-5">
              <h2 className={cx(CAPTION, "text-[#5B5862]")}>Where the marks land</h2>

              <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2">
                <p className="flex flex-col">
                  <span className="text-[0.75rem] text-[#5B5862]">Seller asks</span>
                  <span
                    className={cx(
                      "text-[1.35rem] tabular-nums leading-tight text-[#5B5862]",
                      mode !== "listed" && "line-through decoration-[#BE123C] decoration-2",
                    )}
                  >
                    {money(listing.asking)}
                  </span>
                </p>
                <ArrowRight aria-hidden="true" className="mb-1.5 size-4 shrink-0 text-[#5B5862]" />
                <p className="flex flex-col">
                  <span className="text-[0.75rem] text-[#5B5862]">Verified value</span>
                  <span
                    style={{ fontFamily: "var(--font-display-wide)" }}
                    className="text-[2.1rem] font-bold tabular-nums leading-none tracking-[-0.02em] text-[#141317]"
                  >
                    {money(fair)}
                  </span>
                </p>
              </div>

              <p
                className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold text-white"
                style={{ backgroundColor: ACCENT }}
              >
                {spread >= 0 ? (
                  <Minus aria-hidden="true" className="size-3.5" />
                ) : (
                  <Plus aria-hidden="true" className="size-3.5" />
                )}
                <span className="tabular-nums">{money(spread)}</span>
                <span>{spread >= 0 ? "over verified value" : "under verified value"}</span>
              </p>

              <ul role="list" className="mt-4 border-t border-[#E4E1DA]">
                {listing.marks.map((entry) => {
                  const active = entry.id === markId;
                  return (
                    <li key={entry.id} className="border-b border-[#E4E1DA] last:border-b-0">
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => selectMark(entry)}
                        className={cx(
                          "flex w-full items-center gap-2 px-1.5 py-2 text-left transition-colors duration-150 motion-reduce:transition-none",
                          active ? "bg-[#FFF1F2]" : "bg-transparent hover:bg-[#FAF9F6]",
                          FOCUS,
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-[#141317]">
                          {entry.kind === "confirmed" ? (
                            <Check aria-hidden="true" className="mr-1 inline size-3.5 align-[-2px] text-[#141317]" />
                          ) : null}
                          {entry.struck.trim().replace(/^,\s*/, "")}
                        </span>
                        <span
                          className={cx(
                            "shrink-0 text-[0.8125rem] font-semibold tabular-nums",
                            entry.delta === 0 ? "text-[#5B5862]" : "text-[#BE123C]",
                          )}
                        >
                          {signedMoney(entry.delta)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <EvidencePanel mark={mark} reduced={Boolean(reduced)} />

            <a
              href="#picks"
              className={cx(
                "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-px motion-reduce:transition-none sm:w-auto",
                FOCUS,
              )}
              style={{ backgroundColor: ACCENT }}
            >
              See tonight&rsquo;s redlined picks
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>

          {/* ---------------------------------------------------------------- the four listings */}
          <div id="picks" className="order-3 min-w-0 scroll-mt-24 lg:col-span-12">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[#141317]">
                Four listings, each already marked up
              </h2>
              <p className="text-[0.8125rem] text-[#5B5862]">
                Select one to load its redline above
              </p>
            </div>

            <ul role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {LISTINGS.map((entry) => (
                <li key={entry.id} className="min-w-0">
                  <ListingCard
                    listing={entry}
                    selected={entry.id === listing.id}
                    onSelect={selectListing}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------ */

function TallyItem({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-[0.9rem] font-semibold tabular-nums text-[#141317]">{value}</span>
      <span className="text-[0.75rem] text-[#5B5862]">{label}</span>
    </span>
  );
}

function ModeSwitch({
  mode,
  onSelect,
}: {
  mode: ViewMode;
  onSelect: (next: ViewMode) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-md border border-[#E4E1DA] bg-white p-1">
      {MODES.map((entry) => {
        const active = entry.id === mode;
        return (
          <button
            key={entry.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(entry.id)}
            className={cx(
              "rounded px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors duration-150 motion-reduce:transition-none",
              active ? "text-white" : "text-[#5B5862] hover:bg-[#FAF9F6] hover:text-[#141317]",
              FOCUS,
            )}
            style={active ? { backgroundColor: ACCENT } : undefined}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * One mark inside the running sentence.
 *
 * It stays a button in every mode so the mechanism never moves under the reader — except a
 * `removed` mark in the verified reading, which renders nothing at all, because a button with no
 * visible text has no accessible name. The clause it struck is written so the sentence still reads
 * without it.
 *
 * Vertical padding is deliberate: an inline element's hit box is its content box, roughly the font
 * size, which lands under the 24x24 pointer-target minimum. The padding widens the box without
 * changing the line box, so the paragraph's 2.05 leading still contains it.
 */
function MarkSpan({
  mark,
  mode,
  selected,
  onSelect,
}: {
  mark: Mark;
  mode: ViewMode;
  selected: boolean;
  onSelect: (mark: Mark) => void;
}) {
  if (mode === "verified" && mark.kind === "removed") return null;

  const showStruck = mode !== "verified";
  const showInserted = mode !== "listed" && mark.inserted !== null;
  const plain = mode === "listed";

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(mark)}
      className={cx(
        "inline cursor-pointer rounded-[3px] px-1 py-1.5 text-left transition-colors duration-150 motion-reduce:transition-none",
        selected ? "bg-[#FFF1F2]" : "bg-transparent hover:bg-[#FAF9F6]",
        FOCUS_TIGHT,
      )}
    >
      {mark.kind === "confirmed" ? (
        <span
          className={cx(
            "text-[#141317]",
            !plain && "underline decoration-[#141317] decoration-dotted decoration-1 underline-offset-4",
          )}
        >
          {mark.struck}
          {!plain ? (
            <Check aria-hidden="true" className="ml-1 inline size-4 align-[-3px] text-[#141317]" />
          ) : null}
        </span>
      ) : (
        <>
          {showStruck ? (
            plain ? (
              <span className="text-[#141317]">{mark.struck}</span>
            ) : (
              <del className="text-[#BE123C] line-through decoration-[#BE123C] decoration-2">
                {mark.struck}
              </del>
            )
          ) : null}
          {showInserted ? (
            <ins
              className={cx(
                "text-[#141317] underline decoration-[#BE123C] decoration-2 underline-offset-4",
                showStruck && "ml-1.5",
              )}
            >
              {mark.inserted}
            </ins>
          ) : null}
          {mode === "redline" && mark.kind === "removed" ? (
            <span className="ml-1.5 rounded-[3px] px-1.5 py-0.5 align-[1px] text-[0.7rem] font-semibold text-white" style={{ backgroundColor: ACCENT }}>
              struck out
            </span>
          ) : null}
        </>
      )}
    </button>
  );
}

/** The evidence behind whichever mark is selected: source, method, confidence, price effect. */
function EvidencePanel({ mark, reduced }: { mark: Mark; reduced: boolean }) {
  const source = SOURCES[mark.source];

  return (
    <div className="mt-4 rounded-lg border border-[#E4E1DA] bg-white p-4 sm:p-5">
      <h3 className={cx(CAPTION, "flex items-center gap-1.5 text-[#5B5862]")}>
        <ScanLine aria-hidden="true" className="size-3.5" />
        Evidence for this mark
      </h3>

      <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className="rounded-full px-2.5 py-1 text-[0.72rem] font-semibold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          {source.label}
        </span>
        <span className="text-[0.78rem] text-[#5B5862]">{source.blurb}</span>
      </p>

      <p className="mt-3 max-w-[520px] text-[0.9rem] leading-[1.6] text-[#141317]">{mark.method}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="min-w-[180px] flex-1">
          <p className="flex items-baseline justify-between gap-2">
            <span className="text-[0.75rem] text-[#5B5862]">Confidence</span>
            <span className="text-[0.8125rem] font-semibold tabular-nums text-[#141317]">
              {mark.confidence}%
            </span>
          </p>
          {/* Transform-only: the bar scales on the compositor rather than animating `width`, which
              would relayout on every frame (motion catalogue, "transform 성능"). */}
          <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-[#E4E1DA]">
            <motion.span
              className="block h-full w-full origin-left rounded-full"
              style={{ backgroundColor: ACCENT }}
              initial={false}
              animate={{ scaleX: mark.confidence / 100 }}
              transition={{ duration: reduced ? 0 : 0.32, ease: "easeOut" }}
            />
          </span>
        </div>

        <div>
          <p className="text-[0.75rem] text-[#5B5862]">Price effect</p>
          <p
            className={cx(
              "text-[1.1rem] font-semibold tabular-nums leading-tight",
              mark.delta === 0 ? "text-[#5B5862]" : "text-[#BE123C]",
            )}
          >
            {signedMoney(mark.delta)}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * A preview card. Match, grade, seller verification and discount are all printed at rest — no
 * hover, no overlay on top of anything that could fail to load.
 */
function ListingCard({
  listing,
  selected,
  onSelect,
}: {
  listing: Listing;
  selected: boolean;
  onSelect: (listing: Listing) => void;
}) {
  const fair = fairPrice(listing);
  const off = discountVsRetail(listing);
  const counts = tally(listing);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(listing)}
      className={cx(
        "flex h-full w-full flex-col gap-2.5 rounded-lg border p-3.5 text-left transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none",
        selected ? "border-[#BE123C] bg-[#FFF1F2]" : "border-[#E4E1DA] bg-white hover:border-[#C9C5BC]",
        FOCUS,
      )}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className={cx(CAPTION, "text-[#5B5862]")}>{listing.category}</span>
        <span className="text-[0.72rem] font-semibold tabular-nums text-[#141317]">
          {listing.matchPct}% match
        </span>
      </span>

      <span className="min-w-0">
        <span className="block truncate text-[0.9rem] font-semibold tracking-[-0.01em] text-[#141317]">
          {listing.title}
        </span>
        <span className="block truncate text-[0.78rem] text-[#5B5862]">{listing.brand}</span>
      </span>

      <span className="flex flex-wrap gap-1.5">
        <span className="rounded border border-[#E4E1DA] bg-[#FAF9F6] px-1.5 py-0.5 text-[0.7rem] text-[#141317]">
          Grade {listing.grade}
        </span>
        <span className="inline-flex items-center gap-1 rounded border border-[#E4E1DA] bg-[#FAF9F6] px-1.5 py-0.5 text-[0.7rem] text-[#141317]">
          <Check aria-hidden="true" className="size-3" />
          {listing.seller}
        </span>
      </span>

      <span className="block text-[0.75rem] leading-[1.5] text-[#5B5862]">
        {listing.gradeNote}. {listing.matchReason}.
      </span>

      <span className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-[#E4E1DA] pt-2.5">
        <span className="text-[1.05rem] font-semibold tabular-nums text-[#141317]">
          {money(fair)}
        </span>
        <span className="text-[0.78rem] tabular-nums text-[#5B5862] line-through decoration-[#BE123C]">
          {money(listing.retail)}
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[0.7rem] font-semibold tabular-nums text-white"
          style={{ backgroundColor: ACCENT }}
        >
          {off}% off
        </span>
      </span>

      <span className="block text-[0.72rem] tabular-nums text-[#5B5862]">
        {counts.checked} claims checked - {counts.rewritten} rewritten - {listing.sellerMeta}
      </span>
    </button>
  );
}
