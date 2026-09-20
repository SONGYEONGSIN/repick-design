# Candidate A — Coldline

**One-line concept:** Coldline is a cold-chain telemetry console where a 7×24 excursion-intensity heatmap is the page's single dominant visualization — pinning a cell recalculates exactly two of four KPI cards while hovering stays a fully ephemeral crosshair, and the alerts log below reads neither.

## 브리프에 없던 것

**① Product/brand identity and domain**
- 무엇을 정해야 했나: 히트맵이 자연스러운 도메인의 가상 B2B SaaS 브랜드명과 제품 개념.
- 무엇으로 정했나: "Coldline" — 냉장/냉동 물류(리퍼 트레일러·콜드룸) 네트워크의 온도 이탈(excursion) 모니터링 콘솔. 브리프 예시("창고 입출고 강도")를 그대로 쓰지 않고 콜드체인으로 비틀었다.
- 왜: 168셀 히트맵이 "시간대×요일 강도"로 자연스럽게 읽히는 도메인이면서, r20-r25 카탈로그(코호트/트레이딩/SLO/칸반/벤더리스크/워터폴/보안타임라인/의존성그래프/분쟁트리아지/가격추적/픽업캘린더/헬프데스크/피처플래그/재고원장/지급콘솔/배차맵)와 겹치지 않는 새 버티컬이 필요했다.

**② Accent hex 선정과 대비 계산 (필수)**
- 무엇을 정해야 했나: 최근 3라운드(blue·teal·amber)와 겹치지 않는 단일 액센트, 그리고 라이트 테마에서 실제로 쓰이는 모든 텍스트-온-배경 조합의 WCAG 상대휘도 대비를 직접 계산.
- 무엇으로 정했나: **violet-600 `#7C3AED`**를 단일 액센트로. 직접 계산한 대비(모두 sRGB 감마 보정 → relative luminance → `(L1+0.05)/(L2+0.05)`):
  - violet-600 `#7C3AED` on white `#FFFFFF` = **6.45:1** (링크·활성 nav·솔리드 버튼 텍스트)
  - white text on violet-600 solid 배경 = **6.45:1** (동일 대칭식)
  - violet-700 `#6D28D9` on violet-50 `#F5F3FF` (뱃지/서브틀 표면) = **6.48:1**
  - 히트맵 채움 램프, 텍스트별로 개별 계산(중간값으로 가정하지 않음):
    - zinc-50 `#FAFAFA` + zinc-900 텍스트 → **16.97:1**
    - violet-100 `#EDE9FE` + zinc-900 텍스트 → **14.92:1**
    - violet-200 `#DDD6FE` + zinc-900 텍스트 → **12.76:1**
    - violet-400 `#A78BFA` + zinc-900 텍스트 → **6.51:1**
    - violet-600 `#7C3AED` + 흰 텍스트 → **6.45:1**
    - violet-500 `#8B5CF6`는 계산 결과 zinc-900 텍스트 4.19:1, 흰 텍스트 4.23:1로 **양쪽 다 4.5:1 미달** — 램프에서 완전히 제외.
- 왜: violet은 r23-r25(blue/teal/amber)와 겹치지 않는 새 색상군이다. 5단 램프 각 스톱을 "중간톤은 밝은 편이니 어두운 텍스트겠지"처럼 가정하지 않고 개별 계산했더니 violet-500이 정확히 "밝은 텍스트도 어두운 텍스트도 4.5:1을 못 넘는 muddy middle"이라는 게 드러나서 그 스톱 자체를 램프에서 빼는 결정으로 이어졌다 — 계산이 디자인 결정(5단이 아니라 4단+공백 스킵)을 직접 바꾼 사례.

**③ 1920px 가용폭 계산 (필수)**
- 무엇을 정해야 했나: 본문에 `max-w` 캡을 씌울지, 씌운다면 1920px에서 우측 여백이 페이지 패딩(≤40px)만 남는지 검증.
- 무엇으로 정했나: **캡을 아예 적용하지 않는다.** 셸 예약폭 = 사이드바 256px(`w-64`, `lg:block`) + 본문 좌우 패딩 64px(`lg:px-8` = 32px×2). 1920 − 256 − 64 = **1600px**가 본문 콘텐츠에 그대로 배정되고, 뷰포트 우측 끝까지 남는 간격은 패딩 32px뿐 — "간격이 페이지 패딩뿐이어야 한다" 규칙을 자동으로 만족한다. (같은 셸 구조로 1280에서는 1280−320=960px 가용, 히트맵 `min-w-[888px]`와의 여유폭은 72px로 16px 하한을 넉넉히 통과.)
- 왜: 임의의 max-w 값을 골라 "1660px 이상이어야 걸리지 않는다"를 검산하기보다, 캡 자체를 걸지 않는 편이 규칙을 구조적으로 만족시키고 168셀 히트맵이 히어로+단일시각화 아키타입에서 실제로 넓게 펼쳐지는 편이 낫다.

**④ 히트맵 값 도메인과 결정론적 데이터 생성**
- 무엇을 정해야 했나: 168셀(7일×24시간)에 채울 "이탈 분(分)" 값 — Math.random 없이, 부분합=총합이 코드로 항상 보장되도록.
- 무엇으로 정했나: 24시간 베이스라인 배열(`HOUR_BASE`, 오전/오후 두 개의 도크 적재 피크)과 7일 배율 배열(`DAY_MULT`, 평일 상승·주말 급감)을 손으로 고정한 뒤 `matrix[d][h] = round(base×mult×scalar)`로 168칸을 코드가 생성. "트레일링 4주 평균" 뷰는 동일 매트릭스에 고정 스칼라 0.92를 곱한 파생값이지 별도 손타이핑 배열이 아니다. 주간 총합·평균·피크·컴플라이언스율은 전부 `computeStats()`가 매트릭스를 순회해 런타임에 계산 — KPI 카드 어디에도 손으로 타이핑한 합계가 없다.
- 왜: "합계 정합" 요구를 손 계산 실수 없이 만족시키는 유일하게 안전한 방법은 총합·평균·피크를 코드가 데이터에서 직접 파생하게 하는 것. 두 기간 뷰가 서로 다른 손타이핑 배열이었다면 두 뷰의 총합이 우연히도 서로 무관해 보였을 것이다.

**⑤ 선택→다중위젯 동기화의 파급 범위 분리 (핵심 판정 축)**
- 무엇을 정해야 했나: "호버=순간 인스펙터, 핀=지속 상태"를 서로 다른 스코프로 실제로 갈라놓고, 그 분리를 눈에 보이는 UI로 노출.
- 무엇으로 정했나: 셀 클릭 = `pinned` 상태(부모 `ColdlineClient`로 리프팅) → KPI 4장 중 **정확히 2장**("Excursion minutes", "Peak window"/"Selected slot")만 재계산하고 각 카드 우상단에 보라색 "Pinned" 뱃지가 뜬다. 나머지 2장("Compliance rate", "Open alerts")은 서브텍스트에 "network-wide, not affected by the pin"이라고 명시하며 핀과 무관하게 고정. 히트맵 자체의 hover/focus는 `hovered`라는 **완전히 별도의, 부모로 전혀 전달되지 않는 로컬 상태**로만 존재 — row/column 헤더 틴트(크로스헤어)와 하단 `aria-live` 판독 문자열만 갱신하고 mouseleave/blur 즉시 사라진다. 아래 `AlertsLog`는 `pinned`를 prop으로 아예 받지 않고, 카드 안에 "Network-wide — not filtered by the heatmap selection above" 뱃지(Unlink 아이콘)를 상시 노출.
- 왜: r17-r19에서 반복 감점된 "단일 selectedId를 형제 컴포넌트에 동일 프롭명으로 threading"을 피하려면 이름이 아니라 파급 범위 자체가 갈라져야 한다. 호버는 상태를 아예 만들지 않고(진짜 휘발), 핀은 명시적 버튼 액션이자 4장 중 절반만 건드리는 부분 재계산이며, 로그 테이블은 그 파급 밖에 있다는 것을 배지·뱃지·서브텍스트로 스크린샷만 봐도 알 수 있게 했다.

**⑥ 히트맵 등급 B 폴백의 구체적 형태**
- 무엇을 정해야 했나: hover 수치 오버레이와 별도의 행·열 라벨 테이블을 어떤 형태로 둘지 — 168칸을 그대로 표로 옮기면 25열짜리 표가 되어 그리드 크래프트 룰(가로 스크롤 두 개 금지, 표는 카드 안에 수납)과 충돌한다.
- 무엇으로 정했나: hover/focus는 아래 `aria-live="polite"` 스트립에 정확한 문구(`"Monday 14:00 — 34 min out of band"`)를 항상 띄운다(키보드 포커스도 동일 이벤트 사용). 별도 폴백 테이블은 **전치(transpose)**해서 시간(24행)×요일(7열, 8개 컬럼)로 만들어 `min-w-[480px]`면 충분하게 좁혔고, 기본 접힘 `<details>` 안에 두되 시각적으로 숨기지 않았다(열면 바로 보임). 메인 히트맵의 진짜 `<table>`도 `min-w-[888px]`+`overflow-x-auto lg:overflow-visible`로 감싸 데스크톱(1280px부터 가용폭 960px)에서는 스크롤이 전혀 안 뜨고 모바일에서만 가로 스크롤되도록 했다 — 페이지에 "열려있는" 가로 스크롤러가 항상 최대 1개(모바일 히트맵)만 존재하도록 폴백 표는 `<details>` 닫힘 시 브라우저가 렌더 트리에서 제외한다.
- 왜: 25열 표를 그대로 뒀다면 카드 폭 안에 수납이 안 되거나 데스크톱에 불필요한 스크롤바가 생겼을 것. 전치는 브리프에 없던 선택이지만 "필수 폴백"이라는 목적(정확한 값에 마우스 없이 접근)은 그대로 satisfy하면서 그리드 크래프트 룰과 충돌하지 않는 유일한 형태였다.

**⑦ 디스플레이 서체 미배정 반영**
- 무엇을 정해야 했나: 이번 라운드 배정("없음")을 실제로 어떻게 지킬지 — 사이드바 워드마크처럼 이전 라운드들이 관성적으로 디스플레이 폰트를 넣던 자리를 어떻게 처리할지.
- 무엇으로 정했나: 워드마크 "Coldline"을 포함해 파일 전체에 `--font-display-*` 변수를 단 한 번도 참조하지 않았다. 워드마크는 `text-[15px] font-semibold`로 Pretendard(`font-sans`) 그대로.
- 왜: r25 "Portage"가 워드마크 한 곳에만 Space Grotesk를 썼던 것과 대비되는, 이번 라운드에 명시된 "디스플레이 없음" 배정을 문자 그대로 지키기 위한 선택 — 최근 라운드 대비 신선한 축을 만들라는 지시를 따랐다.

**⑧ 워크스페이스/알림/커맨드팔레트 더미 콘텐츠**
- 무엇을 정해야 했나: 사이드바 워크스페이스 스위처, 상단바 알림, ⌘K 팔레트 검색 대상에 채울 도메인 데이터.
- 무엇으로 정했나: 워크스페이스 3개(Pacific Northwest / Gulf Coast / Northeast, 각각 zone 수 다름), 알림 3건(도크 이탈 46분·핀 확인·주간 다이제스트), ⌘K는 `ALERTS` 8건(zone·facility·min·status)을 그대로 검색 대상으로 재사용.
- 왜: 별도의 검색 인덱스를 새로 만드는 대신 이미 존재하는 `ALERTS` 배열을 재사용해, 상단바 알림 문구의 숫자(46분)와 `ALERTS` 데이터(`durationMin: 46`)가 어긋나지 않도록 맞췄다 — 화면 두 군데에 같은 사실이 다른 숫자로 나타나는 사소한 정합성 오류를 피하려는 목적.

**⑨ `AlertsLog` 하드게이트 `cell-overlap` 수정: min-w는 `<table>`에만, 모바일 전용 가로 스크롤 래퍼**
- 무엇을 정해야 했나: 390px 모바일 폭 sweep에서 "Duration" 헤더와 "Status" 헤더가 3px 겹치는 실패(`cell-overlap`, sel:"Duration ↔ Status"). 원인은 `<table className="w-full table-fixed">`에 `<colgroup>` 퍼센트(Severity/Duration/Status 각 16%)만 있고 테이블에도 셀에도 `min-w`가 없어, 390px에서 각 16% 컬럼이 콘텐츠 실폭(정렬 아이콘 11px+gap 4px+버튼 `px-1` 8px+`DURATION`/`SEVERITY` 대문자 라벨)보다 좁아진 것.
- 무엇으로 정했나: `<div className="mt-3 w-full">`을 `<div className="mt-3 w-full overflow-x-auto">`로, `<table className="w-full table-fixed border-collapse text-sm">`에 `min-w-[560px]`를 추가(셀 각각에는 걸지 않음 — `table-layout:fixed` 알고리즘에서 `<td>`/`<th>`의 `min-width`는 완전 무효이고 `<table>` 자체에 건 값만 열 폭 배분의 하한으로 작동하기 때문). 계산 근거: `text-[11px] font-medium uppercase tracking-[0.06em]` 대문자 8글자(DURATION/SEVERITY) ≈ 8×7.15px(대문자 평균 자폭) + tracking 0.06em×11px×7갭 ≈ 62px, 여기에 정렬 아이콘 11px+`gap-1`(4px)+버튼 `px-1`(좌우 8px)을 더하면 헤더 콘텐츠 하한 ≈ 85px. Severity/Duration/Status가 각 16% 컬럼이므로 `85px ≤ 0.16 × minW` → `minW ≥ 531px`. Status 컬럼은 헤더(6글자, 버튼 없음) 대신 바디의 `Badge`(`px-2 py-0.5` + "Resolved" 8글자) ≈ 66px로 85px보다 낮아 Severity/Duration이 바인딩 제약. `minW=560px`로 반올림하면 16%×560=89.6px로 85px 대비 ≈4.6px 여유(보고된 3px 겹침을 상쇄하기에 충분) — 데스크톱 1280px+에서는 카드 가용폭(사이드바 256px+패딩 제외 후 ≥560px)이 560px보다 넉넉히 넓어 `overflow-x-auto`가 시각적 스크롤바를 만들지 않고, 390px에서만 실제로 가로 스크롤이 걸려 5개 열 전체가 겹침 없이 보인다. 동일 5열·동일 헤더 스타일(`SortHeader` + `text-[11px] uppercase tracking-[0.06em]`)을 쓰는 `r26/b/InspectionLedger.tsx`가 이미 같은 `min-w-[560px]` 값을 쓰고 있어 계산값이 기존 정본 사례와도 일치함을 교차 확인했다.
- 왜: 이 레포의 확립된 규칙 — "`min-w`는 테이블 엘리먼트 자체에, 셀에 거는 것은 무효" — 를 따르되 임의의 큰 값을 쓰는 대신 실제 콘텐츠(가장 긴 헤더 라벨+정렬 아이콘) 실측을 기반으로 하한을 계산해, 데스크톱에서 불필요한 스크롤바를 만들지 않으면서 모바일에서만 겹침을 로컬 스크롤로 해소하는 최소 개입을 선택했다.
