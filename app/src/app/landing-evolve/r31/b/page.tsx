'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { JSX, ReactNode, PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import {
  Heart,
  X,
  Undo2,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  ShieldOff,
  Percent,
  Layers3,
  Sparkles,
  Radar as RadarIcon,
  Tag,
} from 'lucide-react';

/* ----------------------------------------------------------------------- */
/* Taste axes — fixed, deterministic order. Index drives radar geometry.    */
/* ----------------------------------------------------------------------- */

const AXES = [
  'Vintage',
  'Minimalist',
  'Streetwear',
  'Formal',
  'Sustainable',
  'Statement',
] as const;

type Axis = (typeof AXES)[number];

const BASELINE: Record<Axis, number> = {
  Vintage: 50,
  Minimalist: 50,
  Streetwear: 50,
  Formal: 50,
  Sustainable: 50,
  Statement: 50,
};

type Direction = 'left' | 'right';

interface ProductCard {
  id: string;
  name: string;
  price: number;
  original: number;
  grade: string;
  verified: boolean;
  match: number;
  photoId: string;
  alt: string;
  /** Fixed, hand-authored deltas applied on a right (love) swipe. */
  rightDelta: Partial<Record<Axis, number>>;
  /** Fixed, hand-authored deltas applied on a left (pass) swipe. */
  leftDelta: Partial<Record<Axis, number>>;
}

function unsplash(id: string, w = 760): string {
  return `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;
}

/**
 * Deterministic card-to-axis delta table. Every card always produces the
 * exact same deltas on the exact same swipe direction — no randomness, no
 * clock reads. The final radar shape for any swipe sequence can be verified
 * by hand-summing this table.
 */
const CARDS: ProductCard[] = [
  {
    id: 'denim-trucker',
    name: 'Vintage Denim Trucker Jacket',
    price: 58,
    original: 140,
    grade: 'Good, light fade',
    verified: true,
    match: 91,
    photoId: 'photo-1551028719-00167b16eac5',
    alt: 'Faded blue denim trucker jacket laid flat',
    rightDelta: { Vintage: 14, Streetwear: 4, Sustainable: 2 },
    leftDelta: { Vintage: -5 },
  },
  {
    id: 'court-sneakers',
    name: 'Court Legacy Sneakers',
    price: 72,
    original: 150,
    grade: 'Like new',
    verified: true,
    match: 88,
    photoId: 'photo-1549298916-b41d501d3772',
    alt: 'White low-top sneakers on a pink background',
    rightDelta: { Streetwear: 14, Minimalist: 3 },
    leftDelta: { Streetwear: -5 },
  },
  {
    id: 'wool-blazer',
    name: 'Tailored Wool Blazer',
    price: 94,
    original: 260,
    grade: 'Excellent',
    verified: true,
    match: 85,
    photoId: 'photo-1521572163474-6864f9cf17ab',
    alt: 'Person wearing a tailored brown wool blazer',
    rightDelta: { Formal: 14, Minimalist: 4 },
    leftDelta: { Formal: -5 },
  },
  {
    id: 'raffia-tote',
    name: 'Woven Raffia Tote',
    price: 36,
    original: 85,
    grade: 'Like new',
    verified: false,
    match: 79,
    photoId: 'photo-1485462537746-965f33f7f6a7',
    alt: 'Hand-woven natural raffia tote bag',
    rightDelta: { Sustainable: 14, Minimalist: 3 },
    leftDelta: { Sustainable: -5 },
  },
  {
    id: 'white-sneakers',
    name: 'Essential White Sneakers',
    price: 64,
    original: 120,
    grade: 'Excellent',
    verified: true,
    match: 93,
    photoId: 'photo-1591047139829-d91aecb6caea',
    alt: 'Clean minimal white sneakers side profile',
    rightDelta: { Minimalist: 14, Formal: 2 },
    leftDelta: { Minimalist: -5 },
  },
  {
    id: 'silk-slip-dress',
    name: 'Crimson Silk Slip Dress',
    price: 82,
    original: 210,
    grade: 'Like new',
    verified: true,
    match: 87,
    photoId: 'photo-1576566588028-4147f3842f27',
    alt: 'Deep red silk slip dress on a model',
    rightDelta: { Statement: 14, Vintage: 3 },
    leftDelta: { Statement: -5 },
  },
  {
    id: 'shearling-coat',
    name: 'Shearling-Collar Denim Coat',
    price: 118,
    original: 310,
    grade: 'Good, minor wear',
    verified: true,
    match: 82,
    photoId: 'photo-1503341504253-dff4815485f1',
    alt: 'Denim coat with a shearling collar on a hanger',
    rightDelta: { Statement: 8, Vintage: 8 },
    leftDelta: { Statement: -3, Vintage: -2 },
  },
];

interface SwipeEntry {
  cardId: string;
  direction: Direction;
}

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function computeScores(history: SwipeEntry[]): Record<Axis, number> {
  const scores = { ...BASELINE };
  for (const entry of history) {
    const card = CARDS.find((c) => c.id === entry.cardId);
    if (!card) continue;
    const deltas = entry.direction === 'right' ? card.rightDelta : card.leftDelta;
    for (const axis of AXES) {
      const delta = deltas[axis];
      if (delta) {
        scores[axis] = clamp(scores[axis] + delta);
      }
    }
  }
  return scores;
}

function getDominantAxis(scores: Record<Axis, number>): Axis {
  return AXES.reduce((best, axis) => (scores[axis] > scores[best] ? axis : best), AXES[0]);
}

function getRecommended(dominant: Axis | null): ProductCard[] {
  if (!dominant) return CARDS.slice(0, 3);
  return [...CARDS]
    .map((card) => ({ card, weight: card.rightDelta[dominant] ?? 0 }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((entry) => entry.card);
}

/* ----------------------------------------------------------------------- */
/* Reduced motion — hydration-safe, no SSR mismatch.                        */
/* ----------------------------------------------------------------------- */

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

/* ----------------------------------------------------------------------- */
/* Radar geometry — hand-built SVG, deterministic trig, no library.         */
/* ----------------------------------------------------------------------- */

const RADAR_SIZE = 320;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_MAX_R = 100;
const RADAR_LABEL_R = 128;

function axisAngle(index: number): number {
  return -Math.PI / 2 + index * ((2 * Math.PI) / AXES.length);
}

function pointAt(index: number, radius: number): { x: number; y: number } {
  const angle = axisAngle(index);
  return {
    x: RADAR_CENTER + radius * Math.cos(angle),
    y: RADAR_CENTER + radius * Math.sin(angle),
  };
}

function polygonPoints(scores: Record<Axis, number>): string {
  return AXES.map((axis, i) => {
    const r = (scores[axis] / 100) * RADAR_MAX_R;
    const p = pointAt(i, r);
    return `${p.x},${p.y}`;
  }).join(' ');
}

function ringPoints(fraction: number): string {
  const pts: string[] = [];
  for (let i = 0; i < AXES.length; i += 1) {
    const p = pointAt(i, fraction * RADAR_MAX_R);
    pts.push(`${p.x},${p.y}`);
  }
  return pts.join(' ');
}

function labelAnchor(index: number): 'start' | 'middle' | 'end' {
  const angle = axisAngle(index);
  const cos = Math.cos(angle);
  if (cos > 0.3) return 'start';
  if (cos < -0.3) return 'end';
  return 'middle';
}

/* ----------------------------------------------------------------------- */
/* Presentational helpers — module scope, never defined inside the page.   */
/* ----------------------------------------------------------------------- */

function renderBadge(icon: ReactNode, label: string): JSX.Element {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-neutral-200">
      {icon}
      {label}
    </span>
  );
}

interface SwipeCardProps {
  card: ProductCard;
  variant: 'active' | 'peek';
  dragX: number;
  isDragging: boolean;
  reducedMotion: boolean;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}

function renderSwipeCard(props: SwipeCardProps): JSX.Element {
  const { card, variant, dragX, isDragging, reducedMotion, onPointerDown, onPointerMove, onPointerUp } = props;
  const isActive = variant === 'active';
  const transform = isActive ? `translateX(${dragX}px) rotate(${dragX / 18}deg)` : 'translateY(14px) scale(0.96)';
  const transition = isActive && !isDragging && !reducedMotion ? 'transform 240ms ease' : 'none';
  const discountPct = Math.round(100 - (card.price / card.original) * 100);

  return (
    <div
      className={`absolute inset-0 rounded-2xl border border-white/10 bg-[#121218] p-4 shadow-xl ${
        isActive ? 'z-20 touch-none' : 'z-10 opacity-60'
      }`}
      style={{ transform, transition }}
      aria-hidden={isActive ? undefined : true}
      onPointerDown={isActive ? onPointerDown : undefined}
      onPointerMove={isActive ? onPointerMove : undefined}
      onPointerUp={isActive ? onPointerUp : undefined}
      onPointerCancel={isActive ? onPointerUp : undefined}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-neutral-900">
        <Image
          src={unsplash(card.photoId)}
          alt={card.alt}
          fill
          sizes="(max-width: 768px) 80vw, 320px"
          className="object-cover"
        />
      </div>
      <p className="mt-3 text-base font-bold leading-snug text-white">{card.name}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-bold text-white">${card.price}</span>
        <span className="text-sm font-normal text-neutral-500 line-through">${card.original}</span>
        <span className="text-sm font-medium text-[#C8FF4D]">{discountPct}% off</span>
      </div>
      <dl className="mt-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <dt className="flex items-center gap-1 text-[11px] font-medium text-neutral-400">
            <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
            Condition
          </dt>
          <dd className="text-[11px] font-normal text-neutral-200">{card.grade}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="flex items-center gap-1 text-[11px] font-medium text-neutral-400">
            <Percent className="h-3.5 w-3.5" aria-hidden="true" />
            AI match
          </dt>
          <dd className="text-[11px] font-normal text-neutral-200">{card.match}%</dd>
        </div>
      </dl>
      <div className="mt-2 flex flex-wrap gap-2">
        {card.verified
          ? renderBadge(<ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />, 'Verified seller')
          : renderBadge(<ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />, 'Unverified seller')}
      </div>
    </div>
  );
}

interface RadarChartProps {
  displayScores: Record<Axis, number>;
  targetScores: Record<Axis, number>;
  activeAxis: Axis | null;
  onAxisEnter: (axis: Axis) => void;
  onAxisLeave: () => void;
}

function renderRadarChart(props: RadarChartProps): JSX.Element {
  const { displayScores, targetScores, activeAxis, onAxisEnter, onAxisLeave } = props;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px]">
      <svg
        viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
        width="100%"
        height="100%"
        role="img"
        aria-label="Radar chart of your current taste profile across six style axes"
      >
        {[0.25, 0.5, 0.75, 1].map((fraction) => (
          <polygon
            key={fraction}
            points={ringPoints(fraction)}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />
        ))}
        {AXES.map((axis, i) => {
          const edge = pointAt(i, RADAR_MAX_R);
          return (
            <line
              key={axis}
              x1={RADAR_CENTER}
              y1={RADAR_CENTER}
              x2={edge.x}
              y2={edge.y}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1}
            />
          );
        })}
        <polygon
          points={polygonPoints(displayScores)}
          fill="#C8FF4D"
          fillOpacity={0.22}
          stroke="#C8FF4D"
          strokeWidth={2}
        />
        {AXES.map((axis, i) => {
          const label = pointAt(i, RADAR_LABEL_R);
          const anchor = labelAnchor(i);
          return (
            <text
              key={axis}
              x={label.x}
              y={label.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-neutral-300 text-[11px] font-medium"
            >
              {axis}
            </text>
          );
        })}
      </svg>
      {AXES.map((axis, i) => {
        const r = (targetScores[axis] / 100) * RADAR_MAX_R;
        const p = pointAt(i, r);
        const leftPct = (p.x / RADAR_SIZE) * 100;
        const topPct = (p.y / RADAR_SIZE) * 100;
        const isActive = activeAxis === axis;
        return (
          <button
            key={axis}
            type="button"
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-[#0B0B0F] p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8FF4D] ${
              isActive ? 'border-[#C8FF4D]' : 'border-white/40'
            }`}
            style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            onMouseEnter={() => onAxisEnter(axis)}
            onMouseLeave={onAxisLeave}
            onFocus={() => onAxisEnter(axis)}
            onBlur={onAxisLeave}
            aria-label={`${axis} score: ${Math.round(targetScores[axis])} out of 100`}
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-[#C8FF4D]" />
          </button>
        );
      })}
    </div>
  );
}

function renderRecommendedCard(card: ProductCard, dominant: Axis | null, scores: Record<Axis, number>): JSX.Element {
  const leanScore = dominant ? Math.round(scores[dominant]) : null;
  return (
    <div key={card.id} className="rounded-2xl border border-white/10 bg-[#121218] p-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-neutral-900">
        <Image
          src={unsplash(card.photoId, 600)}
          alt={card.alt}
          fill
          sizes="(max-width: 768px) 45vw, 260px"
          className="object-cover"
        />
      </div>
      <h3 className="mt-3 text-sm font-bold text-white">{card.name}</h3>
      <p className="mt-1 text-sm font-normal text-neutral-400">
        ${card.price} · {card.grade}
      </p>
      <p className="mt-2 text-xs font-medium text-[#C8FF4D]">
        {dominant && leanScore !== null
          ? `${leanScore}/100 lean toward ${dominant}`
          : 'Shown before your profile is built'}
      </p>
    </div>
  );
}

function renderValuePillar(icon: ReactNode, title: string, body: string): JSX.Element {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121218] p-6 sm:p-7">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#C8FF4D] text-[#0B0B0F]">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 max-w-[280px] text-sm font-normal leading-relaxed text-neutral-400">{body}</p>
    </div>
  );
}

function renderStat(value: string, label: string): JSX.Element {
  return (
    <div className="flex items-center gap-1.5">
      <dt className="text-[13px] font-medium text-neutral-400">{label}</dt>
      <dd className="text-[13px] font-bold text-white">{value}</dd>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Page                                                                     */
/* ----------------------------------------------------------------------- */

export default function Page(): JSX.Element {
  const [history, setHistory] = useState<SwipeEntry[]>([]);
  const [activeAxis, setActiveAxis] = useState<Axis | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const reducedMotion = useReducedMotion();
  const startXRef = useRef<number | null>(null);

  const targetScores = useMemo(() => computeScores(history), [history]);
  const [displayScores, setDisplayScores] = useState<Record<Axis, number>>(targetScores);
  const fromScoresRef = useRef<Record<Axis, number>>(targetScores);

  useEffect(() => {
    const from = fromScoresRef.current;
    const to = targetScores;
    if (reducedMotion) {
      setDisplayScores(to);
      fromScoresRef.current = to;
      return;
    }
    const duration = 260;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = {} as Record<Axis, number>;
      for (const axis of AXES) {
        next[axis] = from[axis] + (to[axis] - from[axis]) * eased;
      }
      setDisplayScores(next);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        fromScoresRef.current = to;
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [targetScores, reducedMotion]);

  const hasSwiped = history.length > 0;
  const deckComplete = history.length >= CARDS.length;
  const dominant = hasSwiped ? getDominantAxis(targetScores) : null;
  const currentCard = deckComplete ? null : CARDS[history.length];
  const nextCard = currentCard ? CARDS[history.length + 1] ?? null : null;
  const recommended = useMemo(() => getRecommended(dominant), [dominant]);

  function handleSwipe(direction: Direction) {
    if (!currentCard) return;
    setHistory((h) => [...h, { cardId: currentCard.id, direction }]);
    setDragX(0);
  }

  function handleUndo() {
    setHistory((h) => h.slice(0, -1));
  }

  function handleReset() {
    setHistory([]);
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    startXRef.current = e.clientX;
    setIsDragging(true);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (startXRef.current === null) return;
    setDragX(e.clientX - startXRef.current);
  }

  function handlePointerUp() {
    const threshold = 90;
    startXRef.current = null;
    setIsDragging(false);
    if (dragX > threshold) {
      handleSwipe('right');
    } else if (dragX < -threshold) {
      handleSwipe('left');
    } else {
      setDragX(0);
    }
  }

  const lastEntry = history[history.length - 1];
  const lastCard = lastEntry ? CARDS.find((c) => c.id === lastEntry.cardId) : undefined;
  const liveMessage =
    lastEntry && lastCard
      ? `${lastEntry.direction === 'right' ? 'Loved' : 'Passed on'} ${lastCard.name}. ${AXES.map(
          (axis) => `${axis} now ${Math.round(targetScores[axis])}`,
        ).join(', ')}.`
      : 'Sort the deck to begin building your taste profile.';

  const readoutAxis = activeAxis ?? dominant;
  const readoutText = readoutAxis
    ? `${readoutAxis}: ${Math.round(targetScores[readoutAxis])} / 100`
    : 'Balanced across all six, 50 / 100 each';

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>

      {/* top bar */}
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-6 sm:px-8">
        <span className="text-lg font-bold tracking-tight">repick</span>
        <a
          href="#taste-deck"
          className="rounded-full bg-[#C8FF4D] px-4 py-2 text-sm font-medium text-[#0B0B0F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8FF4D]"
        >
          Start sorting
        </a>
      </div>

      {/* HERO — headline, deck, and radar all live together in one section */}
      <section id="taste-deck" className="mx-auto max-w-[1280px] px-5 pb-16 pt-6 sm:px-8 sm:pb-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr_1fr] lg:items-start lg:gap-8">
          <div className="min-w-0">
            <h1 className="text-[clamp(2.4rem,1.6rem+4.2vw,4.6rem)] max-[480px]:text-[clamp(2.1rem,1.4rem+6vw,2.9rem)] font-bold leading-[1.02] tracking-tight">
              Sort seven pieces.
              <br />
              Meet the style that is
              <br />
              already yours.
            </h1>
            <p className="mt-6 max-w-[560px] text-lg font-normal leading-relaxed text-neutral-400">
              Seven resale finds, one quick call on each. By the last card, repick has a clear
              read on what you actually wear, not what a quiz thinks you should.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSwipe('left')}
                disabled={!currentCard}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8FF4D]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Pass
              </button>
              <button
                type="button"
                onClick={() => handleSwipe('right')}
                disabled={!currentCard}
                className="inline-flex items-center gap-2 rounded-full bg-[#C8FF4D] px-5 py-3 text-sm font-medium text-[#0B0B0F] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8FF4D]"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
                Love it
              </button>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={handleUndo}
                disabled={!hasSwiped}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8FF4D]"
              >
                <Undo2 className="h-4 w-4" aria-hidden="true" />
                Undo last swipe
              </button>
              {hasSwiped && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8FF4D]"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reset deck
                </button>
              )}
            </div>
            <p className="mt-6 text-sm font-normal text-neutral-500">
              {deckComplete
                ? `All seven sorted. ${history.length} swipes in.`
                : `Card ${history.length + 1} of ${CARDS.length}. Use the buttons above, or drag the card with a mouse or finger.`}
            </p>
          </div>

          <div className="min-w-0">
            <div className="relative h-[560px] w-full max-w-[300px] mx-auto lg:mx-0">
              {deckComplete ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#121218] p-6 text-center">
                  <Sparkles className="h-6 w-6 text-[#C8FF4D]" aria-hidden="true" />
                  <p className="mt-3 text-base font-bold text-white">Deck complete</p>
                  <p className="mt-2 text-sm font-normal text-neutral-400">
                    Your profile leans {dominant}. See what matches below.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8FF4D]"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Sort again
                  </button>
                </div>
              ) : (
                <>
                  {nextCard &&
                    renderSwipeCard({
                      card: nextCard,
                      variant: 'peek',
                      dragX: 0,
                      isDragging: false,
                      reducedMotion,
                    })}
                  {currentCard &&
                    renderSwipeCard({
                      card: currentCard,
                      variant: 'active',
                      dragX,
                      isDragging,
                      reducedMotion,
                      onPointerDown: handlePointerDown,
                      onPointerMove: handlePointerMove,
                      onPointerUp: handlePointerUp,
                    })}
                </>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
              Your taste profile
            </p>
            {renderRadarChart({
              displayScores,
              targetScores,
              activeAxis,
              onAxisEnter: setActiveAxis,
              onAxisLeave: () => setActiveAxis(null),
            })}
            <p className="mt-3 text-center text-sm font-medium text-neutral-300" aria-live="polite">
              {readoutText}
            </p>
            <p className="mt-1 text-center text-xs font-normal text-neutral-500">
              Hover or focus a point on the chart for its exact score.
            </p>
          </div>
        </div>
      </section>

      {/* VALUE BREAKDOWN */}
      <section className="border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="max-w-[560px] text-3xl font-bold leading-tight sm:text-4xl">
            Three things happen before a listing ever reaches you.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {renderValuePillar(
              <Sparkles className="h-5 w-5" aria-hidden="true" />,
              'AI condition grading',
              'Every photo set is graded against the same six-point scale, so Good never quietly means Fair.',
            )}
            {renderValuePillar(
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
              'Verified sellers only',
              'Identity and item ownership are checked before a listing goes live, not after a dispute opens.',
            )}
            {renderValuePillar(
              <RadarIcon className="h-5 w-5" aria-hidden="true" />,
              'Matched to how you dress',
              'Every swipe above sharpens the same profile that quietly ranks what shows up in your feed.',
            )}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
            <blockquote className="max-w-[600px] text-xl font-normal leading-relaxed text-neutral-300 sm:text-2xl">
              I listed a coat I had not worn in two years. It sold to someone whose
              profile already leaned the exact same way mine does. Grading made the
              price easy to trust on both sides.
              <footer className="mt-4 text-sm font-medium text-neutral-500">
                — Dana M., seller since 2023
              </footer>
            </blockquote>
            <dl className="flex flex-col gap-4 self-center rounded-2xl border border-white/10 bg-[#121218] p-6">
              {renderStat('1.2M+', 'pieces resold through repick')}
              {renderStat('4.8 / 5', 'average seller rating')}
              {renderStat('6 grades', 'AI-checked on every photo set')}
            </dl>
          </div>
        </div>
      </section>

      {/* RECOMMENDED — causally tied to the live taste profile */}
      <section id="recommended" className="border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            {dominant ? `Picked toward ${dominant}` : 'A balanced starting mix'}
          </h2>
          <p className="mt-3 max-w-[520px] text-base font-normal leading-relaxed text-neutral-400">
            {dominant
              ? `These three climbed highest once your profile leaned ${dominant}. Sort more cards above and this list reorders with you.`
              : 'Sort the deck above and this list will reorder around whichever axis pulls ahead.'}
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {recommended.map((card) => renderRecommendedCard(card, dominant, targetScores))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA — references the current profile state */}
      <section className="border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1280px]">
          <div className="rounded-3xl border border-white/10 bg-[#121218] p-10 sm:p-14">
            <h2 className="max-w-[640px] text-3xl font-bold leading-tight sm:text-4xl">
              {dominant ? `Your closet reads ${dominant}.` : 'Not sure where your style sits?'}
            </h2>
            <p className="mt-4 max-w-[520px] text-lg font-normal leading-relaxed text-neutral-400">
              {dominant
                ? `Keep sorting and the profile keeps moving. Everything below the fold already shifted toward ${dominant} the moment it took the lead.`
                : 'Sort the seven pieces above and repick starts building a profile from your very first swipe.'}
            </p>
            <a
              href={dominant ? '#recommended' : '#taste-deck'}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C8FF4D] px-6 py-3 text-sm font-medium text-[#0B0B0F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8FF4D]"
            >
              {dominant ? `See more ${dominant} finds` : 'Start sorting'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-bold text-neutral-400">repick</span>
          <p className="flex items-center gap-1.5 text-xs font-normal text-neutral-500">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            Secondhand, graded and matched by AI.
          </p>
        </div>
      </footer>
    </main>
  );
}
