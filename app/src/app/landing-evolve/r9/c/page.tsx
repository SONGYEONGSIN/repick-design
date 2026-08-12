import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { FieldWork } from "./FieldWork";
import { GhostNumber } from "./Ghost";

export const metadata: Metadata = {
  title: "repick — Judge us by what we refuse",
  description:
    "repick screens every incoming listing against four guardrails. The whole board is on one plane: the picks and the refusals, with the reason each one was thrown out.",
};

const OPERATORS = [
  {
    id: "op-1",
    quote:
      "I stopped cross-checking listings after the third order. The refusal log is the reason — I can see what was thrown out, not just what survived.",
    attribution: "Buyer, 14 orders",
    focus: "Audio",
  },
  {
    id: "op-2",
    quote:
      "Every seller on this board has a payout history behind them. That is not a filter I switched on. It is the floor the board is built on.",
    attribution: "Buyer, 31 orders",
    focus: "Furniture",
  },
  {
    id: "op-3",
    quote:
      "Two of the refusals were cheaper than anything I picked. I could see exactly why they were refused, and I agreed with all four calls.",
    attribution: "Buyer, 7 orders",
    focus: "Cameras",
  },
];

export default function Page() {
  return (
    <div className="min-h-dvh bg-[#0B0B0F] text-white">
      <main>
        <FieldWork />

        <section
          id="operators"
          className="border-t border-[#1B1B22] px-5 py-24 sm:px-8 md:py-32"
        >
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <GhostNumber value="04" className="h-10 w-[92px]" />
                <p className="mt-4 text-[11px] font-normal uppercase tracking-[0.28em] text-[#A1A1AA]">
                  Operators
                </p>
                <h2
                  className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  They left the guardrails on.
                </h2>
                <p className="mt-5 max-w-prose text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
                  Buyers can override any guardrail on their own board. Across the
                  last quarter, 94 percent of them never did.
                </p>
              </div>

              <div className="grid gap-4 lg:col-span-8 lg:grid-cols-3">
                {OPERATORS.map((op) => (
                  <figure
                    key={op.id}
                    className="flex min-w-0 flex-col rounded-lg border border-[#1B1B22] bg-[#101015] p-6"
                  >
                    <span
                      aria-hidden="true"
                      className="block text-[56px] font-extrabold leading-[0.6] text-[#6E56CF]"
                      style={{ fontFamily: "var(--font-display-wide)" }}
                    >
                      &ldquo;
                    </span>
                    <blockquote className="mt-5 grow">
                      <p className="text-[16px] font-normal leading-[1.6] text-white">
                        {op.quote}
                      </p>
                    </blockquote>
                    <figcaption className="mt-6 border-t border-[#1B1B22] pt-4">
                      <span className="block text-[13px] font-semibold text-white">
                        {op.attribution}
                      </span>
                      <span className="mt-1 block text-[11px] font-normal uppercase tracking-[0.16em] text-[#A1A1AA]">
                        {op.focus}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <p className="mt-8 text-[12px] font-normal uppercase tracking-[0.16em] text-[#A1A1AA]">
              Fig. 03 — Attributions are role-level. Individual buyers are never named.
            </p>
          </div>
        </section>

        <section
          id="start"
          className="border-t border-[#1B1B22] px-5 py-24 sm:px-8 md:py-32"
        >
          <div className="mx-auto w-full max-w-[1120px]">
            <GhostNumber value="05" className="h-10 w-[92px]" />
            <div className="mt-6 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h2
                  className="text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  Start with the four
                  <span className="block text-[#A1A1AA]">that cleared.</span>
                </h2>
              </div>
              <div className="flex flex-col justify-end lg:col-span-5">
                <p className="max-w-prose text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
                  Your board is rebuilt every morning with all four guardrails
                  enforced. You can drop one whenever you want — and you will see
                  the cost printed next to it, the same way you did here.
                </p>
                <a
                  href="#board"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-[#6E56CF] px-7 py-4 text-[15px] font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6A6F0] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Open today&apos;s board
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1B1B22] px-5 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-[1120px]">
          <p className="text-[12px] font-normal leading-[1.6] tracking-[0.16em] text-[#A1A1AA]">
            REPICK — DEMONSTRATION BOARD. LISTINGS, SELLERS AND PRICES ARE
            FICTIONAL.
          </p>
        </div>
      </footer>
    </div>
  );
}
