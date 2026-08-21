---
tags: [generation, dash, auto-dash-r17]
---

# auto-dash-r17 / c — Trussline

**Trussline** — a fictional cloud-spend reconciliation console for a FinOps team, whose entire page is one piece of arithmetic shown four ways. The macro skeleton assigned and built is a **waterfall reconciliation ledger**: the spine is a generated waterfall bridge (opening balance → eight signed driver contributions → closing balance, with dashed running-total connectors and a square marker printed at every running-total level) filling the main region; directly under it a **running-total ledger table** restates the identical arithmetic row by row (driver / direction / signed amount / running total / share of gross variance) and doubles as the chart's mandatory a11y fallback; beside the ledger a **drill panel** decomposes whichever bar is selected into a diverging labelled sub-driver bar set plus the three largest invoice lines behind it and a derived "other N line items" remainder; below both, a secondary **actual-vs-plan trend** across periods with a keyboard crosshair. Deliberately not a 3-pane trading terminal, a master-detail rail, a calendar/kanban board, twin mirrored panels, a dependency graph, a funnel spine or a dense datagrid — those are spent in r13–r16 or belong to another candidate this round.

The numbers are the product. A driver's amount is never typed: it is computed as the sum of its sub-drivers. The closing balance is never typed next to the bridge either: it is read out of the monthly/quarterly period series that the trend chart draws, so the bridge and the trend chart physically cannot drift apart. `balanced` is a live comparison of `opening + Σcontributions` against that series figure, and the UI prints whichever answer comes back. Verified on all three comparison bases: MoM `$4,182,400 + $278,600 = $4,461,000` ✓, QoQ `$12,216,500 + $522,800 = $12,739,300` ✓, vs Plan `$4,310,000 + $151,000 = $4,461,000` ✓ — and vs Plan closes on the *same* $4,461,000 as MoM because March actual is one number in one array. All 8 drivers × 3 bases: Σ sub-drivers === driver amount, and Σ(named line items + derived remainder) === driver amount. Share-of-variance sums to exactly 100.000000% on every basis.

Theme **dark** (zinc-950 canvas, zinc-900 cards, `white/10` hairlines, zinc-50 primary text, zinc-400 auxiliary floor). Single accent **lime-400 `#a3e635`** — 13.20:1 on zinc-950, 11.75:1 on zinc-900; text-bearing lime fills carry near-black zinc-950 (13.20:1) because white on lime-400 measures 1.51:1. Because ± direction is the whole point of a waterfall, direction is never colour alone: every bar, ledger row, sub-driver, line item and KPI carries a lucide arrow icon **and** a signed figure alongside the tone. Display face `--font-display-mono` on the wordmark and the closing-balance hero numeral only; everything else Pretendard. Exactly **three** computed font weights (400 / 500 / 600), verified in the default view *and* with the basis switched, the direction filter flipped and the type dropdown open. Route: `app/src/app/dash-evolve/r17/c/page.tsx`.

## Interactions implemented (6, all real `'use client'`)

1. **Bar select → multi-widget sync.** Each of the eight driver columns is a real `<button>` overlaid on the SVG at the same column geometry — click, Enter/Space, or ←/→ to walk the bridge. Selection tints the column, highlights the matching ledger row, re-renders the drill panel, flips the fourth KPI tile between "Largest mover" and "Selected driver", and announces itself through a polite live region.
2. **Keyboard crosshair on the trend chart.** `role="slider"` with ←/→/Home/End; `aria-valuetext` announces period, actual, plan and the signed gap on every move. The same figures are printed as always-visible text above the plot, so nothing is hover-only.
3. **Real ledger sort + two filters.** Four sortable columns with `aria-sort`, a direction segmented control (All / Increases / Decreases) and a driver-type dropdown listbox. Running totals keep the bridge's own order under any sort or filter, and the footer switches between "Net movement" and "Subtotal of shown rows".
4. **Comparison-basis toggle (MoM / QoQ / vs Plan).** Recomputes the waterfall bars, the running totals, the ledger, the KPI strip, the drill panel and the trend series (12 months ↔ 8 quarters) together.
5. **⌘K command palette** searching drivers *and* individual line items across all three bases, plus basis-switch commands. Picking a line item switches basis, selects its parent driver and scrolls to the drill panel. The input carries the FOCUS token directly with no preceding `outline-none` (measured: `2px solid rgb(163,230,53)` + `rgba(163,230,53,0.3) 0 0 0 3px`).
6. **Shell state** — workspace switcher listbox, notifications menu, account menu, mobile nav drawer.

## 1920px width arithmetic

Sidebar `w-64` = **256px** (lg+). Main padding `lg:px-8` = **32px** each side. **No max-width cap** on the content column — the only `max-w-*` on the page is `max-w-2xl` on the intro paragraph, a deliberate measure limit on prose that no card or table inherits.

```
1920 − 256 (sidebar) − 32 (left pad) − 32 (right pad) = 1600px of content
right-edge gap = 32px          (Playwright-measured: rightGap 32 at 1920/1600/1440/1366/1280)
document.scrollWidth = 1920    (= innerWidth; also 390 = 390 at mobile)
```

32px ≤ the 40px ceiling, and the sweep is clean at 1280 / 1366 / 1440 / 1600 / 1920 / 390 with zero horizontal overflow and zero clipped table columns.

## 브리프에 없던 것

1. ① 브리지/분산 분석이 "매일 하는 일"인 B2B 도메인을 무엇으로 발명할지 정해야 했다 — 배정문은 클라우드 비용·ARR·수율·운임 마진·인건비를 예시로만 나열하고 리터럴 드라이버 세트는 주지 않았다.
   ② FinOps 클라우드 지출 분산 콘솔로 확정하고, 드라이버를 Compute autoscaling / Egress & CDN / Managed Postgres / Observability retention / Savings plan coverage / Idle resource reclaim / Storage lifecycle / Support & licensing 8종으로 고정했다. 증가 5·감소 3으로 짜서 워터폴이 한쪽으로만 흐르지 않게 했다.
   ③ ARR 무브먼트(new/expansion/contraction/churn)는 드라이버가 4개뿐이라 8개 막대의 워터폴을 채우지 못하고, 수율·운임은 하위 라인아이템을 그럴듯하게 발명하기 어렵다. 클라우드 청구서는 계정·서비스·리소스라는 3단 식별자가 실재해서 drill 패널의 line item 테이블(리소스명/계정/서비스)이 자연스럽게 채워지고, 증가 드라이버와 감소 드라이버(약정·유휴 회수·수명주기 정책)가 도메인 자체에 이미 섞여 있다.

2. ① 워터폴의 값 축을 0에서 시작할지, 잘라낼지 정해야 했다 — 브리프에는 축 기준선 규칙이 없다.
   ② 축을 0이 아니라 최저 러닝 토탈 아래에서 시작시키고(잘린 축), 대신 차트 하단에 "Value axis begins below the lowest running total ($4.18M opening) rather than at zero, the standard bridge convention — balance columns are truncated, contribution bars are to scale."를 항상 보이는 텍스트로 명시했다.
   ③ MoM 브리지는 $4.18M 기저 위에서 ±$390k가 움직인다. 0 기준으로 그리면 최소 드라이버($38,400)가 340px 플롯에서 3px 슬라이버가 되어 "단일 지배 시각화가 한눈에 읽혀야 한다"는 요건을 정면으로 위반한다. 잘린 축은 재무 브리지 차트의 표준 관례이므로, 숨기는 대신 캡션으로 공시하는 쪽을 택했다.

3. ① 라임을 ±에 어떻게 배분할지 정해야 했다 — 배정문은 "색만으로 ±를 인코딩하지 말라"고만 했고 어느 방향에 액센트를 줄지는 정하지 않았다.
   ② 감소(절감)=lime-400, 증가=zinc-300, 잔액=zinc-50으로 두고, 여기에 lucide 화살표 아이콘 + 부호 있는 숫자를 **모든** 막대·행·서브드라이버·라인아이템·KPI에 붙였다. 색을 전부 회색으로 바꿔도 방향이 그대로 읽힌다.
   ③ 비용 브리지에서 초록=절감은 재무 독자의 기존 관례이고, 이를 뒤집으면(증가=라임) 액센트가 "나쁜 소식"에 붙어 브랜드 색의 의미가 꼬인다. 다만 관례만으로는 색맹 독자에게 아무 정보도 주지 못하므로, 화살표와 부호가 1차 채널이고 색은 3차 중복 채널이라는 순서를 토큰 주석에 못 박았다.

4. ① 워터폴을 순수 SVG로 그릴지, SVG + HTML 하이브리드로 그릴지 정해야 했다 — 브리프는 "생성형 인라인 SVG/CSS"만 요구하고 텍스트를 어디에 둘지는 말하지 않는다.
   ② SVG에는 마크(막대·연결선·그리드)만 넣고, 모든 텍스트 라벨과 방향 화살표와 히트 영역은 SVG 위에 절대배치한 HTML 레이어로 뺐다. 폭은 `ResizeObserver`로 실측해 1:1 픽셀 좌표로 그린다(`preserveAspectRatio` 스케일링 없음).
   ③ 세 가지가 동시에 해결된다 — (a) 열 하나하나가 진짜 `<button>`이라 FOCUS 토큰이 그대로 먹고 히트 타깃이 플롯 전체 높이가 된다(SVG `<g tabindex>`는 브라우저마다 포커스 링이 다르다), (b) 화살표가 "CSS 도형으로 아이콘 만들지 말라"는 규칙을 위반하지 않는 진짜 lucide 아이콘이 된다, (c) `preserveAspectRatio="none"`으로 늘렸을 때 텍스트가 찌그러지고 마커가 타원이 되는 문제가 원천적으로 사라진다. 대신 라벨이 폰트 웨이트 계측 대상이 되므로 모든 라벨에 명시적 weight 클래스를 달았다.

5. ① drill 패널의 line item을 드라이버의 **전부**로 보여줄지, 상위 몇 개만 보여줄지 정해야 했다 — 배정문은 "그 드라이버 뒤의 개별 라인아이템"이라고만 했다.
   ② 이름 있는 상위 3건만 싣고, 나머지는 `드라이버 합계 − Σ상위 3건`으로 **계산한** "Other 211 line items" 한 행으로 접었다. 테이블 tfoot은 그 둘의 합을 다시 계산해 "Foots to driver"로 검증 결과를 찍는다.
   ③ Compute 드라이버에는 214건이 달려 있다고 설정했는데, 214행을 렌더하면 패널이 페이지를 삼키고, 반대로 상위 3건만 보이고 합이 안 맞으면 "소계=합계" 하드게이트를 어긴다. 파생 잔여 행은 두 문제를 동시에 없애면서, 축약했다는 사실 자체를 화면에 정직하게 남긴다.

6. ① 세 비교 기준(MoM/QoQ/vs Plan)의 opening/closing을 각각 손으로 적을지, 하나의 시계열에서 읽을지 정해야 했다.
   ② `MONTHS` 배열 하나를 정본으로 두고 — MoM opening = 2월 actual, MoM closing = 3월 actual, vs Plan opening = 3월 plan, vs Plan closing = 3월 actual, QoQ opening/closing = 그 배열에서 **합산한** 분기 — 어느 기준으로 봐도 3월 마감이 같은 $4,461,000이 되도록 했다. 분기 시계열의 마지막 4개 점도 월 배열에서 합산해 만든다.
   ③ 손으로 적으면 브리지의 closing과 트렌드 차트의 마지막 점이 언젠가 어긋나고, 그 어긋남은 어떤 기하 게이트도 잡지 못한다. r16/c의 `data.ts`가 이미 "파생 집계는 항상 계산에서, 손으로 타이핑하지 않는다"를 관례로 적어 두었기에 그대로 계승했고, 여기서는 한 걸음 더 나가 **기준 간 교차 정합**(vs Plan의 closing === MoM의 closing)까지 구조적으로 보장했다.

7. ① 축약 통화 표기(`$4.18M`)를 `Intl` compact notation으로 낼지, 손으로 조립할지 정해야 했다.
   ② `notation: "compact"`를 버리고 백만/천 단위를 직접 분기해 조립했다(`$4.18M`, `$386K`).
   ③ 실측 결과 Node의 ICU는 `$4.5M`으로 뒤 0을 떼고 Chrome은 `$4.50M`으로 남겨서, 하드코딩 데이터만 쓰는 페이지인데도 SSR/hydration 불일치 콘솔 에러가 났다(스크린샷 검증 1차에서 4개 뷰포트 전부 발생). min/max fraction digits를 양쪽 다 고정하면 에러는 사라지지만 이번엔 천 단위가 `$386.20K`로 나와 재무 독자의 표기 관례에서 벗어난다. 직접 조립이 두 문제를 함께 없앤다.

8. ① 모바일(<lg)에서 10열 워터폴을 어떻게 처리할지 정해야 했다 — 브리프는 "밀집 테이블은 breakpoint 아래에서 다른 레이아웃으로 갈아끼우라"고만 했고 차트는 언급하지 않았다.
   ② 열을 세로 행으로 회전시킨 **진짜 세로 워터폴**(러닝 토탈만큼 오프셋된 CSS 막대)로 통째로 갈아끼웠고, 잔액 행만은 예외적으로 트랙 100%를 채우게 했다. 원장 테이블도 같은 지점에서 스택 카드로 교체된다.
   ③ 390px에서 10열은 어떤 폰트 크기로도 읽히지 않으므로 축소가 아니라 교체여야 했다. 잔액 행을 비례로 그리면 잘린 축 탓에 6% 짜리 슬라이버가 되어 "2월 잔액이 3월 잔액의 6%"처럼 오독되는데, 100%로 그리면 기여 막대들이 그 안을 걸어가는 프레임으로 읽혀 잘린 축과 모순되지 않는다.

9. ① 원장 테이블과 drill 패널을 어느 breakpoint에서 좌우로 나눌지 정해야 했다.
   ② `2xl`(1536px)에서만 7/5로 나누고, 1280–1535px에서는 둘 다 12열 전폭으로 쌓았다.
   ③ 처음에 `xl`(1280px)로 잡았더니 1280과 1366에서 Driver 열이 "Observability r…"로 잘렸다 — 기하 게이트는 통과하지만 "제목이 반쯤 잘리면 폭 배분이 틀린 것"이라는 그리드 규칙 위반이다. 스윕 폭 전 구간에서 드라이버 이름이 온전히 들어가는 최소 분기점이 1536px이었다.

10. ① sr-only 데이터 테이블(트렌드 차트의 AA 등급 fallback)을 어디에 붙일지 정해야 했다.
    ② `<table className="sr-only">`이 아니라 `<div className="sr-only"><table>…</table></div>`로 감쌌다.
    ③ `<table>`은 min-content 미만으로 줄어들지 않고 자기 자신에 걸린 `overflow:hidden`을 무시해서, sr-only를 테이블에 직접 걸면 약 372px이 `document.scrollWidth`에 새어 나간다. 1차 측정에서 390px 뷰포트의 scrollWidth가 404px로 나와 폭 스윕을 깼는데 화면상으로는 완전히 멀쩡했다 — 브리프가 경고한 바로 그 함정이다. 래퍼 div는 sr-only의 `overflow:hidden`이 정상 작동하는 블록이라 누수가 사라진다(재측정 390 === 390).
