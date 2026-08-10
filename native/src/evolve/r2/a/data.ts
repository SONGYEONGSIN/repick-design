// native/src/evolve/r2/a/data.ts — auto-native-r2 candidate a (Discover): deterministic catalog +
// filter data. No Math.random / Date.now / argument-less new Date() anywhere — every value below is
// a fixed literal or plain arithmetic over fixed literals.

export type Condition = "New" | "Like New" | "Good" | "Fair";

export type Item = {
  id: string;
  title: string;
  brand: string;
  size: string;
  condition: Condition;
  price: number; // KRW, fixed value
};

// 16 fixed catalog entries spanning 4 brands, 5 sizes, all 4 conditions, and all 3 price bands
// (see priceBand below) so every filter chip actually narrows the grid.
export const ITEMS: Item[] = [
  { id: "p1", title: "Air Max 90", brand: "Nike", size: "M", condition: "Like New", price: 128000 },
  { id: "p2", title: "Windrunner Jacket", brand: "Nike", size: "L", condition: "New", price: 96000 },
  { id: "p3", title: "Dri-FIT Shorts", brand: "Nike", size: "S", condition: "Good", price: 32000 },
  { id: "p4", title: "Blazer Mid 77", brand: "Nike", size: "XL", condition: "Fair", price: 54000 },
  { id: "p5", title: "Samba OG", brand: "Adidas", size: "M", condition: "Like New", price: 118000 },
  { id: "p6", title: "Firebird Track Top", brand: "Adidas", size: "L", condition: "New", price: 89000 },
  { id: "p7", title: "Adicolor Tee", brand: "Adidas", size: "S", condition: "Good", price: 28000 },
  { id: "p8", title: "Superstar", brand: "Adidas", size: "XS", condition: "Fair", price: 41000 },
  { id: "p9", title: "550", brand: "New Balance", size: "M", condition: "New", price: 152000 },
  { id: "p10", title: "990v5", brand: "New Balance", size: "L", condition: "Like New", price: 189000 },
  { id: "p11", title: "Fleece Hoodie", brand: "New Balance", size: "XL", condition: "Good", price: 67000 },
  { id: "p12", title: "Runner Cap", brand: "New Balance", size: "XS", condition: "New", price: 19000 },
  { id: "p13", title: "Fleece Pullover", brand: "Uniqlo", size: "M", condition: "Good", price: 24000 },
  { id: "p14", title: "Wide Chino", brand: "Uniqlo", size: "L", condition: "Like New", price: 31000 },
  { id: "p15", title: "Ultra Light Down", brand: "Uniqlo", size: "S", condition: "New", price: 62000 },
  { id: "p16", title: "Merino Cardigan", brand: "Uniqlo", size: "XL", condition: "Fair", price: 45000 },
];

export type ChipGroup = "brand" | "size" | "condition" | "price";
export type PriceBandId = "under50" | "50to150" | "over150";

export type Chip = {
  id: string;
  group: ChipGroup;
  label: string;
  value: string; // matches Item.brand / Item.size / Item.condition, or a PriceBandId for group "price"
};

// One flat horizontally-scrollable row mixing all facets — a fixed order, never reshuffled.
export const CHIPS: Chip[] = [
  { id: "brand-nike", group: "brand", label: "Nike", value: "Nike" },
  { id: "brand-adidas", group: "brand", label: "Adidas", value: "Adidas" },
  { id: "brand-nb", group: "brand", label: "New Balance", value: "New Balance" },
  { id: "brand-uniqlo", group: "brand", label: "Uniqlo", value: "Uniqlo" },
  { id: "size-xs", group: "size", label: "Size XS", value: "XS" },
  { id: "size-s", group: "size", label: "Size S", value: "S" },
  { id: "size-m", group: "size", label: "Size M", value: "M" },
  { id: "size-l", group: "size", label: "Size L", value: "L" },
  { id: "size-xl", group: "size", label: "Size XL", value: "XL" },
  { id: "cond-new", group: "condition", label: "New", value: "New" },
  { id: "cond-likenew", group: "condition", label: "Like New", value: "Like New" },
  { id: "cond-good", group: "condition", label: "Good", value: "Good" },
  { id: "cond-fair", group: "condition", label: "Fair", value: "Fair" },
  { id: "price-under50", group: "price", label: "Under ₩50,000", value: "under50" },
  { id: "price-50to150", group: "price", label: "₩50,000–150,000", value: "50to150" },
  { id: "price-over150", group: "price", label: "Over ₩150,000", value: "over150" },
];

// Thousands-separated KRW formatting — avoids toLocaleString (environment-independent, deterministic).
export function formatKRW(won: number): string {
  const sign = won < 0 ? "-" : "";
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}₩${digits}`;
}

// Fixed thresholds, pure computation — no lookup table needed.
export function priceBand(price: number): PriceBandId {
  if (price < 50000) return "under50";
  if (price <= 150000) return "50to150";
  return "over150";
}

function matchesChip(item: Item, chip: Chip): boolean {
  switch (chip.group) {
    case "brand":
      return item.brand === chip.value;
    case "size":
      return item.size === chip.value;
    case "condition":
      return item.condition === chip.value;
    case "price":
      return priceBand(item.price) === chip.value;
    default:
      return false;
  }
}

// Search matches title or brand (case-insensitive substring). Chips: OR within a facet group,
// AND across groups — e.g. selecting "Nike" + "Adidas" widens brand, then narrows by size, etc.
// Pure function of its arguments — same inputs always produce the same filtered array.
export function filterItems(items: Item[], query: string, activeChipIds: string[]): Item[] {
  const q = query.trim().toLowerCase();
  const activeChips = CHIPS.filter((c) => activeChipIds.includes(c.id));
  const byGroup = new Map<ChipGroup, Chip[]>();
  for (const chip of activeChips) {
    const list = byGroup.get(chip.group);
    if (list) list.push(chip);
    else byGroup.set(chip.group, [chip]);
  }

  return items.filter((item) => {
    if (q.length > 0) {
      const hay = `${item.title} ${item.brand}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    for (const chips of byGroup.values()) {
      if (!chips.some((chip) => matchesChip(item, chip))) return false;
    }
    return true;
  });
}
