"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import {
  LISTINGS,
  TAGS,
  BAR_RANGE,
  DRAG_PX_THRESHOLD,
  DRAG_VELOCITY_THRESHOLD,
  EXIT_DISTANCE,
  EXIT_DURATION,
  discountPct,
  displayedMatch,
  liveMessage,
  money,
  type Listing,
  type Profile,
  type SwipeDir,
  type SwipeRecord,
} from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]";
const STAT_LABEL = "text-[10px] font-semibold tracking-[0.12em] text-[#6B6B76]";

function ProofChips({ listing, match }: { listing: Listing; match: number }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="rounded-full bg-[#0F766E] px-2.5 py-1 text-[11px] font-semibold text-white">
        {match}% match
      </span>
      <span className="rounded-full border border-black/15 px-2.5 py-1 text-[11px] font-normal text-[#111114]">
        Grade {listing.grade} · {listing.gradeLabel}
      </span>
      <span className="rounded-full border border-[#0F766E]/40 bg-[#0F766E]/[0.08] px-2.5 py-1 text-[11px] font-normal text-[#0F766E]">
        Verified seller
      </span>
    </div>
  );
}

function PriceLine({ listing }: { listing: Listing }) {
  const pct = discountPct(listing);
  return (
    <div className="mt-3 flex flex-wrap items-baseline gap-2">
      <span className="text-[19px] font-extrabold tracking-[-0.02em] tabular-nums text-[#111114]">
        {money(listing.repick)} won
      </span>
      <span className="text-[13px] font-normal tabular-nums text-[#6B6B76] line-through">
        {money(listing.retail)} won
      </span>
      <span className="rounded-full border border-[#111114]/20 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#111114]">
        -{pct}%
      </span>
    </div>
  );
}

function CardBody({ listing, match }: { listing: Listing; match: number }) {
  return (
    <div className="p-4 sm:p-5">
      <p className="text-[11px] font-normal tracking-[0.02em] text-[#6B6B76]">
        {listing.category} · {listing.brand}
      </p>
      <p className="mt-1 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-[#111114]">
        {listing.title}
      </p>
      <ProofChips listing={listing} match={match} />
      <PriceLine listing={listing} />
    </div>
  );
}

type Trigger = { dir: SwipeDir; nonce: number } | null;

function TopCard({
  listing,
  match,
  trigger,
  onCommit,
  reduce,
}: {
  listing: Listing;
  match: number;
  trigger: Trigger;
  onCommit: (dir: SwipeDir) => void;
  reduce: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-9, 9]);
  const keepOpacity = useTransform(x, [24, 130], [0, 1]);
  const passOpacity = useTransform(x, [-130, -24], [1, 0]);
  const [locked, setLocked] = useState(false);
  const seenNonce = useRef(trigger?.nonce ?? -1);

  function commitFly(dir: SwipeDir) {
    setLocked(true);
    animate(x, dir === "keep" ? EXIT_DISTANCE : -EXIT_DISTANCE, {
      duration: reduce ? 0 : EXIT_DURATION,
      ease: [0.4, 0, 1, 1],
      onComplete: () => onCommit(dir),
    });
  }

  function snapBack() {
    animate(
      x,
      0,
      reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 },
    );
  }

  useEffect(() => {
    if (trigger && trigger.nonce !== seenNonce.current) {
      seenNonce.current = trigger.nonce;
      commitFly(trigger.dir);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger?.nonce]);

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (locked) return;
    const off = info.offset.x;
    const vel = info.velocity.x;
    if (off > DRAG_PX_THRESHOLD || vel > DRAG_VELOCITY_THRESHOLD) commitFly("keep");
    else if (off < -DRAG_PX_THRESHOLD || vel < -DRAG_VELOCITY_THRESHOLD) commitFly("pass");
    else snapBack();
  }

  return (
    <motion.div
      className={`absolute inset-0 z-20 touch-none select-none overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_40px_-20px_rgba(17,17,20,0.35)] ${
        locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"
      } ${FOCUS}`}
      style={{ x, rotate }}
      drag={locked ? false : "x"}
      dragMomentum={false}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={listing.image.src}
          alt={listing.image.alt}
          fill
          sizes="(min-width: 1024px) 380px, 90vw"
          className="object-cover"
          draggable={false}
        />
      </div>
      <CardBody listing={listing} match={match} />
      <motion.span
        aria-hidden="true"
        style={{ opacity: keepOpacity }}
        className="pointer-events-none absolute left-4 top-4 -rotate-6 rounded-md border-2 border-white bg-[#0F766E] px-3 py-1 text-[13px] font-extrabold tracking-[0.08em] text-white"
      >
        KEEP
      </motion.span>
      <motion.span
        aria-hidden="true"
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute right-4 top-4 rotate-6 rounded-md border-2 border-white bg-[#111114] px-3 py-1 text-[13px] font-extrabold tracking-[0.08em] text-white"
      >
        PASS
      </motion.span>
    </motion.div>
  );
}

export default function SwipeDeck({
  history,
  profile,
  onCommit,
  onUndo,
  onReset,
  reduce,
}: {
  history: SwipeRecord[];
  profile: Profile;
  onCommit: (dir: SwipeDir) => void;
  onUndo: () => void;
  onReset: () => void;
  reduce: boolean;
}) {
  const nonceRef = useRef(0);
  const [trigger, setTrigger] = useState<Trigger>(null);

  const deckIndex = history.length;
  const top = LISTINGS[deckIndex];
  const peek = LISTINGS[deckIndex + 1];
  const hasSliver = deckIndex + 2 < LISTINGS.length;
  const completed = deckIndex >= LISTINGS.length;

  function press(dir: SwipeDir) {
    if (completed) return;
    nonceRef.current += 1;
    setTrigger({ dir, nonce: nonceRef.current });
  }

  const message = liveMessage(history, profile);

  return (
    <div>
      <div className="relative mx-auto h-[420px] w-full max-w-[360px] sm:h-[440px]">
        {hasSliver && (
          <div
            aria-hidden="true"
            className="absolute inset-x-4 top-0 z-0 h-full translate-y-6 scale-[0.92] rounded-2xl border border-black/10 bg-[#F1F1EC] opacity-70"
          />
        )}
        {peek && (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 origin-top translate-y-3 scale-[0.96] overflow-hidden rounded-2xl border border-black/10 bg-white opacity-90 shadow-sm"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image src={peek.image.src} alt="" fill sizes="90vw" className="object-cover" />
            </div>
            <CardBody listing={peek} match={displayedMatch(peek, profile)} />
          </div>
        )}
        {top ? (
          <TopCard
            key={top.id}
            listing={top}
            match={displayedMatch(top, profile)}
            trigger={trigger}
            onCommit={onCommit}
            reduce={reduce}
          />
        ) : (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#6B6B76]">
              DECK COMPLETE
            </p>
            <p className="mt-3 max-w-[240px] text-[15px] font-normal leading-[1.6] text-[#111114]">
              You reviewed every nearby pick. The list below is now fully yours.
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => press("pass")}
          disabled={completed}
          className={`inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 text-[13px] font-semibold text-[#111114] transition-colors hover:border-black/30 hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS}`}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none">
            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Pass
        </button>
        <button
          type="button"
          onClick={() => press("keep")}
          disabled={completed}
          className={`inline-flex items-center gap-2 rounded-full bg-[#0F766E] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0C5F58] disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS}`}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none">
            <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Keep
        </button>
        <button
          type="button"
          onClick={onUndo}
          disabled={history.length === 0}
          className={`ml-1 rounded px-2 py-1 text-[12px] font-semibold text-[#6B6B76] underline decoration-dotted underline-offset-4 transition-colors hover:text-[#111114] disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline ${FOCUS}`}
        >
          Undo last
        </button>
      </div>

      <div className="mt-6 border-t border-black/10 pt-5">
        <div className="flex items-baseline justify-between">
          <p className={STAT_LABEL}>YOUR PROFILE</p>
          <p className={`${STAT_LABEL} tabular-nums`}>
            {history.length} OF {LISTINGS.length} REVIEWED
          </p>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {TAGS.map((t) => {
            const v = profile[t.id];
            const pct = Math.min(Math.abs(v) / BAR_RANGE, 1) * 50;
            return (
              <div key={t.id} className="flex items-center gap-3">
                <span className="w-[104px] shrink-0 text-[12px] font-normal text-[#111114]">
                  {t.label}
                </span>
                <div className="relative h-2 flex-1 rounded-full bg-black/[0.06]">
                  <div aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px bg-black/15" />
                  {v !== 0 && (
                    <div
                      aria-hidden="true"
                      className={`absolute inset-y-0 rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none ${
                        v > 0 ? "bg-[#0F766E]" : "bg-[#111114]/60"
                      }`}
                      style={
                        v > 0
                          ? { left: "50%", width: `${pct}%` }
                          : { right: "50%", width: `${pct}%` }
                      }
                    />
                  )}
                </div>
                <span className="w-[26px] text-right text-[12px] font-semibold tabular-nums text-[#111114]">
                  {v > 0 ? `+${v}` : v}
                </span>
              </div>
            );
          })}
        </div>

        <p
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 min-h-[2.6rem] text-[13px] font-normal leading-[1.6] text-[#6B6B76]"
        >
          {message}
        </p>

        {completed && (
          <button
            type="button"
            onClick={onReset}
            className={`mt-3 inline-flex rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold text-[#111114] transition-colors hover:border-black/30 hover:bg-black/[0.03] ${FOCUS}`}
          >
            Start over
          </button>
        )}
      </div>
    </div>
  );
}
