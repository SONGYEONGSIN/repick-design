# auto-dash-r40 — SCORES

하드게이트 결과 (1차). 각 후보 개별 라우트 실행(`node scripts/gate.mjs --target web --routes /dash-evolve/r40/<v>`).

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| a (Isobar) | ✓ | ✓ | ✓ | ✓ | 3종 | ✓ 오버플로 0 | ✓ 0건 | ✓ 0건 | ✓ 97 | 61 | **PASS (1차, 수정 불요)** |
| b (Calibre) | ✓ | ✓ | ✗ error 1 | 3종 | ✗ cell-overlap 1264px | ✗ 1건 | ✗ 13건 hydration | ✗ 100·label-content-name-mismatch | 49 | 1-fix 진행 중 |
| c (Tracewell) | ✓ | ✓ | ✗ error 5 | 3종 | ✗ 15건 overflow+overlap | ✗ 37건 | ✓ 0건 | ✗ 96·label-content-name-mismatch·target-size | 58 | 1-fix 진행 중 |

## 근본원인 (오케스트레이터 직접 디버깅)

- **b 하이드레이션 미스매치 (13건)**: `radar-chart.tsx`의 SVG `<title id={useId()}>` — 이 Next.js 버전이 SVG 내부 `<title>` 태그도 문서 타이틀 관리 대상으로 취급해 SSR에서 빈 텍스트로 렌더(`curl`로 raw HTML 확인: `<title id="...">빈칸</title>`), 클라이언트는 실제 텍스트로 하이드레이트 — 불일치. 처방: SVG `<title>` 완전 제거, `aria-label`을 `<svg>`에 직접.
- **b/c 공통 focus-invisible**: `outline-none` + `focus-visible:outline-*` 조합이 이 레포 Tailwind v4 세팅에서 `--tw-outline-style: none`을 뒤 유틸리티가 못 지워 완전 무효화([[page-brief-core]] §2 기존 경고 그대로 재현). b는 radar-chart.tsx 한 곳만, c는 4개 파일에 공유된 className 상수라 37건 전원 재현.
- **c a11y**: Lighthouse 직접 재실행으로 노드 특정 — `label-content-name-mismatch`는 계정메뉴 버튼 가시텍스트 "JL" ↔ aria-label "Account menu for Jordan Lee" 불일치(이 레포 기존 "MC"/"Maya Chen" 사례와 동일 결함 클래스 재발). `target-size`는 "Priority"/"Age" 정렬헤더 버튼 16px 높이+인접 간격 1.4px.
- **c sweep**: process-map 컨테이너 min-w 미스코프(desktop 1264px에서 162px 오버플로) + path-summary-table의 `min-w`가 1536px까지도 무조건 적용되어 6px 잔존.

1-fix 지시를 두 후보 designer에게 각각 전달, 재게이트 대기 중.
