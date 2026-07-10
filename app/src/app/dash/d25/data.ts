// ROSTRUM — 세일플로어 OS: 결정론적 더미 데이터 (Math.random/Date.now 미사용)

export type DepartmentCode = "PTG" | "SCU" | "WOP" | "DES" | "PHO";

export type LotStatus = "hammered" | "passed" | "live" | "upcoming";

export interface BidChannels {
  room: number;
  phone: number;
  online: number;
  absentee: number;
}

export interface Lot {
  id: string;
  lotNo: number;
  department: DepartmentCode;
  artist: string;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  estimateLow: number;
  estimateHigh: number;
  hammerPrice: number | null;
  currentBid?: number;
  status: LotStatus;
  consignor: string;
  condition: string;
  provenance: string[];
  bidChannels?: BidChannels;
  preRegisteredBids?: number;
}

export const DEPARTMENTS: ReadonlyArray<{ code: DepartmentCode; label: string; full: string }> = [
  { code: "PTG", label: "회화", full: "Painting" },
  { code: "SCU", label: "조각", full: "Sculpture" },
  { code: "WOP", label: "종이 작품", full: "Works on Paper" },
  { code: "DES", label: "디자인", full: "Design" },
  { code: "PHO", label: "사진", full: "Photographs" },
];

export const STATUS_META: Record<LotStatus, { label: string; description: string }> = {
  hammered: { label: "낙찰", description: "낙찰 완료" },
  passed: { label: "유찰", description: "응찰 미달로 유찰" },
  live: { label: "진행중", description: "현재 경매대에서 진행 중" },
  upcoming: { label: "예정", description: "상정 예정" },
};

const lot = (l: Lot): Lot => l;

export const LOTS: Lot[] = [
  lot({
    id: "L001",
    lotNo: 1,
    department: "PTG",
    artist: "Marguerite Sorel",
    title: "Verticals No. 7",
    year: "1968",
    medium: "Oil on canvas",
    dimensions: "116 × 89 cm",
    estimateLow: 60000,
    estimateHigh: 90000,
    hammerPrice: 118000,
    status: "hammered",
    consignor: "C-114",
    condition: "A− · 하단 좌측 미세 마모, 관 처리 완료",
    provenance: [
      "작가 스튜디오, 파리",
      "개인 소장, 파리 (1969년 작가로부터 직접 구입)",
      "현 소장가 (2004년 유증으로 취득)",
    ],
    bidChannels: { room: 35, phone: 25, online: 30, absentee: 10 },
  }),
  lot({
    id: "L002",
    lotNo: 2,
    department: "SCU",
    artist: "Kaito Reventon",
    title: "Threshold Study III",
    year: "1974",
    medium: "Bronze, ed. 3/6",
    dimensions: "42 × 30 × 22 cm",
    estimateLow: 25000,
    estimateHigh: 35000,
    hammerPrice: 31000,
    status: "hammered",
    consignor: "C-108",
    condition: "A · 양호, 표면 산화 자연스러움",
    provenance: ["Galerie None, 브뤼셀 (1975년)", "개인 소장, 밀라노", "본 하우스 경매, 2012년 로트 22", "현 소장가 (2012년 구입)"],
    bidChannels: { room: 45, phone: 15, online: 20, absentee: 20 },
  }),
  lot({
    id: "L003",
    lotNo: 3,
    department: "WOP",
    artist: "Elin Vasko",
    title: "Nocturne, Umber and Blue",
    year: "1991",
    medium: "Gouache on paper",
    dimensions: "56 × 76 cm",
    estimateLow: 12000,
    estimateHigh: 18000,
    hammerPrice: null,
    status: "passed",
    consignor: "C-108",
    condition: "B+ · 여백 미세 얼룩",
    provenance: ["작가로부터 직접 구입, 1991년", "개인 소장, 오슬로"],
    bidChannels: { room: 10, phone: 10, online: 15, absentee: 65 },
  }),
  lot({
    id: "L004",
    lotNo: 4,
    department: "PTG",
    artist: "Foster Ndiaye",
    title: "Red Interior",
    year: "1979",
    medium: "Oil on board",
    dimensions: "81 × 65 cm",
    estimateLow: 40000,
    estimateHigh: 60000,
    hammerPrice: 54000,
    status: "hammered",
    consignor: "C-121",
    condition: "B · 하단 프레임 접촉부 마모",
    provenance: ["개인 소장, 뉴욕 (1980년 구입)", "상속을 통해 현 소장가에게 이전"],
    bidChannels: { room: 40, phone: 20, online: 25, absentee: 15 },
  }),
  lot({
    id: "L005",
    lotNo: 5,
    department: "DES",
    artist: "Odile Marchetti",
    title: "Cabinet No. 4",
    year: "1962",
    medium: "Walnut, brass",
    dimensions: "120 × 48 × 90 cm",
    estimateLow: 18000,
    estimateHigh: 24000,
    hammerPrice: 22500,
    status: "hammered",
    consignor: "C-119",
    condition: "A− · 경첩 1개 교체",
    provenance: ["Marchetti 아틀리에, 밀라노", "개인 소장, 코펜하겐 (1970년대 구입)"],
    bidChannels: { room: 50, phone: 10, online: 20, absentee: 20 },
  }),
  lot({
    id: "L006",
    lotNo: 6,
    department: "PHO",
    artist: "Rasmus Kilde",
    title: "Coastline, Study I–VI",
    year: "1988",
    medium: "Gelatin silver print, set of 6",
    dimensions: "40 × 50 cm (each)",
    estimateLow: 8000,
    estimateHigh: 12000,
    hammerPrice: 15600,
    status: "hammered",
    consignor: "C-105",
    condition: "A · 인화 상태 양호",
    provenance: ["작가로부터 직접 구입, 1989년", "개인 소장, 런던"],
    bidChannels: { room: 20, phone: 15, online: 55, absentee: 10 },
  }),
  lot({
    id: "L007",
    lotNo: 7,
    department: "PTG",
    artist: "Marguerite Sorel",
    title: "Untitled (Grey Field)",
    year: "1970",
    medium: "Oil on canvas",
    dimensions: "150 × 120 cm",
    estimateLow: 90000,
    estimateHigh: 130000,
    hammerPrice: 210000,
    status: "hammered",
    consignor: "C-114",
    condition: "A · 매우 양호",
    provenance: [
      "작가 스튜디오, 파리",
      "Galerie None, 브뤼셀 (1971년)",
      "개인 소장, 제네바 (1985년 구입)",
      "현 소장가 (2009년 상속)",
    ],
    bidChannels: { room: 15, phone: 35, online: 40, absentee: 10 },
  }),
  lot({
    id: "L008",
    lotNo: 8,
    department: "SCU",
    artist: "Petra Alm",
    title: "Standing Figure, Small",
    year: "1957",
    medium: "Cast bronze",
    dimensions: "38 × 12 × 10 cm",
    estimateLow: 15000,
    estimateHigh: 20000,
    hammerPrice: null,
    status: "passed",
    consignor: "C-103",
    condition: "B · 좌측 손가락 결실",
    provenance: ["개인 소장, 로마 (1958년 구입)", "가족 소장, 3대에 걸쳐 전승"],
    bidChannels: { room: 15, phone: 10, online: 10, absentee: 65 },
  }),
  lot({
    id: "L009",
    lotNo: 9,
    department: "WOP",
    artist: "Elin Vasko",
    title: "Study for Nocturne",
    year: "1990",
    medium: "Ink on paper",
    dimensions: "30 × 22 cm",
    estimateLow: 4000,
    estimateHigh: 6000,
    hammerPrice: 5200,
    status: "hammered",
    consignor: "C-108",
    condition: "A− · 여백 핀홀 흔적",
    provenance: ["작가 스튜디오, 파리", "개인 소장, 오슬로"],
    bidChannels: { room: 55, phone: 10, online: 15, absentee: 20 },
  }),
  lot({
    id: "L010",
    lotNo: 10,
    department: "PTG",
    artist: "Hyun-woo Baek",
    title: "Threshold (Dawn)",
    year: "2003",
    medium: "Acrylic on canvas",
    dimensions: "100 × 100 cm",
    estimateLow: 35000,
    estimateHigh: 50000,
    hammerPrice: 47000,
    status: "hammered",
    consignor: "C-117",
    condition: "A · 양호",
    provenance: ["작가로부터 직접 구입, 2004년", "개인 소장, 서울"],
    bidChannels: { room: 35, phone: 20, online: 30, absentee: 15 },
  }),
  lot({
    id: "L011",
    lotNo: 11,
    department: "DES",
    artist: "Odile Marchetti",
    title: "Pair of Armchairs",
    year: "1965",
    medium: "Beech, wool upholstery",
    dimensions: "78 × 70 × 80 cm",
    estimateLow: 9000,
    estimateHigh: 14000,
    hammerPrice: 12000,
    status: "hammered",
    consignor: "C-119",
    condition: "B+ · 원단 재직조",
    provenance: ["Marchetti 아틀리에, 밀라노", "개인 소장, 취리히 (1966년 구입)"],
    bidChannels: { room: 50, phone: 15, online: 15, absentee: 20 },
  }),
  lot({
    id: "L012",
    lotNo: 12,
    department: "PHO",
    artist: "Ines Duarte",
    title: "Terminal, No. 2",
    year: "2011",
    medium: "Chromogenic print",
    dimensions: "100 × 125 cm",
    estimateLow: 10000,
    estimateHigh: 15000,
    hammerPrice: 24000,
    status: "hammered",
    consignor: "C-111",
    condition: "A · 양호",
    provenance: ["작가로부터 직접, 2011년", "개인 소장, 리스본"],
    bidChannels: { room: 20, phone: 20, online: 50, absentee: 10 },
  }),
  lot({
    id: "L013",
    lotNo: 13,
    department: "PTG",
    artist: "Foster Ndiaye",
    title: "Blue Interior (Study)",
    year: "1980",
    medium: "Oil on paper laid on board",
    dimensions: "45 × 38 cm",
    estimateLow: 8000,
    estimateHigh: 12000,
    hammerPrice: 11000,
    status: "hammered",
    consignor: "C-121",
    condition: "B+ · 대지 경미한 변색",
    provenance: ["개인 소장, 뉴욕 (1982년 구입)", "본 하우스 경매, 2018년 로트 9"],
    bidChannels: { room: 45, phone: 15, online: 20, absentee: 20 },
  }),
  lot({
    id: "L014",
    lotNo: 14,
    department: "SCU",
    artist: "Kaito Reventon",
    title: "Threshold Study I",
    year: "1973",
    medium: "Bronze, ed. 2/6",
    dimensions: "40 × 28 × 20 cm",
    estimateLow: 22000,
    estimateHigh: 30000,
    hammerPrice: 27500,
    status: "hammered",
    consignor: "C-108",
    condition: "A− · 패티나 고름",
    provenance: ["Galerie None, 브뤼셀 (1974년)", "개인 소장, 밀라노"],
    bidChannels: { room: 40, phone: 20, online: 25, absentee: 15 },
  }),
  lot({
    id: "L015",
    lotNo: 15,
    department: "PTG",
    artist: "Marguerite Sorel",
    title: "Verticals No. 12 (Meridian)",
    year: "1968",
    medium: "Oil on canvas",
    dimensions: "180 × 140 cm",
    estimateLow: 220000,
    estimateHigh: 320000,
    hammerPrice: null,
    currentBid: 268000,
    status: "live",
    consignor: "C-114",
    condition: "A · 최상급 보존",
    provenance: [
      "작가 스튜디오, 파리",
      "개인 소장, 파리 (1969년 구입)",
      "개인 소장, 뉴욕 (1998년 구입)",
      "현 소장가 (2015년 구입)",
    ],
    bidChannels: { room: 10, phone: 40, online: 40, absentee: 10 },
  }),
  lot({
    id: "L016",
    lotNo: 16,
    department: "PTG",
    artist: "Hyun-woo Baek",
    title: "Interval Study",
    year: "2005",
    medium: "Oil on linen",
    dimensions: "90 × 90 cm",
    estimateLow: 28000,
    estimateHigh: 38000,
    hammerPrice: null,
    status: "upcoming",
    consignor: "C-117",
    condition: "A · 미검사",
    provenance: ["작가로부터 직접 구입, 2005년"],
    preRegisteredBids: 6,
  }),
  lot({
    id: "L017",
    lotNo: 17,
    department: "WOP",
    artist: "Elin Vasko",
    title: "Nocturne, Sequence IV",
    year: "1992",
    medium: "Watercolor on paper",
    dimensions: "50 × 65 cm",
    estimateLow: 9000,
    estimateHigh: 13000,
    hammerPrice: null,
    status: "upcoming",
    consignor: "C-108",
    condition: "A− · 여백 미세 접힘",
    provenance: ["작가 스튜디오, 파리", "개인 소장, 오슬로"],
    preRegisteredBids: 9,
  }),
  lot({
    id: "L018",
    lotNo: 18,
    department: "SCU",
    artist: "Petra Alm",
    title: "Reclining Form",
    year: "1961",
    medium: "Marble",
    dimensions: "30 × 60 × 24 cm",
    estimateLow: 45000,
    estimateHigh: 65000,
    hammerPrice: null,
    status: "upcoming",
    consignor: "C-103",
    condition: "B+ · 표면 미세 스크래치",
    provenance: ["개인 소장, 로마 (1962년 구입)"],
    preRegisteredBids: 4,
  }),
  lot({
    id: "L019",
    lotNo: 19,
    department: "DES",
    artist: "Odile Marchetti",
    title: "Floor Lamp, Model 220",
    year: "1968",
    medium: "Brass, opaline glass",
    dimensions: "165 cm h",
    estimateLow: 6000,
    estimateHigh: 9000,
    hammerPrice: null,
    status: "upcoming",
    consignor: "C-119",
    condition: "A · 배선 재작업 완료",
    provenance: ["Marchetti 아틀리에, 밀라노", "개인 소장, 코펜하겐"],
    preRegisteredBids: 11,
  }),
  lot({
    id: "L020",
    lotNo: 20,
    department: "PHO",
    artist: "Rasmus Kilde",
    title: "Coastline, Study VII",
    year: "1988",
    medium: "Gelatin silver print",
    dimensions: "40 × 50 cm",
    estimateLow: 3000,
    estimateHigh: 5000,
    hammerPrice: null,
    status: "upcoming",
    consignor: "C-105",
    condition: "A · 양호",
    provenance: ["작가로부터 직접 구입, 1989년"],
    preRegisteredBids: 14,
  }),
  lot({
    id: "L021",
    lotNo: 21,
    department: "PTG",
    artist: "Foster Ndiaye",
    title: "Green Interior",
    year: "1981",
    medium: "Oil on canvas",
    dimensions: "100 × 80 cm",
    estimateLow: 55000,
    estimateHigh: 75000,
    hammerPrice: null,
    status: "upcoming",
    consignor: "C-121",
    condition: "A− · 미검사",
    provenance: ["개인 소장, 뉴욕 (1981년 구입)"],
    preRegisteredBids: 3,
  }),
  lot({
    id: "L022",
    lotNo: 22,
    department: "SCU",
    artist: "Kaito Reventon",
    title: "Threshold Study V (Maquette)",
    year: "1975",
    medium: "Plaster",
    dimensions: "25 × 18 × 15 cm",
    estimateLow: 6000,
    estimateHigh: 9000,
    hammerPrice: null,
    status: "upcoming",
    consignor: "C-108",
    condition: "B · 표면 마모",
    provenance: ["Galerie None, 브뤼셀 (1975년)"],
    preRegisteredBids: 7,
  }),
  lot({
    id: "L023",
    lotNo: 23,
    department: "PHO",
    artist: "Ines Duarte",
    title: "Terminal, No. 5",
    year: "2012",
    medium: "Chromogenic print",
    dimensions: "100 × 125 cm",
    estimateLow: 12000,
    estimateHigh: 18000,
    hammerPrice: null,
    status: "upcoming",
    consignor: "C-111",
    condition: "A · 양호",
    provenance: ["작가로부터 직접, 2012년"],
    preRegisteredBids: 5,
  }),
  lot({
    id: "L024",
    lotNo: 24,
    department: "PTG",
    artist: "Marguerite Sorel",
    title: "Study for Meridian",
    year: "1967",
    medium: "Charcoal on paper",
    dimensions: "60 × 45 cm",
    estimateLow: 15000,
    estimateHigh: 22000,
    hammerPrice: null,
    status: "upcoming",
    consignor: "C-114",
    condition: "A− · 액자 미포함",
    provenance: ["작가 스튜디오, 파리", "개인 소장, 파리"],
    preRegisteredBids: 8,
  }),
];

export const SALE_DATE = new Date(2026, 5, 12);

export const SALE_DATE_LABEL = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
}).format(SALE_DATE);

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatUSD(n: number): string {
  return usdFormatter.format(n);
}

export function formatCompactUSD(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export function estimateLabel(l: Lot): string {
  return `${formatUSD(l.estimateLow)} – ${formatUSD(l.estimateHigh)}`;
}

export function formatDelta(ratio: number): { text: string; direction: "up" | "down" | "flat" } {
  const pct = Math.round(ratio * 100);
  if (Math.abs(pct) < 1) return { text: "±0%", direction: "flat" };
  if (pct > 0) return { text: `+${pct}%`, direction: "up" };
  return { text: `−${Math.abs(pct)}%`, direction: "down" };
}

export interface SaleSummary {
  total: number;
  offeredCount: number;
  hammeredCount: number;
  liveOrOffered: number;
  hammerTotal: number;
  estMidTotal: number;
  estHighTotal: number;
  sellThrough: number;
  avgMultiple: number;
  vsHigh: number;
  onlineAvg: number;
}

export function computeSummary(lots: Lot[]): SaleSummary {
  const offered = lots.filter((l) => l.status === "hammered" || l.status === "passed");
  const hammered = lots.filter((l) => l.status === "hammered");
  const hammerTotal = hammered.reduce((s, l) => s + (l.hammerPrice ?? 0), 0);
  const estMidTotal = offered.reduce((s, l) => s + (l.estimateLow + l.estimateHigh) / 2, 0);
  const estHighTotal = offered.reduce((s, l) => s + l.estimateHigh, 0);
  const sellThrough = offered.length ? hammered.length / offered.length : 0;
  const avgMultiple = estMidTotal > 0 ? hammerTotal / estMidTotal : 0;
  const vsHigh = estHighTotal > 0 ? (hammerTotal - estHighTotal) / estHighTotal : 0;
  const channelLots = lots.filter((l) => l.bidChannels);
  const onlineAvg = channelLots.length
    ? channelLots.reduce((s, l) => s + (l.bidChannels?.online ?? 0), 0) / channelLots.length
    : 0;
  const liveOrOffered = lots.filter((l) => l.status !== "upcoming").length;
  return {
    total: lots.length,
    offeredCount: offered.length,
    hammeredCount: hammered.length,
    liveOrOffered,
    hammerTotal,
    estMidTotal,
    estHighTotal,
    sellThrough,
    avgMultiple,
    vsHigh,
    onlineAvg,
  };
}

const SCALE_TIERS = [
  { max: 50000, step: 5000 },
  { max: 150000, step: 10000 },
  { max: Infinity, step: 25000 },
];

export function getScaleMax(lots: Lot[]): number {
  const values = lots.flatMap((l) => [l.estimateHigh, l.hammerPrice ?? 0, l.currentBid ?? 0]);
  const max = Math.max(...values, 1000);
  const tier = SCALE_TIERS.find((t) => max <= t.max) ?? SCALE_TIERS[SCALE_TIERS.length - 1];
  return Math.ceil((max * 1.12) / tier.step) * tier.step;
}

export function deltaVsMid(l: Lot): number | null {
  if (l.hammerPrice == null) return null;
  const mid = (l.estimateLow + l.estimateHigh) / 2;
  return mid > 0 ? (l.hammerPrice - mid) / mid : 0;
}
