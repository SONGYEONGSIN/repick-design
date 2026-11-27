# Candidate b — Warehouse Intake Scan

One-line concept: a repeated-press "Scan next package" button deterministically advances a fixed 6-item consignment manifest from pending to received, with no bottom band at all, until the screen fully swaps to a read-only "Intake complete" summary with zero remaining action UI.

## 브리프에 없던 것

- **결정** 매니페스트 크기 = 6개 고정 품목 (`PKG-7731`~`PKG-7736`, 신발·의류·시계·가구·카메라·가방 혼합). **이유**: 브리프가 "~6 expected package IDs"라고만 명시해 정확한 개수·품목은 위임됨. 6개로 고정해 FlatList 가시성과 "X of 6" 카운트가 한 화면에서 스크롤 없이도 읽히게 했고, 품목을 다양화해 실제 창고 입고처럼 보이게 함.
- **결정** "scan" 진행 방식 = 끝에서 **멈춤**(wrap 아님). 마지막 품목을 스캔하면 `scannedCount === 6`이 되어 그 즉시 스캔 버튼·리스트 전체가 사라지고 요약 화면으로 전환됨 — 더 누를 버튼이 없음. **이유**: 브리프가 "wraps or stops at the end" 둘 다 허용했는데, "읽기 전용으로 완전히 끝나는 기록 화면"이라는 §3 doctrine의 "논리적 극단"을 완성하려면 wrap(다시 pending으로 순환)은 모순됨 — 완료된 기록이 다시 미완료로 돌아가면 "완료"의 의미가 깨짐.
- **결정** "flagged condition mismatch" 디테일 추가 = 6개 중 2개(Rolex, Canon)가 `observedCondition !== expectedCondition`으로 고정 세팅, 나머지 4개는 일치. **이유**: 브리프가 "if you want to add that detail"로 선택 사항이라 명시했지만, 창고 입고 도메인에서 "예상 상태 vs 실제 관찰 상태 불일치"는 가장 현실적인 운영 신호라 완료 요약에 실질적 내용을 주기 위해 추가함. 각 플래그는 completion 화면과 더불어 **받은 행에서도 즉시 노출**(스캔된 행에 "Condition mismatch — observed X" 한 줄) — 완료를 기다리지 않고도 작업자가 그 자리에서 알 수 있게 함.
- **결정** 완료 요약 문구 = 헤딩 "Intake complete", 카드에 "Packages received: 6/6", "Condition mismatches: 2", 플래그 품목 리스트("Flagged for review"), 마지막에 "This intake record is now read-only. No further action is available here." **이유**: §3 doctrine이 "read-only 기록 화면에는 액션바를 둬도 되지만, 이 화면은 더 나아가 액션 자체를 아예 없앤다"는 브리프의 명시적 요청("no further action available")을 문장으로 명확히 선언해 스크린리더 사용자에게도 "여기서 끝났다"가 모호하지 않게 함.
- **결정** 전환 문장 두 종(스캔 1회 / 완료 1회)을 하나의 상시 마운트 `polite` 컨테이너에서 `alert` 텍스트로만 교체. 완료 문장도 "또 다른 message"로 같은 컨테이너가 렌더하도록 해, 콘텐츠가 통째로 바뀌는 순간에도 라이브 리전 컨테이너 자체는 **다시 마운트되지 않음**. **이유**: 브리프의 "permanently-mounted container, not conditionally created at the same render as the content change" 요구를 글자 그대로 만족시키기 위함 — isComplete 분기 바로 위, 분기 밖에 컨테이너를 둠.
- **결정** 체크마크를 유니코드 "✓" 글자 대신 `View` 두 개를 회전시켜 만든 자체 벡터 체크 글리프(`ReceivedGlyph`)로 구현. **이유**: dedup 검토에서 `r49/c`가 이미 텍스트 글리프 "✓"를 아이콘으로 쓴 것을 확인했고(§Dedup 참조), 같은 코드 표면을 피하기 위해 다른 벡터 구현을 선택함. 동시에 브리프의 "vector icon, not emoji" 요구에 더 직접적으로 부합.

## Dedup check

- `native/src/evolve/r49/c` (SellerOnboardingChecklistScreen): 비슷하게 밴드 없음 + 하나의 상태 배열(`completedStepIds`)에서 모든 행 상태를 파생하는 구조이지만, **인터랙션 동사가 다름** — r49/c는 각 "current" 행에 별도의 "Mark as done" 버튼이 있어 **임의 순서로 완료 가능**(실제로는 순서가 강제되지만 각 스텝이 독립 버튼), 반면 이 후보는 화면 전체에 **버튼이 하나**뿐이고 그 버튼이 매니페스트를 고정 순서로 자동 전진시키는 카운터(`scannedCount`)다. 완료 시 동작도 다르다 — r49/c는 체크리스트가 계속 화면에 남아 전부 "Done" 태그로 바뀌는 것이고, 이 후보는 리스트·버튼이 통째로 사라지고 전용 요약 뷰로 교체된다(브리프가 요구한 "full content swap"). 체크 아이콘도 r49/c는 텍스트 "✓" 글리프, 이 후보는 View 회전으로 그린 자체 벡터 글리프로 구현을 분리했다.
- `native/src/evolve/r55/c` (IntakeBatchesScreen): 이름이 "Intake"로 겹치지만 도메인과 메커닉이 다르다 — 배치 목록→상세 네비게이션 + 등급 재심의 요청(destructive-confirm 밴드)이 핵심이고, 반복 프레스로 진행하는 스캔 메커닉이 전혀 없다. 겹치는 코드 표면 없음(스타일 키·상태명 모두 별개).
- `native/src/evolve/r53/a` (BoothRegistrationGateScreen), `r44/a`, `r41/c`, `r38/a,c`, `r27/c`: "received"/"manifest" 키워드로 걸렸으나 열람 결과 체크아웃/등록 게이트류로 반복-스캔 메커닉이나 매니페스트 체크리스트가 아님.
- 전체 `native/src/evolve/r23`~`r58` 범위에서 `currentIndex`/`scanIndex`/`advance`/`nextIndex` 류 변수명 검색 결과 이 패턴(인덱스 카운터로 고정 순서 매니페스트를 한 번에 한 칸씩 전진)을 쓰는 기존 후보는 없었다.
- `native/src/*`(evolve 밖 정식 화면) 전체에서 "scan"/"manifest"/"warehouse" 키워드 매칭 0건 — 이 도메인 자체가 카탈로그에 아직 없음.
