# auto-landing-r13 — HARD GATE (§3)

- 일자: 2026-08-20
- 타깃: landing · 라운드 r13
- 라우트: `/landing-evolve/r13/{a,b,c}`
- 게이트: `node scripts/gate.mjs --target web --routes /landing-evolve/r13/<v>`
- 판정 동결 해시 (1-fix 이후, judge·스크린샷이 본 상태): `9607fc0885ed662895e1fb1e35bdd43d9fc7bf8f`
  - 생성 직후 1차 해시: `d49f65420c30bccfc0a88151e670bb45b477acc7` (a·b의 1-fix 전)

## 후보 개요

| 후보 | 컨셉 | 입력축 × 출력축 | 테마 | 액센트 | 디스플레이 활자 |
|---|---|---|---|---|---|
| a | Radar Match Studio — 5축 레이더 폴리곤 겹침이 곧 match% | 기준 칩 토글+가중 세그먼트 × 다축 폴리곤 오버랩 | dark | amber (`#fbbf24` 텍스트 / `#b45309` 채움) | grotesk |
| b | Spec Grid — 카드마다 가격 궤적 스파크라인, 예산 슬라이더가 전체 재랭크 | 연속 예산 슬라이더 × 스파크라인+매치링 그리드 | light | emerald (`#047857`) | mono |
| c | Priority Reorder Board — 우선순위 순서 재배열이 보드를 실시간 재랭크 | 서수 reorder × 근거문장 동반 랭킹 보드 | dark | sky (`#38bdf8` 텍스트 / `#0369a1` 채움) | 없음 (Pretendard) |

## 게이트 결과 (최종 — 전원 통과)

| 관문 | a | b | c |
|---|---|---|---|
| route | pass · 응답 OK | pass · 응답 OK | pass · 응답 OK |
| types | pass · 에러 0 | pass · 에러 0 | pass · 에러 0 |
| static | pass · 위반 0 | pass · 위반 0 | pass · 위반 0 |
| lint | pass · 위반 0 | pass · 위반 0 | pass · 위반 0 |
| weights | pass · 3종 (렌더 실측) | pass · 3종 (렌더 실측) | pass · 3종 (렌더 실측) |
| sweep | pass · 전 폭 오버플로 0 | pass · 전 폭 오버플로 0 | pass · 전 폭 오버플로 0 |
| focus | pass · 누락 0건 | pass · 누락 0건 | pass · 누락 0건 |
| console | pass · 결함 0 (메시지 65) | pass · 결함 0 (메시지 105) | pass · 결함 0 (메시지 93) |
| a11y | **93 → 100** (1-fix) | **98 → 100** (1-fix) | pass · 100 (1차 통과) |
| perf | 51 (기록만) | 53 (기록만) | 52 (기록만) |

## 1-fix 루프 기록 (§3)

**a — a11y 93, `list` + `listitem` 감사 실패 (하드페일).**
`ValueSection.tsx`의 3분할이 `<ol>` 직계 자식으로 `<Reveal>`(= `motion.div`)을 두고 그 안에 `<li>`를 넣어, 리스트 컨테이너가 `li` 아닌 요소를 직접 담고 `li`가 `ol` 직계가 아니게 됐다. framer-motion 래퍼를 `li` **안쪽**으로 옮겨 `ol > li > Reveal` 로 평탄화(시각·모션 변화 없음). 재게이트 **a11y 100 · 전 관문 통과**.
— [[page-brief-core]] §1의 `definition-list` 승격 사례(`dl > div > (dt,dd)` 평탄화)와 **같은 결함 클래스**다: 모션/아이콘 래퍼가 리스트 시맨틱을 한 겹 깨뜨리는 형태. 이번엔 `dl`이 아니라 `ol`/`li`에서 났고 원인은 아이콘이 아니라 **스크롤 리빌 래퍼**다.

**b — a11y 98, `heading-order` 감사 실패 (점수는 통과인데 승격 감사라 하드페일).**
히어로 `h1` 다음에 스펙 그리드의 카드 제목 `h3`가 바로 와서 레벨을 건너뛰었다(그리드 영역 자체에 h2가 없었다). 그리드 앞에 `<h2 className="sr-only">Matched listings</h2>`를 넣어 레벨을 이었다(시각 변화 없음). 재게이트 **a11y 100 · 전 관문 통과**.
— [[page-brief-core]] §1 각주가 적은 "점수 95는 절대 규칙을 강제하지 못한다"의 실사례다. **98점으로 통과하면서 `heading-order`를 명시 실패**했고, 승격 감사 목록이 아니었다면 이 결함은 그대로 판정에 갔다.

**c — 1차 전 관문 통과 (1-fix 0회).**

## 환경 메모

- 사전설치 Chromium rev1194(`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`)를 `PW_CHROMIUM_PATH`·`CHROME_PATH`·`PW_NO_SANDBOX`로 기동해 sweep·focus·a11y·perf 전부 실측했다. `npx playwright install chromium`은 이 환경에서 다운로드가 실패한다(rev1228 요구).
- 샌드박스 네트워크가 외부 이미지 로드를 차단하므로 원격 사진은 전 후보에서 깨진 상태로 렌더된다 — **환경 제약이며 감점 사유가 아니다**(judge에 사전 고지). 세 후보 모두 컨테이너 aspect-ratio+배경을 예약하고 증명(match%·등급·인증·할인)을 사진과 분리된 행에 뒀으므로 이 조건에서도 증명은 판독 가능하다.
