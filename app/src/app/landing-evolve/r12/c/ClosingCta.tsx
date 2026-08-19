import { ArrowRight } from "lucide-react";
import { cx, EYEBROW, FOCUS } from "./data";

/** Closing CTA — restates the loop in one line and points at the same conversion target
 * (`#estimate`) the calculator above already builds toward, rather than a second, separate promise. */
export default function ClosingCta() {
  return (
    <section aria-labelledby="closing-title" className="bg-[#0B0C10] py-24 md:py-28">
      <div className="mx-auto w-full max-w-[720px] px-5 text-center sm:px-8">
        <p className={cx(EYEBROW, "text-[#22d3ee]")}>Ready when you are</p>
        <h2
          id="closing-title"
          className="mt-4 text-[clamp(1.8rem,4.6vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.015em] text-white"
        >
          List it. Watch the price get built. Get paid.
        </h2>
        <p className="mx-auto mt-4 max-w-[460px] text-base font-normal leading-[1.6] text-[#A1A1AA]">
          No haggling with a stranger, no waiting on a reply — just the same
          evidence trail you just read, run on your own item.
        </p>
        <a
          href="#estimate"
          className={cx(
            "mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#e11d48] px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#c81440]",
            FOCUS,
          )}
        >
          Start a listing
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </a>
      </div>
    </section>
  );
}
