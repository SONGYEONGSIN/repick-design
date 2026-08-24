"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  LISTINGS,
  STYLES,
  money,
  negotiate,
  type Listing,
  type Message,
  type Outcome,
  type StyleId,
} from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6EE7B7]";
const STAT_LABEL = "text-[10px] font-medium tracking-[0.12em] text-[#A1A1AA]";

// ---------------------------------------------------------------- controls

export function ListingTabs({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Choose a listing">
      {LISTINGS.map((l) => {
        const on = l.id === activeId;
        return (
          <button
            key={l.id}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(l.id)}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium tracking-[-0.02em] transition-colors ${FOCUS} ${
              on
                ? "border-[#047857] bg-[#047857] text-white"
                : "border-white/15 bg-white/[0.02] text-white hover:border-white/35 hover:bg-white/[0.06]"
            }`}
          >
            {l.name}
          </button>
        );
      })}
    </div>
  );
}

export function TargetStepper({
  listing,
  value,
  onChange,
  id = "target-input",
}: {
  listing: Listing;
  value: number;
  onChange: (v: number) => void;
  id?: string;
}) {
  const step = listing.targetStep;
  const dec = () => onChange(Math.max(listing.targetMin, value - step));
  const inc = () => onChange(Math.min(listing.targetMax, value + step));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={STAT_LABEL}>
          YOUR CEILING
        </label>
        <span className={STAT_LABEL}>
          {money(listing.targetMin)}–{money(listing.targetMax)} RANGE
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          aria-label={`Lower ceiling by ${money(step)}`}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.02] text-[18px] font-medium text-white transition-colors hover:border-white/35 hover:bg-white/[0.06] ${FOCUS}`}
        >
          &minus;
        </button>
        <div className="relative flex-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[19px] font-medium text-[#A1A1AA]"
          >
            $
          </span>
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={listing.targetMin}
            max={listing.targetMax}
            step={step}
            value={value}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) onChange(Math.min(listing.targetMax, Math.max(listing.targetMin, n)));
            }}
            className={`w-full rounded-xl border border-white/15 bg-white/[0.02] py-2.5 pl-8 pr-3 text-[19px] font-medium tabular-nums text-white ${FOCUS}`}
            style={{ fontFamily: "var(--font-display-mono)" }}
          />
        </div>
        <button
          type="button"
          onClick={inc}
          aria-label={`Raise ceiling by ${money(step)}`}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.02] text-[18px] font-medium text-white transition-colors hover:border-white/35 hover:bg-white/[0.06] ${FOCUS}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function StyleToggle({
  value,
  onChange,
}: {
  value: StyleId;
  onChange: (v: StyleId) => void;
}) {
  return (
    <div>
      <p className={STAT_LABEL}>NEGOTIATING STYLE</p>
      <div className="mt-2 grid grid-cols-2 gap-2" aria-label="Negotiating style">
        {STYLES.map((s) => {
          const on = s.id === value;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(s.id)}
              className={`rounded-xl border px-3.5 py-2.5 text-left transition-colors ${FOCUS} ${
                on
                  ? "border-[#047857] bg-[#047857]/15"
                  : "border-white/15 bg-white/[0.02] hover:border-white/35 hover:bg-white/[0.06]"
              }`}
            >
              <span className="block text-[13px] font-medium leading-tight text-white">
                {s.label}
              </span>
              <span className="mt-0.5 block text-[11px] font-normal leading-snug text-[#A1A1AA]">
                {s.blurb}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------- transcript

function AgentBubble({ m, reduce }: { m: Message; reduce: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-end">
      <div className="flex max-w-[86%] flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <span className={STAT_LABEL}>{m.time}</span>
          <span className="text-[10px] font-medium tracking-[0.12em] text-[#6EE7B7]">
            YOUR AGENT
          </span>
        </div>
        <p className="rounded-2xl rounded-tr-sm bg-[#047857] px-4 py-2.5 text-[14px] font-normal leading-[1.5] text-white">
          {m.text}
        </p>
        {m.tag ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={`rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-medium tracking-[0.1em] text-[#A1A1AA] transition-colors hover:border-[#6EE7B7]/60 hover:text-[#6EE7B7] ${FOCUS}`}
          >
            {open ? "REASONING ▴" : "WHY THIS NUMBER ▾"}
          </button>
        ) : null}
        <AnimatePresence initial={false}>
          {open ? (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0.01 : 0.18 } }}
              exit={{ opacity: 0, transition: { duration: reduce ? 0.01 : 0.12 } }}
              className="max-w-[240px] rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] font-normal leading-[1.5] text-[#A1A1AA]"
            >
              {m.tag}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SellerBubble({ m }: { m: Message }) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex max-w-[86%] flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium tracking-[0.12em] text-[#A1A1AA]">SELLER</span>
          <span className={STAT_LABEL}>{m.time}</span>
        </div>
        <p className="rounded-2xl rounded-tl-sm border border-white/12 bg-white/[0.05] px-4 py-2.5 text-[14px] font-normal leading-[1.5] text-white">
          {m.text}
        </p>
      </div>
    </div>
  );
}

export function TranscriptThread({
  messages,
  compact = false,
}: {
  messages: Message[];
  compact?: boolean;
}) {
  const reduce = Boolean(useReducedMotion());
  const shown = compact
    ? [messages[0], messages[messages.length - 2], messages[messages.length - 1]].filter(
        (m): m is Message => Boolean(m),
      )
    : messages;

  return (
    <div className="flex flex-col gap-3" aria-live="polite" aria-atomic="false">
      {compact ? (
        <p className="text-[11px] font-normal tracking-[0.02em] text-[#A1A1AA]">
          Excerpt — opening ask and closing moves. Full transcript below.
        </p>
      ) : null}
      {shown.map((m) =>
        m.from === "agent" ? (
          <AgentBubble key={m.id} m={m} reduce={reduce} />
        ) : (
          <SellerBubble key={m.id} m={m} />
        ),
      )}
    </div>
  );
}

export function OutcomeCard({ outcome, listing }: { outcome: Outcome; listing: Listing }) {
  if (outcome.dealMade && outcome.price !== null) {
    return (
      <div
        className="rounded-xl border border-[#047857]/60 bg-[#047857]/12 p-4 sm:p-5"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[10px] font-medium tracking-[0.12em] text-[#6EE7B7]">
            SETTLED
          </span>
          <span className="text-[10px] font-medium tracking-[0.12em] text-[#6EE7B7]">
            {outcome.ceilingHeadroomPct}% UNDER CEILING
          </span>
        </div>
        <p
          className="mt-2 text-[clamp(1.9rem,5.6vw,2.6rem)] font-extrabold leading-none tracking-[-0.02em] tabular-nums text-white"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          {money(outcome.price)}
        </p>
        <p className="mt-2 text-[13px] font-normal leading-[1.6] text-[#A1A1AA]">
          {outcome.savingsVsAskPct}% below the {money(listing.ask)} ask ·{" "}
          {outcome.savingsVsRetailPct}% below {money(listing.retail)} retail
        </p>
      </div>
    );
  }
  return (
    <div
      className="rounded-xl border border-dashed border-white/25 bg-white/[0.03] p-4 sm:p-5"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[10px] font-medium tracking-[0.12em] text-white">NO DEAL</span>
        <span className="text-[10px] font-medium tracking-[0.12em] text-[#A1A1AA]">
          GAP {money(outcome.gapToFloor)}
        </span>
      </div>
      <p
        className="mt-2 text-[clamp(1.3rem,3.6vw,1.7rem)] font-extrabold leading-tight tracking-[-0.02em] text-white"
        style={{ fontFamily: "var(--font-display-mono)" }}
      >
        Ceiling too low
      </p>
      <p className="mt-2 text-[13px] font-normal leading-[1.6] text-[#A1A1AA]">{outcome.note}</p>
    </div>
  );
}

export function buildTranscript(listing: Listing, target: number, styleId: StyleId) {
  return negotiate(listing, target, styleId);
}
