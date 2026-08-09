'use client';

import { useCallback, useId, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Check, ChevronLeft, ChevronRight, MoveHorizontal, X } from 'lucide-react';
import { Specimen } from './Mark';
import type { Rendering, Rule } from './data';

const MIN = 4;
const MAX = 96;

function MiniPlate({
  r,
  uid,
  tone,
  label,
}: {
  r: Rendering;
  uid: string;
  tone: 'ok' | 'bad';
  label: string;
}) {
  const ok = tone === 'ok';
  return (
    <figure className="min-w-0">
      <div className="relative h-24 overflow-hidden rounded-lg border border-zinc-800">
        <div className="absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50">
          <Specimen r={r} uid={uid} markSize={56} />
        </div>
      </div>
      <figcaption
        className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium ${
          ok ? 'text-lime-300' : 'text-zinc-100'
        }`}
      >
        {ok ? (
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {label}
      </figcaption>
    </figure>
  );
}

export function CompareBand({ rule }: { rule: Rule }) {
  const [seam, setSeam] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [index, setIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const uid = useId().replace(/:/g, '');
  const zoomId = `${uid}-zoom`;

  const active = rule.cases[index];
  const total = rule.cases.length;

  const clamp = (v: number) => Math.min(MAX, Math.max(MIN, v));

  const setFromClientX = useCallback((clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const pct = Math.round(((clientX - rect.left) / rect.width) * 100);
    setSeam(Math.min(MAX, Math.max(MIN, pct)));
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') setSeam((v) => clamp(v - step));
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') setSeam((v) => clamp(v + step));
    else if (event.key === 'PageDown') setSeam((v) => clamp(v - 10));
    else if (event.key === 'PageUp') setSeam((v) => clamp(v + 10));
    else if (event.key === 'Home') setSeam(MIN);
    else if (event.key === 'End') setSeam(MAX);
    else return;
    event.preventDefault();
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromClientX(event.clientX);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragging.current) setFromClientX(event.clientX);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const lens = {
    transform: `scale(${zoom / 100})`,
    transformOrigin: `${seam}% 50%`,
  };

  return (
    <article className="grid gap-8 border-t border-zinc-800 pt-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-12">
      <div className="min-w-0">
        <p
          className="text-xs font-medium uppercase tracking-[0.2em] tabular-nums text-lime-300"
          style={{ fontFamily: 'var(--font-display-mono)' }}
        >
          Rule {rule.no}
        </p>
        <h3
          className="mt-2 text-2xl font-bold tracking-tight text-zinc-50"
          style={{ fontFamily: 'var(--font-display-mono)' }}
        >
          {rule.title}
        </h3>
        <p className="mt-3 text-sm font-normal leading-6 text-zinc-300">{rule.law}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <MiniPlate r={rule.correct} uid={`${uid}-mini-ok`} tone="ok" label="Correct" />
          <MiniPlate
            r={active.render}
            uid={`${uid}-mini-bad-${active.id}`}
            tone="bad"
            label="Misuse"
          />
        </div>

        <p className="mt-5 text-sm font-normal leading-6 text-zinc-400" aria-live="polite">
          <span className="font-medium text-zinc-100">{active.name}.</span> {active.why}
        </p>
      </div>

      <div className="min-w-0">
        <div
          ref={stageRef}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 sm:aspect-[16/9]"
        >
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - seam}% 0 0)` }}>
            <div
              className="absolute inset-0 transition-transform duration-300 motion-reduce:transition-none"
              style={lens}
            >
              <Specimen r={rule.correct} uid={`${uid}-stage-ok`} />
            </div>
            <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-zinc-950/90 px-3 py-1 text-xs font-medium text-lime-300 ring-1 ring-lime-300">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Correct
            </span>
          </div>

          <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${seam}%)` }}>
            <div
              className="absolute inset-0 transition-transform duration-300 motion-reduce:transition-none"
              style={lens}
            >
              <Specimen r={active.render} uid={`${uid}-stage-bad-${active.id}`} />
            </div>
            <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-zinc-950/90 px-3 py-1 text-xs font-medium text-zinc-100 ring-1 ring-zinc-500">
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Misuse: {active.name}
            </span>
          </div>

          <div
            role="slider"
            tabIndex={0}
            aria-label={`Comparison boundary for ${rule.title}`}
            aria-valuemin={MIN}
            aria-valuemax={MAX}
            aria-valuenow={seam}
            aria-valuetext={`${seam}% correct, ${100 - seam}% ${active.name}`}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            style={{ left: `${seam}%`, touchAction: 'none' }}
            className="group absolute inset-y-0 z-10 -ml-6 w-12 cursor-ew-resize"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-lime-300"
            />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lime-300 text-zinc-950 ring-4 ring-zinc-950 group-focus-visible:ring-zinc-100 group-hover:ring-zinc-800"
            >
              <MoveHorizontal className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              aria-label={`Previous misuse of ${rule.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 text-zinc-100 transition-colors duration-150 hover:border-lime-300 hover:text-lime-300 motion-reduce:transition-none"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % total)}
              aria-label={`Next misuse of ${rule.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 text-zinc-100 transition-colors duration-150 hover:border-lime-300 hover:text-lime-300 motion-reduce:transition-none"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="min-w-0 text-sm font-normal tabular-nums text-zinc-400">
              <span className="font-medium text-zinc-100">{active.name}</span>
              <span className="px-2 text-zinc-400">/</span>
              {index + 1} of {total}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor={zoomId}
              className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400"
            >
              Seam zoom
            </label>
            <input
              id={zoomId}
              type="range"
              min={100}
              max={240}
              step={20}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="h-2 w-28 accent-lime-300"
            />
            <span className="text-xs font-normal tabular-nums text-zinc-400">
              {(zoom / 100).toFixed(1)}x
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
