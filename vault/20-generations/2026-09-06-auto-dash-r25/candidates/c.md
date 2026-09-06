# Candidate C — Portage

**One-line concept:** Portage is a pickup-logistics dispatch console for repick's reverse-logistics network, where a generative hex-zone map of today's collection routes is the page's dominant, interactive centerpiece.

**Macro-archetype:** map/geography-centric operations view — a hand-coded SVG hex map (hub + six radial zones + live van markers) is the page's visual and interactive spine, with a route rail, two independently-scoped detail panels, a trend chart, and a full data table arranged around it; this is distinct from all seven forbidden archetypes (no rail+detail spine carrying the whole page, no 3-pane trading terminal, no feed-as-spine, no calendar, no feature-flag workbench, no cohort matrix, no kanban), and distinct from "dense data-grid protagonist" / "hero-number dominant" since the map — not a grid or a single giant metric — carries the page.

## 브리프에 없던 것

**① Product/brand identity**
- 무엇을 정해야 했나: repick-adjacent 물류 오퍼레이션 툴의 브랜드명, 제품 개념, 도메인.
- 무엇으로 정했나: "Portage" — 중고거래 마켓플레이스의 역물류(픽업·수거) 디스패치 콘솔. 가상의 서울 6개 구역(강남·송파·성동·마포·은평·용산)에서 오늘의 수거 루트를 관리.
- 왜: "portage"는 물건을 나르다/이관하다라는 뜻으로 중고품 수거·이관이라는 도메인과 직접 연결되고, 기존 5라운드 대시보드와 겹치지 않는 로지스틱스 버티컬을 제공.

**② Macro-archetype selection**
- 무엇을 정해야 했나: 금지된 7개 아키타입과 두 자매 후보(dense-grid, hero-number)를 피하면서 독자적인 스켈레톤을 골라야 했음.
- 무엇으로 정했나: 지도/지리 중심 오퍼레이션 뷰 — 브리프가 예시로 제안한 아이디어 중 하나를 선택해 허브+6구역 헥스맵을 직접 SVG로 생성.
- 왜: 브리프가 명시적으로 제안한 옵션이라 안전하고, "격자/차트+사이드바" 같은 통상 패턴과 형태적으로 뚜렷이 달라 두 자매 후보와 수렴할 위험이 낮음.

**③ Theme + accent hue + contrast arithmetic**
- 무엇을 정해야 했나: 라이트/다크 중 테마 선택, 그리고 최근 5라운드(emerald/cyan/rose/amber/teal)와 catalog 전체 최다(violet/amber)를 피한 단일 액센트 색상.
- 무엇으로 정했나: 다크 테마(zinc-950 캔버스/zinc-900 패널/white-10 보더) + 블루 단일 액센트. 손으로 계산한 WCAG 상대휘도 대비:
  - blue-400 `#60A5FA` on zinc-950 `#09090b` = **7.83:1**
  - blue-400 on zinc-900 `#18181b` (카드 표면) = **6.98:1**
  - blue-300 `#93C5FD` on zinc-900 = **9.83:1** (배지처럼 작은 텍스트용 여유치)
  - blue-600 solid 배경 위 흰 텍스트 = **5.17:1**
  (모두 sRGB 감마 보정 후 relative luminance → contrast = (L1+0.05)/(L2+0.05) 공식으로 직접 계산.)
- 왜: 블루는 금지 목록(에메랄드/시안/로즈/앰버/틸/바이올렛) 어디에도 속하지 않으면서, 대비도 넉넉해 본문/배지/링크에 두루 쓸 수 있음. 상태 색(on-time=블루 재사용, at-risk=오렌지, delayed=레드, completed=zinc)도 같은 금지 목록을 피해 고름 — 오렌지는 앰버와 색상환상 인접하지만 Tailwind 팔레트상 별개 hue(앰버 ~45°, 오렌지 ~25°)이고, 레드는 로즈와 마찬가지로 별개 팔레트.

**④ 1920px 폭 상한 산수**
- 무엇을 정해야 했나: 콘텐츠 영역에 `max-w`를 씌울지, 씌운다면 1920px에서 우측 여백이 40px를 넘지 않는지 계산.
- 무엇으로 정했나: **캡을 아예 적용하지 않음.** 사이드바 256px(w-64) + 본문 좌우 패딩 64px(lg:px-8 = 32px×2) = 320px 예약. 1920 − 320 = 1600px가 본문에 그대로 배정되고, 뷰포트 우측 여백은 패딩 32px뿐(≤40px 규칙 통과).
- 왜: 임의의 max-w를 골라서 1660px 이상이어야 한다는 계산을 하기보다, 애초에 캡을 걸지 않는 쪽이 규칙을 자동으로 만족시키고 12열 그리드가 넓은 화면에서 실제로 넓게 쓰이는 편이 지도 중심 레이아웃에 더 어울림.

**⑤ 헥스맵 좌표계**
- 무엇을 정해야 했나: SVG 지도의 좌표 체계 — 허브 위치, 6구역 웨지 각도, 반경, 밴 마커 위치 계산식.
- 무엇으로 정했나: viewBox 600×520, 허브 (300,240), R_HUB=20, R_OUTER=230. 6구역은 0/60/120/180/240/300°에 중심각을 두고 ±30°로 쐐기꼴(허브→외곽 두 점) 삼각형을 만들어 정육각형을 이룸. 밴 위치는 `polar(angle, R_HUB + progress%×(R_OUTER−R_HUB))`로 진행률에 선형 비례. 정지(tick) 마커는 stopsTotal 등분점에 배치. 모든 좌표는 `Math.cos/Math.sin`으로 런타임에 계산 후 소수점 2자리로 반올림(`r2`) — 하드코딩된 난수 없이 결정론적.
- 왜: 실제 서울 지리가 아니라 "허브로부터의 상대 거리·방위"를 보여주는 양식화된 오퍼레이션 지도임을 범례(figcaption)에 명시했고, 6개 구역이 정확히 60°씩 나뉘는 대칭 구조라 두 노선이 겹치는 구역은 ±12° 오프셋으로 분리.

**⑥ 브랜치형 선택 상호작용의 구체적 설계**
- 무엇을 정해야 했나: 브리프가 요구한 "하나는 지속 선택(부분 재계산), 하나는 순간 인스펙터"의 실제 매핑.
- 무엇으로 정했나: 지도의 밴 마커·큐 리스트의 핀 버튼을 클릭 → `pinnedRouteId` 지속 상태. 이 상태는 지도 자체의 하이라이트(다른 노선 28% 투명도로 dim)와 `PinnedRoutePanel`만 재계산하고, 바로 옆 `ZoneLoadPanel`(전체 도시 집계)은 의도적으로 그대로 둠 — 컴포넌트 상단 주석으로 이유 명시. 마우스 호버/키보드 포커스는 `hoveredRouteId`라는 별도 상태로 지도 하단의 "인스펙터 스트립"에만 순간적으로 나타났다가 mouseleave/blur에 완전히 사라짐(영속 상태 없음).
- 왜: 두 상호작용이 서로 다른 스코프(부분 재계산 vs 완전 휘발)를 가져야 "master-detail과 구별 불가"라는 반복 지적을 피할 수 있음. ZoneLoadPanel을 고정한 이유는 실제 운영자가 "이 노선에 집중하는 동안에도 도시 전체 기준선은 흔들리지 않아야 한다"는 현실적 UX 근거.

**⑦ 컴포넌트별 더미 데이터(노선·구역·인력)**
- 무엇을 정해야 했나: 9개 노선, 6개 구역, 드라이버 명단, 아이템/무게 수치, 시간대별 정시율 시리즈.
- 무엇으로 정했나: 구역별 용량(capacity) 상수만 손으로 정하고, 아이템/무게/loadPct는 전부 `ROUTES` 배열에서 `reduce`로 파생 — 구역 합계(356개, 808kg)가 전체 합계와 항상 일치하도록 코드로 보장. 7일 정시율 평균(91.6%)도 트렌드 배열 자체를 평균 내어 KPI 카드에 씀(별도로 다시 타이핑하지 않음).
- 왜: "부분합은 전체합과 일치해야 한다"는 요구를 손 계산 실수 없이 만족시키는 가장 안전한 방법은 파생값을 코드가 계산하게 하는 것.

**⑧ 표시 서체**
- 무엇을 정해야 했나: 선택적 디스플레이 서체 사용 여부.
- 무엇으로 정했나: `--font-display-grotesk`(Space Grotesk)를 사이드바 브랜드 워드마크 "Portage" 한 곳에만 15px semibold로 적용. 그 외 전부 Pretendard(`--font-sans`).
- 왜: 최근 5라운드 중 `wide`가 두 번 쓰여 다양성 차원에서 grotesk를 택함. 워드마크 한 곳에만 적용해 실제 렌더링 굵기(3종: 400/500/600)에 영향을 주지 않도록 함.

**⑨ 매니페스트 테이블 컬럼 폭**
- 무엇을 정해야 했나: `table-fixed`+`colgroup` 사용 시 각 컬럼 최소 콘텐츠 폭을 먼저 계산해 겹침을 방지.
- 무엇으로 정했나: Route 140px / Driver 170px / Stops 120px / Items 70px / Weight 90px / Status 110px / ETA 110px / Trend 90px, 합 900px → `min-w-[960px]`로 안전마진. 퍼센트는 16/19/13/8/10/12/12/10으로 배분(합 100%). 이 표만 유일한 `overflow-x-auto` 컨테이너로 두어, 페이지 내 두 개의 독립된 가로 스크롤 컨테이너가 동시에 존재하지 않도록 함.
- 왜: 진행바+배지+아바타처럼 폭이 있는 인라인 요소가 들어가는 컬럼을 과소 배정하면 겹침이 발생한다는 반복 지적을 피하려고 콘텐츠 폭을 먼저 합산.

**⑩ 워크스페이스/조직 구조**
- 무엇을 정해야 했나: 사이드바 워크스페이스 스위처에 넣을 가상의 지역/조직 목록.
- 무엇으로 정했나: "Seoul Metro"(기본, Primary region), "Busan Coastal"(Secondary), "Incheon Bay"(Pilot).
- 왜: 단일 도시가 아니라 여러 지역 오퍼레이션을 관리하는 실제 물류 SaaS의 느낌을 주면서도, 본문 데이터는 현재 워크스페이스(Seoul Metro) 하나에만 집중해 데이터 정합성을 단순하게 유지.
