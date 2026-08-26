---
tags: [index]
---

# INDEX — vault 전수 카탈로그

> 갱신 의무: 자율 라운드(§7 기록)와 주간 apply가 신규/승격 노트를 여기에 등재한다. lint(`scripts/wiki-lint.mjs`)가 미등재를 잡는다. 홈([[🏠 Design Evolution]])은 선별 목차, 여기는 전수.

## 원칙 (00-principles — 위키 정본층)
- [[page-brief-core]] — **페이지 브리프 공통 코어** (전 타입 강제: 영문 전용·게이트 기계 검증 규칙·접근성·폭 검증·산출물 환경)
- [[page-brief-repo]] — 이 레포의 바인딩 (언어 정책 · 폰트 변수명 · 빌드 명령 · 경로 · 게이트 요구사항). 코어에서 분리해 플러그인이 볼트 없는 레포에서도 참인 것만 싣게 한다
- [[dash-brief-v3]] — 타입 프로파일 `dashboard`·`settings` (앱 셸·컴포넌트 시스템·아키타입·그리드 크래프트 룰)
- [[design-principles]] — 타입 프로파일 `landing` (보이스·컬러 토큰·타이포·히어로·구조 기본형·anti-slop)
- [[brief-login]] — 타입 프로파일 `login` (폼 접근성 중심, 인터랙션 최소 2종, 앱 셸 금지)
- [[brief-404]] — 타입 프로파일 `404` (복귀 경로 중심, 인터랙션 최소 1종, 한 화면 완결)
- [[brief-catalog]] — 타입 프로파일 `catalog` (필터·정렬·빈 상태 중심, 인터랙션 최소 3종, **스크롤 연출 허용 타입**)
- [[brief-scene]] — 타입 프로파일 `scene` (페이지 전역 지속 장면, 결정론 필수, 실측 함정 4종 기록)
- [[brief-product-detail]] — 타입 프로파일 `product-detail` (가격+CTA **이중 상시노출** 하드 기준, 선택→복수 표시부 동시 재계산, 인터랙션 최소 3종)
- [[brief-paywall]] — 타입 프로파일 `paywall` (차단 사실+손실 없음 보증, 설득↔사이징 **단일 계산 상태 공유** 하드 기준, 인터랙션 최소 3종)
- [[brief-profile]] — 타입 프로파일 `profile` (신뢰 통계 **고정 상시노출** 하드 기준, 전역 토글 → 이질적 산출물 동시 재계산, 인터랙션 최소 3종)
- [[brief-careers]] — 타입 프로파일 `careers` (**오픈 롤 상시노출** 하드 기준, 보상은 입력 축·계산 방식을 먼저 정한다, 인터랙션 최소 3종)
- [[curation-criteria]] — 지식 정제 meta-기준 (L1~L3 레벨·승격 규칙)
- [[questions-queue]] — 정제 게이트 질문 큐 (대기/아카이브)
- [[MEMORY]] — 학습 인덱스 (200줄 cap)

## 원장 (30-ledger — append-only 로그층)
- [[AUTO-RUN-LOG]] — 자율 라운드 실행 로그 (사람용 요약)
- [[NEW-PAGES-LOG]] — 신규 페이지 생성 로그
- [[30-ledger/coverage-audit-2026-08-14|coverage-audit-2026-08-14]] — 정본 조항 ↔ 실제 계측 대조 감사 (41작품 소급 실측)
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
- [[20-generations/2026-08-26-auto-dash-r19/DECISION|2026-08-26-auto-dash-r19]] (dash 19라운드째 — 무인 2연속 라운드의 2라운드째, native(1라운드) 제외 후 dash/landing 난수에서 dash 당첨 — 승자 b(Cadence, 로드맵/간트 생산라인 스케줄), 2:1 다수결(렌즈1=b·렌즈2=c·렌즈3=b) — a(Corridor, 캘린더/보드)는 1-fix 후에도 a11y color-contrast 재발로 탈락, 생존 2개(b/c)로 판정. 신규 delta: r17/r18의 "단일 재인코딩 빌더" 처방을 문자 그대로 따라도(c) 선택→전면재계산이면 여전히 관습적 master-detail로 읽힌다 — 선택 파급범위를 부분재계산/비영속반응으로 분리하는 것이 진짜 차별화축. GENERATE 단계 banList 실측으로 grotesk 회피)
- [[20-generations/2026-08-26-auto-native-r14/DECISION|2026-08-26-auto-native-r14]] (native 14라운드째 — 무인 2연속 라운드의 1라운드째, 미채움 큐 0 → dash/landing/native 난수에서 native 당첨 — 승자 c — Wallet & Transaction History(잔액 상시노출+필터가능 거래원장), 3파전 완전 동률(렌즈1=b·렌즈2=a·렌즈3=c) → curation-criteria tie-break 예외 적용(렌즈3이 렌즈1 1위 b를 최하위 판정 → b 제외 → 렌즈1 재적용 c>a) — 신규 델타: no-op Pressable 자체는 정당한 자리표시자이나 실제로 안 일어나는 동작을 accessibilityHint로 약속하면 안 된다(`auto-native-r8` delta 정교화, c의 Withdraw 버튼 사례) — 렌즈1이 a에서 하드코딩 hex 2건 지적(게이트 미검출 — 기존 Q34 native 게이트 격차 재확인, 신규 질문 미등재) — 3후보 전원 12/12 게이트 1차 통과)
- [[20-generations/2026-08-20-auto-landing-r13/DECISION|2026-08-20-auto-landing-r13]]
- [[20-generations/2026-08-19-auto-landing-r12/DECISION|2026-08-19-auto-landing-r12]]
- [[20-generations/2026-08-19-auto-native-r10/DECISION|2026-08-19-auto-native-r10]]
- [[20-generations/2026-08-18-auto-dash-r16/DECISION|2026-08-18-auto-dash-r16]]
- [[20-generations/2026-08-18-auto-native-r8/DECISION|2026-08-18-auto-native-r8]]
- [[20-generations/2026-08-16-auto-native-r7/DECISION|2026-08-16-auto-native-r7]]
- [[20-generations/2026-08-16-auto-dash-r15/DECISION|2026-08-16-auto-dash-r15]]
- [[20-generations/2026-08-17-auto-native-r9/DECISION|2026-08-17-auto-native-r9]]
- [[20-generations/2026-08-17-auto-landing-r11/DECISION|2026-08-17-auto-landing-r11]]
- [[20-generations/2026-08-23-auto-native-r11/DECISION|2026-08-23-auto-native-r11]]
- [[20-generations/2026-08-23-auto-landing-r14/DECISION|2026-08-23-auto-landing-r14]]
- [[20-generations/2026-08-23-auto-native-r12/DECISION|2026-08-23-auto-native-r12]]
- [[20-generations/2026-08-23-auto-landing-r15/DECISION|2026-08-23-auto-landing-r15]]
- [[20-generations/2026-08-24-auto-native-r13/DECISION|2026-08-24-auto-native-r13]]
- [[20-generations/2026-08-24-auto-dash-r18/DECISION|2026-08-24-auto-dash-r18]]
- [[20-generations/2026-08-15-auto-native-r6/DECISION|2026-08-15-auto-native-r6]]
- [[20-generations/2026-08-15-auto-dash-r14/DECISION|2026-08-15-auto-dash-r14]]
- [[20-generations/2026-08-14-auto-landing-r10/DECISION|2026-08-14-auto-landing-r10]]
- [[20-generations/2026-08-14-auto-native-r5/DECISION|2026-08-14-auto-native-r5]]
- [[20-generations/2026-08-13-auto-native-r4/DECISION|2026-08-13-auto-native-r4]]
- [[20-generations/2026-08-13-auto-dash-r13/DECISION|2026-08-13-auto-dash-r13]]
- [[20-generations/2026-08-10-auto-media-kit-r1/DECISION|2026-08-10-auto-media-kit-r1]]
- [[20-generations/2026-08-10-auto-integration-r1/DECISION|2026-08-10-auto-integration-r1]]
- [[20-generations/2026-08-09-auto-developers-r1/DECISION|2026-08-09-auto-developers-r1]]
- [[20-generations/2026-08-09-auto-contact-r1/DECISION|2026-08-09-auto-contact-r1]]
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
- [[20-generations/2026-08-04-auto-profile-r1/DECISION|auto-profile-r1]] (profile 타입 첫 라운드 — 프로파일 부재로 page-brief-core만으로 생성 — 승자 b — Sable Voss / Loopwire 개발자·연동 퍼블리셔 프로필(기여 히트맵+연동 그리드), 렌즈1·렌즈2 2표 vs 렌즈3 1표 — 렌즈3은 3후보 모두가 기존 타입(catalog/dashboard/paywall)의 매크로 패턴을 부분 이식했다고 지적, Q15로 질문 큐 등재)
- [[20-generations/2026-08-04-auto-blog-r1/DECISION|auto-blog-r1]] (blog 타입 첫 라운드 — 프로파일 부재로 page-brief-core만으로 생성 — 승자 a — Northbeam 히어로+필터형 카드 그리드 블로그 인덱스, 렌즈1·렌즈2 2표 vs 렌즈3 1표 — c는 picsum 원격 이미지 로드 실패로 alt 텍스트가 고정 컨테이너 밖으로 번지는 실결함, a·b는 결정론적 생성 SVG 아트로 이 실패 모드를 원천 회피 — 이 회피 패턴이 신규 델타로 기록)
- [[20-generations/2026-08-05-auto-profile-r2/DECISION|auto-profile-r2]] (profile 2라운드째 — 승자 b — Renata Kessler / Solstice Macro 트레이딩 벤치마크 프로필(sticky 스코어보드 밴드의 이중 토글이 통계쌍·차트·테이블을 동시 재계산), 렌즈2·렌즈3 2표 vs 렌즈1 1표 — 렌즈1이 지적한 b의 390px 테이블 폭 결함(page-brief-core §3 sr-only containing-block 버그의 실측 재현, 자동 sweep 미검출)을 §3-1 정제 조치로 수정 후 재게이트·재통과 — "핵심 통계 상시노출" 델타 2라운드 재현으로 L2 승격, Q15에 2라운드째 관측 갱신(이식도 낮은 후보가 2연속 렌즈3 1위/최종승자))
- [[20-generations/2026-08-05-auto-blog-r2/DECISION|auto-blog-r2]] (blog 2라운드째 — 승자 b — Baseline 벤치마크 저널 블로그(KPI 통계 행 + Feed/Compare 토글, 실동작 aria-sort 시맨틱 테이블), 렌즈1·렌즈2 2표 vs 렌즈3 1표 — r1에서 3후보 전원에게 있던 모바일 nav 대체 경로 부재(Q16)를 GENERATE 사전 지침으로 명시하자 이번엔 3후보 전원이 해소, Q16에 관측 갱신 — "무작위 이미지 호스트 회피" 델타는 이미 하드게이트(no-random-image-host)로 기계 검증돼 L2 승격, "전역 토글이 이질적 뷰를 재계산" 패턴이 auto-profile-r2와 타깃을 넘어 2회째 재현)
- [[20-generations/2026-08-06-auto-about-r1/DECISION|auto-about-r1]] (about 타입 첫 라운드 — 프로파일 부재로 page-brief-core만으로 생성 — 승자 a — Portage 창업자 서사+마일스톤 타임라인(키보드 확장형)+values 칩필터+스크롤스파이 내비, 3렌즈 완전 동률(각 1표)로 [[curation-criteria]] "차별성↔완성도 상충 시 완성도 다수결" + "3파전 tie-break 예외" 순차 적용 — 렌즈3 1위 c가 렌즈1·렌즈2 양쪽에서 동시 최하위(죽은 자기참조 CTA·모바일 아코디언 텍스트 누출·People/Values 섹션 전무)라 제외 후 렌즈1 1위 a로 확정 — about 타입 첫 델타 "People·Values는 About 핵심 콘텐츠 계약" 기록)
- [[20-generations/2026-08-06-auto-careers-r1/DECISION|auto-careers-r1]] (careers 타입 첫 라운드 — 같은 날 about 다음으로 큐를 내려온 미채움 타입, 프로파일 부재로 page-brief-core만으로 생성 — 승자 a — Fathom Labs 컬처 매니페스토+다면필터 오픈롤 리스트+포커스트랩 슬라이드오버 드로어, 3렌즈 만장일치(3표) — 렌즈2가 c(부서그룹 전원 기본접힘으로 롤 인벤토리 전체를 인터랙션 뒤에 숨김)를 "완성도 다수결" 원칙 위반으로 최하위 판정, 렌즈3은 b가 같은 날 자매 about-r1의 팀디렉토리 메커니즘을 재스킨했다고 지적 — careers 타입 첫 델타 "오픈 롤 인벤토리는 상시노출 핵심 증명" 기록, a11y 정적검사가 footer `©`를 이모지로 오탐한 1-fix 사례도 기록)
- [[20-generations/2026-08-07-auto-about-r2/DECISION|auto-about-r2]] (about 2라운드째 — 승격 전(아직 works.ts 미등재)이라 미채움 큐 선두로 재선정, page-brief-core만으로 생성 — 승자 a — Cordwell 옵저버빌리티 SaaS, sticky 세그먼트 통계 레일+클릭확장 org-pod 로스터+화살표키 완비 ARIA 탭리스트, 3렌즈 완전 동률(각 1표)로 auto-about-r1과 정확히 같은 tie-break 구조 재현 — 렌즈3 1위 b가 렌즈1·렌즈2 양쪽에서 동시 최하위(사람 바이오 `<details>` 확장 표시 누락으로 콘텐츠 발견성 붕괴)라 제외 후 렌즈1 1위 a로 확정 — r1의 "People·Values 상시노출" 델타가 이번 3후보 전원에게 반영돼 위반 없이 방지된 것을 확인, 신규 델타 "list-none summary는 대체 확장 아이콘 필수" 기록. 이 세션 환경에 Agent/Task형 서브에이전트 기동 도구가 없어 3-designer·3-judge 병렬을 세션 자체가 순차/독립 기준 적용으로 대체 수행했음을 DECISION에 명시)
- [[20-generations/2026-08-07-auto-careers-r2/DECISION|auto-careers-r2]] (careers 2라운드째 — 같은 세션에서 about 다음으로 미채움 큐를 내려온 타입, page-brief-core만으로 생성 — 승자 b — Talus 인프라 모니터링 SaaS, `<fieldset>`다면 체크박스 필터+카드별 details(쉐브론 아이콘 동반)+레벨 range 슬라이더, 렌즈1·렌즈3 2표 vs 렌즈2 1표(단순 다수결, tie-break 불요) — a의 정렬가능 롤 테이블이 390px에서 4열 균등폭 크로우딩으로 육안 판독성이 떨어지는 결함(sweep·a11y 게이트는 미검출)을 렌즈1·렌즈2가 각각 지적, b의 카드 details가 같은 세션 직전 라운드(about-r2)가 방금 기록한 "확장 아이콘 필수" 델타를 곧바로 반영한 것도 확인 — 신규 델타 "table-fixed 4열+ 테이블의 390px 크로우딩" 기록, 레벨/연도 range 슬라이더 메커니즘이 같은 세션 두 타깃(about-r2/b, careers-r2/b)에 걸쳐 재현된 것을 Q17 관측으로 남김. 이 세션 환경에 Agent/Task형 서브에이전트 기동 도구가 없어 3-designer·3-judge 병렬을 세션 자체가 순차/독립 기준 적용으로 대체 수행했음을 DECISION에 명시)
- [[20-generations/2026-08-08-auto-about-r3/DECISION|auto-about-r3]] (about 3라운드째 — 여전히 승격 전(works.ts 미등재)이라 미채움 큐 선두로 재선정, page-brief-core만으로 생성 — 승자 a — Ordinal 규정/워크플로 자동화 SaaS, 함수축↔지역축 재편 가능한 실제 트리형 People+마스터-디테일 Values, 렌즈2·렌즈3 2표 vs 렌즈1 1표(단순 다수결, tie-break 불요) — 렌즈1은 16명 전원 기본노출인 c를 1위로 판정했으나 a도 최하위가 아니라 제외 조건 불성립, 신규 델타 "People을 두 축 이상으로 재편 가능한 계층 트리로 제공하면 완성도·차별성 동시 우위(단 초기 렌더 전원 축약 금지)" 기록 — 비승자 b(Millrace)에서 JSX 표현식 직후 개행 텍스트의 공백이 렌더 시 소실되는 문자열결합 결함("Millracematches")을 렌즈1·렌즈2가 독립 발견(재현 1회, 승격 임계 미달로 참고만 기록). 이 세션은 Agent 도구로 3-designer·3-judge를 실제 병렬 서브에이전트로 기동했으나, 라운드 도중 세션 워커 프로세스가 재시작되어 candidate a 완료 알림만 수신하고 b·c 서브에이전트 연결이 끊김 — 재시작 후 디스크에 남은 b·c 산출물(c는 거의 완성, b는 데이터·컴포넌트만 있고 page.tsx 누락)을 이 세션이 직접 이어서 완성했음을 SCORES·DECISION에 명시)
- [[20-generations/2026-08-08-auto-careers-r3/DECISION|auto-careers-r3]] (careers 3라운드째 — 같은 세션에서 about 다음으로 미채움 큐를 내려온 타입, page-brief-core만으로 생성 — 승자 a — Isoline 급여·컴플라이언스 인프라 SaaS, 오피스/지역 ARIA탭리스트가 주축(기본 상태에 14개 역할 전원 노출)+팀 select+검색+탭 전환마다 재계산되는 타임존-겹침 바차트, 렌즈1·렌즈3 2표 vs 렌즈2 1표(단순 다수결, tie-break 불요) — 렌즈2는 b(Loomwork)를 완성도 1위로 판정했으나 렌즈1·렌즈3 양쪽 최하위라 승자에서 제외, 신규 델타 "오피스축 탭리스트+탭연동 2차 시각화 결합이 완성도·차별성 동시 우위(단 시각화가 기존 텍스트를 색으로만 재진술하면 장식 감점)" 기록 — 비승자 b에서 `dark:` 접두어 누락으로 정적 규칙(`no-dark-dim-text`)을 우회하는 저대비(zinc-500 on zinc-950, 실측 4.14:1) 결함을 렌즈1이 발견(재현 1회, 참고만 기록), about-r3에서 관측된 JSX 표현식-공백-소실 버그가 이 라운드 candidate a designer에 의해 독립적으로 재발견·자체수정된 것도 교차세션 2회째 관측으로 기록. 이 라운드는 세션 워커 재시작 없이 3-designer·3-judge 전원이 완주함)
- [[20-generations/2026-08-10-auto-native-r2/DECISION|auto-native-r2]] (native 2라운드째 — 오늘이 월요일이라 스킬의 native 주기 고정 규칙으로 이번 연속 실행의 1라운드 목표가 native로 강제됨 — 승자 c — Account & Preferences(`Preferences`), 화면 전체가 고정 헤더·하단 액션바 없이 단일 SectionList로만 스크롤되고 임계값 설정이 지연 저장 없이 행별 즉시 적용, 3렌즈 만장일치(3-0) — r1이 관측한 "고정 헤더+핀카드/스크롤/하단 액션바" 3밴드 실루엣을 완전히 벗어난 첫 사례가 DNA·완성도·차별성 3렌즈 전부에서 동시 우위를 얻은 것으로 신규 델타 기록 — r1의 SafeAreaView 델타는 이번 라운드 3후보 전원 준수로 재현되지 않아 L1 유지 — 비승자 결함 참고 기록: a(Discover)는 카드 탭 Pressable에 onPress 누락(죽은 인터랙션), b(AlertsCenter)는 `accessible` 컨테이너가 중첩 Pressable 2곳을 접어 스크린리더 탐색에서 숨길 위험(재현 1회, 승격 임계 미달))
- [[20-generations/2026-08-10-auto-contact-r2/DECISION|auto-contact-r2]] (contact 2라운드째 — 미채움 큐 선두로 재선정(승격 전), r1의 "발신시각 시뮬레이터" 수렴 결함을 3후보 전원이 회피 — 승자 a — Sole Trace Escalation Ladder(4단계 상시노출 계층, 상황 칩은 배지만 붙이고 아무것도 숨기지 않음), 렌즈1·렌즈3 2표 vs 렌즈2 1표(단순 다수결, tie-break 불요) — 렌즈2는 c(Overrun Desk Directory)를 완성도 1위로 판정했으나 렌즈1이 c의 `tabular-nums` 반복 누락을, 렌즈3이 c가 이미 카탈로그에 등재된 `catalog`(ct1)·`careers`(cr1/cr2)의 필터 레일+칩 좁히기 골격과 관용구 수준에서(빈 상태 카피까지) 겹친다고 지적해 승자에서 제외 — 신규 델타 "핵심 증명은 인터랙션 장치가 게이팅/필터링해서는 안 되고 강조·재정렬만 가능"(r1 링크-작동성 델타 확장, 비승자 b의 tier 필터가 6채널 중 3채널을 DOM에서 제거하는 반증 사례와 대조) 기록 — Q22(수렴이 층위를 옮겨 계속되는가)에 "수렴이 다음 라운드가 아니라 이미 승격된 타입의 골격으로 착지"한 신규 사례 append)
- [[20-generations/2026-08-11-auto-landing-r9/DECISION|auto-landing-r9]] (landing 9라운드째 — 미채움 큐가 **0이 되어**(PAGE_TYPES 18종 전부 카탈로그 1건 이상) 스킬 계약대로 dash/landing/native 3종 난수로 떨어진 첫 라운드, [[questions-queue]] Q18이 "판단 시점"으로 지정한 날이 실제로 도래 — 누락된 2026-08-11 야간 발화를 08-12에 소급 실행 — 승자 b — "순서가 곧 모델"(5개 평가 기준의 *순위*가 그대로 가중치 ×5…×1이 되고 좌측 레일에서 한 칸 올리면 우측 랭킹·기여도 스택막대·요약 문장·1위 근거가 동시 재계산), 렌즈1·렌즈2 2표 vs 렌즈3 1표(단순 다수결, tie-break 불요) — **두 렌즈가 같은 이유로 b를 1위에 놨다: 매물 병렬 카드를 첫 폴드에 올린 유일한 후보**(a는 readout 패널까지, c는 가드레일 패널까지만 폴드 안) → `auto-landing-r2/a`의 "제품+증명을 첫 폴드에" L1 델타가 재현 확정되어 **L2 승격** — 신규 델타 "차분(now vs base)을 논증으로 삼는 장치는 기본 상태 설계를 별도로 요구한다"(후보 c의 가치 3분할이 무조작 시 `100%/100%`·`A-/A-`·`0/0` + "Holding at baseline." 3연발로, 렌즈1·렌즈2가 독립적으로 같은 지점을 지목 — 실측 확인: `FieldWork.tsx:221` 기본 상태가 빈 배열이라 now==base) — **3후보 전원 9관문 1차 통과·1-fix 0회로 루프 최초**, a11y 100/100/100, 샷 48장 blank 0, 동결 해시 `366979d…` 2회 측정 동일 — 렌즈3은 **이중 판정**: 장치(입력×출력 조합) 층위는 3후보 전부 기존 6종 대비 신규로 `c>b>a` 유효하나 **아키타입(페이지 형태) 층위는 `no-winner`** — 섹션 시퀀스·상품 카드 필드 어휘·마크업 관용구가 셋 다 일치했고 특히 b·c가 **독립적으로 같은 이름·같은 구조의 `GhostNumber` SVG 컴포넌트**를 작성(실측 확인, viewBox 높이만 64 vs 72) → Q22에 "성숙 타깃에서도 수렴"을 6라운드째 관측으로 append(앞의 5회는 전부 신규 타입이라 "브리프가 얇아서"라는 해석이 가능했으나 landing은 정본이 가장 두꺼운 타깃이라 그 해석이 반증됨) — 신규 질문 Q24(랜딩 DNA accent `#6E56CF`가 자기 배경 `#0B0B0F` 위에서 3.73:1로 **AA 미달**, 후보 c가 실측해 `#B6A6F0` 파생 — 정본 색 토큰과 a11y 하드게이트의 정면 충돌) 등재 — 브리프 구멍 3건이 2회 이상 반복 보고(`whileInView`↔진입 opacity:0 잔존 금지 충돌 / 고정 unsplash ID를 에이전트가 검증할 수 없음 / 소셜프루프 수치의 시연 라벨 요구 부재 — a·b는 출처 없는 통계를 사실로 제시, c만 FICTIONAL 표기))
- [[20-generations/2026-08-12-auto-native-r3/DECISION|auto-native-r3]] (native 3라운드째 — 누락된 2026-08-12 야간 발화 소급 실행, 미채움 큐가 0이 된 뒤 dash/landing/native 난수에서 landing 연속 회피로 재추첨된 타깃 — 승자 b — Handoff check(거래 당일 대면 인수인계, 눈앞의 물건을 리스팅과 6줄로 대조), **3렌즈 만장일치 3-0에 순위까지 완전 일치**(b>a>c) — 세 렌즈가 같은 것을 지목: **하단 고정 밴드가 버튼이 아니라 상태기계 겸 내비게이터**(waiting/stop/revise/ready 4톤 + 미완료 시 `scrollToIndex`로 다음 미답 항목 점프, `disabled` 미사용) — 렌즈2 실측에서 조작 1회당 갱신면은 a가 16필드/6면으로 최다였는데도 b가 이김("a는 값이 바뀌고 b는 **상태의 종류**가 바뀐다") — **이 라운드가 `auto-native-r2/c` delta를 반증**: "고정 헤더·하단 액션바 둘 다 없음"이 r2에서 만장일치 승자였는데 r3에서 그 형태를 가진 후보 c가 3렌즈 전부 최하위(렌즈2 "고정면이 하나도 없어 카드를 탭하면 확인이 스크롤 위쪽에 그려져 탭하는 순간 안 보인다") → 신규 질문 Q25 등재(고정 밴드는 개수가 아니라 일을 하는지로 판정되는가 · 화면유형이 가르는가 · **메타: r2 delta가 승자의 관측된 형태를 규칙으로 적고 이유를 안 적어서 생긴 반례**) — 신규 델타 "모바일 고정 밴드는 개수가 아니라 그 밴드가 일을 하는지로 판정된다" 기록 — **게이트 결함 2건 발견**: ① `tsc --noEmit`이 native 프로젝트 전역이라 후보 c의 타입 에러 8건이 a·b의 tsc까지 실패시켜 1차 게이트가 12/12 실패로 나옴(a·b 파일 자체 에러 0건, 웹은 `normalizeTypes` 스코프 귀속으로 이미 해결된 문제) ② verdict `detail`이 12건 전부 "실패" 한 단어라 스킬 §3의 1-fix 루프에 넘길 내용이 없음 — 무인 라운드였다면 3후보 전원 탈락 no-winner로 기록되고 사유는 한 단어만 남았을 것 — c 1-fix 1회(`styles.up`/`down` 6줄 추가) 후 12/12 통과, 순위 재계산 없음 — r1의 SafeAreaView delta는 2라운드 연속 재현 없음(3후보 전원 준수, L1 유지) — 렌즈1 주장 1건 반증(하단 밴드가 절대배치가 아니라 flex 형제라 마지막 카드 가림 없음, `position:` 0건 실측) — 렌즈3 수렴 보고: `ListHeaderComponent`에 상단 전체 몰아넣기·accent 가로 미터 바·eyebrow→헤딩→서브카피 순서·accent 배경=선택 상태가 3/3 일치 → **같은 날 `auto-landing-r9`과 동형 수렴이라 플랫폼을 넘은 관측으로 Q22에 함께 기록** — 브리프 구멍: 통화 규정 부재(3후보 전원 USD, 이유는 각자 다름 · b "repick이 한국 서비스라면 잘못된 선택일 수 있다")·실존 브랜드명 사용 가부(c는 Leica/Sony/Technics/Eames 사용, 같은 날 landing r9 후보 2개는 정반대로 회피)·`accessibilityLabel`을 컨테이너에 걸 때 `accessible` 필요(c 누락으로 레이블이 보조기술에 미도달))
- [[20-generations/2026-08-13-auto-dash-r13/DECISION|auto-dash-r13]] (dash 13라운드째 — 정상 야간 발화, 미채움 큐 0 이후 난수에서 dash 선정 — 승자 a — Portlane 3-pane 화물 운영 콘솔(선적 레일 + 상세 컬럼 + 예외 피드), 렌즈1·렌즈2 2표 vs 렌즈3 1표 — 후보 a가 `charts.catalog`의 Time-Series Forecast 행("이력 30–90일")을 근거로 **브리프 예시의 7d를 빼고 30/60/90D로 바꾼 것**이 특기할 만하다: 브리프 예시를 강제값이 아니라 "e.g."로 읽고 카탈로그 결정 규칙을 우선한 첫 사례 — **2026-08-14 주간 반증에서 킵**, `/dash/d45`로 승격)
- [[20-generations/2026-08-13-auto-native-r4/DECISION|auto-native-r4]] (native 4라운드째 — 같은 야간 발화의 2라운드 — 승자 b — Notifications 활동 피드, 렌즈1·렌즈2 2표 vs 렌즈3 1표 — **고정 밴드가 아예 없는 형태가 다시 이겼다**: r2 승자(무고정)가 r3에서 반증된 직후라 두 형태가 번갈아 이긴 셈이고, 이 충돌이 [[questions-queue]] Q25로 등재됨 — 필터 칩을 가로 스크롤 대신 `flexWrap`으로 둔 것과 타입 배지를 색이 아닌 2글자 모노그램으로 둔 것이 색만 전달 금지의 native 적용 사례 — 이 라운드가 `catalog-variety.mjs`의 theme 판별이 반투명 다크 오버레이를 라이트로 오분류함을 발견해 Q26 등재 — **2026-08-14 주간 반증에서 킵**, `native/src/notifications/`·`n7`로 승격)
