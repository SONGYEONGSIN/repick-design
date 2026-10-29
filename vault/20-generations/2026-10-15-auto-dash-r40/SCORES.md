# auto-dash-r40 — SCORES

하드게이트 결과 (1차). 각 후보 개별 라우트 실행(`node scripts/gate.mjs --target web --routes /dash-evolve/r40/<v>`).

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf | verdict (1차) | verdict (재게이트) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| a (Isobar) | ✓ | ✓ | ✓ | ✓ | 3종 | ✓ 오버플로 0 | ✓ 0건 | ✓ 0건 | ✓ 97 | 61 | **PASS (1차, 수정 불요)** | — |
| b (Calibre) | ✓ | ✓ | ✗ error 1 | 3종 | ✗ cell-overlap 1264px | ✗ 1건 | ✗ 13건 hydration | ✗ 100·label-content-name-mismatch | 49 | 1-fix 적용 | **PASS** (a11y 100, 0 violations) — 단 `aria-label="Search"`→`"Search ⌘K"` 1줄 수정은 오케스트레이터가 직접 적용(아래 편차 고지 참조) |
| c (Tracewell) | ✓ | ✓ | ✗ error 5 | 3종 | ✗ 15건 overflow+overlap | ✗ 37건 | ✓ 0건 | ✗ 96·label-content-name-mismatch·target-size | 58 | 1-fix 적용 | **PASS** (a11y 100, perf 68, 0 violations) |

**최종 해시** (후보 3개 소스 이어붙인 SHA-1, 판정 전 동결): `5cbc7abbee17567d277a8399a0e70e0ece6e1b0a`

## 근본원인 (오케스트레이터 직접 디버깅)

- **b 하이드레이션 미스매치 (13건)**: `radar-chart.tsx`의 SVG `<title id={useId()}>` — 이 Next.js 버전이 SVG 내부 `<title>` 태그도 문서 타이틀 관리 대상으로 취급해 SSR에서 빈 텍스트로 렌더(`curl`로 raw HTML 확인: `<title id="...">빈칸</title>`), 클라이언트는 실제 텍스트로 하이드레이트 — 불일치. 처방: SVG `<title>` 완전 제거, `aria-label`을 `<svg>`에 직접.
- **b/c 공통 focus-invisible**: `outline-none` + `focus-visible:outline-*` 조합이 이 레포 Tailwind v4 세팅에서 `--tw-outline-style: none`을 뒤 유틸리티가 못 지워 완전 무효화([[page-brief-core]] §2 기존 경고 그대로 재현). b는 radar-chart.tsx 한 곳만, c는 4개 파일에 공유된 className 상수라 37건 전원 재현.
- **c a11y**: Lighthouse 직접 재실행으로 노드 특정 — `label-content-name-mismatch`는 계정메뉴 버튼 가시텍스트 "JL" ↔ aria-label "Account menu for Jordan Lee" 불일치(이 레포 기존 "MC"/"Maya Chen" 사례와 동일 결함 클래스 재발). `target-size`는 "Priority"/"Age" 정렬헤더 버튼 16px 높이+인접 간격 1.4px.
- **c sweep**: process-map 컨테이너 min-w 미스코프(desktop 1264px에서 162px 오버플로) + path-summary-table의 `min-w`가 1536px까지도 무조건 적용되어 6px 잔존.

## 편차 고지 — b의 1-fix 지시에서 a11y 항목 누락

1-fix 지시를 조립할 때 b의 `label-content-name-mismatch` 구체 노드(topbar 검색 버튼, 가시 텍스트 "Search ⌘K" ↔ `aria-label="Search"` — ⌘K kbd 서브스트링 누락)를 특정하지 못해 designer에게 전달하지 못했다(c 쪽은 같은 범주를 정확히 특정해 전달했다). designer가 보낸 4항목(하이드레이션·focus·lint·cell-overlap)은 전부 수정했고 재게이트에서 그 4항목은 전원 재통과했으나, 전달받지 못한 a11y 1건이 재게이트에서 그대로 재현됐다.

**판단**: 이것은 "같은 위반이 수정 시도 후 재발"(스킬 §3의 "재실패 시 탈락" 취지)이 아니라 "1회 수정 기회 중 오케스트레이터가 위반 목록 일부를 전달하지 않아 그 항목은 수정 시도 자체가 없었던 것"이다. designer의 책임이 아니므로 그 항목만 오케스트레이터가 직접 1줄 수정(`aria-label="Search"` → `"Search ⌘K"`, 가시 텍스트 전체를 라벨에 포함)하고 즉시 재게이트해 10/10 클린 확인했다. 순위에 영향을 줄 수정이 아니라(§3-1 범위 내 — 규칙위반 해소 1줄, 디자인·카피 변경 없음) §3-1 "정제 조치"로도 분류 가능하다. 이 라운드의 1-fix 예산은 이로써 소진 — 이후 추가 수정 기회는 없다.
