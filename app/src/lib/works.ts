// app/src/lib/works.ts — single source of truth for all work metadata (shared by the unified gallery + individual galleries)
/**
 * Every page type, **in generation priority order** — this array is both the category union and the
 * autonomous round's queue. `/dash-evolve` walks it and takes the first type with no work yet, so
 * adding a type here is all it takes to put it in the rotation.
 *
 * Order is by structural distance from what the catalogue already holds: the types that force the
 * most different page shape come first. `scene` sits after `catalog` deliberately — catalog is the
 * gentler version of scroll choreography, and the deltas it produces are what scene builds on.
 */
export const PAGE_TYPES = [
  "dashboard", "settings", "landing", "login", "404",
  "catalog", "scene", "product-detail", "paywall", "profile",
  "blog", "about", "careers", "contact", "developers",
  "integration", "media-kit", "mobile",
] as const;

export type PageType = (typeof PAGE_TYPES)[number];

export type Work = {
  id: string;
  route: string;
  brand: string;
  desc: { en: string; ko: string }; // card tagline (bilingual)
  previewH?: number; // card preview height (px), default 300
  /**
   * This work fills exactly one screen (login, 404) rather than scrolling.
   *
   * Such a page must be previewed at a viewport whose *aspect* matches the card, or two things go
   * wrong: rendered inside the tall capture height its `100vh` resolves to 2400 and vertically
   * centred content lands ~1200px down, off the bottom of the frame (measured on the 404 promotion:
   * h1 at y=1217 against a ~1275px window); and a fixed viewport height leaves the card shorter than
   * its neighbours. The card derives the viewport from its own box, so one screen fills the standard
   * preview height exactly.
   */
  singleScreen?: boolean;
  /**
   * This page lays its *sections* out in viewport units (`min-h-dvh` + centred content), so its
   * layout depends on how tall the viewport is.
   *
   * The preview normally fakes scrolling by rendering the page into a 2400px-tall iframe and sliding
   * a window over it. That works only for viewport-independent layouts: give a `min-h-dvh` section a
   * 2400px viewport and it becomes 2400px tall, so its vertically centred content lands ~1200px down
   * and the card's window shows the empty top of it. Measured on the scene promotion — the card was
   * ~500px of black with the headline clipped at the bottom edge.
   *
   * Such a work is previewed at a viewport whose aspect matches the card box (as `singleScreen` is),
   * and gets its scroll-through by actually scrolling the iframe's document — which is also what
   * makes its scroll-linked reveals fire in the right order rather than all at once.
   */
  viewportPreview?: boolean;
  status?: "winner" | "dropped" | "pending";
  round?: string;
  /**
   * Which round produced this work. Derived from `PageType` rather than spelled out, so promoting a
   * new page type never needs this union widened by hand — that list drifted from `PAGE_TYPES` once
   * already. `dash` and `native` are the two legacy round names that predate the taxonomy and have
   * no matching page type ("dashboard" and "mobile" respectively).
   */
  target?: PageType | "dash" | "native";
  date?: string;
  /**
   * Gallery page-type category (refero-style axis: what kind of page is this, not what domain it
   * serves). Derived from `PAGE_TYPES` so the union and the generation queue can never drift —
   * they used to be two lists, and the queue's hardcoded four meant the loop stopped filling new
   * types after `catalog` and `scene` and silently fell back to the three it already had.
   *
   * Domain information (ops / finance / analytics …) lives in each work's `desc`, not in a second
   * axis. The gallery only renders a filter chip for types that actually have works, so unfilled
   * types stay invisible.
   */
  category?: PageType;
};

export const LAST_UPDATED = "2026-08-04"; // determinism rule: no dynamic Date calls — update this by hand when refreshing

export const NATIVE_WORKS: Work[] = [
  { id: "n1", route: "/native-app/index.html?screen=watchlist", brand: "Watchlist", desc: { en: "Saved-item watchlist · price-drop alerts and a single accent for unread, as a native mobile screen.", ko: "관심목록 · 가격 하락 알림 · 미읽음 단일 액센트 (네이티브 모바일 화면)" }, target: "native", category: "mobile" },
  { id: "n2", route: "/native-app/index.html?screen=match", brand: "AI Match", desc: { en: "AI-match results feed · ranked secondhand picks with match scores, native mobile.", ko: "AI 매칭 결과 피드 · 매칭 점수순 중고 추천 (네이티브 모바일)" }, target: "native", category: "mobile" },
  { id: "n4", route: "/native-app/index.html?screen=offer-thread", brand: "Offer Thread", desc: { en: "Buyer-seller negotiation thread \u00b7 structured offer cards inline in a chronological stream, with the payout on acceptance pinned to a persistent action bar (auto native r1 winner).", ko: "\uad6c\ub9e4\uc790\u2194\ud310\ub9e4\uc790 \ud611\uc0c1 \uc2a4\ub808\ub4dc \u00b7 \uc2dc\uac04\uc21c \ud750\ub984 \uc548\uc5d0 \uad6c\uc870\ud654\ub41c \uc624\ud37c \uce74\ub4dc\uac00 \uc11e\uc774\uace0, \uc218\ub77d \uc2dc \uc2e4\uc218\ub839\uc561\uc774 \ud558\ub2e8 \uace0\uc815 \ubc14\uc5d0 \uc0c1\uc2dc \ub178\ucd9c (\uc790\ub3d9 native r1 \uc2b9\uc790)" }, target: "native", category: "mobile", previewH: 520 },
  { id: "n3", route: "/native-app/index.html?screen=detail", brand: "Price Detail", desc: { en: "Product price-history detail · chart + spec breakdown on a native mobile screen.", ko: "상품 가격 히스토리 상세 · 차트 + 스펙 분해 (네이티브 모바일)" }, target: "native", category: "mobile" },
];

// 0. Error — the 404 page type's first entry.
// Routed at /not-found-page, not /404: Next reserves the literal /404 path and answers it with the
// not-found handler (HTTP 404), so a page placed there is never served. Checked by request, not by
// assumption — the promoted route returned 404 on its first gate run.
export const NOTFOUND_WORKS: Work[] = [
  { id: "nf1", route: "/not-found-page", brand: "Rivet", singleScreen: true, desc: { ko: "다크 타이포그래픽 404 · 장식 없이 타이포 매스가 화면을 지배하고 복귀 경로를 한 화면에서 끝낸다 (자동 404 r1 승자)", en: "Dark typographic 404 · no ornament, a typographic mass owns the screen and every route back resolves in one viewport (auto 404 r1 winner)" }, target: "404", category: "404" },
];

// 0. Commerce — the product-detail page type's first entry.
export const PRODUCT_DETAIL_WORKS: Work[] = [
  { id: "pd1", route: "/product-detail", brand: "Anvil TKL-75", desc: { en: "Certified-refurbished mechanical keyboard SKU · a configuration console where condition grade and switch feel recompute feel, fulfillment, specification and order total together, with price and buy button held in both the hero and the sticky header (auto product-detail r2 winner).", ko: "인증 리퍼비시 기계식 키보드 SKU · 컨디션 등급과 스위치 선택이 감각·이행·스펙·총액을 동시에 재계산하고, 가격과 구매 버튼이 히어로와 고정 헤더 양쪽에 상주 (자동 product-detail r2 승자)" }, target: "product-detail", category: "product-detail" },
];

// 0. Monetization — the paywall page type's first entry.
export const PAYWALL_WORKS: Work[] = [
  { id: "pw1", route: "/paywall", brand: "Fathomline", desc: { en: "Analytics usage paywall · a split of what stopped and when (daily event bars break at the cap) against the fix, where one lifted calculation drives the recommended plan, the price and every CTA (auto paywall r2 winner).", ko: "분석 사용량 페이월 · 왼쪽은 무엇이 언제 멈췄는가(일별 막대가 상한 지점에서 갈라진다), 오른쪽은 해법 · 단일 계산 상태가 추천 플랜·가격·전 CTA를 동시에 구동 (자동 paywall r2 승자)" }, target: "paywall", category: "paywall" },
];

// 0. Commerce/browse — the catalog page type's first entry.
export const CATALOG_WORKS: Work[] = [
  { id: "ct1", route: "/catalog", brand: "Loopwire", desc: { ko: "워크플로 자동화 플랫폼의 연동 마켓플레이스 · 좌측 필터 레일이 카테고리·요금제·평점을 상시 노출하고 우측 밀집 그리드가 즉시 좁혀진다, 카드 선택 시 상세 드로어 (자동 catalog r1 승자)", en: "A workflow-automation platform's integrations marketplace · a left filter rail keeps category, pricing and rating permanently visible while the dense result grid narrows in place, with a detail drawer on selection (auto catalog r1 winner)" }, target: "catalog", category: "catalog" },
];

// 0. Scene — the scene page type's first entry.
export const SCENE_WORKS: Work[] = [
  { id: "sc1", route: "/scene", brand: "KEPT", viewportPreview: true, desc: { ko: "스크롤이 장면을 구동하는 페이지 · 고정 WebGL2 파티클 한 층이 문서 전체를 지고 먼지→궤도→스니커→워드마크로 4단계 변형한다 (자동 scene r1 승자)", en: "A page where scroll drives one scene · a single fixed WebGL2 particle layer carries the whole document, morphing through dust, orbits, a sneaker and the wordmark (auto scene r1 winner)" }, target: "scene", category: "scene" },
];

// 0. Auth — the login page type's first entry.
export const LOGIN_WORKS: Work[] = [
  { id: "lg1", route: "/login", brand: "Contour", singleScreen: true, desc: { ko: "관측성 SaaS 로그인 · 좌측 컨투어 지형선 + 스파크라인 스탯의 다크 비주얼 패널과 우측 라이트 폼 스플릿, 세그먼트 토글로 로그인/가입 전환 (자동 login r1 승자)", en: "Observability-SaaS sign-in · a split of dark contour-line visual panel with sparkline stats against a light form column, with a segmented toggle between sign-in and sign-up (auto login r1 winner)" }, target: "login", category: "login" },
];

// I. Landing — champion + evolution lineage v6~v10. (/lab is itself an index page, not a work — excluded)
export const LANDING_WORKS: Work[] = [
  { id: "v0", route: "/", brand: "Attune", desc: { ko: "현재 프로덕션 랜딩 · 에디토리얼 스플릿 히어로 + 제품 쇼케이스 (자동 라운드 R7 계보 승자)", en: "Live production landing · editorial split hero + product showcase (auto-round R7 lineage winner)" }, category: "landing" },
  { id: "v6", route: "/v6", brand: "Threshold", desc: { ko: "비포/애프터 드래그 리빌 히어로 · 실제 제품사진 슬라이더(role=slider)·스프링 물리, 감각 축 차별 (자동 landing r2 승자)", en: "Before/after drag-to-reveal hero · a real product-photo slider (role=slider) with spring physics, differentiating on tactile feel (auto landing r2 winner)" }, category: "landing" },
  { id: "v7", route: "/v7", brand: "Tally", desc: { ko: "AI 매칭 대조표 히어로 · 실 table+탭+아코디언 비교 위젯, 폼 계열 최초 표 기반 (자동 landing r4 승자)", en: "AI-match comparison-table hero · a real table + tabs + accordion widget, the form lineage's first table-based entry (auto landing r4 winner)" }, category: "landing" },
  { id: "v8", route: "/v8", brand: "Sundial", desc: { ko: "매칭 정확도 다이얼 히어로 · 원형 SVG 게이지 결과 시각화, 형태 신규성 (자동 landing r5 승자)", en: "Match-accuracy dial hero · a circular SVG gauge visualizes the result, a formal novelty (auto landing r5 winner)" }, category: "landing" },
  { id: "v9", route: "/v9", brand: "Loupe", desc: { ko: "AI 주석 스캔 히어로 · 실제 제품 사진 위 포커스 가능한 5개 주석 핀이 검사 항목을 순차 공개 (자동 landing r7 승자)", en: "AI annotation-scan hero · five focusable pins placed directly on a real product photo reveal what the AI inspected, one finding at a time (auto landing r7 winner)" }, category: "landing" },
  { id: "v10", route: "/v10", brand: "Lattice", desc: { ko: "선호↔매물 관계 그래프 히어로 · 노드 선택 시 근거 문장·강도 막대·강조 매물까지 네 증거면이 동시 재계산 (자동 landing r8 승자)", en: "Preference-to-product graph hero · selecting a signal recomputes four proof surfaces at once — reasoning, strength bars, and the highlighted match (auto landing r8 winner)" }, category: "landing" },
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
  return [...LANDING_WORKS, ...DASH_LAB_WORKS, ...LOGIN_WORKS, ...NOTFOUND_WORKS, ...CATALOG_WORKS, ...SCENE_WORKS, ...PRODUCT_DETAIL_WORKS, ...PAYWALL_WORKS, ...NATIVE_WORKS];
}
