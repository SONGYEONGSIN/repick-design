# auto-landing-r39/c — "Afterhours"

Dark vertical "trade ledger" — the macro-shell departs from the hero+panel grid A and B
both use. A condition filter (All / Like New / Good / Fair) simultaneously (1) changes
*which* trade cards are visible and (2) recomputes a live average-savings number from only
the visible subset — the two outputs change together, not just one abstract stat. Each
trade card has its own "Evidence" disclosure. A referral-code row adds a fifth interaction
(stateful copy toggle). Closing CTA quotes the live filter label and its recomputed
average. Theme: dark `#0B0B0F` / accent lime `#A3E635` (`-400`) / display face
`--font-display-wide`.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: accent 계열 — lime은 카탈로그 전체에 2건뿐인 희소 축이라 다양성 회피 목록에서 적극 추천되는 편이지만, 초록 계열은 어두운 배경에서 눈의 피로를 유발하는 사례가 있어 직접 대비를 재야 했다.
   **무엇으로 정했나**: `lime-400`(`#A3E635`).
   **왜**: `#A3E635` on `#0B0B0F` = **13.03:1** — 여유가 매우 커서 소형 텍스트·채움 배경 양쪽에 같은 톤 하나만으로 안전하게 쓸 수 있었다(틴트 파생이 불필요했던 유일한 후보). 채움 배경 위 잉크 텍스트도 13.03:1로 동일.

2. **무엇을 정해야 했나**: 히어로 안에 제품 증명 카드를 어떻게 넣을지 — 이 형태의 본래 개념(필터형 전수 원장)은 모든 카드를 아래 인터랙티브 섹션에 몰아 두는 쪽이 더 자연스러워, 처음 초안은 히어로에 카드가 전혀 없었다.
   **무엇으로 정했나**: 전체 6개 거래 중 앞 2개(Shell Jacket·Leather Satchel)를 히어로 섹션 자체 안에도 정적으로 복제해 넣었다.
   **왜**: `design-principles` §Landing구조 1번 — "매물 병렬 카드와 그 증명이 스크롤 없이 보여야 한다"가 **분리된 다음 섹션이 아니라 히어로 컴포넌트 자신 안**이어야 한다고 못 박는다(`auto-landing-r16` 실측 근거 인용). 필터 가능한 전체 목록과 히어로의 정적 미리보기가 같은 두 항목을 다른 문맥(필터 무관 고정 vs 필터 반응)으로 보여주는 것이 설계상 약간 어색하다는 점은 자가 인지했지만, 이 규칙은 기계가 아니라 judge 렌즈1이 대조하는 항목이라 지키는 쪽을 택했다.

3. **무엇을 정해야 했나**: "Copy code" 인터랙션의 상태 지속 방식 — 클릭 후 몇 초 뒤 자동으로 원복시킬지, 토글로 둘지.
   **무엇으로 정했나**: 자동 복귀 타이머 없이 순수 토글(다시 누르면 원복)로 구현.
   **왜**: `setTimeout` 기반 자동 복귀는 언마운트 시 정리되지 않는 타이머를 남길 위험이 있고, 결정론 규칙(`no-random`)과는 무관하지만 불필요한 비동기 상태를 피하려 더 단순한 쪽을 택했다.

## 프레임 커버리지 (self_judged 라운드 — judge 본인 메모)

1440px(s0)·1440px(s70)·390px(s0) 3장을 직접 확인. 1280/1920/나머지 스크롤 지점 미확인 — a·b와 동일.
