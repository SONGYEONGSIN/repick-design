"use client";

import { CornerDownLeft, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CAMPAIGNS, NAV_SECTIONS, channelLabel } from "./data";
import { BORDER, CHANNEL_SHAPE, PANEL_BG, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { ChannelGlyph } from "./ui";

type Entry = { id: string; title: string; meta: string; kind: "campaign" | "nav" };

/**
 * Lists every campaign regardless of the current filter state — selecting one is a
 * deliberate, explicit "take me there" shortcut, so (per command-deck.tsx) it also
 * widens the channel/objective filters if needed before pinning the bubble. That is
 * a different, power-user affordance from the plain click-to-pin on the chart
 * itself, which never touches filter state. Mounted fresh on every open (see
 * command-deck.tsx's conditional render) so `query`/`activeIndex` never need to be
 * reset inside an effect.
 */
export default function CommandPalette({ onClose, onSelectCampaign }: { onClose: () => void; onSelectCampaign: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries: Entry[] = useMemo(() => {
    const campaignEntries: Entry[] = CAMPAIGNS.map((c) => ({ id: c.id, title: c.name, meta: channelLabel(c.channel), kind: "campaign" }));
    const navEntries: Entry[] = NAV_SECTIONS.flatMap((s) => s.items.filter((i) => !i.disabled).map((i) => ({ id: i.id, title: i.label, meta: s.title, kind: "nav" as const })));
    const all = [...campaignEntries, ...navEntries];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((e) => e.title.toLowerCase().includes(q) || e.meta.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, entries.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        const entry = entries[activeIndex];
        if (entry?.kind === "campaign") {
          onSelectCampaign(entry.id);
          onClose();
        } else if (entry) {
          onClose();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [entries, activeIndex, onClose, onSelectCampaign]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" role="presentation">
      {/* Pointer-only close affordance — Escape (see the keydown handler above) is the
          keyboard path, so this stays out of the tab order rather than being a
          focusable no-label button. */}
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div role="dialog" aria-modal="true" aria-label="Command palette" className={cx("relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl shadow-black/50", BORDER, PANEL_BG)}>
        <div className={cx("flex h-14 items-center gap-2.5 border-b px-4", BORDER)}>
          <Search size={17} aria-hidden="true" className={TEXT_AUX} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            type="text"
            placeholder="Jump to a campaign or a section…"
            aria-label="Search campaigns and sections"
            aria-activedescendant={entries[activeIndex] ? `cmdk-opt-${entries[activeIndex].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-listbox"
            className={cx("h-full flex-1 rounded-md bg-transparent text-sm font-normal focus:outline-2 focus:-outline-offset-2 focus:outline-orange-400", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
          <kbd className={cx("rounded-md border px-1.5 py-0.5 text-[11px] font-medium", BORDER, TEXT_AUX)}>Esc</kbd>
        </div>

        <ul id="cmdk-listbox" role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-1.5">
          {entries.length === 0 ? <li className={cx("px-3 py-6 text-center text-sm font-normal", TEXT_AUX)}>No matches.</li> : null}
          {entries.map((entry, i) => {
            const active = i === activeIndex;
            const campaign = entry.kind === "campaign" ? CAMPAIGNS.find((c) => c.id === entry.id) : undefined;
            return (
              <li key={`${entry.kind}-${entry.id}`} id={`cmdk-opt-${entry.id}`} role="option" aria-selected={active}>
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    if (entry.kind === "campaign") onSelectCampaign(entry.id);
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left", TRANSITION, active ? "bg-orange-400/10" : "hover:bg-white/5")}
                >
                  <span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg border", BORDER, TEXT_AUX)}>
                    {campaign ? <ChannelGlyph channel={campaign.channel} shape={CHANNEL_SHAPE[campaign.channel]} size={14} /> : <Search size={13} aria-hidden="true" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{entry.title}</span>
                    <span className={cx("block truncate text-[11px] font-normal", TEXT_MUTED)}>{entry.meta}</span>
                  </span>
                  {active ? <CornerDownLeft size={13} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
