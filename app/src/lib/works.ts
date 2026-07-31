// app/src/lib/works.ts — single source of truth for all work metadata (shared by the unified gallery + individual galleries)
export type Work = {
  id: string;
  route: string;
  brand: string;
  desc: { en: string; ko: string }; // card tagline (bilingual)
  previewH?: number; // card preview height (px), default 300
  status?: "winner" | "dropped" | "pending";
  round?: string;
  target?: "dash" | "landing" | "native" | "login" | "404";
  date?: string;
  /**
   * Gallery page-type category (refero-style axis: what kind of page is this, not what domain it serves).
   * The union covers the full target taxonomy so future rounds have a slot to land in; the gallery only
   * renders a filter chip for types that actually have works, so unfilled types stay invisible.
   * Domain information (ops / finance / analytics …) lives in each work's `desc`, not in a second axis.
   */
  category?:
    | "dashboard" | "settings" | "landing" | "scene" | "catalog" | "product-detail"
    | "paywall" | "login" | "profile" | "404" | "blog" | "about"
    | "careers" | "contact" | "developers" | "integration" | "media-kit"
    | "mobile";
};

export const LAST_UPDATED = "2026-08-01"; // determinism rule: no dynamic Date calls — update this by hand when refreshing

export const NATIVE_WORKS: Work[] = [
  { id: "n1", route: "/native-app/index.html?screen=watchlist", brand: "Watchlist", desc: { en: "Saved-item watchlist · price-drop alerts and a single accent for unread, as a native mobile screen.", ko: "관심목록 · 가격 하락 알림 · 미읽음 단일 액센트 (네이티브 모바일 화면)" }, target: "native", category: "mobile", previewH: 520 },
  { id: "n2", route: "/native-app/index.html?screen=match", brand: "AI Match", desc: { en: "AI-match results feed · ranked secondhand picks with match scores, native mobile.", ko: "AI 매칭 결과 피드 · 매칭 점수순 중고 추천 (네이티브 모바일)" }, target: "native", category: "mobile", previewH: 520 },
  { id: "n3", route: "/native-app/index.html?screen=detail", brand: "Price Detail", desc: { en: "Product price-history detail · chart + spec breakdown on a native mobile screen.", ko: "상품 가격 히스토리 상세 · 차트 + 스펙 분해 (네이티브 모바일)" }, target: "native", category: "mobile", previewH: 520 },
];

// 0. Error — the 404 page type's first entry.
// Routed at /not-found-page, not /404: Next reserves the literal /404 path and answers it with the
// not-found handler (HTTP 404), so a page placed there is never served. Checked by request, not by
// assumption — the promoted route returned 404 on its first gate run.
export const NOTFOUND_WORKS: Work[] = [
  { id: "nf1", route: "/not-found-page", brand: "Rivet", desc: { ko: "다크 타이포그래픽 404 · 장식 없이 타이포 매스가 화면을 지배하고 복귀 경로를 한 화면에서 끝낸다 (자동 404 r1 승자)", en: "Dark typographic 404 · no ornament, a typographic mass owns the screen and every route back resolves in one viewport (auto 404 r1 winner)" }, previewH: 340, target: "404", category: "404" },
];

// 0. Auth — the login page type's first entry.
export const LOGIN_WORKS: Work[] = [
  { id: "lg1", route: "/login", brand: "Contour", desc: { ko: "관측성 SaaS 로그인 · 좌측 컨투어 지형선 + 스파크라인 스탯의 다크 비주얼 패널과 우측 라이트 폼 스플릿, 세그먼트 토글로 로그인/가입 전환 (자동 login r1 승자)", en: "Observability-SaaS sign-in · a split of dark contour-line visual panel with sparkline stats against a light form column, with a segmented toggle between sign-in and sign-up (auto login r1 winner)" }, previewH: 340, target: "login", category: "login" },
];

// I. Landing — champion + evolution lineage v6~v10. (/lab is itself an index page, not a work — excluded)
export const LANDING_WORKS: Work[] = [
  { id: "v0", route: "/", brand: "Attune", desc: { ko: "현재 프로덕션 랜딩 · 에디토리얼 스플릿 히어로 + 제품 쇼케이스 (자동 라운드 R7 계보 승자)", en: "Live production landing · editorial split hero + product showcase (auto-round R7 lineage winner)" }, previewH: 340, category: "landing" },
  { id: "v6", route: "/v6", brand: "Threshold", desc: { ko: "비포/애프터 드래그 리빌 히어로 · 실제 제품사진 슬라이더(role=slider)·스프링 물리, 감각 축 차별 (자동 landing r2 승자)", en: "Before/after drag-to-reveal hero · a real product-photo slider (role=slider) with spring physics, differentiating on tactile feel (auto landing r2 winner)" }, previewH: 340, category: "landing" },
  { id: "v7", route: "/v7", brand: "Tally", desc: { ko: "AI 매칭 대조표 히어로 · 실 table+탭+아코디언 비교 위젯, 폼 계열 최초 표 기반 (자동 landing r4 승자)", en: "AI-match comparison-table hero · a real table + tabs + accordion widget, the form lineage's first table-based entry (auto landing r4 winner)" }, previewH: 340, category: "landing" },
  { id: "v8", route: "/v8", brand: "Sundial", desc: { ko: "매칭 정확도 다이얼 히어로 · 원형 SVG 게이지 결과 시각화, 형태 신규성 (자동 landing r5 승자)", en: "Match-accuracy dial hero · a circular SVG gauge visualizes the result, a formal novelty (auto landing r5 winner)" }, previewH: 340, category: "landing" },
  { id: "v9", route: "/v9", brand: "Loupe", desc: { ko: "AI 주석 스캔 히어로 · 실제 제품 사진 위 포커스 가능한 5개 주석 핀이 검사 항목을 순차 공개 (자동 landing r7 승자)", en: "AI annotation-scan hero · five focusable pins placed directly on a real product photo reveal what the AI inspected, one finding at a time (auto landing r7 winner)" }, previewH: 340, category: "landing" },
  { id: "v10", route: "/v10", brand: "Lattice", desc: { ko: "선호↔매물 관계 그래프 히어로 · 노드 선택 시 근거 문장·강도 막대·강조 매물까지 네 증거면이 동시 재계산 (자동 landing r8 승자)", en: "Preference-to-product graph hero · selecting a signal recomputes four proof surfaces at once — reasoning, strength bars, and the highlighted match (auto landing r8 winner)" }, previewH: 340, category: "landing" },
];

// II. SaaS dashboards — 12 works in the /dash gallery (d29~d40) + baseline/product
export const DASH_LAB_WORKS: Work[] = [
  { id: "d29", route: "/dash/d29", brand: "Waypoint", desc: { ko: "프로젝트 협업(Asana급) · 순백 라이트, 프로젝트 필터→전 위젯 동기화, 정렬 테이블·간트·워크로드·⌘K", en: "Project collaboration (Asana-grade) · pure-white light, project filter → all-widget sync, sortable table · gantt · workload · ⌘K" }, category: "dashboard" },
  { id: "d30", route: "/dash/d30", brand: "Slotted", desc: { ko: "예약·미팅 스케줄링(Calendly급) · 순백 라이트, 이벤트타입 선택→히트맵·미팅목록 동기화, ⌘K·정렬 테이블", en: "Booking and meeting scheduling (Calendly-grade) · pure-white light, event-type selection syncs heatmap and meeting list, ⌘K and sortable tables" }, category: "dashboard" },
  { id: "d31", route: "/dash/d31", brand: "Conduit", desc: { ko: "워크플로 자동화(n8n급) · 프로덕트 다크, 크로스헤어 차트·상태 필터→테이블·로그 동기화, 에러 급증 알림", en: "Workflow automation (n8n-grade) · product dark, crosshair chart and status filter sync table and log, error-spike alerts" }, category: "dashboard" },
  { id: "d32", route: "/dash/d32", brand: "Meridian", desc: { ko: "자산 포트폴리오(Coinbase급) · 프로덕트 다크, 기간 토글 가격 차트·자산 선택→차트·상세 동기화, 배분 도넛", en: "Asset portfolio (Coinbase-grade) · product dark, period-toggle price chart, asset selection syncs chart and detail, allocation donut" }, category: "dashboard" },
  { id: "d33", route: "/dash/d33", brand: "Keel", desc: { ko: "협업 칸반 파이프라인 · 뷰포트락 보드+컬럼 내부 스크롤, 딜 카드 드래그, 예측 차트 (자동 dash r1 승자)", en: "Collaborative kanban pipeline · viewport-locked board with per-column scroll, draggable deal cards, forecast chart (auto dash r1 winner)" }, category: "dashboard" },
  { id: "d34", route: "/dash/d34", brand: "Pulse", desc: { ko: "SLA 라이브옵스 콘솔 · 다크 히어로+벤토, 레일 없는 밀도형 (자동 dash r2 승자)", en: "SLA live-ops console · dark hero + bento layout, a rail-free, high-density build (auto dash r2 winner)" }, category: "dashboard" },
  { id: "d35", route: "/dash/d35", brand: "Tessera", desc: { ko: "자산배분 트리맵 콕핏 · 중첩 사각 비중 시각화, 즉시 가독 (자동 dash r7 승자)", en: "Asset-allocation treemap cockpit · nested rectangles visualize weighting, instantly legible (auto dash r7 winner)" }, category: "dashboard" },
  { id: "d36", route: "/dash/d36", brand: "Chute", desc: { ko: "전환 퍼널 전용 페이지 · 트라페조이드 퍼널이 페이지 축, 단계 드롭오프 (자동 dash r8 승자)", en: "A page built around the conversion funnel · a trapezoid funnel forms the page's spine, stage-by-stage drop-off (auto dash r8 winner)" }, category: "dashboard" },
  { id: "d37", route: "/dash/d37", brand: "Currents", desc: { ko: "수익귀속 생키 흐름도 · 흐름보존 다단 리본 콘솔 (자동 dash r9 승자)", en: "Revenue-attribution Sankey diagram · a flow-conserving, multi-stage ribbon console (auto dash r9 winner)" }, category: "dashboard" },
  { id: "d38", route: "/dash/d38", brand: "Wavelength", desc: { ko: "온콜 로테이션 콘솔 · 24h 레이디얼 다이얼 지배 시각화, 인시던트 대응 (자동 dash r10 승자)", en: "On-call rotation console · dominated by a 24h radial-dial visualization, built for incident response (auto dash r10 winner)" }, category: "dashboard" },
  { id: "d39", route: "/dash/d39", brand: "Palisade", desc: { ko: "역할×권한 접근제어 콘솔 · 5역할×19권한 불리언 매트릭스가 화면 주인공, 감사로그 레일 병존 (자동 dash r11 승자)", en: "Roles-and-permissions console · a 5-role × 19-permission boolean matrix owns the screen, paired with an audit-log rail (auto dash r11 winner)" }, category: "settings" },
  { id: "d40", route: "/dash/d40", brand: "Cadence", desc: { ko: "릴리스 헬스 콘솔 · DORA 지표 히어로 + 14주×7일 배포/인시던트 캘린더 히트맵, 전 셀 값 상시 표기 (자동 dash r12 승자)", en: "Release-health console · DORA hero metrics over a 14-week × 7-day deploy/incident calendar heatmap, every cell labelled with its count (auto dash r12 winner)" }, category: "dashboard" },
];

/** Static catalog (excludes evolution candidates) — shared by the gallery grid and detail routes. Each entry carries its own page-type category. */
export function catalogWorks(): Work[] {
  return [...LANDING_WORKS, ...DASH_LAB_WORKS, ...LOGIN_WORKS, ...NOTFOUND_WORKS, ...NATIVE_WORKS];
}
