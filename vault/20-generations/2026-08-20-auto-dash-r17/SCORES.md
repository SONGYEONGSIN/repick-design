# auto-dash-r17 — HARD GATE (§3)

- 일자: 2026-08-20
- 타깃: dash · 라운드 r17 (연속 실행 2라운드 중 2라운드째 — 1라운드는 landing r13)
- 라우트: `/dash-evolve/r17/{a,b,c}`
- 게이트: `node scripts/gate.mjs --target web --routes /dash-evolve/r17/<v>`
- 판정 동결 해시: `a07dcdaba1f9ddda7ecceb3960f2769b26edf938`

## 후보 개요

| 후보 | 제품/브랜드 | 매크로 골격 | 지배 시각화 | 테마 | 액센트 | 디스플레이 활자 |
|---|---|---|---|---|---|---|
| a | Backhaul — 반품·리퍼 역물류 콘솔 | Funnel/Flow spine + 스테이지 드릴 인스펙터 | 6단계 퍼널(생성형 SVG) + 스테이지 원장 테이블 | dark | indigo (`#818cf8`/`#4f46e5`) | wide |
| b | Bayline — 정비 베이 스케줄러 | 캘린더 히트맵 spine + 데이 드릴 아젠다 | 6주×7일 로드 히트맵 + 엣지 합계 | light | blue (`#1d4ed8`) | 없음 (Pretendard) |
| c | Trussline — 클라우드 비용 리컨실리에이션 콘솔 | Waterfall 리컨실리에이션 원장 | 8-드라이버 워터폴(생성형 SVG) + 러닝토탈 원장 | dark | lime (`#a3e635`) | mono |

## 게이트 결과 (전원 1차 통과 · 1-fix 0회)

| 관문 | a | b | c |
|---|---|---|---|
| route | pass | pass | pass |
| types | pass · 에러 0 | pass · 에러 0 | pass · 에러 0 |
| static | pass · 위반 0 | pass · 위반 0 | pass · 위반 0 |
| lint | pass · 위반 0 | pass · 위반 0 | pass · 위반 0 |
| weights | pass · 3종 (렌더 실측) | pass · 3종 (렌더 실측) | pass · 3종 (렌더 실측) |
| sweep | pass · 전 폭 오버플로 0 | pass · 전 폭 오버플로 0 | pass · 전 폭 오버플로 0 |
| focus | pass · 누락 0건 | pass · 누락 0건 | pass · 누락 0건 |
| console | pass · 결함 0 (메시지 40) | pass · 결함 0 (메시지 37) | pass · 결함 0 (메시지 46) |
| a11y | pass · 100 | pass · 100 | pass · 100 |
| perf | 49 (기록만) | 45 (기록만) | 48 (기록만) |

**전원 9관문 1차 통과 · 1-fix 0회** — `auto-landing-r9` 이후 두 번째 3후보 무수정 통과 라운드. designer 3명이 자기 폴더에서 자체 검증(tsc·정적·포커스 Tab·스크린샷)을 돌린 뒤 제출한 결과다. (각 designer 보고: a는 focus/reconcile/폭을 Playwright 실측, b는 히트맵 램프 대비를 사전 계산해 blue-500 대신 blue-400 상한 채택 + r16 델타의 390px 붕괴를 주간 그룹 리스트 스왑으로 회피, c는 Intl 하이드레이션 불일치·sr-only scrollWidth 오염·1280 드라이버명 클리핑 3건을 자체 발견·수정.)

## 환경 메모

- 사전설치 Chromium rev1194(`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`)를 `PW_CHROMIUM_PATH`·`CHROME_PATH`·`PW_NO_SANDBOX`로 기동해 sweep·focus·a11y·perf 전부 실측(r11~r16 선례와 동일 계열 조치, `unavailable` 아님).
- 샌드박스 네트워크가 외부 이미지·폰트 로드를 차단하므로 아바타·원격 이미지는 깨진 상태로 렌더 — 환경 제약, 감점 사유 아님. 세 후보 모두 컨테이너 예약 + 데이터 텍스트 병기로 이 조건에서도 판독 가능.
