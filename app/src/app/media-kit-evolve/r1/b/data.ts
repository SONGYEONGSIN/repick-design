export type Rendering = {
  /** flex container classes for the specimen plate (surface + alignment + padding) */
  plate: string;
  /** color class that drives the mark and the wordmark through currentColor */
  ink: string;
  /** optional override for the wordmark only */
  wordInk?: string;
  /** css transform applied to the whole lockup */
  transform?: string;
  /** extra classes on the lockup wrapper */
  effect?: string;
  /** hide the wordmark and show the monogram alone */
  markOnly?: boolean;
  /** scale the wordmark independently of the mark */
  wordScale?: number;
  /** render crowding neighbours on both sides of the lockup */
  crowd?: boolean;
  /** render a hatched surface behind the lockup */
  pattern?: boolean;
};

export type MisuseCase = {
  id: string;
  name: string;
  why: string;
  render: Rendering;
};

export type Rule = {
  id: string;
  no: string;
  title: string;
  law: string;
  correct: Rendering;
  cases: MisuseCase[];
};

const PLATE = 'items-center justify-center gap-6 bg-zinc-900 px-6';

export const RULES: Rule[] = [
  {
    id: 'proportion',
    no: '01',
    title: 'Proportion',
    law: 'Scale the lockup as one object. Mark and wordmark never move apart.',
    correct: { plate: PLATE, ink: 'text-lime-300' },
    cases: [
      {
        id: 'stretch',
        name: 'Stretched wide',
        why: 'Horizontal scaling thickens the vertical strokes and thins the horizontal ones. The counters of the monogram stop matching the wordmark.',
        render: { plate: PLATE, ink: 'text-lime-300', transform: 'scaleX(1.32)' },
      },
      {
        id: 'squash',
        name: 'Squashed short',
        why: 'Vertical compression collapses the bowl of the R into the stem. Below 0.8 the mark stops being readable at small sizes.',
        render: { plate: PLATE, ink: 'text-lime-300', transform: 'scaleY(0.66)' },
      },
      {
        id: 'split-scale',
        name: 'Wordmark rescaled alone',
        why: 'Resizing one half breaks the fixed 1 : 2.4 ratio between mark height and wordmark width, and the optical baseline drifts.',
        render: { plate: PLATE, ink: 'text-lime-300', wordScale: 1.55 },
      },
    ],
  },
  {
    id: 'colour',
    no: '02',
    title: 'Colour',
    law: 'One ink per lockup: Signal Lime on dark, or Ink on Signal Lime. Nothing else.',
    correct: { plate: PLATE, ink: 'text-lime-300' },
    cases: [
      {
        id: 'off-hue',
        name: 'Off-brand hue',
        why: 'Recolouring to match a host palette removes the one attribute people recognise at thumbnail size. Place the lockup on a neutral plate instead.',
        render: { plate: PLATE, ink: 'text-fuchsia-400' },
      },
      {
        id: 'two-tone',
        name: 'Two-tone lockup',
        why: 'Splitting mark and wordmark into separate colours reads as two logos sitting next to each other, not one signature.',
        render: { plate: PLATE, ink: 'text-fuchsia-400', wordInk: 'text-amber-300' },
      },
      {
        id: 'ghost',
        name: 'Ghosted to 30%',
        why: 'Fading the mark to act as a watermark drops it under the contrast floor and lets the surface bleed through the strokes.',
        render: { plate: PLATE, ink: 'text-lime-300 opacity-30', markOnly: true },
      },
    ],
  },
  {
    id: 'clear-space',
    no: '03',
    title: 'Clear space',
    law: 'Keep half the mark height free on every side. Nothing enters that band.',
    correct: {
      plate: 'items-center justify-center gap-12 bg-zinc-900 px-6',
      ink: 'text-lime-300',
      crowd: true,
    },
    cases: [
      {
        id: 'crowded',
        name: 'Type crowds the mark',
        why: 'Running copy inside the clear-space band makes the lockup read as a bullet in a sentence rather than a signature on the page.',
        render: {
          plate: 'items-center justify-center gap-1 bg-zinc-900 px-6',
          ink: 'text-lime-300',
          crowd: true,
        },
      },
      {
        id: 'edge',
        name: 'Pinned to the edge',
        why: 'Flush against the plate the mark loses its silhouette: the rounded container merges with the crop and the corner radius disappears.',
        render: { plate: 'items-end justify-start bg-zinc-900', ink: 'text-lime-300' },
      },
      {
        id: 'boxed',
        name: 'Boxed with no margin',
        why: 'A frame drawn on the bounding box turns the clear space into zero. Give the box the same half-height offset or drop the box.',
        render: { plate: PLATE, ink: 'text-lime-300', effect: 'ring-2 ring-zinc-400' },
      },
    ],
  },
  {
    id: 'surface',
    no: '04',
    title: 'Surface and effects',
    law: 'Sit the mark on a plain surface that clears 4.5 : 1. Add no shadow, glow or blur.',
    correct: {
      plate: 'items-center justify-center gap-6 bg-lime-300 px-6',
      ink: 'text-zinc-950',
      markOnly: true,
    },
    cases: [
      {
        id: 'pale',
        name: 'Low-contrast surface',
        why: 'Signal Lime on a light grey measures under 2 : 1. On light surfaces switch to the Ink cut of the mark rather than keeping the accent.',
        render: {
          plate: 'items-center justify-center bg-zinc-300 px-6',
          ink: 'text-lime-300',
          markOnly: true,
        },
      },
      {
        id: 'busy',
        name: 'Over a busy field',
        why: 'A patterned backdrop cuts through the open counters. If the surface cannot be calmed, put the mark on a solid plate on top of it.',
        render: {
          plate: 'items-center justify-center bg-zinc-900 px-6',
          ink: 'text-lime-300',
          markOnly: true,
          pattern: true,
        },
      },
      {
        id: 'effects',
        name: 'Tilted and softened',
        why: 'Rotation plus blur is the fastest way to make a vector look like a screenshot of itself. The mark is always upright and always crisp.',
        render: {
          plate: 'items-center justify-center bg-zinc-900 px-6',
          ink: 'text-lime-300',
          markOnly: true,
          transform: 'rotate(-12deg)',
          effect: 'blur-sm',
        },
      },
    ],
  },
];

export const PALETTE = [
  { name: 'Signal Lime', swatch: 'bg-lime-300', hex: '#BEF264', use: 'The mark, one accent per surface' },
  { name: 'Ink', swatch: 'bg-zinc-950', hex: '#09090B', use: 'Default background, reversed mark' },
  { name: 'Plate', swatch: 'bg-zinc-900', hex: '#18181B', use: 'Cards, specimen plates' },
  { name: 'Rule', swatch: 'bg-zinc-700', hex: '#3F3F46', use: 'Borders, dividers, hatch' },
];

export const GEOMETRY = [
  { label: 'Grid', value: '64 × 64' },
  { label: 'Corner radius', value: '16' },
  { label: 'Stroke', value: '3 / 6' },
  { label: 'Min mark', value: '24 px' },
  { label: 'Min lockup', value: '96 px' },
  { label: 'Mark : wordmark', value: '1 : 2.4' },
];

export const TYPE_SPEC = [
  { label: 'Display', value: 'var(--font-display-mono)' },
  { label: 'Text', value: 'var(--font-sans)' },
  { label: 'Weights', value: '400 / 500 / 700' },
  { label: 'Numerals', value: 'tabular' },
];
