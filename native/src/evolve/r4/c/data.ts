// native/src/evolve/r4/c/data.ts — deterministic Order History dummy data
// (no Math.random / Date.now / argless new Date() — fixed values + pure computation only)

export type OrderStatus = "ordered" | "scheduled" | "completed" | "cancelled";

export type Order = {
  id: string;
  orderNumber: string;
  itemName: string;
  category: string;
  condition: string;
  pricePaid: number; // KRW, fixed
  seller: string;
  sellerRating: string; // fixed label, e.g. "4.9 (128 deals)"
  status: OrderStatus;
  dateLabel: string; // fixed display date, e.g. "Aug 9, 2026"
  dateSort: number; // fixed YYYYMMDD integer for deterministic sorting, no Date math
  monthLabel: string; // fixed grouping label, e.g. "August 2026"
  handoffLocation?: string; // present for scheduled / completed
  handoffTimeLabel?: string;
  cancelReason?: string; // present for cancelled
  shape: { w: number; h: number; r: "sm" | "md"; inner: "dot" | "bar" | "none" };
};

// 14 fixed orders spanning five months. Dates are hand-fixed strings/integers, not computed
// from the real current time, so the screen renders identically on every run.
export const ORDERS: Order[] = [
  {
    id: "o1",
    orderNumber: "RP-88214",
    itemName: "Film camera · Olympus mju II",
    category: "Cameras",
    condition: "Well loved",
    pricePaid: 289000,
    seller: "junhee_camera",
    sellerRating: "4.9 (128 deals)",
    status: "ordered",
    dateLabel: "Aug 9, 2026",
    dateSort: 20260809,
    monthLabel: "August 2026",
    shape: { w: 34, h: 26, r: "sm", inner: "dot" },
  },
  {
    id: "o2",
    orderNumber: "RP-88096",
    itemName: "Lounge chair · Eames Soft Pad",
    category: "Furniture",
    condition: "Good",
    pricePaid: 1150000,
    seller: "midcentury_seoul",
    sellerRating: "4.8 (61 deals)",
    status: "scheduled",
    dateLabel: "Aug 4, 2026",
    dateSort: 20260804,
    monthLabel: "August 2026",
    handoffLocation: "Seongsu Station Exit 3",
    handoffTimeLabel: "Aug 16, 2026 · 2:00 PM",
    shape: { w: 30, h: 30, r: "md", inner: "bar" },
  },
  {
    id: "o3",
    orderNumber: "RP-87710",
    itemName: "Denim jacket · Levi's Type III",
    category: "Clothing",
    condition: "Very good",
    pricePaid: 145000,
    seller: "vintage_hwang",
    sellerRating: "4.7 (39 deals)",
    status: "completed",
    dateLabel: "Jul 28, 2026",
    dateSort: 20260728,
    monthLabel: "July 2026",
    handoffLocation: "Hongdae exit 2",
    handoffTimeLabel: "Jul 30, 2026 · 6:30 PM",
    shape: { w: 32, h: 30, r: "sm", inner: "none" },
  },
  {
    id: "o4",
    orderNumber: "RP-87602",
    itemName: "Mechanical keyboard · HHKB Pro 2",
    category: "Electronics",
    condition: "Like new",
    pricePaid: 210000,
    seller: "desk_setup_kr",
    sellerRating: "5.0 (204 deals)",
    status: "completed",
    dateLabel: "Jul 22, 2026",
    dateSort: 20260722,
    monthLabel: "July 2026",
    handoffLocation: "Gangnam Station Exit 11",
    handoffTimeLabel: "Jul 24, 2026 · 12:00 PM",
    shape: { w: 34, h: 22, r: "sm", inner: "bar" },
  },
  {
    id: "o5",
    orderNumber: "RP-87455",
    itemName: "Fountain pen · Pilot Custom 823",
    category: "Stationery",
    condition: "Good",
    pricePaid: 228000,
    seller: "inkwell_and_co",
    sellerRating: "4.6 (18 deals)",
    status: "cancelled",
    dateLabel: "Jul 14, 2026",
    dateSort: 20260714,
    monthLabel: "July 2026",
    cancelReason: "Seller could not confirm ink condition before the meetup window closed.",
    shape: { w: 22, h: 30, r: "sm", inner: "dot" },
  },
  {
    id: "o6",
    orderNumber: "RP-87201",
    itemName: "Vintage amplifier · Marantz 2270",
    category: "Audio",
    condition: "Good, tested",
    pricePaid: 940000,
    seller: "analog_atelier",
    sellerRating: "4.9 (77 deals)",
    status: "completed",
    dateLabel: "Jun 30, 2026",
    dateSort: 20260630,
    monthLabel: "June 2026",
    handoffLocation: "Itaewon studio pickup",
    handoffTimeLabel: "Jul 2, 2026 · 4:00 PM",
    shape: { w: 34, h: 26, r: "sm", inner: "bar" },
  },
  {
    id: "o7",
    orderNumber: "RP-87055",
    itemName: "Ceramic pour-over set",
    category: "Home",
    condition: "Like new",
    pricePaid: 62000,
    seller: "slow.pour",
    sellerRating: "4.8 (46 deals)",
    status: "completed",
    dateLabel: "Jun 19, 2026",
    dateSort: 20260619,
    monthLabel: "June 2026",
    handoffLocation: "Yeonnam-dong cafe corner",
    handoffTimeLabel: "Jun 21, 2026 · 11:00 AM",
    shape: { w: 24, h: 28, r: "md", inner: "dot" },
  },
  {
    id: "o8",
    orderNumber: "RP-86980",
    itemName: "Wool overcoat · size M",
    category: "Clothing",
    condition: "Very good",
    pricePaid: 178000,
    seller: "closet_archive",
    sellerRating: "4.7 (92 deals)",
    status: "cancelled",
    dateLabel: "Jun 11, 2026",
    dateSort: 20260611,
    monthLabel: "June 2026",
    cancelReason: "Buyer cancelled — found a closer size at another listing.",
    shape: { w: 30, h: 30, r: "sm", inner: "none" },
  },
  {
    id: "o9",
    orderNumber: "RP-86711",
    itemName: "Road bike · steel frame, 54cm",
    category: "Sporting goods",
    condition: "Good, recently tuned",
    pricePaid: 420000,
    seller: "gear_and_grind",
    sellerRating: "4.9 (55 deals)",
    status: "completed",
    dateLabel: "May 26, 2026",
    dateSort: 20260526,
    monthLabel: "May 2026",
    handoffLocation: "Han River Ttukseom entrance",
    handoffTimeLabel: "May 28, 2026 · 9:00 AM",
    shape: { w: 34, h: 20, r: "sm", inner: "bar" },
  },
  {
    id: "o10",
    orderNumber: "RP-86530",
    itemName: "Table lamp · brass base",
    category: "Home",
    condition: "Good",
    pricePaid: 84000,
    seller: "midcentury_seoul",
    sellerRating: "4.8 (61 deals)",
    status: "completed",
    dateLabel: "May 12, 2026",
    dateSort: 20260512,
    monthLabel: "May 2026",
    handoffLocation: "Seongsu Station Exit 3",
    handoffTimeLabel: "May 14, 2026 · 7:00 PM",
    shape: { w: 20, h: 30, r: "sm", inner: "dot" },
  },
  {
    id: "o11",
    orderNumber: "RP-86214",
    itemName: "Point-and-shoot · Contax T2",
    category: "Cameras",
    condition: "Excellent",
    pricePaid: 780000,
    seller: "junhee_camera",
    sellerRating: "4.9 (128 deals)",
    status: "completed",
    dateLabel: "Apr 30, 2026",
    dateSort: 20260430,
    monthLabel: "April 2026",
    handoffLocation: "Myeongdong lobby",
    handoffTimeLabel: "May 2, 2026 · 5:30 PM",
    shape: { w: 34, h: 24, r: "sm", inner: "dot" },
  },
  {
    id: "o12",
    orderNumber: "RP-86050",
    itemName: "Wool rug · 5x7",
    category: "Home",
    condition: "Good, light wear",
    pricePaid: 165000,
    seller: "flatweave_kr",
    sellerRating: "4.5 (12 deals)",
    status: "completed",
    dateLabel: "Apr 18, 2026",
    dateSort: 20260418,
    monthLabel: "April 2026",
    handoffLocation: "Delivered via courier",
    handoffTimeLabel: "Apr 20, 2026",
    shape: { w: 34, h: 24, r: "sm", inner: "none" },
  },
  {
    id: "o13",
    orderNumber: "RP-85822",
    itemName: "Espresso machine · semi-auto",
    category: "Kitchen",
    condition: "Good, descaled",
    pricePaid: 310000,
    seller: "third.wave.kr",
    sellerRating: "4.7 (34 deals)",
    status: "completed",
    dateLabel: "Apr 6, 2026",
    dateSort: 20260406,
    monthLabel: "April 2026",
    handoffLocation: "Mapo-gu apartment lobby",
    handoffTimeLabel: "Apr 8, 2026 · 8:00 PM",
    shape: { w: 26, h: 30, r: "md", inner: "bar" },
  },
  {
    id: "o14",
    orderNumber: "RP-85610",
    itemName: "Canvas tote, set of 2",
    category: "Bags",
    condition: "Like new",
    pricePaid: 28000,
    seller: "closet_archive",
    sellerRating: "4.7 (92 deals)",
    status: "cancelled",
    dateLabel: "Mar 29, 2026",
    dateSort: 20260329,
    monthLabel: "March 2026",
    cancelReason: "Seller relisted at a lower price before handoff; order was voided and refunded.",
    shape: { w: 30, h: 26, r: "sm", inner: "dot" },
  },
];

export const STATUS_META: Record<
  OrderStatus,
  { label: string; short: string }
> = {
  ordered: { label: "Ordered", short: "Awaiting seller confirmation" },
  scheduled: { label: "Handoff scheduled", short: "Meetup arranged" },
  completed: { label: "Completed", short: "Handoff verified" },
  cancelled: { label: "Cancelled", short: "Refunded, no handoff" },
};

export const STATUS_FILTERS: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ordered", label: "Ordered" },
  { id: "scheduled", label: "Scheduled" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export type SortDirection = "newest" | "oldest";

// Thousands-separated KRW formatting — avoids toLocaleString (environment-independent, deterministic).
export function formatKRW(won: number): string {
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₩${digits}`;
}

export const TOTAL_ORDERS = ORDERS.length;
export const TOTAL_SPENT = ORDERS.filter((o) => o.status !== "cancelled").reduce(
  (sum, o) => sum + o.pricePaid,
  0,
);
export const COMPLETED_COUNT = ORDERS.filter((o) => o.status === "completed").length;
