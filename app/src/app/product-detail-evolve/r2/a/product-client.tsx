"use client";

import { useMemo, useState } from "react";
import {
  Aperture,
  Check,
  ChevronsLeftRight,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  TrendingDown,
  Truck,
} from "lucide-react";
import {
  BRAND,
  GRADES,
  NEW_UNIT,
  PLAN_COST_CERTIFIED,
  PLAN_COST_NEW,
  PLAN_EXTRA_MONTHS,
  PRODUCT_NAME,
  RATING_SUMMARY,
  SKU_LINE,
  ANGLES,
  buildSpecGroups,
  cx,
  usd,
  type AngleId,
  type GradeId,
} from "./data";
import LensArt from "./lens-art";
import SpecCompare from "./spec-compare";
import ReviewsPanel from "./reviews-panel";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" };

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const TRUST_ROW = [
  { icon: Truck, text: "Free shipping over $150" },
  { icon: ShieldCheck, text: "In-house 42-point inspection" },
  { icon: RotateCcw, text: "30-day return window, both columns" },
];

export default function ProductClient() {
  const [gradeId, setGradeId] = useState<GradeId>("excellent");
  const [planEnabled, setPlanEnabled] = useState(false);
  const [angle, setAngle] = useState<AngleId>("front");
  const [addedCert, setAddedCert] = useState(false);
  const [addedNew, setAddedNew] = useState(false);

  const grade = GRADES.find((g) => g.id === gradeId) ?? GRADES[0];

  const certTotal = grade.price + (planEnabled ? PLAN_COST_CERTIFIED : 0);
  const newTotal = NEW_UNIT.price + (planEnabled ? PLAN_COST_NEW : 0);
  const savings = newTotal - certTotal;
  const savingsPct = Math.round((savings / newTotal) * 100);
  const certWarranty = grade.warrantyMonths + (planEnabled ? PLAN_EXTRA_MONTHS : 0);
  const newWarranty = NEW_UNIT.warrantyMonths + (planEnabled ? PLAN_EXTRA_MONTHS : 0);

  const specGroups = useMemo(() => buildSpecGroups(grade, planEnabled), [grade, planEnabled]);

  function handleAddCert() {
    setAddedCert(true);
    window.setTimeout(() => setAddedCert(false), 2200);
  }
  function handleAddNew() {
    setAddedNew(true);
    window.setTimeout(() => setAddedNew(false), 2200);
  }

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <a
        href="#compare"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-sky-700 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none"
      >
        Skip to the certified vs. new comparison
      </a>

      {/* ---------------------------------------------------------------- Sticky header: price + CTA #1 */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <a href="#overview" className={cx("flex flex-none items-center gap-2", FOCUS)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
              <Aperture className="h-4.5 w-4.5 text-sky-700" aria-hidden="true" />
            </span>
            <span style={DISPLAY_FONT} className="text-base font-semibold tracking-tight text-slate-900">
              {BRAND}
            </span>
          </a>

          <nav aria-label="Product sections" className="hidden flex-1 items-center gap-6 pl-6 lg:flex">
            <a href="#compare" className={cx("text-sm font-normal text-slate-600 hover:text-slate-900", FOCUS)}>
              Compare
            </a>
            <a href="#specs" className={cx("text-sm font-normal text-slate-600 hover:text-slate-900", FOCUS)}>
              Specifications
            </a>
            <a href="#reviews" className={cx("text-sm font-normal text-slate-600 hover:text-slate-900", FOCUS)}>
              Reviews
            </a>
          </nav>

          <div className="ml-auto flex flex-none items-center gap-3">
            <span className="hidden text-sm font-normal text-slate-600 sm:inline">
              Certified <span className="font-semibold text-slate-900 tabular-nums">{usd(certTotal)}</span>
              <span className="mx-1.5 text-slate-300">·</span>
              New <span className="font-semibold text-slate-900 tabular-nums">{usd(newTotal)}</span>
            </span>
            <button
              type="button"
              onClick={handleAddCert}
              className={cx(
                "inline-flex items-center gap-2 rounded-lg bg-sky-700 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-800",
                FOCUS,
              )}
            >
              {addedCert ? <Check className="h-4 w-4 flex-none" aria-hidden="true" /> : <ShoppingCart className="h-4 w-4 flex-none" aria-hidden="true" />}
              <span className="hidden sm:inline">{addedCert ? "Added" : `Add certified — ${usd(certTotal)}`}</span>
              <span className="sm:hidden">{addedCert ? "Added" : "Add certified"}</span>
            </button>
          </div>
        </div>
      </header>

      <div aria-live="polite" className="sr-only">
        {addedCert ? `Added ${PRODUCT_NAME} — Certified, ${grade.label} grade — to cart.` : ""}
        {addedNew ? `Added ${PRODUCT_NAME} — New, sealed — to cart.` : ""}
      </div>

      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:py-14">
        {/* ---------------------------------------------------------------- Overview */}
        <section id="overview" aria-label="Overview" className="scroll-mt-24">
          <p className="text-sm font-normal text-sky-700">{SKU_LINE}</p>
          <h1 style={DISPLAY_FONT} className="mt-1.5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {PRODUCT_NAME}
          </h1>
          <p className="mt-3 max-w-prose text-base font-normal leading-relaxed text-slate-600">
            The same optical formula, two ways to own it: a certified pre-owned copy graded and
            warrantied by our technicians, shown side by side with a brand-new sealed unit — pick a
            condition grade and both columns below update together.
          </p>
          <a href="#reviews" className={cx("mt-4 inline-flex items-center gap-2 rounded", FOCUS)}>
            <span className="flex items-center gap-0.5" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cx("h-4 w-4", n <= Math.round(RATING_SUMMARY.average) ? "fill-sky-700 text-sky-700" : "fill-slate-200 text-slate-200")}
                />
              ))}
            </span>
            <span className="text-sm font-medium text-slate-900 tabular-nums">{RATING_SUMMARY.average.toFixed(1)}</span>
            <span className="text-sm font-normal text-slate-600 tabular-nums">({RATING_SUMMARY.count} reviews)</span>
          </a>
        </section>

        {/* ---------------------------------------------------------------- Shared controls */}
        <section aria-label="Shared comparison controls" className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <fieldset className="border-0 p-0">
            <legend className="text-sm font-medium text-slate-900">
              Condition grade — sets the price and proof on the Certified column
            </legend>
            <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {GRADES.map((g) => (
                <label
                  key={g.id}
                  className={cx(
                    "cursor-pointer rounded-xl border bg-white p-3.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-700 has-[:focus-visible]:ring-offset-2",
                    gradeId === g.id ? "border-sky-700 bg-sky-50" : "border-slate-200 hover:border-slate-300",
                  )}
                >
                  <input type="radio" name="grade" value={g.id} checked={gradeId === g.id} onChange={() => setGradeId(g.id)} className="sr-only" />
                  <span className={cx("block", gradeId === g.id ? "font-medium text-sky-700" : "font-medium text-slate-900")}>{g.label}</span>
                  <span className="mt-0.5 block font-normal text-slate-600 tabular-nums">{usd(g.price)}</span>
                  <span className="mt-1 block font-normal text-slate-500">{g.cosmeticScore}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p id="care-plan-label" className="text-sm font-medium text-slate-900">
                Care+ protection plan
              </p>
              <p className="mt-0.5 text-sm font-normal text-slate-600">
                Applies to both columns at once — adds {usd(PLAN_COST_CERTIFIED)} to the certified unit,{" "}
                {usd(PLAN_COST_NEW)} to the new unit, and {PLAN_EXTRA_MONTHS} months of warranty to each.
              </p>
            </div>
            <span className="flex flex-none items-center gap-2.5 sm:justify-end">
              <button
                type="button"
                role="switch"
                aria-checked={planEnabled}
                aria-labelledby="care-plan-label"
                onClick={() => setPlanEnabled((v) => !v)}
                className={cx(
                  "relative inline-flex h-6 w-11 flex-none items-center rounded-full border transition-colors",
                  planEnabled ? "border-sky-700 bg-sky-700" : "border-slate-300 bg-white",
                  FOCUS,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx("inline-block h-4.5 w-4.5 flex-none translate-x-1 rounded-full bg-white shadow transition-transform", planEnabled && "translate-x-5")}
                />
              </button>
            </span>
          </div>
        </section>

        {/* ---------------------------------------------------------------- Savings banner */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3.5">
          <TrendingDown className="h-5 w-5 flex-none text-sky-700" aria-hidden="true" />
          <p className="text-sm font-normal text-slate-700">
            Choosing Certified in <span className="font-medium text-slate-900">{grade.label}</span> condition saves{" "}
            <span className="font-semibold text-slate-900 tabular-nums">{usd(savings)}</span>{" "}
            <span className="font-normal text-slate-600 tabular-nums">({savingsPct}%)</span> against the same unit new.
          </p>
        </div>

        {/* ---------------------------------------------------------------- Twin comparison columns (primary structure) */}
        <section id="compare" aria-labelledby="compare-heading" className="mt-10 scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="compare-heading" className="text-2xl font-semibold tracking-tight text-slate-900">
              Certified Pre-Owned vs. New
            </h2>
            <div role="group" aria-label="Illustration angle, applies to both units" className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
              {ANGLES.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAngle(a.id)}
                  aria-pressed={angle === a.id}
                  className={cx(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                    angle === a.id ? "bg-white font-medium text-slate-900 shadow-sm" : "font-normal text-slate-600 hover:text-slate-900",
                    FOCUS,
                  )}
                >
                  <ChevronsLeftRight className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-1.5 max-w-prose text-sm font-normal text-slate-600">
            The angle toggle above drives both illustrations at once. Cosmetic wear marks on the
            Certified copy reflect the selected condition grade; the New copy always renders clean.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Certified column */}
            <article className="flex flex-col rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                  <RotateCcw className="h-3 w-3 flex-none" aria-hidden="true" />
                  Certified Pre-Owned
                </span>
                <span className="text-xs font-normal text-slate-600">{grade.label} grade</span>
              </div>

              <div className="mt-3 aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <LensArt angle={angle} wear={grade.wear} titleId="lens-art-certified-title" />
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{usd(certTotal)}</p>
              {planEnabled && (
                <p className="mt-0.5 text-xs font-normal text-slate-600 tabular-nums">
                  {usd(grade.price)} + {usd(PLAN_COST_CERTIFIED)} Care+
                </p>
              )}

              <dl className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm font-normal text-slate-600">Cosmetic score</dt>
                  <dd className="m-0 text-sm font-medium text-slate-900">{grade.cosmeticScore}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm font-normal text-slate-600">Warranty</dt>
                  <dd className="m-0 text-sm font-medium text-slate-900 tabular-nums">{certWarranty} months</dd>
                </div>
              </dl>
              <p className="mt-2 text-sm font-normal leading-relaxed text-slate-600">{grade.cosmeticNote}</p>

              <ul role="list" className="mt-4 flex flex-col gap-1.5">
                {grade.accessories.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-normal text-slate-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-sky-700" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleAddCert}
                className={cx(
                  "mt-5 flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3.5 text-base font-medium text-white transition-colors hover:bg-sky-800",
                  FOCUS,
                )}
              >
                {addedCert ? <Check className="h-4.5 w-4.5 flex-none" aria-hidden="true" /> : <ShoppingCart className="h-4.5 w-4.5 flex-none" aria-hidden="true" />}
                {addedCert ? "Added to cart" : `Add certified unit — ${usd(certTotal)}`}
              </button>
            </article>

            {/* New column */}
            <article className="flex flex-col rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  <PackageCheck className="h-3 w-3 flex-none" aria-hidden="true" />
                  New, Sealed
                </span>
                <span className="text-xs font-normal text-slate-600">Manufacturer stock</span>
              </div>

              <div className="mt-3 aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <LensArt angle={angle} wear="none" titleId="lens-art-new-title" />
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{usd(newTotal)}</p>
              {planEnabled && (
                <p className="mt-0.5 text-xs font-normal text-slate-600 tabular-nums">
                  {usd(NEW_UNIT.price)} + {usd(PLAN_COST_NEW)} manufacturer extension
                </p>
              )}

              <dl className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm font-normal text-slate-600">Cosmetic score</dt>
                  <dd className="m-0 text-sm font-medium text-slate-900">{NEW_UNIT.cosmeticScore}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm font-normal text-slate-600">Warranty</dt>
                  <dd className="m-0 text-sm font-medium text-slate-900 tabular-nums">{newWarranty} months</dd>
                </div>
              </dl>
              <p className="mt-2 text-sm font-normal leading-relaxed text-slate-600">{NEW_UNIT.cosmeticNote}</p>

              <ul role="list" className="mt-4 flex flex-col gap-1.5">
                {NEW_UNIT.accessories.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-normal text-slate-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-slate-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleAddNew}
                className={cx(
                  "mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-base font-medium text-slate-900 transition-colors hover:bg-slate-50",
                  FOCUS,
                )}
              >
                {addedNew ? <Check className="h-4.5 w-4.5 flex-none" aria-hidden="true" /> : <ShoppingCart className="h-4.5 w-4.5 flex-none" aria-hidden="true" />}
                {addedNew ? "Added to cart" : `Add new unit — ${usd(newTotal)}`}
              </button>
            </article>
          </div>

          <ul role="list" className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {TRUST_ROW.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5 text-xs font-normal text-slate-600">
                <Icon className="h-3.5 w-3.5 flex-none text-slate-600" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------------------- Specifications */}
        <section id="specs" aria-labelledby="specs-heading" className="mt-16 scroll-mt-24">
          <h2 id="specs-heading" className="text-2xl font-semibold tracking-tight text-slate-900">
            Specifications, side by side
          </h2>
          <p className="mt-1.5 max-w-prose text-sm font-normal text-slate-600">
            Optical & build opens by default — the deepest proof point is visible without a click.
            Expand the remaining groups as needed, or narrow the whole comparison to rows that differ.
          </p>
          <div className="mt-5">
            <SpecCompare groups={specGroups} />
          </div>
        </section>

        {/* ---------------------------------------------------------------- Reviews */}
        <section id="reviews" aria-labelledby="reviews-heading" className="mt-16 scroll-mt-24">
          <h2 id="reviews-heading" className="text-2xl font-semibold tracking-tight text-slate-900">
            Reviews
          </h2>
          <p className="mt-1.5 max-w-prose text-sm font-normal text-slate-600">
            Filter down to a single star rating — buyers of every grade, including new, are represented.
          </p>
          <div className="mt-5">
            <ReviewsPanel />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-[1200px] px-4 py-8 text-xs font-normal text-slate-600 sm:px-6">
          {BRAND} — condition grades are assigned in-house against a fixed rubric; pricing and stock shown are illustrative.
        </div>
      </footer>
    </div>
  );
}
