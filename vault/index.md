---
tags: [index]
---

# INDEX — vault 전수 카탈로그

> 갱신 의무: 자율 라운드(§7 기록)와 주간 apply가 신규/승격 노트를 여기에 등재한다. lint(`scripts/wiki-lint.mjs`)가 미등재를 잡는다. 홈([[🏠 Design Evolution]])은 선별 목차, 여기는 전수.

## 원칙 (00-principles — 위키 정본층)
- [[page-brief-core]] — **페이지 브리프 공통 코어** (전 타입 강제: 영문 전용·게이트 기계 검증 규칙·접근성·폭 검증·산출물 환경)
- [[dash-brief-v3]] — 타입 프로파일 `dashboard`·`settings` (앱 셸·컴포넌트 시스템·아키타입·그리드 크래프트 룰)
- [[design-principles]] — 타입 프로파일 `landing` (보이스·컬러 토큰·타이포·히어로·구조 기본형·anti-slop)
- [[brief-login]] — 타입 프로파일 `login` (폼 접근성 중심, 인터랙션 최소 2종, 앱 셸 금지)
- [[brief-404]] — 타입 프로파일 `404` (복귀 경로 중심, 인터랙션 최소 1종, 한 화면 완결)
- [[brief-catalog]] — 타입 프로파일 `catalog` (필터·정렬·빈 상태 중심, 인터랙션 최소 3종, **스크롤 연출 허용 타입**)
- [[brief-scene]] — 타입 프로파일 `scene` (페이지 전역 지속 장면, 결정론 필수, 실측 함정 4종 기록)
- [[brief-product-detail]] — 타입 프로파일 `product-detail` (가격+CTA **이중 상시노출** 하드 기준, 선택→복수 표시부 동시 재계산, 인터랙션 최소 3종)
- [[brief-paywall]] — 타입 프로파일 `paywall` (차단 사실+손실 없음 보증, 설득↔사이징 **단일 계산 상태 공유** 하드 기준, 인터랙션 최소 3종)
- [[curation-criteria]] — 지식 정제 meta-기준 (L1~L3 레벨·승격 규칙)
- [[questions-queue]] — 정제 게이트 질문 큐 (대기/아카이브)
- [[MEMORY]] — 학습 인덱스 (200줄 cap)

## 원장 (30-ledger — append-only 로그층)
- [[AUTO-RUN-LOG]] — 자율 라운드 실행 로그 (사람용 요약)
- [[NEW-PAGES-LOG]] — 신규 페이지 생성 로그
- auto-ledger.jsonl — 자율 라운드 원장 (target·판정·반증)
- design-ledger.jsonl — 랜딩 R1~R7 계보 원장
- landing-forms.jsonl — 랜딩 형태·선별 학습 원장

## 격리 (00-principles — 잠정 delta)
- dash-deltas-provisional.jsonl — dash 격리 delta
- landing-deltas-provisional.jsonl — landing 격리 delta

## 참조 (10-references — raw 불변층)
- [[README]] — Refero 캐시 45종 인덱스 (개별 파일은 README가 대표)

## 카탈로그 (20-catalog — 결정 규칙층, 외부 흡수 · ui-ux-pro-max MIT)
- [[charts.catalog]] — 데이터 타입별 차트 선택 + a11y 등급 + 볼륨 임계 (생성형 SVG 우선)
- [[colors.catalog]] — AA 검증 토큰 팔레트 뱅크 (shadcn 18슬롯, 큐레이션 12종)
- [[ux-guidelines.catalog]] — web+native UX do/don't 체크리스트 + severity + platform 열 (native/GENERATION.md §8 참조)
- [[motion.catalog]] — 모션 패턴 16종 강도 티어 (dash 절제 / landing 적극, framer-motion·CSS 재해석)

## 세대 기록 (20-generations — 라운드별 DECISION, evolve 브랜치에서 누적)
_(main 기준 없음 — 라운드 커밋이 DECISION 등재를 추가한다)_
- [[20-generations/2026-07-15-auto-dash-r1/DECISION|auto-dash-r1]]
- [[20-generations/2026-07-15-auto-dash-r2/DECISION|auto-dash-r2]]
- [[20-generations/2026-07-15-auto-dash-r3/DECISION|auto-dash-r3]]
- [[20-generations/2026-07-16-auto-dash-r4/DECISION|auto-dash-r4]]
- [[20-generations/2026-07-17-auto-dash-r5/DECISION|auto-dash-r5]]
- [[20-generations/2026-07-18-auto-landing-r1/DECISION|auto-landing-r1]]
- [[20-generations/2026-07-18-auto-dash-r6/DECISION|auto-dash-r6]] (no-winner)
- [[20-generations/2026-07-19-auto-dash-r7/DECISION|auto-dash-r7]] (승자 b — Tessera 트리맵 콕핏)
- [[20-generations/2026-07-19-auto-landing-r2/DECISION|auto-landing-r2]] (승자 a — Before/After 리빌)
- [[20-generations/2026-07-19-auto-dash-r8/DECISION|auto-dash-r8]] (승자 a — Chute 체크아웃 퍼널 인텔리전스)
- [[20-generations/2026-07-20-auto-landing-r3/DECISION|auto-landing-r3]] (승자 c — 절약 계산기 히어로)
- [[20-generations/2026-07-21-auto-dash-r9/DECISION|auto-dash-r9]] (승자 c — Currents Sankey 수익귀속 흐름도)
- [[20-generations/2026-07-22-auto-dash-r10/DECISION|auto-dash-r10]] (승자 a — Wavelength 온콜 로테이션 링·인시던트 대응 콘솔)
- [[20-generations/2026-07-23-auto-landing-r4/DECISION|auto-landing-r4]] (승자 c — AI 매칭 대조표 인터랙티브 비교 테이블 히어로, 3렌즈 만장일치)
- [[20-generations/2026-07-24-auto-landing-r5/DECISION|auto-landing-r5]] (승자 a — 매칭 정확도 다이얼 Radial Gauge 히어로, 2:1)
- [[20-generations/2026-07-25-auto-landing-r6/DECISION|auto-landing-r6]] (승자 a — Certificate of Appraisal 감정증명서 히어로, 3파전 완전동률→brief 렌즈 tie-break) → **드롭** (2026-07-30 반증: 렌즈3이 v8 다이얼과 동일 리빌 메커니즘의 재스킨으로 판정 — 형태 신규성 부재)
- [[20-generations/2026-07-26-auto-dash-r11/DECISION|auto-dash-r11]] (승자 a — Palisade 역할×권한 접근제어 매트릭스 콘솔, 2:1) → **d39 승격**
- [[20-generations/2026-07-27-auto-dash-r12/DECISION|auto-dash-r12]] (승자 a — Cadence 배포/인시던트 캘린더 히트맵 릴리스 헬스 콘솔, 3렌즈 만장일치) → **d40 승격**
- [[20-generations/2026-07-28-auto-landing-r7/DECISION|auto-landing-r7]] (승자 c — AI Annotation Scan 제품사진 주석핀 히어로, 3파전 완전동률→렌즈3 최하위 배제 tie-break 예외 첫 실사용) → **v9 승격**
- [[20-generations/2026-07-29-auto-landing-r8/DECISION|auto-landing-r8]] (승자 a — Signal Graph 선호↔매물 관계 그래프 히어로, 3렌즈 만장일치) → **v10 승격**
- [[20-generations/2026-07-30-auto-login-r1/DECISION|auto-login-r1]] (login 타입 첫 라운드 — 승자 a — Contour 스플릿 컨투어라인+스파크라인 로그인, 3파전 완전동률→렌즈3 최하위 배제 tie-break) → **`/login` 승격 (lg1 Contour)**
- [[20-generations/2026-07-31-auto-404-r1/DECISION|auto-404-r1]] (404 타입 첫 라운드 — 승자 a — Rivet 다크 타이포그래픽 404, 렌즈2·렌즈3 2표 vs 렌즈1 1표) → **`/not-found-page` 승격 (nf1 Rivet)**
- [[20-generations/2026-08-01-auto-catalog-r1/DECISION|auto-catalog-r1]] (catalog 타입 첫 라운드 — 승자 a — Loopwire 좌 필터 레일+그리드 인테그레이션 마켓플레이스, 렌즈1·렌즈2 2표 vs 렌즈3 1표 — 차별성↔완성도 상충 재현)
- [[20-generations/2026-08-01-auto-scene-r1/DECISION|auto-scene-r1]] (scene 타입 첫 라운드 — 승자 a — KEPT 스니커 4단계 파티클 장면, 렌즈1·렌즈2 2표 vs 렌즈3 1표 — 3후보 전이 공식이 매크로 골격 하나로 수렴한 사실을 렌즈3이 코드 대조로 발견)
- [[20-generations/2026-08-02-auto-product-detail-r1/DECISION|auto-product-detail-r1]] (product-detail 타입 첫 라운드 — 프로파일 부재로 page-brief-core만으로 생성 — 승자 b — Fenwick Audio 오디오 인터페이스 SKU 페이지, 3렌즈 만장일치 — c는 a11y 1-fix 루프 적용(dl/dt/dd 중첩 구조 평탄화))
- [[20-generations/2026-08-02-auto-paywall-r1/DECISION|auto-paywall-r1]] (paywall 타입 첫 라운드 — 프로파일 부재로 page-brief-core만으로 생성 — 승자 b — Hopwire 인프로덕트 한도도달 페이월, 3파전 완전동률→렌즈3이 렌즈1 승자를 최하위 판정해 tie-break로 b 재적용 — a·c 둘 다 a11y 1-fix 루프 적용, c에서 round1과 동일한 dl/dt/dd 중첩 패턴 재현되어 curation-criteria L2 신규 편입)
- [[20-generations/2026-08-03-auto-product-detail-r2/DECISION|auto-product-detail-r2]] (product-detail 2라운드째 — 승자 b — Anvil TKL-75 리퍼비시 키보드 콘솔/패널 모자이크, 렌즈1·렌즈2 2표 vs 렌즈3 1표(렌즈3은 a의 트윈컬럼 구조를 더 신선하다고 판정) — b는 모바일 a11y 1-fix(아이콘 버튼 aria-label), "히어로+헤더 이중 상시노출" 델타가 2라운드 재현되어 L2 승격)
- [[20-generations/2026-08-03-auto-paywall-r2/DECISION|auto-paywall-r2]] (paywall 2라운드째 — 승자 b — Fathomline 제품분석 SaaS 상시노출 스플릿스크린, 렌즈1·렌즈2 2표 vs 렌즈3 1표(렌즈3은 a의 위저드 골격을 더 신선하다고 판정, b는 r1/a와 매크로 버킷 수렴으로 최하위) — c는 사이징 계산기가 페이지 CTA와 별도 하드코드 상수로 분리돼 실사용 시 가격 불일치되는 실격급 버그(소스 grep 재확인) — "설득↔사이징 분리는 단일 상태 공유가 필수" 델타 2라운드 재현으로 L2 승격)
- [[20-generations/2026-08-04-auto-native-r1/DECISION|2026-08-04-auto-native-r1]]
