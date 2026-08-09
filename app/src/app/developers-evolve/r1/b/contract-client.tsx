"use client";

import { useState, type ReactNode } from "react";
import ErrorContract from "./error-contract";
import FirstCall from "./first-call";
import {
  CLAUSES,
  DEFAULT_INPUTS,
  DEFAULT_VERSION_ID,
  FOCUS_RING,
  MAX_MB_PER_PART,
  MAX_PAGES_PER_PART,
  PEAK_SHARE,
  PLANS,
  PROFILES,
  REF_DAY,
  REF_LABEL,
  REGIONS,
  REJECT_BILL_SHARE,
  RETENTION_DAYS,
  SUNSET_NOTICE_MONTHS,
  SYNC_MAX_MB,
  SYNC_MAX_PAGES,
  VERSIONS,
  VOLUME_LADDER,
  daysFromCivil,
  groupThousands,
  isoDate,
  pctText,
  resolve,
  secText,
  unitUsd,
  usd,
  versionById,
  type PlanId,
  type ProfileId,
  type RegionId,
  type VersionId,
} from "./data";

const SELECT_CLASS =
  "mt-2 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-normal text-zinc-900";
const LABEL_CLASS = "block text-xs font-semibold uppercase tracking-widest text-zinc-600";
const TABLE_WRAP = "mt-4 overflow-x-auto rounded-lg border border-zinc-300 bg-white";
const CAPTION_CLASS =
  "caption-top border-b border-zinc-200 px-4 py-3 text-left text-xs font-normal text-zinc-600";
const TH_CLASS = "px-4 py-2.5 text-xs font-semibold text-zinc-700";
const TD_CLASS = "px-4 py-3 text-sm font-normal text-zinc-800";

function ClauseHead({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  const clause = CLAUSES.find((c) => c.n === n) ?? CLAUSES[0];
  return (
    <div className="min-w-0">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-teal-800">
        Clause {n}
      </p>
      <h2
        id={`${clause.id}-h`}
        className="mt-3 text-2xl font-bold leading-tight tracking-tight text-zinc-900"
        style={{ fontFamily: "var(--font-display-grotesk)" }}
      >
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm font-normal leading-relaxed text-zinc-700">
        {children}
      </div>
    </div>
  );
}

function InForce({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 border-l-2 border-teal-700 bg-teal-50 px-4 py-4 lg:col-span-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">
        In force for you
      </p>
      <p
        className="mt-2 text-base font-semibold leading-relaxed tabular-nums text-zinc-900"
        style={{ fontFamily: "var(--font-display-grotesk)" }}
      >
        {children}
      </p>
    </div>
  );
}

/** A meter whose value is also stated in words beside it — the bar carries nothing on its own. */
function Bar({ ratio }: { ratio: number }) {
  const width = `${(Math.min(Math.max(ratio, 0), 1) * 100).toFixed(2)}%`;
  return (
    <div
      aria-hidden="true"
      className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300"
    >
      <span
        className="block h-full rounded-full bg-teal-700 transition-[width] duration-300 ease-out motion-reduce:transition-none"
        style={{ width }}
      />
    </div>
  );
}

const CLAUSE_SECTION = "border-b border-zinc-300";
const CLAUSE_GRID =
  "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:grid lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-x-10";

/**
 * Everything from the scale ledger down. One piece of state — the reader's volume, document profile,
 * plan, region and pinned version — and every clause is a pure function of it.
 *
 * The ledger is not a configurator sitting in front of the content. It renders with a full default
 * already applied, so the page proves its terms with zero interaction; the controls move the numbers
 * rather than uncover them.
 */
export default function ContractClient() {
  const [volumeIndex, setVolumeIndex] = useState(DEFAULT_INPUTS.volumeIndex);
  const [profileId, setProfileId] = useState<ProfileId>(DEFAULT_INPUTS.profileId);
  const [planId, setPlanId] = useState<PlanId>(DEFAULT_INPUTS.planId);
  const [regionId, setRegionId] = useState<RegionId>(DEFAULT_INPUTS.regionId);
  const [versionId, setVersionId] = useState<VersionId>(DEFAULT_VERSION_ID);

  const r = resolve({ volumeIndex, profileId, planId, regionId });
  const version = versionById(versionId);

  const axisStart = daysFromCivil(VERSIONS[0].released);
  const axisEnd = VERSIONS.reduce(
    (latest, v) => (v.sunset ? Math.max(latest, daysFromCivil(v.sunset)) : latest),
    axisStart,
  );
  const axisSpan = axisEnd - axisStart;
  const axisPct = (day: number) => `${(((day - axisStart) / axisSpan) * 100).toFixed(2)}%`;
  const sunsetDays = version.sunset ? daysFromCivil(version.sunset) - REF_DAY : null;

  const readout = [
    { term: "Pages submitted", value: groupThousands(r.pagesSubmitted) },
    { term: "Chargeable units", value: groupThousands(Math.round(r.pagesSubmitted - r.rejectedPages * (1 - REJECT_BILL_SHARE))) },
    { term: "API requests", value: groupThousands(r.requestsPerMonth) },
    { term: "Peak submissions", value: `${r.peakRps.toFixed(2)} req/s` },
    { term: "Monthly total", value: usd(r.outcome.total) },
  ];

  return (
    <>
      {/* ------------------------------------------------------- the ledger */}
      <section aria-labelledby="numbers-h" className="border-b border-zinc-300 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2
              id="numbers-h"
              className="text-2xl font-bold tracking-tight text-zinc-900"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              Your numbers
            </h2>
            <p className="text-sm font-normal text-zinc-700">
              Four inputs. Every clause below is derived from them.
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="min-w-0 lg:col-span-2">
              <label htmlFor="volume" className={LABEL_CLASS}>
                Documents a month
              </label>
              <div className="mt-2 flex items-center gap-4">
                <input
                  id="volume"
                  type="range"
                  min={0}
                  max={VOLUME_LADDER.length - 1}
                  step={1}
                  value={volumeIndex}
                  onChange={(event) => setVolumeIndex(Number(event.target.value))}
                  aria-valuetext={`${groupThousands(r.docsPerMonth)} documents a month`}
                  className={`h-2 w-full min-w-0 cursor-pointer rounded-full accent-teal-700 ${FOCUS_RING}`}
                />
                <span
                  className="w-28 flex-none text-right text-xl font-bold tabular-nums text-zinc-900"
                  style={{ fontFamily: "var(--font-display-grotesk)" }}
                >
                  {groupThousands(r.docsPerMonth)}
                </span>
              </div>
              <p className="mt-2 text-xs font-normal text-zinc-600">
                Eight rungs, {groupThousands(VOLUME_LADDER[0])} to{" "}
                {groupThousands(VOLUME_LADDER[VOLUME_LADDER.length - 1])} documents a month.
              </p>
            </div>

            <div className="min-w-0">
              <label htmlFor="profile" className={LABEL_CLASS}>
                Document profile
              </label>
              <select
                id="profile"
                value={profileId}
                onChange={(event) => setProfileId(event.target.value as ProfileId)}
                className={`${SELECT_CLASS} ${FOCUS_RING}`}
              >
                {PROFILES.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.label} · {profile.pages} pp · {profile.mb} MB
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs font-normal leading-relaxed text-zinc-600">
                {r.profile.note}
              </p>
            </div>

            <fieldset className="min-w-0 lg:col-span-2">
              <legend className={LABEL_CLASS}>Plan</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {PLANS.map((plan) => {
                  const active = plan.id === planId;
                  return (
                    <label
                      key={plan.id}
                      className={`flex min-w-0 cursor-pointer items-start gap-2.5 rounded-md border p-3 transition-colors duration-150 motion-reduce:transition-none ${
                        active ? "border-teal-700 bg-teal-50" : "border-zinc-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={active}
                        onChange={() => setPlanId(plan.id)}
                        className={`mt-0.5 flex-none accent-teal-700 ${FOCUS_RING}`}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-zinc-900">
                          {plan.name}
                        </span>
                        <span className="mt-0.5 block text-xs font-normal tabular-nums text-zinc-700">
                          {usd(plan.fee)} a month · {groupThousands(plan.included)} units included
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="min-w-0">
              <label htmlFor="region" className={LABEL_CLASS}>
                Region
              </label>
              <select
                id="region"
                value={regionId}
                onChange={(event) => setRegionId(event.target.value as RegionId)}
                className={`${SELECT_CLASS} ${FOCUS_RING}`}
              >
                {REGIONS.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs font-normal leading-relaxed text-zinc-600">
                {r.region.residency}
              </p>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-zinc-300 pt-6 sm:grid-cols-3 lg:grid-cols-5">
            {readout.map((item) => (
              <div key={item.term} className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                  {item.term}
                </dt>
                <dd
                  className="mt-1.5 break-words text-xl font-bold tabular-nums text-zinc-900"
                  style={{ fontFamily: "var(--font-display-grotesk)" }}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 max-w-3xl text-xs font-normal leading-relaxed text-zinc-600">
            Assumptions, stated once and used everywhere: a 30-day month whose busiest hour carries{" "}
            {pctText(PEAK_SHARE, 0)} of it; prices in USD, excluding tax; a chargeable page-unit is a
            submitted page, less the {pctText(1 - REJECT_BILL_SHARE, 0)} we forgive on the{" "}
            {pctText(r.profile.rejectRate, 1)} of {r.profile.label.toLowerCase()} pages we expect to
            fail to read.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------- clause 1: limits */}
      <section id="clause-1" aria-labelledby="clause-1-h" className={CLAUSE_SECTION}>
        <div className={CLAUSE_GRID}>
          <ClauseHead n="1" title="Rate, burst, concurrency">
            <p>
              Two ceilings, and the one you expect is rarely the one that stops you. Submissions per
              second is a token bucket with a burst of {r.plan.burst}; past it you get 429 with a
              Retry-After header and nothing is queued on your behalf.
            </p>
            <p>
              The real ceiling is jobs in flight. {r.plan.concurrent} concurrent jobs, each holding a
              slot for as long as extraction takes, is a throughput limit — so the same plan carries
              far fewer bank statements than invoices.
            </p>
          </ClauseHead>

          <div className="mt-8 min-w-0 lg:mt-0">
            <div className={TABLE_WRAP}>
              <table className="w-full min-w-[560px] table-fixed border-collapse text-left">
                <caption className={CAPTION_CLASS}>
                  Schedule 1 &mdash; submission limits by plan, converted into documents a month
                  using {r.profile.label.toLowerCase()} extraction times in {r.region.id}.
                </caption>
                <colgroup>
                  <col className="w-[22%]" />
                  <col className="w-[16%]" />
                  <col className="w-[16%]" />
                  <col className="w-[24%]" />
                  <col className="w-[22%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-zinc-300 bg-zinc-50">
                    <th scope="col" className={TH_CLASS}>
                      Plan
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      Sustained
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      Jobs in flight
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      Documents a month
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      At your volume
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {r.outcomes.map((outcome) => {
                    const mine = outcome.plan.id === r.plan.id;
                    return (
                      <tr
                        key={outcome.plan.id}
                        className={`border-b border-zinc-200 last:border-0 ${mine ? "bg-teal-50" : ""}`}
                      >
                        <th scope="row" className="px-4 py-3 text-sm font-semibold text-zinc-900">
                          {outcome.plan.name}
                          {mine ? (
                            <span className="mt-0.5 block text-xs font-normal text-teal-800">
                              Your plan
                            </span>
                          ) : null}
                        </th>
                        <td className={`${TD_CLASS} tabular-nums`}>{outcome.plan.rps} req/s</td>
                        <td className={`${TD_CLASS} tabular-nums`}>{outcome.plan.concurrent}</td>
                        <td className={`${TD_CLASS} tabular-nums`}>
                          {groupThousands(outcome.ceilingDocsPerMonth)}
                          <span className="mt-0.5 block text-xs text-zinc-600">
                            {outcome.bindingLimit} binds
                          </span>
                        </td>
                        <td className={`${TD_CLASS} tabular-nums`}>
                          {outcome.utilisation <= 1
                            ? `${pctText(outcome.utilisation)} used`
                            : "Over ceiling"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-5 text-sm font-normal leading-relaxed text-zinc-700">
              At {groupThousands(r.docsPerMonth)} documents a month your busiest hour asks for{" "}
              <span className="tabular-nums">{r.peakRps.toFixed(2)}</span> submissions a second.{" "}
              {r.plan.name} carries <span className="tabular-nums">{r.outcome.ceilingRps.toFixed(2)}</span>{" "}
              on this profile, because {r.plan.concurrent} slots divided by a{" "}
              {secText(r.jobP95)} p95 is all the arithmetic there is.
            </p>
            <Bar ratio={r.outcome.utilisation} />
            <p className="mt-2 text-xs font-normal text-zinc-600">
              Bar shows peak demand against the ceiling
              {r.outcome.utilisation > 1 ? ", pinned at full because demand is over it" : ""}.
            </p>
          </div>

          <InForce>
            {r.outcome.utilisation <= 1
              ? `${r.outcome.bindingLimit === "concurrency" ? "Concurrency" : "Submission rate"} binds first at ${r.outcome.ceilingRps.toFixed(2)} req/s — ${groupThousands(r.outcome.ceilingDocsPerMonth)} documents a month on this profile. You need ${groupThousands(r.docsPerMonth)}, leaving ${groupThousands(r.outcome.ceilingDocsPerMonth - r.docsPerMonth)}.`
              : r.viable.length > 0
                ? `${r.plan.name} tops out at ${groupThousands(r.outcome.ceilingDocsPerMonth)} documents a month on this profile and you need ${groupThousands(r.docsPerMonth)}. ${r.viable[0].plan.name} is the smallest plan that carries it.`
                : `No self-serve plan carries ${groupThousands(r.docsPerMonth)} of these a month — Atlas tops out at ${groupThousands(r.outcomes[2].ceilingDocsPerMonth)}. Above that the answer is dedicated capacity, which is a conversation rather than a checkout.`}
          </InForce>
        </div>
      </section>

      {/* -------------------------------------------------- clause 2: money */}
      <section id="clause-2" aria-labelledby="clause-2-h" className={CLAUSE_SECTION}>
        <div className={CLAUSE_GRID}>
          <ClauseHead n="2" title="Quota and what it costs">
            <p>
              Quota is not a cliff. Past the included allowance we keep extracting and invoice the
              overage; the only way to get a 402 is to set a hard spend cap yourself.
            </p>
            <p>
              A page we render but cannot read still costs us the render, so it bills at{" "}
              {pctText(REJECT_BILL_SHARE, 0)} of the unit price rather than nothing. That line is in
              the arithmetic above, not in a footnote.
            </p>
          </ClauseHead>

          <div className="mt-8 min-w-0 lg:mt-0">
            <div className={TABLE_WRAP}>
              <table className="w-full min-w-[560px] table-fixed border-collapse text-left">
                <caption className={CAPTION_CLASS}>
                  Schedule 2 &mdash; the same {groupThousands(r.pagesSubmitted)} submitted pages
                  priced under all three plans. The cheapest row is named in words, not by colour.
                </caption>
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[18%]" />
                  <col className="w-[18%]" />
                  <col className="w-[24%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-zinc-300 bg-zinc-50">
                    <th scope="col" className={TH_CLASS}>
                      Plan
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      Included units
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      Unit price
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      Platform fee
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      Your monthly total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {r.outcomes.map((outcome) => {
                    const cheapest = outcome.plan.id === r.cheapest.plan.id;
                    return (
                      <tr
                        key={outcome.plan.id}
                        className={`border-b border-zinc-200 last:border-0 ${cheapest ? "bg-teal-50" : ""}`}
                      >
                        <th scope="row" className="px-4 py-3 text-sm font-semibold text-zinc-900">
                          {outcome.plan.name}
                          {cheapest ? (
                            <span className="mt-0.5 block text-xs font-normal text-teal-800">
                              Cheapest here
                            </span>
                          ) : null}
                        </th>
                        <td className={`${TD_CLASS} tabular-nums`}>
                          {groupThousands(outcome.plan.included)}
                        </td>
                        <td className={`${TD_CLASS} tabular-nums`}>{unitUsd(outcome.plan.unit)}</td>
                        <td className={`${TD_CLASS} tabular-nums`}>{usd(outcome.plan.fee)}</td>
                        <td className={`${TD_CLASS} tabular-nums font-semibold text-zinc-900`}>
                          {usd(outcome.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-5 text-sm font-normal leading-relaxed text-zinc-700">
              On {r.plan.name} that is {usd(r.plan.fee)} of platform fee plus{" "}
              {groupThousands(Math.round(r.outcome.overageUnits))} units of overage at{" "}
              {unitUsd(r.plan.unit)}, or {usd(r.outcome.overageCost)}. Effective cost{" "}
              {unitUsd(r.costPerDocument)} a document, {unitUsd(r.costPerUnit)} a page-unit.
            </p>
            <Bar ratio={r.outcome.overageUnits > 0 ? r.plan.included / (r.plan.included + r.outcome.overageUnits) : 1} />
            <p className="mt-2 text-xs font-normal text-zinc-600">
              Bar shows the share of your usage covered by the included allowance
              {r.outcome.overageUnits > 0
                ? `; the remainder is billed as overage.`
                : `; you are inside it this month.`}
            </p>
          </div>

          <InForce>
            Cheapest at this volume: {r.cheapest.plan.name}, {usd(r.cheapest.total)} a month.
            {r.cheapest.plan.id === r.plan.id
              ? " That is the plan you have selected."
              : ` You have ${r.plan.name} selected at ${usd(r.outcome.total)}, which is ${usd(r.outcome.total - r.cheapest.total)} more.`}
          </InForce>
        </div>
      </section>

      {/* ------------------------------------------------ clause 3: latency */}
      <section id="clause-3" aria-labelledby="clause-3-h" className={CLAUSE_SECTION}>
        <div className={CLAUSE_GRID}>
          <ClauseHead n="3" title="Latency and which mode you get">
            <p>
              Extraction time is per page, so latency is a property of your documents rather than of
              our API. The p99 column includes queue time at your plan concurrency, which is why it
              is not a tidy multiple of p95.
            </p>
            <p>
              The synchronous endpoint exists only under {SYNC_MAX_PAGES} pages and {SYNC_MAX_MB} MB.
              Everything else is submit-and-webhook, and no plan buys an exception.
            </p>
          </ClauseHead>

          <div className="mt-8 min-w-0 lg:mt-0">
            <div className={TABLE_WRAP}>
              <table className="w-full min-w-[560px] table-fixed border-collapse text-left">
                <caption className={CAPTION_CLASS}>
                  Schedule 3 &mdash; measured extraction times per page by region, plus the fixed
                  per-request overhead. Seconds.
                </caption>
                <colgroup>
                  <col className="w-[34%]" />
                  <col className="w-[18%]" />
                  <col className="w-[16%]" />
                  <col className="w-[16%]" />
                  <col className="w-[16%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-zinc-300 bg-zinc-50">
                    <th scope="col" className={TH_CLASS}>
                      Region
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      Overhead
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      p50 / page
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      p95 / page
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      p99 / page
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {REGIONS.map((region) => {
                    const mine = region.id === r.region.id;
                    return (
                      <tr
                        key={region.id}
                        className={`border-b border-zinc-200 last:border-0 ${mine ? "bg-teal-50" : ""}`}
                      >
                        <th scope="row" className="px-4 py-3 text-sm font-semibold text-zinc-900">
                          {region.name}
                          {mine ? (
                            <span className="mt-0.5 block text-xs font-normal text-teal-800">
                              Your region
                            </span>
                          ) : null}
                        </th>
                        <td className={`${TD_CLASS} tabular-nums`}>{region.overhead.toFixed(2)}</td>
                        <td className={`${TD_CLASS} tabular-nums`}>{region.p50Page.toFixed(2)}</td>
                        <td className={`${TD_CLASS} tabular-nums`}>{region.p95Page.toFixed(2)}</td>
                        <td className={`${TD_CLASS} tabular-nums`}>{region.p99Page.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {[
                { term: "p50 per document", value: secText(r.jobP50) },
                { term: "p95 per document", value: secText(r.jobP95) },
                { term: "p99 per document", value: secText(r.jobP99) },
                { term: "Parts per document", value: `${r.parts}` },
              ].map((item) => (
                <div key={item.term} className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                    {item.term}
                  </dt>
                  <dd
                    className="mt-1.5 text-lg font-bold tabular-nums text-zinc-900"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-sm font-normal leading-relaxed text-zinc-700">
              {r.parts > 1
                ? `A ${r.profile.pages}-page, ${r.profile.mb} MB ${r.profile.label.toLowerCase()} is past the ${MAX_PAGES_PER_PART}-page and ${MAX_MB_PER_PART} MB caps, so your code splits it into ${r.parts} parts of about ${r.pagesPerPart} pages. The times above are per part; submit the parts together and the wall clock is the slowest of them.`
                : `A ${r.profile.pages}-page ${r.profile.label.toLowerCase()} fits in one request, so the times above are the whole document.`}
            </p>
          </div>

          <InForce>
            {r.syncEligible
              ? `Synchronous extraction is available: ${r.pagesPerPart} pages is inside the ${SYNC_MAX_PAGES}-page cap. Budget ${secText(r.jobP95)} at p95 and hold the connection past ${secText(r.jobP99)}.`
              : `Webhook only — ${r.pagesPerPart} pages is past the ${SYNC_MAX_PAGES}-page synchronous cap. Budget ${secText(r.jobP95)} at p95 and ${secText(r.jobP99)} at p99 per part, and build the receiver before you build the sender.`}
          </InForce>
        </div>
      </section>

      {/* -------------------------------------------------- clause 4: errors */}
      <section id="clause-4" aria-labelledby="clause-4-h" className="border-b border-zinc-300 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="max-w-2xl">
            <ClauseHead n="4" title="The error contract">
              <p>
                Every failure this API can hand you, how often it happens, whether you may retry it,
                whether it is billed, and the obligation it places on your code. An error whose
                handling is undefined is a limit you discover in production.
              </p>
            </ClauseHead>
          </div>
          <div className="mt-8">
            <ErrorContract />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ clause 5: sunsets */}
      <section id="clause-5" aria-labelledby="clause-5-h" className={CLAUSE_SECTION}>
        <div className={CLAUSE_GRID}>
          <ClauseHead n="5" title="Versions and sunsets">
            <p>
              Versions are dates, pinned in a header. A sunset is announced at least{" "}
              {SUNSET_NOTICE_MONTHS} months out, and no announced date has ever moved. After it, the
              version answers 410 and nothing but a header change fixes that.
            </p>
            <p>All countdowns here are measured from {REF_LABEL}, the day this page was revised.</p>
          </ClauseHead>

          <div className="mt-8 min-w-0 lg:mt-0">
            <label htmlFor="version" className={LABEL_CLASS}>
              The version you pin
            </label>
            <select
              id="version"
              value={versionId}
              onChange={(event) => setVersionId(event.target.value as VersionId)}
              className={`${SELECT_CLASS} max-w-md ${FOCUS_RING}`}
            >
              {VERSIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} · {pctText(v.keyShare, 0)} of live keys
                </option>
              ))}
            </select>

            <ul className="mt-8 space-y-5">
              {VERSIONS.map((v) => {
                const start = daysFromCivil(v.released);
                const end = v.sunset ? daysFromCivil(v.sunset) : axisEnd;
                const pinned = v.id === versionId;
                const left = v.sunset ? daysFromCivil(v.sunset) - REF_DAY : null;
                return (
                  <li key={v.id} className="min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-mono text-sm font-semibold tabular-nums text-zinc-900">
                        {v.id}
                        {pinned ? (
                          <span className="ml-2 font-sans text-xs font-normal text-teal-800">
                            you pin this
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs font-normal tabular-nums text-zinc-700">
                        {v.sunset
                          ? `Retires ${isoDate(v.sunset)} · ${left} days left`
                          : "Current · no sunset announced"}
                      </p>
                    </div>
                    <div
                      aria-hidden="true"
                      className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300"
                    >
                      <span
                        className={`absolute inset-y-0 rounded-full ${pinned ? "bg-teal-700" : "bg-zinc-400"}`}
                        style={{
                          left: axisPct(start),
                          width: `${(((end - start) / axisSpan) * 100).toFixed(2)}%`,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            <div
              aria-hidden="true"
              className="relative mt-2 h-5 w-full border-t border-zinc-300 pt-1 text-xs tabular-nums text-zinc-600"
            >
              <span className="absolute left-0 top-1">{isoDate(VERSIONS[0].released)}</span>
              <span className="absolute right-0 top-1">2027-03-31</span>
            </div>
            <p className="mt-3 text-xs font-normal leading-relaxed text-zinc-600">
              Bars run from release to retirement across a single axis from{" "}
              {isoDate(VERSIONS[0].released)} to 2027-03-31. Today, {REF_LABEL}, sits{" "}
              {pctText((REF_DAY - axisStart) / axisSpan, 0)} along it. Every date in the bars is
              repeated in the line above it, so the bars carry nothing on their own.
            </p>

            <div className="mt-6 border-t border-zinc-200 pt-6">
              <h3 className="text-sm font-semibold text-zinc-900">
                Between {version.id} and current
              </h3>
              {version.breaking.length === 0 ? (
                <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-700">
                  Nothing. You are on the current version, and the next one will be announced with{" "}
                  {SUNSET_NOTICE_MONTHS} months of overlap.
                </p>
              ) : (
                <ol className="mt-3 space-y-2.5">
                  {version.breaking.map((item, index) => (
                    <li key={item} className="flex min-w-0 gap-3">
                      <span className="flex-none font-mono text-xs font-semibold tabular-nums text-teal-800">
                        {version.id.slice(0, 4)}.{index + 1}
                      </span>
                      <span className="min-w-0 text-sm font-normal leading-relaxed text-zinc-800">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          <InForce>
            {sunsetDays === null
              ? `You are pinned to ${version.id}, the current version. No migration is outstanding and no clock is running.`
              : `You are pinned to ${version.id}. ${sunsetDays} days until it stops answering, and ${version.breaking.length} breaking ${version.breaking.length === 1 ? "change" : "changes"} between you and current.`}
          </InForce>
        </div>
      </section>

      {/* ----------------------------------------------- clause 6: the call */}
      <section id="clause-6" aria-labelledby="clause-6-h" className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="max-w-2xl">
            <ClauseHead n="6" title="Keys and the first call">
              <p>
                Keys are self-serve and test keys are free, capped at 2 req/s and 500 page-units a
                month. The request below is assembled from everything you chose above, so it already
                carries your region, your pinned version and the mode your documents qualify for.
              </p>
            </ClauseHead>
          </div>
          <div className="mt-8">
            <FirstCall
              host={r.region.host}
              version={versionId}
              sync={r.syncEligible}
              parts={r.parts}
              fileName={`${r.profile.id}.pdf`}
            />
          </div>
          <p className="mt-8 max-w-3xl border-t border-zinc-300 pt-6 text-sm font-normal leading-relaxed text-zinc-700">
            One thing this page will not do is pretend the answer is always yes. If clause 1 says the
            ceiling is under your volume, or clause 2 makes the arithmetic worse than your current
            vendor, the honest outcome is that you do not integrate — and it costs you an afternoon
            to find out here rather than a quarter to find out in production. Extractions are deleted
            after {RETENTION_DAYS} days either way.
          </p>
        </div>
      </section>
    </>
  );
}
