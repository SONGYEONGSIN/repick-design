# RETRIEVE context — auto-landing-r7

## BRIEF (read-only 정본 — `vault/00-principles/design-principles.md`, 전문)

# Design Principles — repick 랜딩 (v1)

## Voice / Tone
- **카피 언어: 영문 전용** — 모든 카피(히어로·섹션·CTA·더미 데이터)는 영어. 한글·혼합 금지.
- 한 줄로: **신뢰감 있는 미니멀 — 에디토리얼 타이포 위계로 승부**. 과장 없이 정보 위계로.
- **near-monochrome**: 무채색으로 위계를 만들고 accent는 극소량. accent는 정지 상태에서도 존재감 유지(hover로 숨기지 말 것).
- 임팩트는 **타이포 스케일 대비**로 낸다 — 그라데이션·라인아트 장식은 지양(블루프린트 감으로 감점).

## Layout / 밀도
- **Hero**: 비대칭 좌측정렬 + `clamp` 초대형 스케일 대비 (중앙정렬보다 강함).
- **에디토리얼 밀도**: 12-col 비대칭 그리드 + ghost 넘버 + Fig 캡션 + quote mark. (여백만 극대화보다 강함) — **재해석 규칙(curation-criteria Q4)**: 리터럴 컬럼 폭 비율이 아니라 콘텐츠 밀도 비대칭. 리치 위젯을 담는 히어로는 6/6 대칭 컬럼이라도 밀도 비대칭이면 유효.
- 구조가 테마보다 지배적 — **다크 기본, 라이트도 유효 대안**(구현 밀도가 같으면 대등).

## Color Tokens
| 역할 | 값 |
|---|---|
| bg | #0B0B0F |
| fg | #FFFFFF |
| muted | #A1A1AA |
| accent | #6E56CF |

## Typography
- 헤딩: **Inter류**(세리프 금지) / 700~800 / letter-spacing -0.02em — 실제 구현은 전역 CSS 변수 `--font-sans`(Pretendard Variable 폴백 체인)를 그대로 쓴다. **`next/font` 추가 import 금지**(static-check 하드 위반) — 이미 layout에서 전역 로드됨.
- 본문: 400 / line-height 1.6
- **폰트 웨이트 정확히 3종** (예: 400 / 600 / 800). 위계는 크기·자간·색으로.
- 트래킹 3단 스케일: eyebrow 0.28em / 캡션 0.16em / 스탯 0.12em.

## 접근성 / 견고성
- 모든 인터랙티브 요소에 accent `focus-visible` 링.
- 초대형 헤드라인은 모바일 375px 오버플로 방지 `clamp` 분리(<lg vs lg), 데스크톱 룩 보존.

## Spacing
- 섹션 상하 패딩 최소 96px (데스크톱)
- 컨텐츠 최대폭 1120px

## Landing 구조 기본형
1. **Hero** (헤드라인 + 서브 + 단일 CTA)
2. **제품 프리뷰** — 3~4개 병렬 카드로, 리치하게: AI 매칭 근거 태그 + 컨디션 등급 + 판매자 인증 배지 + before/after 할인율. **전부 상시 노출(hover/focus 전용 금지 — 정지 상태에서도 보여야 함, 터치 기기 대응)**. "AI가 왜 골랐나" 증명 = 전환 설득력.
3. **가치 3분할**
4. **소셜프루프**
5. **마무리 CTA**

## 금지 (anti-slop)
- 의미 없는 그라데이션 남발
- 폰트 웨이트 3종 초과
- 라인아트/브래킷 장식 (블루프린트 감)
- 세리프 헤드라인

## 에셋·인터랙션 (랜딩 — 표현 상한 없음)
- **에셋 적극**: 히어로 이미지·제품샷·아바타(next/image, 고정 URL·alt·크기 명시)와 생성형 SVG/CSS(키네틱 타입·시차 배경·마스크 연출)를 표현적으로.
- **framer-motion 적극**: 스크롤 연동 연출·시차(parallax)·진입 시퀀스·제스처에 적극 사용. 단 **결정론**(`Math.random`/`Date.now`/`new Date()` 절대 금지 — 정적 검사 하드 위반)·`motion-reduce`/`prefers-reduced-motion` 게이팅·진입 opacity:0 잔존 금지(no-JS/애니메이션 미실행 시에도 콘텐츠 표시).
- **인터랙션 최소 4종**: 히어로 인터랙션·스크롤 트리거·제품 프리뷰 상호작용·폼/퀴즈 등 4개+. 데코가 아니라 전환·설득에 기여.
- **이미지 규율**: 원시 `<img>` 금지 → `next/image`(Image). `unoptimized` 금지. `alt` 필수.
- transform/opacity만 애니(레이아웃 속성 width/height/top/left 금지). 진입/이탈 <250ms 비대칭.

## 축적 학습 (landing-deltas-provisional.jsonl 요약 — 반드시 반영)
1. **(r1)** 히어로를 정적 카피가 아니라 실시간 프로덕트 데모/콘솔로 만들면 즉각 설득력 — 단 결정론 step 카운터로.
2. **(r2, L2)** 형태 차별성보다 "DNA 준수 + 상용 완성도"가 다수결에서 우선된다. 풀스크린 스냅 "덱"은 pitch deck으로 읽혀 감점. 제품+증명을 첫 폴드에.
3. **(r3, L2)** "조작(manipulation)=가치체감" 원칙: 사용자가 조작하면 핵심 증명/비교 데이터가 실시간으로 갱신되는 구조가 최우위. 위젯 종류(슬라이더/탭/표)는 무관 — **기능적 기준**(조작→핵심 데이터 실시간 갱신)으로 판단됨.
4. **(r3)** 제품 프리뷰의 매칭%/등급/인증/할인은 **hover/focus 전용 리빌 금지** — 정지 상태(특히 터치 기기)에 항상 보여야 함.
5. **(r5)** 히어로 인터랙션 형태는 두 축으로 나뉜다: (1) **input-manipulation**형(슬라이더/탭/드래그로 조작해야 값 산출 — 이미 다수 재현·포화) vs (2) **output-visualization**형(AI가 이미 계산한 결과를 시각 장치로 보여주고 조작은 탐색만 — 아직 희소, 신규성 가산점). 다음 라운드는 output-visualization 축 우선 고려.
6. **(r6)** 제품 프리뷰는 단일 앵커 매물이 아니라 **3~4개 병렬 카드**로 구현되어야 DNA 렌즈 만점. 히어로가 아무리 참신해도 프리뷰가 얇으면 감점.

## judge 렌즈 (3렌즈)
- 렌즈1 = DNA 준수(design-principles.md 전체 — 카피 영문, near-monochrome, 타이포 스케일, 프리뷰 상시노출·다중카드, 결정론, a11y)
- 렌즈2 = 상용 랜딩 완성도(Linear·Stripe·Vercel급 — 3초 내 가치 가독, 제품+증명 첫 폴드, 에셋·인터랙션이 데코가 아니라 정보/전환에 기여, 장식 과잉·의미없는 모션 감점)
- 렌즈3 = 아키타입/형태 차별성(기존 16개 폼과 구조적으로 다른가)

## 중복 금지 — 기존 아키타입 16종 (v0~v5 + auto-landing-r1~r6, 반드시 이것들과 다른 구조를 만들 것)
- v0 에디토리얼 스플릿 히어로+제품쇼케이스(baseline) / v1 전면이미지 몰입형(시네마틱, Ken-Burns) / v2 벤토그리드 / v3 에디토리얼 매거진(TOC+챕터) / v4 대화형 퀴즈 / v5 미니멀 타이포
- r1a SCANLINE(라이브 매칭 콘솔) / r1b Trajectory(세로 스크롤 여정 타임라인)
- r2a REVEAL(밀어서 증명하는 before/after 드래그) / r2b Proof Deck(풀스크린 스냅 스탯 스토리)
- r3a 피드-as-히어로(매서너리 라이브 피드) / r3b 대화 트랜스크립트(AI 챗로그) / r3c 절약 계산기 히어로(슬라이더/스테퍼)
- r4a 스와이프 카드 스택(Tinder류) / r4b 스포트라이트+3D틸트+필름스트립 / r4c 비교표+카테고리탭(일반거래 vs AI매칭, L2 승격)
- r5a 라디얼 매칭 게이지(원형 SVG 다이얼, output-visualization) / r5b 옷장 레일 물리적 은유(드래그) / r5c 자연어 검색 칩+라이브 인덱스
- r6a Certificate of Appraisal(감정증명서, output-visualization, r6 승자) / r6b 스크롤 검증 타임라인(단일 매물 스텝퍼) / r6c Instant Estimate Certificate(입력 조작+실시간 재계산 증명서 융합)

## 참조 카탈로그 (실체 요약 — anti-slop 필터: 브리프·curation-criteria와 충돌 시 브리프 우선)

### ux-guidelines.catalog.md (Plat=web/both만 적용)
- a11y 하드게이트: 색대비 4.5:1+, 색만으로 전달 금지, alt 서술형 필수, 헤딩 위계 순차, aria-label(아이콘버튼), 키보드 내비(탭순서=시각순서), 폼 label[for], 에러 role=alert, 포커스 링, prefers-reduced-motion 준수.
- Layout: z-index 스케일(10/20/30/50), CLS 방지(aspect-ratio/고정높이), `dvh` 사용, 본문 65-75ch, overflow-auto(무분별 hidden 금지).
- Interaction: 로딩버튼 disabled+스피너, 에러 메시지 근처 표시, 파괴행동 확인, active:scale-95 등 즉각 피드백.
- Responsive/Perf: 가로스크롤 금지(max-w-full overflow-x-hidden), 모바일 본문 16px+, next/image로 최적화, loading=lazy(폴드 아래).
- AI Interaction: AI 생성물/추천 라벨 명확.

### motion.catalog.md (landing 열 — 표현 적극 허용)
- 강도 티어: Subtle(피드백)/Standard(연출)/Complex(스토리텔링). Hover 마이크로(150-300ms, ease-out), Scroll Reveal(Subtle~Complex scrollytelling 허용, pin 1-2섹션만), Stagger List(per-item 0.02-0.08s, 데이터 테이블엔 overshoot 금지), Page/Parallax(배경·장식 레이어만, 본문 parallax 금지 — 멀미).
- **공통 필수**: motion-reduce 게이팅, 결정론(고정값/삼각함수 소수 2자리, Math.random·Date.now 금지), 진입 opacity:0 잔존 금지, transform·opacity만 애니, 진입<250ms 진입<이탈 비대칭.
- framer-motion 매핑: whileHover/whileTap, whileInView+viewport once, variants+staggerChildren, AnimatePresence+layoutId(1쌍만), useScroll+useTransform(배경만).

## 게이트 기준
- static: no-next-font / no-font-serif / no-random(Math.random·Date.now·new Date()) / no-emoji / no-raw-img / no unoptimized / img alt 필수 — 위반 0건 필수.
- sweep: 데스크톱 1280/1366/1440/1536/1680/1920(±16px)+모바일 390px 전 구간 page/table-overflow 0.
- a11y ≥95 하드페일 기준. perf는 기록만(탈락 미적용).
- 라우트: `app/src/app/landing-evolve/r7/{a,b,c}/page.tsx` (+ 자기 폴더 내 서브컴포넌트 분리 허용). URL: `/landing-evolve/r7/<v>`.
- 참고 코드 컨벤션(읽기 전용, 수정 금지): `app/src/app/landing-evolve/r6/a/` (page.tsx 얇게 + ui.tsx/서브컴포넌트 분리, globals.css의 --font-sans 전역폰트 그대로 사용, tabular-nums 활용, lib/data.ts류로 상수 분리 패턴).
- next/image 허용 도메인: images.unsplash.com, plus.unsplash.com, picsum.photos, images.pexels.com.
