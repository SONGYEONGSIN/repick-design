# Candidate c — "Pulseband"

API reliability / latency-monitoring console. Dark / rose / `--font-display-mono`.

**Macro skeleton**: hero + single dominant visualization (brief's explicitly-encouraged bucket),
no nav rail beyond the standard sidebar/KPI chrome, no master-detail, no feed. The dominant
widget is a latency-distribution histogram with permanently-visible p50/p95/p99 markers
(satisfying `dash-brief-v3`'s "단일 지배 시각화 완성도" — key values as always-on text, not
hover-only). Distinct chart type and distinct domain from this catalog's recent single-dominant-
chart rounds (`r55`'s slope chart, `r57`'s process-map) and from this round's own candidates a
(calendar table) and b (chronological feed).

**Interactions (5, ≥4 required)**:
1. Hover or focus a histogram bar → a live `aria-live` status line above the chart shows that
   bin's exact count (no floating tooltip — same overflow-avoidance lesson as a/b).
2. Period toggle (1h / 24h / 7d) — real segmented control, swaps the histogram's bin data, the
   three KPI tiles, and the always-visible percentile readout together.
3. Click an endpoint-table row → "focuses" that endpoint: draws a dashed reference line + marker
   on the histogram at the bin containing that endpoint's own p99 (not a dataset swap — the
   aggregate histogram stays the aggregate, the endpoint's tail is annotated *against* it), and
   swaps the 4th KPI tile to that endpoint's own p99 + path. Two independently-scoped reactions
   (chart annotation, one KPI tile), not a full-page recompute.
4. Sortable endpoint table (path / RPS / p99 / error rate, `aria-sort`).
5. ⌘K command palette — focus an endpoint, change the period, or jump to the table.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: "선택→다중 위젯 동기화"의 파급을 어떻게 가를 것인가 — 세 후보 모두
   같은 선택-동기화 요구를 받지만, 엔드포인트 하나를 고르는 것이 집계 히스토그램 자체를 바꿀
   이유는 없다(원본 데이터가 집계 분포이지 엔드포인트별 원시 분포가 아니다).
   **무엇으로 정했나**: 선택은 히스토그램을 **교체하지 않고 주석을 얹는다** — 그 엔드포인트의
   p99가 속하는 막대 중심에 점선 마커를 그린다. KPI 4번 타일만 그 엔드포인트의 값으로 바뀐다.
   **왜**: 데이터 모델이 지지하지 않는 재계산을 지어내지 않는 쪽을 택했다 — "집계 vs 개별"이라는
   실제 통계적 구분을 시각적으로도 유지하는 것이 거짓 정밀도(가짜 엔드포인트별 히스토그램)보다
   정직하다.

2. **무엇을 정해야 했나**: 막대그래프 바닥의 구간 시작값 라벨(예: "0", "50", "100"ms)이 다크
   표면 위에서 어떤 회색조여야 하는가 — 브리프는 "다크 zinc-400 하한"만 적어 두고 SVG `fill`
   속성에도 같은 규칙이 적용되는지는 명시하지 않는다.
   **무엇으로 정했나**: `fill-slate-400`(해당 캐털로그의 다크 하한과 동일한 계열)을 그대로
   SVG 텍스트에 적용했다. 이번 라운드의 candidate a가 동일 결함(`text-slate-500`을 다크 표면에
   써서 Lighthouse `color-contrast`로 처음 걸림)을 먼저 내고 고쳤으므로, 같은 세션에서 작성된
   이 후보는 그 교훈을 처음부터 반영했다.
   **왜**: 같은 세션의 이전 발견을 다음 후보에 즉시 적용하는 것이 사후에 같은 자리에서 또
   걸리는 것보다 싸다.

3. **무엇을 정해야 했나**: 집계 히스토그램 bin 경계(0–50, 50–100 … 500–1000ms)의 개수와 폭을
   브리프가 지정하지 않는다.
   **무엇으로 정했나**: 7개의 불균등 폭 bin(값이 커질수록 폭을 넓힘 — 로그 스케일형 비닝)을
   썼다 — 레이턴시 분포는 전형적으로 우측 꼬리가 길어 균등 폭 bin이면 마지막 몇 개 칸이
   거의 항상 비거나 극단값 하나에 지배된다.
   **왜**: `charts.catalog.md`의 "강도/밀도 → Heatmap, 셀 <20" 권고를 막대그래프형 히스토그램에
   맞게 재해석한 것 — 칸 수를 적게 유지하면서도 각 칸이 읽을 수 있는 정보를 담게 했다.
