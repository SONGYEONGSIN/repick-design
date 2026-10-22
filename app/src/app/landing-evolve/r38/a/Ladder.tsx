'use client';

import { useRef, type KeyboardEvent } from 'react';
import { Check } from 'lucide-react';
import { COLORS } from './data';
import { TIERS } from './ladder-math';

interface LadderProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
  labelId: string;
}

/**
 * The single-select ordered-tier device: five rungs, one radiogroup, roving
 * tabindex. This is not a slider (no continuous drag), not a toggle array
 * (only one rung is ever "on"), and not a stepper (there is no +/- control
 * — you click the exact rung you want). Rendered top-to-bottom as the
 * highest tier first, matching the visual metaphor of climbing: ArrowUp
 * moves focus+selection to the rung above (a higher tier), ArrowDown to the
 * rung below, Home jumps to the top rung, End to the bottom one.
 *
 * Content IS the accessible name on every rung — the visible tier name sits
 * directly inside the button with no competing `aria-label`, so the
 * rendered text and the accessible name can never mismatch.
 */
export default function Ladder({ selectedIndex, onSelect, labelId }: LadderProps) {
  const rungRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusRung(index: number) {
    rungRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        next = Math.min(TIERS.length - 1, index + 1);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        next = Math.max(0, index - 1);
        break;
      case 'Home':
        next = TIERS.length - 1;
        break;
      case 'End':
        next = 0;
        break;
      default:
        return;
    }
    event.preventDefault();
    onSelect(next);
    focusRung(next);
  }

  const displayOrder = [...TIERS].map((tier, index) => ({ tier, index })).reverse();

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      className="relative flex flex-col gap-2"
    >
      {/* Connecting rail — a single thin line, not a decorative blueprint grid. */}
      <div
        aria-hidden="true"
        className="absolute left-[19px] top-6 bottom-6 w-px z-0"
        style={{ backgroundColor: COLORS.surfaceLine }}
      />

      {displayOrder.map(({ tier, index }) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={tier.id}
            ref={(el) => {
              rungRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="group relative z-10 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              backgroundColor: isSelected ? COLORS.accentSoft : 'transparent',
              outlineColor: COLORS.accent,
            }}
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold tabular-nums transition-colors"
              style={{
                backgroundColor: isSelected ? COLORS.accent : COLORS.surface,
                color: isSelected ? '#FFFFFF' : COLORS.mutedOnSurface,
                border: isSelected ? 'none' : `1px solid ${COLORS.surfaceLine}`,
              }}
            >
              {isSelected ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[14.5px] font-semibold leading-[1.3]" style={{ color: COLORS.fg }}>
                {tier.name}
              </span>
              <span
                className="hidden text-[12.5px] font-normal leading-[1.4] sm:block"
                style={{ color: COLORS.mutedOnSurface }}
              >
                {tier.description}
              </span>
            </span>

            <span
              aria-hidden="true"
              className="tabular-nums shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{
                color: isSelected ? COLORS.accentDeep : COLORS.mutedOnSurface,
                border: `1px solid ${isSelected ? COLORS.accent : COLORS.surfaceLine}`,
              }}
            >
              {tier.daysToSell}d
            </span>
            <span className="sr-only">{tier.daysToSell} days to sell</span>
          </button>
        );
      })}
    </div>
  );
}
