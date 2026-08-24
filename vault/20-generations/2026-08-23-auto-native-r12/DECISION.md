# auto-native-r12 — DECISION

target: native · round: auto-native-r12 · date: 2026-08-23 · run dir: `vault/20-generations/2026-08-23-auto-native-r12`

## 후보
- **a** — Return & Refund Request (`native/src/evolve/r12/a/ReturnRequestScreen.tsx`): 단발 제출 폼. 사유 선택 → 증거사진(사유별 필수 분기) → 환불수단 → 제출. 하단 밴드는 상태기계(미해결 지점 서술+점프), 제출 후 확인 카드로 종결.
- **b** — Saved Search Alerts (`native/src/evolve/r12/b/SavedSearchAlertsScreen.tsx`): 저장 검색어 관리 리스트. 3단 세그먼트(Instant/Daily/Off) 즉시반영, 인라인 편집(가격 스테퍼+필터칩 제거), 2단계 인라인 삭제확인. 고정 밴드 없음(r9 선례 적용) — 상단 상시 카운터로 대체.
- **c** — Item Authentication Certificate (`native/src/evolve/r12/c/AuthenticationCertificateScreen.tsx`): 아이템 진위검증 완료 결과 기록. 5개 체크포인트(4 pass + 1 note) + 총괄 판정. 하단은 상태기계가 아닌 상시 액션바(Share/Download).

## 하드게이트
12/12 1차 통과 — 1-fix 루프 불요 (`SCORES.md` 참조). 동결 해시 `90a6f459c349ac9f051f3c67208bf851acc97a7e`, 게이트 전후 불변.

## JUDGE 판정 (3렌즈 병렬, 각 Agent 도구)

### 렌즈1 — DNA/접근성 준수: **c > a > b**
c가 §4 접근성을 가장 정확히 구현(라이브 리전 1개+alert 1개, pass/note를 색 대신 모양+글리프로 구분)하고 §3의 "막힌 게 없으면 상태기계를 지어내지 않는다" 판단을 코드 주석까지 달아 정확히 실행. a는 미해결 지점 서술+점프 패턴을 교과서적으로 구현했으나 `RETURN_REASONS`/`REFUND_METHODS` 두 FlatList를 `scrollEnabled={false}`인 외부 ScrollView 안에 중첩(`ReturnRequestScreen.tsx:128,167,222`) — RN의 "VirtualizedList를 같은 방향 ScrollView에 중첩하지 말 것" 경고를 유발하는 실경고감 안티패턴(§1 정신 위반, 문언은 준수). b는 근거 있는 무밴드 선택과 정확한 라이브 리전 사용에도 `RemovableChip` 제거 버튼이 18×18(hitSlop 10 적용해도 유효 38×38, `components.tsx:284`)로 44pt 하한 미달 — 이 루프에서 가장 일관되게 보상받은 규칙(§4)의 실제 위반.

### 렌즈2 — 모바일 완성도: **b > a > c**
b는 모든 컨트롤이 실제 상태를 즉시 변경하고(세그먼트·스테퍼·칩 제거·2단계 삭제) 빈 상태(`ListEmptyComponent`)까지 갖춰 "management 화면"으로서 가장 완결적. a는 제출 후 밴드에서 버튼을 완전히 제거해 dead CTA를 피했으나 실패/에러 경로가 없음(해피패스+미해결 안내뿐). c는 시각적으로 가장 정제됐으나, "실패/이상 상태를 고려했는가"라는 판정 기준에서 `CheckpointStatus`에 `fail`이 아예 없어(`data.ts:6`) 대안 상태를 전혀 모델링하지 않음 — 완성도 렌즈가 명시적으로 요구한 항목의 결여.

### 렌즈3 — 화면유형 차별성: **c > b > a**
c는 `verification`/`disputes`가 공유하는 `blocking`-useMemo+아코디언+타임라인 골격을 전혀 쓰지 않고, 상시 액션바+평면 체크포인트 리스트+인라인 공유패널이라는 새 골격을 세움. b는 카드 그래머(테두리+킥커+칩행)를 공유하지만 제어흐름(`blocking`/`target`/`jumpTo` 부재, 즉시반영)은 독자적. a는 `statusFor()`→`jumpTo()`→3단 밴드(blocked/ready/done) 골격이 `disputes`(`blocking` useMemo→`jumpToDraft`→`bandBlocked/Ready/Done`)·`verification`과 상태명·제어흐름까지 구조적으로 유사 — 도메인 어휘만 다른 세 번째 재사용 사례로 판정.

## 집계 — 1위 표 다수결
lens1=c, lens2=b, lens3=c → **c 2표, b 1표. 2-1 다수결로 c 승.** no-winner 아님(3파전 동률 아님, 억지 승자 아님 — 명확한 다수).

## 승자: c — Authentication Certificate (`evolve-r12-c`)

## 정제 조치
불요 — 승자에 규칙 위반 없음(렌즈1·렌즈3 모두 c를 1위로 판정, 렌즈2 감점 사유는 규칙 위반이 아니라 "실패 상태 미모델링"이라는 범위 선택이며 브리프 §3이 명시적으로 이 화면 유형에 상태기계를 강제하지 않음).

## LEARN에 넘기지 않는 관측 (기록만)
- a의 nested FlatList-in-ScrollView 안티패턴은 이번 라운드 최초 관측 — 재현 없이 단일 사례라 delta 승격 보류, 다음 native 라운드에서 재현되면 델타화.
- 렌즈2가 c에 지적한 "fail 상태 미모델링"은 승자의 결함이 아니라 이 화면 유형(완료된 발급 인증서)의 정의상 선택("발급 자체가 pass 전제")이라 판단 — brief §3 힌트("완료된 결과를 보여주는 read 화면이라 상태기계가 안 맞을 수 있다")와 일치. 조치 불요.
- b의 `RemovableChip` 44pt 미달은 승자의 결함이 아니지만(b는 승자가 아님) 실측 위반이라 LEARN delta로 별도 채택(아래).

## 판정 커버리지 — 미확인 범위 자진 신고 (3렌즈 취합)
- 세 렌즈 전원: 390pt/768pt 외 폭(320pt·랜드스케이프) 미검사.
- 렌즈2: a의 제출 후 확인카드 상태, b의 편집패널 오픈 상태 스크린샷 미확보(소스 판독만).
- 렌즈1: 나머지 14개 기존 화면 소스 미검사(아키타입 설명만으로 판단하라는 지시 범위 내).
- 렌즈3: `watchlist`·`order-status` 실제 소스 미확인(아키타입 한 줄 설명만으로 b·c의 인접군 판단) — b가 watchlist와 더 가까울 가능성, c가 order-status와 더 가까울 가능성을 스스로 유보.
- 다크모드·라이브 상호작용 트레이스는 3렌즈 전원 소스 판독으로 대체(정적 분석), 실행 트레이스 없음.

## LEARN — delta 1개 추출 (아래 §5 참조)
승자 c가 렌즈1·렌즈3 이중 다수를 얻은 핵심 근거: "완료된 결과-기록 화면은 상태기계 밴드가 아니라 상시 액션바가 맞다"는 §3 힌트를 정확히 실행한 것. GENERATION.md §3 밴드 규칙("일을 하는지로 판정")이 이미 존재하지만, "막힌 상태 자체가 없는 화면"이라는 하위분류를 명시하지 않아 이번 라운드 이전까지는 판단이 라운드마다 재발명됐다 — delta로 명문화한다.
