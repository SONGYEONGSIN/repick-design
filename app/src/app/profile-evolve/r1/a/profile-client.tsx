"use client";

import { useRef, useState } from "react";
import { BadgeCheck, Calendar, Clock, MapPin, Package, ShieldCheck, Star, Truck, UserCheck, Users } from "lucide-react";
import { BADGES, LISTINGS, PERFORMANCE_ROWS, REVIEWS, SELLER, type Grade } from "./data";
import SellerMark from "./seller-mark";
import ListingsPanel, { type ListingSort } from "./listings-panel";
import ReviewsPanel, { type ReviewSort } from "./reviews-panel";

type TabId = "listings" | "reviews";

const BADGE_ICON = [ShieldCheck, Star, Truck, Package];

export default function ProfileClient() {
  const [activeTab, setActiveTab] = useState<TabId>("listings");
  const [following, setFollowing] = useState(false);
  const [grade, setGrade] = useState<Grade | "All">("All");
  const [listingSort, setListingSort] = useState<ListingSort>("recommended");
  const [reviewSort, setReviewSort] = useState<ReviewSort>("recent");
  const [reviewsVisible, setReviewsVisible] = useState(4);

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const followers = SELLER.followersBase + (following ? 1 : 0);
  const filteredListings = grade === "All" ? LISTINGS : LISTINGS.filter((l) => l.grade === grade);

  const tabs: { id: TabId; label: string }[] = [
    { id: "listings", label: `Listings (${LISTINGS.length})` },
    { id: "reviews", label: `Reviews (${SELLER.reviewCount.toLocaleString()})` },
  ];

  function focusTab(index: number) {
    const wrapped = (index + tabs.length) % tabs.length;
    setActiveTab(tabs[wrapped].id);
    tabRefs.current[wrapped]?.focus();
  }

  function onTablistKeyDown(e: React.KeyboardEvent) {
    const current = tabs.findIndex((t) => t.id === activeTab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab(current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab(current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(tabs.length - 1);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div aria-hidden="true" className="relative h-32 w-full overflow-hidden bg-zinc-900 sm:h-40">
        <svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <defs>
            <linearGradient id="cover-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3f0d18" />
              <stop offset="55%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
          </defs>
          <rect width="400" height="100" fill="url(#cover-grad)" />
          <g opacity="0.15" stroke="#fb7185" strokeWidth="1">
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`v${i}`} x1={i * 46} y1="0" x2={i * 46} y2="100" />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 25} x2="400" y2={i * 25} />
            ))}
          </g>
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Identity header ─────────────────────────────────────────── */}
        <header className="relative flex flex-col gap-5 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <div className="relative -mt-12 shrink-0 sm:-mt-14">
              <SellerMark
                seed={SELLER.handle}
                initials="CR"
                className="h-24 w-24 rounded-2xl ring-4 ring-zinc-950 sm:h-28 sm:w-28"
              />
              <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 ring-4 ring-zinc-950">
                <BadgeCheck className="h-4 w-4 text-white" aria-hidden="true" />
              </span>
            </div>

            <div className="min-w-0 pb-1">
              <h1
                className="truncate text-2xl font-semibold text-zinc-50 sm:text-[2rem]"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                {SELLER.brand}
              </h1>
              <p className="mt-1 text-sm text-zinc-400">{SELLER.handle}</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed font-normal text-zinc-300">{SELLER.bio}</p>

              <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-zinc-400">
                <li className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {SELLER.location}
                </li>
                <li className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {SELLER.memberSinceLabel}
                </li>
                <li className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {SELLER.responseTimeLabel}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFollowing((v) => !v)}
                aria-pressed={following}
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 ${
                  following
                    ? "border border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                    : "bg-rose-600 text-white hover:bg-rose-500"
                }`}
              >
                {following ? <UserCheck className="h-4 w-4" aria-hidden="true" /> : <Users className="h-4 w-4" aria-hidden="true" />}
                {following ? "Following" : "Follow"}
              </button>
              <a
                href="#seller-content"
                className="inline-flex min-h-10 items-center rounded-lg border border-zinc-700 px-4 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
              >
                View listings
              </a>
            </div>
            <p className="text-xs text-zinc-400">
              <span className="tabular-nums font-medium text-zinc-200">{followers.toLocaleString()}</span> followers
            </p>
          </div>
        </header>

        {/* Trust badges — flat list, icon inside each pill, no dt/dd nesting. */}
        <ul className="flex flex-wrap gap-2 pb-7" aria-label="Seller trust badges">
          {BADGES.map((badge, i) => {
            const Icon = BADGE_ICON[i % BADGE_ICON.length];
            return (
              <li
                key={badge.label}
                className="flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/[0.08] px-3 py-1.5 text-xs font-medium text-rose-300"
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {badge.label}
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Reputation stat cluster — permanently visible, never gated behind a tab ─── */}
      <section aria-labelledby="reputation-heading" className="border-y border-zinc-800 bg-zinc-900/50 py-6 sm:py-7">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="reputation-heading" className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Reputation at a glance
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <li className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 shrink-0 fill-rose-400 text-rose-400" aria-hidden="true" />
                <span className="tabular-nums text-2xl font-semibold text-zinc-50">{SELLER.ratingAvg.toFixed(1)}</span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">Average rating</p>
            </li>
            <li className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <span className="tabular-nums text-2xl font-semibold text-zinc-50">{SELLER.reviewCount.toLocaleString()}</span>
              <p className="mt-1 text-xs text-zinc-400">Buyer reviews</p>
            </li>
            <li className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <span className="tabular-nums text-2xl font-semibold text-zinc-50">{SELLER.shipOnTimePct}%</span>
              <p className="mt-1 text-xs text-zinc-400">Shipped on time</p>
            </li>
            <li className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <span className="tabular-nums text-2xl font-semibold text-zinc-50">{SELLER.itemsSold.toLocaleString()}</span>
              <p className="mt-1 text-xs text-zinc-400">Items sold</p>
            </li>
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Performance vs. marketplace average — semantic table, always visible ─── */}
        <section aria-labelledby="performance-heading" className="border-b border-zinc-800 py-7">
          <h2 id="performance-heading" className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Performance vs. marketplace
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-sm">
              <caption className="mb-3 text-left text-sm font-normal text-zinc-400">
                Seller performance compared with the marketplace average, trailing 90 days.
              </caption>
              <thead>
                <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-400">
                  <th scope="col" className="w-[44%] py-2 pr-2 text-left font-medium">
                    Metric
                  </th>
                  <th scope="col" className="w-[28%] py-2 pr-2 text-left font-medium">
                    Circuitloom
                  </th>
                  <th scope="col" className="w-[28%] py-2 text-left font-medium">
                    Marketplace avg.
                  </th>
                </tr>
              </thead>
              <tbody>
                {PERFORMANCE_ROWS.map((row) => (
                  <tr key={row.metric} className="border-b border-zinc-900 last:border-0">
                    <th scope="row" className="py-2.5 pr-2 text-left font-normal text-zinc-300">
                      {row.metric}
                    </th>
                    <td className="py-2.5 pr-2 tabular-nums font-medium text-rose-300">{row.seller}</td>
                    <td className="py-2.5 tabular-nums text-zinc-400">{row.marketAvg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Listings / Reviews tabs ─────────────────────────────────── */}
        <section id="seller-content" className="scroll-mt-6 py-7">
          <div role="tablist" aria-label="Seller content" onKeyDown={onTablistKeyDown} className="flex w-fit gap-1 rounded-xl bg-zinc-900 p-1">
            {tabs.map((tab, i) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-9 rounded-lg px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 ${
                    selected ? "bg-zinc-100 text-zinc-900" : "text-zinc-300 hover:text-zinc-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Both panels stay mounted (visibility toggled via `hidden`) rather than swapped by a
              ternary: every tab's `aria-controls` id needs a real element to point to, and an
              inactive `role=tabpanel` that isn't in the DOM at all fails that reference. */}
          <div className="mt-5">
            <div hidden={activeTab !== "listings"}>
              <ListingsPanel
                id="panel-listings"
                labelledBy="tab-listings"
                listings={filteredListings}
                total={LISTINGS.length}
                grade={grade}
                onGradeChange={setGrade}
                sort={listingSort}
                onSortChange={setListingSort}
              />
            </div>
            <div hidden={activeTab !== "reviews"}>
              <ReviewsPanel
                id="panel-reviews"
                labelledBy="tab-reviews"
                reviews={REVIEWS}
                totalCount={SELLER.reviewCount}
                sort={reviewSort}
                onSortChange={setReviewSort}
                visibleCount={reviewsVisible}
                onShowMore={() => setReviewsVisible(REVIEWS.length)}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
