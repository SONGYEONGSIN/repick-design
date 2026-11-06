# Candidate A — Provenance Record

A read-only chain-of-custody timeline for a single resale item — manufacture, every tracked owner change, authentication/condition checkpoints, and the final sale/delivery — with a per-row "flag for review" toggle (deriving a live flagged-count stat) and a persistent, always-actionable bottom bar (Share record / Jump to latest).

Files: `native/src/evolve/r33/a/ProvenanceRecordScreen.tsx`, `native/src/evolve/r33/a/EventRow.tsx`, `native/src/evolve/r33/a/data.ts`.

## 브리프에 없던 것

1. **① 결정 대상**: 어떤 도메인을 고를지 — 제외 목록에 없는, "완료된 기록을 보여주는 read-only 화면"에 자연히 들어맞는 새 소재.
   **② 결정**: 한 아이템의 "출처/소유권 체인"(provenance) — 제조부터 복수 소유자를 거쳐 현재 구매까지의 전체 커스터디 타임라인. `Price History`(가격 추이), `Authentication Certificate`(단일 인증서 문서), `Delivery Receipt`(단건 영수증), `Completed Purchases Archive`(내 주문 목록)와 각각 다른 모양 — 이 화면은 "한 아이템"의 "여러 소유자를 가로지르는 연속 타임라인"이라 구조적으로 그 넷의 재스킨이 아니다.
   **③ 이유**: GENERATION.md §3이 예로 든 "발급된 인증서·완료된 영수증류" read-only 기록 화면 카테고리를 만족시키면서도, 중고거래 플랫폼에서 신뢰 구축에 실제로 쓰이는 개념(프로비넌스/체인오브커스터디, 명품 재판매 플랫폼의 선례)을 끌어와 제외 목록과 겹치지 않는 축을 골랐다.

2. **① 결정 대상**: 하단 액션바에 넣을 "지금 당장 실제로 동작하는" 두 가지 액션이 무엇인가 — 브리프는 "Export, Filter, Start new" 예시만 주고 구체 기능은 비워뒀다.
   **② 결정**: (a) `Share record` — React Native 코어의 `Share.share()` API를 실제로 호출해 네이티브 공유 시트를 띄움(모킹이 아닌 진짜 사이드이펙트), (b) `Jump to latest` — `FlatList` ref의 `scrollToEnd()`를 실제로 호출.
   **③ 이유**: "Export"라고 썼다가 실제 파일 생성 기능이 없으면 a11y hint 금지 조항("약속하지 않은 사이드이펙트를 암시하지 마라")을 텍스트 자체도 어길 위험이 있다고 판단해, 추가 라이브러리 없이 RN 코어만으로 **진짜로 일어나는** 두 액션만 골랐다. 필터 토글은 액션바가 아니라 리스트 바로 위 칩 형태로 올려, 액션바와 "콘텐츠를 보는 방식 전환" UI를 구조적으로 분리했다.

3. **① 결정 대상**: 파괴적 확인(Cancel/Confirm 전환) 패턴을 이 화면에 적용할지 여부 — 브리프는 "파괴적 행동이 있다면" 조건부로만 요구한다.
   **② 결정**: 적용하지 않음 — "Flag for review"는 삭제/제거/영구보관이 아니라 되돌리기 쉬운 가산적 토글이라 destructive로 분류하지 않고, 단순 상태 전환 + 라이브 리전 안내만 적용했다.
   **③ 이유**: 브리프 문구 그대로 "if your screen has any destructive action" — 이 화면엔 그런 행동이 없다고 판단했고, 억지로 Cancel/Confirm 틀을 끼워 넣는 것이 오히려 "화면이 무엇을 하는 곳인지"와 안 맞는 패턴 재사용(§3 코드 표면 재탕 경고)이 될 위험이 크다고 봤다.

4. **① 결정 대상**: "잠긴/비행동 가능" 행을 어떻게 표현할지 — 브리프의 "Locked/non-removable items" 조항은 "제거 가능한 목록 속 제거 불가 항목"을 예시로 들지만, 이 화면엔 제거 자체가 없다.
   **② 결정**: 같은 원리를 "플래그 가능한 행들 속 플래그 불가 행"에 대응시켜, 추적 불가 기간(`gap` 이벤트)에는 Flag 버튼 대신 정적 뱃지("Not tracked by repick")만 렌더링.
   **③ 이유**: "버튼이 아니라 설명 뱃지"라는 일반 원리는 재사용하되, 그 원리가 걸리는 구체 축(제거 가능성 → 플래그 가능성)은 이 화면 도메인에 맞게 새로 짰다 — §3의 "형태 선택과 구현을 분리하라" 지침을 따른 것.

5. **① 결정 대상**: 타임라인 이벤트 종류를 몇 개·어떤 이름으로 나눌지, 그리고 "오너 수" 등 집계를 어떻게 셀지.
   **② 결정**: 10종 이벤트 kind(`manufactured`/`first_sale`/`gap`/`owner_change`/`authentication`/`condition_grade`/`listed`/`purchased`/`shipped`/`delivered`)로 나누고, 오너 수는 각 이벤트의 `ownerIndex` 필드 중 최댓값을 `useMemo`로 매 렌더 재계산(플래그 토글이 건드리는 동일 `events` 상태에서 파생).
   **③ 이유**: 집계를 별도 카운터로 손으로 추적하면 드리프트 위험이 있다는 밴드 교훈(derived-value 원칙)을 집계 전반에 일관 적용했고, 종류 이름은 임의로 지었다(참조할 선례 없음).
