// native/src/evolve/r30/c/data.ts
// Deterministic dummy data for the Promo Code Wallet screen.
// No Math.random / Date.now / bare `new Date()` anywhere — every date is a
// fixed literal label, and "today" for this mock is implicitly 2026-10-05
// (matches the generation round's date) baked into the precomputed `status`
// values below rather than derived at runtime.

export type PromoCodeStatus = "active" | "expiringSoon" | "expired";

export type PromoCode = {
  id: string;
  code: string;
  title: string;
  discountLabel: string;
  minSpendLabel: string | null;
  status: PromoCodeStatus;
  expiryLabel: string;
  sourceLabel: string;
};

export const PROMO_CODES: PromoCode[] = [
  {
    id: "promo-01",
    code: "WELCOME20",
    title: "20% off your next order",
    discountLabel: "20% OFF",
    minSpendLabel: "Min. spend ₩ 20,000",
    status: "active",
    expiryLabel: "Expires Dec 31, 2026",
    sourceLabel: "New member bonus",
  },
  {
    id: "promo-02",
    code: "FLASH5K",
    title: "₩ 5,000 off one item",
    discountLabel: "₩ 5,000 OFF",
    minSpendLabel: "Min. spend ₩ 30,000",
    status: "expiringSoon",
    expiryLabel: "Expires Oct 9, 2026",
    sourceLabel: "Weekend flash sale",
  },
  {
    id: "promo-03",
    code: "SPRING10",
    title: "10% off outerwear",
    discountLabel: "10% OFF",
    minSpendLabel: null,
    status: "expired",
    expiryLabel: "Expired Mar 31, 2026",
    sourceLabel: "Spring collection",
  },
  {
    id: "promo-04",
    code: "REFER15",
    title: "15% off, thanks to a friend",
    discountLabel: "15% OFF",
    minSpendLabel: "Min. spend ₩ 15,000",
    status: "active",
    expiryLabel: "Expires Jan 20, 2027",
    sourceLabel: "Referral reward",
  },
  {
    id: "promo-05",
    code: "LASTCALL",
    title: "₩ 3,000 off any order",
    discountLabel: "₩ 3,000 OFF",
    minSpendLabel: "Min. spend ₩ 10,000",
    status: "expiringSoon",
    expiryLabel: "Expires Oct 7, 2026",
    sourceLabel: "Cart reminder",
  },
  {
    id: "promo-06",
    code: "SUMMER25",
    title: "25% off summer picks",
    discountLabel: "25% OFF",
    minSpendLabel: "Min. spend ₩ 40,000",
    status: "expired",
    expiryLabel: "Expired Aug 31, 2026",
    sourceLabel: "Summer sale",
  },
  {
    id: "promo-07",
    code: "BUNDLE2",
    title: "Bundle discount, two items",
    discountLabel: "12% OFF",
    minSpendLabel: null,
    status: "active",
    expiryLabel: "Expires Nov 15, 2026",
    sourceLabel: "Bundle promotion",
  },
  {
    id: "promo-08",
    code: "FIRSTBUY",
    title: "First purchase credit",
    discountLabel: "₩ 8,000 OFF",
    minSpendLabel: "Min. spend ₩ 25,000",
    status: "expired",
    expiryLabel: "Expired Jan 14, 2026",
    sourceLabel: "Sign-up offer",
  },
  {
    id: "promo-09",
    code: "LOYAL30",
    title: "Loyalty milestone reward",
    discountLabel: "30% OFF",
    minSpendLabel: "Min. spend ₩ 50,000",
    status: "active",
    expiryLabel: "Expires Feb 28, 2027",
    sourceLabel: "Loyalty milestone",
  },
  {
    id: "promo-10",
    code: "QUICKSHIP",
    title: "Free shipping voucher",
    discountLabel: "Free shipping",
    minSpendLabel: "Min. spend ₩ 5,000",
    status: "expiringSoon",
    expiryLabel: "Expires Oct 11, 2026",
    sourceLabel: "Shipping promo",
  },
  {
    id: "promo-11",
    code: "WINTER18",
    title: "18% off winter gear",
    discountLabel: "18% OFF",
    minSpendLabel: "Min. spend ₩ 35,000",
    status: "expired",
    expiryLabel: "Expired Feb 1, 2026",
    sourceLabel: "Winter clearance",
  },
  {
    id: "promo-12",
    code: "EXTRA10",
    title: "10% off, stacks with sale",
    discountLabel: "10% OFF",
    minSpendLabel: null,
    status: "active",
    expiryLabel: "Expires Dec 5, 2026",
    sourceLabel: "Stackable extra",
  },
];
