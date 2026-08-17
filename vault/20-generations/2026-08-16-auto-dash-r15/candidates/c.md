---
tags: [generation, dash, auto-dash-r15]
---

# auto-dash-r15 / c — Vela

**Vela** — a fictional growth-experimentation (A/B testing) console whose dominant visualization is a lift-vs-control forecast chart: a solid historical line with a shaded 95% confidence band that narrows as more data accumulates, continuing as a dashed forecast line whose band fans back out the further it projects, crossing a dashed zero baseline that makes "does the interval clear zero" legible at a glance. Theme: fixed product dark (zinc-950/900 canvas, `white/10` borders), single UI accent = cyan-400 (bright accent + near-black on-accent text, avoiding the catalog's over-represented violet), no display face — Pretendard everywhere including the wordmark, per this round's font assignment. Layout: a horizontal experiment-picker strip (6 cards, each with its own mini sparkline + always-visible lift/significance) above a hero row that splits the forecast chart (8/12) against a "Statistical significance" side panel (4/12, CI, sample split, live traffic ticker), then a control-vs-variant comparison row with a compact CI-bracket visual, then a sortable/filterable experiments table — selecting a picker card, a table row, or a command-palette result all drive the same `selectedId` state, so the chart, panel, and compare cards recompute together. Six real `'use client'` interactions: (1) keyboard-accessible crosshair on the hero chart (Arrow keys move a live-announced point, mouse hover works too), (2) an actual/forecast visibility toggle paired with an always-visible solid/dashed line-style legend (never color alone), (3) a "Last 14 days / Full history" period toggle, (4) selection→multi-widget sync (picker card, table row, or palette result all repaint the chart + panel + compare cards), (5) real table column sort (aria-sort) plus a significance/status filter, (6) a ⌘K command palette searching experiments and jumping to sections. Route: `app/src/app/dash-evolve/r15/c/page.tsx`.

## 브리프에 없던 것

1. ① 배정받은 "시계열 예측+신뢰구간" 시각화를 구체적으로 무엇의 예측으로 그릴지 정해야 했다 — 원시 지표 자체의 예측인지, 변량 간 차이(lift)의 예측인지.
   ② "대조군 대비 lift(%)"를 단일 y축으로 잡고, 신뢰구간이 0을 벗어나는지로 유의성을 그림 자체에서 바로 읽히게 설계했다.
   ③ 카탈로그의 Time-Series Forecast 항목이 "신뢰구간과 함께"라고만 하고 무엇의 구간인지는 말하지 않았고, 통계적으로 "구간이 0을 포함하는가"가 곧 유의성 판정 규칙이라 시각(밴드)과 텍스트(배지)가 항상 같은 결론을 내도록 자동 정합되는 쪽을 택했다(하드코딩된 boolean 대신 `ciLow/ciHigh`에서 매번 파생).

2. ① 과거 구간(대역폭이 좁아짐)과 예측 구간(대역폭이 넓어짐)의 정확한 곡선 형태를 정해야 했다.
   ② 과거는 날짜가 지날수록 표본이 쌓여 구간이 선형으로 좁아지고, 예측은 오늘 시점의 폭에서 시작해 미래로 갈수록 다시 선형으로 넓어지는 "보타이" 형태로 만들었다(각 실험의 시작/종료 lift·대역폭 상수만 손으로 정하고, 사이 값은 결정론 사인 파형 보간으로 생성).
   ③ 실제 시퀀셜 테스팅 신뢰구간(표본이 쌓일수록 좁아짐)과 예측 팬 차트(멀리 예측할수록 불확실성 커짐) 두 통계적 관행을 그대로 조합한 것 — 임의가 아니라 두 도메인 관행의 결합이며, 끝점이 정확히 손으로 정한 값에 수렴하도록 감쇠 함수를 설계해 "합계 정합"(끝값=표시값)을 보장했다.

3. ① 대표 시각화(차트)와 variant 비교 카드가 실제로 "대화"하게 만들 구체적 화면 골격을 정해야 했다(브리프는 예시만 제시, 리터럴 배치는 없음).
   ② 세로 레일 대신 가로 실험 피커 스트립(6장) → 히어로 차트(8) + 유의성 패널(4) → variant 비교 → 정렬 테이블의 단일 컬럼 흐름을 택했다.
   ③ 최근 라운드들(r14 마스터-디테일 고정폭 레일, freight 3-페인)과 매크로 골격이 겹치지 않게 하기 위한 의도적 회피였고, 피커 스트립 선택이 차트/패널/비교 카드 셋을 동시에 갱신하는 구조 자체가 "선택→다중 위젯 동기화"의 실질적 증거가 되도록 설계했다.

4. ① 1920px에서 콘텐츠 우측 여백을 페이지 패딩만으로 맞추기 위한 셸 치수 계산이 필요했다.
   ② 사이드바 `w-64`(256px) + `lg:px-8`(좌우 각 32px)로 셸을 재고, 메인 콘텐츠에는 별도 `max-w` 캡을 두지 않았다 — 1920에서 실측한 결과 콘텐츠 우단과 뷰포트 사이는 정확히 32px(패딩만)이었다(Playwright로 직접 측정, `gap=32`).
   ③ 브리프가 "초광폭만 완만 cap"이라고 했지 cap이 의무는 아니어서, 캡을 아예 두지 않는 쪽이 계산 실수(1440→1760류)의 여지를 없애는 가장 단순하고 검증하기 쉬운 해법이라 판단했다.

5. ① "라이브 미니 차트" 인터랙션의 구체적 데이터 원천과 갱신 주기를 정해야 했다(Math.random·Date.now 금지이므로 진짜 실시간은 불가).
   ② 12개 값으로 된 고정 배열을 2.4초 간격 `setInterval`로 순환시키는 방식을 택했고, `prefers-reduced-motion`이면 인터벌 자체를 시작하지 않고 정지된 첫 값만 보여주도록 했다.
   ③ 결정론 요구(리렌더해도 동일 시퀀스)와 "살아있다"는 인상을 동시에 만족하는 가장 단순한 방식이며, 모션 자체를 아예 멈추는 쪽이 "감속 애니메이션"보다 reduced-motion 취지에 더 맞는다고 판단했다.

6. ① `CURRENT_USER` 아바타에 쓸 고정 Unsplash 사진 ID를 정해야 했다(세션 컨텍스트의 실제 이메일을 베끼면 안 된다는 `auto-dash-r3` 델타를 의식).
   ② 가상 인물 "Marisol Fenn / marisol.fenn@northlane.io"를 만들고 사진 ID는 임의로 고른 고정값 하나만 사용했다(추가 인물 아바타는 두지 않음).
   ③ 세션의 실제 `userEmail`과 절대 겹치지 않는 완전히 새 가상 도메인(northlane.io)을 만든 것은 해당 델타가 지적한 "세션 메타데이터와 제품 페르소나 혼동" 위험을 원천 차단하기 위한 보수적 선택.
