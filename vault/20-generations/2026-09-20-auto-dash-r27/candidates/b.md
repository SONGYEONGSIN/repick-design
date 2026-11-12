# Candidate B — Fathom

**One-line concept:** Fathom is a pure-white, single-blue-accent cloud-cost root-cause console where a real drill-down decomposition tree (Region → Service → Resource type → SKU, every node's dollar value and % of parent always printed, never hover-only) is the page's dominant visualization, node selection recomputes exactly one detail rail, and a second, independently-sorted Top Movers leaderboard below deliberately never reacts to that selection.

## 적용한 인터랙션

1. **트리 노드 확장/축소** — `DecompTree.tsx`의 각 `role="treeitem"`은 자식이 있으면 caret 클릭 또는 Enter/Space로 열리고 닫힌다. `expanded: Set<string>` 상태가 실제로 자식 DOM을 마운트/언마운트하며, `aria-expanded`와 caret 회전(`rotate-90`)이 그 상태를 그대로 반영한다.
2. **키보드 전용 트리 탐색 (WAI-ARIA APG 트리 패턴)** — 클릭과 별개로 `ArrowUp`/`ArrowDown`이 roving tabindex로 포커스를 이동시키고, `ArrowRight`는 닫힌 노드를 열거나 이미 열린 노드의 첫 자식으로 내려가며, `ArrowLeft`는 열린 노드를 닫거나 부모로 올라간다. `Home`/`End`는 맨 위/아래로, `Enter`/`Space`는 선택+토글을 동시에 한다. 행 컴포넌트(`TreeRow`)는 렌더 내부가 아니라 모듈 최상위에 고정해, 확장할 때마다 리마운트되어 포커스가 날아가는 것을 막았다(주석으로 이유를 남김).
3. **노드 선택 → 단일 스코프 재계산** — 아무 노드나 클릭/Enter하면 `FathomClient`의 `selectedId`가 바뀌고, 이는 오직 `NodeDetailPanel.tsx` 하나만 다시 그린다(경로 브레드크럼, 값, 부모 대비 %, 델타, 예산, 상위 기여 자식 목록). `TopMovers.tsx`는 이 prop을 아예 받지 않는다.
4. **비교 기준 세그먼트 토글 (Prior period / Budget)** — `FathomClient`의 `Segmented`가 트리의 모든 델타 칩, KPI 스트립의 "Total cloud spend" 델타, `NodeDetailPanel`의 델타를 동시에 같은 원본 숫자에서 다시 계산해 보여준다(공유 표시 모드이지 개별 위젯 선택이 아니므로 파급 규칙과는 무관).
5. **독립적인 Top Movers 리더보드 (선택 파급 분리의 핵심)** — `TopMovers.tsx`는 `Value`/`Δ prior` 두 컬럼에 실제 `aria-sort` 정렬 헤더를 갖고, 행을 클릭하면 그 행만의 "왜 바뀌었나" 노트가 아코디언으로 열린다(`expandedRowId`, 이 컴포넌트 로컬 상태). `selectedId`를 prop으로 받지 않고, 정렬/펼침 상태가 트리 쪽으로도 전혀 전달되지 않는다 — 코드 주석에 "does NOT accept selectedId" 명시.
6. **커맨드 팔레트 (⌘K)** — 트리의 83개 노드 전체(Region/Service/Resource type/SKU)를 라벨로 검색하고, 결과를 고르면 `focusToken`이 증가해 `DecompTree`가 해당 노드의 조상 경로를 자동으로 펼치고 실제 DOM 포커스를 그 행으로 옮긴다(클릭 없이도 키보드 탐색이 이어질 수 있게).

## 브리프에 없던 것

**① 도메인·계층·페르소나 발명**
- 무엇을 정해야 했나: "클라우드 비용 RCA 콘솔"이라는 카테고리와 "Region→Service→Resource-type→SKU" 예시 계층만 주어졌을 뿐, 실제 지역·서비스 이름, 회사 인물, 이상치 스토리는 없었다.
- 무엇으로 정했나: 4개 리전(us-east-1/us-west-2/eu-west-1/ap-southeast-1) × 4개 서비스(Compute/Storage/Database/Networking) × 리소스 타입 × 일부 SKU까지, 총 83개 노드. 담당자는 가상 인물 **Dana Reyes**(FinOps lead)로 설정했고, 실제 "근본 원인" 스토리(배치 추론 후 반납 안 된 GPU 인스턴스, 잘못 설정된 리전 간 복제)를 심어 트리가 실제로 "원인을 찾아가는" 서사를 갖게 했다.
- 왜: 세션/환경 컨텍스트의 실제 이메일·이름을 더미 데이터에 절대 쓰지 말라는 지시가 있었고, 단순히 "SKU-123" 같은 무의미한 라벨보다 실제 AWS류 비용 구조(온디맨드/예약/서버리스, S3 계층 등)를 쓰는 편이 "진짜 제품처럼 보인다"는 벤치마크(Mercury/Coinbase급 실무 정밀도) 요구에 더 부합한다고 판단했다.

**② 자식→부모 합산 방식: 손타이핑 대신 계산**
- 무엇을 정해야 했나: 브리프는 "모든 레벨에서 자식 값의 합이 부모 값과 정확히 일치해야 한다"고 요구했는데, 이걸 사람이 두 번(자식 따로, 부모 따로) 타이핑하면 라운드가 거듭될수록 어긋나기 쉽다.
- 무엇으로 정했나: `data.ts`의 `RawNode`는 **리프에만** `value`를 갖고, `computeValue()`가 자식이 있으면 항상 재귀 합산한다. `decorate()`가 이 계산된 값으로 `pctOfParent`/`pctOfTotal`까지 한 번에 만들어 `REGISTRY`에 등록한다. 사람이 직접 타이핑하는 숫자는 리프의 달러 값과 (합산 대상이 아닌) `deltaPriorPct`/`budget` 플레이버 값뿐이다.
- 왜: "정합"을 산술로 검증하는 대신 애초에 어긋날 수 없는 구조로 만드는 편이 안전하다 — 이 세션에는 계산 검증용 Bash 실행이 금지되어 있어서(파일만 작성), 사람이 손으로 검산하는 방식보다 코드 자체가 항상 참이 되는 방식을 택할 수밖에 없었다.

**③ 액센트 정확한 셰이드 + 대비 실측**
- 무엇을 정해야 했나: "단일 블루 액센트, 채도는 절제"만 주어졌고, 정확히 어떤 blue 단계를 텍스트/버튼에 쓸지, 실제 대비 수치는 계산해야 했다.
- 무엇으로 정했나: `blue-700` (#1D4ED8, 흰 배경 대비 표준 WCAG 상대휘도 공식으로 손계산 ≈ **6.70:1**)을 텍스트/아이콘/포커스링/트리 연결선에, `blue-600`(#2563EB, 흰 글자 대비 ≈ **5.17:1**)은 솔리드 버튼 채움에만 쓴다.
- 왜: 대비를 가정하지 않고 실제로 sRGB→선형 변환 후 상대휘도 공식을 손으로 계산해, AA(4.5:1) 기준을 여유 있게 넘는 값만 채택했다. 비용 증가/감소(빨강/초록)는 브랜드 액센트와 겹치지 않도록 의도적으로 별도 rose/emerald 팔레트로 분리했다.

**④ 트리 기본 확장 깊이**
- 무엇을 정해야 했나: "첫 렌더에서 모든 보이는 노드가 값+비율을 보여야 한다"는 요구와, 83개 노드를 전부 펼치면 첫 화면이 지나치게 길어진다는 실용적 문제 사이의 균형점이 브리프에 없었다.
- 무엇으로 정했나: 리전(depth 0)만 기본으로 펼쳐 서비스(depth 1)까지 20행이 첫 화면에 보이고, 리소스 타입/SKU는 접힌 채로 시작한다. "Expand all" 버튼으로 전체(≈83행)를 한 번에 펼칠 수 있다.
- 왜: Power BI류 실제 decomposition tree 도구들이 보통 한두 단계만 기본으로 열어두는 관례를 참고했다 — "모든 보이는 노드는 값을 보여야 한다"는 규칙이지 "모든 노드가 항상 보여야 한다"는 규칙은 아니라고 해석했다.

**⑤ 이상치(anomaly) 판정 임계값**
- 무엇을 정해야 했나: 브리프에 "이상 항목을 표시하라"는 요구는 없었지만, RCA 콘솔이 진짜로 "원인"을 보여주려면 뭔가 튀는 값을 시각적으로 구분할 기준이 필요했다.
- 무엇으로 정했나: 전월 대비 **+40% 이상**을 `ANOMALY_THRESHOLD_PCT`로 정하고, `Flame` 아이콘 + "Anomaly" 텍스트로 표시했다(색만으로 전달하지 않음). 이 값은 실제로 심어둔 GPU 인스턴스(+186.4%)와 복제 작업(+64.0%)은 잡아내지만, 평범한 두 자릿수 변동(예: 요청 급증 +28.0%)은 잡아내지 않도록 역산해서 정했다.
- 왜: 자의적인 숫자이지만, 계획한 두 "사건"만 걸리고 정상적인 월별 변동은 걸리지 않도록 실측 후 정한 값이라고 코드 주석에 남겼다.

**⑥ 예산(budget) 데이터의 세분화 한계**
- 무엇을 정해야 했나: "Budget" 비교 모드를 만들려면 예산 숫자가 어느 레벨까지 존재해야 하는지가 브리프에 없었다.
- 무엇으로 정했나: 예산은 Region과 Service 레벨(depth 0/1)에만 존재하고, Resource type/SKU는 `budgetDeltaPct`가 `undefined`가 되어 UI에 "Not tracked at this level"로 정직하게 표시된다.
- 왜: 실제 FinOps 조직은 보통 팀/서비스 단위로 예산을 세우지 SKU 단위로는 세우지 않는다 — 없는 데이터를 지어내는 대신 "여기는 추적 안 함"을 명시하는 편이 실제 제품다운 정직함이라고 판단했다.

**⑦ 선택 파급 범위 분리 (핵심 판정 축)**
- 무엇을 정해야 했나: 트리의 `selectedId`를 다른 위젯에도 같은 prop 이름으로 그대로 꽂으면 "서로 바꿔 낄 수 있는 껍데기"로 읽힌다는 경고가 브리프에 있었다.
- 무엇으로 정했나: `selectedId`는 오직 `DecompTree`(펼치기/포커스)와 `NodeDetailPanel`(렌더링)만 소비한다. `TopMovers`는 그 prop을 아예 받지 않고, 자기 자신의 `sortKey`/`sortDir`/`expandedRowId`만 갖는 완전히 별개의 지배적 위젯으로 설계했다 — 두 파일 양쪽에 "왜 반응하지 않는지"를 주석으로 남겼다.
- 왜: 브리프가 명시한 "가장 강한 패턴"(서로 다른 두 지배적 위젯에 독립적인 선택 상태)을 그대로 따랐다 — 트리+상세 패널이 한 쌍, Top Movers가 다른 하나.

**⑧ 디스플레이 서체(`--font-display-mono`) 적용 범위**
- 무엇을 정해야 했나: 이번 라운드에 배정된 모노스페이스 디스플레이 서체를 워드마크에만 쓸지, 더 넓게 쓸지가 브리프에 없었다.
- 무엇으로 정했나: 워드마크(Fathom) + 페이지 `<h1>`("Cloud spend root cause") + 모든 `Eyebrow` 마이크로 라벨까지만 적용했다. 트리 라벨, 표 본문, 통화·퍼센트 숫자는 전부 Pretendard(`--font-sans`) + `tabular-nums`로 남겼다.
- 왜: 모노스페이스는 "정밀한 콘솔" 인상을 주기에 브랜드/헤드라인에는 잘 맞지만, 숫자 자체에 쓰면 실제 통화 렌더링 컨벤션(Pretendard의 `tabular-nums`)과 충돌하고 "숫자에는 두 번째 활자가 섞인다"는 오해를 살 수 있어 라틴 헤드라인 범위로 좁혔다.
