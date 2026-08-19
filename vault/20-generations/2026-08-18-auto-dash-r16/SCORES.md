# SCORES — auto-dash-r16

소스 해시(동결, 게이트/캡처/judge 전 공통, 1-fix 반영 후): `d7f787ee4fcd9af2333f9950b47ea86f2ee2beec`
(`cat app/src/app/dash-evolve/r16/{a,b,c}/*.{tsx,ts} | shasum`)

환경 고유 조치: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` + `CHROME_PATH` + `PW_NO_SANDBOX=1` — 컨테이너 사전설치 chromium(1194)이 이 playwright-core(1.61.1) 요구 빌드(1228)와 달라 기본 실행 불가, r11-r15 선례와 동일 계열 조치.

| 후보 | route | static | lint | weights | sweep | focus | console | a11y | perf | 결과 |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| a — Warden (kanban board) | 통과 | 통과 | 통과 | 4종(기록) | **1차 실패→1-fix 통과** | 통과 | 통과 | 100 | 64 | 생존 |
| b — Stockloom (data grid) | 통과 | 통과 | 통과 | 3종(기록) | 통과 | 통과 | 통과 | **1차 97(color-contrast)→1-fix 100** | 62 | 생존 |
| c — Parhelion (twin panel) | 통과 | 통과 | 통과 | 4종(기록) | 통과 | 통과 | 통과 | **1차 100/label-mismatch 하드페일→1-fix 100 정상** | 61 | 생존 |

## 1-fix 상세
- **a (sweep)**: `Board.tsx` 6컬럼이 `min-w-[260px]` 고정 하한을 유지한 채 `lg:flex-1`로 전환 — 6×260+5×16=1640px 하한이 1920px 가용폭(1616px)조차 못 채워 페이지·보드 컨테이너 양쪽에서 오버플로. `flex + overflow-x-auto` 가로 스크롤 보드를 CSS Grid `auto-fit minmax(200px,1fr)` 랩핑 보드로 교체(`Board.tsx:52,92`) — 전 테스트 폭에서 `scrollWidth === clientWidth` 확인, `dash-sweep.mjs` 직접 재실행으로 `{pass:true}` 확인.
- **b (a11y color-contrast)**: 헤더 검색 버튼 내 `<kbd>⌘K</kbd>` 힌트가 `text-zinc-400` on `bg-white`(순백 칩) — 순백 하한 zinc-500 미달. `text-zinc-400`→`text-zinc-500`(`AppShell.tsx:194`).
- **c (a11y label-content-name-mismatch)**: 지역 선택 버튼의 `aria-labelledby`가 sr-only "Region A/B" 접두사 + 버튼 자기 텍스트를 결합해, 접근 이름이 화면에 보이는 텍스트만으로 시작하지 않음. `aria-labelledby` 제거(기본 텍스트 콘텐츠 기반 명명으로 화면 텍스트와 100% 일치) + `aria-describedby`로 "Region A/B" 문맥은 설명으로 이동(`ComparePicker.tsx:34-39`).

3-키 하드게이트 판정 무관 항목(perf)은 기록만.
