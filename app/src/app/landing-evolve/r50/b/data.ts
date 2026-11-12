export type Grade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C";

export interface Listing {
  id: string;
  title: string;
  category: string;
  image: string;
  imageAlt: string;
  price: number;
  retail: number;
  match: number;
  grade: Grade;
  verified: boolean;
  daysToSell: number;
  tags: string[];
}

// Six fixed, hand-authored sample listings — deterministic, no randomness.
// Every number quoted anywhere on the page traces back to one of these fields.
export const LISTINGS: Listing[] = [
  {
    id: "air-max-dawn",
    title: "Air Max Dawn '23",
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    imageAlt: "A pair of white and orange running sneakers against a plain backdrop",
    price: 128,
    retail: 220,
    match: 94,
    grade: "A-",
    verified: true,
    daysToSell: 3,
    tags: [
      "Outsole wear pattern matches reference photos",
      "Original box and purchase receipt on file",
      "Colorway confirmed against factory records",
    ],
  },
  {
    id: "patagonia-retro-x",
    title: "Patagonia Retro-X Jacket",
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    imageAlt: "A cream fleece jacket laid flat on a neutral surface",
    price: 96,
    retail: 149,
    match: 88,
    grade: "B+",
    verified: true,
    daysToSell: 5,
    tags: [
      "Zipper-pull stamp verified against archive",
      "Fleece pile depth measured within spec",
      "No odor flagged by intake scent panel",
    ],
  },
  {
    id: "hermes-bolide-mini",
    title: "Hermès Bolide Mini",
    category: "Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
    imageAlt: "A structured brown leather handbag with rolled top handles",
    price: 3420,
    retail: 4400,
    match: 97,
    grade: "A",
    verified: true,
    daysToSell: 9,
    tags: [
      "Stitching count matches atelier specification",
      "Hardware patina consistent with claimed age",
      "Interior serial stamp cross-checked",
    ],
  },
  {
    id: "rolex-datejust-36",
    title: "Rolex Datejust 36mm",
    category: "Watches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    imageAlt: "Close-up of a silver luxury wristwatch with a fluted bezel",
    price: 5180,
    retail: 6300,
    match: 91,
    grade: "A-",
    verified: true,
    daysToSell: 11,
    tags: [
      "Movement serial matches accompanying papers",
      "Bezel fluting depth within nominal range",
      "Service history on file with two prior visits",
    ],
  },
  {
    id: "supreme-box-logo-fw19",
    title: "Supreme Box Logo Hoodie FW19",
    category: "Streetwear",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    imageAlt: "A gray hoodie folded flat on a wooden surface",
    price: 340,
    retail: 400,
    match: 82,
    grade: "B",
    verified: false,
    daysToSell: 14,
    tags: [
      "Tag font kerning within tolerance",
      "Stitch count is a low-confidence match",
      "Awaiting a third angle of seller photos",
    ],
  },
  {
    id: "aeron-remastered",
    title: "Herman Miller Aeron (Remastered)",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455",
    imageAlt: "A black ergonomic mesh office chair",
    price: 610,
    retail: 1195,
    match: 95,
    grade: "A-",
    verified: true,
    daysToSell: 6,
    tags: [
      "PostureFit frame casting matches 2017+ spec",
      "Mesh tension even across the full back panel",
      "No pneumatic cylinder leak detected on intake",
    ],
  },
];
