# Candidate a — Nodal

**Nodal** is a service-mesh observability console for a fictional retailer ("Meridian Retail") whose dominant visualization is a deterministic, layered service-dependency graph (15 nodes / 26 edges across Edge → Core → Support → Data tiers) with a live incident narrative (Redis Cache under memory pressure, cascading into 5 critical dependency edges) — paired with a mandatory, fully-featured adjacency-table fallback so a screen-reader user never needs the graph.

## 브리프에 없던 것

1. **결정** — 어떤 구체적 그래프 레이아웃 알고리즘을 쓸지(force-directed vs radial vs layered).
   **결정 내용** — 4단 레이어드(Sugiyama식) 그리드: 각 노드는 정수 좌표(예: `x:435, y:310`)를 `data.ts`에 고정값으로 직접 갖고, x는 티어 내 개수로 균등분할한 정수 산술, y는 티어 인덱스×고정 간격. 삼각함수를 전혀 쓰지 않는다.
   **이유** — 브리프가 "고정 force-layout 또는 구조적 radial/layered"를 명시적으로 허용했고, 레이어드 그리드가 실제 서비스 메시 관측 도구(Datadog Service Map류)의 관행이며 순수 정수 산술이라 반올림·하이드레이션 불일치 위험이 force-directed 반복계산보다 훨씬 낮다.

2. **결정** — 그래프의 엣지(선/배지)와 노드를 SVG 하나로 통짜로 그릴지, 아니면 분리할지.
   **결정 내용** — 엣지는 `aria-hidden` SVG `<line>`/`<text>`(장식), 노드는 SVG 위에 겹친 실제 HTML `<button>`(퍼센트 좌표로 절대배치, `translate(-50%,-50%)`).
   **이유** — 브리프가 "Network Graph는 A11y D등급 — 반드시 접근 가능한 인접 리스트 테이블 폴백"을 요구했지만, 그래프 자체도 키보드로 조작 가능하게 만드는 편이 완성도가 높다(레퍼런스 없음, `charts.catalog` D등급 경고 + `page-brief-core` 포커스 가시성 요구를 동시에 만족시키려는 임의 설계 판단) — SVG만으로는 실제 포커스 가능한 `<button>` 시맨틱을 만들기 번거롭고, `foreignObject`보다 절대배치 HTML이 더 견고하다.

3. **결정** — 그래프 캔버스가 좁은 모바일(390px)에서 15개 노드를 어떻게 수납할지.
   **결정 내용** — 테이블의 기존 `min-w-[Npx] lg:min-w-0 lg:table-fixed` 관용구를 그래프에도 동형 적용: 그래프를 감싸는 `overflow-x-auto` 래퍼 안에 `min-w-[820px] lg:min-w-0`인 relative 컨테이너를 두어, 데스크톱은 유동 폭(퍼센트 좌표로 완전 반응형)·모바일은 로컬 가로 스크롤로 최소 가독폭을 보장.
   **이유** — `dash-deltas-provisional.jsonl`의 auto-dash-r1/r2 델타(테이블 min-w는 모바일 전용으로 게이트)를 그래프라는 새 도메인에 유추 적용 — 브리프에 그래프의 모바일 수납 규칙은 없었다. aspect-ratio만으로 완전 반응형을 시도했을 때 390px에서 15개 노드칩이 서로 겹치는 실결함을 실제로 확인했고(자체 스크린샷 검수), 그래서 규칙을 끌어왔다.

4. **결정** — 엣지 배지(지연시간 라벨)가 다른 노드와 겹칠 때 어떻게 피할지.
   **결정 내용** — `data.ts`에서 모듈 로드 시 `computeBadgePos()`로 각 비정상(degraded/critical) 엣지의 배지 위치를 사전 계산: 기본은 직선 중점, 다른 노드와 55 단위 이내로 겹치면 수직 방향으로 26/38/50 단위씩 좌우 두 방향을 시도해 첫 번째로 안 겹치는 위치를 채택.
   **이유** — 4단 균등 간격 레이아웃에서 "코어→데이터" 엣지의 중점이 정확히 "서포트" 티어의 y좌표와 일치하는 구조적 부작용(카탈로그 서비스→Redis 엣지 배지가 Inventory 노드와 겹침)을 스크린샷 검수로 발견 — 브리프에 이런 충돌회피 규칙이 없어 순수 기하 알고리즘으로 임의 설계했다. 결정론 유지(무작위 없음, 순서 고정 탐색).

5. **결정** — 그래프 노드 버튼의 접근 가능한 이름(accessible name)을 `aria-label`로 오버라이드할지, 콘텐츠 기반으로 둘지.
   **결정 내용** — `aria-label`을 쓰지 않고, 보이는 텍스트(짧은 라벨+지연시간)와 `sr-only` span(티어/전체 이름/헬스 단어)을 같은 버튼 안에 나란히 두어 접근 이름이 콘텐츠에서 자연 도출되게 함.
   **이유** — 처음에는 `aria-label="{short} {p99}, {full} — {tier} — {health}"` 형태로 시도했으나, Lighthouse `label-content-name-mismatch`(승격된 하드페일 감사)가 실패했다 — axe의 `visible_virtual` 추출기가 flex-col로 줄바꿈된 두 개의 별도 텍스트 사이에 실제 개행문자를 끼워 넣는데, ARIA 접근 이름 계산은 공백을 다르게 정규화해 둘이 항상 어긋났다(공백으로도, 리터럴 `\n`으로도 둘 다 실패 확인). axe 규칙의 `matches()` 게이트가 "`aria-label`/`aria-labelledby`가 없으면 이 검사 자체를 건너뛴다"는 걸 소스에서 확인하고, 아예 그 경로를 피하는 쪽으로 재설계했다 — `page-brief-core`의 기존 딜타(`sr-only sm:not-sr-only`, not aria-label)와 같은 방향의 원칙을 그래프 노드라는 새 컨텍스트에 적용한 것.

6. **결정** — 브랜드/제품/가짜 페르소나 이름, 도메인(어떤 마이크로서비스 15개를 쓸지).
   **결정 내용** — 제품 "Nodal", 가상 회사 "Meridian Retail"(전자상거래), 15개 서비스(API Gateway/CDN/Auth/Catalog/Cart/Checkout/Search/Payments/Inventory/Notification/Recommendation/Postgres/Redis/Queue/S3), 가상 인물 "Priya Kessler"(Platform Reliability Engineer, `priya.kessler@nodal.io`).
   **이유** — 브리프가 "제품·브랜드 자유 발명"이라 명시. 전자상거래 마이크로서비스는 실제 서비스 메시 관측 도구의 가장 흔한 데모 도메인이라 리얼리즘이 있고, Redis 캐시 장애가 5개 서비스로 전파되는 시나리오는 "단일 지배 시각화 완성도"(핵심 상태를 상시 텍스트로 병기)를 자연스럽게 뒷받침하는 서사를 준다. 인물명은 `auto-dash-r3` 딜타(세션 실제 이메일을 베끼는 함정) 회피를 위해 완전 가상으로 지었다.

7. **결정** — 액센트 컬러와 테마.
   **결정 내용** — 다크 테마(zinc-950/900, border white/10) + 단일 액센트 sky(파랑).
   **이유** — 라운드 지시의 "avoid" 목록에 violet-hex 과다 사용·직전 라운드(r14 승자)의 light+amber+no-display-font 조합 회피가 있었다. 다크는 실제 관측성/인프라 도구(Grafana, Datadog 다크 모드)의 흔한 관행이기도 하고, sky는 헬스 시맨틱 팔레트(emerald/amber/rose)와 색상적으로 뚜렷이 구분돼 "단일 액센트 vs 상태색" 혼동을 피한다.
