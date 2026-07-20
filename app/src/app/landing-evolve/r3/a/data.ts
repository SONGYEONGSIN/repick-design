// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion --------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-60px" } as const;

// --- shared class tokens (design DNA: dark near-monochrome + single accent) --
// accent #6E56CF has presence at rest — never hover-only.
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";
// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

// --- domain ----------------------------------------------------------------
export type Grade = "S" | "A" | "B";
export type MoodTag = "미니멀" | "스트릿" | "빈티지" | "포멀" | "캐주얼";

export type Product = {
  id: string;
  title: string;
  brand: string;
  tag: MoodTag;
  price: number;
  original: number;
  discount: number;
  match: number;
  grade: Grade;
  gradeLabel: string;
  verified: boolean;
  seller: string;
  reason: string;
  likesBase: number;
  image: string;
  alt: string;
  aspect: string;
};

export const FILTERS: Array<"전체" | MoodTag> = [
  "전체",
  "미니멀",
  "스트릿",
  "빈티지",
  "포멀",
  "캐주얼",
];

export type SortId = "match" | "discount";
export const SORTS: Array<{ id: SortId; label: string }> = [
  { id: "match", label: "매칭 높은순" },
  { id: "discount", label: "할인율 높은순" },
];

export const PRODUCTS: Product[] = [
  {
    id: "coat-camel",
    title: "카멜 울 더블코트",
    brand: "Maison Blanche",
    tag: "포멀",
    price: 78000,
    original: 148000,
    discount: 47,
    match: 96,
    grade: "S",
    gradeLabel: "새 상품급",
    verified: true,
    seller: "검증 셀러 · 도윤",
    reason: "관심 브랜드 알림 일치",
    likesBase: 214,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
    alt: "옷걸이에 가지런히 걸린 카멜 톤 울 코트",
    aspect: "aspect-[3/4]",
  },
  {
    id: "bag-square",
    title: "레더 스퀘어 크로스백",
    brand: "Atelier Noir",
    tag: "미니멀",
    price: 62000,
    original: 120000,
    discount: 48,
    match: 91,
    grade: "A",
    gradeLabel: "사용감 적음",
    verified: true,
    seller: "검증 셀러 · 서연",
    reason: "뉴트럴 컬러 매칭",
    likesBase: 132,
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=800&q=80",
    alt: "바닥에 놓인 가죽 소재 스퀘어 크로스백",
    aspect: "aspect-square",
  },
  {
    id: "sneaker-low",
    title: "클래식 로우 스니커즈",
    brand: "Runway Archive",
    tag: "캐주얼",
    price: 54000,
    original: 98000,
    discount: 45,
    match: 88,
    grade: "A",
    gradeLabel: "생활 흔적 소량",
    verified: true,
    seller: "검증 셀러 · 민재",
    reason: "270mm 사이즈 일치",
    likesBase: 87,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",
    alt: "화이트 톤의 클래식 로우 스니커즈 한 켤레",
    aspect: "aspect-[4/5]",
  },
  {
    id: "blouse-silk",
    title: "실크 셔츠 블라우스",
    brand: "Studio Lin",
    tag: "포멀",
    price: 41000,
    original: 79000,
    discount: 48,
    match: 93,
    grade: "S",
    gradeLabel: "새 상품급",
    verified: true,
    seller: "검증 셀러 · 하린",
    reason: "오피스룩 취향 반영",
    likesBase: 156,
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    alt: "실크 셔츠 블라우스를 입은 인물의 패션 컷",
    aspect: "aspect-[2/3]",
  },
  {
    id: "vintage-dress",
    title: "빈티지 파스텔 원피스",
    brand: "Aureum Vintage",
    tag: "빈티지",
    price: 46000,
    original: 89000,
    discount: 48,
    match: 90,
    grade: "A",
    gradeLabel: "사용감 적음",
    verified: true,
    seller: "검증 셀러 · 지우",
    reason: "빈티지 무드 컬렉션 일치",
    likesBase: 121,
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
    alt: "파스텔 톤 빈티지 원피스가 걸려 있는 옷걸이 랙",
    aspect: "aspect-[3/5]",
  },
  {
    id: "color-jacket",
    title: "컬러블록 캐주얼 재킷",
    brand: "Northline",
    tag: "스트릿",
    price: 58000,
    original: 112000,
    discount: 48,
    match: 85,
    grade: "B",
    gradeLabel: "생활 흔적 보통",
    verified: true,
    seller: "검증 셀러 · 태오",
    reason: "스트릿 무드 저장 이력",
    likesBase: 64,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    alt: "다양한 색상의 캐주얼 재킷이 걸려 있는 옷걸이 랙",
    aspect: "aspect-[4/3]",
  },
  {
    id: "leather-mini",
    title: "미니 레더 숄더백",
    brand: "Atelier Noir",
    tag: "미니멀",
    price: 39000,
    original: 76000,
    discount: 49,
    match: 94,
    grade: "S",
    gradeLabel: "새 상품급",
    verified: true,
    seller: "검증 셀러 · 세아",
    reason: "예산 4만원대 적중",
    likesBase: 178,
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    alt: "가죽 소재 미니 숄더백을 가까이서 촬영한 사진",
    aspect: "aspect-[3/4]",
  },
  {
    id: "hightop",
    title: "스트릿 하이탑 스니커즈",
    brand: "Runway Archive",
    tag: "스트릿",
    price: 61000,
    original: 118000,
    discount: 48,
    match: 89,
    grade: "A",
    gradeLabel: "사용감 적음",
    verified: true,
    seller: "검증 셀러 · 준호",
    reason: "밑창 마모 6% 검수",
    likesBase: 102,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    alt: "하이탑 스니커즈 한 켤레를 나란히 놓은 사진",
    aspect: "aspect-square",
  },
  {
    id: "trench",
    title: "오버사이즈 트렌치코트",
    brand: "Maison Blanche",
    tag: "포멀",
    price: 82000,
    original: 159000,
    discount: 48,
    match: 92,
    grade: "A",
    gradeLabel: "사용감 적음",
    verified: true,
    seller: "검증 셀러 · 유나",
    reason: "오버핏 선호 반영",
    likesBase: 143,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    alt: "베이지 톤 오버사이즈 트렌치코트를 입은 인물의 패션 컷",
    aspect: "aspect-[4/5]",
  },
  {
    id: "neutral-setup",
    title: "미니멀 뉴트럴 셋업",
    brand: "Studio Lin",
    tag: "미니멀",
    price: 69000,
    original: 132000,
    discount: 48,
    match: 97,
    grade: "S",
    gradeLabel: "새 상품급",
    verified: true,
    seller: "검증 셀러 · 다연",
    reason: "미니멀 · 뉴트럴 톤 일치",
    likesBase: 201,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
    alt: "뉴트럴 톤 미니멀 셋업을 입은 인물의 패션 컷",
    aspect: "aspect-[2/3]",
  },
  {
    id: "denim-set",
    title: "빈티지 워시드 데님셋",
    brand: "Aureum Vintage",
    tag: "빈티지",
    price: 44000,
    original: 84000,
    discount: 48,
    match: 86,
    grade: "B",
    gradeLabel: "생활 흔적 보통",
    verified: true,
    seller: "검증 셀러 · 강민",
    reason: "빈티지 워시 컬렉션 일치",
    likesBase: 58,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=80",
    alt: "행어에 걸린 빈티지 워시드 데님 자켓",
    aspect: "aspect-[3/5]",
  },
  {
    id: "hoodie",
    title: "오버핏 캐주얼 후디",
    brand: "Northline",
    tag: "캐주얼",
    price: 36000,
    original: 68000,
    discount: 47,
    match: 84,
    grade: "B",
    gradeLabel: "생활 흔적 보통",
    verified: true,
    seller: "검증 셀러 · 예린",
    reason: "캐주얼 취향 확장",
    likesBase: 45,
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=700&q=80",
    alt: "바닥에 편평하게 펼쳐 놓은 오버핏 후디",
    aspect: "aspect-[4/3]",
  },
];

export type Value = { index: string; title: string; desc: string };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "취향을 검증합니다",
    desc: "찜 · 스킵 · 구매 이력을 실시간 반영해 지금 당신에게 맞는 것만 남깁니다.",
  },
  {
    index: "02",
    title: "컨디션을 실측합니다",
    desc: "전문 검수팀이 실측과 하자를 확인해 S · A 등급만 매칭에 올립니다.",
  },
  {
    index: "03",
    title: "시세를 대조합니다",
    desc: "최근 거래가와 리테일가를 대조해 지금 사도 손해 없는 매물만 보여줍니다.",
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: `${PRODUCTS.length}종`, label: "지금 피드에 노출 중" },
  { value: "94%", label: "평균 매칭 정확도" },
  { value: "4.9 / 5", label: "사용자 만족도" },
];

export const PROOF: Stat[] = [
  { value: "2.4배", label: "구매 전환율 상승" },
  { value: "-63%", label: "탐색 시간 절감" },
  { value: "38%", label: "3개월 내 재구매율" },
];
