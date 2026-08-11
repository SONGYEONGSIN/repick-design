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

export const LAST_UPDATED = "2026-08-12"; // determinism rule: no dynamic Date calls — update this by hand when refreshing

export const NATIVE_WORKS: Work[] = [
  { id: "n5", route: "/native-app/index.html?screen=account", brand: "Account & Preferences", desc: { en: "Account and preferences as one always-scrolling list — no fixed header, no bottom action bar — where every change is written on the spot rather than held behind a save button (auto native r2 winner).", ko: "계정·환경설정을 상시 스크롤 단일 리스트 하나로 — 고정 헤더도 하단 액션바도 없이 — 값 변경을 저장 버튼 뒤에 묶지 않고 그 자리에서 반영한다 (자동 native r2 승자)" }, target: "native", category: "mobile" },
  { id: "n1", route: "/native-app/index.html?screen=watchlist", brand: "Watchlist", desc: { en: "Saved-item watchlist · price-drop alerts and a single accent for unread, as a native mobile screen.", ko: "관심목록 · 가격 하락 알림 · 미읽음 단일 액센트 (네이티브 모바일 화면)" }, target: "native", category: "mobile" },
  { id: "n2", route: "/native-app/index.html?screen=match", brand: "AI Match", desc: { en: "AI-match results feed · ranked secondhand picks with match scores, native mobile.", ko: "AI 매칭 결과 피드 · 매칭 점수순 중고 추천 (네이티브 모바일)" }, target: "native", category: "mobile" },
  { id: "n4", route: "/native-app/index.html?screen=offer-thread", brand: "Offer Thread", desc: { en: "Buyer-seller negotiation thread \u00b7 structured offer cards inline in a chronological stream, with the payout on acceptance pinned to a persistent action bar (auto native r1 winner).", ko: "\uad6c\ub9e4\uc790\u2194\ud310\ub9e4\uc790 \ud611\uc0c1 \uc2a4\ub808\ub4dc \u00b7 \uc2dc\uac04\uc21c \ud750\ub984 \uc548\uc5d0 \uad6c\uc870\ud654\ub41c \uc624\ud37c \uce74\ub4dc\uac00 \uc11e\uc774\uace0, \uc218\ub77d \uc2dc \uc2e4\uc218\ub839\uc561\uc774 \ud558\ub2e8 \uace0\uc815 \ubc14\uc5d0 \uc0c1\uc2dc \ub178\ucd9c (\uc790\ub3d9 native r1 \uc2b9\uc790)" }, target: "native", category: "mobile" },
  { id: "n3", route: "/native-app/index.html?screen=detail", brand: "Price Detail", desc: { en: "Product price-history detail · chart + spec breakdown on a native mobile screen.", ko: "상품 가격 히스토리 상세 · 차트 + 스펙 분해 (네이티브 모바일)" }, target: "native", category: "mobile" },
];

// 0. Error — the 404 page type's first entry.
// Routed at /not-found-page, not /404: Next reserves the literal /404 path and answers it with the
// not-found handler (HTTP 404), so a page placed there is never served. Checked by request, not by
// assumption — the promoted route returned 404 on its first gate run.
export const NOTFOUND_WORKS: Work[] = [
  { id: "nf1", route: "/not-found-page", brand: "Rivet", singleScreen: true, desc: { ko: "다크 타이포그래픽 404 · 장식 없이 타이포 매스가 화면을 지배하고 복귀 경로를 한 화면에서 끝낸다 (자동 404 r1 승자)", en: "Dark typographic 404 · no ornament, a typographic mass owns the screen and every route back resolves in one viewport (auto 404 r1 winner)" }, target: "404", category: "404" },
];

// 0. Identity — the profile page type's first entry.
export const PROFILE_WORKS: Work[] = [
  { id: "pf1", route: "/profile", brand: "Solstice Macro", desc: { en: "Audited trading-strategy profile · a sticky scoreboard band holds return, win rate, copiers and live-since at every scroll depth, while period and benchmark toggles recompute the monthly bars, the delta and the cohort standing from one shared state (auto profile r2 winner).", ko: "감사받은 트레이딩 전략 프로필 · 상단 고정 스코어보드가 수익률·승률·복사자·운용 시작을 전 스크롤 깊이에서 유지하고, 기간·벤치마크 토글이 월별 막대·델타·코호트 순위를 단일 공유 상태에서 함께 재계산 (자동 profile r2 승자)" }, target: "profile", category: "profile" },
];

// 0. Editorial — the blog page type's first entry.
export const BLOG_WORKS: Work[] = [
  { id: "bl1", route: "/blog", brand: "Baseline", desc: { en: "Benchmark journal index · each entry carries its baseline, result, sample size and confidence in the index itself, and a Feed/Compare toggle swaps one filtered dataset between editorial cards and a real aria-sort table (auto blog r2 winner).", ko: "벤치마크 저널 인덱스 · 항목마다 기준값·결과·표본·신뢰도가 인덱스 자체에 실리고, Feed/Compare 토글이 같은 필터 결과를 편집형 카드와 실동작 aria-sort 테이블 사이에서 전환 (자동 blog r2 승자)" }, target: "blog", category: "blog" },
];

// 0. Inbound — the contact page type's first entry.
export const CONTACT_WORKS: Work[] = [
  { id: "ct3", route: "/contact-2", brand: "Sole Trace", desc: { en: "Contact page as an escalation ladder · every channel stays listed at every rung and the control only reorders and badges them, never filters — the r1 lesson taken one step further, that a working link still fails if a device can drop it from the DOM (auto contact r2 winner).", ko: "에스컬레이션 사다리로 짠 문의 페이지 · 모든 채널이 매 단계에 계속 실려 있고 조작은 재정렬과 배지만 할 뿐 걸러내지 않는다 — 링크가 작동해도 장치가 DOM에서 빼면 같은 결함이라는 r1 교훈의 확장 (자동 contact r2 승자)" }, target: "contact", category: "contact" },
  { id: "ct2", route: "/contact", brand: "Tessera", desc: { en: "Reconciliation platform's contact desk built to answer before it routes · one triage field returns a single routing slip whose whole shape changes with the verdict, while four desks keep their addresses, median first reply and staffed hours printed above it with nothing behind a click (auto contact r1 winner).", ko: "정산 대조 플랫폼의 문의 창구 · 트리아지 입력 한 칸이 판정 종류에 따라 골격 자체가 바뀌는 단일 라우팅 슬립을 돌려주고, 그 위로 네 창구의 주소·중앙값 응답·근무시간이 무조작 상태로 상시 노출된다 (자동 contact r1 승자)" }, target: "contact", category: "contact" },
];

// 0. API entry — the developers page type's first entry.
export const DEVELOPERS_WORKS: Work[] = [
  { id: "dv1", route: "/developers", brand: "Bollard", desc: { en: "Shipping-rate API entry written as a transcript of one executed session · three chained calls sit on the page as request and response pairs from the first screen, and every returned line carries a gutter tag naming the parameter that produced it (auto developers r1 winner).", ko: "실행된 세션의 기록으로 쓴 배송요율 API 입구 · 연쇄된 세 호출이 첫 화면부터 요청·응답 쌍으로 놓이고, 응답의 모든 줄이 자신을 만든 파라미터를 거터 태그로 밝힌다 (자동 developers r1 승자)" }, target: "developers", category: "developers" },
];

// 0. Connection — the integration page type's first entry.
export const INTEGRATION_WORKS: Work[] = [
  { id: "ig1", route: "/integration", brand: "Kestrel", desc: { en: "A two-way HubSpot sync seen from the day it broke · four self-contained strata (field policy, run ledger, conflict precedence, human queue) where one incident leaves its trace in three of them, and six fields state in the same table why they will never cross (auto integration r1 winner).", ko: "사고 난 날의 관점에서 본 HubSpot 양방향 동기화 · 자기완결 4지층(필드 정책·실행 원장·충돌 우선순위·사람 대기 큐)에서 한 사건이 셋에 흔적을 남기고, 여섯 필드가 같은 표 안에서 넘어가지 않는 이유를 말한다 (자동 integration r1 승자)" }, target: "integration", category: "integration" },
];

// 0. Press — the media-kit page type's first entry.
export const MEDIA_KIT_WORKS: Work[] = [
  { id: "mk1", route: "/media-kit", brand: "Tolvan", desc: { en: "Press record that puts the facts a reporter cannot get wrong ahead of the logo · twelve of them printed with a verification date and the named person who confirms each, and one control that changes only the shape a fact arrives in — plain, Markdown or BibTeX (auto media-kit r1 winner).", ko: "로고보다 틀리면 안 되는 사실을 앞세운 프레스 레코드 · 열두 가지가 검증일과 확인자 실명을 달고 인쇄되며, 유일한 조작은 사실이 도착하는 형태만 바꾼다 — 평문·마크다운·BibTeX (자동 media-kit r1 승자)" }, target: "media-kit", category: "media-kit" },
];

// 0. Company — the about page type's first entry.
export const ABOUT_WORKS: Work[] = [
  { id: "ab1", route: "/about", brand: "Ordinal", desc: { en: "Company page built as two switchable structures · the People tree re-forms around discipline or region as independent axes rather than one fixed org chart, and Values run as master-detail so each principle opens its own evidence (auto about r3 winner).", ko: "전환 가능한 두 구조로 짠 회사 소개 · People 트리가 고정 조직도가 아니라 직군·지역을 독립 축으로 재편되고, Values는 마스터-디테일로 원칙마다 근거를 연다 (자동 about r3 승자)" }, target: "about", category: "about" },
];

// 0. Hiring — the careers page type. Three independent restarts, each forbidden the others' forms.
export const CAREERS_WORKS: Work[] = [
  { id: "cr1", route: "/careers", brand: "Fathom Labs", desc: { en: "Hiring page led by a culture manifesto · chip filters narrow an always-open role list with no click required to read a title, and selection opens a focus-trapped detail drawer (auto careers r1 winner, unanimous 3-0).", ko: "컬처 매니페스토가 앞서는 채용 페이지 · 칩 필터가 상시 노출된 공고 리스트를 좁히고(제목을 읽는 데 클릭이 필요 없다), 선택 시 포커스 트랩 드로어가 열린다 (자동 careers r1 승자, 3-0 만장일치)" }, target: "careers", category: "careers" },
  { id: "cr2", route: "/careers-2", brand: "Talus", desc: { en: "Hiring page as a faceted search · checkbox facets and a level range slider narrow the same set together, and each role card carries its own inline disclosure so the list never navigates away (auto careers r2 winner).", ko: "다면 검색으로 짠 채용 페이지 · 체크박스 패싯과 레벨 range 슬라이더가 같은 집합을 함께 좁히고, 공고 카드마다 인라인 디스클로저가 있어 목록을 떠나지 않는다 (자동 careers r2 승자)" }, target: "careers", category: "careers" },
  { id: "cr3", route: "/careers-3", brand: "Isoline", desc: { en: "Hiring page pivoted on place · an office and region tablist is the primary axis, and each tab carries a timezone-overlap bar chart so the question of where also answers when we would actually overlap (auto careers r3 winner).", ko: "장소를 주축으로 둔 채용 페이지 · 오피스·지역 탭리스트가 1차 축이고, 탭마다 타임존 겹침 막대차트가 붙어 어디서 일하는가가 곧 몇 시에 겹치는가를 답한다 (자동 careers r3 승자)" }, target: "careers", category: "careers" },
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
  { id: "d41", route: "/commissioned/hopline", brand: "Hopline", desc: { en: "Short-link analytics read as a to-do list rather than a scoreboard \u00b7 three prescription cards derive from the hero series and the audience panels, and each one can pin a vertical marker onto that series so the reader sees which number it points at, with a KO/EN switch that swaps every string (commissioned, reference-informed).", ko: "\uc810\uc218\ud310\uc774 \uc544\ub2c8\ub77c \ud560 \uc77c \ubaa9\ub85d\uc73c\ub85c \uc77d\ud788\ub294 \ub2e8\ucd95\ub9c1\ud06c \ubd84\uc11d \u00b7 \ucc98\ubc29 \uce74\ub4dc \uc14b\uc774 \ud788\uc5b4\ub85c \uc2dc\uacc4\uc5f4\uacfc \uc624\ub514\uc5b8\uc2a4 \ud328\ub110\uc5d0\uc11c \ud30c\uc0dd\ub418\uace0, \uac01 \uce74\ub4dc\uac00 \uadf8 \uc2dc\uacc4\uc5f4\uc5d0 \uc218\uc9c1 \ub9c8\ucee4\ub97c \uaf42\uc544 \uc5b4\ub290 \uc22b\uc790\ub97c \uac00\ub9ac\ud0a4\ub294\uc9c0 \ubcf4\uc5ec\uc900\ub2e4 \u00b7 \ud55c/\uc601 \uc804\ud658 (\uc8fc\ubb38 \uc81c\uc791, \ub808\ud37c\ub7f0\uc2a4 \ucc38\uc870)" }, target: "dashboard", category: "dashboard" },
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
  return [...LANDING_WORKS, ...DASH_LAB_WORKS, ...LOGIN_WORKS, ...NOTFOUND_WORKS, ...CATALOG_WORKS, ...SCENE_WORKS, ...PRODUCT_DETAIL_WORKS, ...PAYWALL_WORKS, ...PROFILE_WORKS, ...BLOG_WORKS, ...ABOUT_WORKS, ...CAREERS_WORKS, ...CONTACT_WORKS, ...DEVELOPERS_WORKS, ...INTEGRATION_WORKS, ...MEDIA_KIT_WORKS, ...NATIVE_WORKS];
}
