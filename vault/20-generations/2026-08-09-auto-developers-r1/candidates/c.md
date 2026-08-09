# auto-developers-r1 / c — Wattline

Wattline is a fictional EV-charging-network API whose developer entrance is an **object map**: five
resources and the six relationships between them are drawn as a generative SVG graph that is the
page's axis, selection happens **on the graph** (each node is a real HTML button laid over an
`aria-hidden` edge layer), and choosing a node unfolds its complete record — fields with types,
endpoints, webhook events, and the edges leaving it — as a full-width four-column spread whose
"Edges from here" buttons walk you to the adjacent resource, while three named build routes light
their own edges on the same map and load their calls into a live request/response console. Four wired
interactions: node selection on the graph, route selection (map edge highlighting + numbered node
stops + an ordered call list whose every step is itself a button), endpoint selection inside the open
record, and the snippet language toggle (curl / TypeScript / Python, built from the endpoint rather
than stored). Theme: dark (`zinc-950` ground, `zinc-900` bands). Accent: emerald (emerald-400 for
lines, type and edges; emerald-500 fills carry `zinc-900` text). Display face `--font-display-wide` on
the h1 and the six section headings only; body and all Korean on `--font-sans`. Exactly three weight
classes route-wide (`font-normal`, `font-semibold`, `font-bold`). No clock is read anywhere in the
route and every coordinate is an integer in its own viewBox with percentages rounded to two decimals.

## 브리프에 없던 것

1. **① `developers` 타입이 무엇인지 — 카탈로그 0건 신규 타입이고 프로파일 문서가 없어 §1에 해당하는
   필수 요소 목록이 존재하지 않았다.** ② 여섯 요소로 정의했다: **모델 인벤토리**(이 시스템이 세상을
   어떤 객체로 쪼갰나) · **접속 계약**(base URL · 인증 · 버전 헤더 · 샌드박스) · **첫 호출의 실물**
   (요청과 응답을 나란히) · **실현 가능성 증명**(내가 만들려는 것이 이 모델 위에서 되는가) ·
   **실패 목록**(1주차에 실제로 만나는 에러) · **탈출구**(SDK·OpenAPI 문서). ③ [[brief-careers]] §1이
   채용 타입을 여섯 요소로 규정한 형식을 빌리되 항목은 인접 타입에서 유추하지 않고 이 타입의
   질문에서 도출했다 — careers의 "오픈 롤 인벤토리"에 대응하는 것이 developers에서는 엔드포인트
   목록이 아니라 **리소스 인벤토리**라고 판단했다. 이 판정이 이 후보의 §1 초안 후보다.

2. **① 문서 사이트와 developers 페이지의 경계 — 브리프는 "문서 사이트 자체가 아니라 그 입구"라고만
   했고 무엇을 넣지 말아야 하는지는 없었다.** ② 경계를 **"두 번 이상 볼 것은 여기 두지 않는다"**로
   그었다. 전체 필드 표·전체 에러 코드표·인증 흐름도·페이지네이션 규약은 레퍼런스로 링크하고,
   이 페이지에는 **한 번 이해하면 끝나는 것**(모델의 형태, 관계의 성격, 첫 호출, 실현 가능성)만
   남겼다. 그 결과 리소스는 5개, 엔드포인트는 11개, 에러는 4행이다 — 실제 API라면 이보다 크지만,
   **입구가 검색을 필요로 하는 순간 그것은 이미 문서 사이트**라고 봤다. 카피도 그 판정을 인쇄한다
   ("Small enough to hold in your head — so this page shows you the whole model rather than a search
   box over it"). 인접 타입과 갈리는 지점: `catalog`는 항목을 **고르게** 하고 `landing`은 **믿게**
   하는데, developers는 **판단하게** 한다.

3. **① 관계 그래프가 마스터-디테일로 미끄러지지 않는 기계적 조건 — "좌측 목록 + 우측 상세가 되면
   금지"라는 실패 형태는 지정됐지만 통과 조건은 없었다.** ② 세 개의 구조적 조건으로 고정했다:
   ⓐ 그래프는 **전폭 밴드**이고 선택 컨트롤이 그래프 밖에 따로 존재하지 않는다(리소스를 고르는
   유일한 1차 수단이 노드 버튼이다), ⓑ 레코드는 그래프 옆이 아니라 **아래 전폭 4열**이고 그 4열 중
   하나가 **자기 자신의 내비게이션**(Edges from here)이라 상세 패널이 아니라 그래프의 연장이다,
   ⓒ 세 번째 축(빌드 루트)이 그래프와 레코드를 **동시에** 구동해 선택의 흐름이 목록→상세 단방향이
   되지 않는다. ③ 근거는 [[curation-criteria]] Q6("입력축 × 출력축 조합표") — 입력축이 "목록에서
   행 클릭"이 아니라 "그래프 위의 노드·간선"이고 출력축이 "상세 패널"이 아니라 "관계까지 포함한
   레코드 + 경로 하이라이트"이므로 조합이 다르다고 판단했다.

4. **① 다이어그램의 접근성 계약 — 브리프는 "순수 시각 요소면 `aria-hidden` + 동등한 텍스트 경로"를
   요구했지만, 그래프가 **인터랙티브**할 때 어느 쪽인지는 규정하지 않았다.** ② **간선만 SVG,
   노드는 HTML 버튼**으로 쪼갰다. `<svg>` 전체가 `aria-hidden`이고 그 위에 절대배치된 노드는 진짜
   `<button>`이라 탭 순서와 접근성 트리에 그대로 들어간다. 관계(간선)는 시각적으로만 존재하므로
   **세 겹의 텍스트 경로**를 병행했다: 지도 아래 `sr-only` 리스트(6개 관계를 "site has many
   connector, through the field connector.site_id" 형태로 전부 문장화) · 레코드의 Edges from here
   열(선택 리소스의 관계를 방향까지 반영해 재서술 — `belongs to` / `referenced by` / `rolled up by`) ·
   선택 상태를 읽어주는 `role="status"`. ③ 근거는 [[page-brief-core]] §2 "키보드 전 경로 도달" —
   **간선을 따라가는 이동이 이 페이지의 주된 이동**이므로, 그 이동이 마우스로만 가능하면 텍스트
   대체가 아니라 기능 손실이다. 그래서 대체 텍스트가 아니라 **대체 이동 수단**을 만들었다.

5. **① 관계 종류를 색 말고 무엇으로 전달할지 — "색만으로 관계 종류 전달 금지"는 지시됐지만 대체
   채널은 지정되지 않았다.** ② **선 패턴 + 이름 + 정의문** 세 겹으로 갔다: `has many`는 실선,
   `references`는 파선(`7 5`), `aggregates`는 점선(`1 6`)이고, 범례가 각 패턴에 이름과 한 줄 정의를
   붙이며(“Solid line. The child cannot exist without the parent…”), 같은 이름이 레코드의 관계
   버튼과 `sr-only` 리스트에도 그대로 나온다. 경로 하이라이트도 색만 쓰지 않고 **선 굵기(1.5 / 2.5 /
   3.5)와 노드 위 번호 배지**를 함께 쓴다. ③ 관계 종류가 셋뿐인 이유도 여기서 나왔다 — 비색 채널로
   구분 가능한 선 패턴은 실질적으로 3종이 상한이라, **표현 채널의 한계가 모델의 어휘를 정했다.**

6. **① 그래프의 반응형 처리 — 390px에서 5노드 그래프를 어떻게 할지 브리프에 없다.** ② **좌표계를 두
   벌** 만들었다(wide `1000×520` 가로 흐름, narrow `340×640` 세로 지그재그). 각 레이어는 자기
   브레이크포인트에서만 렌더되고 반대쪽은 `display:none`이라 **숨은 레이어가 탭 순서·접근성 트리에
   중복되지 않는다.** 좌표는 런타임 계산이 아니라 모듈 로드 시점의 정수·2자리 반올림 퍼센트라
   하이드레이션 불일치가 생길 여지가 없고, 스트로크는 `vectorEffect="non-scaling-stroke"`로 두 좌표계
   사이에서 굵기가 같게 유지된다. ③ 대안이었던 "모바일에서 그래프를 리스트로 강등"을 기각한 이유는
   [[curation-criteria]]의 "차별성 ↔ 완성도" 판정 — **핵심 증명이 뷰포트에 따라 사라지면 그것은
   상시-노출 기본값이 아니다.** 가로 스크롤 컨테이너도 기각했다(§4의 로컬 스크롤 허용 범위 안이지만,
   지도는 **전체가 한눈에 보여야** 지도다).

7. **① "이 API로 무엇을 만들 수 있는가"를 무엇으로 증명할지 — 브리프는 이것이 핵심 증명이라고만
   했다.** ② **모델 위의 경로 3개**로 증명했다("Find a plug that is free right now" / "Start a charge
   and meter it to the cent" / "Bill a fleet at the end of the month"). 각 경로는 ⓐ 지도 위에서
   자기 간선 2개를 굵게 만들고 ⓑ 자기 노드 3개에 순번 배지를 얹고 ⓒ 호출·웹훅을 순서대로 나열하며
   ⓓ **각 단계가 버튼이라 누르면 그 리소스의 레코드가 열리고 콘솔에 그 요청이 실린다.** 기본 상태는
   두 번째 경로가 선택돼 있어 조작 0회에서 이미 `session` 레코드 전체 + `POST /v1/sessions`의 curl과
   응답 JSON이 펼쳐져 있다. ③ 근거는 [[curation-criteria]] "차별성 ↔ 완성도 상충 시 판정 방향" —
   신규 아키타입을 추구하되 **증명을 인터랙션 뒤로 지연시키지 않는다**는 규칙을 그래프 아키타입에
   적용한 결과다. 그래프만 있고 필드·코드가 클릭 뒤에 있으면 감점이라는 지시와 같은 판정.

8. **① 스니펫을 저장할지 생성할지 — 브리프에 규정이 없고, 11개 엔드포인트 × 3개 언어 = 33개를
   손으로 쓰는 것이 관행이다.** ② **엔드포인트 정의에서 생성**했다. 각 엔드포인트가 메서드·경로·
   SDK 호출 경로·인자 목록(`key`/`value`/`quoted`)을 들고 있고 순수 문자열 함수가 세 언어를 만든다.
   응답 JSON만 손으로 썼다. ③ 이유는 **드리프트 차단**이다 — 저장하면 엔드포인트 표와 요청 창이
   갈라지는 날이 반드시 오고([[curation-criteria]] "목록이 두 곳에 있으면 조용히 갈라진다"의 같은
   메커니즘), 개발자 페이지에서 그 불일치는 다른 어떤 결함보다 신뢰를 크게 깎는다. 부수 효과로
   입력이 고정이라 서버·클라이언트가 같은 문자를 렌더한다.

9. **① 정직한 한계를 넣을지 — 개발자 입구의 관행은 능력만 나열하는 것이다.** ② 경로마다 **"Where
   this path stops"** 한 줄을 강제했다(사이트·커넥터를 한 호출로 거리 정렬할 수 없다 / Wattline은
   결제를 대행하지 않는다 / 세금 계산은 EU·UK 등록에 한한다). ③ 근거는 이 볼트가 contact 라운드에서
   세운 "취급하지 않는 것" 요소와 같은 논리다 — **하루를 버리게 만드는 것은 없는 기능이 아니라 없는
   줄 몰랐던 기능**이고, 통합 가능성 판단이 페이지의 목적이면 불가능도 같은 화면에 있어야 판단이
   성립한다. 반증 대상: 이 절이 developers 타입의 필수 요소인지 이 후보의 취향인지는 다음 라운드가
   처음 잰다.

> 이 문서의 1·2·3·7이 `developers` 프로파일 초안의 §1·§2 후보이고, 4·5·6은 **아키타입(데이터 모델
> 지도형) 고유**라 타입 프로파일이 아니라 [[page-brief-core]] §2·§3의 다이어그램 절 후보다. 전부
> **재현 0회 L1**이므로 다음 라운드가 반증하기 전까지 판정 기준으로 쓰면 안 된다
> ([[curation-criteria]] 레벨 체크리스트).
