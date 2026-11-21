"use client";

import { useRef } from "react";
import { PERSONAS, type PersonaId } from "./data";
import { ACCENT_BASE, FOCUS, INK } from "./ui";

type Props = {
  value: PersonaId;
  onChange: (id: PersonaId) => void;
  id?: string;
};

/**
 * The manipulation device: a segmented single-select with 3 mutually-exclusive seller personas.
 * Built as an APG radiogroup (role="radiogroup" / role="radio") rather than plain toggle buttons,
 * so screen reader and keyboard users get "1 of 3, selected" semantics plus arrow-key roving focus
 * -- Tab enters/exits the whole group once, arrows move the selection inside it.
 */
export default function PersonaSelect({ value, onChange, id }: Props) {
  const refs = useRef<Record<PersonaId, HTMLButtonElement | null>>({
    "first-listing": null,
    "regular-seller": null,
    "trade-in-bulk": null,
  });

  function move(delta: 1 | -1) {
    const idx = PERSONAS.findIndex((p) => p.id === value);
    const next = PERSONAS[(idx + delta + PERSONAS.length) % PERSONAS.length];
    onChange(next.id);
    refs.current[next.id]?.focus();
  }

  return (
    <div
      id={id}
      role="radiogroup"
      aria-label="Seller persona"
      className="inline-flex flex-wrap gap-1.5 rounded-full border border-zinc-700 bg-zinc-950/60 p-1.5"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          move(1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          move(-1);
        }
      }}
    >
      {PERSONAS.map((persona) => {
        const active = persona.id === value;
        return (
          <button
            key={persona.id}
            ref={(node) => {
              refs.current[persona.id] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(persona.id)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${FOCUS} ${
              active ? "" : "text-zinc-300 hover:text-white"
            }`}
            style={active ? { backgroundColor: ACCENT_BASE, color: INK } : undefined}
          >
            {persona.label}
          </button>
        );
      })}
    </div>
  );
}
