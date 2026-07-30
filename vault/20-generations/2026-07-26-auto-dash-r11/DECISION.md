# auto-dash-r11 — JUDGE 판정

타깃: **dash**. 3후보 전원 하드게이트 생존(§SCORES.md) → 3렌즈 블라인드 패널 진행.

## 후보 요약
- **a — Palisade**: Access & Permissions Console. role×permission 접근제어 매트릭스(5역할×19권한, 6그룹)가 화면 주인공. 설정 서브내비(좌) + 감사로그 레일(우) 병존. dash-evolve 신규 아키타입(불리언 토글 매트릭스는 지금까지 없었음).
- **b — Amberline**: Revenue/P&L Bridge Cockpit. 히어로 ARR 숫자 + waterfall/bridge 차트(7바, 항상-표시 값) + 드라이버 테이블. "히어로+단일지배시각화" 매크로 골격(이번 라운드 유일 배정, r10 델타의 버킷 제한 준수) 안에서 waterfall이라는 신규 차트타입으로 변주.
- **c — Sourcemark**: Faceted Search & Compare Console. facet 필터(좌) + 카드그리드 결과(중) + 비교트레이(우, 선택 시만 등장) — 차트/테이블이 아닌 카드그리드가 주인공인 dash-evolve 신규 패턴.

## 렌즈 1 — brief 준수 (판정: a > b > c)
- **a**: 결함 없음. 헤더 컨트롤 44px(Topbar.tsx:23,28,38,54,69,101), 비활성 nav 항목 TEXT_CAPTION 정확 사용(Sidebar.tsx:90), 테이블 모바일전용 min-w+table-fixed(PermissionMatrix.tsx:120-121), 단일 h1, 영문전용, 결정론 데이터 전부 확인.
- **b**: `Sidebar.tsx:90`에 하드코딩된 `text-zinc-400 dark:text-zinc-500`(비활성 "Billing & Plan" 항목) — 올바른 TEXT_CAPTION 패턴(zinc-500/zinc-400)의 역방향, 기본 렌더에서 바로 보임(토글 불요). 나머지 전부 통과.
- **c**: `SupplierCard.tsx:90`의 `truncate`가 1280px에서 카드 제목을 중간 절단("Torque & Bolt Sup...", "Anvilworks Indust...") — brief가 명시한 안티패턴("제목이 '...'로 절반쯤 잘리면 폭 배분이 잘못된 것")과 정확히 일치. 1440/1920에서는 자연 해소.
- 두 결함 모두 국소적(단일 라인)이라 치명 결함 아님 — 전 후보 유효.

## 렌즈 2 — 상용 SaaS 완성도 (판정: b > a > c)
- **b**: 모든 waterfall 바가 항상-표시 값 pill(+$142K 등, hover 불필요) — r7/r9/r10에서 확립된 "at-a-glance 즉시가독" 원칙의 가장 강력한 구현. 총합 바의 사선 텍스처, 절제된 골드 액센트, 히어로 ARR+스파크라인 — Mercury/Chartmogul급 프리미엄 핀테크 인상.
- **a**: 매트릭스도 항상-표시(hover 불필요 ✓Yes/✕No 배지) — 렌즈 축 충족. 감사로그의 grant/revoke 색상 동사 등 디테일 좋음. 다만 시각적으로 다소 평면적(백/블루 위주), "Soon" 태그가 많아 완성도가 옅어 보이는 인상.
- **c**: 카드/그리드 정렬·별점·태그 시스템은 깔끔하나 지배적 시각화가 없어(리스팅 페이지 성격) 세 후보 중 가장 "코크핏"보다는 "제네릭 마켓플레이스"에 가까움.

## 렌즈 3 — 아키타입 차별성 (판정: a > c > b)
- **a**: 불리언 토글 매트릭스는 기존 30개 아키타입(덴스 데이터그리드·마스터-디테일 포함) 전체와 장르 자체가 다름 — 가장 뚜렷한 구조적 신규성.
- **c**: facet+카드그리드+비교트레이는 r1~r10 전체에서 grep 매치 0(marketplace/compare-tray류 전무) — 진짜 신규 패턴이나, "카드그리드+필터"는 범용 SaaS 형태라 a의 매트릭스보다는 신규성 낮음.
- **b**: 스스로도 "히어로+단일지배시각화" 골격 재사용을 인정(차트타입만 waterfall로 변주) — 실질 신규성은 인정되나 세 후보 중 가장 점진적.
- 라운드 내 매크로 골격 중복 없음(a/c의 사이드 레일은 상시/일시성이 달라 수렴 아님, b는 유일한 단일컬럼 히어로+차트 구조) — 확인 완료.

## 집계
1위 표: a=2(렌즈1,3), b=1(렌즈2), c=0. **a(Palisade) 다수결 승리.**

## 승자: a — Palisade (Access & Permissions Console)
