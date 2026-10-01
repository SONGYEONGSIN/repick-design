"use client";

import { motion } from "framer-motion";
import ConstellationGraph from "./constellation-graph";
import ListingCard from "./listing-card";
import MatchDetail from "./match-detail";
import MatchTable from "./match-table";
import { EDGES, NEEDS, PRODUCTS, needById, productById, type NeedId, type ProductId } from "./data";
import { BODY_16, DISPLAY, Eyebrow, PrimaryButton, SecondaryButton, useMounted } from "./ui";

type Props = {
  activeNeedId: NeedId;
  activeProductId: ProductId;
  onSelectNeed: (id: NeedId) => void;
  onSelectProduct: (id: ProductId) => void;
  onSelectPair: (needId: NeedId, productId: ProductId) => void;
};

export default function Hero({ activeNeedId, activeProductId, onSelectNeed, onSelectProduct, onSelectPair }: Props) {
  const mounted = useMounted();
  const activeNeed = needById(activeNeedId);
  const activeProduct = productById(activeProductId);

  const heroIn = mounted
    ? {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      }
    : {};

  return (
    <section className="border-b border-zinc-800 px-5 pt-14 pb-16 sm:px-8 lg:px-12 lg:pt-20 lg:pb-20">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <motion.div className="min-w-0 lg:col-span-5" {...heroIn}>
            <Eyebrow>The match constellation</Eyebrow>
            <h1
              className="mt-5 text-[clamp(2rem,6vw,3.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-zinc-50"
              style={DISPLAY}
            >
              Your needs don&rsquo;t all point to the same listing.
            </h1>
            <p className={`mt-6 ${BODY_16}`}>
              Budget, condition, brand, and ship speed each pull toward a different graded listing.
              repick draws the actual lines, weighs each one, and shows the exact reason behind
              every connection &mdash; not a single blended score.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PrimaryButton href="#graph">Trace your matches</PrimaryButton>
              <SecondaryButton href="#preview">See all listings</SecondaryButton>
            </div>
            <p className="mt-6 text-[13px] font-normal text-zinc-400">
              <span className="font-semibold tabular-nums text-zinc-200">{EDGES.length}</span> live
              connections across <span className="font-semibold tabular-nums text-zinc-200">{NEEDS.length}</span> needs
              and <span className="font-semibold tabular-nums text-zinc-200">{PRODUCTS.length}</span> graded
              listings this week.
            </p>
          </motion.div>

          <motion.div className="min-w-0 lg:col-span-7" id="graph" {...heroIn}>
            <p
              className="sr-only"
              aria-live="polite"
            >
              Focused on {activeNeed.label}. Top listing: {activeProduct.name}.
            </p>
            <ConstellationGraph
              activeNeedId={activeNeedId}
              activeProductId={activeProductId}
              onSelectNeed={onSelectNeed}
              onSelectProduct={onSelectProduct}
            />
          </motion.div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <MatchDetail
              activeNeedId={activeNeedId}
              activeProductId={activeProductId}
              onSelectProduct={onSelectProduct}
            />
          </div>
          <div className="min-w-0">
            <ListingCard product={activeProduct} />
          </div>
        </div>

        <MatchTable activeNeedId={activeNeedId} activeProductId={activeProductId} onSelectPair={onSelectPair} />
      </div>
    </section>
  );
}
