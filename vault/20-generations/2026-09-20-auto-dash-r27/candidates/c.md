# Candidate C — Vantage

**One-line concept:** Vantage is a dark, single-amber-accent vendor-risk scorecard console where a hand-built seven-axis SVG radar comparing three contract-packaging vendors is the page's dominant visualization — every axis score is also printed, exact, in an always-visible sortable comparison table beneath it — and two independently-scoped selections (a legend checkbox set driving the radar, a table row-click driving a separate spotlight card) never thread into each other.

## 적용한 인터랙션

1. **레이더 축 hover/focus 크로스헤어** — `RadarChart.tsx`는 7개 축마다 라벨과 별개로, 절대 위치된 투명 `<button>` 핫스팟(축마다 1개, 정점마다가 아니라 축 단위로 묶어 tab 정지점을 7개로 유지)을 두고, `onMouseEnter/onFocus`로 열리는 `aria-live="polite"` 툴팁이 그 축의 세 벤더 값 + 코호트 평균을 동시에 보여준다. 값 자체는 툴팁 없이도 아래 표에 항상 보인다.
2. **벤더 토글(범례形 체크박스)** — `VendorToggle.tsx`의 `<fieldset>`이 어떤 벤더가 레이더 폴리곤으로 그려질지 결정하는 `plotted` 상태를 갖는다. 마지막 1개는 끌 수 없게 막아(빈 레이더 방지) 항상 최소 1개 폴리곤이 보인다.
3. **실제 테이블 정렬/필터** — `ScoreTable.tsx`는 Vendor/Band/Overall 세 헤더에 `aria-sort`를 갖춘 클릭 정렬을 붙였고, 위쪽 `Segmented` 컨트롤로 위험 밴드(All/Strong/Watch/At risk) 필터도 적용된다.
4. **선택 → 다중 위젯 동기화(파급 범위 분리)** — 표의 벤더 이름 버튼을 누르면 `spotlightId`가 바뀌어 **`VendorSpotlight` 카드 하나만** 재계산(순위·축별 코호트 대비 편차·컨텍스트 탭)한다. 이 상태는 `RadarChart`의 `plotted` 집합과 완전히 분리된 별개의 state — 레이더에 어떤 벤더가 켜져 있든 스포트라이트는 영향받지 않고, 반대로 스포트라이트를 바꿔도 레이더·범례·"Category leaders" 패널은 그대로다. 두 위젯(레이더+범례 vs. 표+스포트라이트) 각각이 자기 소유의 선택 상태를 갖는 구조로, 동일 이름의 `selectedId` prop을 형제 컴포넌트에 그대로 threading하는 함정을 피했다.
5. **커맨드 팔레트(⌘K, 보너스)** — 벤더 3개 + 네비게이션 항목을 검색하고, 화살표 키로 이동, Enter로 벤더를 선택하면 그 벤더가 스포트라이트로 지정된다.

## 브리프에 없던 것

**① 벤더 도메인 · 이름 · 카테고리**
- 무엇을 정해야 했나: "2-3개 벤더를 5-8개 축으로 비교"라는 요구를 채울 구체적 조달 카테고리와 가상 회사명.
- 무엇으로 정했나: "Contract packaging — Tier 1" 카테고리 아래 3개 벤더(Solenne Materials/Kestrel Pack Co./Anchorline Supply, 각각 프랑스/영국/필리핀 소재)를 만들고, overall 7.4/5.1/3.8로 strong/watch/weak 세 밴드를 모두 실제로 채워 밴드 필터 3종이 전부 의미 있게 동작하게 했다.
- 왜: 밴드가 하나만 존재하면 필터 인터랙션이 사실상 눈속임이 된다 — 세 밴드를 실제로 채우는 편이 "at-a-glance completeness"를 인터랙션 없이도 증명한다.

**② 7개 축의 선택과 표 안에서의 축약**
- 무엇을 정해야 했나: 브리프가 예시로 든 8개 축 중 몇 개·어떤 조합을 쓸지, 그리고 10컬럼(Vendor+Band+7축+Overall) 표를 `table-fixed`로 데스크톱 가로 스크롤 없이 앉힐 방법.
- 무엇으로 정했나: Pricing competitiveness를 빼고 7축(Financial stability/Delivery reliability/Compliance/Quality/Security posture/Responsiveness/Sustainability)을 채택. 표 헤더는 `AXIS_SHORT`(Fin./Del./Comp./Qual./Sec./Resp./Sust.) 약어를 쓰고 전체 이름은 `<th>` 안 `sr-only` 스팬 + 표 아래 상시 노출 범례 줄 + `<caption>`에 전부 명시했다.
- 왜: 1280px 데스크톱에서 컬럼 10개가 살아남으려면 각 축 컬럼이 9% 폭(≈83px) 안에 들어야 하는데, 전체 이름("Financial stability")은 그 폭에서 줄바꿈되거나 잘린다 — 약어+범례가 "말 중간에 자르지 말 것"(ellipsis 금지) 규칙과 표 폭 제약을 동시에 만족.

**③ 레이더 라벨 반경(LABEL_R)과 390px 클리핑 계산**
- 무엇을 정해야 했나: 레이더가 관례적으로 쓰는 축 반경(~1.15×MAX_R)을 그대로 쓰면 390px 모바일에서 라벨이 카드 경계를 넘는지 실제로 계산.
- 무엇으로 정했나: 7축의 각도(-90°에서 51.43°씩 회전)를 직접 대입해보니 서쪽/동쪽에 가까운 두 축(약 5%·95% 지점)이 모바일 컨테이너(≈326px 폭)에서 전체 이름 기준 텍스트 절반 폭(≈30-50px)이 여백(≈15-17px)을 넘어선다는 걸 계산으로 확인 — 그래서 라벨을 짧은 약어(AXIS_SHORT)로 바꾸고 `LABEL_R`을 46→42로 낮춰 여백을 29.5px로 늘렸다. 데스크톱에서는 반대로 `max-w-[420px]`에 `xl:`/`2xl:` 단계를 얹어 1920px에서 레이더가 왜소해 보이지 않게 키웠다.
- 왜: "레이더가 390px까지 포함해 전 구간에서 legible/not clipped여야 한다"는 요구가 구체적 반경·폰트 크기까지 정해주지 않아서, 실제 컨테이너 폭 대비 텍스트 폭을 계산해 값을 역산했다 — 감으로 고르면 정확히 이 계산에서 걸리는 두 축(동/서쪽)만 조용히 잘리는 경우를 놓치기 쉽다.

**④ 차트 계열색(3벤더) vs. 단일 UI 액센트의 분리**
- 무엇을 정해야 했나: 배정된 단일 앰버 액센트를 레이더의 3개 벤더 폴리곤에도 그대로 확장할지, 아니면 별도 계열색을 쓸지 — 브리프는 "단일 액센트"와 "색맹 안전 계열색"을 동시에 요구해 이 둘이 정면으로 부딪힌다.
- 무엇으로 정했나: UI 크롬(활성 네브 pill, 포커스 링, 주요 버튼, 세그먼트 thumb)은 앰버 하나로 고정하고, 3개 벤더 폴리곤은 dataviz 스킬의 검증된 다크서피스 순서(blue #3987e5/orange #d95926/aqua #199e70)를 쓰고 stroke도 solid/dashed/dotted로 달리했다. `scripts/validate_palette.js`로 `zinc-950`(#09090b) 배경 대비 3색 전부 실행해 CVD Δe 9.4, 명시각 대비 3:1 이상을 확인.
- 왜: 앰버를 4번째 계열색으로 끼워 넣으면 "앰버 벤더가 더 중요해 보이는" 암묵적 위계가 생긴다 — 브리프의 "단일 액센트"는 UI 크롬을 말하는 것이지 데이터 잉크까지 앰버로 통일하라는 뜻은 아니라고 해석했고, 검증 스크립트로 그 해석이 실제로 색맹 안전한지 확인했다.

**⑤ 표의 아바타 셀(관계 담당자)**
- 무엇을 정해야 했나: "실제 정렬 가능한 데이터 테이블(호버 행·상태 배지·아바타 셀·aria-sort)" 요구 중 "아바타 셀"을 벤더 비교 표(회사 단위 행)에서 무엇으로 채울지 — 회사에는 얼굴 사진이 없다.
- 무엇으로 정했나: 각 벤더에 가상의 "relationship owner"(Priya Kade/Owen Marsh/Renata Solis, 실제 Unsplash 사진 ID 고정)를 붙이고, 벤더명 셀 안에 그 담당자의 24px 아바타를 벤더 계열색 링으로 감싸 표시했다.
- 왜: 벤더 자체는 사람이 아니라 사진을 붙일 근거가 없지만, "구매팀 담당자"라는 현실적 필드를 추가하면 아바타 셀 요구를 눈속임 없이 채우면서 동시에 표에 실무적 정보(누가 이 벤더를 담당하는지) 한 칸을 더 준다.

**⑥ 두 독립 선택 상태의 실제 배선과 Tabs id 연결**
- 무엇을 정해야 했나: "두 개의 독립적으로 스코프된 선택 상태" 권장 패턴을 실제 코드에서 어느 두 위젯에 얹을지, 그리고 `VendorSpotlight` 내부 탭(Axis breakdown/Context)의 `aria-controls`/`aria-labelledby`를 `Tabs`와 `TabPanel`이라는 별개 컴포넌트 사이에서 어떻게 정확히 일치시킬지.
- 무엇으로 정했나: (레이더+범례 legend, plotted 상태) / (표+스포트라이트, spotlightId 상태) 두 쌍으로 나눴다. `Tabs`는 처음에 `useId()`로 자체 id를 또 생성했는데, 그러면 부모가 `TabPanel`에 넘기는 `idBase`와 어긋나 `aria-controls`가 존재하지 않는 id를 가리키는 걸 코드 리뷰 중 발견 — `useId()`를 빼고 호출자가 넘긴 `idBase` 문자열을 그대로 쓰도록 고쳤다.
- 왜: 컴포넌트가 내부적으로 "더 안전해 보이는" id를 자체 생성하면, 그 id를 모르는 형제/부모 컴포넌트와의 연결이 조용히 끊긴다 — accessibility 트리 연결은 두 컴포넌트가 문자열을 그대로 공유할 때만 성립하므로, 이번처럼 소유자(부모)가 준 문자열을 그대로 신뢰하는 쪽으로 정정했다.
