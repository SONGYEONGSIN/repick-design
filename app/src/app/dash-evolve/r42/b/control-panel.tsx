"use client";

import { BASELINE_HEADCOUNT, PRESETS, type Horizon, type SimInputs, type SlaTarget, inputsEqual } from "./sim";
import { FOCUS_RING, RangeSlider, SegmentedControl } from "./ui";

export default function ControlPanel({
  inputs,
  onChange,
}: {
  inputs: SimInputs;
  onChange: (next: SimInputs) => void;
}) {
  function patch(partial: Partial<SimInputs>) {
    onChange({ ...inputs, ...partial });
  }

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <div>
        <h2 id="controls-heading" className="font-semibold text-sm text-zinc-900">
          Capacity simulator
        </h2>
        <p className="mt-1 font-normal text-sm text-zinc-600">
          Every number on the right recomputes live from the levers below — nothing here is a canned scenario screenshot.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-600">Scenario presets</h3>
        <div className="mt-2 flex flex-col gap-1.5">
          {PRESETS.map((preset) => {
            const active = inputsEqual(inputs, preset.inputs);
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(preset.inputs)}
                className={`rounded-lg border px-3 py-2 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                  active ? "border-green-300 bg-green-50" : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
              >
                <span className="block font-medium text-sm text-zinc-900">{preset.label}</span>
                <span className="mt-0.5 block font-normal text-xs text-zinc-600">{preset.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-4">
        <h3 className="font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-600">Demand &amp; staffing levers</h3>
        <div className="mt-3 flex flex-col gap-4">
          <RangeSlider
            id="lever-growth"
            label="Volume growth"
            value={inputs.growthPct}
            min={0}
            max={40}
            step={10}
            onChange={(value) => patch({ growthPct: value })}
            formatValue={(value) => `+${value}%`}
          />
          <RangeSlider
            id="lever-aht"
            label="Handle time"
            value={inputs.ahtTenths}
            min={40}
            max={100}
            step={5}
            onChange={(value) => patch({ ahtTenths: value })}
            formatValue={(value) => `${(value / 10).toFixed(1)} min`}
          />
          <RangeSlider
            id="lever-shrinkage"
            label="Shrinkage"
            value={inputs.shrinkagePct}
            min={10}
            max={30}
            step={1}
            onChange={(value) => patch({ shrinkagePct: value })}
            formatValue={(value) => `${value}%`}
          />
          <RangeSlider
            id="lever-hires"
            label="Hires planned"
            value={inputs.hires}
            min={0}
            max={24}
            step={2}
            onChange={(value) => patch({ hires: value })}
            formatValue={(value) => `${value > 0 ? "+" : ""}${value} agents`}
          />
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-4">
        <h3 className="font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-600">Target &amp; horizon</h3>
        <div className="mt-3 flex flex-col gap-3">
          <div>
            <p className="mb-1.5 font-medium text-xs text-zinc-700">SLA target</p>
            <SegmentedControl
              label="SLA target"
              value={String(inputs.slaTarget)}
              onChange={(value) => patch({ slaTarget: Number(value) as SlaTarget })}
              options={[
                { value: "80", label: "80%" },
                { value: "90", label: "90%" },
                { value: "95", label: "95%" },
              ]}
            />
          </div>
          <div>
            <p className="mb-1.5 font-medium text-xs text-zinc-700">Planning horizon</p>
            <SegmentedControl
              label="Planning horizon"
              value={String(inputs.horizon)}
              onChange={(value) => patch({ horizon: Number(value) as Horizon })}
              options={[
                { value: "8", label: "8 weeks" },
                { value: "12", label: "12 weeks" },
              ]}
            />
          </div>
        </div>
      </div>

      <p className="rounded-lg bg-zinc-50 px-3 py-2 font-normal text-xs text-zinc-600">
        Current roster: <span className="font-semibold tabular-nums text-zinc-900">{BASELINE_HEADCOUNT + inputs.hires}</span> agents
        {inputs.hires > 0 ? ` (${BASELINE_HEADCOUNT} baseline + ${inputs.hires} planned hires)` : " (baseline, no hires added)"}.
      </p>
    </div>
  );
}
