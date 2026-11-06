/**
 * Candidate "a" — "The Proof Ladder".
 *
 * Light theme, rose accent family (not the catalog's stock amber/teal/
 * violet/blue hues, and not the emerald used by the two most recent landing
 * rounds). See candidates/a.md for the measured contrast ratios behind each
 * role below — rose-600 clears AA for small text directly against this
 * page's near-white surfaces, which is why it is used unlifted (no derived
 * lighter tint needed the way the catalog's default violet requires one).
 */
export const COLORS = {
  bg: '#FFFFFF',
  surface: '#F4F4F5',
  surfaceLine: '#E4E4E7',
  fg: '#15151A',
  /** zinc-500 — floor for text sitting directly on `bg` (near-white). */
  mutedOnBg: '#71717A',
  /** zinc-600 — floor for text sitting on `surface`/tinted chips. */
  mutedOnSurface: '#52525B',
  accent: '#E11D48',
  accentSoft: '#FFE4E6',
  accentDeep: '#9F1239',
  /**
   * Closing CTA inverts to a dark panel on purpose (a common light-theme
   * editorial device — a single contrast band, not a theme switch) — these
   * two are the small-text-safe colors for that one panel. Computed:
   * accentTintOnDark #FFB4C0 vs fg #15151A ≈ 10.88:1; mutedOnDark #C9C9D1
   * vs fg #15151A ≈ 11.06:1. Both well clear of the 4.5:1 body-text floor.
   */
  accentTintOnDark: '#FFB4C0',
  mutedOnDark: '#C9C9D1',
} as const;

export type CategoryId = 'sneakers' | 'outerwear' | 'bags';

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  sneakers: 'Sneakers',
  outerwear: 'Outerwear',
  bags: 'Bags & Leather',
};

export type GradeId = 'A+' | 'A' | 'A-' | 'B+' | 'B';
export type CertKind = 'ai' | 'human';

export interface PreviewItem {
  id: string;
  category: CategoryId;
  brand: string;
  title: string;
  grade: GradeId;
  /** How closely the AI's detected condition matched the seller's own claim. */
  matchPercent: number;
  cert: CertKind;
  /** Index into `TIERS` (ladder-math.ts) — which tier this past sale actually used. */
  tierIndex: number;
  retail: number;
  sold: number;
}

/** Fixed, hand-authored example listings — never generated at runtime. */
export const PREVIEW_ITEMS: PreviewItem[] = [
  {
    id: 'p-sneakers',
    category: 'sneakers',
    brand: 'Nike',
    title: "Air Jordan 1 Retro High 'UNC'",
    grade: 'A-',
    matchPercent: 97,
    cert: 'ai',
    tierIndex: 2,
    retail: 180,
    sold: 112,
  },
  {
    id: 'p-outerwear',
    category: 'outerwear',
    brand: 'Patagonia',
    title: 'Retro-X Fleece Jacket',
    grade: 'A',
    matchPercent: 94,
    cert: 'human',
    tierIndex: 3,
    retail: 219,
    sold: 138,
  },
  {
    id: 'p-bags',
    category: 'bags',
    brand: 'Coach',
    title: 'Original Leather Tote',
    grade: 'B+',
    matchPercent: 91,
    cert: 'human',
    tierIndex: 4,
    retail: 350,
    sold: 205,
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  context: string;
  initials: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tm-01',
    quote:
      'I picked AI Grade plus Human Review for a jacket I was nervous about. It sold in five days, which is exactly what the ladder told me before I listed it.',
    name: 'Dana R.',
    context: 'Sold a jacket, Austin',
    initials: 'DR',
  },
  {
    id: 'tm-02',
    quote:
      'Full Authentication felt like overkill until I saw the reach number move. More buyers filter for it than I expected, especially on anything over two hundred dollars.',
    name: 'Omar K.',
    context: 'Sold a leather bag, Denver',
    initials: 'OK',
  },
  {
    id: 'tm-03',
    quote:
      'Watching the fee change with the tier made the trade-off obvious up front, instead of something I had to go dig for after the item already sold.',
    name: 'Lina P.',
    context: 'Sold sneakers, Seattle',
    initials: 'LP',
  },
];

export function discountPercent(item: PreviewItem): number {
  return Math.round((1 - item.sold / item.retail) * 100);
}

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: '5', label: 'Verification tiers, one click apart' },
  { value: '61%', label: 'Of sellers choose a tier above the default' },
  { value: '0', label: 'Fees shown after you list that were not shown before' },
];
