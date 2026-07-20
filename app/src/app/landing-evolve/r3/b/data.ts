import type { LucideIcon } from "lucide-react";
import { Sparkles, ScanSearch, TrendingDown } from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion ---------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-70px" } as const;
// fixed step interval for the "AI가 생각 중" cycler — deterministic, no Math.random/Date.now.
export const THINK_STEP_MS = 420;
// fixed delay before an AI reply fades in, so it reads as "after the thinking finishes".
export const AI_REPLY_DELAY = 0.9;

// --- shared class tokens (design DNA: dark near-monochrome + single accent) --
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";
// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

// --- domain ----------------------------------------------------------------
export type Grade = "S" | "A";

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  original: number;
  discount: number;
  match: number;
  grade: Grade;
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
  reasons: string[];
  detail: string[];
  image: string;
  alt: string;
};

export type Turn = {
  id: string;
  user: string;
  thinking: string[];
  aiIntro: string;
  product?: Product;
  aiClose?: string;
  cta?: { label: string; href: string };
};

export const CONVERSATION: Turn[] = [
  {
    id: "t1",
    user: "미니멀한 무채색 아우터 찾고 있어요. 예산은 8만원대요.",
    thinking: ["취향 벡터 대조 중", "컨디션 등급 확인 중", "예산 범위 매칭 중"],
    aiIntro:
      "지금 취향·예산과 가장 잘 맞는 매물을 찾았어요. 매칭 96%, 새 상품급, 검증 셀러의 매물이에요.",
    product: {
      id: "coat",
      title: "핸드메이드 울 더블코트",
      brand: "Maison Blanche",
      category: "아우터",
      price: 78000,
      original: 148000,
      discount: 47,
      match: 96,
      grade: "S",
      gradeLabel: "새 상품급",
      seller: "검증 셀러 · 도윤",
      sellerMeta: "거래 214건 · 재구매율 38%",
      reasons: ["미니멀 · 뉴트럴 톤 일치", "예산 8만원대 적중", "실측 오차 1cm 이내"],
      detail: [
        "전문 검수팀 실측 완료 · 하자 리포트 제공",
        "핏 · 기장 실측치 사진 6컷 첨부",
        "택 원본 · 정품 인증서 스캔 확인",
      ],
      image:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
      alt: "정돈된 배경에 단독으로 걸린 울 더블코트",
    },
  },
  {
    id: "t2",
    user: "좋네요. 같은 톤으로 크로스백도 있을까요? 이번 달 안에 사고 싶어요.",
    thinking: ["색상 톤 대조 중", "판매자 인증 이력 확인 중", "시세 대비 할인율 계산 중"],
    aiIntro:
      "네, 같은 뉴트럴 톤에 사이즈까지 맞는 매물이 하나 더 있어요. 시세보다 48% 저렴하고 사용감도 적어요.",
    product: {
      id: "bag",
      title: "레더 스퀘어 크로스백",
      brand: "Atelier Noir",
      category: "가방",
      price: 62000,
      original: 120000,
      discount: 48,
      match: 91,
      grade: "A",
      gradeLabel: "사용감 적음",
      seller: "검증 셀러 · 서연",
      sellerMeta: "거래 132건 · 평점 4.9",
      reasons: ["뉴트럴 컬러 매칭", "이번 달 입고 매물", "시세 대비 48% 절감"],
      detail: [
        "모서리 · 지퍼 마모 8% 수준 검수 완료",
        "내부 오염 없음 · 방수 코팅 잔여 확인",
        "정가 대비 절감 금액 58,000원",
      ],
      image:
        "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
      alt: "바닥에 놓인 가죽 스퀘어 크로스백",
    },
    aiClose: "두 매물 모두 오늘 결제하면 내일 검수 완료 후 바로 배송돼요.",
  },
  {
    id: "t3",
    user: "그럼 코트로 살게요. 배송은 안전하게 되나요?",
    thinking: ["재고 상태 재확인 중", "안심 배송 조건 확인 중", "최종 답변 정리 중"],
    aiIntro:
      "네, 안전 포장 후 실시간 배송 추적까지 전 과정을 알려드려요. 도착 전까지 언제든 취소·환불도 가능해요.",
    aiClose: "지금 확인하면 이 매칭은 그대로 남겨둘게요.",
    cta: { label: "지금 확인하기", href: "/dashboard" },
  },
];

export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "되묻습니다",
    desc: "한마디로는 부족해요. AI가 예산·사이즈·용도를 되물어 취향을 좁혀갑니다.",
    icon: Sparkles,
  },
  {
    index: "02",
    title: "근거를 댑니다",
    desc: "추천마다 매칭 이유·컨디션 등급·인증 이력을 대화 속에서 바로 확인시켜줍니다.",
    icon: ScanSearch,
  },
  {
    index: "03",
    title: "손해를 막습니다",
    desc: "리테일가와 최근 거래가를 대조해, 지금 사도 손해 없는 매물만 대화에 올립니다.",
    icon: TrendingDown,
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "3.1턴", label: "평균 대화 후 구매 확정" },
  { value: "94%", label: "평균 매칭 정확도" },
  { value: "4.9 / 5", label: "대화 경험 만족도" },
];

export type Testimonial = { quote: string; name: string; role: string; initials: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "말로 설명하니까 오히려 더 빨리 찾아졌어요. 되묻는 질문이 정확했어요.",
    name: "정하윤",
    role: "미니멀 웨어 컬렉터",
    initials: "하윤",
  },
  {
    quote: "왜 이 상품인지 근거를 대화 안에서 바로 보여줘서 고민 없이 결제했어요.",
    name: "이서준",
    role: "직장인 구매자",
    initials: "서준",
  },
  {
    quote: "검수 리포트까지 대화 중에 확인할 수 있어서 신뢰가 갔습니다.",
    name: "박도연",
    role: "빈티지 셀렉터",
    initials: "도연",
  },
];
