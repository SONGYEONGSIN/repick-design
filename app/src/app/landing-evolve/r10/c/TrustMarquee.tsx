import { TRUST_ITEMS } from "./data";

/**
 * Horizontal trust-signal ticker. Pure CSS animation (no client JS needed): the keyframe and its
 * `prefers-reduced-motion` override live in the same inline `<style>` block so the pause behaviour
 * can never drift from the animation it guards. The visible track duplicates the list once for a
 * seamless loop and is `aria-hidden`; a single, un-duplicated list is exposed to screen readers so
 * the loop never gets read twice.
 */
export default function TrustMarquee() {
  return (
    <section aria-label="Trust signals" className="border-b border-white/10 bg-white/[0.02] py-6">
      <style>{`
        @keyframes r10cMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .r10c-marquee-track {
          animation: r10cMarquee 34s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .r10c-marquee-track {
            animation: none;
          }
        }
      `}</style>

      <ul className="sr-only">
        {TRUST_ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="overflow-hidden" aria-hidden="true">
        <div className="r10c-marquee-track flex w-max gap-10">
          {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-[-0.01em] text-white/80"
            >
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#B6A6F0]" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
