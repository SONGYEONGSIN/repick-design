// app/src/lib/works.ts — 전 작품 메타 단일 출처 (통합 갤러리 + 개별 갤러리 공용)
export type Work = {
  id: string;
  route: string;
  brand: string;
  desc: { en: string; ko: string }; // 카드 태그라인(이중언어)
  previewH?: number; // 카드 미리보기 높이(px), 기본 300
  status?: "winner" | "dropped" | "pending";
  round?: string;
  target?: "dash" | "landing" | "native";
  date?: string;
  image?: string; // 정적 스크린샷 경로(native 등 이미지 미리보기 work). 있으면 WorkCard가 iframe 대신 <img> 렌더
  category?: "project" | "scheduling" | "ops" | "finance" | "analytics" | "landing" | "mobile"; // 갤러리 도메인 카테고리(작품별 부여)
};

export const LAST_UPDATED = "2026-07-25"; // 결정론 규칙: 동적 Date 호출 금지, 갱신 시 수동 수정

export const NATIVE_WORKS: Work[] = [
  {
    id: "n1",
    route: "/native/notification-center.png",
    brand: "알림센터",
    desc: { ko: "알림 피드 · 날짜 그룹핑 · 미읽음 단일 액센트 (자동 native 라운드 auto-native-r1 승자)", en: "Notification feed · grouped by date, a single accent for unread (auto native round auto-native-r1 winner)" },
    target: "native",
    image: "/native/notification-center.png",
    status: "winner",
    round: "auto-native-r1",
    previewH: 420,
    category: "mobile",
  },
];

// Ⅰ 랜딩 — 챔피언 + 진화 계보 v6~v8. (/lab 은 자체가 인덱스 페이지라 작품 아님 — 제외)
export const LANDING_WORKS: Work[] = [
  { id: "v0", route: "/", brand: "V0 — Champion", desc: { ko: "현재 프로덕션 랜딩 · 에디토리얼 스플릿 히어로 + 제품 쇼케이스 (자동 라운드 R7 계보 승자)", en: "Live production landing · editorial split hero + product showcase (auto-round R7 lineage winner)" }, previewH: 340, category: "landing" },
  { id: "v6", route: "/v6", brand: "V6 리빌", desc: { ko: "비포/애프터 드래그 리빌 히어로 · 실제 제품사진 슬라이더(role=slider)·스프링 물리, 감각 축 차별 (자동 landing r2 승자)", en: "Before/after drag-to-reveal hero · a real product-photo slider (role=slider) with spring physics, differentiating on tactile feel (auto landing r2 winner)" }, previewH: 340, category: "landing" },
  { id: "v7", route: "/v7", brand: "V7 대조표", desc: { ko: "AI 매칭 대조표 히어로 · 실 table+탭+아코디언 비교 위젯, 폼 계열 최초 표 기반 (자동 landing r4 승자)", en: "AI-match comparison-table hero · a real table + tabs + accordion widget, the form lineage's first table-based entry (auto landing r4 winner)" }, previewH: 340, category: "landing" },
  { id: "v8", route: "/v8", brand: "V8 다이얼", desc: { ko: "매칭 정확도 다이얼 히어로 · 원형 SVG 게이지 결과 시각화, 형태 신규성 (자동 landing r5 승자)", en: "Match-accuracy dial hero · a circular SVG gauge visualizes the result, a formal novelty (auto landing r5 winner)" }, previewH: 340, category: "landing" },
];

// Ⅱ SaaS 대시보드 — /dash 갤러리 10종(d29~d38) + 기준작/제품
export const DASH_LAB_WORKS: Work[] = [
  { id: "d29", route: "/dash/d29", brand: "Waypoint", desc: { ko: "프로젝트 협업(Asana급) · 순백 라이트, 프로젝트 필터→전 위젯 동기화, 정렬 테이블·간트·워크로드·⌘K", en: "Project collaboration (Asana-grade) · pure-white light, project filter → all-widget sync, sortable table · gantt · workload · ⌘K" }, category: "project" },
  { id: "d30", route: "/dash/d30", brand: "Slotted", desc: { ko: "예약·미팅 스케줄링(Calendly급) · 순백 라이트, 이벤트타입 선택→히트맵·미팅목록 동기화, ⌘K·정렬 테이블", en: "Booking and meeting scheduling (Calendly-grade) · pure-white light, event-type selection syncs heatmap and meeting list, ⌘K and sortable tables" }, category: "scheduling" },
  { id: "d31", route: "/dash/d31", brand: "Conduit", desc: { ko: "워크플로 자동화(n8n급) · 프로덕트 다크, 크로스헤어 차트·상태 필터→테이블·로그 동기화, 에러 급증 알림", en: "Workflow automation (n8n-grade) · product dark, crosshair chart and status filter sync table and log, error-spike alerts" }, category: "ops" },
  { id: "d32", route: "/dash/d32", brand: "Meridian", desc: { ko: "자산 포트폴리오(Coinbase급) · 프로덕트 다크, 기간 토글 가격 차트·자산 선택→차트·상세 동기화, 배분 도넛", en: "Asset portfolio (Coinbase-grade) · product dark, period-toggle price chart, asset selection syncs chart and detail, allocation donut" }, category: "finance" },
  { id: "d33", route: "/dash/d33", brand: "Keel", desc: { ko: "협업 칸반 파이프라인 · 뷰포트락 보드+컬럼 내부 스크롤, 딜 카드 드래그, 예측 차트 (자동 dash r1 승자)", en: "Collaborative kanban pipeline · viewport-locked board with per-column scroll, draggable deal cards, forecast chart (auto dash r1 winner)" }, category: "project" },
  { id: "d34", route: "/dash/d34", brand: "Pulse", desc: { ko: "SLA 라이브옵스 콘솔 · 다크 히어로+벤토, 레일 없는 밀도형 (자동 dash r2 승자)", en: "SLA live-ops console · dark hero + bento layout, a rail-free, high-density build (auto dash r2 winner)" }, category: "ops" },
  { id: "d35", route: "/dash/d35", brand: "Tessera", desc: { ko: "자산배분 트리맵 콕핏 · 중첩 사각 비중 시각화, 즉시 가독 (자동 dash r7 승자)", en: "Asset-allocation treemap cockpit · nested rectangles visualize weighting, instantly legible (auto dash r7 winner)" }, category: "finance" },
  { id: "d36", route: "/dash/d36", brand: "Chute", desc: { ko: "전환 퍼널 전용 페이지 · 트라페조이드 퍼널이 페이지 축, 단계 드롭오프 (자동 dash r8 승자)", en: "A page built around the conversion funnel · a trapezoid funnel forms the page's spine, stage-by-stage drop-off (auto dash r8 winner)" }, category: "analytics" },
  { id: "d37", route: "/dash/d37", brand: "Currents", desc: { ko: "수익귀속 생키 흐름도 · 흐름보존 다단 리본 콘솔 (자동 dash r9 승자)", en: "Revenue-attribution Sankey diagram · a flow-conserving, multi-stage ribbon console (auto dash r9 winner)" }, category: "analytics" },
  { id: "d38", route: "/dash/d38", brand: "Wavelength", desc: { ko: "온콜 로테이션 콘솔 · 24h 레이디얼 다이얼 지배 시각화, 인시던트 대응 (자동 dash r10 승자)", en: "On-call rotation console · dominated by a 24h radial-dial visualization, built for incident response (auto dash r10 winner)" }, category: "ops" },
];

/** 정적 카탈로그(진화 후보 제외) — 갤러리 그리드 + 상세 라우트 공용. 각 entry가 자기 도메인 category 보유. */
export function catalogWorks(): Work[] {
  return [...LANDING_WORKS, ...DASH_LAB_WORKS, ...NATIVE_WORKS];
}
