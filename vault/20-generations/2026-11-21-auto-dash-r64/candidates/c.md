# Candidate C — Vigil (SOC alert-triage console)

Route: `app/src/app/dash-evolve/r64/c/page.tsx`

## 요약

**Vigil** — 보안운영센터(SOC) 알럿 트리아지 콘솔. Mercury/Monarch급 라이트 테마 SaaS 대시보드로,
도메인 배정(security/SOC alert triage)과 매크로 레이아웃 배정(feed-centric)을 그대로 따른다.

### 구성 (feed-centric, 중앙 스트림 + 양옆 보조 패널)

- **왼쪽: Queue summary 패널** — 기간(1h/24h/7d) 세그먼트 컨트롤, 7일 알럿 볼륨 스파크라인,
  심각도별 카운트(지속 텍스트 + 바), SLA 초과 알럿 수, 그리고 **정렬 가능한 Analyst workload
  테이블**(aria-sort, 아바타 셀, On-call 배지).
- **중앙: Alert feed** — 검색 + 심각도 멀티토글 칩 + 상태/카테고리/정렬 드롭다운으로 실시간
  필터링되는 카드형 알럿 스트림(시간순).
- **오른쪽: Inspector 패널** — 핀된 알럿의 디테일 + 탭(`Risk profile` / `Playbook`) + **레이더
  차트**(이 알럿 vs. 카테고리 24h 베이스라인, 6축: Exploitability · Blast Radius · Data
  Sensitivity · External Exposure · Detection Confidence · Recurrence) + 모든 축값이 항상
  보이는 범례 테이블.

레이더의 두 데이터셋 값은 ① SVG 축 끝의 지속 라벨(이 알럿), ② 바로 아래 항상 보이는 범례
테이블(두 데이터셋 모두), ③ 호버/포커스 시 공유 1개 툴팁(두 데이터셋 모두) — 세 군데 모두
텍스트로 중복 노출되어 hover-only인 값이 전혀 없다.

### 구현한 인터랙션 (5개, 전부 `motion-reduce` 게이트)

1. **크로스헤어 호버/포커스 툴팁** — 레이더 축 6개의 invisible hotzone(키보드 tabIndex +
   focus-visible), 공유 1개 absolute 툴팁만 렌더링.
2. **실시간 정렬/필터** — 알럿 피드: 심각도 멀티토글 + 상태/카테고리 드롭다운 + 검색 + 정렬
   (최신순/심각도순), 모두 순수 함수(`filterAndSortAlerts`)로 재계산.
3. **기간 토글** — 1h/24h/7d 세그먼트 컨트롤, Queue 패널과 Feed 둘 다에 반영.
4. **독립 스코프 2축 선택** — (a) 피드 카드 클릭 → `pinnedId` → **Inspector 패널에만** 전달
   (Queue 패널·레이더 베이스라인 데이터셋은 절대 읽지 않음). (b) 피드 카드 호버/포커스 →
   순수 CSS(`hover:`/`focus-within:`)로 그 카드 내부에만 닫힌 ephemeral 하이라이트 — 상태
   리프팅 없음.
5. **⌘K 커맨드 팔레트** — 기간 전환·심각도 필터·카테고리 필터·필터 초기화·알럿 핀 커맨드.

### 폰트/웨이트

- Body/한글: `--font-sans` (Pretendard) 고정, 전역 CDN.
- Display: `--font-display-grotesk` — 워드마크 "Vigil"과 페이지 `<h1>` "Alert feed" 단 두
  곳에만, 라틴 텍스트에만 사용.
- 렌더 웨이트 정확히 3종: `font-normal`(400, 기본/본문) · `font-medium`(500, 라벨·버튼·네비·
  워드마크·h1) · `font-semibold`(600, 카드 제목·강조 수치). `font-bold` 등 그 외 웨이트 0건
  (grep 확인).

### 그리드/접근성 self-audit

- `min-w`은 어디서도 `td`/`th`에 두지 않음 — 두 테이블(Analyst workload, 레이더 범례) 모두
  `table-fixed` + `colgroup %`만 사용, `overflow-x-auto`는 페이지 전체에 **0개** (데스크톱
  테이블은 `lg:block`, 모바일은 카드 리스트로 `lg:hidden` 전환 — r54/a 패턴 재사용).
- truncate/nowrap 스팬은 전부 flex 자식이거나 명시적 `block w-full`.
- per-item 절대위치 데코 없음 — 레이더 공유 툴팁 1개만 조건부 마운트(opacity 트릭 아님, 완전
  unmount).
- 1920px: 사이드바 256px + 좌우 패딩 제외 가용폭을 그대로 flex(300px/flex-1/360px)로 소진,
  고정폭 우측 패널이 뷰포트 우측 패딩(24px) 안쪽에서 끝남. 1280~1600 전부 유체 레이아웃이라
  1px 핏 없음. 390px: 패널 세로 스택, 고정 테이블 없음.
- 접근성: 단일 `h1`, heading skip 없음(h1→h2→h3), 두 테이블 모두 `caption`(sr-only)+
  `scope="col"`+`aria-sort`, 포커스 링은 `outline-offset-2 outline-orange-600`을
  `focus-visible:outline-2`로만 게이트(`outline-none` 사용 안 함 — 실제로 페인트됨).
- 대비 self-audit: `orange-600`은 텍스트로 전혀 안 씀(흰 배경 대비 ~3.56:1로 미달) — 텍스트는
  `orange-700/800`만. 핀된 피드 카드는 배경이 `orange-50`로 틴트되므로 그 안의 보조 텍스트는
  `zinc-500`이 아니라 `zinc-600`으로 상향(틴트 표면 하한 충족). "Skip to content"·"New
  detection rule" 버튼도 `orange-600→orange-700`로 교정.

### 완성도

레퍼런스(Mercury/Asana급) 대비: 앱 셸(사이드바+워크스페이스 전환+탑바+⌘K+알림+계정메뉴+모바일
드로어)과 컴포넌트 시스템(Card, 정렬 테이블, 탭, 세그먼트, 드롭다운, 토글칩, 배지, 프로그레스,
스파크라인, 아바타) 모두 구현. 더미 데이터는 전부 결정론적(`Math.random`/`Date.now`/`new
Date()` 0건) — 심각도 카운트·analyst workload는 항상 필터링된 리스트에서 reduce로 재계산되어
집계가 어긋날 수 없다.

## 브리프에 없던 것

- **제품명/브랜드**: "Vigil" — 브리프는 도메인만 지정(SOC 알럿 트리아지), 이름은 미지정이라
  직접 작명. 보안 제품으로 흔히 쓰이는 "경계·감시" 어휘를 짧은 한 단어로 선택.
- **레이더 두 번째 데이터셋의 정체**: 브리프는 "2–3 overlaid datasets"만 요구. "이 알럿 vs.
  같은 카테고리의 24시간 베이스라인"으로 정의 — 트리아지 중 분석가가 실제로 묻는 질문("이
  알럿이 같은 유형의 평소 알럿보다 더 위험한가?")에 대응하는 비교축으로 선택.
- **카테고리 7종·축 6종의 구체적 값**: 브리프는 축 이름 예시(exploitability 등)와 5–8축
  범위만 제시. 실제 라벨 문구·카테고리 7종(Credential Access 등)·각 카테고리의 베이스라인
  수치·알럿별 수치는 전부 직접 설계한 결정론적 더미 데이터.
- **기간 버킷 경계(1h=60m, 24h=1440m, 7d=10080m)와 SLA 목표(critical 30m ~ low 24h)**:
  브리프는 "last 1h/24h/7d" 토글만 요구, 경계값과 SLA 수치는 SOC 업계 통념 기반으로 직접 설정.
  16개 알럿의 `ageMinutes`는 이 경계에 걸쳐 분포하도록 역산해 배치(기간 토글이 실제로 피드
  개수를 바꾸게 하려고).
- **"Inspector" 내부 탭 2개(Risk profile / Playbook)의 구성**: 브리프의 탭 컴포넌트 요구를
  충족시키되, 피드 필터(심각도/카테고리/상태)의 ARIA 역할과 충돌하지 않도록 — 탭은 실제로
  보이는 콘텐츠 패널을 전환하는 곳(Inspector)에만 쓰고, 피드 필터는 radiogroup/toggle-group
  의미에 맞게 세그먼트·드롭다운·토글칩으로 분리.
- **Queue summary를 `period`에만 의존시키고 `pinnedId`/피드 필터는 절대 안 읽게 한 경계선**:
  브리프의 "두 축 독립 스코프" 예시는 느슨하게 두 묶음만 요구했지만, 세 번째로 Queue 패널까지
  명확히 분리해 더 강하게 충족.
- **애널리스트 5명·픽션 이름/이니셜/온콜 여부**, 현재 사용자(Imogen Carter, SOC Shift Lead)와
  고정 Unsplash 사진 ID, 워크스페이스 3종 이름 — 전부 브리프 미지정이라 직접 작명.
- **분석가 아바타를 이니셜+결정론적 색상으로, 현재 사용자만 Unsplash 사진으로 처리한 분리**:
  브리프는 "fixed Unsplash IDs or initials" 둘 다 허용한다고만 명시, 어느 걸 어디에 쓸지는
  미지정 — 피드/큐 테이블처럼 다수 반복되는 아바타는 이니셜로 가볍게, 탑바/사이드바의 단일
  "나"는 사진으로 구분해 위계를 줬다.
- **테이블 2종 모두 `overflow-x-auto` 없이 데스크톱 테이블/모바일 카드-리스트 이중 렌더로
  처리한 것**: 브리프의 그리드 크래프트 규칙("min-w은 테이블에만")은 테이블에 min-w가 있는
  경우의 제약이고, 아예 min-w 없이 유체로 만들어 모바일에서만 다른 마크업으로 바꾸는 선택은
  브리프에 없던 해법 — 룰 위반 가능성 자체를 구조적으로 없앴다.
