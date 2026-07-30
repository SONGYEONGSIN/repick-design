# auto-dash-r12 — SCORES

target: dash · round: auto-dash-r12 · date: 2026-07-27

## Candidates

| v | product | archetype | domain |
|---|---|---|---|
| a | Cadence — Release & Reliability Console | hero stats + single dominant viz (14-week × 7-day deploy/incident calendar heatmap) | DevOps / platform engineering DORA metrics |
| b | Covenant | master-detail (contract list rail + detail pane) | Legal-ops contract review & redlining |
| c | Nudge | split workbench (question rail + live respondent preview) | Survey / form builder |

## HARD GATE — `node scripts/gate.mjs --target web --routes /dash-evolve/r12/<v>`

All three candidates passed on the **first attempt** — no 1-fix loop needed.

| v | static | sweep | a11y (gate) | perf (gate) | pass |
|---|---|---|---|---|---|
| a | 위반 0 | 전 폭 오버플로 0 | unavailable (non-hard-fail — see note) | unavailable (기록만) | ✅ |
| b | 위반 0 | 전 폭 오버플로 0 | unavailable (non-hard-fail — see note) | unavailable (기록만) | ✅ |
| c | 위반 0 | 전 폭 오버플로 0 | unavailable (non-hard-fail — see note) | unavailable (기록만) | ✅ |

> **Note (재현 — auto-dash-r11과 동일 선례)**: 이 샌드박스는 사전설치 Chromium(rev1194)이 root에서 `--no-sandbox` 없이 기동 불가해, gate.mjs 자체 dispatcher(고정 `--chrome-flags=--headless`, no `--no-sandbox`)가 호출하는 Lighthouse는 a11y/perf를 `unavailable`(비하드페일)로 판정한다. 실측치는 커밋 대상 판정에 쓰이지 않는 별도 수동 실행(`CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome` + `--no-sandbox`)으로 확보했다:

| v | a11y (실측) | perf (실측, 기록만) |
|---|---|---|
| a | 100 | 96 |
| b | 100 | 97 |
| c | 100 | 96 |

전 후보 a11y 실측 100 — color-contrast 등 어떤 audit도 실패 없음(`auditRefs` 전수 스캔 확인).
