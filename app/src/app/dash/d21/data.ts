// FORME — 편집국 조판 데스크 · 더미 데이터
// 결정론적 고정 데이터만 사용 (Math.random / Date.now 금지, hydration 안전)

export type Stage = "reporting" | "editing" | "typeset" | "press";
export type DeskId = "politics" | "economy" | "society" | "international" | "culture" | "sports";

export interface Desk {
  id: DeskId;
  label: string;
}

export const desks: Desk[] = [
  { id: "politics", label: "정치부" },
  { id: "economy", label: "경제부" },
  { id: "society", label: "사회부" },
  { id: "international", label: "국제부" },
  { id: "culture", label: "문화부" },
  { id: "sports", label: "스포츠부" },
];

export interface NoteEntry {
  author: string;
  time: string;
  text: string;
}

export interface Article {
  id: string;
  kind: "article" | "photo";
  headline: string;
  desk: DeskId;
  byline: string;
  stage: Stage;
  columns: number;
  page: string;
  deadline: string;
  synopsis: string;
  notes: NoteEntry[];
}

export const articles: Article[] = [
  {
    id: "top",
    kind: "article",
    headline: "국회, 전력망 특별법 본회의 통과…내달 시행",
    desk: "politics",
    byline: "김도윤",
    stage: "typeset",
    columns: 6,
    page: "1면",
    deadline: "16:30",
    synopsis:
      "여야가 신경전 끝에 합의한 전력망 확충 특별법이 본회의를 통과했다. 시행령 정비 일정과 지역 반발 변수가 남아 있다.",
    notes: [
      { author: "박서연 데스크", time: "14:52", text: "리드 문단 표결 수치 재확인 요망" },
      { author: "김도윤", time: "15:05", text: "본회의 속기록 확인 후 수정 완료" },
    ],
  },
  {
    id: "photo",
    kind: "photo",
    headline: "폭우 그친 한강, 시민들 나들이",
    desk: "society",
    byline: "배현우",
    stage: "typeset",
    columns: 0,
    page: "1면",
    deadline: "16:00",
    synopsis: "사흘간 이어진 집중호우가 그친 오후, 한강공원을 찾은 시민들의 모습을 담은 스트레이트 사진 1점.",
    notes: [{ author: "배현우", time: "13:40", text: "보정본 3안 중 2안 채택" }],
  },
  {
    id: "sec-a",
    kind: "article",
    headline: "반도체 수출 두 달 연속 증가세",
    desk: "economy",
    byline: "박서연",
    stage: "editing",
    columns: 3,
    page: "1면",
    deadline: "17:00",
    synopsis: "메모리 반도체 단가 회복에 힘입어 수출 지표가 두 달째 개선됐다. 하반기 전망은 엇갈린다.",
    notes: [{ author: "최윤서", time: "15:10", text: "그래프 단위 확인, 전분기 대비→전년 대비로 정정" }],
  },
  {
    id: "sec-b",
    kind: "article",
    headline: "지역 화폐 사용률 역대 최고",
    desk: "economy",
    byline: "최윤서",
    stage: "reporting",
    columns: 2,
    page: "1면",
    deadline: "17:00",
    synopsis: "지자체 지역화폐 캐시백 확대 이후 소상공인 매출 체감 지수가 함께 상승했다는 조사 결과.",
    notes: [],
  },
  {
    id: "briefs",
    kind: "article",
    headline: "국제 단신 모음",
    desk: "international",
    byline: "임재원",
    stage: "typeset",
    columns: 2,
    page: "1면",
    deadline: "16:30",
    synopsis:
      "유엔 안보리 긴급회의 소집, 유로존 물가상승률 2.1%로 둔화, 동남아 국가 공동 재난대응 협약 체결 — 세 건의 단신.",
    notes: [],
  },
  {
    id: "feature",
    kind: "article",
    headline: "지자체, 폭염 대응 온열질환 응급실 확대",
    desk: "society",
    byline: "정민아",
    stage: "press",
    columns: 4,
    page: "1면",
    deadline: "15:40",
    synopsis: "전국 응급실 온열질환자 신고가 급증하자 지자체들이 야간 대응 병상을 확대하기로 했다.",
    notes: [
      { author: "정민아", time: "15:11", text: "최종 수치 보건당국 확인 완료, 인쇄 대기" },
    ],
  },
  {
    id: "bottom",
    kind: "article",
    headline: "프로야구 준플레이오프 2차전 프리뷰",
    desk: "sports",
    byline: "강태민",
    stage: "editing",
    columns: 3,
    page: "1면",
    deadline: "17:30",
    synopsis: "1차전 연장 접전 이후 두 팀의 불펜 운용 변화가 2차전 승부처가 될 전망이다.",
    notes: [{ author: "한소율 교열팀", time: "15:08", text: "선수명 로마자 표기 통일 요청" }],
  },
  {
    id: "elder-license",
    kind: "article",
    headline: "고령 운전자 면허 자진반납 인센티브 확대",
    desk: "society",
    byline: "조은서",
    stage: "reporting",
    columns: 2,
    page: "3면",
    deadline: "18:20",
    synopsis: "지자체별로 제각각이던 반납 인센티브를 표준화하는 방안이 검토된다.",
    notes: [],
  },
  {
    id: "crypto-tax",
    kind: "article",
    headline: "가상자산 과세 유예 재연장 논의",
    desk: "economy",
    byline: "최윤서",
    stage: "editing",
    columns: 3,
    page: "5면",
    deadline: "18:00",
    synopsis: "업계 반발과 세수 확보 요구가 맞서는 가운데 국회가 유예 재연장 카드를 다시 꺼냈다.",
    notes: [{ author: "박서연 데스크", time: "14:58", text: "여야 입장 인용 순서 정리" }],
  },
  {
    id: "kpop-survival",
    kind: "article",
    headline: "K팝 서바이벌 프로그램 시청률 고공행진",
    desk: "culture",
    byline: "한소율",
    stage: "typeset",
    columns: 2,
    page: "9면",
    deadline: "18:10",
    synopsis: "동시간대 화제성·시청률 지표를 모두 석권한 신규 서바이벌 포맷의 흥행 요인을 짚었다.",
    notes: [],
  },
  {
    id: "oil-price",
    kind: "article",
    headline: "국제유가 급등, 항공업계 비상",
    desk: "international",
    byline: "임재원",
    stage: "press",
    columns: 4,
    page: "7면",
    deadline: "16:50",
    synopsis: "지정학적 리스크로 유가가 급등하며 항공사들이 유류할증료 인상을 검토하고 있다.",
    notes: [{ author: "임재원", time: "15:12", text: "유류할증료 표 최종본 인쇄 대기" }],
  },
  {
    id: "eak-cup",
    kind: "article",
    headline: "동아시안컵 대표팀 명단 발표",
    desk: "sports",
    byline: "강태민",
    stage: "reporting",
    columns: 2,
    page: "11면",
    deadline: "19:00",
    synopsis: "부상 변수를 감안한 깜짝 발탁 명단이 공개되며 팬들 사이에서 갑론을박이 이어지고 있다.",
    notes: [],
  },
  {
    id: "ev-battery",
    kind: "article",
    headline: "전기차 배터리 화재 안전기준 강화",
    desk: "society",
    byline: "정민아",
    stage: "editing",
    columns: 3,
    page: "3면",
    deadline: "17:50",
    synopsis: "잇단 지하주차장 화재 이후 배터리관리시스템 의무 탑재 기준이 강화될 전망이다.",
    notes: [{ author: "조은서", time: "15:00", text: "화재 통계 출처 각주 추가" }],
  },
];

export interface FrontPageSlot {
  id: string;
  gridClass: string;
  type: "article" | "ad" | "empty";
  articleId?: string;
  label?: string;
}

// 1면 지면 배치도 — 6단 × 5행 그리드에 꽉 채운 배치(더미 시트)
export const frontPageSlots: FrontPageSlot[] = [
  { id: "top", type: "article", articleId: "top", gridClass: "col-start-1 col-span-4 row-start-1 row-span-2" },
  { id: "photo", type: "article", articleId: "photo", gridClass: "col-start-5 col-span-2 row-start-1 row-span-2" },
  { id: "sec-a", type: "article", articleId: "sec-a", gridClass: "col-start-1 col-span-2 row-start-3 row-span-1" },
  { id: "sec-b", type: "article", articleId: "sec-b", gridClass: "col-start-3 col-span-2 row-start-3 row-span-1" },
  { id: "briefs", type: "article", articleId: "briefs", gridClass: "col-start-5 col-span-2 row-start-3 row-span-2" },
  { id: "feature", type: "article", articleId: "feature", gridClass: "col-start-1 col-span-3 row-start-4 row-span-1" },
  { id: "ad", type: "ad", label: "하우스 광고 · 정기구독 안내", gridClass: "col-start-4 col-span-1 row-start-4 row-span-2" },
  { id: "bottom", type: "article", articleId: "bottom", gridClass: "col-start-1 col-span-3 row-start-5 row-span-1" },
  { id: "empty", type: "empty", label: "미정 · 2단 여유분", gridClass: "col-start-5 col-span-2 row-start-5 row-span-1" },
];

export const stageOrder: Stage[] = ["reporting", "editing", "typeset", "press"];

export const stageLabel: Record<Stage, string> = {
  reporting: "취재중",
  editing: "교정중",
  typeset: "조판완료",
  press: "인쇄대기",
};

// 고정 기준 시각(데모용 · 실시간 타이머 없음)
export const nowLabel = "15:13";
export const deadlineLabel = "18:00";
export const countdownLabel = "02:47:00";

const EDITION_DATE = new Date("2026-07-11T00:00:00+09:00");
export const editionDateLabel = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "full",
}).format(EDITION_DATE);
export const editionNumber = "제 1247호";
export const editionKind = "조간";

export function countByStage(list: Article[], stage: Stage): number {
  return list.filter((a) => a.stage === stage).length;
}

export const filledSlotCount = frontPageSlots.filter((s) => s.type !== "empty").length;
export const totalSlotCount = frontPageSlots.length;
export const editingCount = countByStage(articles, "editing");
export const frontPageColumnTotal = frontPageSlots.reduce((sum, slot) => {
  if (slot.type !== "article" || !slot.articleId) return sum;
  const article = articles.find((a) => a.id === slot.articleId);
  return sum + (article?.columns ?? 0);
}, 0);
