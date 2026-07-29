# DECISION — auto-landing-r8

- Target: landing (무작위 50/50 선택 결과)
- 후보: a — Signal Graph (Preference→Product 관계 그래프 히어로) · b — Counterweight (저울 물리 은유) · c — Strata (레이어 익스플로디드 스택)
- 하드게이트: 전 후보 통과 (b는 390px sweep 1회 수정 후 통과 — [[SCORES]] 참조)

## 렌즈 1 — 브리프/DNA 준수 (agent: general-purpose, opus)

랭킹: **a > c > b**

- a(1위): 액센트를 극소량으로 절제(헤드라인 한 단어만 accent), 팔레트가 토큰+틴트에 정확히 고정, 히어로에 이미 매물 4개가 풀태깅(96%/S/Verified/$198→$390/-49%)되어 상시 노출 — 세 후보 중 가장 밀도 높은 에디토리얼 증거.
- c(2위): 그라데이션 전무 + 카드당 증거 필드가 가장 풍부(필수 4종 + top signal 추가)하나, 액센트 비중이 무겁고(헤드라인 두 줄 전체 퍼플) 히어로 디테일 패널에 1280~1920 전 폭에서 약 200px 데드 스페이스 존재.
- b(3위): 빔+삼각 fulcrum+hairline이 브리프가 명시 금지한 "라인아트/블루프린트 장식" 항목에 정확히 해당, 토큰 외 색(#71717a, ~4.0:1)이 소형 텍스트에 사용, 히어로에 매물 1개만 노출, 좌측 pan이 390px에서 -3% 만큼 캔버스 밖으로 미세 유출.

## 렌즈 2 — 상용 랜딩 완성도 (agent: general-purpose, opus)

랭킹: **a > c > b**

- a(1위): "Budget" 클릭 시 패널 헤딩·근거 문장·4개 강도 막대·강조 매물까지 네 증거면이 동시 재계산(라이브 인터랙션으로 직접 확인) — 20개 SVG 엣지가 EDGE_STRENGTH를 실제로 인코딩하는 데이터 채널. 프리뷰 배지도 사진 하단 스크림에 둬 깨진 이미지에도 안전.
- c(2위): 카드 품질 최우수(top signal 추가) + 세 후보 중 유일하게 완전히 이미지-안전한 레이아웃(배지가 사진 아래 독립 행). 다만 히어로 인터랙션은 사전 작성된 텍스트의 "리빌"일 뿐 재계산이 아니고, 디테일 패널에 상태 불문 데드 스페이스 존재.
- b(3위): 재계산은 진짜이나 단일 지표(match% 83→95)뿐이라 체감이 약함(실측 기울기 7.9°→10.8°는 육안 구분 곤란), 히어로가 가장 휑함(1920에서 우측 컬럼 약 40% 공백), "96% match" 배지가 깨진 이미지 아이콘과 정확히 겹침, 1280에서 고아 줄바꿈 2건.

## 렌즈 3 — 아키타입/형태 차별성 (agent: general-purpose, opus)

랭킹: **a > b > c**

- a(1위): r1~r7 어디에도 없던 "두 집합 간 관계"를 시각화하는 구조 — 선호 노드 1개 선택이 20개 지속 엣지의 opacity/stroke-width를 동시 재분배, 390px에서도 메커니즘 온전.
- b(2위): 다중 입력 가중치→연속 양방향 차분 판독이라는 조합 자체는 새로우나, 세그먼트 우선순위 라디오는 절약계산기(r3c) 위젯의 재사용이고 각도로 스칼라를 인코딩하는 방식은 라디얼 게이지(r5a)의 축 재배치에 가깝다.
- c(3위): 필름-스택 스킨 아래는 순수 master-detail(roving-tabindex tablist + 인접 패널 스왑)로, tabs+accordion(r4c)·주석핀+점수(r7c)가 이미 다룬 구조 — Q6이 지목한 "스킨만 다른 재탕" 패턴.
- **충돌 플래그**: a와 c는 코드 레벨에서 동일한 `role="tablist"` + roving arrow-key + `aria-controls` 패널 매크로 메커니즘을 공유한다(`PreferenceGraph.tsx:99-133` vs `EvidenceStack.tsx:113-206`). a는 패널이 복제하지 않는 두 번째 동시 출력 채널(SVG 엣지 필드)이 있어 충돌을 벗어나지만, c는 그 채널이 없어 사실상 "a에서 그래프를 뺀 것"에 가깝다는 지적.

## 집계

3렌즈 전원 일치 — **a(Signal Graph) 승리**(no-winner 아님, tie-break 불요).

## LEARN

1. (L1, `landing-deltas-provisional.jsonl` auto-landing-r8/a) "조작=가치체감"은 이제 단일 지표 재계산이 최소 기준이고, 복수 증거면(근거 문장·비교 막대·강조 전환 등) 동시 재계산이 상위권을 가른다 — a(4면 동시 갱신) vs b(match% 단일, 육안 구분 곤란) 대조로 3렌즈 전원 확인.
2. (L2, supersedes auto-landing-r7) questions-queue Q9(이미지 로드 실패 시 배지-alt 겹침) 2회 재현 확정 → 아카이브 이동, "이미지 컨테이너 aspect-ratio+배경색 예약 + 배지는 사진과 분리 배치"를 GENERATE 기본 지침으로 승격.

## 관련
- [[SCORES]] · [[../../00-principles/design-principles]] · [[../../00-principles/landing-deltas-provisional]] · [[../../00-principles/questions-queue]]
