// Static marketplace proof for the Product Preview section -- independent of the sorter's state
// (these are example listings showing what "list for cash" produces, not a mirror of whatever
// the visitor currently has sorted). Photo ids are fixed, content-controlled Unsplash photos
// already verified in this catalog (reused from prior landing rounds' data files), never a
// randomised image service.

export type PreviewListing = {
  id: string;
  title: string;
  category: string;
  photoId: string;
  alt: string;
  matchPct: number;
  grade: string;
  verified: boolean;
  discountPct: number;
  price: number;
  retailPrice: number;
  reason: string;
};

export const PREVIEW_LISTINGS: PreviewListing[] = [
  {
    id: "pv-sneakers",
    title: "Trail Running Sneakers",
    category: "Footwear",
    photoId: "1509631179647-0177331693ae",
    alt: "A pair of trail running sneakers photographed from the side on a plain background",
    matchPct: 94,
    grade: "Excellent",
    verified: true,
    discountPct: 32,
    price: 88,
    retailPrice: 130,
    reason: "Matched on size, brand, and a saved search for trail soles.",
  },
  {
    id: "pv-jacket",
    title: "Northbound Field Jacket",
    category: "Outerwear",
    photoId: "1543076447-215ad9ba6923",
    alt: "A waxed cotton field jacket laid flat against a neutral background",
    matchPct: 90,
    grade: "Like New",
    verified: true,
    discountPct: 28,
    price: 96,
    retailPrice: 134,
    reason: "Waxed-cotton shell and hardware checked against factory spec photos.",
  },
  {
    id: "pv-bag",
    title: "Canvas Weekender Bag",
    category: "Bags",
    photoId: "1523275335684-37898b6baf30",
    alt: "A waxed canvas weekender travel bag with leather straps standing upright",
    matchPct: 87,
    grade: "Good",
    verified: false,
    discountPct: 18,
    price: 141,
    retailPrice: 172,
    reason: "Hardware and canvas waxing checked against archive listings.",
  },
  {
    id: "pv-camera",
    title: "Compact 35 Film Camera",
    category: "Electronics",
    photoId: "1519244703995-f4e0f30006d5",
    alt: "A compact 35mm film camera with its lens cap removed on a plain background",
    matchPct: 91,
    grade: "Good",
    verified: true,
    discountPct: 35,
    price: 110,
    retailPrice: 169,
    reason: "Shutter speeds and light meter tested across their full range.",
  },
];
