# DECISION — auto-careers-r1

타깃: `careers` (신규 · 프로파일 부재 — [[page-brief-core]] §"타입 프로파일 목록" 규정대로 코어만으로 생성. `careers-deltas-provisional.jsonl`이 이 라운드에서 처음 생성되며, 여기서 나온 delta가 향후 `careers` 프로파일의 초안이 된다. 같은 날 앞서 진행된 `auto-about-r1`이 이미 생성한 타입(`about`)은 이번 실행에서 제외하고 큐의 다음 항목으로 내려온 결과 — 큐: about → **careers** → contact → developers → integration → media-kit.)

다양성 축: `catalog-variety.mjs` 실측 — 최근 3라운드(`auto-about-r1`→light/amber/grotesk, `auto-blog-r2`→dark/emerald/mono, `auto-profile-r2`→dark/cyan/wide) 기준 `banList = {theme:[], accent:[], face:[]}`(전부 공란 — 연속 동일 테마 2회 미충족, 액센트·활자도 윈도우 내 2회 미만). banList는 비어 있었으나 SKILL §2 "최소한 직전 2라운드 승자가 쓴 활자는 제외" 지침에 따라 `grotesk`(about-r1 승자)·`mono`(blog-r2 승자)를 배제하고 3후보에 `wide`/미지정(본문 산세리프)만 배정. 액센트는 카탈로그 과다색(violet-hex 7·indigo 5·sky 4)과 이번 라운드에 막 쓰인 about-r1의 amber를 피해 a=blue · b=orange · c=fuchsia로 배정. 테마는 a=dark · b=light · c=light.

매크로-버킷 선제 회피: 최근 라운드들의 스티키 KPI 스코어보드+토글(profile r1/r2), 탭/스테퍼 시퀀스(blog r2/a), 사이드바+히트맵 크로스필터(profile r1/b)에 더해, **같은 날 먼저 생성된 `about` 자매 라운드의 3형태**(단일컬럼 서사+타임라인 / 팀디렉토리 필터+검색 그리드 / 호버동기화 다이어그램+스텝)도 3후보 전원에게 회피 축으로 명시 전달.

## 후보
- **a — Fathom Labs**: 옵저버빌리티 SaaS의 Careers 페이지. "컬처 매니페스토 + 다면필터 오픈롤 리스트 + 슬라이드오버 드로어" — 3개 에디토리얼 서사 블록(How we work/build/grow, 각각 결정론적 SVG 다이어그램 동반) 아래 Team×Location 칩 필터 + 정렬(Newest/A-Z)이 구동하는 조밀한 역할 **리스트**("Showing N of M" 라이브 카운트) → 행 클릭 시 포커스 트랩+Escape+포커스 반환이 완비된 슬라이드오버 드로어(전체 JD + `mailto:` 지원 링크) → tabular-nums 베네핏 스트립. 다크/blue/wide. 인터랙션 3종(칩필터·정렬·드로어).
- **b — Portside**: 화물 마켓플레이스의 Careers 페이지. "라이브 검색 콤보박스 + 정렬 가능한 베네핏 비교 테이블 + 라이프스트립" — 실제 `role="combobox"`/`listbox` 패턴(화살표키·Enter·Escape·`aria-activedescendant`, reduced-motion 인지 스크롤)으로 역할 목록을 실시간 필터, 각 행은 개별 인라인 확장(모달 아님) → 3개 고용형태 열의 정렬 가능 시맨틱 베네핏 비교 테이블 → 4패널 결정론적 SVG 라이프스트립. 라이트/orange/미지정 활자. 인터랙션 3종(라이브검색·행별확장·테이블정렬).
- **c — Northlane**: 물류 가시성 SaaS의 Careers 페이지. "하이어링 FAQ 아코디언 + 부서별 그룹접기 롤 + 투명 보상밴드" — 단일개방 FAQ 아코디언("How we hire") → 부서별 독립 접기/펼치기 그룹(전원 기본 닫힘 + 파생 Expand all/Collapse all) → 완전 정적인 보상밴드 시맨틱 테이블(의도적으로 토글 없음, 코드 주석에 그 이유 명시). 라이트/fuchsia/미지정 활자. 인터랙션 3종(FAQ아코디언·그룹접기·전체펼침토글).

## 하드게이트
게이트 실행: `CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target web --routes /careers-evolve/r1/<v>`.

**1-fix 루프(a)**: 1차 static 위반 1건 — `no-emoji` 정적 규칙이 footer의 `©`(U+00A9, Unicode `Extended_Pictographic` 속성 보유)를 이모지로 오탐. `page.tsx:213` `© 2026 Fathom Labs` → `Copyright 2026 Fathom Labs`로 텍스트 치환 후 재게이트, 전 항목 통과(규칙 위반 해소이지 취향 개선이 아니므로 1-fix 범위 내). b·c는 1차부터 전 항목 통과. 최종: static 위반 0(전 후보) · weights 3종(전 후보) · sweep 오버플로 0(전 후보) · a11y a=100/b=97/c=100 · perf 기록만(a=71/b=70/c=70). 소스 동결 해시(1-fix 후): `65b17e3928bb9fa1712fe70ccf279d101daa9377`. 상세: SCORES.md.

스크린샷: 후보별 16장(4폭×4스크롤 지점), blank 판정 전원 통과(48/48).

## JUDGE 패널 (3렌즈, 블라인드 — 각 렌즈에 데스크톱 1280px + 모바일 390px × 스크롤 0/35/70/100% 8프레임/후보 제공)

### 렌즈1 — page-brief-core 준수 + 견고성
1위 a · 2위 b · 3위 c. **a — 실결함 0건**: 3종 웨이트 정확, 드로어가 수동 포커스 트랩+Escape+포커스 반환을 실제로 구현(가장 견고), 단일 h1·순차 헤딩, 칩 필터가 색+체크아이콘 이중코딩, 스킵링크·헤더 랜드마크 존재. **b — 하드위반 없음, 완결성 결함 1건**: `page.tsx` 어디에도 스킵링크·헤더/nav 랜드마크가 전무(`main`이 곧바로 히어로로 시작) — a·c 둘 다 있는 것과 대비. **c — 실결함 2건**: ① "정확히 3종 웨이트"라 자평하는 코드 주석과 달리 본문 문단 다수(`page.tsx` 여러 줄·`faq-accordion.tsx`·`roles-directory.tsx`)에 웨이트 클래스가 전혀 없어 Tailwind preflight의 초기값(400/normal)이 그대로 노출 렌더 — 명시 3종(medium/semibold/bold) + 암묵 400을 합쳐 **실질 4종**이 렌더되는 page-brief-core §4 위반(자동 `weights` 게이트는 명시 클래스명만 세므로 이 결함을 못 잡음 — 렌즈 전용 발견). ② 보상밴드 테이블의 `sr-only` caption(`page.tsx:157-159`)이 `overflow-x-auto` 컨테이너 안에 있는데 조상 어디에도 `position:relative`가 없어 page-brief-core §3의 명시된 anti-pattern과 동일 구조(현재는 `table-fixed`+%열이라 실피해 낮으나 잠재 결함).

### 렌즈2 — 상용 완성도(Stripe·Linear·Vercel·Ramp급)
1위 a · 2위 b · 3위 c. **a**: 카피가 가장 구체적("ingest pipeline that handles two million events a second", "$2,000 annual budget... spent without a manager's approval")이고, 12개 오픈롤 **전체가 기본적으로 상시노출된 리스트**이며 필터·정렬은 그 리스트를 좁힐 뿐 가리지 않음 — 드로어는 행에 없는 추가 정보(전체 JD)를 더할 뿐 증명을 지연시키지 않음. **b**: 콤보박스가 셋 중 가장 정교한 단일 인터랙션(진짜 ARIA combobox/listbox + reduced-motion 인지 스크롤)이나, 히어로/검색 섹션이 `max-w-3xl`인데 베네핏/라이프스트립 섹션은 `max-w-7xl`이라 1280px에서 상단 절반이 크게 비어보이다 갑자기 채워지는 레이아웃 불연속(가장 "미출시" 느낌 나는 결함) + 모바일 베네핏 테이블이 스크롤 신호(그림자/페이드) 없이 열이 잘림. **c — 가장 결정적 결함**: 부서 그룹 5개 전원이 `expanded[slug] = false`로 초기화(4개 스크린샷 전부 확인) — 방문자는 클릭 전까지 부서명과 개수만 보고 **실제 채용 공고 제목을 단 하나도** 볼 수 없음. a(전체 리스트 상시노출)·b(전체 카드 상시노출, 상세만 확장)와 달리 c는 핵심 콘텐츠(어떤 롤이 있는가) 자체를 인터랙션 뒤로 완전히 숨김 — "차별성↔완성도 상충 시 완성도 우선" 원칙이 정확히 겨냥하는 실패 유형.

### 렌즈3 — 아키타입 차별성
1위 a · 2위 c · 3위 b. **a**: 슬라이드오버 드로어(role="dialog", 포커스트랩)로 상세를 노출하는 메커니즘은 이날 생성된 다른 어떤 페이지(catalog/profile/blog/about 자매 3종/b/c)에도 없는 신규 조합 — 서사 셸(단일컬럼, 사이드바 없음, 교차 텍스트+일러스트 블록)이 자매 `about/a`(Portage)와 셸 레벨에서만 유사(위젯 페이로드는 완전히 다름 — a는 타임라인+values그리드+스크롤스파이, careers/a는 필터+드로어). **c**: FAQ-as-문화콘텐츠 + 그룹접기 롤 + 완전정적 보상표(토글 전무) 조합은 이날 유일하게 검색·필터·정렬이 전무한 매크로 조립이라 구조적으로 신규이나, 구성 위젯(아코디언 자체)은 같은 날 `about/a`의 마일스톤 타임라인과 `about/c`의 모바일 폴백 아코디언에서 이미 두 번 쓰인 상용 위젯이라 "조립은 신규, 부품은 상용"으로 기록. **b — 가장 낮은 구조 신규성**: 센터피스 메커니즘(검색이 좁히는 리스트 × 단일개방 인라인 디스클로저)이 **같은 날 생성된 자매 `about/b`(Tallwood)의 팀디렉토리**(부서칩+검색 이중필터 → 단일 `expandedId` 인라인 디스클로저 → "Showing N of M" 라이브카운트 → "Clear filters" 빈상태)와 사실상 동일 골격의 재스킨(부서칩 제거, 텍스트인풋을 풀 콤보박스로 승급, 그리드→리스트 출력만 변경) — 콤보박스 a11y 승급은 실재하는 폴리시이나 매크로 조립 자체는 신규가 아님. 정렬가능 베네핏 테이블은 b의 유일한 독자 기여이나, profile 타입이 이미 암시하는 정렬가능 테이블이라는 범용 위젯의 변주.

## 집계
1위 표: a **3표(렌즈1·렌즈2·렌즈3 전원)** — 만장일치, tie-break 불요.

## 승자 — a (Fathom Labs)
세 렌즈 모두 독립적으로 a를 1위로 판정. 렌즈1(무결함)·렌즈2(핵심 증명 상시노출 + 가장 구체적 카피)·렌즈3(드로어라는 이날 유일한 신규 메커니즘) 세 축이 상충 없이 수렴한 드문 라운드.

## 정제 조치 (§3-1)
없음. 1-fix 루프(§3 하드게이트 단계의 `©` 정적 위반 해소)는 승자 확정 **이전**의 통상 게이트 절차이며, 판정 자체를 받은 최종 소스(해시 `65b17e3928bb9fa1712fe70ccf279d101daa9377`)에 대해 3렌즈가 블라인드 판정했으므로 §3-1 "판정 후 수정" 조항은 해당 없음(적용 대상 없음 — 판정 후 추가 수정 없이 그대로 승격).

## 기권
없음 — 3렌즈 전원 정상 응답.

## 참고 — 비승자 결함 기록 (다음 라운드·정본 후보용)
- **c — 암묵 400웨이트 누출(재현 1회, L1 · page-brief-core 게이트 사각지대 후보)**: 자동 `weights` 게이트는 소스에 명시된 `font-*` 클래스명만 집합으로 세므로, 웨이트 클래스가 아예 없는 본문 텍스트가 브라우저/Tailwind preflight 기본값(400)으로 렌더되는 "네 번째 암묵 웨이트"는 기계로 못 잡는다. 렌즈1이 육안 대비로만 발견 — 다음 재현 시 `countFontWeights`를 "명시 클래스 집합"에서 "라우트 내 실제 렌더 웨이트 집합(기본값 400 포함 여부 정적 추론)"으로 확장하는 규칙 후보로 questions-queue 상정 검토.
- **c — sr-only caption + overflow-x-auto without position:relative(재현 1회, L1)**: page-brief-core §3에 이미 명시된 anti-pattern과 동일 구조가 실사용 조건(현재는 table-fixed라 무해)과 무관하게 코드 레벨에서 재발 — 정적 검사(`no-...`류) 후보로 향후 고려.
- **b — 스킵링크·헤더 랜드마크 전무(재현 1회, L1)**: about-r1의 Tallwood(팀디렉토리 타입)에서도 동일 결함이 관측된 바 있어(§ auto-about-r1 렌즈1 기록) 같은 날 **두 번째 재현** — `career`s/`about` 두 타입을 넘나든 재현이라 Q17("타깃을 넘는 재현은 같은 타깃 2회와 같은 증거력인가")과 같은 계열의 관측으로 questions-queue에 넣을지는 다음 재현을 보고 판단.
- **b — 같은 날 자매 타입과의 매크로 골격 재스킨(렌즈3 기록)**: 서로 다른 타입(about/careers)의 후보가 같은 세션에서 병렬 생성될 때 GENERATE 프롬프트가 "다른 타입의 오늘자 산출물"까지 회피 축으로 인지하지 못하면 재스킨이 새어나온다는 신호 — 이번엔 프롬프트에 이미 about 3형태를 회피 축으로 명시했음에도 b가 about/b의 세부 메커니즘(칩+검색+단일 인라인 디스클로저)까지는 피하지 못함. 향후 "동일 세션 병렬 라운드"에서 회피 지시의 구체성(매크로 셸 수준이 아니라 위젯 조합 수준까지)을 높일 필요 후보.

## LEARN — 델타 적재
```
careers-deltas-provisional.jsonl (신규 생성)
{round:'auto-careers-r1', variant:'a', delta:'Careers 타입은 오픈 롤 인벤토리 자체가 핵심 증명이다 — 최소 하나의 상시-노출 경로로 실제 공고 제목이 클릭 없이 보여야 한다. 전체를 기본 접힘으로 두면 상시-노출 증명 원칙 위반.', evidence:'렌즈2 c 판정 인용', judge_votes:{lens1:'a',lens2:'a',lens3:'a'}, confidence:'high', level:'L1', status:'provisional'}
```

## 지식 정제 게이트
`careers-deltas-provisional.jsonl` 최초 생성, 엔트리 1건 — 클러스터링·충돌쌍 대상 없음, 레벨 유지(L1). 신규 질문 없음 — 위 "참고"의 4개 관측은 전부 재현 1회(단, b의 스킵링크 결함은 about-r1 Tallwood와 같은 날 교차 재현이라 근접 관찰이나 정식 질문 승격 기준인 "충돌쌍 또는 meta-기준 정당화 불가"에는 아직 못 미침) — 다음 재현 시 questions-queue 후보로 재검토.
