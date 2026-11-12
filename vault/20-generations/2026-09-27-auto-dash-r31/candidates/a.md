# auto-dash-r31/a — Tolerance

**한 줄 컨셉**: 공급업체 품질검수를 3-페인 트레이딩 터미널 골격(좌 벤더 레일 + 중앙 박스플롯 클러스터 + 우 인스펙터)에 얹되, 지배 시각화를 카탈로그 최초의 Box Plot으로 세운 벤더 품질 벤치.

- 아키타입: 3-페인 마켓 (레일 | 지배시각화 | 인스펙터), 지배 시각화 = Box Plot(분포) — charts.catalog "Distribution / Statistical" 최초 사용
- 테마: light · 액센트: rose · 디스플레이 활자: `--font-display-mono`
- 인터랙션 5종: ① 기간(30/60/90일) 세그먼트 토글 → 박스플롯 5수치요약 전면 재계산 ② 실제 정렬(인스펙터 배치 테이블, aria-sort) ③ 영속 pin(박스 클릭 또는 레일 클릭) → 인스펙터 패널만 좁게 갱신 ④ 비영속 hover/focus(박스에) → 상단 readout 줄에 Q1/중앙값/Q3/범위 전체 노출, `hoveredId!==pinnedId` 가드 + onMouseEnter/Leave·onFocus/Blur 쌍 배선(r29c 계보) ⑤ 벤더 레일 검색 필터
- 항상-노출 값: 각 박스 위에 중앙값 %가 상시 텍스트(hover 불필요, r7/r9/r10 계보 준수)
- 기본 상태: pin 기본값 = 90일 median 최고(임계 초과) 벤더로 사전 선택 → 인스펙터가 첫 페인트부터 채워짐(r30 빈 placeholder 델타 회피)

## 브리프에 없던 것

1. **결정론 더미 데이터 생성 방식** — 브리프는 "현실적·결정론적 더미"만 요구하고 구체 기법은 안 정함. 나는 `Math.sin`/`Math.cos`를 고정 인덱스(벤더 순번·기간 순번)로만 구동해 5수치요약(min/Q1/median/Q3/max)과 80건 배치 데이터를 생성했다 — 손으로 80개 숫자를 타이핑하는 대신 재현 가능한 공식을 택했다(Math.random 아님, 매 렌더 동일 출력).
2. **포커스 안전 패턴의 정확한 형태** — page-brief-core §2가 "`outline-none` 단독 금지"만 말하고 "`outline-none`+`focus-visible:outline`을 같이 걸어도 죽는다"는 사실은 명시하지 않는다(그 경고는 reassign-queue 아카이브에만 있다). 처음엔 관용적으로 `outline-none focus-visible:outline-2 ...`를 같이 걸었다가 게이트가 전부 `focus-invisible`로 잡아 `outline-none`을 전면 제거했다 — 근거: `--tw-outline-style`가 공유 커스텀 프로퍼티라 `none`이 이후 유틸리티에도 남는다.
3. **인스펙터 배치 테이블에서 "Units" 열 제거** — 브리프는 열 구성을 안 정한다. 처음엔 Batch/Units/Defect%/Status 4열 + `min-w-[420px]`로 짰는데, 인스펙터 폭(320px 고정)보다 넓어 `table-overflow`가 전 데스크톱 폭에서 걸렸다(모바일 전용 로컬 스크롤 규칙은 "좁은 페이지"를 전제하는데 이건 "좁은 컬럼 카드" 문제라 다른 처방이 필요했다). Units를 빼고 3열로 줄여 min-w 없이 % 배분만으로 수납했다 — 열 개수를 컨테이너 폭에 맞춰 줄이는 것도 유효한 해법이라고 판단.
