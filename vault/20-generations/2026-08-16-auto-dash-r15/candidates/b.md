---
tags: [generation, dash, auto-dash-r15]
---

# auto-dash-r15 / b — Traverse

**Traverse** — a regional logistics network operations console (fictional brand) whose dominant visualization is a generative SVG schematic route-network map: 12 fixed hub nodes across three corridors, connected by lanes, each node printing its on-time percentage and status as always-visible text (not hover-only), with bubble radius encoding daily volume. Theme: fixed product dark (zinc-950/900, `white/10` borders), single accent = cyan (avoiding the catalog's over-represented violet). Display face: `--font-display-mono` on the wordmark and the hero on-time numeral only; body stays Pretendard. Five real `'use client'` interactions: (1) keyboard-accessible crosshair tooltip on the on-time trend chart, (2) real column sort + text/status filter on the routes table, (3) a page-level 7D/14D/30D period toggle that recomputes the map badges, hero stat, table, and chart together, (4) map-node (or table-row, or palette-result) click → selection sync across the detail panel, the trend chart's hub-overlay line, and the map's lane highlighting, (5) a ⌘K command palette that searches hubs and sections. Route: `app/src/app/dash-evolve/r15/b/page.tsx`.

## 브리프에 없던 것

1. ① 대표 시각화를 "추상 지리/경로 지도"로 배정받았을 때 실제로 그릴 도메인과 노드/레인의 구체적 좌표·개수를 정해야 했다.
   ② 가상의 지역 물류 네트워크(가상 지명 12개 허브, 서부/중부/동부 3개 코리도, 1000×460 viewBox 안 고정 좌표, 17개 레인)를 만들었다.
   ③ 브리프가 예시로 든 "스키매틱 라우트 네트워크"를 따르되, 기존 갤러리의 freight-ops 3-페인 콘솔과 구조적으로 겹치지 않도록 지도 자체를 페이지의 유일한 주인공으로 두는 단일-컬럼 히어로 배치를 택했다(3-페인 레일 없음). 실존 지명을 쓰지 않은 것은 "실제 지리 좌표/타일 금지"를 브랜드 카피에서도 지키기 위한 보수적 선택.

2. ① 지도 노드의 상태 임계값(몇 %부터 On track/At risk/Delayed인지)을 정해야 했다.
   ② ≥95% On track, ≥90% At risk, 그 미만 Delayed로 고정했다.
   ③ 임의 선택이나, "합계 정합" 요구를 만족시키려 각 허브의 상태를 저장된 값이 아니라 이 임계값 함수로 매 렌더 계산해 지도·표·상세 패널·팔레트가 항상 같은 결론을 내도록 했다(하드코딩된 상태 필드를 두면 기간 토글 시 어긋날 위험이 있었다).

3. ① 크로스헤어 툴팁 차트에 30일치 일별 데이터를 그대로 30개 포인트로 그릴지, 아니면 버킷화할지 정해야 했다(Tab 정거장이 30개면 키보드 순회가 부담스럽다).
   ② 기간별로 최대 10개 포인트로 평균 버킷화했다(7D=7일 그대로, 14D=2일 평균 7버킷, 30D=3일 평균 10버킷).
   ③ `auto-dash-r14`의 SLA 트렌드 차트가 주 단위로 미리 집계된 데이터를 썼던 선례를 참고해, 동일하게 "포인트 수를 작게 유지해 키보드 접근성을 실용적으로 만든다"는 관례를 따랐다.

4. ① 지도와 테이블에 동시에 존재하는 "기간 토글"을 트렌드 차트 카드 안에도 또 하나 넣을지 정해야 했다(초안에는 넣었었다).
   ② 제거하고 대신 "Synced to 7D above" 같은 읽기 전용 배지로 바꿨다.
   ③ 동일한 페이지 상태를 조작하는 라디오그룹이 화면에 두 벌 보이는 것은 시각적으로 혼란을 줄 뿐 아니라 accessible-name이 같은 두 컨트롤 그룹을 Playwright `getByRole` 테스트로 실제로 재현해보니 모호성이 확인되어(자체 실측), 상용 완성도 관점에서 단일 진실 공급원 쪽으로 되돌렸다 — 브리프의 "선택→다중 위젯 동기화"는 컨트롤이 하나뿐이어도 여러 위젯이 갱신되면 충족된다고 판단했다.

5. ① SVG 지도 노드의 포커스 표시를 어떤 메커니즘으로 보장할지 정해야 했다(`:focus-visible`의 SVG 도형 지원은 엔진마다 다를 수 있다는 우려).
   ② `outline-none` + React 상태(`onFocus`/`onBlur`)로 그려지는 별도의 흰색 링 `<circle>`을 추가/제거하는 방식을 택했다.
   ③ `page-brief-core` §2가 명시한 "상태로 그려지는" 포커스 표시 허용 사례("SVG 세그먼트가 onFocus로 자기 채움을 바꾼다")를 그대로 따른 것 — CSS 의존적 방식보다 결정적이라고 판단했고, Playwright로 실제 Tab을 눌러 링 `<circle>`이 DOM에 나타났다 사라지는 것을 직접 확인했다.

6. ① 아바타 이미지에 쓸 고정 Unsplash 사진 ID를 정해야 했다.
   ② 카탈로그 내 7개 이상의 기존 작품(d29·d30·d33·d35·d40·d45, 랜딩)이 이미 재사용 중인 `1500648767791-00dcc994a43e`를 그대로 썼다.
   ③ "무작위 아님 = 사람이 고른 고정 ID"라는 규칙을 만족하는 가장 안전한 선택이며, 이미 검증된 값을 재사용해 새 ID의 존재/내용을 추측할 필요가 없었다.
