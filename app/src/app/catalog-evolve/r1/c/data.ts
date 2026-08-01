// Fathom — deterministic media-library dataset. No randomness, no Date objects: every "added"
// value is an authored display string, and sort order is driven by the fixed `addedRank` integer.

export type AssetType = "Photo" | "Video";
export type License = "Standard" | "Extended" | "Editorial";
export type Orientation = "Landscape" | "Portrait" | "Square";
export type AssetStatus = "Available" | "Licensed" | "Restricted";
export type SortKey = "relevance" | "newest" | "downloads" | "price-asc" | "price-desc";

export interface Asset {
  id: string;
  title: string;
  collection: string;
  creator: string;
  type: AssetType;
  license: License;
  orientation: Orientation;
  dimensions: string;
  duration?: string;
  fileSize: string;
  credits: number;
  downloads: number;
  addedRank: number;
  addedLabel: string;
  imageId: string;
  tags: string[];
  status: AssetStatus;
}

export const ASSETS: Asset[] = [
  {
    id: "coastal-fog-dawn",
    title: "Coastal Fog at Dawn",
    collection: "Nightfall",
    creator: "L. Bergström",
    type: "Photo",
    license: "Standard",
    orientation: "Landscape",
    dimensions: "6720 × 4480",
    fileSize: "18.4 MB",
    credits: 12,
    downloads: 3841,
    addedRank: 3,
    addedLabel: "Jul 2026",
    imageId: "1445205170230-053b83016050",
    tags: ["coast", "fog", "dawn"],
    status: "Available",
  },
  {
    id: "harbor-cranes-dusk",
    title: "Harbor Cranes at Dusk",
    collection: "Harborlight",
    creator: "R. Nakamura",
    type: "Photo",
    license: "Extended",
    orientation: "Landscape",
    dimensions: "5760 × 3840",
    fileSize: "22.1 MB",
    credits: 24,
    downloads: 1927,
    addedRank: 7,
    addedLabel: "Jun 2026",
    imageId: "1489987707025-afc232f7ea0f",
    tags: ["harbor", "industrial", "dusk"],
    status: "Licensed",
  },
  {
    id: "warehouse-loading-dock",
    title: "Warehouse Loading Dock",
    collection: "Field Notes",
    creator: "J. Alvarez",
    type: "Video",
    license: "Standard",
    orientation: "Landscape",
    dimensions: "3840 × 2160",
    duration: "0:38",
    fileSize: "212 MB",
    credits: 40,
    downloads: 642,
    addedRank: 11,
    addedLabel: "Apr 2026",
    imageId: "1560243563-062bfc001d68",
    tags: ["logistics", "interior", "motion"],
    status: "Available",
  },
  {
    id: "studio-portrait-blue",
    title: "Studio Portrait, Blue Light",
    collection: "Analog Season",
    creator: "S. Petrova",
    type: "Photo",
    license: "Editorial",
    orientation: "Portrait",
    dimensions: "4480 × 6720",
    fileSize: "16.7 MB",
    credits: 18,
    downloads: 2214,
    addedRank: 2,
    addedLabel: "Jul 2026",
    imageId: "1543076447-215ad9ba6923",
    tags: ["portrait", "studio", "editorial"],
    status: "Restricted",
  },
  {
    id: "market-street-overcast",
    title: "Market Street, Overcast",
    collection: "Field Notes",
    creator: "M. Okafor",
    type: "Photo",
    license: "Standard",
    orientation: "Landscape",
    dimensions: "6000 × 4000",
    fileSize: "15.2 MB",
    credits: 10,
    downloads: 4108,
    addedRank: 9,
    addedLabel: "May 2026",
    imageId: "1531123897727-8f129e1688ce",
    tags: ["street", "urban", "overcast"],
    status: "Available",
  },
  {
    id: "rooftop-line-noon",
    title: "Rooftop Line, Noon",
    collection: "Interior Studies",
    creator: "T. Kwan",
    type: "Photo",
    license: "Extended",
    orientation: "Landscape",
    dimensions: "5472 × 3648",
    fileSize: "19.8 MB",
    credits: 24,
    downloads: 1305,
    addedRank: 14,
    addedLabel: "Feb 2026",
    imageId: "1500648767791-00dcc994a43e",
    tags: ["architecture", "rooftop", "daylight"],
    status: "Available",
  },
  {
    id: "analog-portrait-07",
    title: "Analog Portrait 07",
    collection: "Analog Season",
    creator: "S. Petrova",
    type: "Photo",
    license: "Editorial",
    orientation: "Portrait",
    dimensions: "4000 × 6000",
    fileSize: "14.9 MB",
    credits: 18,
    downloads: 986,
    addedRank: 16,
    addedLabel: "Jan 2026",
    imageId: "1524504388940-b1c1722653e1",
    tags: ["portrait", "film", "grain"],
    status: "Available",
  },
  {
    id: "glasshouse-reflection",
    title: "Glasshouse Reflection",
    collection: "Interior Studies",
    creator: "R. Nakamura",
    type: "Photo",
    license: "Standard",
    orientation: "Square",
    dimensions: "5000 × 5000",
    fileSize: "13.6 MB",
    credits: 10,
    downloads: 2761,
    addedRank: 5,
    addedLabel: "Jun 2026",
    imageId: "1490481651871-ab68de25d43d",
    tags: ["glass", "reflection", "interior"],
    status: "Licensed",
  },
  {
    id: "night-traffic-trails",
    title: "Night Traffic Trails",
    collection: "Nightfall",
    creator: "J. Alvarez",
    type: "Video",
    license: "Extended",
    orientation: "Landscape",
    dimensions: "3840 × 2160",
    duration: "0:24",
    fileSize: "184 MB",
    credits: 48,
    downloads: 1120,
    addedRank: 6,
    addedLabel: "Jun 2026",
    imageId: "1441986300917-64674bd600d8",
    tags: ["night", "traffic", "motion"],
    status: "Available",
  },
  {
    id: "desert-ridge-line",
    title: "Desert Ridge Line",
    collection: "Field Notes",
    creator: "M. Okafor",
    type: "Photo",
    license: "Extended",
    orientation: "Landscape",
    dimensions: "6720 × 4480",
    fileSize: "20.5 MB",
    credits: 24,
    downloads: 891,
    addedRank: 18,
    addedLabel: "Nov 2025",
    imageId: "1472099645785-5658abf4ff4e",
    tags: ["desert", "ridge", "wide"],
    status: "Available",
  },
  {
    id: "concrete-stairwell",
    title: "Concrete Stairwell",
    collection: "Interior Studies",
    creator: "T. Kwan",
    type: "Photo",
    license: "Standard",
    orientation: "Portrait",
    dimensions: "4000 × 6000",
    fileSize: "12.3 MB",
    credits: 10,
    downloads: 3320,
    addedRank: 10,
    addedLabel: "May 2026",
    imageId: "1519244703995-f4e0f30006d5",
    tags: ["concrete", "stairwell", "geometry"],
    status: "Available",
  },
  {
    id: "warehouse-interior-4",
    title: "Warehouse Interior No. 4",
    collection: "Interior Studies",
    creator: "L. Bergström",
    type: "Photo",
    license: "Standard",
    orientation: "Landscape",
    dimensions: "5760 × 3840",
    fileSize: "17.9 MB",
    credits: 12,
    downloads: 1548,
    addedRank: 13,
    addedLabel: "Mar 2026",
    imageId: "1544005313-94ddf0286df2",
    tags: ["warehouse", "interior", "industrial"],
    status: "Available",
  },
  {
    id: "forest-canopy-overhead",
    title: "Forest Canopy, Overhead",
    collection: "Field Notes",
    creator: "R. Nakamura",
    type: "Video",
    license: "Extended",
    orientation: "Landscape",
    dimensions: "4096 × 2160",
    duration: "1:02",
    fileSize: "268 MB",
    credits: 48,
    downloads: 405,
    addedRank: 19,
    addedLabel: "Oct 2025",
    imageId: "1607746882042-944635dfe10e",
    tags: ["forest", "canopy", "aerial"],
    status: "Restricted",
  },
  {
    id: "wheat-field-horizon",
    title: "Wheat Field Horizon",
    collection: "Field Notes",
    creator: "M. Okafor",
    type: "Photo",
    license: "Standard",
    orientation: "Landscape",
    dimensions: "6000 × 4000",
    fileSize: "16.1 MB",
    credits: 10,
    downloads: 2033,
    addedRank: 12,
    addedLabel: "Apr 2026",
    imageId: "1633332755192-727a05c4013d",
    tags: ["field", "horizon", "agriculture"],
    status: "Available",
  },
  {
    id: "quiet-interior-morning",
    title: "Quiet Interior, Morning",
    collection: "Interior Studies",
    creator: "S. Petrova",
    type: "Photo",
    license: "Extended",
    orientation: "Square",
    dimensions: "5000 × 5000",
    fileSize: "14.2 MB",
    credits: 24,
    downloads: 1799,
    addedRank: 8,
    addedLabel: "May 2026",
    imageId: "1580489944761-15a19d654956",
    tags: ["interior", "morning", "quiet"],
    status: "Available",
  },
  {
    id: "cliffside-path",
    title: "Cliffside Path",
    collection: "Nightfall",
    creator: "L. Bergström",
    type: "Photo",
    license: "Standard",
    orientation: "Portrait",
    dimensions: "4480 × 6720",
    fileSize: "18.8 MB",
    credits: 12,
    downloads: 2455,
    addedRank: 4,
    addedLabel: "Jun 2026",
    imageId: "1534528741775-53994a69daeb",
    tags: ["cliff", "path", "coast"],
    status: "Available",
  },
  {
    id: "studio-still-life-02",
    title: "Studio Still Life 02",
    collection: "Analog Season",
    creator: "T. Kwan",
    type: "Photo",
    license: "Editorial",
    orientation: "Square",
    dimensions: "5000 × 5000",
    fileSize: "11.4 MB",
    credits: 18,
    downloads: 763,
    addedRank: 17,
    addedLabel: "Dec 2025",
    imageId: "1547425260-76bcadfb4f2c",
    tags: ["still life", "studio", "editorial"],
    status: "Available",
  },
  {
    id: "downtown-skyline-blue-hour",
    title: "Downtown Skyline, Blue Hour",
    collection: "Harborlight",
    creator: "J. Alvarez",
    type: "Photo",
    license: "Extended",
    orientation: "Landscape",
    dimensions: "6720 × 4480",
    fileSize: "21.3 MB",
    credits: 24,
    downloads: 3607,
    addedRank: 1,
    addedLabel: "Jul 2026",
    imageId: "1487412720507-e7ab37603c6f",
    tags: ["skyline", "blue hour", "city"],
    status: "Licensed",
  },
  {
    id: "portrait-studio-light",
    title: "Portrait, Studio Light",
    collection: "Analog Season",
    creator: "R. Nakamura",
    type: "Photo",
    license: "Editorial",
    orientation: "Portrait",
    dimensions: "4480 × 6720",
    fileSize: "15.6 MB",
    credits: 18,
    downloads: 1442,
    addedRank: 15,
    addedLabel: "Feb 2026",
    imageId: "1519085360753-af0119f7cbe7",
    tags: ["portrait", "studio", "editorial"],
    status: "Available",
  },
];

export function assetImageUrl(imageId: string, opts: { w: number; h: number }): string {
  return `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=${opts.w}&h=${opts.h}`;
}

export function matchesFilters(
  asset: Asset,
  filters: { types: Set<AssetType>; licenses: Set<License>; orientations: Set<Orientation> },
): boolean {
  if (filters.types.size > 0 && !filters.types.has(asset.type)) return false;
  if (filters.licenses.size > 0 && !filters.licenses.has(asset.license)) return false;
  if (filters.orientations.size > 0 && !filters.orientations.has(asset.orientation)) return false;
  return true;
}

export function sortAssets(assets: Asset[], sort: SortKey): Asset[] {
  const list = [...assets];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => a.addedRank - b.addedRank || a.id.localeCompare(b.id));
    case "downloads":
      return list.sort((a, b) => b.downloads - a.downloads || a.id.localeCompare(b.id));
    case "price-asc":
      return list.sort((a, b) => a.credits - b.credits || a.id.localeCompare(b.id));
    case "price-desc":
      return list.sort((a, b) => b.credits - a.credits || a.id.localeCompare(b.id));
    case "relevance":
    default:
      return list;
  }
}

export const SORT_LABELS: Record<SortKey, string> = {
  relevance: "Relevance",
  newest: "Newest first",
  downloads: "Most downloaded",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

export const PAGE_SIZE = 6;
