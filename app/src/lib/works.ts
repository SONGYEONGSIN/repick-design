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

export const LAST_UPDATED = "2026-08-29"; // determinism rule: no dynamic Date calls — update this by hand when refreshing

export const NATIVE_WORKS: Work[] = [
  { id: "n18", route: "/native-app/index.html?screen=wallet", brand: "Wallet & Transaction History", desc: { en: "A read-only ledger — the balance stays visible and the transaction list filters in place, with deposits and withdrawals separated by sign and type label rather than by colour (auto-native-r14 winner, decided by tie-break from a three-way draw).", ko: "읽기 전용 원장 — 잔액이 상시 노출되고 거래 목록이 제자리에서 필터된다. 입금과 출금은 색이 아니라 부호와 타입 라벨로 갈린다 (auto-native-r14 승자, 3파전 동률을 타이브레이크로 확정)" }, target: "native", category: "mobile" },
  { id: "n19", route: "/native-app/index.html?screen=storefront", brand: "Seller Storefront", desc: { en: "A public seller profile — reputation stats, completed verification badges (not in-progress ones) and a sortable listing grid under a standing action bar, with the read-only judgement written into the file header (auto-native-r15 winner, decided by tie-break from a three-way draw).", ko: "판매자 공개 프로필 — 평판 통계·완료된 인증 배지(진행형 아님)·정렬 가능한 매물 그리드가 상시 액션바 아래 놓인다. 읽기 전용 화면이라는 판정을 파일 헤더에 적고 실행했다 (auto-native-r15 승자, 3파전 동률을 타이브레이크로 확정)" }, target: "native", category: "mobile" },
  { id: "n16", route: "/native-app/index.html?screen=certificate", brand: "Authentication Certificate", desc: { en: "A completed record, so the bottom band is a standing action bar rather than a state machine — there is no blocked step left to explain, and Share or Download each announce a real result through the one live region (auto-native-r12 winner, 2-1).", ko: "이미 끝난 기록이라 하단 밴드가 상태기계가 아니라 상시 액션바다 — 설명할 막힌 지점이 없고, Share·Download 는 각각 실제 결과를 내며 그것을 하나의 라이브 리전이 낭독한다 (auto-native-r12 승자, 2-1)" }, target: "native", category: "mobile" },
  { id: "n17", route: "/native-app/index.html?screen=payout", brand: "Payout & Withdraw", desc: { en: "Destructive confirmation without a separate alert — the state-machine band turns itself into a Cancel/Confirm row, so the confirmation happens inside the container already wired for live-region announcement (auto-native-r13 winner, decided by tie-break from a three-way draw).", ko: "별도 Alert 없는 파괴적 확인 — 상태기계 밴드가 스스로 Cancel/Confirm 두 버튼 행으로 바뀌어, 이미 라이브 리전이 걸린 컨테이너 안에서 확인까지 끝난다 (auto-native-r13 승자, 3파전 동률을 타이브레이크로 확정)" }, target: "native", category: "mobile" },
  { id: "n8", route: "/native-app/index.html?screen=listing", brand: "Create Listing", desc: { en: "A four-step seller wizard where the fixed bottom band is a state machine, not a button — it names what is still missing, jumps to that step, and only then offers Publish, with step changes announced through an alert role and a polite live region (auto native r5 winner).", ko: "4단계 판매 등록 위저드 — 하단 고정 밴드가 버튼이 아니라 상태기계다. 무엇이 아직 비었는지 말하고 그 스텝으로 이동시킨 뒤에야 발행을 내주며, 스텝 전환은 alert 역할과 polite 라이브 리전으로 읽힌다 (자동 native r5 승자)" }, target: "native", category: "mobile" },
  { id: "n12", route: "/native-app/index.html?screen=review", brand: "Write a Review", desc: { en: "Review composition as three inputs that build one argument — a star rating, tag chips and free text — where the tags a buyer picks are printed back into the summary so the score is never left as a bare number (auto native r8 winner, 2-1).", ko: "리뷰 작성을 하나의 논증을 쌓는 세 입력으로 — 별점·태그 칩·자유 텍스트 — 고른 태그가 요약에 그대로 인쇄돼 점수가 맨숫자로 남지 않는다 (자동 native r8 승자, 2-1)" }, target: "native", category: "mobile" },
  { id: "n15", route: "/native-app/index.html?screen=membership", brand: "Membership Tiers", desc: { en: "Membership priced against a break-even ruler rather than a comparison table — the three tiers divide one volume axis into the stretches each of them wins, your position is a marker on it, and the argument is a sentence with your own number in it rather than a column of features (auto native r11 winner, 2-1).", ko: "비교표가 아니라 손익분기 자 위에 놓인 멤버십 — 세 등급이 하나의 거래량 축을 각자 이기는 구간으로 가르고, 내 위치가 그 위 마커이며, 논증은 기능 열거가 아니라 내 숫자가 들어간 문장이다 (자동 native r11 승자, 2-1)" }, target: "native", category: "mobile" },
  { id: "n14", route: "/native-app/index.html?screen=chat", brand: "Chat Inbox", desc: { en: "A conversation index rather than a thread — N counterparties in one list, no fixed band, with archive reachable two ways (a swipe whose backdrop is hidden from the accessibility tree, and an always-visible More button that carries the same action) and unread carried by three signals rather than colour alone (auto native r10 winner, 2-1).", ko: "스레드가 아니라 대화 인덱스 — 여러 상대가 한 목록에 있고 고정 밴드가 없다. 보관은 두 경로로 닿는다 (스와이프 배경은 접근성 트리에서 숨기고, 상시 보이는 More 버튼이 같은 동작을 진다). 안읽음은 색 하나가 아니라 3중 신호로 (자동 native r10 승자, 2-1)" }, target: "native", category: "mobile" },
  { id: "n13", route: "/native-app/index.html?screen=meetup-time", brand: "Meetup Slot Grid", desc: { en: "Finding a time as a five-day by four-band availability matrix, where each cell encodes both calendars as a two-bar glyph rather than colour alone — and a slot only the other party has opened can be turned into a match on the spot, with no fixed bottom chrome anywhere (auto native r9 winner, 3-0).", ko: "만날 시간 잡기를 5일 × 4시간대 가용성 격자로 — 각 칸이 두 사람의 달력을 색이 아니라 2줄 막대 글리프로 인코딩하고, 상대만 열어 둔 칸은 그 자리에서 겹침으로 바꿀 수 있다 · 고정 하단 크롬이 어디에도 없다 (자동 native r9 승자, 3-0)" }, target: "native", category: "mobile" },
  { id: "n11", route: "/native-app/index.html?screen=disputes", brand: "Disputes & Returns", desc: { en: "Open and past disputes as expandable timeline cards, with a new return built only against the one order still inside its window — the flow refuses to start a request it knows will be rejected rather than collecting one and failing at submit (auto native r7 winner, 2-1).", ko: "진행·완료된 분쟁을 펼침 타임라인 카드로 두고, 새 반품은 아직 기간이 남은 주문 하나에 대해서만 만들게 한다 — 거절될 걸 아는 요청을 다 받아 놓고 제출에서 막는 대신 시작 자체를 거절한다 (자동 native r7 승자, 2-1)" }, target: "native", category: "mobile" },
  { id: "n10", route: "/native-app/index.html?screen=verification", brand: "Seller Verification", desc: { en: "Identity and payout verification as an accordion state machine — each step states what is still missing, the bottom band refuses to submit until it can name nothing, and every step change is announced through an alert role and a polite live region (auto native r6 winner, 3-0).", ko: "본인확인과 정산계좌 등록을 아코디언 상태기계로 — 각 단계가 무엇이 남았는지 말하고, 하단 밴드는 더 말할 게 없어질 때까지 제출을 내주지 않으며, 단계 전환은 alert 역할과 polite 라이브 리전으로 읽힌다 (자동 native r6 승자, 3-0)" }, target: "native", category: "mobile" },
  { id: "n9", route: "/native-app/index.html?screen=order-status", brand: "Order Status", desc: { en: "A post-purchase status timeline whose chrome appears only when it has work to do — no fixed band while browsing the four ordered steps, then a Confirm receipt band once Delivered is reached (auto native r5, kept as the only artefact of the dynamic-chrome hypothesis).", ko: "구매 후 상태 타임라인 — 크롬이 할 일이 있을 때만 나타난다. 네 단계를 훑는 동안은 고정 밴드가 없다가, 배송완료에 도달하면 수령 확인 밴드가 선다 (자동 native r5, 동적 크롬 가설의 유일한 실물로 킵)" }, target: "native", category: "mobile" },
  { id: "n7", route: "/native-app/index.html?screen=notifications", brand: "Notifications", desc: { en: "Activity feed with no fixed band at all — filter chips wrap instead of scrolling sideways, unread carries three signals rather than colour alone, and type badges are two-letter monograms so the row reads without hue (auto native r4 winner).", ko: "고정 밴드가 아예 없는 활동 피드 — 필터 칩은 가로 스크롤 대신 줄바꿈으로, 안읽음은 색 하나가 아니라 3중 신호로, 타입 배지는 2글자 모노그램으로 읽힌다 (자동 native r4 승자)" }, target: "native", category: "mobile" },
  { id: "n6", route: "/native-app/index.html?screen=handoff", brand: "Handoff Check", desc: { en: "The moment money changes hands in person — six lines to check the item against its listing, where the bottom band is a state machine rather than a button: it says what is still open, jumps to the next unanswered line, and refuses to price a mismatch that no discount can fix (auto native r3 winner, 3-0).", ko: "돈이 손을 바꾸는 그 순간 — 눈앞의 물건을 리스팅과 6줄로 대조하고, 하단 밴드는 버튼이 아니라 상태기계다 — 무엇이 남았는지 말하고, 다음 미답 항목으로 이동시키며, 할인으로 못 메우는 불일치는 값을 매기기를 거부한다 (자동 native r3 승자, 3-0)" }, target: "native", category: "mobile" },
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
  { id: "v19", route: "/v19", brand: "AI Redline", desc: { en: "The proof is a tracked-changes document — strikethroughs and insertions show what the AI corrected in a listing, with the headline, the category filter, a live confidence score and fully tagged listing cards all inside the hero component itself, visible without scrolling.", ko: "증명이 교정본이다 — 취소선과 삽입 텍스트로 AI 가 매물 설명에서 무엇을 고쳤는지 보이고, 헤드라인·카테고리 필터·실시간 신뢰도 점수·완전 태깅된 매물 카드가 전부 히어로 컴포넌트 안에서 스크롤 없이 보인다 (자동 landing r16 승자, 2:1)" }, target: "landing", category: "landing" },
  { id: "v17", route: "/v17", brand: "Negotiation", desc: { en: "The proof is a conversation, not a chart — one deterministic engine derives a full multi-turn negotiation, the settled price and the no-deal branch from the price ceiling and bargaining style, so every control setting produces a transcript that actually reflects it, and the closing CTA quotes the same derived outcome.", ko: "증명이 차트가 아니라 대화다 — 결정론 엔진 하나가 가격 상한과 협상 스타일로부터 다중 턴 협상·합의가·결렬 분기까지 전부 파생시켜, 어떤 설정에서도 대화 내용이 실제로 그 입력을 반영한다. 클로징 CTA 도 같은 파생값을 인용한다 (자동 landing r15 승자, 2-1)" }, target: "landing", category: "landing" },
  { id: "v14", route: "/v14", brand: "Trace", desc: { en: "A vertical process timeline where scrolling is the argument — the SVG path draws itself against scroll progress, and the payout calculator at the end shares the same settle() function as the timeline steps, so the number you land on is the one the story just walked you through. Two accents split by whose claim it is: what the seller submitted against what the check found (auto landing r12 winner, 2-1).", ko: "스크롤이 곧 논증인 수직 프로세스 타임라인 — SVG 패스가 스크롤 진행에 맞춰 스스로 그려지고, 끝의 정산 계산기가 타임라인 단계와 같은 settle() 함수를 공유해 도착하는 숫자가 방금 걸어온 이야기의 결과가 된다. 두 액센트는 누구의 주장인가로 갈린다 — 셀러가 제출한 값 대 검수가 찾은 값 (자동 landing r12 승자, 2-1)" }, target: "landing", category: "landing" },
  { id: "v16", route: "/v16", brand: "Price Band", desc: { en: "A seller-side appraisal where the answer is a range and the width of that range is the admission of what is not yet known — every trait you confirm takes width out of it, and twelve completed sales sit on the same axis so a band that has drifted off the market says so by how few of them it still contains (auto landing r14 winner, 2-1).", ko: "답이 숫자가 아니라 구간이고, 그 구간의 폭이 곧 아직 모르는 것의 크기인 판매자 관점 감정 — 형질을 하나 확인할 때마다 폭이 깎이고, 실거래 12건이 같은 축에 꽂혀 있어 시세에서 벗어난 밴드는 그 안에 몇 건이 남았는지로 스스로 그것을 말한다 (자동 landing r14 승자, 2-1)" }, target: "landing", category: "landing" },
  { id: "v15", route: "/v15", brand: "Spec Grid", desc: { en: "A budget slider that moves five proof surfaces at once — the spec grid, the sparkline, the match figures, the ranking and the reasoning sentence all recompute from one control, so the page demonstrates its matching rather than describing it (auto landing r13 winner, 2-1).", ko: "예산 슬라이더 하나가 다섯 증거면을 동시에 움직인다 — 스펙 그리드·스파크라인·매치 수치·랭킹·근거 문장이 한 컨트롤에서 전부 재계산돼, 페이지가 매칭을 설명하는 대신 시연한다 (자동 landing r13 승자, 2-1)" }, target: "landing", category: "landing" },
  { id: "v13", route: "/v13", brand: "Running Ledger", desc: { en: "A settled ledger rather than a promise — the total sits in the first fold and scrolling breaks it into evidence, line by line, while a per-row \"I would have caught this\" toggle lets a sceptic write off their own claims and watch what survives (auto landing r11 winner, 2-1).", ko: "약속이 아니라 결산이 끝난 장부 — 총액이 첫 화면에 있고 스크롤이 그 총액을 항목별 증빙으로 분해한다 · 행마다 붙은 \"나라면 잡았다\" 토글로 회의적인 방문자가 자기 안목만큼 상각해 보고, 그러고도 남는 금액을 본다 (자동 landing r11 승자, 2-1)" }, target: "landing", category: "landing" },
  { id: "v12", route: "/v12", brand: "Layer Inspector", desc: { en: "Three AI inspection layers over one real product photo — toggling condition, authenticity or price fairness recomputes the verdict badge, the confidence bar and the highlighted region on the photo at once, above four spec-sheet listing cards already in the first fold (auto landing r10 winner, decided by tie-break from a three-way draw).", ko: "실제 제품 사진 위 3개 AI 검사 레이어 — 컨디션·진품·가격 공정성을 토글하면 판정 배지·신뢰도 바·사진 위 하이라이트가 한꺼번에 재계산되고, 그 아래 스펙시트형 매물 카드 4장이 첫 폴드에 있다 (자동 landing r10 승자, 3파전 동률을 타이브레이크로 확정)" }, target: "landing", category: "landing" },
  { id: "v11", route: "/v11", brand: "Ranked", desc: { en: "Order is the model — five ranking criteria sit in a list whose positions are the weights, and moving one recomputes the listing order, each card's contribution bars, the plain-English summary and the leader's reasoning at once, with the product cards already in the first fold (auto landing r9 winner).", ko: "순서가 곧 모델 — 5개 평가 기준의 순위가 그대로 가중치가 되고, 한 칸 올리면 매물 랭킹·기여도 막대·요약 문장·1위 근거가 한꺼번에 재계산된다 · 제품 카드가 첫 폴드에 있다 (자동 landing r9 승자)" }, target: "landing", category: "landing" },
  { id: "v18", route: "/v18", brand: "Attune", desc: { ko: "에디토리얼 스플릿 히어로 + 제품 쇼케이스 · 2026-08-27 이전까지 `/` 를 차지하고 있던 랜딩 (자동 라운드 R7 계보 승자)", en: "Editorial split hero + product showcase · the landing that occupied `/` until 2026-08-27, when the gallery took the front door back (auto-round R7 lineage winner)" }, target: "landing", category: "landing" },
  { id: "v6", route: "/v6", brand: "Threshold", desc: { ko: "비포/애프터 드래그 리빌 히어로 · 실제 제품사진 슬라이더(role=slider)·스프링 물리, 감각 축 차별 (자동 landing r2 승자)", en: "Before/after drag-to-reveal hero · a real product-photo slider (role=slider) with spring physics, differentiating on tactile feel (auto landing r2 winner)" }, category: "landing" },
  { id: "v7", route: "/v7", brand: "Tally", desc: { ko: "AI 매칭 대조표 히어로 · 실 table+탭+아코디언 비교 위젯, 폼 계열 최초 표 기반 (자동 landing r4 승자)", en: "AI-match comparison-table hero · a real table + tabs + accordion widget, the form lineage's first table-based entry (auto landing r4 winner)" }, category: "landing" },
  { id: "v8", route: "/v8", brand: "Sundial", desc: { ko: "매칭 정확도 다이얼 히어로 · 원형 SVG 게이지 결과 시각화, 형태 신규성 (자동 landing r5 승자)", en: "Match-accuracy dial hero · a circular SVG gauge visualizes the result, a formal novelty (auto landing r5 winner)" }, category: "landing" },
  { id: "v9", route: "/v9", brand: "Loupe", desc: { ko: "AI 주석 스캔 히어로 · 실제 제품 사진 위 포커스 가능한 5개 주석 핀이 검사 항목을 순차 공개 (자동 landing r7 승자)", en: "AI annotation-scan hero · five focusable pins placed directly on a real product photo reveal what the AI inspected, one finding at a time (auto landing r7 winner)" }, category: "landing" },
  { id: "v10", route: "/v10", brand: "Lattice", desc: { ko: "선호↔매물 관계 그래프 히어로 · 노드 선택 시 근거 문장·강도 막대·강조 매물까지 네 증거면이 동시 재계산 (자동 landing r8 승자)", en: "Preference-to-product graph hero · selecting a signal recomputes four proof surfaces at once — reasoning, strength bars, and the highlighted match (auto landing r8 winner)" }, category: "landing" },
];

// II. SaaS dashboards — 12 works in the /dash gallery (d29~d40) + baseline/product
export const DASH_LAB_WORKS: Work[] = [
  { id: "d50", route: "/dash/d50", brand: "Cadence", desc: { en: "A roadmap gantt where selection deliberately does not propagate everywhere — pinning a row recomputes the KPI summary only and leaves the ledger table untouched by design, while hovering a bar opens an ephemeral inspector that changes no state at all.", ko: "선택이 일부러 전부에 퍼지지 않는 로드맵 간트 — 행을 고정하면 KPI 요약만 재계산되고 원장 테이블은 설계상 연동하지 않으며, 막대에 호버하면 상태를 전혀 바꾸지 않는 비영속 인스펙터가 열린다 (자동 dash r19 승자, 2:1)" }, target: "dash", category: "dashboard" },
  { id: "d49", route: "/dash/d49", brand: "Trussline", desc: { en: "A reconciliation console built as a waterfall — the bridge from last period to this one is the page, with every driver a signed bar that has to sum back to the closing figure, so a variance is read as a chain of causes rather than as a single delta you have to explain afterwards (auto dash r17 winner, 2-1).", ko: "리컨실리에이션을 워터폴로 지은 콘솔 — 지난 기간에서 이번 기간으로 건너가는 다리가 곧 페이지이고, 드라이버마다 부호 있는 막대가 마감 수치로 되돌아 합산된다. 차이를 나중에 설명해야 하는 단일 델타가 아니라 원인의 사슬로 읽는다 (자동 dash r17 승자, 2-1)" }, target: "dash", category: "dashboard" },
  { id: "d48", route: "/dash/d48", brand: "Parhelion", desc: { en: "A twin-region comparison console where the two panes are the argument — picking a region on either side recomputes both panels, the shared metric table and the delta column together, so a difference is read as a difference rather than as two numbers the reader has to subtract (auto dash r16 winner, 2-1).", ko: "두 패널 자체가 논증인 트윈 리전 비교 콘솔 — 어느 쪽에서 리전을 바꿔도 양쪽 패널·공유 지표표·델타 열이 함께 재계산돼, 차이를 독자가 빼서 구하는 두 숫자가 아니라 차이 그 자체로 읽는다 (자동 dash r16 승자, 2-1)" }, target: "dash", category: "dashboard" },
  { id: "d47", route: "/dash/d47", brand: "Vela", desc: { en: "An A/B console that argues with a confidence band rather than a number — the forecast chart carries a solid historical line and a shaded 95% interval, so a lift that has not separated from control is visibly not separated instead of being reported as a figure with an asterisk (auto dash r15 winner, decided by tie-break from a three-way draw).", ko: "숫자가 아니라 신뢰구간으로 논증하는 A/B 콘솔 — 예측 차트가 실선 이력과 음영 95% 구간을 함께 실어, 대조군과 아직 갈리지 않은 리프트는 별표 붙은 수치가 아니라 갈리지 않은 모습 그대로 보인다 (자동 dash r15 승자, 3파전 동률을 타이브레이크로 확정)" }, target: "dash", category: "dashboard" },
  { id: "d46", route: "/dash/d46", brand: "Crewline", desc: { en: "Dispatch as a calendar first and a board second — the day's crew assignments sit on a time grid where a drag changes both the schedule and the load figures beside it, and the ticket rail keeps the unassigned work in view instead of behind a tab (auto dash r14 winner, 3-0).", ko: "배차를 캘린더로 먼저 보고 보드로 나중에 본다 — 하루치 배정이 시간 격자 위에 놓이고, 하나를 끌면 일정과 옆의 부하 수치가 함께 바뀐다. 미배정 작업은 탭 뒤가 아니라 티켓 레일에 상시 보인다 (자동 dash r14 승자, 3-0)" }, target: "dash", category: "dashboard" },
  { id: "d45", route: "/dash/d45", brand: "Portlane", desc: { en: "Freight operations as a three-pane console — a shipment rail, a live detail column and a exceptions feed — where selecting a lane recomputes the schedule, the dwell chart and the exception counts together, and the forecast toggle offers 30/60/90 because a 7-day window falls under the catalogue floor for that chart (auto dash r13 winner).", ko: "화물 운영을 3-pane 콘솔로 — 선적 레일 + 상세 컬럼 + 예외 피드 — 레인을 고르면 스케줄·체류 차트·예외 건수가 함께 재계산되고, 예측 토글은 7일이 카탈로그 하한 미달이라 30/60/90을 준다 (자동 dash r13 승자)" }, target: "dash", category: "dashboard" },
  { id: "d44", route: "/commissioned/verdant", brand: "Verdant", desc: { en: "Personal money on near-black with an acid-lime and emerald pair, answering three questions at once: a hatched donut for where it leaks, goal bars for how far is left, and a signed cash-flow chart whose bars fall below a dashed break-even line when the period overspends. One period control drives all of them, and a Coming up panel subtracts what is already scheduled. KO/EN switch (commissioned, reference-matched).", ko: "거의 검정 위 애시드 라임 + 에메랄드로 세 질문에 한꺼번에 답하는 개인 자산 관리 · 해칭 도넛은 어디로 새는가, 목표 막대는 얼마나 남았나, 부호 있는 현금흐름 막대는 초과 지출한 구간에서 파선 아래로 내려간다 · 기간 컨트롤 하나가 셋을 동시에 몰고, 예정 지출을 뺀 잔액까지 계산한다 · 한/영 전환 (주문 제작, 레퍼런스 정합)" }, target: "dashboard", category: "dashboard" },
  { id: "d43", route: "/commissioned/ledgerline", brand: "Ledgerline", desc: { en: "Business banking built to a supplied reference: a dark balance band carries the primary action set, and one control — period, account or direction — recomputes the flow chart, the three account cards, the movement table and the CSV export together. No effects anywhere; every panel is derived state. KO/EN switch (commissioned, reference-matched).", ko: "제공된 레퍼런스에 맞춘 비즈니스 뱅킹 · 다크 잔액 밴드가 주 액션을 이고, 기간·계좌·방향 중 하나만 바꿔도 흐름 차트·계좌 카드 3장·거래 표·CSV 내보내기가 한꺼번에 재계산된다 · effect 없이 전 패널이 파생 상태 · 한/영 전환 (주문 제작, 레퍼런스 정합)" }, target: "dashboard", category: "dashboard" },
  { id: "d42", route: "/commissioned/ledgerline-d30", brand: "Ledgerline · KPI shell", desc: { en: "The same 39-movement dataset as its sibling, rendered in a different dashboard archetype: a white KPI row over an 8/4 chart-and-breakdown split, rose accent, monospace display face. The pair is a side-by-side on how far the shell alone moves a page. KO/EN switch (commissioned).", ko: "옆 작품과 같은 39건 데이터셋을 다른 대시보드 아키타입으로 그린 것 · 흰 KPI 가로줄 위에 8/4 차트·분해 분할, rose 액센트, mono 디스플레이 활자 · 두 작품을 나란히 두면 셸만으로 페이지가 얼마나 달라지는지 보인다 · 한/영 전환 (주문 제작)" }, target: "dashboard", category: "dashboard" },
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
