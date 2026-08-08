"use client";

import { useMemo, useState } from "react";
import { ScanLine } from "lucide-react";
import ConfigRow from "./config-row";
import ReadoutRow from "./readout-row";
import { BRAND, DISPLAY, PROCUREMENTS, REGION_NOTE, SCALE, plural, quote, won, type ProcurementId } from "./data";

const SKIP =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-amber-400 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-zinc-950 focus-visible:outline-none";

/**
 * Tillmark pricing — one screen, no scrolling narrative.
 *
 * The whole page is a readout over a control surface, the way the product itself is: the two
 * amounts sit up top and never leave, the three controls that move them sit directly beneath.
 * Nothing is revealed by scrolling and nothing is gated behind a click, because the reader is a
 * stranger evaluating a vendor, not a customer who has hit a wall.
 *
 * State lives here and only here. `quotes` is one memo holding the same calculation run for all
 * three procurement modes, so the headline figures, the amounts printed on the two options the
 * reader did not pick, the recommended tier and both calls to action are all reading one result.
 * Computing them separately is the failure mode this layout exists to avoid: independent
 * calculations agree at the default values and diverge on the first click.
 */
export default function PricingClient() {
  const [procurement, setProcurement] = useState<ProcurementId>("installment");
  const [stores, setStores] = useState(SCALE.stores.initial);
  const [perStore, setPerStore] = useState(SCALE.perStore.initial);

  const quotes = useMemo(
    () => ({
      buy: quote("buy", stores, perStore),
      installment: quote("installment", stores, perStore),
      rental: quote("rental", stores, perStore),
    }),
    [stores, perStore],
  );

  const active = quotes[procurement];
  const modeLabel = PROCUREMENTS.find((p) => p.id === procurement)?.label ?? "";

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-50">
      <a href="#configure" className={SKIP}>
        Skip to the pricing controls
      </a>

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-[1400px] items-center gap-2 px-5 py-3 sm:px-8">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-amber-400"
          >
            <ScanLine className="h-4 w-4" />
          </span>
          <span className="text-base font-semibold tracking-tight text-zinc-50" style={DISPLAY}>
            {BRAND}
          </span>
          <span className="hidden text-sm font-normal text-zinc-400 lg:inline">
            Point of sale for counters, lanes and handhelds
          </span>
          <span className="ml-auto flex-none rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-normal text-zinc-400">
            {REGION_NOTE}
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-4 px-5 py-4 sm:px-8">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between xl:gap-8">
          <div className="min-w-0 xl:max-w-2xl">
            <h1
              className="text-2xl leading-tight font-semibold tracking-tight text-balance text-zinc-50 sm:text-3xl"
              style={DISPLAY}
            >
              Two numbers, not a quote.
            </h1>
            <p className="mt-2 text-sm leading-relaxed font-normal text-zinc-400">
              What leaves your account the day we install, and what leaves it every month after — set your scale
              and how the terminals are financed, and both move together.
            </p>
          </div>

          {/* The configuration in words. Doubles as the page's live region: one polite announcement
              carrying both amounts, instead of four separate figures each announcing themselves. */}
          <p
            role="status"
            className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 xl:text-right"
          >
            <span className="block text-xs font-medium tracking-[0.16em] text-zinc-400 uppercase">Configured</span>
            <span className="mt-1 block text-sm font-medium text-zinc-50 tabular-nums" style={DISPLAY}>
              {plural(stores, "store", "stores")} × {plural(perStore, "terminal", "terminals")} · {active.tier.name}{" "}
              plan · {modeLabel}
            </span>
            <span className="sr-only">
              {won(active.dueToday)} due today and {won(active.monthly)} every month.
            </span>
          </p>
        </div>

        <ReadoutRow quote={active} />

        <ConfigRow
          procurement={procurement}
          onProcurement={setProcurement}
          stores={stores}
          onStores={setStores}
          perStore={perStore}
          onPerStore={setPerStore}
          quotes={quotes}
        />
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-3 text-xs leading-relaxed font-normal text-zinc-400 sm:px-8">
          © 2026 {BRAND} Systems. Installments financed by {BRAND} Capital at a 6% total fee over 24 months; rental
          terminals remain {BRAND} property. Amounts exclude VAT.
        </div>
      </footer>
    </div>
  );
}
