# Candidate b — Meshline (Service Dependency Intelligence)

**Meshline** — 플랫폼 신뢰성(Platform Reliability) 팀을 위한 서비스 디펜던시 인텔리전스 대시보드. 가상 고객사 "Bramwell Commerce"의 마이크로서비스 16개(진입점 2·도메인 서비스 10·데이터/인프라 4)를 대상으로 한다. 라우트: `/dash-evolve/r9/b` (`app/src/app/dash-evolve/r9/b/page.tsx` default export, `Workspace.tsx` / `NetworkGraph.tsx` / `DetailPanel.tsx` / `ServiceTable.tsx` / `Sidebar.tsx` / `Topbar.tsx` / `CommandPalette.tsx` / `ui.tsx` / `data.ts` / `tokens.ts`로 분리).

**아키타입 — 자유 배치 force-directed 웹(서비스 메시) 그래프**: 화면을 지배하는 시각화는 16개 서비스 노드를 유기적으로 흩뿌린 웹 형태 그래프다. 좌표는 손으로 앉힌 기준 위치(`baseX`/`baseY`)에 id 해시 기반 결정론 지터(±3px, `Math.random` 미사용, 모듈 로드 시 1회 계산)를 더해 산출하며 전부 소수 2자리로 반올림한다(`data.ts`의 `RAW_SERVICES`/`jitter`/`NODES`). 단계별 컬럼도, 동심원도, 엄격한 부모-자식 트리도 아니며, 순환(결제→사기탐지→**주문으로 되돌아오는** 콜백, 알림↔이벤트 버스 양방향 소비)과 다대다 교차 호출(추천 서비스가 카탈로그를 직접 호출하는 등)을 포함하는 실제 마이크로서비스 다이어그램에 가까운 위상이다. 엣지는 실선(동기 HTTP)과 점선(비동기 이벤트 버스 경유)으로 채널을 구분한다. 노드 **크기**는 요청량(req/분, 로그 스케일)을 인코딩하고, 노드 **색**은 세그먼트 컨트롤로 전환 가능한 두 실측 지표(안정성=오류율 3구간, 응답 지연=P99 3구간) 중 하나를 인코딩한다 — 크기·색 모두 실제 지표이며 동일 캔버스 위에서 항상 동시에 읽힌다.

**인터랙션 (5종, 요구 4종 이상, 전부 `'use client'` 실동작·결정론·`motion-reduce` 게이팅)**:
1. **크로스헤어 스타일 호버/포커스 툴팁** — 노드에 마우스를 올리거나 키보드로 포커스하면 해당 노드를 지나는 점선 십자선(수직+수평)이 캔버스 전체에 그려지고, 이름·계층·오너·요청량·오류율·P99·상·하류 개수를 담은 툴팁이 뜬다(`NetworkGraph.tsx`의 `NodeTooltip`). 호버와 `onFocus`/`onBlur` 모두에서 동일하게 동작해 키보드 접근을 보장한다.
2. **선택 → 그래프·상세 패널·테이블 동기화** — 노드를 클릭(또는 Enter/Space)하면 연결된 상·하류 엣지가 강조되고 나머지는 옅어지며, 우측 상세 패널(`DetailPanel.tsx`)과 하단 테이블의 해당 행이 함께 하이라이트된다. 상세 패널의 상류/하류 목록, 테이블 행, ⌘K 결과 어디서든 같은 선택 상태로 진입할 수 있다.
3. **실제 테이블 정렬/필터** — `ServiceTable.tsx`: 서비스명·요청량·오류율·P99 4개 열이 `aria-sort`로 정렬되고, 신뢰도 상태(전체/Healthy/Degraded/Critical) 세그먼트 필터가 즉시 행을 재계산한다.
4. **지표 토글(색 인코딩 전환)** — "안정성"/"응답 지연" 세그먼트 컨트롤로 그래프 전체 노드의 색 인코딩이 즉시 전환된다(org tree의 가동률/헤드카운트 토글과 같은 원리를 그래프 색에 적용).
5. **⌘K 커맨드 팔레트** — 서비스명·오너 팀으로 검색, 화살표+Enter로 선택하면 그래프·상세·테이블이 동기화된다.

추가로 그래프 노드는 화살표 키(Right/Down = 다음, Left/Up = 이전, Home/End = 처음/끝)로 순회 가능한 roving tabindex를 구현해 마우스 없이도 전 노드 탐색이 가능하다.

**exclusion list 대비 구조적 차별점 (22종, 특히 #15 DAG·#22 org tree)**: (15) DAG 파이프라인은 단계별 컬럼에 좌→우 방향 진행을 강제하지만, Meshline의 좌표는 단계 개념이 전혀 없는 자유 배치이며 순환(사기탐지→주문)까지 포함해 "단계"라는 말 자체가 성립하지 않는다. (22) 조직도는 부모 1명에 자식 여럿인 엄격한 트리라 임의의 두 노드 사이 경로가 유일하지만, Meshline은 결제 서비스가 사기탐지·청구 두 "부모"에서 동시에 호출받고, 알림 서비스와 이벤트 버스는 서로를 호출하는 2-사이클을 이룬다 — 트리 불변식(사이클 없음, 부모 유일) 자체가 깨진 다대다 웹이다. 그 외에도 지속형 좌+우 2분할 마스터-디테일(#9, 우리 상세 패널은 선택 시에만 열리는 슬라이드오버), 8/4 차트+사이드바 KPI 4카드(전형적 구조, 우리 KPI는 인라인 스탯 4개+동일 카드 안의 서비스 메시가 화면을 지배), 칸반/캘린더/피드/스프레드시트/리더보드/코호트 히트맵/트리맵/스텝 퍼널/궤도 산점도/AI 챗독/트레이딩 3-페인/인박스/A-B 대칭/모니터링 타일월/지도 어디에도 해당하지 않는다.

**폰트/타이포**: 전역 `font-sans`(Pretendard) 단일, `next/font` 추가 import 없음, 숫자·ID(`요청량`, `오류율`, `P99`, 서비스 ID)는 `tabular-nums` + `Intl.NumberFormat`. `dash-static-check.mjs` → `[]`(no-next-font/no-font-serif/no-random/no-emoji/no-raw-img/no-next-image-unopt/img-needs-alt 전 규칙 통과).

**테마·대비**: 라이트 = white/zinc-50 캔버스 + zinc-200 헤어라인 + shadow-sm, 다크 = zinc-950/900 + white/10 보더. 강조 1색 = indigo(다른 라운드의 teal/violet과 구분). 보조 텍스트는 라이트 zinc-500 이상 / 다크 zinc-400 이상을 기본·필터·선택·비활성 등 모든 상태에서 유지(3회 재발한 delta L3 규칙 준수, 그래프 dimmed 상태도 opacity만 낮추고 색 토큰 자체는 변경하지 않아 안전).

**그리드 크래프트**: 그래프 캔버스는 설계 좌표(880×560) 대비 SVG `viewBox` + 퍼센트 좌표로 스케일되어(DagCanvas/OrgTreeCanvas 선례와 동일 기법) 1280px 이상 데스크톱에서는 카드 폭 안에 항상 수납되며, 매우 좁은 모바일 뷰포트(<640px)에서만 `min-w-[640px]`+`overflow-x-auto` 안전망이 로컬 가로 스크롤을 허용한다(그리드 룰 v2 "로컬 가로 스크롤은 모바일 전용" 준수). 테이블은 `table-fixed`+`colgroup` %열, `min-w-[720px] lg:min-w-0`, `sr-only`는 `<caption>`에만 적용(테이블 요소 자체에는 미적용), 날짜 없음·모든 수치열 `whitespace-nowrap`. 헤더 컨트롤(⌘K 트리거, 아이콘 버튼, "서비스 등록" 주요 액션, 워크스페이스 스위처)은 전부 개별 `h-11`(44px).

**페르소나**: Nadia Ferreira, Head of Platform Reliability, `nadia.ferreira@bramwellcommerce.io` — 세션/환경 메타데이터와 무관한 가상 인물. 아바타는 `next/image`로 실존 Unsplash 사진 ID 사용(`width`/`height` 명시, `unoptimized` 없음, `alt` 필수).

**검증**: `npx tsc --noEmit` 클린 · `npx eslint src/app/dash-evolve/r9/b --max-warnings=0` 클린(초기 `react-hooks/set-state-in-effect` 1건 발견 후 `CommandPalette.tsx`의 검색어 리셋을 effect 대신 `onChange` 핸들러 내 동기 처리로 리팩터해 해소) · `dash-static-check.mjs` → `[]` · `dash-sweep.mjs`(1280~1920px ±16px 슬랙 + 모바일 390px) → `{"pass":true,"failures":[]}`, 데스크톱 페이지/테이블 가로 스크롤 0건 · 라우트 200 확인 · Playwright 스크린샷으로 라이트/다크 렌더, 크로스헤어 툴팁(호버+키보드 포커스 둘 다), 선택 동기화, 신뢰도 필터, 화살표 키 roving 포커스, 640px 미만 로컬 스크롤 동작을 육안 확인.
