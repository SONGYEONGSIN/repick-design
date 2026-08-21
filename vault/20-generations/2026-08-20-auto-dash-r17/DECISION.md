# auto-dash-r17 — DECISION

- 일자: 2026-08-20
- 타깃: dash · 라운드 r17 (연속 실행 2라운드 중 2라운드째 — 1라운드는 landing r13)
- 판정 동결 해시: `a07dcdaba1f9ddda7ecceb3960f2769b26edf938` (§3 SCORES.md 참조)
- 후보 소스: `app/src/app/dash-evolve/r17/{a,b,c}/`
- 프레임: 후보당 4장(`<v>-1440.png`·`-1440-s70.png`·`-1920.png`·`-390.png`)

## 후보 요약

- **a — Backhaul**: 반품·리퍼 역물류 콘솔. Funnel/Flow spine(6단계 퍼널, 해칭 드롭오프 웨지) + 스테이지 드릴 인스펙터. dark, indigo, wide.
- **b — Bayline**: 정비 베이 스케줄러(트럭 터미널 8베이). 6주×7일 캘린더 히트맵 spine + 데이 드릴 아젠다, 마스터-디테일 좌우 분할. light, blue, 디스플레이 활자 없음.
- **c — Trussline**: 클라우드 비용 리컨실리에이션 콘솔. 8-드라이버 워터폴 spine + 러닝토탈 원장 + 서브드라이버 드릴. dark, lime, mono.

## 하드게이트 (§3)

**전원 9관문 1차 통과 · 1-fix 0회** — a11y 100/100/100. designer 3명이 자기 폴더 내 자체검증(tsc·정적·Tab 포커스·스크린샷·폭 스윕)을 거쳐 제출. `auto-landing-r9` 이후 두 번째 무수정 통과 라운드.

상세: [[20-generations/2026-08-20-auto-dash-r17/SCORES|SCORES]]

## JUDGE 패널 (§4) — 2:1 다수결, 승자 **c**

| 렌즈 | 1위 | 2위 | 3위 |
|---|---|---|---|
| 렌즈1 (브리프 준수) | **b** | c | a |
| 렌즈2 (상용 완성도) | **c** | b | a |
| 렌즈3 (아키타입 차별성) | **c** | b | a |

**집계: c 2표(렌즈2·3) — c 승. a는 3렌즈 전원 만장일치 3위.**

### 렌즈1 (브리프 준수) — b 1위
b가 "가짜 라이트 금지"(v2 세대 전원 탈락 원인 1호)를 가장 정확히 만족(순백/zinc-50, zinc-100 헤어라인) + 상태분기 대비를 표면톤 조건부로 가장 정밀하게 구현(세그먼트 트랙 `bg-zinc-100`엔 `zinc-600`, 카드 표면엔 `zinc-500` 분리 — page-brief-core §2 문면 그대로). c는 데이터 정합·상시노출 값 표기에서 최강이나 값 축이 렌즈1이 아닌 렌즈2·3에 실린다고 명시.

### 렌즈2 (상용 완성도) — c 1위
워터폴이 막대마다 화살표+부호값+러닝토탈을 동시 표기해 호버 없이 즉시 가독. 리컨실리에이션이 세 후보 중 가장 엄밀(서브드라이버 합=드라이버, opening+net=closing 배지, 공유율 합 100.000000%). b는 요일별 SHARE 열 반올림 합이 101%인데 TOTAL 행은 100%로 찍히는 작은 산술 이음매를 지적받아 근소하게 2위. a는 held-units 빈 상태·필터까지 갖춘 테이블 완성도는 최고였으나 퍼널 인코딩(밴드폭+해칭)이 가장 해독을 요구하고, 390px에서 퍼널 본체 검증 프레임이 예산 밖이라 "증명된 완결성"에서 b·c에 못 미침.

### 렌즈3 (아키타입 차별성) — c 1위, a는 최하위+수렴 경고
Q6식 판정: 워터폴/브리지는 `/dash` 카탈로그(d29~d48) 어디에도 없는 진짜 신규 지배시각화. b(캘린더 히트맵)는 d40 Cadence·d46 Crewline·d30 Slotted와 메커니즘 동일(도메인 스킨만 다름)이라 파생으로 판정하되, 이 라운드 안에서는 유일하게 마스터-디테일 좌우분할이라 골격 자체는 차별화. a(퍼널)는 d36 Chute와 동일 메커니즘 파생일 뿐 아니라, **셸+드릴 모델이 c와 코드 수준으로 거의 동일**(`selectedId` 상태를 `<Viz selectedId onSelect>`+`<Ledger selectedId onSelect>`+`<Inspector row=selected>`로 똑같이 배선, `ConsoleClient.tsx` vs `TrusslineClient.tsx`)해 "퍼널 글리프를 워터폴로 바꿔도 아무도 눈치 못 챌" 수준의 상호치환성 지적 — 매크로 골격을 서로 다르게 배정해도 그 아래(셸 크롬·KPI 4타일·섹션 리듬·선택동기화 문법·⌘K)에서 3/3 수렴하는 현상의 재관측(r10/r12/r15와 같은 결함 클래스).

## 정제 조치 (§3-1)
없음 — 3후보 전원 1-fix 없이 원판정 상태로 승격.

## LEARN — 격리 적재 delta (§5)

```
target: dash · round: auto-dash-r17 · variant: c
delta: 매크로 골격(지배 시각화 종류)을 서로 다르게 배정해도, designer 셋이 독립적으로 같은 "선택→다중위젯 동기화" 배선 패턴(단일 selectedId state를 Viz/Ledger/Inspector 3컴포넌트에 동일 프롭 이름·동일 순서로 threading)에 수렴하면 렌즈3이 그 둘을 "글리프만 다른 상호치환 가능한 셸"로 판정해 최하위로 내린다 — 지배 시각화 자체의 신규성과 무관하게, 선택동기화 배선 문법까지 수렴하면 차별성 점수를 깎는다. r10/r12(매크로 버킷)·r15(인터랙션 문법)·r11-landing(산식)에 이은 "배정을 내려도 그 아래에서 수렴한다" 패턴의 dash 4번째 재현이며, 이번엔 트리거가 "selectedId 배선 관용구" 자체였다.
evidence: "렌즈3 — a·c 비교: 'FunnelFlow를 WaterfallChart로 바꿔도 아무도 셸이 바뀐 걸 눈치채지 못할 것 — 퍼널 글리프가 a의 아키타입을 c와 가르는 유일한 것이다', 'ConsoleClient.tsx:159,165,186 vs TrusslineClient.tsx:182,185,207,210 — selectedId를 Viz+Ledger+Inspector 3컴포넌트에 동일 패턴으로 threading'"
judge_votes: {lens1: 'b', lens2: 'c', lens3: 'c'}
confidence: low (1라운드 관측, 재현 대기 — dash-brief-v3 §레이아웃 아키타입 다양화의 "매크로 골격 아래 수렴" 각주와 같은 계열이나 트리거가 다름)
level: L1
status: provisional
```

## 질문 강제 생성 (§6)

기존 질문(Q14·Q22 "수렴이 층위를 옮긴다")과 충돌은 아니나 정확히 같은 현상의 새 트리거(selectedId 배선 관용구)라 별도 질문을 새로 열지 않고 위 delta로 기존 관측 계열에 편입. 신규 충돌 쌍 없음.

## 스크린샷·PR 링크
`vault/20-generations/2026-08-20-auto-dash-r17/shots/{a,b,c}-{1280,1440,1920,390}[-s35|-s70|-s100].png` (48장, blank 0건)

## 승자
**c** — 최종 카탈로그 승격 후보로 표시 (승격 자체는 `/dash-falsify apply`에서 사람 리뷰 거쳐 결정, 이 라운드는 evolve/dash에 후보 3종 전부 유지).

## 연속 라운드 메모
이번 실행(2라운드)에서 landing(r13)·dash(r17) 각 1회씩 완주. 다음 `/dash-evolve` 실행 시 §0 미채움 큐를 다시 조회(현재 전 타입 채움 상태 유지 시 dash/landing/native 균등 난수로 복귀)하고, 이번 실행에서 이미 뽑은 landing·dash를 제외 대상으로 고려할지는 그 실행 시점의 큐 상태에 따른다(스킬 §0 문면 그대로).
