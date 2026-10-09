// Fixed, hand-authored data for the repick region-map landing candidate.
// No Math.random() / Date.now() / no-arg new Date() anywhere — every number
// here is a constant chosen by hand so the page renders identically every time.

export type RegionId =
  | 'northside'
  | 'riverfront'
  | 'old-mill'
  | 'garden-row'
  | 'east-end'
  | 'south-quay';

export interface ProductListing {
  title: string;
  price: number;
  originalPrice: number;
  matchPercent: number;
  grade: 'Excellent' | 'Very Good' | 'Good';
  verified: boolean;
  photoId: string;
  category: string;
  matchReason: string;
}

export interface RegionStats {
  activeListings: number;
  avgPrice: number;
  topCategory: string;
  verifiedSellers: number;
  /** six weekly data points, oldest first, last point always equals activeListings */
  weeklyTrend: readonly [number, number, number, number, number, number];
}

export interface Region {
  id: RegionId;
  name: string;
  /** SVG path (viewBox 0 0 320 220) describing this district's hand-drawn shape */
  path: string;
  /** centroid as a percentage of the map's width/height, for the HTML marker overlay */
  centroid: { x: number; y: number };
  stats: RegionStats;
  listings: readonly [ProductListing, ProductListing, ProductListing];
}

export const MAP_VIEWBOX = '0 0 320 220';
export const MAP_WIDTH = 320;
export const MAP_HEIGHT = 220;

// Purely decorative river line running between the two rows of districts.
// aria-hidden in the component — never carries interactive meaning.
export const RIVER_PATH = 'M0,108 C60,100 100,118 160,108 C220,98 260,116 320,106';

export const REGIONS: readonly Region[] = [
  {
    id: 'northside',
    name: 'Northside',
    path: 'M30,12 L84,12 L102,26 L102,88 L84,102 L30,102 L12,88 L12,26 Z',
    centroid: { x: 17.81, y: 25.91 },
    stats: {
      activeListings: 482,
      avgPrice: 86,
      topCategory: 'Outerwear',
      verifiedSellers: 134,
      weeklyTrend: [310, 338, 365, 401, 440, 482],
    },
    listings: [
      {
        title: 'Shearling Bomber Jacket',
        price: 68,
        originalPrice: 120,
        matchPercent: 96,
        grade: 'Excellent',
        verified: true,
        photoId: '1551028719-00167b16eac5',
        category: 'Outerwear',
        matchReason: 'Fits your saved size range',
      },
      {
        title: 'Wool Trench Coat',
        price: 54,
        originalPrice: 90,
        matchPercent: 91,
        grade: 'Very Good',
        verified: true,
        photoId: '1551028719-00167b16eac5',
        category: 'Outerwear',
        matchReason: 'Same brand as 2 items you saved',
      },
      {
        title: 'Quilted Puffer Vest',
        price: 32,
        originalPrice: 55,
        matchPercent: 84,
        grade: 'Good',
        verified: false,
        photoId: '1551028719-00167b16eac5',
        category: 'Outerwear',
        matchReason: 'Within your usual price band',
      },
    ],
  },
  {
    id: 'riverfront',
    name: 'Riverfront',
    path: 'M136,12 L178,12 L202,32 L202,82 L178,102 L136,102 L112,82 L112,32 Z',
    centroid: { x: 49.06, y: 25.91 },
    stats: {
      activeListings: 647,
      avgPrice: 64,
      topCategory: 'Footwear',
      verifiedSellers: 201,
      weeklyTrend: [520, 540, 575, 590, 618, 647],
    },
    listings: [
      {
        title: 'Leather Chelsea Boots',
        price: 46,
        originalPrice: 80,
        matchPercent: 94,
        grade: 'Excellent',
        verified: true,
        photoId: '1542291026-7eec264c27ff',
        category: 'Footwear',
        matchReason: 'Fits your saved size range',
      },
      {
        title: 'Canvas High-Top Sneakers',
        price: 28,
        originalPrice: 50,
        matchPercent: 89,
        grade: 'Very Good',
        verified: true,
        photoId: '1542291026-7eec264c27ff',
        category: 'Footwear',
        matchReason: 'Popular with buyers near you',
      },
      {
        title: 'Suede Desert Boots',
        price: 38,
        originalPrice: 65,
        matchPercent: 82,
        grade: 'Good',
        verified: true,
        photoId: '1542291026-7eec264c27ff',
        category: 'Footwear',
        matchReason: 'Similar silhouette to recent saves',
      },
    ],
  },
  {
    id: 'old-mill',
    name: 'Old Mill',
    path: 'M226,12 L288,12 L302,28 L302,86 L288,102 L226,102 L212,86 L212,28 Z',
    centroid: { x: 80.31, y: 25.91 },
    stats: {
      activeListings: 298,
      avgPrice: 112,
      topCategory: 'Bags',
      verifiedSellers: 88,
      weeklyTrend: [410, 390, 365, 340, 315, 298],
    },
    listings: [
      {
        title: 'Structured Leather Tote',
        price: 74,
        originalPrice: 140,
        matchPercent: 95,
        grade: 'Excellent',
        verified: true,
        photoId: '1529139574466-a303027c1d8b',
        category: 'Bags',
        matchReason: 'Same brand as 2 items you saved',
      },
      {
        title: 'Canvas Weekender Bag',
        price: 52,
        originalPrice: 95,
        matchPercent: 88,
        grade: 'Very Good',
        verified: true,
        photoId: '1529139574466-a303027c1d8b',
        category: 'Bags',
        matchReason: 'Within your usual price band',
      },
      {
        title: 'Woven Crossbody',
        price: 29,
        originalPrice: 48,
        matchPercent: 79,
        grade: 'Good',
        verified: false,
        photoId: '1529139574466-a303027c1d8b',
        category: 'Bags',
        matchReason: 'Matches your condition preference',
      },
    ],
  },
  {
    id: 'garden-row',
    name: 'Garden Row',
    path: 'M32,112 L82,112 L102,138 L102,176 L82,202 L32,202 L12,176 L12,138 Z',
    centroid: { x: 17.81, y: 71.36 },
    stats: {
      activeListings: 519,
      avgPrice: 58,
      topCategory: 'Denim',
      verifiedSellers: 162,
      weeklyTrend: [380, 410, 435, 460, 495, 519],
    },
    listings: [
      {
        title: 'High-Rise Straight Jeans',
        price: 36,
        originalPrice: 68,
        matchPercent: 93,
        grade: 'Excellent',
        verified: true,
        photoId: '1548036328-c9fa89d128fa',
        category: 'Denim',
        matchReason: 'Fits your saved size range',
      },
      {
        title: 'Vintage Denim Jacket',
        price: 44,
        originalPrice: 78,
        matchPercent: 90,
        grade: 'Very Good',
        verified: true,
        photoId: '1548036328-c9fa89d128fa',
        category: 'Denim',
        matchReason: 'Same brand as 2 items you saved',
      },
      {
        title: 'Relaxed Fit Overalls',
        price: 31,
        originalPrice: 54,
        matchPercent: 85,
        grade: 'Good',
        verified: true,
        photoId: '1548036328-c9fa89d128fa',
        category: 'Denim',
        matchReason: 'Popular with buyers near you',
      },
    ],
  },
  {
    id: 'east-end',
    name: 'East End',
    path: 'M140,112 L174,112 L202,130 L202,184 L174,202 L140,202 L112,184 L112,130 Z',
    centroid: { x: 49.06, y: 71.36 },
    stats: {
      activeListings: 356,
      avgPrice: 71,
      topCategory: 'Knitwear',
      verifiedSellers: 109,
      weeklyTrend: [300, 312, 328, 340, 349, 356],
    },
    listings: [
      {
        title: 'Merino Wool Sweater',
        price: 42,
        originalPrice: 75,
        matchPercent: 92,
        grade: 'Excellent',
        verified: true,
        photoId: '1556905055-8f358a7a47b2',
        category: 'Knitwear',
        matchReason: 'Within your usual price band',
      },
      {
        title: 'Cable Knit Cardigan',
        price: 38,
        originalPrice: 66,
        matchPercent: 87,
        grade: 'Very Good',
        verified: true,
        photoId: '1556905055-8f358a7a47b2',
        category: 'Knitwear',
        matchReason: 'Similar silhouette to recent saves',
      },
      {
        title: 'Cashmere Blend Scarf',
        price: 22,
        originalPrice: 40,
        matchPercent: 81,
        grade: 'Good',
        verified: false,
        photoId: '1556905055-8f358a7a47b2',
        category: 'Knitwear',
        matchReason: 'Matches your condition preference',
      },
    ],
  },
  {
    id: 'south-quay',
    name: 'South Quay',
    path: 'M224,112 L290,112 L302,124 L302,190 L290,202 L224,202 L212,190 L212,124 Z',
    centroid: { x: 80.31, y: 71.36 },
    stats: {
      activeListings: 274,
      avgPrice: 45,
      topCategory: 'Accessories',
      verifiedSellers: 97,
      weeklyTrend: [230, 242, 251, 259, 266, 274],
    },
    listings: [
      {
        title: 'Leather Belt Set',
        price: 18,
        originalPrice: 32,
        matchPercent: 90,
        grade: 'Excellent',
        verified: true,
        photoId: '1445205170230-053b83016050',
        category: 'Accessories',
        matchReason: 'Fits your saved size range',
      },
      {
        title: 'Silk Scarf Bundle',
        price: 24,
        originalPrice: 42,
        matchPercent: 86,
        grade: 'Very Good',
        verified: true,
        photoId: '1445205170230-053b83016050',
        category: 'Accessories',
        matchReason: 'Popular with buyers near you',
      },
      {
        title: 'Vintage Sunglasses',
        price: 20,
        originalPrice: 36,
        matchPercent: 78,
        grade: 'Good',
        verified: true,
        photoId: '1445205170230-053b83016050',
        category: 'Accessories',
        matchReason: 'Same brand as 2 items you saved',
      },
    ],
  },
];

export const DEFAULT_REGION_ID: RegionId = 'northside';

export function getRegion(id: RegionId): Region {
  const found = REGIONS.find((r) => r.id === id);
  if (!found) {
    throw new Error(`Unknown region id: ${id}`);
  }
  return found;
}

// City-wide aggregates — literal sums of the per-region constants above, so the
// totals shown in the proof section always reconcile with the per-region figures
// a visitor sees after selecting a district.
// activeListings: 482 + 647 + 298 + 519 + 356 + 274 = 2576
export const TOTAL_ACTIVE_LISTINGS = 2576;
// verifiedSellers: 134 + 201 + 88 + 162 + 109 + 97 = 791
export const TOTAL_VERIFIED_SELLERS = 791;
