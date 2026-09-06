# SCORES — auto-dash-r25

Freeze-state hash (all 3 candidates, post 1-fix attempts): `a08698022a4ea84522bfcf3bc96ebacf0e03fda9`

| candidate | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a — Parity (dense reconciliation grid) | ok | 에러 0 | 위반 0 | 위반 0 | 3종 | 1차 **오버플로 50**(390px cell-overlap 전역, `table-fixed`가 `<td>` 개별 `min-w`를 무시해 실제로는 아무 안전장치가 없었음) + target-size 1건 → 1-fix(테이블 자체에 `min-w-[900px]` 부여 + SortHeader 버튼에 `min-h-6`) → **오버플로 0** | 누락 0 | 결함 0 | 1차 97(target-size)→1-fix로 **100** | 53 |
| b — Payline (hero-number payout console) | ok | 에러 0 | 위반 0 | 위반 0 | 3종 | 1차 오버플로 5(390px cell-overlap 3건 + 1264px table-overflow 1px 2건, 같은 `table-fixed`+`min-w` 무시 결함) → 1-fix(테이블에 `min-w-[480px]`+래퍼 `min-w-0` 부여)로 cell-overlap 0 해소했으나 **1264px table-overflow 1px 재실패(2건)** → 스킬 §3 규칙(재실패 시 탈락, 사유 무관)에 따라 **탈락, 판정 미진입** | 누락 0 | 결함 0 | 100(1차) | 54 |
| c — Portage (logistics dispatch map) | ok | 에러 0 | 위반 0 | 위반 0 | 3종 | 1차 **table-overflow** 1264px(60px)·1280px(44px) — `<table min-w-[960px]>`가 두 컬럼 절반폭 섹션이 아니라 전폭 섹션에 있었음에도, 사이드바+카드 패딩을 뺀 실가용폭(1264px→900px · 1280px→916px)이 설계자 자체 계산 최소합(900px)+안전마진(960px)보다 좁아 데스크톱에서 강제 가로 스크롤 발생(금지 규칙 위반) → 1-fix(`min-w-[960px]`를 `max-lg:min-w-[960px]`로 전환 — 데스크톱은 %열 배분만으로 유동, 모바일만 최소폭 안전장치 유지) → **오버플로 0** | 누락 0 | 결함 0 | 100(1차) | 59 |

**3후보 중 2후보(a·c) 생존, b 탈락(1-fix 재실패).** 생존 2후보로 판정 진행.

공통 결함 클래스 메모(LEARN 후보): 이번 라운드 3후보 전원이 `table-fixed`+`min-w`를 셀 개별 요소(`<td>`)나 헤더(`<th>`)에만 부여했고, 그 자체로는 `table-fixed` 레이아웃 알고리즘이 첫 행 이후 셀의 `min-width`를 무시하므로 실효가 없었다 — 안전장치는 반드시 `<table>` 요소 자체에 `min-w`를 걸어야 작동한다. a·b는 모바일 겹침으로, c는 정반대로 데스크톱 강제스크롤로 드러났다(같은 근본오해가 정반대 증상을 냈다).
