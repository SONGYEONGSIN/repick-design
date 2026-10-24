// Near-monochrome dark palette with one orange accent family, assigned for
// this round. Base accent is reserved for fills/borders/bars/large text;
// the tint carries small text, icons and focus rings; the fill shade is a
// darker step used only behind white button labels (see concept note for
// the measured contrast ratios behind each choice).
export const COLORS = {
  bg: '#0B0B0F',
  surface: '#14141A',
  surfaceLine: '#242430',
  fg: '#FFFFFF',
  muted: '#A1A1AA',
  accent: '#FF6A33',
  accentTint: '#FFA177',
  accentFill: '#C8431F',
} as const;

export interface Listing {
  id: string;
  title: string;
  category: string;
  photoId: string;
  conditionGrade: string;
  verified: boolean;
  priceBefore: number;
  priceAfter: number;
  matchPercent: number;
}

// The single listing carried through the Hero's Orbit device — its match
// percent is NOT fixed here; Hero overrides it live with the composite
// score computed from the visitor's current weighting. Everything else
// about it (price, grade, verification) is static and real.
export const FEATURED_LISTING: Listing = {
  id: 'ft-01',
  title: 'Waxed field jacket, size M',
  category: 'Outerwear',
  photoId: '1551028719-00167b16eac5',
  conditionGrade: 'A-',
  verified: true,
  priceBefore: 420,
  priceAfter: 171,
  matchPercent: 92,
};

export const PREVIEW_LISTINGS: Listing[] = [
  {
    id: 'pv-01',
    title: 'Retro runner sneakers, EU 42',
    category: 'Footwear',
    photoId: '1549298916-b41d501d3772',
    conditionGrade: 'B+',
    verified: true,
    priceBefore: 150,
    priceAfter: 68,
    matchPercent: 88,
  },
  {
    id: 'pv-02',
    title: 'Structured leather tote',
    category: 'Bags',
    photoId: '1591561954557-26941169b49e',
    conditionGrade: 'A',
    verified: true,
    priceBefore: 380,
    priceAfter: 149,
    matchPercent: 95,
  },
  {
    id: 'pv-03',
    title: 'Automatic steel watch, 38mm',
    category: 'Accessories',
    photoId: '1526170375885-4d8ecf77b99f',
    conditionGrade: 'A-',
    verified: false,
    priceBefore: 640,
    priceAfter: 260,
    matchPercent: 81,
  },
  {
    id: 'pv-04',
    title: 'Raw denim trucker jacket, M',
    category: 'Outerwear',
    photoId: '1434389677669-e08b4cac3105',
    conditionGrade: 'B',
    verified: true,
    priceBefore: 210,
    priceAfter: 86,
    matchPercent: 84,
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
      'I weighted condition over everything else before I bought my first coat here. The grade on the listing matched the grade on my doorstep.',
    name: 'Priya N.',
    context: 'Bought a coat, Chicago',
    initials: 'PN',
  },
  {
    id: 'tm-02',
    quote:
      'Seller trust mattered more to me than price. Repick let me say so, and the match score moved to reflect it before I ever messaged anyone.',
    name: 'Marcus O.',
    context: 'Bought sneakers, Lagos',
    initials: 'MO',
  },
  {
    id: 'tm-03',
    quote:
      'Every listing carried its grade and its discount from the first screen. Nothing about the condition was a surprise after checkout.',
    name: 'Elin S.',
    context: 'Bought a bag, Malmö',
    initials: 'ES',
  },
];

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: '12,400+', label: 'Verified sellers on the platform' },
  { value: '96%', label: 'Of grades confirmed accurate on delivery' },
  { value: '312', label: 'Active listings in the current catalog' },
];
