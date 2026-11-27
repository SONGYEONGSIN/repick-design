'use client';

import { PRICE_DOMAIN, SLIDER_STEP, MIN_GAP } from './data';

interface RangeSliderProps {
  min: number;
  max: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export default function RangeSlider({ min, max, onMinChange, onMaxChange }: RangeSliderProps) {
  const domainSpan = PRICE_DOMAIN.max - PRICE_DOMAIN.min;
  const minPct = ((min - PRICE_DOMAIN.min) / domainSpan) * 100;
  const maxPct = ((max - PRICE_DOMAIN.min) / domainSpan) * 100;

  return (
    <div className="repick-slider">
      <div className="relative h-11">
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-zinc-200" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-sky-600"
          style={{ left: `${minPct}%`, width: `${Math.max(0, maxPct - minPct)}%` }}
        />
        <input
          type="range"
          className="repick-thumb absolute inset-x-0 top-1/2 h-11 w-full -translate-y-1/2"
          min={PRICE_DOMAIN.min}
          max={PRICE_DOMAIN.max}
          step={SLIDER_STEP}
          value={min}
          aria-label="Minimum price"
          onChange={(e) => {
            const next = Math.min(Number(e.target.value), max - MIN_GAP);
            onMinChange(next);
          }}
        />
        <input
          type="range"
          className="repick-thumb absolute inset-x-0 top-1/2 h-11 w-full -translate-y-1/2"
          min={PRICE_DOMAIN.min}
          max={PRICE_DOMAIN.max}
          step={SLIDER_STEP}
          value={max}
          aria-label="Maximum price"
          onChange={(e) => {
            const next = Math.max(Number(e.target.value), min + MIN_GAP);
            onMaxChange(next);
          }}
        />
      </div>
      <style>{`
        .repick-thumb {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
          margin: 0;
        }
        .repick-thumb:focus-visible {
          outline: 2px solid #0369a1;
          outline-offset: 4px;
          border-radius: 9999px;
        }
        .repick-thumb::-webkit-slider-runnable-track {
          background: transparent;
        }
        .repick-thumb::-moz-range-track {
          background: transparent;
        }
        .repick-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: #0284c7;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 1px rgba(24, 24, 27, 0.18), 0 1px 2px rgba(24, 24, 27, 0.25);
          cursor: pointer;
        }
        .repick-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: #0284c7;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 1px rgba(24, 24, 27, 0.18), 0 1px 2px rgba(24, 24, 27, 0.25);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
