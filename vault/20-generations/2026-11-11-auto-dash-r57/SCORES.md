# auto-dash-r57 — SCORES

Freeze hash (post 1-fix, final judged state): `32efa4ad3e0f9bf99a0487228b67e665e6e43591`
(initial pre-fix freeze hash was `0d664c9019052903140ca5c50765d68638d1f8a7`)

| Candidate | route | static | lint | types | weights | sweep | focus | console | a11y | perf | pass |
|---|---|---|---|---|---|---|---|---|---|---|---|
| a — Ridgehaul (box plot + ticket feed, dark/green/grotesk) | 1-fix | 위반 0 | 위반 0 | 에러 0 | 3종 | **1차 실패→재통과** | 0건 누락 | 결함 0 | 100 | 97 | ✅ |
| b — Outlay (sunburst cost console, dark/cyan/wide) | 1-fix | 위반 0 | 위반 0 | 에러 0 | 3종 | **1차 실패→재통과** | 결함 0 | **1차 96→재통과 100** | 94 | — | ✅ |
| c — Trestle (process-map CI/CD console, dark/violet/mono) | 1차 클린 | 위반 0 | 위반 0 | 에러 0 | 3종 | 전 폭 0 | 0건 누락 | 결함 0 | 100 | 94 | ✅ |

## 1-fix detail

### a (Ridgehaul)
- 1차 `sweep` `table-overflow` (1280~1536px, div#0/table#1, by 1~14px) — `TicketTable.tsx`의 colgroup 6열 % 배분이 Status/Priority 배지(아이콘+텍스트)의 실제 최소폭보다 좁았다. 재배분(32/14/13/15/17/9 → 24/9/17/20/17/12)으로 각 배지 열에 실측 필요폭 확보.
- 재배분 과정에서 Team 열 텍스트("Network Ops"/"App Platform")가 `<td>`(비-flex 컨테이너) 안의 `<span className="truncate">`로 들어 있었는데, `truncate`가 `white-space:nowrap`을 주는 반면 span이 블록화되지 않아(td는 flex가 아님) 폭 제약이 적용되지 않고 다음 열로 **시각적으로 번져나가는** `cell-overlap`이 새로 노출됨(테이블 열 재배분과 무관한 별개 결함, 오버플로 수치 재게이트 중 발견). `className="block w-full truncate"`로 수정해 span을 블록화, 셀 폭에 실제로 clip되도록 해소.
- 재게이트 10/10 클린.

### b (Outlay)
- 1차 `sweep` `page-overflow` (390/1280/1350/1366px, by 13~37px, sel 없음=문서 전체) — `KpiRow.tsx`의 "Over budget" KPI 서브텍스트(`overBudget.map(c=>c.name).join(", ")`, amber-300)가 비-flex `<div className="mt-1 min-w-0">` 안의 `<span className="truncate">`였다. a와 **같은 결함 클래스**(span이 블록화 안 돼 truncate의 nowrap이 부모 폭을 무시하고 문서 밖으로 번짐) — 이번엔 테이블이 아니라 KPI 카드라 `cell-overlap`이 아니라 `page-overflow`로 나타남. `className="block w-full truncate ..."`로 해소.
- 1차 `a11y` 96 (`listitem` 감사 실패) — `HierarchyTree.tsx`의 하위 `<ul id={groupId} role="group">`이 `<li>` 자식을 감싸면서 `role="group"`으로 암묵적 `list` 역할을 덮어써, 그 안의 `<li>`들이 유효한 리스트 컨테이너 없이 뜨게 됨. 이 컴포넌트는 실제 ARIA tree(`role="tree"`/`treeitem"`) 패턴이 아니라 평범한 중첩 `<ul>` 디스클로저이므로 `role="group"`은 애초에 불필요 — 제거해 암묵적 `list` 역할 복원.
- 재게이트 10/10 클린(a11y 100).

### c (Trestle)
1차부터 클린 — 1-fix 불요.

## 공통 관찰
a·b가 독립적으로 **같은 결함 클래스**(비-flex 컨테이너의 `<span className="truncate">`가 블록화되지 않아 부모 폭 제약을 무시하고 번짐 — table-fixed 맥락에서는 `cell-overlap`, 일반 flow 맥락에서는 `page-overflow`로 표면화)를 냈다. 트리거는 서로 다르다(테이블 셀 vs KPI 카드), 발현 형태도 다르다(겹침 vs 문서 오버플로) — 결함 클래스 재현 판정 기준(결함 클래스 동일성, 트리거 무관)을 만족하므로 LEARN에서 L1 delta로 기록한다.
