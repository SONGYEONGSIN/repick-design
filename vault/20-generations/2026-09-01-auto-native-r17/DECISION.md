# auto-native-r17 — DECISION

타깃: native · 라운드: 17 · 날짜: 2026-09-01 · 큐 결정: PAGE_TYPES 미채움 0건 → 이번 실행에서 이미 생성한 landing 제외 → dash/native 난수에서 native 당첨(월요일 고정 주기 미해당, 화요일).

## 후보

- **a — Seller Performance Scorecard**: 셀러 전용 비공개 read-only 분석 대시보드(응답시간·정시배송률·평점추세·티어진행). 상시노출 액션바("Share scorecard").
- **b — Item Authentication Submission** (승자): 리스팅 등록 전 아이템 정품감정 제출 플로우. 5개 필수 참조사진 슬롯 + 정확성 선언 체크박스가 제출을 실제로 게이팅하는 막힌 워크플로 상태기계(이유 문장 + jump-to-blocker `scrollToIndex` 둘 다 구현). 제출 후 4단계 심사 타임라인으로 전환.
- **c — Price Suggestion & Market Comps**: 리스팅 등록 중 셀러용 AI 가격제안 도구. 5개 비교판매 완료매물의 최신성×컨디션 가중평균으로 제안가 산출, 실시간 조정 가능. 상시노출 액션바("Continue with ₩X").

## §3 하드게이트

소스 동결 해시(§2 종료): `d53325fcf62ee7c38757f7ea50ea95f387d698a2`

**12/12 게이트 1차 통과, 1-fix 미소모** (tsc·export·render·iframe × 3후보). 환경 부트스트랩: `native/node_modules` 미설치 → `npm install`(503 packages, 스킬 밖 절차, r12·r14·r16 선례와 동일). 상세: SCORES.md.

## §4 JUDGE — 2:1 다수결

| 렌즈 | 1위 | 2위 | 3위 |
|---|---|---|---|
| 렌즈1(DNA/a11y 준수) | b | c | a |
| 렌즈2(모바일 완성도) | b | c | a |
| 렌즈3(화면유형 차별성) | c | a | b |

**승자: b.** 렌즈1·2 이중다수 vs 렌즈3 단독. 완전동률(1-1-1)이 아니므로 curation-criteria의 tie-break 예외(렌즈3이 렌즈1 1위를 최하위로 판정 시 제외)는 이번 라운드에 해당하지 않는다 — 단순 2:1 다수결로 확정.

- **렌즈1**: b가 이 라운드의 핵심 요구(막힌 워크플로 밴드의 양쪽 절반 — "왜 막혔나" 문장 + 실제 jump-to-blocker)를 완전 구현(`ItemAuthenticationScreen.tsx:84-102, 112-115`), 라이브 리전도 정확히 1개(컨테이너 polite + 전환 문장에만 alert). c는 접근성 설계 의도(주석)는 맞았으나 실제로 `accessibilityRole="alert"`을 어디에도 걸지 않아(grep 0건) 스크린리더가 실제로 낭독하지 않는 결함이 있었고(GENERATION.md §4 "빠뜨리면 그 결여만으로 감점" 조항 직접 해당), a는 라이브 리전을 2개 동시 마운트(§4 "두 개 이상 두지 마라" 직접 위반) + ScrollView 안에 FlatList 중첩(RN 안티패턴, b·c는 단일 최상위 FlatList).
- **렌즈2**: b의 게이팅 메커니즘이 가장 상업적으로 설득력 있음 — `blocking` 파생상태가 실제 useMemo, 제출 전후로 화면 전체(체크리스트→4단계 심사 타임라인)가 구조적으로 바뀜. c도 실측 검증된 실가중평균(₩167,320→₩167,000, 콤프레인지 ₩131,000~196,000까지 수동 재계산으로 일치 확인)과 최선의 태블릿 반응형(`useWindowDimensions` 기반 바 폭 조정)으로 근소 2위. a는 계산값(94.4%·80.5)은 진짜지만 추세 문구 3개가 하드코딩 리터럴(계산은 검증됐으나 c의 완전 파생 방식보다 약함)이고, 768px에서 차트가 고정폭(300px)이라 넓은 여백만 남는 미검증 단일브레이크포인트 문제.
- **렌즈3**: c가 `detail`(단일 리스팅 자기 가격이력)·`match`(구매자측 매칭)와 가장 명확히 구분되는 신규 형태(다중 콤프 가중평균 + 레인지바)로 1위. a는 `storefront`(공개 프로필)·`membership`(티어 비교표)와 구분되나 근소한 차이(개인 진행률 vs 티어 비교)로 2위. b는 `certificate`(완료된 정적 기록)·`listing`(일반 등록폼)과는 명확히 다르나, `verification`(셀러 신원인증)과 인터랙션 형태(필수사진 체크리스트→차단상태→제출→날짜별 심사 타임라인)가 구조적으로 매우 유사한 "verification 템플릿을 아이템에 재적용"으로 읽힐 위험을 지적해 3위.

## §3-1 판정 후 수정
불요 — 승자 b는 렌즈1·2·3 전원에서 규칙 위반이 지적되지 않았다(c의 alert 누락, a의 라이브리전 중복·ScrollView중첩은 각각 2·3위 후보의 소견이며 승격 대상 아님).

## §5 LEARN
아래 delta 1건을 `native-deltas-provisional.jsonl`에 L1 provisional로 적재. 핵심 주장: 화면유형(렌즈3)과 실행완성도(렌즈1·2)가 상충할 수 있다 — b는 기존 `verification` 화면과 인터랙션 골격(필수항목 체크리스트→차단→제출→타임라인)을 공유해 렌즈3에서 최하위였으나, 그 골격 안에서 막힌워크플로 밴드의 양쪽 절반을 최초로 완전 구현하고 라이브리전을 정확히 1개만 배치한 것이 렌즈1·2 이중승리의 근거였다 — "익숙한 골격 재사용"과 "그 골격을 얼마나 정확히 구현했는가"는 별개 축이며 후자가 이번 라운드 다수결을 결정했다.

## §6 지식 정제 게이트
- 클러스터링: 재현 주장 없음(신규 관측) — 검증 대상 없음.
- 레벨 재책정: 기계 검증 불가(판단 사안), 2라운드 미재현 — **L1 유지**.
- 충돌 쌍: 렌즈3 대 렌즈1·2의 견해차는 위 delta로 포착했으나 완전동률이 아니라 판정 체계 충돌로 볼 근거가 부족 — 질문 큐에 신규 항목을 강제하지 않는다.
- 부수 관측(delta 승격 대상 아님, 기록만): c의 `accessibilityRole="alert"` 누락(라이브리전 무낭독) — GENERATION.md §4 조항이 명시하는 실패 패턴의 재현 사례. a의 라이브리전 2개 동시 마운트 — 같은 §4 조항의 다른 위반 형태. 둘 다 승자에 영향 없으나 다음 라운드 designer 프롬프트에 반복 강조할 가치가 있다(단, 이미 GENERATION.md에 명시된 기존 규칙의 위반 사례일 뿐 새 규칙이 필요한 것은 아니므로 정본 수정 불필요).

## 환경 고유 조치(스킬 밖)
- `native/node_modules` 미설치 → `npm install`(503 packages).
- Playwright 다운로드가 프록시 차단 → `PW_CHROMIUM_PATH`/`CHROME_PATH`/`PW_NO_SANDBOX=1`로 세션 사전설치 chromium 재사용 (r9~r24 선례와 동일 계열).
- **신규**: `npx playwright screenshot` CLI는 `PW_CHROMIUM_PATH`를 존중하지 않고 자체 브라우저 다운로드를 시도해 프록시에 차단됨 — `validate.sh`와 동일하게 `chromium.launch({executablePath: process.env.PW_CHROMIUM_PATH})` API를 직접 호출하는 별도 스크립트로 스크린샷을 우회 촬영(`capture-shots.mjs`/`gate.mjs`/`validate.sh` 등 기존 스크립트 자체는 무수정 — 이번 세션 로컬 스크립트 하나만 임시 작성).

## no-winner 여부
아니오 — 2:1 다수결로 b 승격.
