# auto-dash-r14 — SCORES

Target: `dash` (round selected by base-3 random draw — unfilled PAGE_TYPES queue was empty this round). Round number 14 = max prior dash round (13) + 1.

Frozen-state SHA-1 (concatenated `.tsx`+`.ts` in each candidate's own folder, post any 1-fix):

| Candidate | SHA-1 |
|---|---|
| a | `a2e91f1e02c1497f3cab4edfe0da9de50b9daf9c` |
| b | `eb01def2928295e73c224da5ff0f8d4a6ba249be` |
| c | `01721c34b0d92428024c3413c8ed4c37a7dd65eb` |

## Hard gate — `node scripts/gate.mjs --target web --routes /dash-evolve/r14/<v>`

Env: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1` (sandboxed pre-installed Chromium requires `--no-sandbox` to launch — same workaround as r11–r13).

| Gate | a (1st pass) | a (2nd pass, post 1-fix) | b | c |
|---|---|---|---|---|
| route | pass | pass | pass | pass |
| types | pass | pass | pass | pass |
| static | pass | pass | pass | pass |
| lint | pass | pass | pass | pass |
| weights | pass (3종) | pass (3종) | pass (3종) | pass (3종) |
| sweep | pass (오버플로 0) | pass | pass | pass |
| focus | **fail** — `input#6` (TicketRail search) `outline-none` 앞에 두고 `focus-visible:outline`을 뒤에 둔 dead idiom — page-brief-core §2 조항 재발 | pass (0건 누락) | pass (0건 누락) | pass (0건 누락) |
| console | pass (64건 메시지·결함 0) | pass | pass (52건·결함 0) | pass (200건·결함 0) |
| a11y | **fail** — 97, `color-contrast` (Topbar CTA 버튼 `bg-teal-600 text-white` ≈3.75:1, AA 4.5 미달) | pass (100) | pass (100) | pass (100) |
| perf | pass (59, 기록만) | pass (57, 기록만) | pass (53, 기록만) | pass (52, 기록만) |

**1-fix 루프 (a만 해당)**:
1. `TicketRail.tsx` 검색 input — `outline-none`을 `focus-visible:outline...`과 같은 요소에 함께 뒀다. page-brief-core §2가 명시한 죽은 관용구(`--tw-outline-style` 공유 변수가 `none`으로 굳어 뒤의 `focus-visible:outline`을 취소)를 designer가 프롬프트 경고에도 불구하고 재발시켰다. 해법: `outline-none` 클래스 제거(다른 클래스는 그대로 — `focus-visible:` variant만으로 충분).
2. `tokens.ts` `ACCENT_SOLID` — `bg-teal-600 text-white`(실측 대비 ≈3.75:1, AA 4.5 미달)를 CTA 버튼(Topbar "New ticket")에 사용. `curation-criteria` Q("채움 위 흰 글자는 …700으로")와 동일 패턴 — `teal-600`→`teal-700`(≈5.48:1)로 램프 전체를 한 단 올림(호버/액티브도 함께 시프트: `hover:teal-500`→`hover:teal-600`, `active:teal-700`→`active:teal-800`).

수정 후 동일 명령 재실행 → 전 항목 통과 확인. 순위에 영향 없음(3-1 규칙: 위반 해소 한정, 취향 개선 아님).

## 다양성 축 배정 (GENERATE 전 선제 체크, `catalog-variety.mjs` `banList` 실측)
- 최근 3-슬롯 윈도우(auto-dash-r13 정정분 2건 + r12): `accent: ["rose"]`, `face: ["grotesk"]` 금지. `theme`은 인정 가능한 연속 2라운드 기록이 1건뿐이라 미확정(빈 배열).
- 배정: a=light/blue-family(teal 사용, 배정 텍스트는 blue/teal이었음)/`-wide` · b=dark/emerald/`-mono` · c=light/amber/no-display-face.
- rose·grotesk 어느 후보에서도 사용되지 않음 — 확인됨(정적 위반 0, grep 확인).

## 후보 요약
- **a — Harborline** (Fernbridge Data 워크스페이스): 지원 티켓 콘솔, master-detail 2존(티켓 레일 + 상세 페인). 지배 시각화: 계정별 SLA 준수율/응답시간 추세(area/line), 헤드라인 스탯 상시 노출 + 최신 포인트 숫자 라벨 상시.
- **b — Rampart** (Nimbus Social 콘텐츠 검수): feed-centric, 중앙 실시간 검수 액션 스트림 + 좌우 사이드 패널. 지배 시각화: Bullet 차트 KPI 6행 그리드(값+목표 상시 텍스트) — 카탈로그 미사용 차트 패밀리 최초 도입.
- **c — Crewline** (Basin City HVAC & Electric): calendar/board-centric, Week/Day 전환 가능한 배차 스케줄 그리드가 페이지 주인공 + 기술자 용량 레일. 지배 시각화: 스케줄 그리드 자체(전 슬롯 상시 텍스트) + 보조 용량 Bar.

3개 매크로 골격(master-detail / feed-centric / calendar-board-centric) 모두 상이 — Q7(매크로-버킷 충돌 선제 체크) 준수, 기존 갤러리·이전 라운드 버킷(hero+단일시각화, 고정레일+세그먼트토글, 뷰포트락 칸반, treemap, funnel, sankey, radial-dial, RBAC 매트릭스, calendar-heatmap 위젯, 3-pane)과도 비중복.
