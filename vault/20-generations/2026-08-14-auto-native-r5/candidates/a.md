# Candidate a — Listing creation / upload flow

A 4-step seller wizard (Photos → Category & condition → Price → Review & publish), one FlatList
per step behind a fixed step tracker and a fixed bottom action band. Distinct macro bucket from
every screen on the avoidance list: it's a forward-moving multi-step *creation* wizard with a
step tracker, not a persistent list, not a chronological thread, not a checklist-with-band
(closest cousin, but the band here gates a single terminal Publish over 4 steps rather than
scoring N inline checks), and not a single continuously-scrolling settings screen.

## 브리프에 없던 것

1. ① 결정: 미완료 시 "Publish" 밴드가 어떤 문구/우선순위로 막힌 이유를 말해야 하는가 (사진 없음 vs 카테고리 없음 vs 컨디션 없음 vs 가격 없음이 동시에 있을 때).
   ② 결정: 고정된 순서(사진 → 카테고리 → 컨디션 → 가격)로 첫 번째 미해결 항목 하나만 보여주고, 탭하면 그 스텝으로 점프.
   ③ 근거: r3 lesson 원문의 요구("say what is still incomplete... jump to the first unresolved step")를 가장 문자 그대로 구현한 것 — Handoff 화면(`native/src/handoff/HandoffCheckScreen.tsx`)의 `buildAction()`이 pending/blockers/mismatches를 우선순위 트리로 좁혀 단일 문구를 내는 것과 같은 패턴을 재사용.

2. ① 결정: 동일 화면 안에 서로 다른 반복-아이템 리스트가 여럿 필요한 스텝(카테고리 8개 + 컨디션 5개)을 FlatList 중첩 없이 어떻게 렌더링할지 GENERATION.md는 규정하지 않음.
   ② 결정: 두 그룹을 하나의 이질적(heterogeneous) `data` 배열(`header`/`category`/`condition` kind로 태깅)로 합쳐 FlatList 하나로 렌더링 — 그리드 대신 세로 리스트로 통일.
   ③ 근거: React Native에서 FlatList를 ScrollView나 다른 FlatList 안에 중첩하면 가상화 경고/제스처 충돌이 생기는 것은 관용적으로 알려진 제약이고, GENERATION.md는 "FlatList 사용"만 요구하고 중첩 회피 방법은 명시하지 않아 임의로 안전한 패턴을 선택.

3. ① 결정: 발행(Publish) 이후 사용자가 이전 스텝으로 돌아가 값을 바꾸면 무슨 일이 일어나야 하는가 — GENERATION.md와 카탈로그 모두 "발행 후 편집" 상태를 다루지 않음.
   ② 결정: 사진/카테고리/컨디션/가격 중 하나라도 바뀌면 `published`를 다시 `false`로 리셋하고 밴드가 다시 게이트 상태로 돌아가게 함(재발행 필요).
   ③ 근거: 카탈로그 `Plat=both`의 "제출 피드백"·"에러 복구" 원칙(무음 실패 금지, 상태가 항상 실제 데이터와 일치)을 발행 후 편집이라는 명시되지 않은 케이스까지 확장 적용 — 임의 선택이지만 "밴드는 항상 진짜 유효성 상태를 반영해야 한다"는 r3 lesson의 정신과 일관되게 맞춤.

4. ① 결정: 가격 참조값("Similar sold listings")을 사용자가 고른 카테고리에 실제로 연동할지, 아니면 고정 목데이터로 둘지 — 브리프는 "suggested-price reference"만 요구하고 카테고리 연동 여부는 미지정.
   ② 결정: 카테고리와 무관한 고정 참조값(₩96,000 / ₩128,000 / ₩165,000, 34건/30일)으로 단순화.
   ③ 근거: 화면이 "mock, no real camera"라고 명시된 것과 같은 톤 — 목데이터 화면이라는 전제하에 카테고리별 동적 가격 테이블까지 만드는 것은 결정론적 더미 데이터 범위를 넘는 과설계라고 판단해 임의로 생략.

5. ① 결정: ₩ 기호와 tabular-nums 숫자를 같은 Text 노드에 넣지 말라는 r4 caution을 어떻게 재사용 가능한 형태로 지킬지 — GENERATION.md는 이 세부 규칙을 언급하지 않음(라운드 노트에만 있음).
   ② 결정: `WonText` 헬퍼 컴포넌트를 만들어 항상 ₩ 기호 Text와 숫자 Text를 형제 노드로 분리하고, tabular-nums는 숫자 쪽에만 적용.
   ③ 근거: r4 caution을 화면 전체에서 반복되는 모든 가격 표시(참조 카드, 현재가, 프리셋, 요약, 밴드)에 일관되게 적용하기 위한 임의의 구조적 선택.
