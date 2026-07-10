// PLANCHE — 컬렉션 MD 관제 더미 데이터
// 모든 수치는 결정론적 정적 스냅샷(시연용 가상 수치). Math.random/Date.now 미사용.

export type Category = "RTW" | "OUTERWEAR" | "ACCESSORIES" | "FOOTWEAR" | "BAGS";
export type LookStatus = "SAMPLE" | "FITTED" | "CONFIRMED" | "SHIPPED" | "SOLD OUT";
export type SeasonId = "SS26" | "FW25" | "RESORT26";

export interface Look {
  id: string;
  title: string;
  category: Category;
  status: LookStatus;
  sellThrough: number; // 0-100
  price: number; // EUR
  velocity: number[]; // 누적 판매율 추이 6포인트, 오름차순, 마지막=sellThrough
  hero?: boolean;
}

export interface PipelineStage {
  stage: string;
  count: number;
}

export interface RetailDoor {
  name: string;
  city: string;
  index: number; // 0-100 퍼포먼스 인덱스
}

export interface PressItem {
  outlet: string;
  lookId: string;
  reach: number; // 백만 단위 도달 지수
}

export interface CategoryShare {
  category: Category;
  pct: number;
}

export interface SeasonData {
  id: SeasonId;
  label: string;
  fullLabel: string;
  snapshotDate: string; // ISO
  sellThroughDelta: number; // 전년 동시즌 동일 경과일 대비 포인트차
  unitsOrdered: number;
  orderPace: number[]; // 유닛 오더 추이 스파크라인
  avgSellPrice: number;
  pressPlacements: number;
  categoryShare: CategoryShare[];
  pipeline: PipelineStage[];
  currentStage: string;
  looks: Look[];
  retailDoors: RetailDoor[];
  press: PressItem[];
}

export const CATEGORY_LABEL: Record<Category, string> = {
  RTW: "RTW",
  OUTERWEAR: "아우터",
  ACCESSORIES: "액세서리",
  FOOTWEAR: "슈즈",
  BAGS: "백",
};

export const SEASONS: Record<SeasonId, SeasonData> = {
  SS26: {
    id: "SS26",
    label: "SS26",
    fullLabel: "Printemps/Été 2026",
    snapshotDate: "2026-07-01",
    sellThroughDelta: 4.8,
    unitsOrdered: 21600,
    orderPace: [3, 8, 15, 26, 41, 58, 78, 100],
    avgSellPrice: 1620,
    pressPlacements: 47,
    categoryShare: [
      { category: "RTW", pct: 34 },
      { category: "OUTERWEAR", pct: 18 },
      { category: "ACCESSORIES", pct: 21 },
      { category: "FOOTWEAR", pct: 15 },
      { category: "BAGS", pct: 12 },
    ],
    pipeline: [
      { stage: "SAMPLE", count: 42 },
      { stage: "FIT", count: 42 },
      { stage: "SHOT", count: 38 },
      { stage: "CONFIRMED", count: 34 },
      { stage: "PRODUCTION", count: 28 },
      { stage: "SHIPPED", count: 19 },
      { stage: "IN STORE", count: 11 },
    ],
    currentStage: "SHIPPED",
    looks: [
      { id: "001", title: "Ivoire Column", category: "RTW", status: "SOLD OUT", sellThrough: 100, price: 2400, velocity: [18, 34, 52, 71, 88, 100], hero: true },
      { id: "002", title: "Noir Trench", category: "OUTERWEAR", status: "SHIPPED", sellThrough: 88, price: 3200, velocity: [4, 9, 18, 30, 58, 88] },
      { id: "003", title: "Rive Gauche Coat", category: "OUTERWEAR", status: "SHIPPED", sellThrough: 76, price: 3600, velocity: [2, 6, 14, 24, 49, 76] },
      { id: "004", title: "Structured Void", category: "RTW", status: "CONFIRMED", sellThrough: 61, price: 1980, velocity: [1, 4, 9, 17, 34, 61] },
      { id: "005", title: "Silk Foulard", category: "ACCESSORIES", status: "SHIPPED", sellThrough: 93, price: 640, velocity: [8, 17, 29, 44, 68, 93] },
      { id: "006", title: "Tailored Ash Suit", category: "RTW", status: "CONFIRMED", sellThrough: 54, price: 2150, velocity: [1, 3, 7, 13, 28, 54] },
      { id: "007", title: "Opaline Slip Dress", category: "RTW", status: "FITTED", sellThrough: 22, price: 1740, velocity: [0, 1, 2, 4, 11, 22] },
      { id: "008", title: "Grain de Poudre Pump", category: "FOOTWEAR", status: "SHIPPED", sellThrough: 81, price: 890, velocity: [5, 11, 20, 32, 55, 81] },
      { id: "009", title: "Sable Shoulder Bag", category: "BAGS", status: "SHIPPED", sellThrough: 85, price: 2200, velocity: [3, 8, 16, 28, 52, 85] },
      { id: "010", title: "Petit Structured Tote", category: "BAGS", status: "CONFIRMED", sellThrough: 39, price: 1650, velocity: [0, 1, 3, 7, 18, 39] },
      { id: "011", title: "Mono Cape Coat", category: "OUTERWEAR", status: "CONFIRMED", sellThrough: 58, price: 2900, velocity: [2, 5, 10, 18, 33, 58] },
      { id: "012", title: "Bias Noir Gown", category: "RTW", status: "SHIPPED", sellThrough: 97, price: 4100, velocity: [12, 26, 43, 61, 84, 97], hero: true },
    ],
    retailDoors: [
      { name: "Faubourg Saint-Honoré", city: "Paris", index: 92 },
      { name: "Via Montenapoleone", city: "Milano", index: 81 },
      { name: "Madison Avenue", city: "New York", index: 74 },
      { name: "Omotesando", city: "Tokyo", index: 88 },
      { name: "Cheongdam-dong", city: "Seoul", index: 95 },
      { name: "Sloane Street", city: "London", index: 68 },
    ],
    press: [
      { outlet: "Vogue Paris", lookId: "001", reach: 4.2 },
      { outlet: "WWD", lookId: "012", reach: 3.1 },
      { outlet: "Le Figaro Style", lookId: "002", reach: 2.4 },
      { outlet: "Business of Fashion", lookId: "005", reach: 1.8 },
      { outlet: "Hypebeast", lookId: "008", reach: 2.9 },
    ],
  },
  FW25: {
    id: "FW25",
    label: "FW25",
    fullLabel: "Automne/Hiver 2025",
    snapshotDate: "2026-07-01",
    sellThroughDelta: -3.4,
    unitsOrdered: 19800,
    orderPace: [5, 12, 22, 35, 52, 71, 89, 100],
    avgSellPrice: 1540,
    pressPlacements: 51,
    categoryShare: [
      { category: "RTW", pct: 31 },
      { category: "OUTERWEAR", pct: 24 },
      { category: "ACCESSORIES", pct: 17 },
      { category: "FOOTWEAR", pct: 16 },
      { category: "BAGS", pct: 12 },
    ],
    pipeline: [
      { stage: "SAMPLE", count: 38 },
      { stage: "FIT", count: 38 },
      { stage: "SHOT", count: 38 },
      { stage: "CONFIRMED", count: 38 },
      { stage: "PRODUCTION", count: 38 },
      { stage: "SHIPPED", count: 38 },
      { stage: "IN STORE", count: 38 },
    ],
    currentStage: "IN STORE",
    looks: [
      { id: "001", title: "Sable Overcoat", category: "OUTERWEAR", status: "SOLD OUT", sellThrough: 100, price: 3800, velocity: [20, 38, 57, 76, 91, 100], hero: true },
      { id: "002", title: "Chalk Stripe Suit", category: "RTW", status: "SOLD OUT", sellThrough: 100, price: 2300, velocity: [15, 31, 49, 68, 87, 100] },
      { id: "003", title: "Cashmere Column", category: "OUTERWEAR", status: "SOLD OUT", sellThrough: 96, price: 4200, velocity: [10, 24, 41, 60, 80, 96] },
      { id: "004", title: "Wool Bias Skirt", category: "RTW", status: "SOLD OUT", sellThrough: 91, price: 1420, velocity: [8, 19, 34, 53, 73, 91] },
      { id: "005", title: "Leather Glove Set", category: "ACCESSORIES", status: "SOLD OUT", sellThrough: 88, price: 480, velocity: [6, 15, 27, 42, 64, 88] },
      { id: "006", title: "Structured Ankle Boot", category: "FOOTWEAR", status: "SOLD OUT", sellThrough: 94, price: 980, velocity: [9, 21, 37, 56, 76, 94] },
      { id: "007", title: "Grain Noir Blazer", category: "RTW", status: "SOLD OUT", sellThrough: 79, price: 2050, velocity: [4, 10, 19, 33, 54, 79] },
      { id: "008", title: "Fur-Trim Parka", category: "OUTERWEAR", status: "SOLD OUT", sellThrough: 100, price: 5200, velocity: [22, 40, 59, 77, 92, 100], hero: true },
      { id: "009", title: "Envelope Clutch", category: "BAGS", status: "SOLD OUT", sellThrough: 85, price: 1850, velocity: [5, 13, 24, 39, 61, 85] },
      { id: "010", title: "Saddle Crossbody", category: "BAGS", status: "SOLD OUT", sellThrough: 72, price: 2100, velocity: [3, 8, 17, 29, 48, 72] },
      { id: "011", title: "Draped Column Gown", category: "RTW", status: "SOLD OUT", sellThrough: 61, price: 3600, velocity: [2, 6, 13, 23, 40, 61] },
      { id: "012", title: "Cable Knit Vest", category: "RTW", status: "SHIPPED", sellThrough: 44, price: 890, velocity: [1, 3, 7, 14, 26, 44] },
    ],
    retailDoors: [
      { name: "Faubourg Saint-Honoré", city: "Paris", index: 88 },
      { name: "Via Montenapoleone", city: "Milano", index: 90 },
      { name: "Madison Avenue", city: "New York", index: 79 },
      { name: "Omotesando", city: "Tokyo", index: 82 },
      { name: "Cheongdam-dong", city: "Seoul", index: 91 },
      { name: "Sloane Street", city: "London", index: 85 },
    ],
    press: [
      { outlet: "Vogue Paris", lookId: "008", reach: 5.6 },
      { outlet: "WWD", lookId: "001", reach: 4.8 },
      { outlet: "Elle", lookId: "003", reach: 3.3 },
      { outlet: "Highsnobiety", lookId: "009", reach: 2.1 },
      { outlet: "The Cut", lookId: "011", reach: 1.9 },
    ],
  },
  RESORT26: {
    id: "RESORT26",
    label: "RESORT 26",
    fullLabel: "Croisière 2026",
    snapshotDate: "2026-07-01",
    sellThroughDelta: 1.2,
    unitsOrdered: 8200,
    orderPace: [1, 3, 6, 11, 18, 28, 41, 100],
    avgSellPrice: 1380,
    pressPlacements: 9,
    categoryShare: [
      { category: "RTW", pct: 29 },
      { category: "OUTERWEAR", pct: 9 },
      { category: "ACCESSORIES", pct: 26 },
      { category: "FOOTWEAR", pct: 20 },
      { category: "BAGS", pct: 16 },
    ],
    pipeline: [
      { stage: "SAMPLE", count: 24 },
      { stage: "FIT", count: 20 },
      { stage: "SHOT", count: 14 },
      { stage: "CONFIRMED", count: 8 },
      { stage: "PRODUCTION", count: 3 },
      { stage: "SHIPPED", count: 0 },
      { stage: "IN STORE", count: 0 },
    ],
    currentStage: "PRODUCTION",
    looks: [
      { id: "001", title: "Linen Column", category: "RTW", status: "SAMPLE", sellThrough: 4, price: 1280, velocity: [0, 0, 1, 1, 2, 4] },
      { id: "002", title: "Raffia Tote", category: "BAGS", status: "FITTED", sellThrough: 12, price: 980, velocity: [0, 1, 2, 4, 7, 12] },
      { id: "003", title: "Espadrille Wedge", category: "FOOTWEAR", status: "SAMPLE", sellThrough: 2, price: 540, velocity: [0, 0, 0, 1, 1, 2] },
      { id: "004", title: "Silk Kaftan", category: "RTW", status: "FITTED", sellThrough: 18, price: 1620, velocity: [0, 1, 3, 7, 12, 18], hero: true },
      { id: "005", title: "Straw Capeline", category: "ACCESSORIES", status: "CONFIRMED", sellThrough: 31, price: 420, velocity: [1, 3, 7, 13, 22, 31] },
      { id: "006", title: "Poplin Shirt Dress", category: "RTW", status: "SAMPLE", sellThrough: 3, price: 1180, velocity: [0, 0, 1, 1, 2, 3] },
      { id: "007", title: "Woven Belt", category: "ACCESSORIES", status: "CONFIRMED", sellThrough: 27, price: 380, velocity: [0, 2, 5, 10, 18, 27] },
      { id: "008", title: "Canvas Slide", category: "FOOTWEAR", status: "FITTED", sellThrough: 9, price: 460, velocity: [0, 0, 1, 3, 6, 9] },
      { id: "009", title: "Terry Polo", category: "RTW", status: "SAMPLE", sellThrough: 1, price: 890, velocity: [0, 0, 0, 0, 1, 1] },
      { id: "010", title: "Basket Clutch", category: "BAGS", status: "CONFIRMED", sellThrough: 22, price: 720, velocity: [0, 1, 3, 7, 14, 22] },
      { id: "011", title: "Voile Trench", category: "OUTERWEAR", status: "SAMPLE", sellThrough: 5, price: 1980, velocity: [0, 0, 1, 2, 3, 5] },
      { id: "012", title: "Printed Sarong", category: "RTW", status: "CONFIRMED", sellThrough: 34, price: 340, velocity: [1, 3, 7, 14, 24, 34], hero: true },
    ],
    retailDoors: [
      { name: "Faubourg Saint-Honoré", city: "Paris", index: 40 },
      { name: "Via Montenapoleone", city: "Milano", index: 35 },
      { name: "Madison Avenue", city: "New York", index: 52 },
      { name: "Omotesando", city: "Tokyo", index: 61 },
      { name: "Cheongdam-dong", city: "Seoul", index: 58 },
      { name: "Sloane Street", city: "London", index: 30 },
    ],
    press: [
      { outlet: "Vogue Paris", lookId: "004", reach: 1.1 },
      { outlet: "WWD", lookId: "012", reach: 0.9 },
      { outlet: "Condé Nast Traveler", lookId: "005", reach: 0.7 },
    ],
  },
};

export const SEASON_ORDER: SeasonId[] = ["SS26", "FW25", "RESORT26"];
