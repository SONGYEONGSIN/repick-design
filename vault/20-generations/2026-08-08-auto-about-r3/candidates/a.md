**a — Ordinal**: A B2B SaaS that turns a regulated company's approval chains and compliance rules into software-enforced, auditable workflows. Dark theme, blue accent, `--font-display-wide` for display type only, three font-weight classes route-wide (`font-normal`/`font-semibold`/`font-bold`). Structure: hero with static stat strip → static 3-step "define/enforce/show the record" cards → People, rendered as a hierarchical org breakdown (trunk-and-branch tree, not a flat list) with a segmented toggle that re-slices the same 12 named people by function or by region, each node independently expand/collapsable → Values, rendered as a master-detail pair (plain button list on the left, single detail panel on the right — not tabs, not an accordion, not a carousel) numbered 01–05 to echo the brand name → a static, deliberately non-interactive milestone list → CTA/footer. Three genuinely functional interactions: (1) function/region regroup toggle that rebuilds the tree from one shared dataset, (2) per-node expand/collapse with `aria-expanded` + real `hidden` panels, (3) value selection swapping the detail panel content, with `aria-current` state and arrow-key roving as an enhancement over native Tab order.

## 브리프에 없던 것

1. **결정**: People 섹션의 "계층 구조"를 실제 트리 시각(줄기+가지선)으로 그릴지, 아니면 r2/a Cordwell처럼 평평한 카드 리스트로 구현할지 브리프가 명시하지 않았다.
   **선택**: `border-l` 트렁크 라인 + 각 노드마다 짧은 가로 tick으로 실제 파일트리형 계층을 그렸다.
   **근거**: 이번 라운드 지침이 "interactive org-chart or hierarchical breakdown"을 명시적으로 제안했고, r2/a(Cordwell)가 이미 `divide-y` 평면 리스트로 클릭-확장을 구현해 우승했으므로 같은 메커니즘을 반복하면 구조적 차별성이 없다고 판단했다 — archetype 금지 목록의 취지("매크로-셸+인터랙션 조합 반복 금지")를 따른 자의적 결정이다.

2. **결정**: Values를 "선택 시 단일 패널 교체"로 구현하되, 목록에 화살표키 로빙(위/아래)을 추가할지 여부와, 추가한다면 `role="tablist"`처럼 보이지 않게 순수 `<button>` 리스트로 유지할지를 브리프가 규정하지 않았다.
   **선택**: 순수 `<button>` 리스트(별도 ARIA role 없음) + Tab 순서는 그대로 두고, 화살표키는 "추가 편의"로만 얹었다(Tab으로도 전 항목 도달 가능).
   **근거**: 브리프가 "NOT tabs"를 명시했고, r2/a가 이미 정식 ARIA tablist(role=tab/tabpanel + 화살표 전용 네비)를 구현해 놓았다 — 같은 role 패턴을 쓰면 겉모습만 다른 재탕이 될 위험이 있어, `curation-criteria`의 "Q6 판정"(입력축×출력축 조합이 같으면 재탕) 취지를 people/values 양쪽에 선제 적용했다.

3. **결정**: People과 Values 양쪽에 요구되는 최소 인원 수·가치 개수가 브리프에 없다(단지 "real"이어야 한다는 완성도 계약만 있음).
   **선택**: People 12명(4개 그룹 × 3명, function/region 두 축으로 재분류 가능하도록 각자 다른 지역 태그 부여), Values 5개(01~05, 회사명 "Ordinal"과 숫자 매김이 브랜드적으로 연결되도록).
   **근거**: `about-deltas-provisional.jsonl`의 첫 delta가 "장식적 언급이 아니라 콘텐츠 완결성"을 요구했고, r1/r2 후보들이 대체로 8~14명·4개 값 수준을 썼으므로 그 범위 안에서 자의적으로 정했다 — 너무 적으면 완결성 계약 미달, 너무 많으면 group toggle 로직과 카드가 비대해져 정제가 어려워진다는 실용적 트레이드오프.
