---
tags: [generation, dash, auto-dash-r17]
---

# auto-dash-r17 / a — Backhaul

**Backhaul** — a fictional returns & refurbishment operations console for a consumer-electronics reverse-logistics hub (workspace: *Cassiel NA Returns*, Reno hub). Its core object is a returned unit, and that unit genuinely moves through six sequential states, so the page's spine is a **horizontal six-stage recovery funnel** rendered as generative inline SVG — Return requested → Label issued → Received at hub → Inspection & grade → Refurb & retest → Restocked — with volume, pass rate and the drop-off between every adjacent pair printed as always-visible HTML text, never on hover. Underneath sits a **stage-drill inspector**: the selected stage's drop-off reason codes as a labelled horizontal bar set (Liquid ingress / Battery health under 80% / Board-level fault / Missing accessories / Cosmetic grade F), and a sortable, filterable table of the individual units currently held in that stage. Because a funnel is an A11y grade C/D chart type, the **stage ledger is a real semantic table** (`<caption>`, `scope`, six rows of stage / entered / converted / dropped / drop rate / pass rate) rendered as a designed, always-visible card — not a hidden fallback. Deliberately not a 3-pane terminal, a master-detail rail, a board, twin mirrored panels, a dependency map, a single-hero-chart + compare row, or a datagrid-as-page (r13–r16). Route: `app/src/app/dash-evolve/r17/a/page.tsx`.

Theme **dark** (zinc-950 canvas, zinc-900 cards, `white/10` hairlines, zinc-50/300/400 text, no glow or grain). Single accent **indigo** in exactly two steps: `#818cf8` (indigo-400) for small text, icons, chart strokes and focus rings — measured 6.67:1 on zinc-950 and 5.94:1 on zinc-900 — and `#4f46e5` (indigo-600) for text-bearing fills, which carry **white** text at 6.29:1. Display face **`--font-display-wide`** on the wordmark, the `<h1>` and the one hero numeral (48.5% end-to-end recovery); everything else is Pretendard. Exactly **three** computed font weights on the whole route: 400 / 500 / 600 (Playwright-measured at 1920/1440/1280/390).

## Interactions implemented (6, all real `'use client'`)

1. **Stage selection → five-widget sync.** The funnel is a `role="radiogroup"` of six stage columns with roving tabindex and Arrow/Home/End keys; the stage ledger's row buttons (`aria-pressed`) are a second, equally keyboard-reachable path to the same state. Selecting a stage re-drives the headline "Stage pass rate" tile, the "Held in this stage" tile, the trend chart's primary series, the drop-off breakdown, the dwell profile and the held-units table at once, and announces itself through a polite live region.
2. **Keyboard crosshair on the conversion trend.** `role="slider"` with `aria-valuetext` re-announced on every move; ←/→/↑/↓/Home/End walk the points, pointer move tracks the cursor, and the readout tooltip plus both series' current values stay printed as text.
3. **Real table sort + filter on the held-units table.** `aria-sort` on the live column, ascending/descending toggle across RMA / Merchant / Dwell / Value / SLA, plus an SLA-state filter (All / On track / At risk / Breached) with a written empty state. Below `lg` the same rows become stacked cards with their own sort chips.
4. **Period toggle 7D / 30D / 90D** recomputing the funnel volumes, every reason count, the trend series, all four stat tiles and the held-unit rows together (a unit belongs to the window if it has been held fewer than that many days).
5. **⌘K command palette** searching stages, individual held units (RMA / model / merchant) and page sections; choosing a unit selects the stage that unit sits in and scrolls to the table. Its input carries the route focus ring **on the input itself**, not on a wrapper.
6. **Inspector tabs** (Drop-off reasons / Dwell profile) plus the shell's workspace switcher, notification popover, account menu and mobile drawer — every control in every one of those opened states was Playwright-audited for a visible focus change.

## 1920px width arithmetic

Shell at `lg`+: sidebar `w-64` = **256px**, `<main>` padding `lg:px-8` = **32px** each side. **No `max-w` cap** anywhere on `main`, the 12-column grid or any card.

```
1920 − 256 (sidebar) − 32 (left pad) − 32 (right pad) = 1600px of content
right-edge gap = 32px  (page padding only; ≤ 40px required)
```

Playwright-measured at 1920: `document.scrollWidth === clientWidth === 1920`, and the right edge of the widest card (`#units-card`) sits exactly **32px** from the viewport. Same sweep clean at 1600/1440/1366/1280 (32px) and 390 (16px, `px-4`), with zero truncated text nodes anywhere in `main`.

## 브리프에 없던 것

1. ① 어떤 B2B 도메인을 발명할지 — 브리프는 "핵심 객체가 실제로 단계를 지나는 제품"이라는 조건과 예시 몇 개만 주고 어휘·수치는 주지 않았다.
   ② 소비자 전자기기 반품·리퍼비시 운영 콘솔(Backhaul)로 확정하고, 6단계를 RMA 접수 → 라벨 발급 → 허브 입고 → 검수/등급 → 리퍼브/재검사 → 재입고로 잡았다. 이탈 사유 코드도 도메인 어휘로 채웠다(액체 침투·배터리 헬스 80% 미만·보드 레벨 결함·부속품 누락·외관 등급 F).
   ③ 예시로 제시된 "returns/RMA"를 택하되 물리적 개체가 실제로 등급 판정을 받는 리버스 로지스틱스로 좁혔다 — 단계마다 "왜 빠졌는가"가 서로 다른 물리적 사유를 갖게 되어, 이탈 사유 브레이크다운이라는 이번 라운드의 인스펙터 요건이 억지 없이 성립한다. 일반 "세일즈 CRM 파이프라인"은 브리프가 명시적으로 금지했다.

2. ① 퍼널의 기하를 중앙 정렬(고전 깔때기)로 할지 다른 정렬로 할지 — 브리프는 "가로 다단계 퍼널 또는 Sankey-lite"만 요구한다.
   ② 공통 베이스라인 위에 세우는 하단 정렬로 바꿨다. 각 이탈은 베이스라인 위로 한 덩어리의 해칭 쐐기로 떨어져 나간다.
   ③ 처음엔 중앙 정렬로 만들었는데 실측 스크린샷에서 이탈 쐐기가 위·아래로 반씩 쪼개져 각각 11 유닛(≈8px) 두께의 실오라기가 됐다 — "이탈"이 화면에서 안 보였다. 하단 정렬은 같은 데이터로 쐐기 높이를 두 배로 만들고, 6개 단계에 공통 바닥을 줘 비교 기준선까지 준다. 색이 아니라 **해칭 패턴 + 상시 표시 라벨**이 이탈을 전달하므로 "색만으로 구분 금지"도 함께 지켜진다.

3. ① 퍼널 안의 숫자를 SVG `<text>`로 넣을지 HTML로 올릴지, 그리고 좁은 폭에서 어떻게 할지.
   ② SVG는 `preserveAspectRatio="none"`으로 기하만 그리고 글자는 하나도 넣지 않았다. 숫자·단계명은 그 위에 겹친 6열 HTML 그리드가 11~20px로 렌더한다. `xl`(1280) 미만에서는 가로 밴드를 접고 같은 데이터를 세로 비례 막대 스택으로 바꾼다.
   ③ 1200 유닛 viewBox를 1280px에서 6등분하면 SVG 글자는 실효 8px까지 줄어든다 — 게이트의 오버플로 스윕은 통과하면서 화면은 못 읽는, r16이 b 후보에서 겪은 것과 같은 종류의 실패다. HTML 글자는 폭과 무관하게 고정 크기이고 `tabular-nums`도 그대로 살아 있다. SVG `<text>`는 폰트 웨이트 집계에서 빠지므로 웨이트 3종 제약에도 유리하다.

4. ① 퍼널 수치를 어떤 자료구조로 둘 것인가 — 브리프는 "정확히 맞아떨어져야 한다"만 요구하고 형태는 말하지 않는다.
   ② `entered/converted/dropped` 삼중항을 손으로 쓰지 않았다. 기간마다 **1단계 유입량 하나**와 단계별 **이탈 사유 목록**만 authoring하고, `buildPipeline()`이 `dropped = Σreasons`, `converted = entered − dropped`, `다음 단계 entered = 이전 단계 converted`로 파이프라인을 걸어 내려간다.
   ③ d47(Vela)·d48(Parhelion)의 `data.ts`가 이미 "파생 집계는 계산에서, 손으로 타이핑하지 않는다"를 관례로 문서화해 뒀다. 이번 화면은 같은 숫자가 밴드·원장 테이블·이탈 브레이크다운·헤드라인 4곳에 동시에 나오므로 불일치 사고가 특히 잘 보인다 — 구조적으로 불가능하게 만드는 편이 안전했다. 3개 기간 × 6단계 전부 실측 검증했다(예: 12,606 − 2,796 = 9,810, 894+741+563+358+240 = 2,796).

5. ① "그 단계에 지금 들어 있는 개별 레코드"를 무엇으로 정의할지 — 30일에 18,420대가 흐르는 허브에서 단계별 WIP를 전부 나열하는 건 비현실적이다.
   ② 레코드 테이블을 "운영자 판단을 기다리며 **홀드된** 예외 유닛"으로 정의했다(단계당 9~10건). 카드 제목·캡션·카운트 문구 모두 그렇게 말한다.
   ③ 그렇게 해야 한 자릿수 행 수가 정직해지고, 동시에 SLA 상태 필터(정상/위험/초과)가 진짜 운영 의미를 갖는다 — 홀드 큐는 원래 SLA로 관리하는 대상이다. "N개 중 M개 표시" 같은 사실 아닌 축약을 쓰지 않아도 된다.

6. ① 각 유닛의 시간 필드를 몇 개 둘지 — 체류 시간, SLA 상태, 기간(7/30/90일) 소속이 서로 어긋날 수 있다.
   ② `dwellHours` **하나만** authoring하고 SLA 상태(단계별 holdSlaHours 대비 >100% 초과 / >75% 위험)와 기간 소속(`ceil(dwell/24) ≤ 기간일수`)을 둘 다 거기서 파생시켰다.
   ③ 4번 항목과 같은 이유다. 부수 효과로 논리적 일관성까지 생겼다 — 홀드 SLA가 7일인 단계는 7D 창에서 구조적으로 SLA 초과 행이 존재할 수 없다(초과하려면 7일을 넘겨야 하고, 그러면 창 밖이다). 그래서 빈 상태 문구를 정식으로 설계해 넣었다(스크린샷 검증).

7. ① 다크 캔버스에서 인디고를 몇 단계로 쓸지, 그리고 hover를 밝게 할지 어둡게 할지.
   ② indigo-400(#818cf8)은 작은 글자·아이콘·차트 선·포커스 링, indigo-600(#4f46e5)은 흰 글자를 얹는 채움. hover는 **더 어두운** indigo-700로 간다.
   ③ 계산해 보니 흰 글자 대비가 indigo-500에서 4.46:1로 **떨어져서 미달**, indigo-600에서 6.29:1, indigo-700에서 7.90:1이었다. 다크 화면의 관례대로 hover를 밝게 하면 게이트가 스캔하지 않는 상태에서 라벨이 AA 아래로 내려간다. page-brief-core의 "아슬아슬하게 통과하는 단계 대신 한 단계 확실히"를 그대로 적용해, 관례를 깨고 hover를 어둡게 했다.

8. ① 추세 시계열을 어떻게 생성하고 몇 개 점을 찍을지 — 브리프는 "전환율 추이" 차트만 요구한다.
   ② 점 인덱스의 고정 2항 사인(`Math.random` 없음)으로 만들되, 생성 후 **평균을 퍼널의 실제 통과율에 정확히 고정**시켰다(`meanLockedSeries`). 점 개수는 7D=일 7개, 30D=2일 15개, 90D=주 13개.
   ③ 추세선의 평균이 같은 페이지의 퍼널 통과율과 어긋나면 두 위젯이 서로를 반박한다. 평균 고정은 "부분합은 총합과 같아야 한다"를 시계열로 확장한 것이다. 점 개수는 기간이 길수록 점당 기간을 넓혀 가로 밀도를 대략 일정하게 유지하려고 정했다(임의 선택이지만 세 기간에서 눈에 띄는 밀도 차가 없도록 실측 조정).

9. ① 좁은 폭에서 6열 원장 테이블의 어떤 열을 포기할지 — 브리프의 필수 열(단계/유입/전환/이탈/이탈률)은 다 유지해야 한다.
   ③(먼저) 1280px에서 원장 카드 내부 폭은 약 513px이라 6열이 전부 헤더 글자 폭 아래로 눌린다("DROP-OFF"가 두 줄로 깨졌다 — 실측).
   ② `2xl`(1536) 미만에서는 **Pass rate 열만** 접는다. 통과율은 100 − 이탈률이라 화면에서 유일하게 파생 가능한 값이고, 스파크라인도 이 열에 산다. 필수 4개 수치는 어느 폭에서도 살아남는다. `<lg`에서는 아예 3열(단계/유입/이탈률)로 줄여 390px에서 열이 서로 침범하지 않게 했다.

10. ① 인스펙터 카드를 held-units 테이블 옆에 세울지 전폭으로 둘지.
    ② 전폭 스트립으로 눕혔다(왼쪽 17rem 요약 콜아웃 + 오른쪽 2~3열 바 그리드), 테이블도 전폭.
    ③ 처음엔 5:7로 나란히 뒀는데 1280px에서 7-of-12 칸에 7열 테이블이 들어가며 절반이 말줄임으로 잘렸고(실측), 동시에 인스펙터 쪽에는 150px짜리 빈 구멍이 남았다 — 브리프가 "짧은 쪽에 구멍을 남기지 말 것"으로 금지한 형태 그대로다. 전폭 2단으로 바꾸니 두 문제가 동시에 사라졌고, 바 세트는 원래 좁고 긴 것보다 넓고 낮은 편이 잘 읽힌다.

11. ① 커맨드 팔레트 입력창의 포커스 링을 입력 자체에 걸지, 감싼 래퍼에 걸지 — 카탈로그 선례(d48)는 `outline-none` + 래퍼 `focus-within`이다.
    ② 입력 엘리먼트에 직접 이번 라운드의 FOCUS 클래스를 걸고 `outline-none`은 어디에도 쓰지 않았다.
    ③ 이번 라운드 게이트는 팔레트를 열고 **그 입력에 탭을 넣어** 변화를 본다고 명시돼 있다. 래퍼에 링이 있으면 입력의 computed style은 포커스 전후가 동일해서 그대로 탈락한다. Playwright로 blur→focus 전후를 찍어 `outline-width 0px→2px`, box-shadow에 `rgba(129,140,248,0.3) 0 0 0 3px`가 붙는 것을 확인했다.

12. ① 마지막 단계(재입고)의 인스펙터에 무엇을 보여줄지 — 종단 단계는 이탈 사유가 구조적으로 0건이다.
    ② 사유 0건을 숨기거나 가짜 사유를 만들지 않고, "종단 단계 — 여기서 빠지는 유닛은 없다 / 이 단계를 떠나는 것은 손실이 아니라 판매다"라는 설명형 빈 상태를 아이콘과 함께 설계해 넣었다. 헤드라인 타일과 밴드 칩도 이 단계에서는 통과율 대신 "Terminal stage"로 바뀐다.
    ③ 6단계 중 1개는 반드시 이 상태이므로 "가끔 나오는 예외"가 아니라 정상 상태의 1/6이다. 숨기면 선택했을 때 화면이 무너지고, 억지 사유를 만들면 4번 항목의 정합성 원칙을 스스로 깬다.
