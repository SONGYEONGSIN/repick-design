# auto-landing-r15 — SCORES

target: landing · round: auto-landing-r15 · date: 2026-08-23

동결 해시(1차 게이트 직전): `708dcbd93bc7c4804eb787e18bb11c92fa664f7c`
1-fix 후 동결 해시: `1fd34756b9d05af35c522b4761ae05920825d9d7` (a의 focus 수정 반영, 예상된 변경)

## 1차 게이트 — 1건 실패
| 관문 | 결과 |
|---|---|
| route | pass — 3개 라우트 200 |
| types | pass — 에러 0 |
| static | pass — 위반 0 |
| lint | pass — 위반 0 |
| weights | pass(기록만) — 4종(400,500,600,800) |
| sweep | pass — 전 폭 오버플로 0 |
| **focus** | **fail — 1건** |
| console | pass — 결함 0 |
| a11y | pass — 100 |
| perf | pass — 42 |

**위반**: `/landing-evolve/r15/a` `input#5`(협상가 상한 스테퍼 숫자 입력) — `outline-none`을 걸었으나 `focus-visible:outline-2` 커스텀 링과 함께 케이스가 겹쳐 실제로는 아무 픽셀도 안 그려짐(page-brief-core §2 "outline-none 단독 금지"의 변형 — 여기선 단독이 아니라 **먼저 건 outline-none이 뒤의 focus-visible outline과 같은 유틸리티 그룹 안에서 충돌**했을 가능성). `Negotiation.tsx:105` className에서 `outline-none` 제거로 1-fix.

## 1-fix 후 — 10/10 전 항목 통과
| 관문 | 결과 |
|---|---|
| focus | pass — 포커스 표시 0건 누락 |
| (나머지 9관문) | 1차와 동일하게 pass 유지(재확인) |

1-fix 루프 1회 사용, 재실패 없음. 정제 조치는 §3-1 대상 아님(1-fix는 §3의 정상 절차, 판정 전 조치라 정제 조치 절 불요).

## 환경 고유 조치
`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1` (r11~r14 선례와 동일 계열). dev 서버는 이번 실행에서 이 라운드가 직접 기동(3100, Next.js 16.2.10 Turbopack).
