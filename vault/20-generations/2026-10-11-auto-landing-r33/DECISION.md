# auto-landing-r33 — DECISION

목표(라운드 수 확정): `node scripts/round-budget.mjs 2` → **1** (미채움 페이지 타입 0종 — `app/src/lib/works.ts` `PAGE_TYPES` 18종 전부 등재됨). 호출자가 2를 줬지만 스크립트가 1을 내 **1라운드만 돈다** — 스킬 §0-0-1 규율대로 첫 절에 명기한다. `--explain` 출력: "미채움 0종 — N≥2 의 근거(커버리지)가 없다". 오늘(2026-10-11, UTC 일요일)은 월요일이 아니므로 native 고정 주기도 해당 없음 → 타깃 난수 결정(§0 TARGET 스크립트) = **landing**.

서브에이전트 가용성(§0-0): `Agent` 도구 존재 확인. 이 환경에는 `designer`/`comparator`류 전용 에이전트 타입이 등록돼 있지 않아(가용 타입: claude, claude-code-guide, Explore, general-purpose, Plan, statusline-setup) 생성·판정 전부 `general-purpose`로 대체했다 — 블라인드·독립 전제(서로 다른 세션, 서로의 산출물 비공개)는 그대로 유지했으므로 `self_judged` 편차 고지는 불필요.

재배정 큐(§1): `reassign-queue.md` "대기 중" 확인 — landing 타깃 항목 없음(유일한 대기 항목 #11은 target:dash). 이번 라운드는 재배정 소비 없음.

## 타깃
- target: landing
- round: auto-landing-r33 (landing 타깃 최대 라운드 32 + 1)
- run dir: `vault/20-generations/2026-10-11-auto-landing-r33/`

## 다양성 축 (GENERATE 전 `scripts/catalog-variety.mjs`)
- theme: dark 36 · light 29
- accent: amber 8 · teal 8 (최다, 금지) · violet-hex 7 · blue 6 · indigo 6 · cyan 5 · emerald 5 · rose 5 · sky 5 · orange 3 · violet 3 · lime 2(직전 r32 승자 축, 금지) · green 1 · blue-hex 1
- face: pretendard 29(직전 r32 승자 — 디스플레이 미지정, 이번엔 전원 디스플레이 지정) · mono 13 · grotesk 12 · wide 11
- 배정: a=dark/orange/grotesk · b=light/green/wide · c=dark/sky/mono — amber·teal·lime 전부 회피, 세 후보 face 전부 다르게.

## GENERATE — 3후보 (매크로 디바이스 배정)
- **a — "Priority Orbit System"**: 5기준(스타일·사이즈·예산·컨디션·판매자신뢰)이 중앙 허브(합성 매칭 점수) 둘레 동심원 궤도에 배치되고, 궤도 반경이 그 기준의 현재 가중치를 인코딩(가중치↑ → 궤도 반경↓, 영점합 재정규화). 기존 카탈로그의 wedge형 radial gauge(r5/r18)·세그먼트 ring(r25)·static node-graph(r8)·2D quadrant(r21)와 구별되는 신규 지오메트리로 배정.
- **b — "Ledger Calendar"**: 96건 실거래 비교매물의 월×가격대 캘린더 히트맵. 등급/인증/판매자 필터 토글이 그리드 셀 커버리지를 실시간 재분류. 기존 histogram(r23, 1축 재버킷팅 bar)·bridge(r24, 순차 bar)·marimekko(r30, 중첩 사각형)·treemap(r27, 면적분할)과 구별되는 2축 그리드 지오메트리로 배정.
- **c — "Pulse"**: 5개 검수 항목이 연속 단일 파형(오실로스코프형 SVG path) 위 구간별 진폭으로 인코딩, 토글 시 해당 구간만 진폭 변화. 기존 2D scatter(r21)·spec-grid(r13)·bridge(r24, 이산 bar)와 구별되는 연속 단일 라인 지오메트리로 배정.

3후보 전원에 열린 delta 핵심 지시 전달: nested `overflow-x-auto`+grid `contain:layout` 교훈(r25) · `whileInView` mount-gate `useSyncExternalStore`(r28) · 클로징CTA 문장+버튼 라벨 이중 echo(r30/r32) · 정적 데이터에 "실시간 갱신" 과장 카피 금지(r30) · `aria-hidden`으로 `label-content-name-mismatch` 못 고침(r24 L2) · ghost 텍스트도 `aria-hidden` 무관 3:1(r14 L2, 이미 코어 반영) · 0.44em 줄길이 상수(r11 L2, 이미 반영) · 히어로 컴포넌트 자체 안에 증명 카드(r16 L2, 이미 반영) · 상시 헤더(r22) · r28/r29/r31/r32 가 반복 재현한 "디바이스가 달라도 카피/그리드 템플릿은 수렴한다"에 대한 구체 회피 목록(헤드라인·서브헤드·CTA 문구·col-span 7/5/12 템플릿 예시 제공).

## HARD GATE (상세: SCORES.md)
- a: 1차 클린(10/10).
- b: 1차 클린(10/10).
- c: 1차 `a11y` 96 — `color-contrast`(히어로 CTA 버튼, 흰 글자 on `#2FB6FF` = 2.26:1, AA 4.5 미달). **1-fix 1회**: 버튼 전용 신규 토큰 `ACCENT_BUTTON_FILL=#1478AE`(흰 글자 대비 4.85:1) 도입, 그 외 `ACCENT`(#2FB6FF) 용도(웨이브폼 스트로크·토글 보더 등 비텍스트)는 무변경. 재게이트 10/10 클린.

동결 해시(§2, 수정 후 최종): `8e8644a81ad31a595e052a381bb67b5fb0a92488`
(`cat app/src/app/landing-evolve/r33/*/*.tsx app/src/app/landing-evolve/r33/*/*.ts | shasum`)

## JUDGE 패널 — 3렌즈 병렬, 블라인드 (각 렌즈에 후보당 4프레임: `<v>-1440`·`<v>-1440-s35`·`<v>-1440-s100`·`<v>-390`, 소스 전문. candidates/*.md 열람 금지로 블라인드 유지)

### 렌즈1 — 브리프/DNA 준수
**순위: a(1위) > c(2위) > b(3위).** No-winner 아님.
- a: 히어로 zero-scroll 완전 충족(Hero.tsx:23-133, 헤드라인·서브·단일CTA·증명행 전부 Hero 자체 트리 내부, `a-1440.png` 확인). 배지 비오버레이, hover-게이팅 없음, orbit-math.ts:61-96 실제 가중재분배 추적 확인, 클로징CTA 문장+버튼라벨 이중 echo(`See your {score}% {leading}-led matches`), 시장갱신 과장 카피 없음(명시 disclaim), 웨이트 정확 3종, 한글 0건. 약점(경미): accent 대비 계산이 소스 내 직접 표기 아님(콘셉트 노트 참조만), 모바일에서 orbit 디바이스 자체는 스크롤 필요(zero-scroll 적용 범위 불명확, 경미 미확인으로 플래그).
- c: 히어로 zero-scroll도 가장 완전(헤드라인·서브·듀얼CTA·증명 `dl`·전체 Pulse 디바이스 전부 zero-scroll). **단, "단일 CTA" 조항을 명시 위반** — Hero.tsx:57-73에 CTA 2개 나란히 렌더(`c-1440.png` 확인). accent 대비 계산을 소스 내 직접 전개(theme.ts:1-21, 유일하게 작업을 보여줌), near-monochrome 절제 가장 양호.
- b: 히어로 증명카드는 Hero 자체 트리 내부(정상)이나, **디바이스(LedgerCalendar) 자체가 scroll 0에서 일부만 보임**(6행 중 3행만, 범례·통계패널 전부 폴드 아래 — `b-1440.png` 확인) — zero-scroll 조항을 디바이스까지 포함해 읽으면 구조적 결함. accent 대비 계산 소스 내 근거 전혀 없음(grep 0건), 세 후보 중 accent 면적/채도 가장 높음(그리드 72셀 다수가 기본 상태에서 이미 초록으로 채워짐).

### 렌즈2 — 상용 완성도
**순위: a(1위) > b(2위) > c(3위).** No-winner 아님.
- a: 디바이스 풍부도 최고 — 슬라이더 1회 조작이 5개 궤도 반경+허브 점수+5개 슬라이더 readout+리딩기준 강조+하위 catalog-clears 카운트까지 동시 재계산(전부 orbit-math.ts 추적 확인, 장식/고정값 0건). 헤드라인-디바이스 결속("Five criteria. One score. Your priorities move it."). 클로징 CTA 이중 echo. 정직성(재갱신 과장 없음). 4프레임 전부 결함 0건.
- b: 디바이스도 풍부(필터 1회가 72셀 그리드+통계패널+호버readout+aria-live 동시 재계산), 실데이터 96건 기반으로 가장 "데이터 근거"가 두드러짐. 클로징 CTA 이중 echo. 경미한 완성도 결함: Hero 증명행은 "−30%"로, ProductPreview 카드는 `%` 기호 위치가 뒤집혀 "% 30"로 렌더(ProductPreview.tsx:69-72) — 같은 개념에 두 가지 다른 표기.
- c: 디바이스 풍부도·CTA 문자 그대로 인용은 셋 중 가장 타이트하나, **`c-390.png`(모바일)에서 히어로 서브헤드 문단이 3줄 전부 동일 x좌표에서 잘림**(줄바꿈이 아니라 텍스트 클리핑) — 12장 스크린샷 전체에서 발견된 유일한 "깨진 레이아웃" 결함. 근본원인은 소스만으로 미확정(렌즈2가 b의 명시적 `grid-cols-1` 베이스 클래스 유무를 가능한 기여 요인으로 제시했으나 "unconfirmed"로 명시).

### 렌즈3 — 아키타입 차별성
**순위: c(1위) > b(2위) > a(3위).** No-winner 아님. 셋 다 지오메트리 자체는 기존 목록과 구별됨을 확인(배정이 스킨만이 아니라 실제 렌더/코드로 실현됐는지 검증) — 순위는 "구별되는 정도"의 차이.
- c: PulseWaveform.tsx:84-91 단일 연속 `<path>`(이산 bar·세그먼트 arc 없음), waveform.ts의 Catmull-Rom 스플라인으로 실제 단일 라인 지오메트리 확인. 카탈로그 전체에서 주기적/파형 라인으로 값을 인코딩한 선례가 없어 가장 먼 이탈로 판정.
- b: LedgerCalendar.tsx 2축(월×가격대) 그리드 확인 — 기존 histogram(1축 재버킷팅)의 직접적 연장이라는 점에서(메커니즘은 "필터→재집계→재도색"으로 유사) c보다 이탈 폭이 작다고 평가.
- a: OrbitDevice.tsx:30-45에 실제 5개 완전한 동심원(`<circle>`, 호/세그먼트 아님) 확인 — 문자 그대로는 기존 wedge-gauge·segmented-ring과 구별되나, "중앙 허브+원형" 패밀리가 이미 3번째(gauge→ring→orbit)라는 점에서 아키타입 레벨 피로를 이유로 3위.
- **수렴 관측(순위에 미반영, 보고만)**: CTA 버튼 문구("Browse ___ listings/catalog" 템플릿), ValueSection 3-컬럼 그리드 구조, ClosingCTA 보더카드 구조, 히어로 그리드 비율(전부 근사 50/50 2컬럼)이 세 블라인드 후보에서 **동일하게** 수렴 — `curation-criteria` Q21·landing r28/r29/r31/r32 가 반복 기록한 "디바이스 배정이 다음 층위(카피/골격)의 수렴을 막지 못한다"의 **6번째 재현**. 세 후보에 대등하게 나타나 상대적 차별성에 손상이 없다고 판단해 순위에는 반영하지 않음(지시대로).

### 집계
1위 표: a 2(렌즈1·렌즈2) · c 1(렌즈3). No-winner 표 0. **2:1 다수결로 a 승리.** 완전 3파전 동률 아님 — tie-break 예외 불요.

이 결과는 `curation-criteria` "차별성 ↔ 완성도 상충 시 판정 방향"(2026-07-31 L2, 타깃 중립)의 또 다른 재현이다 — 렌즈3(차별성) 1위 후보 c가 렌즈1+렌즈2(완성도) 다수결에 패배했고, 결정적 차이는 c의 완성도 결함(히어로 듀얼 CTA 조항 위반 + 모바일 텍스트 클리핑)이 명시적으로 지목됐다는 점이다 — 추상적 "완성도 선호"가 아니라 두 렌즈 모두 citable한 구체 결함을 들었다.

## 3-1 판정 후 수정
승자 a에 대해 규칙 위반으로 지목된 사항 없음(렌즈1 약점 지적은 "소스 내 미표기"·"모바일 적용범위 불명확"으로 둘 다 규칙 위반이 아니라 문서화/모호성 지적) → **정제 조치 불필요.**

## 미확인 범위 (3렌즈 자진 신고 종합)
- 어느 렌즈도 실제 브라우저에서 디바이스를 조작하지 않음 — 전부 소스 추적 + 기본상태 스크린샷(4프레임/후보)으로 판정. 인터랙션 중간 상태(슬라이더 중간값, 필터 조합, 토글 off)의 실제 렌더는 미확인.
- `-1280`·`-1920`·`-s70`·모바일 중간/풀스크롤 프레임 미검토(각 렌즈 공통, 프레임 예산 지시에 따른 의도된 축소).
- 세 후보 스크린샷에서 Unsplash 원격 이미지가 전부 로드 실패(렌즈2 관측 — 샌드박스 네트워크 제약으로 추정, 세 후보 공통이라 특정 후보 결함으로 감점하지 않음). 최종 실 배포 환경에서의 이미지 렌더 품질은 미검증.
- c의 모바일 텍스트 클리핑 근본원인 미확정(관측은 확정, 원인은 가설).
- lens1/2는 contrast를 직접 axe/계산기로 재계산하지 않고 소스 문서화·대략 추정에 의존(a는 외부참조, c는 소스 내 명시값, b는 소스 내 근거 없음 — 이 자체가 렌즈 판단에 반영됨).

## LEARN — delta 1개 (아래 §LEARN 절 참조)

## 지식 정제 게이트 (§6)
DELTAS 전체(66 entries) 재로드·클러스터링 수행 — 신규 delta는 독립 결함 클래스(게이트 커버리지 공백)로 기존 어느 L1/L2/L3 항목과도 충돌하지 않음(재현 주장 없음 → 재현 검증 대상 아님). 타깃 교차 충돌 없음(dash 정본과 모순 없음). 신규 질문 생성 조건(①충돌쌍 ②meta-기준 정당화 불가) 둘 다 불충족 — `questions-queue.md` 추가 없음.
수렴 관측(렌즈3)은 `curation-criteria` Q21의 6번째 재현이나, Q21이 이미 "판정 렌즈에 넣지 않는다 — 배정은 다음 라운드 회피 목록 입력"으로 정리돼 있어 새 질문 불요 — 다음 landing 라운드 GENERATE 시 이번 수렴 템플릿(ValueSection 3-컬럼 그리드 구조·ClosingCTA 보더카드 구조·히어로 근사 50/50 비율)을 추가 회피 목록 후보로 전달할 것.

## 기록
- auto-ledger: target=landing, round=auto-landing-r33, winner=a, hardgate/judges 아래 §7 참조.
- 승자 아키타입명: "Priority Orbit System" (동심원 영점합 재분배 매칭 우선순위 다이얼).
