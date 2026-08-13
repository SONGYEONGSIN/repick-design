Runsheet — an editorial content-calendar console for media/marketing teams, built around a real month-view grid with icon-coded channel indicators per day, a synced draft-queue rail, and a ⌘K command palette.

## 브리프에 없던 것

① 결정: 캘린더 요일 셀의 채널 지표를 색(hue)으로 구분할지, 아이콘 모양으로 구분할지.
② 결정: 아이콘 모양(Mail/Rss/Share2/Video/Mic2)으로 구분하고, orange는 오직 "매칭/강조" 상태(필터 매칭·오늘·선택·scheduled 상태)에만 쓴다.
③ 근거: 과제 지시("small colored dots or count badges per channel")와 "single-accent principle"(orange 하나만)이 표면적으로 충돌한다. colors.catalog의 "단일 액센트 원칙"을 브리프 우선 규칙(카탈로그 vs 브리프 충돌 시 브리프 승)에 따라 유지하고, 채널 구분은 색이 아닌 아이콘 모양(+ux-guidelines.catalog "색만으로 구분 금지" 원칙)으로 해결했다 — 결과적으로 두 요구를 동시에 만족.

① 결정: "채널 필터 토글 → 캘린더 지표 recolor/dim" 인터랙션에서, 비매칭 채널 아이콘을 얼마나 어둡게(dim) 할지.
② 결정: 색은 항상 zinc-400(다크 표면 대비 하한) 이상으로 고정하고, "dim"은 아이콘 크기를 13px→10px로 줄이는 것으로 표현했다(색 낮추기 대신 크기 낮추기).
③ 근거: dash-deltas-provisional.jsonl의 반복 재현 델타("다크 표면 보조텍스트/지표는 zinc-400 미만 금지, 필터·토글로만 도달하는 상태도 동일 규칙")를 직접 적용 — 이 인터랙션은 정확히 "필터로만 도달하는 상태"이므로 자동 게이트가 기본 렌더만 스캔해도 놓치지 않도록 처음부터 안전한 색만 쓰기로 결정.

① 결정: "오늘" 기준일(TODAY)을 어떻게 고정할지 — 실제 시스템 날짜(2026-08-13)와 우연히 같은 값을 써도 되는지.
② 결정: `TODAY = { year: 2026, month: 7, day: 13 }`로 코드 리터럴에 고정하고, `new Date()`(빈 괄호)는 어디에도 쓰지 않았다. `new Date(y,m,d)` 명시 인자 호출만 사용(가중치/라벨 포맷용).
③ 근거: page-brief-core의 결정론 규칙(`Math.random(`·`Date.now(`·정확히 `new Date()`만 하드페일)을 dash-static-check.mjs 소스에서 직접 확인 — 실제 오늘 날짜와 값이 같아도 리터럴이므로 규칙 위반이 아니며, 세션 컨텍스트의 currentDate를 "읽어서" 쓴 것이 아니라 브리프가 요구하는 "고정된 오늘 기준"을 독립적으로 골랐다(우연의 일치).

① 결정: 모바일(390px) 캘린더를 어떻게 리플로우할지 — 브리프는 "compact/agenda view"만 언급하고 구체 패턴은 정하지 않음.
② 결정: 데스크톱은 `<table>` 월간 그리드, 모바일은 완전히 별도의 `<ol>` 아젠다 리스트(그 달의 아이템 있는 날짜만 나열)로 분기 렌더 — 가로 스크롤 래퍼를 아예 만들지 않았다.
③ 근거: dash-brief-v3 "그리드 검증 룰 v2"(데스크톱 테이블 가로 스크롤바 금지, 로컬 가로 스크롤은 모바일 전용)와 dash-deltas의 sr-only+overflow-x-auto 결함 클래스(r5/r11)를 원천 차단하기 위한 설계 — overflow-x-auto 클리핑 컨테이너 자체가 없으면 그 결함 클래스가 구조적으로 발생할 수 없다는 판단(카탈로그가 명시한 해법보다 더 안전한 상위 선택).

① 결정: 캘린더가 "화면 주인공"이면서 동시에 "가짜 라이트 아닌 진짜 다크"를 만족하려면 카드/보더/텍스트 토큰 값을 얼마로 할지.
② 결정: colors.catalog 다크 뱅크에 orange 액센트 항목이 없어서(Financial/Dev-Tool/Personal-Finance/Fintech 4종 모두 green/purple/blue 계열), Developer-Tool 다크 팔레트 구조(zinc-950/900 표면, white/10 보더)를 그대로 차용하고 accent만 orange-400/500으로 교체 — 대신 orange-500 배경엔 반드시 zinc-950(어두운) 텍스트를 얹어 AA 확보(대략 7.5:1), orange-400 텍스트는 zinc-950 배경 위에서 사용(대략 8.8:1)로 직접 계산해 확정.
③ 근거: colors.catalog 자체의 "Banking/Finance" 라이트 팔레트 노트("on-accent #FFFFFF, gold 어둡게 보정")와 "Fintech/Crypto" 다크 팔레트 노트("on-primary 어두운 텍스트, gold 위")가 채도 높은 warm 색 위에는 밝은 텍스트가 아니라 어두운 텍스트를 쓰라는 동일 관례를 보여줘서 orange에도 동일 관례를 적용.

① 결정: 브랜드명 — 레포 갤러리에 이미 쓰인 이름과 겹치지 않는 새 이름을 어떻게 고를지.
② 결정: "Runsheet"(방송·제작 현장에서 쓰는 "진행 순서표" 용어)를 골랐다.
③ 근거: `src/lib/works.ts`의 전체 brand 목록을 grep으로 실제 대조해 중복이 없음을 확인했고, 에디토리얼 콘텐츠 캘린더라는 도메인과 "runsheet"라는 용어의 의미가 직접 맞아떨어져 폰트(모노스페이스 = 인쇄된 진행표 느낌)와도 시너지가 있다고 판단해 임의 선택.
