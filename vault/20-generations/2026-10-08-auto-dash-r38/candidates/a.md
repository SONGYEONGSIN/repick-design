# Candidate a — Portcall

A vendor-quality scorecard for platform engineers: a full-width, hand-built SVG box plot of response-latency distributions across 14 third-party API vendors (payments, identity, logistics, messaging, maps, fraud) is the page's only dominant visualization — no sidebar/3-pane shell around it — paired with an independent, sortable/category-tabbed vendor directory table that carries the same five-number summary as real columns, plus a non-persistent hover/focus tooltip.

## 브리프에 없던 것

① 세 번 실패한 바로 그 폼(박스플롯 히어로 + 독립 테이블)을 다시 지어야 해서, 이번엔 3가지 금지 패턴(ancestor min-w-0 누락, `<td>`에 `min-w`, 값+코드 2줄 텍스트에 커스텀 `aria-label`)을 코드 레벨에서 어떻게 "원천적으로 재발 불가능"하게 만들지
② (1) `overflow-x-auto` 스크롤러까지 내려가는 모든 flex/grid 조상(`lg:flex` 루트 → flex 컬럼 → `main` → `grid-cols-12` → 각 그리드 아이템 → Card)에 전부 `min-w-0`을 명시하고 체인을 직접 손으로 추적해 빠짐없이 확인; (2) 테이블은 `table-fixed`+`<colgroup>` 퍼센트(22+14+10+8+8+9+8+8+7+6=100, 직접 더해서 검증)만 쓰고 `<td>`/`<th>`에는 `min-w`를 아예 한 글자도 넣지 않음; (3) 박스플롯 버튼은 `aria-label`을 전혀 선언하지 않고 보이는 텍스트(값→아웃라이어 칩→코드) 뒤에 `relative` 래퍼로 감싼 `sr-only` 트레일링 스팬만 붙여 접근 가능한 이름이 콘텐츠에서 자연히 도출되게 함
③ 세 지점 모두 "전에 고친 적 있는데 또 터진" 지점이라, 이번엔 각 수정이 왜 통하는지(박스 모델의 padding-edge 클리핑, `table-fixed`에서 `td`의 `min-w`가 레이아웃에 전혀 개입하지 않는 이유, accname이 content-first로 계산되는 원리)를 주석으로 남겨 다음 시도에서도 재추론 가능하게 함

① `sr-only`가 가로 스크롤 컨테이너 안에서 깨지는 정확한 메커니즘과, 그래서 무엇을 감싸야 하는지
② Tailwind의 `sr-only`가 자기 자신에게 `position:absolute`를 걸길래, 포지션된 조상이 없으면 스크롤러 밖(보통 뷰포트)을 기준으로 배치돼 `scrollWidth`를 오염시킨다는 걸 직접 추적 — 그래서 `sr-only` span 자체가 아니라 그걸 감싸는 별도의 `relative inline-block` 래퍼를 만들어, 모든 `SrOnly` 호출이 이 래퍼를 통하게 통일
③ `sr-only` 위에 `relative`를 "같이" 주면 유틸리티 둘 다 `position` 속성을 선언해 클래스 순서/명시도 싸움이 되므로, 애초에 겹치지 않는 별도 래퍼 엘리먼트로 분리하는 게 유일하게 확정적인 해법이라고 판단

① 호버 툴팁(다섯숫자 요약)을 가로 스크롤러 안의 각 컬럼 위에 띄우면서, 그 자체가 또 다른 세로/가로 오버플로를 만들지 않게 하는 법
② `overflow-x:auto`는 스펙상 짝인 `overflow-y`를 `visible`에서 `auto`로 강제 전환시키지만, 클리핑 경계는 border-edge이지 content-edge가 아니므로 padding 영역 안에 그려지는 자식은 잘리지 않는다는 점을 이용 — 스크롤러에 `pt-28`(112px)을 미리 깔아 두고 툴팁(이름+중앙값+Q1·Q3+Min·Max+아웃라이어/상태, 약 90px 높이)이 그 패딩 영역 안에서만 위로 솟게 함. 가로 위치는 clamp() 대신 인덱스로 분기(첫 칼럼 `left-0`, 끝 칼럼 `right-0`, 중간은 중앙 정렬)해 어떤 폭에서도 계산이 틀릴 수 없게 함
③ 가로 오버플로 하드게이트(390/1280/1440/1920 전부 0)가 이 라운드의 사망 원인이었으므로, "근사치로 안전해 보임"이 아니라 박스 모델 규칙 자체가 보장하는 배치만 채택

① 테이블의 `table-overflow`가 지난 두 번의 시도에서 원인 불명으로 남았던 것 — 이번엔 어떻게 "진짜" 원인을 봉쇄할지
② `min-w`가 `table-fixed` 아래 `td`/`th`에서 레이아웃에 전혀 개입하지 않는다는 사실(스펙상 고정 테이블은 콘텐츠 크기를 무시하고 `<col>` 퍼센트만 본다)을 받아들이고, `min-w`를 테이블·셀 어디에도 쓰지 않는 대신 (a) 퍼센트 합을 100으로 손으로 검증하고 (b) 모든 셀이 `whitespace-nowrap` 없이 자연 줄바꿈되게 둬서, 설령 콘텐츠가 칼럼보다 넓어도 "겹침"이 아니라 "줄바꿈"으로만 귀결되게 함 — 즉 원인을 못 찾아도 결과가 안전한 쪽으로 설계
③ 테이블을 `lg`(1024px) 이상에서만 보여주고 그 아래는 테이블 엘리먼트 자체 없이 스택형 카드 리스트로 완전히 대체 — "두 번째 `overflow-x-auto`를 테이블에 만들 뻔한" 유혹과, 좁은 폭에서 퍼센트 칼럼이 비현실적으로 좁아지는 문제를 둘 다 구조적으로 제거

① 박스플롯 버튼의 접근 가능한 이름을 `aria-label` 없이 어떻게 구성할지, 그리고 그게 스크린리더에서 실제로 뭐라고 읽힐지
② 보이는 텍스트 순서(중앙값 숫자 → 아웃라이어 칩("+N", 있을 때만) → 벤더 코드)에 `relative` 래핑된 `sr-only` 트레일링 스팬(전체 벤더명·카테고리·min/Q1/Q3/max·아웃라이어 수·상태·핀 상태 안내)을 이어붙여, "68 +2 LWR milliseconds median. Ledgerwire, Payments vendor. Min 40, …" 형태의 완전한 문장이 되도록 각 조각의 어순을 손으로 맞춤
③ `label-content-name-mismatch`는 `aria-label`이 있을 때만 성립하는 규칙이므로, 애초에 `aria-label`을 선언하지 않는 것 자체가 가장 확실한 회피이면서도 "내용 기반 이름"이라는 브리프의 원칙을 가장 직접적으로 구현하는 방법이라 판단

① 박스플롯과 테이블 사이에서 "선택"을 공유하지 않게 하려면 정확히 어떤 state를 어디에 둘지
② `pinnedId`(클릭, 영속) 는 `PortcallDashboard`가 들고 `PinnedVendorCard` 단 하나에만 prop으로 내려주고, `hoveredId`(호버/포커스, 비영속) 는 `BoxPlotPanel` 내부 로컬 state로만 두어 부모·테이블·KPI 스트립 어디에도 전달하지 않음. 테이블의 정렬/필터 state는 `VendorTable` 내부에만 존재해 반대 방향으로도 격리
③ 과거 라운드들에서 반복적으로 이긴 패턴이 "하나의 selectedId를 여러 위젯에 동일하게 꽂기"가 아니라 "클릭=한 곳만 영속 핀, 호버=완전 비영속"으로 스코프를 쪼개는 것이었다는 브리프의 명시적 지침을 글자 그대로 따름

① 벤더 14개의 지연시간 다섯숫자 요약과 기간별(24h/7d/30d) 변화를 전부 손으로 타이핑하면 숫자가 서로 어긋날 위험이 큰데, 어떻게 결정론을 유지하면서도 기간 전환이 실제로 다른 그림을 그리게 할지
② 24h 값만 리터럴로 작성하고, 7d/30d는 고정 배율표(`PERIOD_FACTORS`: min/q1/q3/max/outliers/requests 배율 + median·errorRate 배율)를 곱해 `Math.round`로 파생 — 14개 벤더 × 3기간 전체를 손으로 역산해 min≤q1≤median≤q3≤max 단조성이 깨지는 경우가 있는지 직접 검증(가장 타이트한 Pingmast, 가장 넓은 Haloform/Switchyard 포함)
③ 세 기간이 "절대 서로 어긋날 수 없게" 하려면 숫자를 따로 타이핑하는 대신 하나의 소스(24h)에서 파생시키는 게 유일한 방법이라 판단 — 동시에 기간이 길어질수록 중앙값·에러율이 완만히 올라가게 해(Trustwell이 24h/7d엔 watch, 30d에만 breach로 넘어가는 식) 토글이 KPI·상태 배지를 실제로 바꾸는 걸 보장

① 실제 상용 서비스명을 벤더로 쓸지, 가상 브랜드를 만들지
② Stripe·HubSpot 같은 실명 대신 Ledgerwire·Haloform ID·Portline Freight 같은 가상 벤더 14개를 6개 카테고리(Payments/Identity/Logistics/Messaging/Maps/Fraud)로 직접 설계
③ 이 카탈로그의 다른 작업들이 실명을 섞어 쓰는 선례가 있긴 하지만, 이 페이지의 핵심은 "벤더 디렉터리"라는 데이터 테이블 자체이고 실명을 쓸 실익이 없어 상표/오인 리스크가 전혀 없는 가상명으로 전부 통일하는 쪽이 더 안전하다고 판단
