# auto-landing-r2 — JUDGE DECISION

TARGET=landing · 후보 a(밀어서 비교 — Before/After 드래그 슬라이더) / b(프루프 덱 — 스냅스크롤 스탯 스토리) · 2026-07-19
3렌즈 블라인드 comparator 패널 (ALPHA=a, BETA=b · 컨셉/순서 비공개).

## 렌즈별 판정

### 렌즈 1 — DNA 준수 (정본 대조 `design-principles`)
**WINNER: ALPHA(a)** · 랭킹 1. Before/After 2. 프루프 덱. 두 후보 모두 정본 하드 위반 없음(웨이트 정확 3종·near-monochrome·accent 정지 존재·focus-visible·motion-reduce·진입 opacity:0 잔존 없음·세리프 없음) — no-winner 아님. a가 정본 중심 기둥에 더 충실: 교과서적 비대칭 5/7 히어로 그리드+clamp 분리+break-keep 375px 가드, ghost 넘버·타이포 quote 글리프·Fig 캡션 에디토리얼 밀도 풀셋, 1:1 5단 구조, 제품 카드 4요소(매칭 근거·등급·인증·before/after 할인) 완비, 라인아트 0. 유일 감점: 아이브로우가 오프-토큰 `#a894f7`(near-monochrome voice는 유지되는 accent-family 틴트). b는 토큰 엄격(정확 `#6E56CF`)·스케일 대비 강하나 정본 자유도 큼(5단→7슬라이드 덱 재구성, 차트 주도 임팩트가 "타이포 대비, 라인아트 아님" DNA와 긴장, 라인아트 quote 아이콘, ghost 넘버 생략, 비-그리드 히어로).

### 렌즈 2 — 상용 랜딩 완성도 + 에셋·인터랙션 풍부도
**WINNER: ALPHA(a)** · 랭킹 1. Before/After 2. 프루프 덱. a는 렌즈 루브릭 정확 적중 — 히어로가 3초 내 가치 전달(드래그로 회색·정보빈약 일반 리스팅 → 풀컬러 AI 큐레이션 카드 전환, in-fold에 AI 96%·S급·검증 셀러·-47% 머니샷), 스프링 물리 드래그+키보드 `role="slider"`+parallax가 가치 명제("고르는 방식이 결과를 바꿉니다")를 물리적으로 극화 — 모션이 설득에 결속(장식 아님). b는 기술 다양성(3종 SVG draw-in 차트·CountUp·구매자/판매자 layoutId 토글·드래그 캐러셀)은 더 풍부하나 풀스크린 스냅 "덱"이 Linear/Stripe/Vercel 스크롤-페이지 벤치마크에서 벗어나 pitch deck으로 읽히고, 차트 주도·제품 부재 히어로가 즉시 가치 가독을 희생.

### 렌즈 3 — 형태 차별성
**WINNER: BETA(b)** · 랭킹 1. 프루프 덱 2. Before/After. b의 척추 = 풀하이트 스냅스크롤 슬라이드 덱(min-h-100svh·snap-center) + 고정 넘버 덱 레일(IntersectionObserver 스크롤스파이) + 전 슬라이드를 한 번에 재매개변수화하는 구매자/판매자 전역 토글 — r1/b Trajectory와 부분 겹치나 discrete-deck+단일 컨트롤 전체 데이터 변형은 진짜 신규 척추. a의 척추는 v0 에디토리얼 스플릿 히어로+표준 롱폼 스택의 rehash(신규는 히어로 우측의 드래그 슬라이더 위젯 뿐 — 렌즈가 명시 감점하는 표면 신규성).

## 집계 (1위 표 다수결)
- ALPHA(a): 렌즈1 + 렌즈2 = **2표**
- BETA(b): 렌즈3 = 1표
- no-winner 표 0.

## 승자: **a — 밀어서 비교 (Before/After Reveal)** (2-1)
DNA 준수 + 상용 완성도(3초 가치 전달·제품 in-fold·설득 결속 인터랙션)에서 다수. 형태 신규성은 b(프루프 덱)가 우세했으나 DNA·완성도 우선. 억지 승자 아님 — 양 후보 전 하드게이트 통과(a는 a11y 1회 수정 후), 전 렌즈 유효 판정.

## 배선 관찰
- 후보 a·b 모두 designer 1차 산출에서 컨셉 노트(a.md/b.md) 누락 → 오케스트레이터가 소스·게이트 근거로 컨셉 노트 작성 보전.
- 후보 a: Lighthouse a11y 1차 93 미달(액센트 아이브로우 대비 3.64:1 + `<dl>` div>p 위반) → designer 1회 재개 수정으로 100 도달·재-sweep 통과.
- 캡처 아티팩트: 두 후보 첫 폴드 스크린샷이 진입 애니메이션 재생 중 상태(nav+아이브로우만 페인트) — 캡처 타이밍 이슈, judge가 소스 병행 심사로 보정.
