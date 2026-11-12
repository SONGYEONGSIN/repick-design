# auto-native-r34 — DECISION

Round 2 of a scheduled 2-round-back-to-back `/dash-evolve 2` execution (unattended). Round 1 was `auto-landing-r32` (winner c), fully committed and pushed before this round's RETRIEVE began — sequential, not parallel, per the skill's consecutive-round rule.

## 0. 준비

- **라운드 수 확정**: `node scripts/round-budget.mjs --explain 2` → `1  미채움 0종` (재확인, round 1과 동일 — `PAGE_TYPES` 전부 채워짐). 이 실행(스킬 2회째 호출)도 1라운드만 돈다.
- **Agent 도구 가용성**: 확인됨(round 1과 동일 세션, 재확인 불요하나 전제 유지). `self_judged` 없음.
- **타깃 결정**: 미채움 큐 0종 → `['dash','native']` 균등 난수(round 1이 이미 landing 소진, 연속 라운드 규칙에 따라 제외) → **native**.
- **네이티브 주기**: 오늘(2026-10-10)은 UTC 토요일 — 월요일 고정 트리거와 무관하게 균등 난수로 native가 뽑힌 것(강제 아님).
- **재배정 큐**: `reassign-queue.md` "대기 중" 확인 — native 항목 없음(대기 중인 것은 dash #11 하나뿐).
- **환경 부트스트랩**: `native/` npm install 미실행 상태였음을 확인, 설치 완료(503 패키지).
- **라운드 번호**: `auto-ledger.jsonl`에서 native 최대 라운드(r33, no-winner) +1 = **r34**.

## 1. RETRIEVE

전문 로드: `native/GENERATION.md`(§1~8 전체) · `native/src/tokens.ts` · `vault/20-catalog/ux-guidelines.catalog.md` Native/Mobile 섹션 + Plat=both 행 · `auto-ledger.jsonl` native 최근 6개(r28~r33) · `native/screens.ts`·`native/screens.json` 등록 관례.

**밴드 폼 분산 확인** (최근 4개 승/패 라운드 기준): r30=destructive-confirm(a)/row-3-state(b)/selection-bar(c), r31=blocked-workflow(a)/?(b)/?(c), r32=selection-bar(a)/?(b)/?(c), r33=read-only+action-bar(a)/selection-bar(b)/row-destructive-no-band(c, no-winner). 최근 사용 폼(selection-bar·read-only+action-bar·row-destructive-no-band)을 피하고, 더 오래 안 쓰인 세 폼을 배정 — a=blocked-workflow·b=row-3-state·c=destructive-confirm-band.

**⚠️ RETRIEVE 한계로 밝혀진 것 (사후 발견, §4에서 교정)**: 이 RETRIEVE는 `auto-ledger.jsonl`의 최근 6개 항목만 훑었고 `native/src/evolve/` 전체 디렉토리를 grep하지 않았다 — dash 쪽이 이미 겪은 Q58과 정확히 같은 사각(승격 갤러리/최근 ledger만 보고 전체 누적분을 안 봄)이 native에도 있었다. 그 결과 후보 b("Saved Shipping Addresses")가 `auto-native-r29/c`("Saved Addresses", no-winner로 미승격)와 도메인+매크로폼이 거의 동일한 것을 배정 전에 못 잡았다. 판정 단계(렌즈3에게 명시 지시)에서 발견·검증했고 결과는 아래 §4·questions-queue Q63 참조.

## 2. GENERATE — 3병렬

| v | 컨셉 | 밴드 폼 | render-check |
|---|---|---|---|
| a | Identity Re-verification — 셀러 지급정지 상태의 4단계 재인증 체크리스트 | blocked-workflow 상태기계 밴드 | "Identity Re-verification" |
| b | Saved Shipping Addresses — 배송지 목록, 행단위 3상태(normal/verifying/locked) | 밴드 없음, 행단위 | "Saved Shipping Addresses" |
| c | Close Seller Account — 단일 파괴적 전역 액션, 조건부 자격 게이트 | destructive-confirm 밴드(자기전환) | "Close Seller Account" |

세 디자이너(general-purpose 에이전트, "designer에는 Bash 없음" 방침 프롬프트 재현) 병렬 호출, 조립 브리프 전문 전달. **공유 파일 충돌 회피**: `native/src/screens.ts`·`native/screens.json`은 3개 병렬 에이전트가 동시에 쓰면 레이스 컨디션 위험이 있어, 디자이너에게는 각자 폴더(`native/src/evolve/r34/<v>/`)만 작업하게 하고 **등록은 오케스트레이터가 전원 완료 확인 후 일괄 수행**(스킬 "등록" 규약의 문자 그대로의 실행은 아니나, 동일 결과를 안전하게 내는 오케스트레이션 판단 — 과거 landing 라운드가 겪은 비동기 파일 경합 문제의 native 버전 선제 대응).

완료 확인은 각 에이전트의 SubagentHandback을 기다려 확인. 전원 완료 후 오케스트레이터가 `native/src/screens.ts`(import 3개 + `COMPONENTS` 3엔트리)·`native/screens.json`(check 문자열 3개)에 일괄 등록.

## 3. HARD GATE

`node scripts/gate.mjs --target native --screens evolve-r34-a evolve-r34-b evolve-r34-c` — **12/12 클린, 1차 통과, 1-fix·탈락 전부 0건**. 환경: `PW_CHROMIUM_PATH`/`CHROME_PATH` = 사전설치 리비전(`/opt/pw-browsers/chromium-1194/...`, web 게이트와 동일 우회), `PW_NO_SANDBOX=1`. 상세: [[SCORES]].

스크린샷: 후보별 Expo Web export(`EXPO_PUBLIC_SCREEN=evolve-r34-<v>`) → `serve` 8091 → Playwright 390×844·768×844 캡처, 6장 전부 정상(blank 0, a-390.png 육안 확인 — 체크리스트·밴드 문장·토큰 색상 전부 스펙대로).

## 3-1. 판정 후 수정

**불필요.** 승자(a)에게 어떤 렌즈도 규칙 위반을 지목하지 않았다(렌즈1·2 결함 0건 — 렌즈2의 "completedOn: 'Today'" 지적은 스타일 불일치일 뿐 결함 아님, 렌즈3은 a를 2위로 두되 역시 규칙위반 없음, SellerVerificationScreen과 스타일 키 충돌 없음을 직접 확인). b의 죽은 "Edit" 버튼·r29/c 도메인 근접은 승자가 아니므로 정제 조치 범위 밖.

## 4. JUDGE 패널

judge 3개(general-purpose, 블라인드) 병렬 호출. 렌즈3에게는 **b↔`evolve/r29/c` 직접 대조를 명시 지시**(오케스트레이터가 RETRIEVE 한계를 사후 인지하고 심사 단계에서 보정).

| 렌즈 | 1위 | 2위 | 3위 |
|---|---|---|---|
| 렌즈1(DNA/GENERATION.md 준수) | **a** | c | b |
| 렌즈2(모바일 완성도) | **a** | c | b |
| 렌즈3(화면유형 차별성) | c | a | **b** |

**2:1 다수결 — 승자 a.** 완전 동률 아님, tie-break 불요, no-winner 표 없음(렌즈3도 명시적으로 no-winner를 선언하지 않음 — 아래 참조).

**렌즈1 핵심 근거**: a의 "다음 단계로" 액션이 실제 `scrollToIndex`+`setAccessibilityFocus`를 수행하고 밴드 문장이 체크리스트와 같은 배열에서 파생돼 드리프트 불가능. 기존 카탈로그 유일한 형제 화면(`SellerVerificationScreen`, 블록워크플로+체크리스트)의 밴드 스타일키(`bandBlocked*`/`bandReady*`)와 a의 키(`bandSentence`/`bandButton`/`bandResolvedPill`)가 **전혀 겹치지 않음**을 직접 grep 확인. c도 자기전환 밴드·단일 라이브리전을 doctrine대로 정확히 구현(2위). b는 전 항목 기계적으로 클린하지만 `evolve/r29/c`와의 도메인+매크로폼 근접이 "코드 표면 신선도" 원칙에서 가장 약함(3위).

**렌즈2 핵심 근거**: a·c 모두 죽은 어포던스 0건, 실제 동작하는 상태전환 로직 확인. **b에서 유일하게 실제 결함 발견** — "Edit" 버튼이 `onPress={() => {}}`인데 힌트도 없고 시각적으로 작동하는 "Remove" 버튼과 구분이 안 됨(진짜처럼 보이는데 아무 일도 안 하는 어포던스, 루브릭이 명시 경고한 결함). a가 c보다 근소 우위(c는 자격 게이트의 "차단" 상태가 스크린샷에 안 보임 — 코드로만 확인 가능).

**렌즈3 핵심 근거**: c가 카탈로그에 전례 없는 도메인(계정 폐쇄)+메커니즘(자기전환 밴드)으로 1위. a는 메커니즘 구현은 뛰어나지만 기존 `SellerVerificationScreen`과 도메인(셀러 인증)·매크로폼(체크리스트+블로킹밴드)이 가까운 "사촌"이라 2위. b는 **지시받은 대로 `r29/c`와 직접 대조** — 도메인·매크로폼은 "사실상 동일"이나 **스타일 키·상태변수명은 완전히 분리**되고 "locked" 상태의 실제 의미도 다름(r29/c=배송중 주문 참조 / b=기본 주소); 유일한 실질 겹침("This can't be undone.")은 **카탈로그 전체 7개+ 무관 화면이 공유하는 범용 관용구**라 특정 표절이 아님 — **GENERATION.md가 정의한 "코드 표면의 문자적 일치" 기준(스타일키 집합 충돌·거의 동일 힌트)에는 미달**해 no-winner 사유로 쓰지 않음(명시 판단), 그러나 차별성 평가에서 b를 최하위에 두는 결정적 근거로 반영.

## 5. LEARN — 격리 적재 (L1)

```
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-native-r34',variant:'a',delta:'A blocked-workflow bands jump-to-next-step action reads as genuinely functional rather than decorative when it performs real native primitives -- FlatList.scrollToIndex with a fallback, plus AccessibilityInfo.setAccessibilityFocus -- instead of merely updating visible text, with band/count/target all deriving from the same steps array so they cannot drift.',evidence:'lens1+lens2 independent citations, IdentityReverificationScreen.tsx:27-45,79-105',judge_votes:{lens1:'a',lens2:'a',lens3:'c'},confidence:'high',level:'L1',status:'provisional'},'vault/00-principles/native-deltas-provisional.jsonl'))"
```

## 6. 지식 정제 게이트

클러스터링: 이번 라운드 신규 delta(위 L1)는 단독 관찰이라 즉시 승격 근거(2라운드+ 재현 또는 기계검증) 없음 — provisional 유지, 상승은 다음 재현을 기다린다.

**질문 강제 생성**: RETRIEVE 한계(§1 참조)를 `questions-queue.md` **Q63**으로 신규 등재 — dash의 Q58과 동형인 native-side 사례(RETRIEVE가 최근 ledger만 보고 전체 `native/src/evolve/` 아카이브를 안 봄). 판정 무효화는 아니었음(렌즈3이 코드표면 복제 기준 미달을 직접 검증)을 명시하고, 잠정 가설로 dash의 Q58 교정(전체 아카이브 grep 단계)을 native RETRIEVE에도 이식할 것을 제안 — 사람 판단/다음 라운드 재현 관측 대기.

## 7. 기록 + 커밋

ledger entry: `target:'native', round:'auto-native-r34', winner:'a', no_winner:false`. `variety`: RN 고정 DNA라 `{theme:'light (fixed)', accent:'indigo #4f46e5 (fixed)', face:'system (fixed)'}` — native는 다양성 축이 토큰에 고정돼 있어 변동 없음(r29·r33과 동일 패턴).

불변식 확인: `native/GENERATION.md`·`native/src/tokens.ts`(정본) 무변경, main 커밋 없음(전부 `evolve/dash`), jsonl append-only. **이 실행(스케줄 2라운드) 완료**: round 1 = auto-landing-r32(승자 c), round 2 = auto-native-r34(승자 a). no-winner 0건. 드롭 후보 0건(전 라운드 1차 통과). 정본 전체 무변경.
