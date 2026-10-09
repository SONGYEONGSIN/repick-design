# Candidate b — Warden

Warden is a trust & safety / access-anomaly monitoring console for a platform admin team (invented client: Northwind Cloud, production workspace). The page is feed-centric: a central, dominant "Event Stream" of 34 deterministically-generated, real flagged security events (unusual logins, impossible travel, permission escalation, suspicious bulk exports, MFA bypass, new-device registration, role changes) is the page's protagonist — each a real card with severity, actor/target, timestamp, location, status, and an on-demand forensic detail strip, paginated 10-at-a-time. Two genuinely secondary side panels sit beside it: a hand-built SVG **ego-network graph** (≤30-node fixed relationship graph of 14 fictional accounts + 8 services, A11y-grade-D, backed by a mandatory adjacency-list `<table>` fallback with `caption`/`scope`), and a compact 3-item **risk-metric strip** (bullet-gauge readouts: anomaly rate, mean time to triage, open investigations — current vs. target, never a 4-tile grid). All data is generated from a fixed seed (integer LCG, no `Math.random`/`Date.now`/argument-less `new Date`), anchored at Sep 25 2026 14:32; the graph's edges are hand-authored ground truth shared verbatim by the SVG and its table fallback, so they can never disagree.

**Interactions implemented (5, all real `'use client'` state, deterministic):**
1. Command palette (⌘K) — filter by severity, pin the most recent critical event, clear the pin, jump to either side panel.
2. Real severity filter (segmented control: All/Critical/High/Medium/Low) on the feed, plus paginated "Load more".
3. **Selection fan-out, split as specified:** clicking a feed row's Pin button sets a persistent, visibly-marked `pinnedId` that re-centers the access graph on that event's actor and narrows the risk strip to that actor's scope. Hovering (or keyboard-focusing) a feed row opens a fully ephemeral inline detail strip (device, IP, record count, travel window, role delta) via separate `hovered`/`focused` state — touches no persistent state, never reaches the graph or risk strip.
4. The graph's own node hover is a third, independent interaction (separate `hoveredId` local to the graph component) — shows the exact relationship (kind + "since") in a live readout, fully decoupled from the feed's pin mechanism.
5. Explicit non-reactivity: the feed's severity filter and chronological order are called out (caption text) as deliberately independent of pinning — pinning never reorders or refilters the feed.

**Typography:** No display typeface — Pretendard only for everything, including headings, as sanctioned by the brief. Exactly three rendered weights, audited by grep: `font-normal` (400), `font-medium` (500), `font-bold` (700). Uppercase 11px tracked labels (`text-[11px] font-bold uppercase tracking-wider`) used consistently for every section heading and table header via one shared `SectionLabel` component/class string.

**Theme/accent:** True light theme — `zinc-50` page canvas, white cards/sidebar, `border-zinc-200`, `shadow-sm` only, no cream/sepia. Single accent: emerald (`emerald-700` primary actions/active nav/focus ring, `emerald-50/800` tinted pills). Severity (critical/high/orange/amber/zinc) and status colors are semantic, not the brand accent — always paired with an icon and a text label, never color alone. Secondary text is `zinc-500` on white/`zinc-50` and never drops below that floor on any state (dismissed badges, empty filter result, unhovered/hovered rows, closed/open `<details>`).

**Completeness vs. the Mercury/Coinbase bar:** reconciling, deterministic data (RFC 5737 documentation-range IPs, not fabricated-looking real ones); every topbar control (`search trigger, primary action, notifications, account menu, mobile menu, segmented filter buttons`) is exactly `h-11` (44px); full keyboard reachability for every *persistent* affordance (filter, pin, load-more, palette, popovers, disclosure); explicit `focus-visible:outline-2 …outline-emerald-700` with no competing `outline-none`/bare `ring`; single `h1`, three `h2`s, no skip; semantic `<table>` with `caption`/`scope` for the adjacency fallback; zero `overflow-x-auto` anywhere on the page (`table-fixed` + generous `colgroup` widths instead).

## 브리프에 없던 것

① 네트워크 그래프 노드를 키보드로 포커스 가능하게 만들지 여부가 브리프에 명시되어 있지 않았음. ② SVG는 `aria-hidden`/`focusable="false"`로 완전히 장식적으로 처리하고, 실제 접근 가능한 동등 정보는 `<details>` 안의 시맨틱 `<table>`(캡션·scope 포함)로만 제공하도록 결정. ③ 브리프가 이 데이터 타입을 "A11y grade D"로 명시하며 표를 "필수 폴백"이라 부른 것 자체가, 그래프 내부에 `role=button`+`tabIndex` 자식을 넣어 `aria-hidden` 조상과 충돌시키는 것보다 그래프=장식·표=실데이터로 역할을 명확히 분리하는 편이 안전하다는 신호로 해석함.

① 아무것도 핀되지 않은 초기 상태에서 그래프/리스크 스트립을 무엇으로 채울지가 없었음. ② 리스크 스트립은 조직 전체 기본값을, 그래프는 "가장 최근의 critical 이벤트"를 자동 포커스하도록 함(진짜 핀은 아니며 UI에 "Auto-focus" 칩으로 명확히 구분 표시). ③ 사이드 패널이 첫 로드에 비어 있으면 미완성처럼 보이고, "가장 급한 항목에 기본 포커스"는 실제 보안 콘솔(PagerDuty류)에서 흔한 관례.

① 심각도(critical/high/medium/low) 색상 체계는 브리프의 "단일 액센트: emerald" 규칙과 별개로 정해야 했음. ② red/orange/amber/zinc 4단계로 심각도를 매핑하고, emerald은 브랜드·기본 액션·"resolved" 긍정 상태에만 한정. ③ 보안 이벤트는 심각도 간 실질적 구분이 기능적으로 필요하므로, 기존 카탈로그(r28의 orange가 액센트와 위험배지를 겸한 사례)처럼 액센트가 곧 유일한 경고색인 것과 달리, 여기서는 액센트와 시맨틱 상태색을 의도적으로 분리함.

① 리스크 스트립에 정확히 어떤 2~3개 지표를 넣을지가 정해져 있지 않았음. ② Anomaly rate / Mean time to triage / Open investigations의 불릿 게이지(현재 vs 목표) 3종으로 결정. ③ 실제 트러스트&세이프티/SRE 조직의 표준 SLO와 부합하고, "2~3개, 4타일 그리드 금지" 지시를 문자 그대로 만족.

① "핀에 반응하지 않는 위젯"으로 무엇을 지정할지가 필요했음. ② 피드 자체의 심각도 필터와 정렬 순서를 핀과 무관하게 유지하고, 캡션 텍스트로 명시. ③ 브리프가 든 예시("e.g. the feed's own ordering/filter")를 그대로 채택.

① 호버 시 노출되는 ephemeral 상세 정보에 정확히 어떤 필드를 넣을지가 없었음. ② 디바이스, 소스 IP, (유형별로) 레코드 수/이동 시간/역할 변경 내역을 인라인으로 노출. ③ 실제 보안 트리아지 화면이 다루는 포렌식 필드이며, IP는 RFC 5737 문서용 대역(192.0.2.*, 198.51.100.*, 203.0.113.*)만 사용해 실존 IP처럼 보이지 않으면서도 사실적으로 유지.
