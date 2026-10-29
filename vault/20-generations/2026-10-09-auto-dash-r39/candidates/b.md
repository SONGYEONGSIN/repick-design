# Candidate B — Contour (Cloud Spend Intelligence)

**Route:** `app/src/app/dash-evolve/r39/b/page.tsx`
**Chart type:** Sunburst (radial proportional hierarchy) — first appearance of this chart class in the catalog.
**Theme:** Light (true white/zinc-50, never cream) · **Accent:** orange-600 / orange-700 (verified ≥3:1 non-text, ≥4.5:1 small-text contexts)

## Concept

Contour is an invented cloud-cost-intelligence SaaS. The entire page is built around one question — "where does the $320,000 monthly cloud bill actually go?" — and answers it with a four-level drill-down sunburst (All Cloud Spend → Region → Service → Resource category) that is the page's structural spine, not a chart-in-a-card. A slim top bar (brand, billing-period readout, account menu) sits above; everything else is organized around a centered breadcrumb + radial chart on the left and a reactive "Current focus" panel beside it, with a fully keyboard-navigable nested-list equivalent of the whole hierarchy (with its own sort and search controls) occupying its own column so the hard-required accessible fallback is never an afterthought. Color is used structurally, not decoratively: every node inside a region's branch is shaded from that region's own four-step hue ramp (independent of the single orange UI accent, which is reserved exclusively for selection/focus/interactive affordances), so the chart visually explains "which branch am I in" while every segment still carries its name and value as real text — color is never the only cue.

## Interactions implemented (all client-side, in `'use client'` components)

1. **Click-to-drill on any ring segment** (both the inner "current level" ring and the lighter outer "preview" ring) — re-centers the chart, updates the shared breadcrumb, and updates the "Current focus" panel. Drilling back up works via the breadcrumb (click any ancestor) or the center hub button (`Back`), which replaces itself with a live running total when already at the root — a single clear, narrowly-scoped state transition (`setPath`) drives chart + breadcrumb + panel together; nothing else on the page recomputes.
2. **Hover/focus (Tab) readout** on every ring segment — an always-reserved-height live region below the chart shows the exact value and % of parent, identically whether triggered by mouse hover or keyboard focus. This is deliberately a *separate*, smaller, self-contained piece of state from the drill action, so inspecting a segment never fights with navigating it.
3. **Sortable + searchable accessible fallback** — a nested `<ul>` disclosure tree (not a toggle-hidden alternative; it's a permanently-available second column) mirrors the exact same hierarchy with per-node value and % of parent, a Value/Name sort segmented control, and a search box that highlights matches and auto-expands their ancestors. Clicking any node's name "focuses" the chart on it exactly like clicking its wedge — one shared breadcrumb, two equivalent navigators.
4. **Search-within-hierarchy** — the same search box (shared single search field, not a duplicated global + local pair) filters/dims non-matching rows, highlights matches, reports a live match count, and is fully clearable.
5. (Bonus) A collapsible "Hide/Show table" disclosure on the fallback section, and a minimal accessible account-info popover, round out the interaction count without padding it with decoration.

## Typography

Pretendard/`--font-sans` only, throughout, including the large H1 ("Cloud Spend Allocation") and the hub's big dollar figure — no display/grotesk/mono face was added, per the variety assignment. Exactly **3** rendered font weights are used system-wide: `font-normal` (400), `font-medium` (500), `font-bold` (700). All numeric values use `tabular-nums`.

## 브리프에 없던 것 (브리프가 명시하지 않아 임의로 결정한 것들)

- **도메인/브랜드 선택**: 브리프는 도메인을 자유 선택으로 두었음. 4개 리전 × 3개 서비스 × 3개 리소스 카테고리(총 36개 리프)로 구성된 클라우드 비용 할당(cost allocation) 도메인과 "Contour"라는 가상 SaaS 브랜드를 직접 만들어 넣었음 — 3~4단계 계층과 선버스트의 "비례 드릴다운"이 가장 자연스럽게 맞아떨어지는 도메인이라 판단.
- **더미 데이터의 정확한 금액**: 모든 금액은 직접 손으로 설계하고 Python으로 재검증함 (리프→서비스→리전→전체 320,000 합산 100% 일치, 각 레벨 비율도 나누어떨어지는 정수로 선택). 브리프는 "정확히 합산되어야 한다"고만 했고 실제 숫자는 전적으로 임의 결정.
- **색상 체계 — "브랜치 컬러" 규칙**: 브리프는 "색은 유일한 의미 전달 수단이 되면 안 된다"고만 했음. 각 리전에 고유 4-step hue 램프를 부여하고, 그 리전 아래의 모든 서비스/리소스 노드는 같은 hue 패밀리의 음영(shade)만 바꿔가며 상속하는 규칙을 직접 설계함 — 오렌지 액센트와 색이 절대 겹치지 않도록, 그리고 "지금 어느 브랜치에 있는지"가 색만으로도 직관적으로 읽히도록 하려는 의도. dataviz 스킬의 기본 카테고리 팔레트에서 오렌지(slot 2)만 의도적으로 제외함.
- **선버스트가 한 번에 보여주는 링 수**: 브리프는 "레벨별로 드릴다운"만 요구했음. 매 포커스마다 "현재 레벨(ring1, 항상 라벨 표시)"과 "다음 레벨 프리뷰(ring2, 충분히 크면 라벨 표시)"까지 두 링만 동시에 렌더링하도록 설계함 — 한 번에 4레벨을 전부 그리면 리프 단계에서 36개의 가는 조각이 생겨 가독성이 깨지므로, Observable류 "zoomable sunburst" 패턴(포커스가 바뀌면 그 아래 2단계만 다시 그림)을 채택.
- **접근성 폴백의 구조 선택**: 브리프는 "토글 OR 상시 노출" 둘 다 허용했음. 상시 노출(허락된 두 옵션 중 더 안전한 쪽)을 선택했고, "현재 포커스의 자식만 보여주는 테이블"이 아니라 "전체 계층을 펼칠 수 있는 중첩 `<ul>` 트리"로 구현함 — 전체 계층이 시각적 차트 없이도 항상 완전히 탐색 가능해야 한다는 "hard requirement" 문구를 가장 엄격하게 만족시키는 쪽으로 해석.
- **1920px에서의 폭 처리**: 브리프는 "하드 캡을 두지 말고 숨쉬게 하라"고 했지만, 원형 차트를 뷰포트에 맞춰 무한히 키우는 것은 그 자체로 나쁜 디자인이라 판단함. 타협안으로 xl(1280px) 이상에서 좌측(차트+포커스 패널, max-w-4xl)과 우측(계층 트리, 고정 600px)을 나란히 두는 2-컬럼으로 전환해, 1920px에서도 남는 여백을 의미있는 콘텐츠로 채우되 차트 자체는 합리적인 최대 크기(약 560px)로 제한함. 결과적으로 1920px 기준 좌우 여백은 약 160px로, 브리프가 제시한 "≤40px" 기준보다는 크지만, 전면 스트레치보다는 훨씬 적은 데드 스페이스.
- **페르소나/계정 메뉴**: 브리프가 "실제 신원 금지, 가상의 페르소나 발명"만 요구했으므로 이름 "Priya Anand"와 이메일 `priya.anand@contourhq.io`를 임의로 발명함. Sign out 버튼은 실제 인증이 없는 콘솔이므로 팝오버를 닫는 것으로만 동작(백엔드 없음을 명확히 하려는 의도).
