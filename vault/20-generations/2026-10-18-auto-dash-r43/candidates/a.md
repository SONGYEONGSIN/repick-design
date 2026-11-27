# Candidate a — Meterbase

Usage-billing B2B SaaS's internal revenue-ops console, where the whole page is one hand-built Sankey of the customer lifecycle (signup → activation → trial outcome → revenue motion) flanked by a channel rail whose rows expand in place into their own stage breakdown — no second pane ever opens.

## 인터랙션

1. **Sankey 크로스헤어 (키보드 접근 가능)** — `sankey-chart.tsx`. 9개 노드 모두 라벨+카운트+퍼센트가 항상 텍스트로 보임(호버 전제 없음). 각 노드는 `<button>`이라 Tab으로 포커스 가능하고, 호버/포커스 시 연결된 링크만 강조하고 나머지는 옅어지며, 캡션 한 줄(`aria-live="polite"`)이 "Converted to Paid: 5,060 accounts, 40.5% of all signups" 식으로 갱신.
2. **테이블 실제 정렬/필터** — `accounts-table.tsx`. 6개 컬럼 중 4개가 `aria-sort` 토글 정렬(이름/MRR/헬스/최근활동), 상단에 단계별 필터 칩(All/Expanding/.../Churned) 6종.
3. **기간 토글** — 페이지 헤더의 세그먼트 컨트롤이 This quarter/Last quarter를 전환하며 KPI 4개·채널 레일·Sankey 전부 재계산.
4. **선택 → 제자리 확장 (tier-3, 배정값)** — `channel-rail.tsx`. 채널 행 클릭 시 그 행 자체가 아코디언으로 펼쳐져 자신의 스테이지 분해를 보여줌. 별도 디테일 패널은 어디에도 없음.
5. **⌘K 커맨드 팔레트 (보너스)** — `command-palette.tsx`. 기간 전환·채널 열기·CSV 내보내기를 커맨드로 실행, 화살표/Enter/Esc 전부 동작, DOM 포커스는 입력창에 유지한 채 `aria-activedescendant`로 가상 포커스.

5개 구현 — 최소 4개 요구치 초과.

## 폰트/타이포그래피 확인

- 본문·라벨·숫자: `--font-sans` (Pretendard) 고정. 전역 어디서도 추가 `next/font` import 없음.
- 디스플레이: `--font-display-grotesk` 단 1종만, Latin 큰 텍스트 2곳에만 사용 — 사이드바 워드마크 "Meterbase", KPI 타일의 큰 수치. 한글 텍스트는 이 라운드에 전혀 없음(브리프의 "Copy language: English only" 규정).
- 렌더 폰트 weight 3종만: `font-normal`(400)/`font-medium`(500)/`font-semibold`(600). `font-bold` 등 미사용(그렙으로 확인).
- 숫자 전부 `tabular-nums` + 우측 정렬. 통화는 `Intl.NumberFormat('en-US', {style:'currency', currency:'USD'})`, compact notation 미사용(하이드레이션 트랩 회피) — 모든 값이 25,000 미만이라 축약 표기 자체가 불필요.

## 브리프에 없던 것

① 구체적 제품/브랜드와 Sankey가 다룰 도메인 — 브리프는 "구독 라이프사이클 퍼널 등 자유 선택"만 요구
② "Meterbase"라는 사용량 기반 빌링 SaaS를 발명하고, Sankey 주제를 "자사 고객의 가입→활성화→유료전환→확장/축소/이탈" 라이프사이클로 설정, 6개 획득 채널(Organic/Paid Search/Referral/Partner/Outbound/Content)과 2개 분기(Q3/Q2) 데이터를 전부 리터럴로 작성
③ Mercury/Monarch류가 "자사 운영 지표를 보는 내부 콘솔" 컨벤션을 따르는 것을 참고 — 외부고객이 아니라 자기 회사의 매출 운영을 보는 진짜 B2B 내부툴 느낌을 내기 위함

① Sankey 노드 9개·링크 9개의 정확한 그래프 구조(어디서 분기하고 어디서 합류하는지)와 색상 매핑 규칙 — 브리프는 "멀티스테이지 플로우, 값은 항상 보여라"만 요구, 토폴로지는 명시 없음
② "New Signups → {Activated, Not Activated} → {Converted to Paid, Still Trialing, Churned} → {Expanding, Stable, Contracting}"로 4단 구성하고, 링크 색은 항상 "도착 노드"의 색을 따르도록 규칙화(둘 이상의 소스가 "Churned"로 합류해도 둘 다 rose로 일관)
③ 임의 설계이지만 Sankey 관행(흐름의 의미는 보통 "어디로 가는가"로 읽는다)을 따름 — 소스 색으로 칠하면 합류 지점에서 색이 섞여 읽기 어려워짐

① Sankey 레이어웃에서 컬럼마다 노드 개수가 달라 생기는 세로 여백(gap) 예산을 어떻게 잡을지 — 브리프는 "SVG/CSS 직접 제작, trig 좌표 2자리 라운딩"만 요구, 레이아웃 알고리즘은 명시 없음
② `scale = (plotHeight - maxGapsInAnyColumn * GAP_Y) / totals.signups`로, 노드 수가 가장 많은 컬럼(3개 노드, gap 2개)을 기준으로 스케일을 역산해 모든 컬럼이 plot 영역 안에 들어오도록 예산을 미리 떼어놓음
③ 임의 선택 — 실제로 Q3(12,480)·Q2(11,080) 두 데이터셋 모두에 대해 4개 컬럼 전부가 세로 범위를 벗어나지 않는지 직접 계산해 검증

① 블루 액센트의 정확한 사용처별 색조(버튼/뱃지/포커스 링 각각 몇 번대) — 브리프는 "#2563EB 계열, AA 검증"만 요구
② 포커스 링·CTA 버튼 배경은 `blue-700`(#1D4ED8, 흰 배경·흰 글자 양쪽에서 AA 여유 있게 통과), 장식적 배지/도트는 `blue-50`~`blue-600`
③ 직접 상대휘도로 추정 검증 — white 위 blue-700 텍스트 ≈6.3:1, blue-700 배경 위 흰 글자도 동일 대비(대칭) — blue-600(#2563EB)은 흰 글자와의 대비가 AA 경계(~4.5:1)에 더 가까워 여유를 더 둔 blue-700을 CTA에 채택

① 방향 아이콘(증가/감소 화살표)을 Churn Rate처럼 "낮을수록 좋음"인 지표에 재사용할 때 생기는 모순 — 브리프의 "directional icon check" 항목이 지적한 바로 그 함정
② `Delta` 컴포넌트를 화살표 방향(=값의 수학적 부호, 항상 참)과 색상(=`invertGoodness`로 뒤집을 수 있는 "좋음" 판정)을 분리해서, Churn Rate에만 `invertGoodness`를 줌
③ 브리프에 명시된 체크리스트 항목을 그대로 코드 레벨 불변식으로 번역한 것 — 임의가 아니라 지시사항의 직접 구현

① 기간 토글이 "지금 보는 분기"를 바꿀 때 KPI 딜타의 비교 기준을 어느 분기로 잡을지 — 데이터가 Q3/Q2 둘뿐이라 Q2를 보는 중엔 "그 이전 분기"가 존재하지 않음
② 항상 "현재 선택 분기 vs 나머지 한 분기"로 대칭 비교(`otherPeriod`)하도록 설계 — Q3를 보면 "vs last quarter", Q2를 보면 "vs this quarter"로 라벨만 바뀜
③ 임의 선택이지만 이렇게 하면 어떤 분기를 선택해도 빈 상태나 "비교 불가" placeholder가 전혀 생기지 않음 — 브리프의 "secondary panel은 절대 빈 상태로 두지 말라" 원칙을 분기 토글에도 그대로 적용한 것

① 완성도 체크리스트의 "sparkline"·"tabs" 컴포넌트를 이 archetype(마스터-디테일 + Sankey)에 어디에 자연스럽게 배치할지 — 브리프는 컴포넌트 종류만 나열, 배치는 명시 없음
② Sparkline은 Accounts 테이블에 "6-mo trend" 컬럼으로(계정별 MRR 6포인트, 마지막 값은 항상 그 행의 MRR과 정확히 일치하도록 역산), Tabs는 채널 레일의 펼쳐진 행 안에 "By Stage/By Quarter" 2탭으로 배치(전역 기간 토글과 별개로, 그 채널 하나만 전분기 대비를 보고 싶을 때)
③ 둘 다 "제자리"에 머무르는 선택 — Sparkline이 별도 차트 패널을 만들지 않고 기존 테이블 행에 끼워 넣듯, Tabs도 탭 전환 하나로 로컬 뷰만 바꾸고 다른 위젯엔 전혀 영향을 주지 않게 해서, tier-3 규칙("선택을 다른 위젯으로 fan-out하지 말라")의 정신을 두 컴포넌트에도 일관되게 적용

① 초광폭(ultra-wide) `max-w` 캡 수치 — 브리프는 "본인 쉘 기준으로 직접 계산하라"고만 함
② `max-w-[1680px]`로 설정
③ 이 레이아웃의 실측값으로 역산: 데스크톱 사이드바 256px(`w-64`, `lg:flex`) + 1920px 뷰포트에서 적용되는 `lg:px-8`(양쪽 32px=64px 총) → 가용폭 = 1920−256−64=1600px. 캡(1680) ≥ 가용폭(1600)이므로 1920px에서는 캡이 전혀 걸리지 않고 콘텐츠가 그대로 1600px까지 차서 뷰포트 우측 끝까지 남는 간격은 패딩뿐인 32px(≤40px 규정 통과). 2560px 같은 더 넓은 화면에서야 비로소 캡이 실제로 작동해 과도한 가로 늘어짐을 막음
