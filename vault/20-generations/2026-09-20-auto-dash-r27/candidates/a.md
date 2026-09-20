# Candidate A — Waymark

**One-line concept:** Waymark is a dark, teal-accented OKR console where a 12-row, 3-objective bullet-chart grid is the page's single dominant visualization — every row shows its value, target tick and qualitative band as standing text at first paint, pinning a row recomputes exactly one focus card, and the check-ins log below explicitly stays unfiltered by that pin.

## 적용한 인터랙션

1. **호버/키보드 포커스 상세 공개** — `BulletGrid.tsx`의 각 행은 `<button>`으로 감싸여 있고, `onMouseEnter/onFocus`로 열리고 `onMouseLeave/onBlur`로 닫히는 `grid-template-rows` 아코디언(0fr→1fr, `motion-reduce`에서는 즉시 스냅)에 "쿼터 시작 대비 변화량 + 체크인 메모"를 담는다. 값·타깃·상태 배지는 이 상호작용과 무관하게 항상 보이는 텍스트다.
2. **실제 테이블 정렬/필터** — `CheckinsTable.tsx`는 팀 탭(All/Platform/Growth/Customer Success)으로 필터되고, `aria-sort`를 갖춘 세 개의 정렬 헤더(Confidence/Δ vs prior/Date)로 정렬된다.
3. **기간(뷰) 토글** — `BulletGrid.tsx`의 세그먼트 컨트롤("Latest check-in" / "Quarter start")이 12개 행 전체의 값·상태·막대 위치를 그 자리에서 다시 그린다.
4. **선택 → 다중 위젯 동기화 (파급 범위 분리)** — 행의 Pin 버튼(호버 버튼과는 별개의 형제 `<button>`)을 누르면 `WaymarkClient`의 `pinnedId`가 바뀌고, 이는 `FocusRail.tsx`의 "Pinned key result" 카드 **단 하나만** 재계산한다. `CheckinsTable.tsx`는 `pinnedId`를 아예 props로 받지 않고, 헤더에 "Network-wide — not filtered by the pin above" 뱃지를 상시 노출한다. `FocusRail`의 "Objectives rollup" 카드도 핀과 기간 토글 둘 다 무시하고 항상 최신 체크인 기준으로만 계산된다는 문구를 자체 힌트에 명시한다.
5. **커맨드 팔레트 (⌘K)** — 12개 key result + 3개 objective를 검색하고, key result를 선택하면 그 항목이 곧바로 pin된다(목표(objective) 검색 결과는 아직 별도 동작이 없음 — 범위를 의도적으로 좁혔다, 아래 참고).

## 브리프에 없던 것

**① 제품/브랜드와 도메인**
- 무엇을 정해야 했나: "OKR 콘솔"이라는 카테고리에 맞는 가상 브랜드명과, 12개 KR을 자연스럽게 채울 조직 구조.
- 무엇으로 정했나: **Waymark** — 엔지니어링/프로덕트 조직의 분기(Q3 2026) OKR을 추적하는 콘솔. 3개 Objective(플랫폼 신뢰성/성장 파이프라인/고객 리텐션) × 4개 Key Result = 12행, 이는 브리프가 요구한 "10+ bullet chart"를 충족하면서 실제 회사가 쓸 법한 크기(월별이 아니라 분기 단위 OKR)로 골랐다.
- 왜: 카탈로그에 이미 있는 히어로-KPI/워터폴/트리맵/펀넬 등과 구조적으로 겹치지 않는 "불릿차트 그리드가 페이지를 지배하는" 새 매크로 형태를 만들되, OKR이라는 도메인 자체가 "값-타깃-정성 밴드"라는 불릿차트의 본래 용도와 가장 자연스럽게 맞아떨어진다고 판단했다(재고/SLA/트레이딩처럼 억지로 불릿차트에 끼워 맞추지 않아도 됨).

**② 다크 + 티얼 토큰 재사용 여부**
- 무엇을 정해야 했나: 이번 라운드에 배정된 "다크 테마 + 티얼 단일 액센트"를 어떤 정확한 헥스/셰이드 조합으로 구현할지.
- 무엇으로 정했나: r21/c(Flowline)가 이미 같은 테마·액센트 배정으로 검증해 둔 토큰 세트(`zinc-950`/`zinc-900`/`border-white/10`, `teal-400` 텍스트, `teal-800` 솔리드, `FOCUS`의 `outline-teal-400` + `shadow-[0_0_0_3px_rgba(45,212,191,0.22)]`)를 그대로 재사용했다. 새로 추가한 것은 밴드 상태 3색(`STATUS_BADGE`/`BAND_FILL`/`VALUE_BAR_FILL` — poor=rose, satisfactory=amber, good=teal)뿐이다.
- 왜: 이미 같은 테마+액센트 조합이 하드게이트를 통과한 정본 값이므로, 대비를 처음부터 재계산하는 대신 그 값을 그대로 물려받는 편이 안전하다. "On track" 상태에 브랜드 액센트(teal)를 재사용한 것도 r21/c의 `RISK_DOT.healthy = teal-500` 선례를 그대로 따른 것 — 상태색이 4번째 색상이 되지 않고 액센트가 이중 역할을 하게 해서 "단일 액센트" 규칙을 지킨다.

**③ 1920px 가용폭 계산 (필수)**
- 무엇을 정해야 했나: 셸(사이드바+패딩)을 뺀 실제 콘텐츠 가용폭이 1920px에서 얼마나 남는지, `max-w` 캡이 필요한지.
- 무엇으로 정했나: **캡 없음.** 셸 = 사이드바 `w-64`(256px, `lg:block`) + 본문 `lg:px-8`(좌우 64px). 1920 − 256 − 64 = **1600px**가 그대로 본문에 배정되고, 뷰포트 우측 끝까지 남는 간격은 패딩 32px뿐이다. 1280px에서도 1280 − 320(모바일 사이드바 숨김 임계 이하가 아니므로 `w-64`+패딩 적용) = 960px 가용, `CheckinsTable`의 `min-w-[640px]`와 320px 여유가 있어 데스크톱에서 스크롤바가 생기지 않는다.
- 왜: r26에서 이미 동일한 셸 치수(사이드바 256px + `lg:px-8`)로 이 계산을 검증했으므로 같은 구조를 재사용해 규칙을 구조적으로 만족시켰다.

**④ 불릿차트의 좌표계: 밴드마다 다른 도메인, 정규화하지 않은 원값 막대**
- 무엇을 정해야 했나: 12개 KR이 단위(%, ms, $, count, days, /100)와 방향(클수록 좋음 vs 작을수록 좋음)이 모두 다른데, 하나의 시각적 언어로 그릴 방법.
- 무엇으로 정했나: 각 KR마다 자기 자신의 `domainMax`(예: latency는 0–320ms, 배포 성공률은 0–100%)를 갖고, 막대는 그 도메인 안에서의 **원값 비율**로 그린다(값을 0–100으로 재정규화하지 않음). 배경 밴드 3개(poor/satisfactory/good)도 같은 도메인 좌표로 색칠하고, "작을수록 좋음" 지표는 good 밴드가 왼쪽(0 근처), "클수록 좋음" 지표는 good 밴드가 오른쪽(도메인 상한 근처)에 오도록 방향을 뒤집었다. 막대 채움색 자체도 `bandFor(value)`가 반환하는 톤을 그대로 써서(poor=rose/sat=amber/good=teal) 막대 위치와 막대 색이 서로 다른 각도에서 같은 결론을 이중으로 보여준다.
- 왜: 이것이 실제 Stephen Few식 불릿차트의 원래 정의(정성적 밴드 위에 원값 크기의 막대 + 타깃 틱)이고, 브리프가 "진짜 불릿차트 모양이어야 한다, 위장한 프로그레스 바가 아니어야 한다"고 명시했다. 값을 0–100으로 재정규화했다면 "달성률 막대"가 되어 프로그레스 바와 구분이 안 됐을 것이다.

**⑤ 선택→다중 위젯 동기화의 파급 범위 분리 (핵심 판정 축)**
- 무엇을 정해야 했나: "호버=순간, 핀=지속"을 실제로 다른 스코프로 갈라놓고 그 경계를 화면에서 보이게 만들기.
- 무엇으로 정했나: 호버/포커스 상태(`hoveredId`)는 `BulletGrid` 내부에만 존재하고 부모로 전혀 전달되지 않는다 — mouseleave/blur 즉시 사라지는 순수 로컬 상태다. 반면 핀(`pinnedId`)은 `WaymarkClient`로 리프팅되어 **`FocusRail`의 "Pinned key result" 카드 하나만** 재계산한다. `FocusRail`의 두 번째 카드("Objectives rollup")는 핀도, `BulletGrid`의 기간 토글도 읽지 않고 항상 최신 체크인 기준 평균만 계산하며 그 사실을 자체 힌트 텍스트("unaffected by the grid's period toggle and the pin above")로 명시한다. `CheckinsTable`은 `pinnedId`를 props로 받지 않고 코드 주석과 헤더 뱃지 양쪽에서 "이 표는 핀의 영향을 받지 않는다"를 명시한다.
- 왜: r17–r19에서 반복 감점된 "단일 selectedId를 형제 컴포넌트에 동일 프롭명으로 threading"하는 함정을 피하기 위해, 이름이 아니라 **파급 범위 자체**를 나눴다. 세 곳(호버-로컬/핀-단일카드/체크인표-무관)이 서로 다른 스코프를 갖고, 그중 두 곳은 "왜 반응하지 않는지"를 UI 문구로도 증명한다.

**⑥ 더미 데이터의 결정론과 합계 정합**
- 무엇을 정해야 했나: 12개 KR의 목표·현재값·분기시작값·밴드 경계, 그리고 KPI 카드(온트랙/앳리스크/오프트랙 개수, 이번 주 체크인 수)의 숫자가 실제 데이터에서 파생되도록 만들기.
- 무엇으로 정했나: `bandFor()`가 각 KR의 `segments` 배열을 순회해 상태를 판정하고, `ON_TRACK_COUNT`/`AT_RISK_COUNT`/`OFF_TRACK_COUNT`는 전부 `KEY_RESULTS.filter(...)`의 런타임 결과다. 6주 스파크라인(`ON_TRACK_TREND`, `CHECKIN_TREND`)은 앞의 5개 점만 손으로 고정하고 마지막 점은 항상 그 살아있는 카운트를 대입해("트레일링 포인트가 항상 라이브 값") 스파크라인 끝점과 옆의 큰 숫자가 절대 어긋나지 않게 했다. 체크인 날짜는 오늘(2026-09-20) 기준 `WEEK_START = "2026-09-14"`를 기준선으로 `CHECKINS_THIS_WEEK`를 필터링해서 계산했다.
- 왜: 손으로 두 곳에 같은 숫자를 따로 타이핑하면 라운드가 거듭될수록 어긋나기 쉽다는 게 이전 라운드들의 반복된 실패 패턴이라, 이번엔 "합계는 항상 필터/리듀스의 결과"라는 원칙을 예외 없이 지켰다.

**⑦ 카드 모서리 clipping (실측 버그 수정)**
- 무엇을 정해야 했나: `BulletGrid`의 마지막 objective 그룹의 마지막 행이 pin되면 `bg-teal-500/[0.06]` 배경을 갖는데, 이 `<li>`가 `rounded-2xl` 카드의 맨 아래 모서리에 정확히 닿는 마지막 DOM 자식이 될 수 있다. `Card`의 기본 토큰에는 `overflow-hidden`이 없어서, 사각형 배경이 둥근 모서리 바깥으로 튀어나올 수 있었다.
- 무엇으로 정했나: `BulletGrid`에서만 `<Card padded={false} className="overflow-hidden">`로 오버라이드해서 내부의 전체폭 배경(objective 헤더 틴트, pin된 행 틴트)이 카드의 둥근 모서리 안에서만 칠해지게 했다.
- 왜: 이건 브리프가 명시적으로 요구한 항목은 아니지만, "그리드 아이템 안의 전체폭 색상 블록 + 둥근 카드"라는 조합이 이 페이지에만 있는 새로운 레이아웃(다른 카탈로그 후보들은 그룹 헤더가 있는 리스트형 카드를 안 씀)이라 실제로 렌더링을 상상해보고 발견해 미리 고친 케이스다.

**⑧ 디스플레이 서체 적용 범위**
- 무엇을 정해야 했나: 이번 라운드에 배정된 `--font-display-grotesk`를 "워드마크 한 곳"에만 쓸지, 더 넓게 쓸지 — 이전 라운드들은 배정이 없거나(r21/c) 워드마크에만 썼다(r21/a).
- 무엇으로 정했나: 워드마크(Waymark) + 페이지 `<h1>`("Goals console") + `Eyebrow` 컴포넌트(모든 대문자 마이크로 라벨) + `BulletGrid`의 objective 그룹 헤딩(`<h3>`)까지 네 곳에 적용했다. 표 헤더, 본문, 카드 힌트, 뱃지, 아바타 이름 등은 전부 Pretendard(`--font-sans`) 그대로다.
- 왜: 이번 라운드는 서체가 "미배정"이 아니라 명시적으로 배정됐으므로, 배정을 실제로 활용하는 편이 "배정을 문자 그대로 지키되 아무 데도 안 씀"보다 브리프 의도에 더 부합한다고 판단했다. 다만 라틴/헤드라인/워드마크/아이브로우라는 화이트리스트 범위를 넘지 않도록 표 본문·배지·아바타 이름 같은 "데이터"에는 절대 적용하지 않았다.

**⑨ 커맨드 팔레트에서 objective 검색 결과의 동작 범위**
- 무엇을 정해야 했나: ⌘K에서 key result와 objective를 모두 검색 가능하게 했는데, objective를 선택했을 때 무엇이 일어나야 하는지 브리프에 없음.
- 무엇으로 정했나: key result 선택 시에만 그 항목을 pin하고, objective 선택은 현재 아무 동작도 하지 않는다(검색 결과에는 나타나지만 클릭 시 그냥 팔레트만 닫힘).
- 왜: objective 선택 결과에 반응해 `BulletGrid` 내부의 로컬 필터 탭을 바꾸려면 그 로컬 상태를 `WaymarkClient`까지 다시 끌어올려야 하는데, 이는 "④ 선택 파급 범위 분리" 원칙에서 의도적으로 지킨 "단일 리프트업 지점(pin)"을 두 개로 늘리는 것이라 판단해 범위를 좁혔다. 완전하지 않은 기능보다 명확한 경계가 있는 기능을 택했다.
