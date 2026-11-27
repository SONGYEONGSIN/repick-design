/**
 * Fixed, deterministic content for the route: the hero's sold-comparable
 * proof item and the seller stats/testimonials used in social proof. None
 * of this reads the clock or a random source.
 */

export interface SoldComp {
  name: string;
  category: string;
  grade: string;
  soldPrice: number;
  /** Days from listing to sale — fixed, for the hero caption. */
  daysToSell: number;
}

/**
 * A real sold comparable, pulled into the hero itself. Match % and
 * discount % are deliberately not shown here — see the candidate report —
 * because neither applies to a seller's own prospective listing. Condition
 * grade and a verified-sale badge are the two proof elements that do.
 */
export const SOLD_COMP: SoldComp = {
  name: "Sony WH-1000XM4 headphones",
  category: "Electronics",
  grade: "Like New",
  soldPrice: 142,
  daysToSell: 4,
};

export interface SellerStat {
  value: string;
  label: string;
}

export const SELLER_STATS: SellerStat[] = [
  { value: "$3.1M", label: "paid out to repick sellers in the last twelve months" },
  { value: "2 days", label: "average time from a confirmed sale to money in your account" },
];

export interface SellerQuote {
  quote: string;
  name: string;
  role: string;
}

export const SELLER_QUOTES: SellerQuote[] = [
  {
    quote:
      "I didn't know what my closet was actually worth until I ran the counters. Moving fashion up from 2 to 5 items put another $86 on the number, right there on screen.",
    name: "Marisol T.",
    role: "Seller, 11 items listed",
  },
  {
    quote:
      "No forms, no wizard. I set three numbers roughly and saw a payout I could compare against just selling everything to a pawn shop. repick won by a wide margin.",
    name: "Dae-ho P.",
    role: "Seller, electronics & home",
  },
  {
    quote:
      "The fee is shown per category before I commit to anything. Electronics carries a lower cut than fashion, and the breakdown says so in plain numbers, not fine print.",
    name: "Imani R.",
    role: "Seller, 23 items listed",
  },
];
