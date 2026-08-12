"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Ban,
  Camera,
  Check,
  Gauge,
  Scale,
  ShieldCheck,
  ShieldOff,
  Tag,
  Target,
} from "lucide-react";

import { GhostNumber } from "./Ghost";
import {
  BASELINE,
  BLOCKED_COUNT,
  GUARDRAILS,
  REASON_TEXT,
  formatWon,
  groupBoard,
  stateOf,
  summarize,
  warningLine,
  type CardState,
  type GuardrailId,
  type Listing,
} from "./data";

function guardrailIcon(id: GuardrailId, className: string) {
  if (id === "verification")
    return <ShieldCheck aria-hidden="true" className={className} />;
  if (id === "price") return <Scale aria-hidden="true" className={className} />;
  if (id === "condition")
    return <Gauge aria-hidden="true" className={className} />;
  return <Camera aria-hidden="true" className={className} />;
}

/**
 * Filled geometry, never outline. The brief bans line-art because it reads as blueprint filler,
 * and a photograph would put the load-bearing proof (grade, verification, price delta) inside a
 * raster that can fail to load. These marks are decoration; the data row underneath is the claim.
 */
function Mark({ variant, tone }: { variant: 0 | 1 | 2 | 3; tone: string }) {
  return (
    <svg
      viewBox="0 0 120 90"
      aria-hidden="true"
      focusable="false"
      className="h-full w-full"
    >
      <rect width="120" height="90" fill="#131318" />
      {variant === 0 ? (
        <>
          <rect x="14" y="16" width="50" height="56" rx="4" fill="#2A2A33" />
          <circle cx="82" cy="36" r="21" fill={tone} />
          <rect x="28" y="60" width="70" height="10" rx="5" fill="#3F3F46" />
        </>
      ) : null}
      {variant === 1 ? (
        <>
          <rect x="20" y="14" width="80" height="17" rx="3" fill="#2A2A33" />
          <rect x="20" y="37" width="80" height="17" rx="3" fill="#3F3F46" />
          <rect x="20" y="60" width="44" height="17" rx="3" fill={tone} />
        </>
      ) : null}
      {variant === 2 ? (
        <>
          <polygon points="60,10 104,74 16,74" fill="#2A2A33" />
          <circle cx="60" cy="54" r="15" fill={tone} />
          <rect x="16" y="78" width="88" height="6" rx="3" fill="#3F3F46" />
        </>
      ) : null}
      {variant === 3 ? (
        <>
          <circle cx="44" cy="42" r="27" fill="#2A2A33" />
          <circle cx="84" cy="42" r="17" fill={tone} />
          <rect x="16" y="72" width="88" height="9" rx="4" fill="#3F3F46" />
        </>
      ) : null}
    </svg>
  );
}

function Chip({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <li className="inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-[#26262E] px-2 py-1 text-[11px] font-normal tabular-nums text-[#A1A1AA]">
      {icon}
      <span>{text}</span>
    </li>
  );
}

/**
 * The three states never differ by colour alone, and never by opacity: a `opacity-50` shell would
 * drag every string inside it under the AA floor at once. A refusal is signalled by a dashed
 * border, a flattened mark, a status icon and the words "Filtered out" — the body copy keeps its
 * contrast so a refusal stays as readable as a pick. That is the whole argument of the page.
 */
function Card({ listing, state }: { listing: Listing; state: CardState }) {
  const tone =
    state === "selected"
      ? "#6E56CF"
      : state === "admitted"
        ? "#E0A82E"
        : "#3F3F46";

  const shell =
    state === "filtered"
      ? "border-dashed border-[#26262E] bg-[#0D0D12]"
      : state === "admitted"
        ? "border-[#4A3C1E] bg-[#121118]"
        : "border-[#242431] bg-[#121218]";

  const reason = listing.blockedBy
    ? REASON_TEXT[listing.blockedBy]
    : "cleared all four guardrails";

  const status =
    state === "selected"
      ? {
          icon: (
            <Check
              aria-hidden="true"
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B6A6F0]"
            />
          ),
          text: "Selected — cleared all four guardrails",
          cls: "text-[#B6A6F0]",
        }
      : state === "admitted"
        ? {
            icon: (
              <ShieldOff
                aria-hidden="true"
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E0A82E]"
              />
            ),
            text: `Admitted by override — ${reason}`,
            cls: "text-[#E0A82E]",
          }
        : {
            icon: (
              <Ban
                aria-hidden="true"
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A1A1AA]"
              />
            ),
            text: `Filtered out — ${reason}`,
            cls: "text-[#A1A1AA]",
          };

  return (
    <article
      className={`flex h-full min-w-0 flex-col rounded-lg border p-4 transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-1 hover:border-[#6E56CF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${shell}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-[#131318]">
        <Mark variant={listing.mark} tone={tone} />
      </div>

      <h4
        className={`mt-4 text-[15px] font-semibold leading-[1.35] tracking-[-0.02em] ${
          state === "filtered" ? "text-[#D4D4D8]" : "text-white"
        }`}
      >
        {listing.title}
      </h4>
      <p className="mt-1 text-[12px] font-normal text-[#A1A1AA]">
        {listing.seller}
      </p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        <Chip
          icon={<Target aria-hidden="true" className="h-3 w-3 shrink-0" />}
          text={`Match ${listing.matchPct}%`}
        />
        <Chip
          icon={<Gauge aria-hidden="true" className="h-3 w-3 shrink-0" />}
          text={`Condition ${listing.grade}`}
        />
        <Chip
          icon={
            listing.verified ? (
              <ShieldCheck aria-hidden="true" className="h-3 w-3 shrink-0" />
            ) : (
              <ShieldOff aria-hidden="true" className="h-3 w-3 shrink-0" />
            )
          }
          text={listing.verified ? "Verified seller" : "Unverified seller"}
        />
        <Chip
          icon={<Tag aria-hidden="true" className="h-3 w-3 shrink-0" />}
          text={`${listing.discountPct}% off`}
        />
      </ul>

      <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
        <span className="text-[12px] font-normal text-[#A1A1AA] line-through">
          {formatWon(listing.priceWas)}
        </span>
        <span className="text-[15px] font-semibold text-white">
          {formatWon(listing.priceNow)}
        </span>
      </p>

      <p
        className={`mt-auto flex items-start gap-2 pt-4 text-[12px] font-normal leading-[1.5] ${status.cls}`}
      >
        {status.icon}
        <span>{status.text}</span>
      </p>
    </article>
  );
}

export function FieldWork() {
  const [off, setOff] = useState<GuardrailId[]>([]);
  const [mode, setMode] = useState<"status" | "reason">("status");
  const reduce = useReducedMotion();

  const summary = useMemo(() => summarize(off), [off]);
  const groups = useMemo(() => groupBoard(mode, off), [mode, off]);
  const warning = useMemo(() => warningLine(off), [off]);

  const allOff = off.length === GUARDRAILS.length;

  function toggle(id: GuardrailId) {
    setOff((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const readouts = [
    {
      key: "size",
      label: "Board size",
      value: `${summary.count}`,
      baseline: `Baseline ${BASELINE.count}`,
    },
    {
      key: "verified",
      label: "Verified sellers",
      value: `${summary.verifiedPct}%`,
      baseline: `Baseline ${BASELINE.verifiedPct}%`,
    },
    {
      key: "condition",
      label: "Median condition",
      value: summary.medianGrade,
      baseline: `Baseline ${BASELINE.medianGrade}`,
    },
    {
      key: "discount",
      label: "Median discount",
      value: `${summary.medianDiscount}%`,
      baseline: `Baseline ${BASELINE.medianDiscount}%`,
    },
  ];

  const pillars = [
    {
      key: "sellers",
      title: "Every seller is identity-checked",
      body: "A payout history is the cheapest fraud signal there is. Drop the check and the board fills with accounts that have none.",
      metric: "Verified share of the board",
      now: `${summary.verifiedPct}%`,
      base: `${BASELINE.verifiedPct}%`,
      changed: summary.verifiedPct !== BASELINE.verifiedPct,
      icon: (
        <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#B6A6F0]" />
      ),
    },
    {
      key: "condition",
      title: "Nothing below grade B ships",
      body: "An inspector grades wear before a listing is eligible. The floor is what keeps the median from sliding once volume goes up.",
      metric: "Median condition on the board",
      now: summary.medianGrade,
      base: BASELINE.medianGrade,
      changed: summary.medianGrade !== BASELINE.medianGrade,
      icon: <Gauge aria-hidden="true" className="h-4 w-4 text-[#B6A6F0]" />,
    },
    {
      key: "audit",
      title: "Price and photos are audited",
      body: "A 95 percent discount is not a deal, it is a missing detail. Same for a single photo. Both come back the moment the audit is off.",
      metric: "Audit exceptions on the board",
      now: `${summary.exceptions}`,
      base: `${BASELINE.exceptions}`,
      changed: summary.exceptions !== BASELINE.exceptions,
      icon: <Scale aria-hidden="true" className="h-4 w-4 text-[#B6A6F0]" />,
    },
  ];

  return (
    <>
      <section className="border-b border-[#1B1B22] px-5 pb-24 pt-20 sm:px-8 md:pb-28 md:pt-28">
        <div className="mx-auto w-full max-w-[1120px]">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <motion.div
              className="min-w-0 lg:col-span-7"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <GhostNumber value="01" className="h-10 w-[92px]" />
              <p className="mt-4 text-[11px] font-normal uppercase tracking-[0.28em] text-[#A1A1AA]">
                Guardrail field / 12 listings / 8 refused
              </p>
              <h1
                className="mt-6 text-[clamp(2.75rem,8.4vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                Judge us by
                <span className="block text-[#A1A1AA]">what we refuse.</span>
              </h1>
              <p className="mt-8 max-w-prose text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
                repick screens every incoming listing against four guardrails.
                This is the whole board — four picks and eight refusals on one
                plane, each refusal labelled with the reason it was thrown out.
                Switch a guardrail off and the refusals come back, along with the
                price you pay for having them.
              </p>
              <a
                href="#board"
                className="mt-9 inline-flex w-fit items-center gap-2 rounded-md bg-[#6E56CF] px-6 py-3.5 text-[15px] font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6A6F0] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                See the four that cleared
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div
              className="min-w-0 lg:col-span-5"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            >
              <div className="rounded-lg border border-[#1B1B22] bg-[#101015] p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
                    Guardrails
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      setOff(allOff ? [] : GUARDRAILS.map((g) => g.id))
                    }
                    className="rounded border border-[#2A2A33] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B6A6F0] transition-colors duration-200 ease-out hover:border-[#6E56CF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6A6F0] motion-reduce:transition-none"
                  >
                    {allOff ? "Restore all four" : "Drop all four"}
                  </button>
                </div>

                <ul className="mt-5 flex flex-col gap-2">
                  {GUARDRAILS.map((g) => {
                    const isOff = off.includes(g.id);
                    const n = BLOCKED_COUNT[g.id];
                    return (
                      <li key={g.id} className="min-w-0">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={!isOff}
                          onClick={() => toggle(g.id)}
                          className={`flex w-full min-w-0 items-center gap-3 rounded-md border px-3 py-3 text-left transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6A6F0] motion-reduce:transition-none ${
                            isOff
                              ? "border-[#4A3C1E] bg-[#141310]"
                              : "border-[#2A2A33] bg-[#15151B] hover:border-[#6E56CF]"
                          }`}
                        >
                          {guardrailIcon(
                            g.id,
                            `h-4 w-4 shrink-0 ${isOff ? "text-[#E0A82E]" : "text-[#B6A6F0]"}`,
                          )}
                          <span className="min-w-0 grow">
                            <span className="block text-[13px] font-semibold text-white">
                              {g.label}
                            </span>
                            <span className="mt-0.5 block text-[12px] font-normal leading-[1.4] text-[#A1A1AA]">
                              {g.rule}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span
                              className={`block text-[11px] font-semibold uppercase tracking-[0.12em] ${
                                isOff ? "text-[#E0A82E]" : "text-[#B6A6F0]"
                              }`}
                            >
                              {isOff ? "Off" : "On"}
                            </span>
                            <span className="mt-0.5 block whitespace-nowrap text-[11px] font-normal tabular-nums text-[#A1A1AA]">
                              {n} {isOff ? "admitted" : "blocked"}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="flex h-5 w-9 shrink-0 items-center rounded-full border border-[#2A2A33] p-[3px]"
                          >
                            <span
                              className={`block h-3 w-3 rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none ${
                                isOff
                                  ? "translate-x-0 bg-[#E0A82E]"
                                  : "translate-x-4 bg-[#B6A6F0]"
                              }`}
                            />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <p
                  aria-live="polite"
                  className="mt-5 border-t border-[#1B1B22] pt-4 text-[16px] font-normal leading-[1.6] text-white"
                >
                  {warning}
                </p>
              </div>
            </motion.div>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#1B1B22] bg-[#1B1B22] sm:grid-cols-4">
            {readouts.map((r) => (
              <div key={r.key} className="min-w-0 bg-[#0B0B0F] p-5">
                <dt className="text-[11px] font-normal uppercase tracking-[0.16em] text-[#A1A1AA]">
                  {r.label}
                </dt>
                <dd className="mt-3">
                  <span
                    className="block text-[clamp(1.875rem,4vw,2.75rem)] font-extrabold leading-none tracking-[-0.02em] tabular-nums text-white"
                    style={{ fontFamily: "var(--font-display-wide)" }}
                  >
                    {r.value}
                  </span>
                  <span className="mt-2 block text-[11px] font-normal uppercase tracking-[0.12em] tabular-nums text-[#A1A1AA]">
                    {r.baseline}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="board"
        className="border-b border-[#1B1B22] px-5 py-24 sm:px-8 md:py-32"
      >
        <div className="mx-auto w-full max-w-[1120px]">
          <motion.div
            className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="min-w-0">
              <GhostNumber value="02" className="h-10 w-[92px]" />
              <p className="mt-4 text-[11px] font-normal uppercase tracking-[0.28em] text-[#A1A1AA]">
                The board
              </p>
              <h2
                className="mt-4 text-[clamp(1.875rem,4.4vw,3.25rem)] font-extrabold leading-[1] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                Twelve listings, one plane.
              </h2>
              <p className="mt-5 max-w-prose text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
                Refusals are not hidden behind a tab. They sit next to the picks,
                dashed and labelled, so the judgement can be checked rather than
                trusted.
              </p>
            </div>

            <div
              role="group"
              aria-label="Board grouping"
              className="flex shrink-0 gap-2"
            >
              <button
                type="button"
                aria-pressed={mode === "status"}
                onClick={() => setMode("status")}
                className={`rounded-md border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6A6F0] motion-reduce:transition-none ${
                  mode === "status"
                    ? "border-[#6E56CF] bg-[#171326] text-white"
                    : "border-[#2A2A33] text-[#A1A1AA] hover:border-[#6E56CF]"
                }`}
              >
                By status
              </button>
              <button
                type="button"
                aria-pressed={mode === "reason"}
                onClick={() => setMode("reason")}
                className={`rounded-md border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6A6F0] motion-reduce:transition-none ${
                  mode === "reason"
                    ? "border-[#6E56CF] bg-[#171326] text-white"
                    : "border-[#2A2A33] text-[#A1A1AA] hover:border-[#6E56CF]"
                }`}
              >
                By guardrail
              </button>
            </div>
          </motion.div>

          {groups.map((group) => (
            <div key={group.key} className="mt-14">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-[#1B1B22] pt-5">
                <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-white">
                  {group.title}
                  <span className="ml-3 text-[12px] font-normal tabular-nums tracking-[0.12em] text-[#A1A1AA]">
                    {group.items.length}
                  </span>
                </h3>
                <p className="min-w-0 text-[12px] font-normal leading-[1.5] text-[#A1A1AA]">
                  {group.note}
                </p>
              </div>
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map((listing) => (
                  <li key={listing.id} className="min-w-0">
                    <Card listing={listing} state={stateOf(listing, off)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="mt-12 text-[12px] font-normal uppercase tracking-[0.16em] text-[#A1A1AA]">
            Fig. 01 — Twelve listings, one plane. Refusals stay in view, dashed
            and reasoned.
          </p>
        </div>
      </section>

      <section className="border-b border-[#1B1B22] px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto w-full max-w-[1120px]">
          <motion.div
            className="min-w-0"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <GhostNumber value="03" className="h-10 w-[92px]" />
            <p className="mt-4 text-[11px] font-normal uppercase tracking-[0.28em] text-[#A1A1AA]">
              Cost of an override
            </p>
            <h2
              className="mt-4 max-w-3xl text-[clamp(1.875rem,4.4vw,3.25rem)] font-extrabold leading-[1] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              What each guardrail buys you.
            </h2>
            <p className="mt-5 max-w-prose text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
              These three figures are wired to the switches above. Drop a
              guardrail and watch the number move away from its baseline — that
              gap is the whole price of the override.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {pillars.map((p, i) => (
              <motion.article
                key={p.key}
                className={`flex min-w-0 flex-col rounded-lg border p-6 transition-colors duration-200 ease-out motion-reduce:transition-none ${
                  p.changed
                    ? "border-[#4A3C1E] bg-[#121118]"
                    : "border-[#1B1B22] bg-[#101015]"
                }`}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.06,
                  ease: "easeOut",
                }}
              >
                <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-white">
                  {p.icon}
                  <span className="min-w-0">{p.title}</span>
                </h3>
                <p className="mt-4 grow text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
                  {p.body}
                </p>

                <p className="mt-6 text-[11px] font-normal uppercase tracking-[0.16em] text-[#A1A1AA]">
                  {p.metric}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-normal uppercase tracking-[0.12em] text-[#A1A1AA]">
                      Now
                    </dt>
                    <dd
                      className="mt-2 text-[32px] font-extrabold leading-none tracking-[-0.02em] tabular-nums text-white"
                      style={{ fontFamily: "var(--font-display-wide)" }}
                    >
                      {p.now}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[11px] font-normal uppercase tracking-[0.12em] text-[#A1A1AA]">
                      All four on
                    </dt>
                    <dd
                      className="mt-2 text-[32px] font-extrabold leading-none tracking-[-0.02em] tabular-nums text-[#A1A1AA]"
                      style={{ fontFamily: "var(--font-display-wide)" }}
                    >
                      {p.base}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 border-t border-[#1B1B22] pt-3 text-[12px] font-normal leading-[1.5] text-[#A1A1AA]">
                  {p.changed
                    ? "Override in effect — this figure has moved off its baseline."
                    : "Holding at baseline."}
                </p>
              </motion.article>
            ))}
          </div>

          <p className="mt-12 text-[12px] font-normal uppercase tracking-[0.16em] text-[#A1A1AA]">
            Fig. 02 — Figures recomputed from the twelve fixtures on every
            switch. No sampling, no rounding drift.
          </p>
        </div>
      </section>
    </>
  );
}
