# Candidate C — Accrue: Revenue Recognition Console

**Product/brand:** Accrue — a B2B billing/finance-ops SaaS (invented; not "repick"). Concept: a **revenue recognition console** built as a hero + single dominant visualization — a page-width KPI band sitting above one large, always-labeled floating-bar **waterfall** bridging opening → new bookings → expansion → churn → downgrades → credits/adjustments → ending recognized balance, with a synced line-item table below and a Month/Quarter toggle that swaps both to a fully independent, internally-reconciling dataset.

**Applied interactions (4 of the list, plus the bonus):**
1. **Chart hover/focus tooltip** — hovering *or keyboard-focusing* any waterfall bar (real `<button>` per bar, own `focus-visible` ring) opens a floating popover with that bar's exact delta, running total, and share-of-opening — in addition to the persistent on-bar labels (running total + signed delta are always visible, never hover-gated).
2. **Real table sort/filter** — the line-item table's three columns (`Line item`, `Amount`, `Running total`) are sortable via `aria-sort` header buttons, plus an independent category `<select>` (All/Balance/Growth/Reduction).
3. **Month/Quarter period toggle** — a segmented control swaps `BRIDGES.month` / `BRIDGES.quarter`, two hand-reconciled bridges (month: $1,842,300 → $1,944,800; quarter: $1,760,500 → $2,004,700), each independently verified to sum exactly, driving both the chart geometry and the table rows together.
4. **Selection → multi-widget sync, split into two real, visibly distinct paths** (per the r23 directive): hovering/focusing a bar sets an **ephemeral** `hoveredKey` that only lightly tints the matching table row (`bg-zinc-50`) and reverts the instant focus/mouse leaves — no chip, no filtering. Clicking a bar (or its mirrored table row) sets a **persistent** `pinnedKey`, which (a) visibly renders a dismissable `Filtered by: <label> ✕` chip above the table, (b) disables the category `<select>` while active, and (c) actually re-filters the table's row set through one shared `deriveVisibleRows()` predicate — the same function the category filter and sort also flow through, so there is exactly one place selection turns into "what rows show," not two components independently reading a raw id.
5. **Bonus sparkline** — the MRR KPI card carries a 12-point deterministic trend sparkline (plain SVG polyline, no library).

**Font/typography confirmation:** Body and all UI copy set in `font-sans` (Pretendard) throughout. `--font-display-wide` (Archivo Display) is used in exactly two places — the sidebar wordmark "Accrue" and the page `<h1>` "Revenue Recognition" — nowhere else. No `font-mono`/`font-serif`; all currency and numeric columns use `tabular-nums` on the Pretendard stack. English-only copy throughout.

**Accent:** orange (orange-700 for text/solid-button contrast, orange-600 for large chart fills, orange-50 for tinted surfaces) — chosen to avoid violet/indigo, rose/amber, and the emerald/teal/sky/cyan/blue family. Semantic increase/decrease signal pairs color with a chevron icon (never color alone): orange + ChevronUp for growth bars/rows, zinc-600 + ChevronDown for reduction, zinc-800 + Minus for balance/total bars.

## 브리프에 없던 것

1. **결정 사항: 실제 통화 수치와 계정 카테고리 구체값.** 브리프는 "6-8 bars, opening/bookings/expansion/churn/downgrades/adjustments/ending" 구조만 지정했지 실제 금액은 명시하지 않음.
   **결정:** 월간 데이터는 $1,842,300 opening → $1,944,800 ending (7 bars), 분기 데이터는 $1,760,500 → $2,004,700로 손으로 검산해 정확히 reconcile 되도록 설계.
   **근거:** 브리프의 "your bridge must actually reconcile" 요구를 문자 그대로 만족시키기 위해 buildBridge() 헬퍼로 before/after/delta를 런타임에 파생시키고, 두 기간이 서로 다른 스케일(월 vs 분기 약 2.7배)을 갖도록 해 "단순 relabel이 아님"을 수치로 증명함.

2. **결정 사항: 라인아이템 테이블 컬럼 수를 3개로 압축(Line item / Amount / Running total), Category와 Share%는 별도 컬럼 대신 배지/캡션으로 내재화.**
   **근거:** r22 발견("percentage columns can overlap even when page doesn't overflow") 때문에 390px 모바일에서 table-fixed 컬럼별 최소 픽셀폭을 직접 계산했을 때, 5컬럼으로는 협소 화면에서 숫자 컬럼이 절대 안전 폭을 확보하지 못함. 컬럼을 3개로 줄이고 category를 badge로, share%를 running-total 셀 안의 보조 캡션으로 내리는 방식으로 해결 — 워터폴은 필요시 자체 overflow-x-auto로 스크롤(브리프가 명시적으로 허용한 유일한 스크롤 컨테이너)하고, 테이블은 절대 스크롤하지 않게 만들어 "두 개의 독립된 넓은 overflow-x-auto container" 금지 규칙을 지킴.

3. **결정 사항: 워터폴을 뷰포트 percentage 스케일링이 아니라 고정 픽셀 SVG(940×380) + 그 바깥의 HTML 오버레이(라벨/버튼/툴팁)로 하이브리드 렌더링.**
   **근거:** viewBox 기반 percentage 스케일링은 좁은 화면에서 SVG `<text>` 폰트 크기까지 비례 축소시켜 "hover-gated 없이 상시 보이는 텍스트" 요구(완결성 바)를 좁은 화면에서 위반할 위험이 있음. 고정 픽셀 SVG + 같은 좌표계를 공유하는 절대배치 HTML 라벨/버튼으로 분리해 어떤 뷰포트에서도 라벨 폰트 크기가 줄어들지 않게 함. 390px에서는 이 청크만 자체 스크롤.

4. **결정 사항: 선택(핀) 상태가 기간(Month/Quarter) 토글을 넘어 유지되도록 함(호버 상태는 리셋).**
   **근거:** 브리프가 명시하지 않은 부분. 각 기간 데이터가 동일한 `key`(예: "churn")를 공유하도록 설계했으므로, 핀을 유지하면 "분기로 바꿔도 여전히 Churn 행만 필터링됨"이라는 일관된 동작이 되어 오히려 자연스러운 UX가 됨. 반면 호버는 순간적 상태이므로 토글 시 초기화해 잔상 툴팁을 방지.

5. **결정 사항: 사이드바 워크스페이스 스위처, 알림, 계정 메뉴, ⌘K 커맨드 팔레트를 실제로 열고 닫히는 상태로 구현(순수 장식 아님).**
   **근거:** 완결성 바가 "dropdown/popover" 컴포넌트 시스템과 "top bar: global search ⌘K + notifications + avatar menu"를 명시적으로 요구하지만 구체적 동작까지는 규정하지 않음. r13/r14 발견(반응형 숨김 라벨의 접근성 이름 누락, 상호작용 후에만 도달 가능한 컨트롤의 focus-visible)을 감안해 검색 트리거에 `aria-label`을 명시하고, 팔레트 내부의 각 항목에도 실제 렌더링되는 `focus-visible:outline` 처리를 부여함.

6. **결정 사항: 아바타는 이미지 대신 이니셜 원형 배지("YS")로 대체.**
   **근거:** 브리프가 "이미지가 필요하면 next/image, 필요 없으면 0장도 가능"이라고 명시. 실제 아바타 사진을 쓸 이유가 없는 화면이라 판단해 이미지 자산을 아예 배제, `next/image` 관련 제약(치수/außen 고정 URL 등)을 신경 쓸 필요를 없앰.
