import Reveal from "./Reveal";
import { STRICTNESS_PROFILES, VALUE_PROPS, type StrictnessId } from "./data";
import { buildFlowGeometry, expectedPayoutPerItem } from "./flow-math";
import { ACCENT_TINT_TEXT, MUTED_TEXT } from "./tokens";

/**
 * Section 3: value in three parts, one per outcome band. Each card reads its own
 * live count/share from the SAME strictness state the hero toggle controls (via
 * `buildFlowGeometry`, never a hardcoded duplicate), so picking Strict up in the
 * hero visibly reflows these numbers too — proof is already on by default here;
 * this section just sharpens it. Body copy container: 15px -> 0.44 * 15 = 6.6px/char
 * -> max-w-[460px] -> 460 / 6.6 ≈ 69.7 chars/line.
 */
export default function ValueSplit({ strictnessId }: { strictnessId: StrictnessId }) {
  const profile = STRICTNESS_PROFILES[strictnessId];
  const geometry = buildFlowGeometry(profile.bands);
  const payout = expectedPayoutPerItem(profile.bands);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <h2 className="max-w-[460px] text-[28px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#171717] sm:text-[32px]">
          Three outcomes, every item lands in one
        </h2>
        <p className={`mt-2 max-w-[460px] text-[14px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
          Currently showing {profile.label} strictness — change it in the panel above
          and these numbers update with it.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {VALUE_PROPS.map((item, i) => {
          const g = geometry.find((entry) => entry.key === item.bandKey);
          return (
            <Reveal key={item.bandKey} delay={i * 0.08} className="min-w-0">
              <div className="min-w-0 flex flex-col gap-3">
                <p className="tabular-nums text-[12px] font-semibold uppercase tracking-[0.12em] text-[#525252]">
                  {g?.count} items · {g?.sharePercent}%
                </p>
                <h3 className="text-[16px] font-semibold leading-snug text-[#171717]">
                  {item.title}
                </h3>
                <p className={`max-w-[460px] text-[15px] font-normal leading-[1.55] ${MUTED_TEXT}`}>
                  {item.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2} className="mt-12">
        <div className="min-w-0 rounded-2xl border border-[#E5E2E1] bg-[#F5F3F3] p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#171717]">
            Live expected payout
          </p>
          <p className="tabular-nums mt-2 text-[34px] font-extrabold leading-none tracking-[-0.01em] text-[#171717] sm:text-[40px]">
            ${payout}
            <span className="text-[16px] font-normal text-[#525252]"> / item</span>
          </p>
          <p className={`mt-2 max-w-[460px] text-[14px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
            That&apos;s the <span className={`font-semibold ${ACCENT_TINT_TEXT}`}>{profile.label}</span>{" "}
            strictness figure from the panel above — switch strictness there and this
            number, and the closing offer below, move with it.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
