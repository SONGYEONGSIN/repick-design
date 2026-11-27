"use client";

import { Eye, Grid3x3, ShieldAlert } from "lucide-react";
import { ZoneLedger } from "./ZoneLedger";
import { ZONES, deriveRange, type ViewMode } from "./zones";
import { ACCENT, ACCENT_SOFT_BG, BORDER, BORDER_STRONG, FG, MUTED, PROSE_WIDTH_COLUMN, SURFACE } from "./tokens";

interface ValueSplitProps {
  flaggedIds: Set<string>;
  view: ViewMode;
  onToggleZone: (id: string) => void;
  onSetView: (view: ViewMode) => void;
}

const PILLARS = [
  {
    icon: Grid3x3,
    label: "Six fixed zones, not a free draw",
    description: "Every zone has its own permanent chip, always visible and keyboard-operable — no invisible hotspot ever carries the only way to flag a concern.",
  },
  {
    icon: ShieldAlert,
    label: "Flagging widens, not just lowers",
    description: "Raising a concern doesn't just cut the price — it admits uncertainty by widening the range itself. Confirming clean keeps the range tight.",
  },
  {
    icon: Eye,
    label: "Same numbers, two voices",
    description: "Seller view and buyer view describe the exact same flagged zones in different language — the dollar figures never move between them.",
  },
];

const ALL_IDS = new Set(ZONES.map((z) => z.id));
const NONE_IDS = new Set<string>();

/**
 * "Value, three ways" — the ledger's three guarantees explained independently, a full mirror of
 * the device (with every ledger row visible), and the two bookend estimates (nothing flagged,
 * everything flagged) so the floor and ceiling of the range are visible without a 64-row
 * combinatorial table. Both bookends are produced by calling the SAME `deriveRange` function the
 * live device uses.
 */
export function ValueSplit({ flaggedIds, view, onToggleZone, onSetView }: ValueSplitProps) {
  const floor = deriveRange(ALL_IDS);
  const ceiling = deriveRange(NONE_IDS);
  const current = deriveRange(flaggedIds);

  return (
    <section id="value" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ color: FG }}>
          Value, three ways
        </h2>
        <p className="mt-1.5 max-w-[560px] text-[14.5px] font-normal leading-[1.6]" style={{ color: MUTED }}>
          The ledger doesn&rsquo;t hide what you&rsquo;re unsure about — it prices the uncertainty itself.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.label} className="min-w-0 rounded-2xl p-5" style={{ border: `1px solid ${BORDER}`, backgroundColor: "#09090B" }}>
                <Icon className="h-5 w-5" aria-hidden="true" style={{ color: ACCENT }} />
                <h3 className="mt-3 text-[16px] font-semibold tracking-[-0.02em]" style={{ color: FG }}>
                  {pillar.label}
                </h3>
                <p className={`mt-1.5 text-[13.5px] font-normal leading-[1.55] ${PROSE_WIDTH_COLUMN}`} style={{ color: MUTED }}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <p id="ledger-label-full" className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              Adjust what you flag
            </p>
            <ZoneLedger
              flaggedIds={flaggedIds}
              view={view}
              onToggleZone={onToggleZone}
              onSetView={onSetView}
              groupLabelId="ledger-label-full"
            />
          </div>

          <div id="bookends" className="min-w-0">
            <h3 className="text-[14px] font-semibold tracking-[-0.02em]" style={{ color: FG }}>
              The floor and the ceiling
            </h3>
            <p className="mt-1 text-[12.5px] font-normal" style={{ color: MUTED }}>
              Every combination you can flag lands between these two. Your current row is highlighted.
            </p>
            <table className="mt-3 w-full table-fixed border-collapse text-left">
              <caption className="sr-only">
                Estimated price range with zero zones flagged versus all six zones flagged
              </caption>
              <colgroup>
                <col style={{ width: "46%" }} />
                <col style={{ width: "27%" }} />
                <col style={{ width: "27%" }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER_STRONG}` }}>
                  <th scope="col" className="py-2 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Flagged zones
                  </th>
                  <th scope="col" className="py-2 text-right text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Range
                  </th>
                  <th scope="col" className="py-2 text-right text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Width
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const isPureBookend = flaggedIds.size === 0 || flaggedIds.size === 6;
                  const rows: { label: string; result: typeof ceiling; highlight: boolean }[] = [
                    { label: "0 of 6 (ceiling case)", result: ceiling, highlight: flaggedIds.size === 0 },
                  ];
                  if (!isPureBookend) {
                    rows.push({ label: `${flaggedIds.size} of 6 (your current row)`, result: current, highlight: true });
                  }
                  rows.push({ label: "6 of 6 (floor case)", result: floor, highlight: flaggedIds.size === 6 });
                  return rows.map((row) => (
                    <tr
                      key={row.label}
                      style={{
                        borderBottom: `1px solid ${BORDER}`,
                        backgroundColor: row.highlight ? ACCENT_SOFT_BG : "transparent",
                      }}
                    >
                      <th scope="row" className="py-2 pr-2 text-[12.5px] font-semibold" style={{ color: FG }}>
                        {row.label}
                      </th>
                      <td className="py-2 text-right text-[12.5px] font-semibold tabular-nums" style={{ color: FG }}>
                        ${row.result.low}–{row.result.high}
                      </td>
                      <td className="py-2 text-right text-[12.5px] font-semibold tabular-nums" style={{ color: ACCENT }}>
                        ${row.result.high - row.result.low}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
