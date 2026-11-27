# auto-native-r30 — DECISION

## §0 라운드 수 / 타깃

- 호출: 사람 없는 예약 실행(스케줄된 루틴)이 "/dash-evolve 2" 상당의 동작(2라운드 연속)을 요청. `node scripts/round-budget.mjs --explain 2` → **`1\t미채움 0종 — N≥2 의 근거(커버리지)가 없다`**. `PAGE_TYPES`(`app/src/lib/works.ts`) 18종 전부 카탈로그에 등재돼 미채움 0종이므로 이번 단일 `/dash-evolve` 실행은 N=1로 강제됐다. **2라운드 연속 요청은 이 실행을 독립적으로 두 번 순차 호출하는 방식으로 충족한다** — 이것이 그 첫 번째 호출이다(두 번째 호출은 이 라운드 완주·커밋 후 round-budget을 다시 물어 별도로 시작한다).
- Agent 도구 가용성 확인(§0-0): 가용. 3개의 독립 `general-purpose` 서브에이전트로 GENERATE를, 3개의 독립 `general-purpose` 서브에이전트로 JUDGE를 수행했다(이 환경은 전용 `designer`/`comparator` 에이전트 타입이 아니라 범용 타입만 노출 — 과거 라운드들과 동일한 제약, 동일한 대응). **`self_judged: false`** — judge 세 개는 GENERATE와 무관한 새 서브에이전트이고 서로를 못 본다.
- **날짜 2026-10-05는 월요일(UTC, `getUTCDay()===1`)** — native 주간 고정 해당. `N=1`이므로 스킬 §0 "N=1이면 그날은 native 한 라운드만 돈다"가 적용돼, 미채움 큐 조회 없이 **타깃을 native로 고정**했다.
- `reassign-queue.md` "대기 중": native 항목 없음 — 재배정 없음.
- 라운드 번호: `auto-ledger.jsonl`에서 target=native 최대 라운드(r29, 2026-10-04 no-winner) + 1 = **r30**.

## §1 RETRIEVE

- BRIEF: `native/GENERATION.md`(§1~8 전문) + `native/src/tokens.ts`(DNA 토큰, light/indigo #4f46e5/system 고정).
- 공통 코어: `page-brief-core.md`는 웹 전용 조항이라 RN에 구조적으로 미적용 — `GENERATION.md`가 자체 동형 규칙(결정론·이모지 금지·토큰 강제) 보유. `page-brief-repo`도 네이티브엔 불요(§0 target 파라미터 표).
- 참조 카탈로그: `vault/20-catalog/ux-guidelines.catalog.md` Native/Mobile 섹션(터치타겟·hover부재·SafeArea·FlatList·네이티브 a11y·제스처·결정론) + Plat=both 공통행.
- 재배정 큐: 없음.
- 열린 delta: `native-deltas-provisional.jsonl` 최근 4건(r25/a 라이브 재계산 히어로값+철회, r26/a 비-a11y 채널 과장 금지 일반화, r27/c 3상태 행+단일 라이브리전 호이스트, r28/c 카피템플릿 반복+바이트동일 스타일 탐지 신호) 전체를 GENERATE 프롬프트 본문에 "최근 라운드 교훈"으로 녹였다.
- **Q57 교정 적용** — 직전 라운드(`r29`, no-winner)가 지목한 "구조가 가장 가까운 단일 참고 파일 지정 → 3/3 복제" 문제의 처방(가)를 이번 라운드부터 적용: GENERATE 프롬프트에서 어떤 기존 파일 경로도 "구조 참고용"으로 지정하지 않았다. 관례(토큰 import 경로·StyleSheet 패턴·a11y 매핑·파일 분리)는 전부 문장으로만 전달했고, 각 designer에게 "기존 화면 파일을 열지 마라(tokens.ts만 예외)"를 명시했다.
- 기존 카탈로그 전체 도메인(`native/screens.json`, 29개 기존 화면 + r23~r29 evolve 15개) 확인 후 미사용 도메인 3종 선정: **Subscription Plan Management** / **Linked Marketplaces Sync** / **Promo Code Wallet** — 기존 도메인과 중복 없음.
- **밴드 폼 배정** — 최근 3라운드 중 2라운드(`r25/a`·`r26/a`) blocked-workflow가 우승, `r28/a`도 같은 폼이라 **blocked-workflow를 이번 라운드 전원에서 의도적으로 배제**(r29가 이미 같은 판단을 내려 효과를 봤다 — 아무도 blocked-workflow를 안 씀). 대신 GENERATION.md §3이 명문화한 나머지 유효 폼을 하나씩 배정: a=파괴적확인 밴드(화면 전체), b=행단위 3상태(선택-바도 블록-워크플로도 아님, 화면 전체 고정 밴드 없음), c=선택구동 컨텍스추얼 바.

## §2 GENERATE

3개 독립 `general-purpose` 서브에이전트(서로의 산출물 비가시) 병렬 디스패치. designer에게는 조립한 브리프 전문(RN idiom·토큰 실값·DNA·a11y·결정론·산출구조·anti-duplication 목록)을 프롬프트 본문에 직접 적어 전달했고(경로만 주지 않음), **tsc·게이트 실행 지시는 포함하지 않았다**(오케스트레이터가 §3에서 수행).

| v | 화면 | 밴드/행 폼 | export |
|---|---|---|---|
| a | **Pro Seller Plan**(Subscription Plan Management) — 유료 셀러 플랜 관리, 구독 취소 | 파괴적확인 밴드: `bandPhase: "steady"\|"verifying"\|"terminated"`, 확인문구 자신이 `accessibilityRole="alert"` | named `SubscriptionPlanScreen` |
| b | **Linked Marketplaces**(Linked Marketplaces Sync) — 셀러의 외부 마켓플레이스 연동 목록, 1개 주 동기화원은 영구 잠금 | 행단위 3상태(idle/confirming/locked-no-control), 단일 호이스트 라이브리전(헤더 아래 상시 마운트 캡션) | default `LinkedMarketplacesSync` |
| c | **Promo Code Wallet** — 바이어의 프로모 코드 지갑, 다중선택 일괄 보관 | 선택구동 컨텍스추얼 바: `selectedCount = selectedIds.size`(Set 파생), count===0일 때 트리에서 완전 부재 | default `PromoCodeWallet` |

각 candidates/{a,b,c}.md에 컨셉 + "브리프에 없던 것"(2~4건씩) 기록 완료. 등록(`screens.ts` import+COMPONENTS, `screens.json` check)은 오케스트레이터가 3개 designer 완료 확인 후 일괄 수행(동시 편집 충돌 방지).

소스 동결 SHA-1(최초): `2e0c28d24c4430b68ce119683f946a1db7483d1f` — §3-1 정제 조치 후 재동결: `e5f195b8d38c8f31189ccd29a8ea97b3ae383b95`(SCORES.md에 최초 해시 기록, 아래 §3-1에 재동결 해시 기록).

## §3 HARD GATE

`node scripts/gate.mjs --target native --screens evolve-r30-a evolve-r30-b evolve-r30-c` → **12/12 1차 통과, 1-fix 불요, blockedBy 없음.** 상세는 SCORES.md.

## §3-1 판정 후 수정 (규칙 위반 해소에 한함)

렌즈1이 승자 c(아래 §4)의 `StatusPill` 컴포넌트에서 `native/GENERATION.md` §1 위반을 지목: 조건부 배경/글자색을 `StyleSheet.create` 변형이 아니라 **인라인 병합 스타일**(`style={[styles.statusPill, { backgroundColor: ..., borderColor: ... }]}`)로 구현 — a·b는 같은 문제(상태별 배지 색)를 전부 명명된 StyleSheet 변형으로 풀었는데 c만 인라인이었다.

- **조치**: `StatusPill`을 `statusPillActive/ExpiringSoon/Expired`·`statusPillTextActive/ExpiringSoon/Expired` 6개 명명 변형으로 재작성, 상태→변형 매핑은 순수 함수(`statusPillVariant`/`statusPillTextVariant`)로 분리. 인라인 스타일 객체 완전 제거. 토큰 값 자체는 변경 없음(취향·완성도 개선 아님 — 순수 관용구 치환).
- **재게이트**: `node scripts/gate.mjs --target native --screens evolve-r30-c` → 1차 tsc 실패(`TS2769`, `keyof typeof styles`가 View/Text 스타일 유니온을 구분 못함) → `ViewStyle`/`TextStyle` 반환 타입의 순수 함수로 재수정 → **재게이트 4/4 클린**(tsc·export·render·iframe 전부 통과). 재동결 SHA-1(c만): 전체 3후보 합산 `e5f195b8d38c8f31189ccd29a8ea97b3ae383b95`.
- **순위 재계산 없음** — 이 수정은 인라인→명명 StyleSheet 치환이라는 좁은 관용구 교정이고, 토큰 값·레이아웃·동작은 그대로다. §4 판정 결과(아래)는 이 수정 전 산출물에 대한 것이지만, 수정이 판정을 뒤집을 만한 것이 아니므로(렌즈1도 이 결함 하나만으로 c를 3위로 내린 것이지 c가 1위였다면 재판정했을 것) 재판정하지 않는다.

## §4 JUDGE 패널

screenshots: 390px·768px × {a,b,c} = 6프레임, `shots/`(정제 조치 이전 산출물 기준 — §3-1 설명대로 재판정 대상 아님).

**렌즈1 (DNA 준수)**: 1위 a, 2위 b, 3위 c. a↔b는 근소 차(둘 다 사실상 규칙 완벽 준수) — a는 GENERATION.md §3 문구("확인 문구 자체를 같은 라이브 리전이 낭독")를 가장 문자적으로 구현(밴드 컨테이너가 `polite`, 확인/결과 문구 자신이 `alert`). b는 더 어려운 버전(다중 행 3상태 + 잠금 행에 Pressable 자체가 없음)을 풀었으나 행별 확인문구가 아니라 헤더 배너가 `alert`를 지는 구조라 타이브레이커에서 a에 밀림. c는 선택바 교리(Set 파생 count, count=0시 트리 부재)는 정확했으나 `StatusPill` 인라인 스타일(§1 위반, 위 §3-1에서 해소)로 3위.

**렌즈2 (모바일 완성도)**: 1위 c, 2위 b, 3위 a. c가 12행 다중선택 + 실제로 증명 가능한 파생값(아카이브 후 헤더 카운트가 같은 `codes` state에서 재계산 — 드리프트 불가, §5 delta 참조)으로 최고 인터랙션 밀도. b는 6개 독립 행 상태기계 깔끔하나 파생값 증명 사례 없음, 768px에서 Disconnect 버튼 주변 여백 과다. a는 선형 단일 상태기계라 상대적으로 인터랙션 밀도 최저, 768px에서 4개 fact-row의 `space-between`이 반복적으로 큰 공백을 만들어 "휴대폰 레이아웃을 그대로 늘린" 인상 중 가장 뚜렷.

**렌즈3 (차별성)** — **no-winner 아님, 명시적으로 전 라운드(r29)의 카탈로그급 위반 재발을 전체 스타일블록 대조로 확인·배제**: 1위 c, 2위 a, 3위 b. Q57 처방(참고 파일 미지정) 적용 후 **파일 단위 복제(50~85% 블록 일치) 0건** — r29의 심각한 위반은 재발하지 않았다. 다만 저빈도 카피템플릿 반향 2건 발견: a의 `"...This can't be undone from here."`가 구조적으로 무관한 `r25/c`와만 겹침(2/30+ 파일), b의 `"...will stop syncing"`류 문장이 b의 직접 도메인 사촌 `r26/c`(LinkedBankAccountsScreen)와 템플릿 단위로 겹침 — 순위를 뒤집을 근거로는 쓰지 않되 가장 구체적인 신호라 b를 3위로 내리는 데 반영. c는 카피템플릿 반향 0건, 선택-바 도메인 사촌(`r29/b` DraftListings)과도 스타일 블록 실측 대조 결과 겹침 없음(공유 위젯 관용구만 확인, 별도 §6 참조). `questions-queue.md` **Q59**로 적재(위).

## 집계 및 판정

렌즈1=a, 렌즈2=c, 렌즈3=c → **2:1 다수결로 c(Promo Code Wallet) 승자.** 억지 승자 아님 — 렌즈1의 반대표는 §3-1에서 해소된 단일 관용구 위반(인라인 스타일)이 근거였고, 그 외 DNA 준수 자체는 c도 깨끗했다(렌즈1 자신이 "a vs b는 근소, c는 구체적 결함 하나로 3위"라고 명시).

## §5 LEARN

승자 c의 판정 사유에서 재사용 가능한 delta 1개를 추출해 `native-deltas-provisional.jsonl`에 append:
- round: auto-native-r30 / variant: c / level: L1 / status: provisional
- 요지: "파생값이 드리프트 불가 증거로 읽힌다"는 기존 원칙(r25/a, blocked-workflow 밴드의 라이브 히어로값)이 **선택구동 컨텍스추얼 바** 폼으로 일반화됨 — 헤더 집계 스탯이 바의 벌크 액션이 변경하는 바로 그 state에서 `useMemo`로 파생되면(별도 수동 카운터 아님) 완성도 렌즈가 "드리프트 불가"의 최강 증거로 인용한다. 1회 관측(선택-바 폼에서는 첫 사례)이라 L2 승격 보류, 원문에 그 이유를 명시.

## §6 지식 정제 게이트

- 클러스터링: 이번 라운드의 새 delta는 기존 L1(r25/a)의 **일반화**이지 충돌이 아니다 — 원문이 재현 주장("generalizes r25/a...")을 명시하므로 그 주장을 검증했다: 밴드 폼이 다르다(blocked-workflow vs 선택-바)는 점에서 기법은 다르지만, [[curation-criteria]] Q6 원리("같은 결함/증명이 다른 경로로 도달해도 같은 클래스")에 따라 **결함/증명 클래스는 같다**(공유 state에서 파생 vs 수동 병행 카운터) — 채택, L1로 적재(이미 §5에서 수행). L2 승격은 보류(동일 폼 내 2라운드 재현 요건 미충족, 원문에 명시).
- 레벨 재책정: 기존 열린 delta(r25~r28) 중 이번 라운드에서 추가 재현된 것 없음 — 변경 없음.
- 질문 강제 생성: ① Q57 처방 적용 후에도 저빈도 카피템플릿 반향이 남았다(충돌이라기보다 미해결 잔여 신호) → **Q59**로 적재(위, 신규). ② meta-기준 정당화 불가 사례 없음.

## §7 기록

- `auto-ledger.jsonl`에 target=native, round=auto-native-r30, winner=c, no_winner=false로 append.
- `vault/index.md` "세대 기록"에 `[[20-generations/2026-10-05-auto-native-r30/DECISION|auto-native-r30]]` 등재.
- 정본(`dash-brief-v3.md`·`design-principles.md`) 무변경. `native/GENERATION.md`·`tokens.ts` 무변경(이번 라운드 L2/L3 승격 근거 없음). `/dash` 갤러리·`/v1~v5` 무변경.
- 후보 route(`native/src/evolve/r30/*`)·`screens.ts`/`screens.json` 등록 유지 — 최종 카탈로그(`native/screens.ts`의 영구 섹션) 편입 여부는 `/dash-falsify apply`의 킵 결정에 달려 있다(이 스킬은 evolve 누적만 다룬다).
- native-deltas-provisional.jsonl: append-only, 1건 추가(§5). questions-queue.md: Q59 신규 추가.
