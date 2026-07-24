# auto-dash-r5 — JUDGE 판정 전문

- 생존 후보: a(Ballast), b(Quay), c(Bisect) — 3개 전원 하드게이트 통과 → 3렌즈 병렬 블라인드 심사.
- 집계: 1위 표 — a: 2표(brief, visual) / c: 1표(archetype). **다수결로 a 승자 확정.** 동률 규칙 적용 불필요, 기권 렌즈 없음.

## 승자: a — Ballast (FX·현금 리스크 데스크, 3-페인 트레이딩 터미널)

---

## 렌즈 1 — brief (규칙 준수 대조)

**랭킹: 1위 a · 2위 c · 3위 b** (no-winner 아님)

세 후보 모두 하드룰(폰트/토큰/랜덤/게이팅/접근성) 위반 없음. 순위는 "데이터 대시보드로서의 브리프 완성도" 밀도 차이.

### 공통 검증 (전원 통과)
- 폰트: 세 후보 모두 `next/font` 추가 import 0건, 세리프/디스플레이 0건. 전역 font-sans 단일. ₩는 tabular-nums 처리(a/lib/tokens.ts:23 주석까지 명시).
- 결정론: `Math.random`/`Date.now`/`new Date()` 실사용 0건 (주석에만 등장).
- SVG 좌표: 전원 round2(소수 2자리) 경유 — a/lib/math.ts:5, c CrosshairChart.tsx:33-34.
- 헤더 44px: ⌘K·아이콘버튼·주요액션 개별 컨트롤 모두 h-11 (a Topbar.tsx:53/63/87/107/140, b AppTopbar.tsx:59/72/85/101/135, c Topbar.tsx:55/70/82/98/132). 컨테이너-only 위반 없음.
- 차트 키보드: 세 후보 모두 ArrowLeft/Right + tabIndex + aria-live (b Sparkline.tsx:52 포함).
- 세션 메타 유출: 없음. a=한서준(운영자와 무관), b=fake 도메인(maildrift/postveil 등), c=Devon Okafor — 전원 가상 인물.
- 테이블 시맨틱: 전원 caption(sr-only)/scope/aria-sort.

### 후보별 사유
**1위 a (Ballast FX 데스크)** — 가장 브리프-완성도 높은 데이터 대시보드. KPI를 하드코딩이 아니라 실제 집계: KpiStrip.tsx:44 `open.reduce(...notionalUsd)`, 오픈 포지션 10건이 data.ts의 status="오픈" 10개와 정합(부분합=총합). 테이블 2개(PositionsTable + DetailPanel 체결) 모두 게이팅 정석 — PositionsTable.tsx:57 `min-w-[860px] lg:min-w-0 lg:table-fixed` + colgroup(59-68) + caption. 멀티페인 선택 동기화(워치리스트→차트/상세/체결), 기간 토글, ⌘K, 중앙 tokens.ts로 라이트/다크 일관. 위반 미발견.

**2위 c (Bisect A/B)** — 규율이 매우 엄격하고 데이터 정합이 검증됨: 세그먼트 합=변형 총계(Desktop11800+Mobile7520+Tablet2160=21480, conv 2336+1241+324=3901, 스크린샷과 일치). CrosshairChart는 role="img"+aria-live(151)+키보드까지 모범. SegmentTable.tsx:59 게이팅 정석, SignificanceBar 프로그레스, 기간/세그먼트 토글, ⌘K, 다크모드, `max-w-[1920px]`(브리프 허용 "초광폭 완만 cap"). a보다 낮은 이유는 단일 미러 분석뷰라 컴포넌트/데이터 밀도가 a(2테이블+워치레일+상세패널)보다 얕음.

**3위 b (Quay 인박스)** — 하드룰은 전부 준수(레일 `w-80 shrink-0` + 메인 `flex-1 min-w-0` QuayClient.tsx:181/186, 키보드 스파크라인, CustomerPanel 정렬 테이블 aria-sort/caption, SegmentedControl+Tabs, ⌘K, fake 이메일). 그러나 아키타입이 "데이터 대시보드"가 아니라 지원 인박스 — KPI/스탯타일 행 자체가 없고 수치 밀도가 브리프의 "SaaS 대시보드(KPI 4열 등)" 상과 가장 멀다. 하드 위반은 아니나 브리프 렌즈 기준 가장 얕은 적합도. 부차 관찰: CustomerPanel.tsx:140 테이블이 `table-fixed w-full`만 쓰고 브리프 권장 `min-w-[Npx] lg:min-w-0 lg:table-fixed` 이디엄을 안 씀(오버플로는 안 나서 안전, 규범 이탈).

### 재사용 가능한 학습 (brief 렌즈 제안 — LEARN 단계에서 1개만 채택)
1. **12-col 그리드 미준수 — 3후보 전원**: `grid-cols-12`/`col-span` 사용 0건. 전부 flex 레일 + KPI만 `grid-cols-2 xl:grid-cols-4`. 브리프 내부 긴장 — "명시적 12-col(8/4)" vs "멀티페인은 레일 고정폭+flex-1". 멀티페인 셸이 12-col 면제인지 명문화 필요.
2. **아키타입 드리프트 게이트 부재**: b가 KPI/집계 모듈 없이도 모든 하드게이트를 통과 — 인박스가 "대시보드"로 통과 가능. 최소 1개 KPI/스탯 행을 하드 요건화하는 안 검토.
3. **긍정 패턴(정착 확인)**: KPI를 하드코딩 아닌 `reduce` 집계로 도출(a) + 세그먼트 합=총계(c) 모두 "부분합=총합" 요건을 실코드로 충족.

---

## 렌즈 2 — visual (상용 서비스급 대조, 스크린샷 중심)

**랭킹: 1위 a · 2위 c · 3위 b** (no-winner 아님)

세 후보 모두 진짜 라이트(순백/zinc 캔버스 + 헤어라인 보더 + 미세 섀도)이며, 세리프·디스플레이 혼용 없이 단일 산세리프로 통일되어 있고, 스큐어모픽 장식 없이 일관된 radius/border/spacing으로 완성도를 낸다. 셋 다 컨셉 아트가 아닌 상용 프로덕트 수준.

**1위 a (Ballast)** — Mercury·Coinbase급 핀테크 밀도를 가장 잘 구현. 1280/1440/1920 전 폭에서 워치리스트 각 행마다 실제 스파크라인(상승 녹색/하락 적색)이 렌더되고, 중앙 area 차트는 축 레이블·그리드까지 실제로 그려지며, 우측 상세지표 패널의 헤지비율 프로그레스 바까지 데이터 시각화가 빈틈없다. 뷰포트를 꽉 채우고 1920에서도 3분할 그리드가 폭에 맞게 수납. KPI→헤딩→캡션 위계 명확. 390에서 사이드바가 드로어로 접히고 카드가 스택으로 정돈. 감점 요소: 좌하단 Next.js dev 인디케이터가 "1 Issue"를 시사(디자인 표면 자체는 정상 렌더).

**2위 c (Bisect)** — LaunchDarkly·Statsig급으로 매우 정제됨. Variant A/B 2열 대칭, KPI 3카드, area 차트와 세그먼트 테이블이 전 폭에서 깔끔. 위계·정렬·radius 일관성 최상급. 순위를 내린 이유: 1280/1440에서 CONVERSION RATE 카드의 우세 배지가 카드 우측 경계에 겹쳐 클리핑(1920에서는 해소). a 대비 화면당 데이터 종류가 적어 밀도감 한 단계 아래.

**3위 b (Quay)** — Intercom·Front급 3-pane 인박스로 타이포·간격·리스트 정렬은 깔끔. 그러나 1280/1440/1920/390 전 스크린샷에서 대화 리스트와 헤더의 아바타가 전부 회색 깨진-이미지 플레이스홀더로 렌더(깨진 렌더링 직격). 데이터 시각화가 1920에서야 우측 고객 패널의 소형 스파크라인 하나뿐이라 시각화 밀도가 가장 얇음. 1280/1440에서는 우측이 빈 채팅 여백으로 남아 화면 활용도도 낮음.

---

## 렌즈 3 — archetype (구조 차별성, 앱 셸 중립)

**랭킹: 1위 c · 2위 b · 3위 a** (no-winner 아님, 다만 격차 큼)

**1위 c (대칭 미러)** — `BisectClient.tsx`에서 `VariantPanel(side=a)` + `DividerWinner` + `VariantPanel(side=b)`로 좌우 동일 구조 미러 패널 2장 + 중앙 승자 디바이더를 확인. "레일+메인" 변주가 전혀 아니고, 기존 15개 이상 골격 어디에도 없는 대칭 미러(bilateral) 문법. 동료 a/b(둘 다 비대칭 다열)와도 근본 축이 다름.

**2위 b (상시 3열)** — `QuayClient.tsx`에서 `lg+`부터 QueueRail(고정)+ConversationList(w-80 고정)+ThreadPane(flex-1)이 동시 상시 노출 확인 — r4/a Ridgeline(2-페인 마스터-디테일)로 퇴화하지 않음. `2xl`에선 CustomerPanel까지 4열. 다만 본질은 여전히 "레일→리스트→상세" 드릴다운 계열이라 Conduit/Ridgeline과 같은 대가족의 변주.

**3위 a (3-페인이나 외곽 프레임 재활용)** — `BallastClient.tsx`에서 WatchlistRail+ChartPanel+DetailPanel 3-페인 동시 병존은 진짜(Meridian은 2-페인이라 구분됨). 그러나 그 삼면 밴드가 KPI 4장 가로줄(KpiStrip) + 풀폭 테이블(PositionsTable)로 감싸여 있어, 브리프가 명시적으로 경계한 "표준 골격(KPI 가로줄+풀폭 테이블)"을 외곽에 그대로 재활용. 크로스헤어 차트+워치리스트 셀렉터 조합은 기존 Conduit/Meridian과 컨셉 인접도가 가장 높음.

---

## 종합 판정

brief·visual 두 렌즈가 a를 압도적 1위로 꼽았고(데이터 시각화 밀도·집계 정합·완성도), archetype 렌즈만 구조 신선도 기준으로 c를 1위로 꼽았다. 다수결 원칙(1위 표 다수결, 동률 시 brief 우선)에 따라 **a(Ballast)가 승자**다. archetype 렌즈가 지적한 "외곽 프레임이 KPI줄+풀폭테이블 표준과 겹친다"는 점은 실제 사실이며, 다음 라운드 아키타입 지정 시 "코어 3-페인은 유지하되 외곽 프레임(KPI줄/풀폭테이블)까지 표준에서 벗어나는 배치"를 유도할 필요가 있다는 시사점으로 남긴다(질문 큐 후보로는 미채택 — 충돌 쌍이 아니라 단일 렌즈의 세부 관찰이므로 6단계 정제 게이트에서 재검토).

no-winner 아님 — 3렌즈 전원이 3후보를 명확히 랭킹했고 기권 렌즈 없음.
