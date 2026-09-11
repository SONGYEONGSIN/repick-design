# auto-native-r18 — candidate a — My Impact

**Concept**: a buyer-facing, read-only "My Impact" screen — cumulative CO2 avoided, money saved vs. retail, and a milestone timeline of item-count thresholds crossed, for a shopper's own secondhand purchases (no seller content anywhere).

**Check string** (exact visible heading text): `My Impact`

Files:
- `native/src/evolve/r18/a/MyImpactScreen.tsx`
- `native/src/evolve/r18/a/data.ts`

## 브리프에 없던 것

- **① 결정 사항**: 하단 고정 밴드에 어떤 형태를 쓸지 (state-machine / action-bar / none 중).
  **② 결정**: 상시 노출 액션바 하나(`Share my impact`) — 눌리면 로컬 state로 확인 문구("Impact card ready — take a screenshot...")로 바뀌는 실제 동작.
  **③ 근거**: GENERATION.md §3의 read-only 완료 기록 화면 규칙과 `certificate`/`evolve/r17/a`(scorecard) 선례를 따름 — 이 화면엔 "왜 막혔는지" 말할 지점이 없으므로 상태기계는 부적절. 브리프가 명시한 "no required terminal action, optional lightweight secondary affordance(Share)" 지침과도 일치.

- **① 결정 사항**: CO2 절감량·마일스톤 임계값(threshold) 등 구체적 더미 수치.
  **② 결정**: 고정 환산계수 `CO2_KG_PER_ITEM = 3.3kg/item`을 하나 정의하고 모든 숫자(총 CO2, 각 마일스톤의 누적 CO2)를 그 상수의 순수 산술로 도출(`ITEMS_BOUGHT=14`, 임계값 1/5/10/25).
  **③ 근거**: 결정론 규칙(§5, Math.random/Date.now/new Date() 금지) 준수 — 임의의 숫자를 따로따로 박아 넣는 대신 하나의 상수에서 파생시켜 마일스톤 수치와 헤드라인 수치가 항상 서로 정합적이게 함(예: 10번째 임계값의 33.0kg = 10×3.3).

- **① 결정 사항**: 마일스톤 타임라인의 시각적 리듬 — 카탈로그의 seller scorecard(`evolve/r17/a`)가 이미 쓴 MetricCard 그리드를 재사용할지.
  **② 결정**: 재사용하지 않음. 히어로는 카드 그리드가 아니라 단일 큰 수치(CO2) + 평문 서브 통계 두 줄, 본문은 마커+연결선으로 된 세로 타임라인 리스트(FlatList) — 인증서 화면의 체크포인트 마커 관용구를 참고하되 "달성/예정" 두 상태로 재구성.
  **③ 근거**: 브리프가 명시적으로 "Do not reuse the seller-scorecard's stat-card layout wholesale; find your own visual rhythm... consider a timeline/milestone list"라고 지시.

- **① 결정 사항**: 미래 마일스톤(다음 임계값)을 화면에 어떻게 표현할지 — 날짜를 지어낼지, 진행률만 보여줄지.
  **② 결정**: 다음 임계값(25번째)은 날짜 없이 "진행 중" 상태로 표시 — 아이템 수 기반 진행률 바(`14 of 25 · 11 to go`)만 제공, 가짜 예상 날짜는 만들지 않음.
  **③ 근거**: 결정론/정직성 원칙 — 아직 일어나지 않은 일의 날짜를 임의로 지어내면 §5 결정론 정신(고정·계산 가능한 값만 사용)에 반하고, accessibilityHint 관련 §4 "일어나지 않을 일을 약속하지 마라" 원칙과 같은 결의 문제(사용자에게 확정되지 않은 정보를 확정처럼 제시)라고 판단.

- **① 결정 사항**: ₩ 표기 방식(공백/KRW 접두/그대로).
  **② 결정**: `₩` 기호와 숫자 사이에 리터럴 공백 하나(`₩ 1,284,000`).
  **③ 근거**: GENERATION.md §1의 세 가지 선택지 중 옵션 (a); `evolve/r17/a`(scorecard)의 `formatWon()`이 동일 방식을 이미 정본처럼 채택해 일관성 유지.

- **① 결정 사항**: "How we calculate this" 보조 어포던스를 넣을지, 넣는다면 상단 콘텐츠 내부 토글로 둘지 하단 밴드에 넣을지.
  **② 결정**: 리스트 푸터 안의 인라인 접이식 토글(Pressable, `accessibilityState={{expanded}}`)로 배치 — 하단 밴드는 `Share my impact` 액션 하나만 유지.
  **③ 근거**: 밴드에 두 개 이상의 액션을 넣으면 "상시 의미있는 액션바" 원칙이 흐려지고, `evolve/r17/a`의 12개월 히스토리 토글이 이미 이 자리(본문 내부 접이식)에 같은 패턴을 쓴 선례가 있어 재사용.
