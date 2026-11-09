# auto-native-r53 — DECISION

## 0. 라운드 수 확정 (§0-0-1)
`node scripts/round-budget.mjs "2"` → **N=1** (`--explain`: "미채움 0종 — N≥2 의 근거(커버리지)가 없다"). 호출자(스케줄 프롬프트)는 2라운드를 요청했으나 스크립트가 1을 반환해 **1라운드만 돈다** — SKILL.md §0-0-1에 명시된 바로 그 처리. 2026-11-09는 UTC 월요일(`new Date().getUTCDay() === 1`)이라 N=1 단일 라운드의 타깃은 native로 고정됐다(§0 native 주기 규칙: "N=1이면 그날은 native 한 라운드만 돈다"). 큐 미채움이 0종이어도 월요일 고정 주기가 우선 적용된다.

이 스케줄 세션의 "2회 연속" 요청 중 2번째 라운드는, 동일 레포의 과거 반복 실행(r44/r48/r49/r51/r52)과 같은 처리를 따른다: round-budget.mjs가 N=1을 반환하는 한 같은 세션 안에서 2번째 라운드를 추가로 돌리지 않고 **다음 스케줄 실행으로 넘긴다**. 그 스크립트가 유일한 출처이고(§0-0-1 "산문은 첫 기회에 안 먹혔다"), 프롬프트에 둘째 라운드 수를 별도로 못박지 않는다.

## 0-0. 서브에이전트 가용성
Agent 도구 확인됨 — 이번 라운드의 designer 3개·judge 3개 전부 Agent 도구(`general-purpose` subagent, 이 환경에 별도 `designer`/`comparator` 에이전트 타입 미설정)로 디스패치했다. `self_judged: false`.

## 환경 부트스트랩 메모
- `git checkout -B evolve/dash origin/evolve/dash`, 루트/`app`/`native` 세 곳 모두 `npm install` (native는 이 세션 최초 실행이라 `node_modules` 부재 — 신규 설치).
- Playwright Chromium 바이너리는 샌드박스 프록시가 `cdn.playwright.dev` CDN 다운로드를 차단(`403 request blocked: no rule or allowlist entry`) — 레포 스크립트(`gate.mjs`/`capture-shots.mjs`/`shot-native.mjs`/`shot-evolve.mjs`/`native/scripts/validate.sh`/`iframe-check.mjs`)가 이미 읽는 `PW_CHROMIUM_PATH` 환경변수로 사전 설치된 `/opt/pw-browsers/chromium`(Chromium 빌드 1243)을 직접 가리켜 우회 — 스크립트 수정 없음, 매 호출에 env var만 전달.

## 1. RETRIEVE
읽은 것: `native/GENERATION.md` 전문, `native/src/tokens.ts` 전문, `vault/00-principles/reassign-queue.md`(target:native 대기 항목 0건 확인), `vault/00-principles/native-deltas-provisional.jsonl`(77줄 전체, 최근 17건 요약 검토), `vault/00-principles/curation-criteria.md` 전문(135줄), `vault/00-principles/questions-queue.md`에서 native 관련 미결 질문(Q42·Q52·Q55/57/59·Q63/72 등) 확인, `vault/20-catalog/ux-guidelines.catalog.md`의 Native/Mobile 섹션 + both 행, `vault/30-ledger/auto-ledger.jsonl`의 native 최근 5개(r48~r52), `native/src/screens.ts`+`native/screens.json`(production 25개 폴더 + evolve 아카이브 112개 check-string 전부)로 중복 금지 목록 구성.

**Q42 확인**: `native/AGENTS.md`(Expo 버전 확인 요구) vs `GENERATION.md` §1(`react-native`의 `SafeAreaView` 명시)이 여전히 미해결로 유예 중("(다) 채택— 기록만 하고 유예", 2026-08-24). 이번 라운드도 그 판단을 그대로 따라 `react-native`의 `SafeAreaView`를 유지 지시했다(정본을 바꾸지 않았다).

`reassign-queue.md`에 target:native 대기 항목 없음 — 재배정 소비 없음.

## 2. GENERATE
designer 3개 병렬 디스패치(조립 브리프 전문을 프롬프트 본문에 직접 기재 — 경로만 주지 않음, 2026-08-18 교훈 준수). 매크로-버킷 선제 체크: 최근 4라운드(r48 read-only 액션바 / r49 순차 잠금 체크리스트 / r51 선택바→확인 체인 / r52 비선형 집합 게이트)를 designer 프롬프트에 "최근 4라운드 승리 형태 — 단순 반복 금지"로 명시하고, 각 candidate에 **서로 다른 인터랙션 형태 레인**을 명시 배정했다(§2 "매크로-골격 버킷 선제 체크" + "서로 다른 아키타입/형태 명시 지정"):
- **a**: 진짜 차단형 워크플로 상태기계(복수 조건, 원인별 다른 점프 타깃)
- **b**: 전역 밴드 없음 — 행 단위 파괴적 확인(공유 커서 상태로 "동시 1개 행만 확인 중" 구조적 보장)
- **c**: 밴드·선택·게이트 전무 — 순수 탐색/조회 화면(§3 "밴드가 아예 없는 것도 유효한 선택" 교조를 가장 순수한 형태로 검증)

다양성 축(테마/액센트/활자)은 native에 적용 안 함 — DNA 고정(light/indigo #4f46e5/system), 승자의 `variety` 필드는 그 고정값으로 기록.

산출:
- **a** = `BoothRegistrationGateScreen` ("Pop-Up Booth Registration") — 팝업마켓 부스 예약, 신원확인·부스비·재고매니페스트 3조건 차단 게이트, 원인별 포커스 점프(`AccessibilityInfo.setAccessibilityFocus`+`findNodeHandle`), 전부 해소 시 밴드 자체가 실제 Confirm 액션으로 전환.
- **b** = `ConsignmentPartnersScreen` ("Consignment Partners") — 위탁판매 파트너 목록, 행 단위 "파트너십 종료"(비가역) 확인, 단일 공유 `EndFlowCursor`로 동시 1개 행만 확인 중 보장, 세션 중 종료 vs 시드 데이터 기종료를 구분해 중복 알림 방지.
- **c** = `SizeReferenceScreen` ("Size & Fit Reference") — 브랜드 사이즈 변환 참조, 검색+카테고리칩+정렬+단위토글(cm/in, 신발은 EU/US로 실제 값 전환)+카드별 펼침, 밴드·선택·게이트 전무.

**브리프 구멍 보고**: 세 candidate의 `candidates/{a,b,c}.md`에 각각 기록됨(이번 라운드에서 조치하지 않음 — 2회+ 재현 시 브리프 편입 대상, LEARN/정제 게이트에서 재확인).

게이트 직전 소스 상호검증(designer 보고 대 실제 소스) — 헤딩 문자열 실제 렌더 확인, `Math.random`/`Date.now`/`new Date()` 없음, `accessible={true}` 래퍼 없음, `react-native-safe-area-context` import 없음, 하드코딩 hex 없음을 전부 grep으로 재확인 후 등록 진행.

## 3. HARD GATE
`native/src/screens.ts`·`native/screens.json`에 `evolve-r53-{a,b,c}` 중앙 등록(세 designer 전원 완료 확인 후 오케스트레이터가 일괄 등록 — 등록 경합 방지).

**1차**: `node scripts/gate.mjs --target native --screens evolve-r53-a evolve-r53-b evolve-r53-c` → a·b는 `tsc` 자체 에러 0이지만 `export`/`render`/`iframe`가 **c의 tsc 에러로 전역 tsc 중단** → `blockedBy` 표시(SKILL.md §3 2026-08-24 신설 규칙에 따라 a·b의 1-fix 기회는 소모되지 않음). c는 `tsc` 1건 실패(`TS2769 No overload matches this call`, `SizeReferenceScreen.tsx:106`) — `fontVariant`를 `<Text>`에 JSX prop으로 직접 전달(RN `Text`에 없는 prop, `TextStyle` 필드로만 존재).

**1-fix**: 오케스트레이터가 직접 수정(기계적·규칙위반 해소 한정, 순위 영향 없음) — `fontVariant: ["tabular-nums"]`를 `styles.chartRowValue`로 이동, JSX prop 제거.

**2차**: 12/12 전원 통과, violations 0, 전역 tsc 0 에러.

동결 해시(등록~판정 전 구간 불변): 1차(등록 직후) `f3acb120881df3a1a4281f0fc7c82676ea7d858b` → 1-fix 후 재동결 `cf0f38e6b403215c04dd4395b653a5b1e26e0b08`(이후 스크린샷·judge 구간 동일 유지, SCORES.md 기록).

## 4. JUDGE 패널
스크린샷: 후보별 Expo Web export(`EXPO_PUBLIC_SCREEN=evolve-r53-<v> npx expo export --platform web`) → `npx serve dist -l 8091` → `native/scripts/shot-evolve.mjs`(390·768px, `PW_CHROMIUM_PATH` 사용)로 6장 캡처. 전부 blank 아님(오케스트레이터 육안 확인 — 3장 샘플 Read로 렌더 내용 실재 확인), 재게이트 불요.

judge 3개 병렬(Agent `general-purpose`, comparator 계열 미설정 환경). 공통 입력: 후보당 2프레임(390·768) + 소스 경로, 컨셉·순서 비공개(`candidates/*.md` 열람 금지 명시).

- **렌즈1(DNA 준수)**: **b > a > c**. b=§3 형태(c) 행단위 확인을 구조적으로 깔끔하게 구현(공유 커서로 "동시 1개 라이브리전" 구조적 보장, 세션중 종료/시드 기종료 구분). a=형태(a) 교과서적 구현이나 ScrollView 안에 `scrollEnabled=false`로 중첩된 FlatList(가상화 무력화, 규칙 위반은 아님)·임포트 과다. c=§3 "부재도 유효" 조항을 정확히 원용했으나, 검색 결과건수 라이브리전(`accessibilityRole=alert`+`polite`)을 "진행 가능성 전환"이 아닌 평범한 필터 카피에 적용한 것이 유일한 애매 지점(위반은 아님, 가장 느슨한 정당화).
- **렌즈2(모바일 완성도)**: **a > c > b**. a=실제 다조건 상태기계+원인별 포커스 점프가 "폰을 위해 설계됐다"는 인상을 가장 강하게 줌(미세 결함: nested FlatList 가상화 무력화, 스크롤 타깃 계산에 `marginBottom` 미반영 — 코스메틱). c=검색+칩+정렬+단위토글+펼침 5종 인터랙션이 한 `useMemo` 파이프라인으로 올바르게 합성, 단위토글이 신발에서 실제 다른 값(EU/US)으로 전환되는 도메인 인지 디테일. b=행단위 확인은 깔끔하나 인터랙션 종류가 사실상 1종(종료)뿐이고 `ListEmptyComponent`가 현재 데이터 모델상 도달 불가능한 죽은 코드.
- **렌즈3(화면유형 차별성)**: **c > a > b**. c=137개 중복금지 목록 전체에 도메인·아키텍처 충돌 없음, 밴드·라이브리전·뮤테이션 전무가 확인한 모든 이웃과 구별되는 유일 지점. a=도메인은 신규이나 "차단형 상태기계" 교조 자체는 이미 3번째 인스턴스(`verification/SellerVerificationScreen.tsx`·`handoff/HandoffCheckScreen.tsx`와 교조 레벨 중복) — 단 실제 구현(수동 오프셋 추적+`AccessibilityInfo` 포커스 푸시)은 두 이웃과 구조적으로 다름, 클론 아님. b=`sessions/ActiveSessionsScreen.tsx`+`SessionRow.tsx`, `evolve/r27/b·c`(BlockedUsers/BlockedAccounts)와 전체 파일 대조 결과 "단일 커서로 동시 1행만 확인" 구조·3단 핸들러 트리오(request/cancel/confirm 계열)가 근접 — 코드표면상 가장 약한 차별화(클론은 아니나 4번째 유사 인스턴스).

## 집계 — 3파전 완전 동률, tie-break 적용
1위 득표: 렌즈1→**b**, 렌즈2→**a**, 렌즈3→**c**. 셋 다 서로 다른 1위 — `[[curation-criteria]]` "주간 반증 판정 기준 ②" tie-break 예외 조건(완전 동률) 해당.

**적용 규칙**: 완전 동률 시 brief 렌즈(렌즈1) 1위를 우선하되, archetype 렌즈(렌즈3)가 그 후보를 **최하위로 명시 판정**했으면 동률 우승서 제외하고 나머지 중 brief 1위를 재적용한다.

렌즈3의 순위: c > a > **b**(최하위). 렌즈1의 1위(b)가 렌즈3에서 정확히 최하위로 판정됐다 → **b 제외**. 남은 {a, c} 중 brief 렌즈(렌즈1) 우선순위: a(2위) > c(3위) → **a 승자**.

(이 해석은 `auto-native-r52`가 쓴 것과 동일한 절차다 — "brief/DNA 렌즈가 기본 승자이되 archetype 렌즈가 그 후보를 최하위로 두면 예외 발동"; r52는 예외가 발동하지 않아 렌즈1 1위가 그대로 승자였고, r53은 예외가 발동해 2순위로 넘어간 점이 다르다.)

## 승자: a — BoothRegistrationGateScreen ("Pop-Up Booth Registration")
세 렌즈 중 어느 렌즈도 a에 규칙 위반을 지적하지 않았다(렌즈1·2가 언급한 것은 전부 비위반 엔지니어링 디테일 — nested FlatList 가상화 미사용, 스크롤 타깃 코스메틱 오차, import 과다). **§3-1 판정 후 수정 불요** — 동결 해시 `cf0f38e6b403215c04dd4395b653a5b1e26e0b08` 그대로 승격.

## 판정 커버리지 자진 신고 (세 렌즈 공통 미확인 범위)
- 실기기/시뮬레이터 실행 없음 — 전원 Expo Web 정적 렌더(390/768px) + 소스 코드 판독 기반.
- RN 전용 접근성 API(`AccessibilityInfo.setAccessibilityFocus`, candidate a)가 Expo-Web 셰임에서 실제로 어떻게 동작하는지(no-op인지 경고를 내는지) 미검증.
- WCAG 명도대비 수치 계산 없음 — 토큰 파일 자체의 주석(`onInk`·`onInkMuted`·`danger`·`success`·`warning` 대비값)에 의존, `faint`/`muted`의 모든 실사용 폰트크기 맥락별 재계산은 안 함.
- 렌즈3의 코드표면 중복 검사는 137개 중복금지 목록 중 **~15개**(production 10개 + evolve 5개, 제목이 각 candidate 도메인과 가장 가까운 것들)만 전문을 열어 대조했고, 나머지 ~120개는 제목 불일치만으로 충돌 가능성 낮음으로 판단(완전 배제 아님).
- 390/768 외 폭(320·1024+ 태블릿 가로)·RTL·OS 폰트 확대(Dynamic Type) 미검증.
- 빠른 연속 입력(더블탭, 동시 상태전이) 같은 경쟁조건 스트레스 테스트는 상태 구조에 대한 추론으로만 판단, 실행 검증 없음.

## 5. LEARN
`node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-native-r53',variant:'a',delta:'A blocked-workflow bands gateCause/blocking-reason must be a value recomputed fresh every render directly from live upstream state (never a stored/cached derivation), so that correcting an already-cleared condition (e.g. re-opening a manifest and dropping below its minimum count after already confirming) immediately and correctly reverts the band from its unblocked/confirm state back to the named-blocker state -- this generalizes the established derived-boolean/invalidate-on-change doctrine (r39/b dirty-state snapshot-diff; r47/a band-gated-result invalidation) to the blocked-workflow band form (a) specifically, which until now had only been validated for initial multi-condition priority-ordering (r43/b) and not for re-blocking after a user reverses an already-cleared condition.',evidence:'lens2: \"gateCause is recomputed fresh every render... immediately and correctly cascades through to the band message\"; lens1: \"functioning invalidation-on-upstream-change even though it is not the literal derived-offer/quote case the rule was written for\"',judge_votes:{lens1:'b',lens2:'a',lens3:'c'},confidence:'low',level:'L1',status:'provisional'},'vault/00-principles/native-deltas-provisional.jsonl'))"`

level L1(단일 라운드 관측, 특정 후보 종속) — 재현은 정제 게이트가 판단.

## 6. 지식 정제 게이트
native-deltas-provisional.jsonl 전체(78건, 이번 r53/a 추가분 포함) 재로드. 최근 20건 범위에서 클러스터링:
- **재현 주장 확인**: 이번 delta 본문이 "generalizes... to the blocked-workflow band form (a) specifically" 라고 적어 기존 r39/b(L2, dirty-state 트리거)·r47/a(L1, 밴드게이트 결과 무효화)를 확장한다고 주장한다. 두 원 delta를 대조한 결과: r39/b·r40/c(L2 승격 근거)는 **폼 (d) 선택/더티상태 파생 서피스**의 트리거 종류 확장(선택개수→더티상태diff→단일ID)이고, r47/a는 **그 서피스가 사라지지 않고 유지된 채 파생값만 무효화**되는 사례다. 이번 r53/a는 **폼 (a) 차단형 상태기계** 자체가 재블락되는 사례로, **폼이 다르다**(d가 아니라 a) — "같은 결함 클래스"가 아니라 "같은 일반 원칙(파생은 항상 최신 입력에서 재계산)이 다른 밴드 폼에 처음 적용된 사례"다. **판정: 재현 주장 기각, 같은 결함이 아니다** — L2 승격 보류, L1 그대로 둔다. 원 delta 텍스트는 append-only라 수정하지 않고 이 판정만 DECISION에 남긴다(SKILL.md §6 "침묵하거나 반대 결론을 근거 없이 내면 안 된다" 충족).
- **충돌 쌍**: 없음 — 기존 native delta들과 모순되는 내용 없음.
- **레벨 재책정 대상**: 없음(이번 delta는 위 판정으로 L1 유지, 기존 delta 중 추가 재현 조건을 충족한 것 없음).

**질문 강제 생성**: 신규 충돌 쌍·meta-기준 정당화 불가 사례 없음 — 이번 라운드는 `questions-queue.md`에 새 항목을 추가하지 않는다. (다만 §4의 렌즈1 "resultSummary 라이브리전을 필터카피에 적용한 것이 §3/§4 범위를 좁게 벗어난 것 아니냐"는 지적은 **위반 판정이 아니라 렌즈1 자신이 "약한 정당화"로만 표시**했으므로 질문 큐 등재 임계에 못 미친다 — 단일 라운드·비확정적 지적이라 L1 조차 아니다.)

## 7. 기록 + 커밋
- `auto-ledger.jsonl`에 `target:'native', round:'auto-native-r53', winner:'a', variety:{theme,accent,face}` 포함 entry append.
- `vault/index.md` "세대 기록"에 `[[20-generations/2026-11-09-auto-native-r53/DECISION|auto-native-r53]]` 등재.
- 정본(`dash-brief-v3.md`·`design-principles.md`) 무변경, `/dash` 갤러리·`/v1~v5` 무변경, jsonl append-only 준수, main 무변경.
