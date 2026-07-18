# 에셋 + 풍부한 인터랙션 (타깃 차등 + 기계 게이트 확장) — 설계

- 날짜: 2026-07-19
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 선행: `2026-07-18-dual-target-evolution-design.md`(이중 타깃 자율 루프 — 가동 중)의 생성 기준 확장. 자율 라운드가 에셋·인터랙션을 더 적극적으로 쓰게 하되, 기존 하드 제약(결정론·서비스급 절제·a11y·하이드레이션)과의 충돌을 기계 게이트로 관리.

## 1. 목표

자율 라운드 생성물이 ① 생성형 SVG/CSS 에셋과 외부 이미지를 적극 활용하고 ② 인터랙션을 데코가 아니라 정보·전환 장치로 풍부하게 쓰도록 기준을 상향한다. 단 타깃별 절제 수위를 다르게 두고, 새로 들어오는 리스크(이미지 비결정·CLS·번들·연출 과잉)는 기계 하드게이트로 막는다.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 에셋 범위 | 인라인 생성형 SVG/CSS (기본·무제한) + 외부 이미지/CDN (규율 있게) |
| 타깃 적용 | 타깃별 차등 수위 (landing 표현 상한 없음 / dash 서비스급 절제 유지하되 도메인 시각화·인터랙션 밀도 상향) |
| 안전 장치 | 기계 하드게이트 확장 (static-check 이미지 규칙 3종 + judge 렌즈 확장) |

## 3. 이원 에셋 엔진 (both 타깃, 수위 차등)

- **생성형 SVG/CSS** (기본, 제한 없음): 코드로 그리는 패턴·웨이브·기하·데이터 시각화·마스크·그라데이션·블렌드 모드. 외부 파일 0, 결정론 안전(SVG 삼각함수 좌표는 기존대로 소수 2자리 반올림 — 하이드레이션). dash의 도메인 고유 시각화를 여기서 더 밀어붙인다.
- **외부 이미지** (표현용, §5 규칙 준수): Unsplash 등 CDN 허용. 히어로·제품샷·아바타 등. 고정 URL·크기 명시·alt 필수.

## 4. 인터랙션 상향 — 타깃 차등

- **landing** (표현 상한 없음): 스크롤 연동 연출·시차(parallax)·키네틱 타입·히어로 이미지·제품샷·`framer-motion` 적극 활용(현재 설치돼 있으나 미활용 자산). 최소 인터랙션 4종 이상.
- **dash** (서비스급 절제 유지): 연극적 발광·스캔라인·그레인은 여전히 금지. 대신 도메인 고유 시각화의 인터랙션 밀도를 올린다 — 크로스헤어 툴팁·드릴다운·선택→다중 위젯 동기화·라이브 미니 차트. 최소 인터랙션 4종 이상(기존 3종에서 상향).
- **공통 (결정론 + a11y)**: 모든 모션은 step 카운터·인터랙션 state로 구동하고 `Math.random`/`Date.now`/인자 없는 `new Date()` 금지(랜딩 스모크 SCANLINE이 이미 이 패턴 — setInterval step 카운터로 순차 재생). `motion-reduce` 게이팅 필수(진입 opacity:0 잔존 금지).

## 5. static-check 신규 이미지 규칙 (기계 하드게이트)

`scripts/dash-static-check.mjs`에 규칙 3종 추가 (기존 4종 + 신규 3종 = 7종):

1. **`no-raw-img`**: 원시 `<img ` 태그 사용 금지 → `next/image`의 `<Image>` 강제(자동 LCP 우선순위·레이지·크기 최적화). 위반 문구: "원시 img 금지 — next/image Image 사용(LCP·CLS)".
2. **`img-needs-alt`**: `<Image` 또는 `<img` 여는 태그에 `alt=` 부재 시 위반(a11y — 스크린리더). 위반 문구: "이미지 alt 누락 (a11y)".
3. **`no-next-image-unopt`**: `<Image ... unoptimized>` 등 최적화 우회 금지 — CLS/LCP 이점을 무력화. 위반 문구: "unoptimized 금지 — 최적화 우회는 CLS/LCP 이점 상실".

이미지 src의 비결정 선택(`Math.random`으로 배열 인덱싱 등)은 기존 `no-random` 규칙이 이미 커버하므로 별도 규칙 불요. `width/height/fill` 누락 CLS 검사는 정규식 신뢰도가 낮아 **judge 렌즈 + sweep의 레이아웃 관찰**로 위임한다(기계는 확실한 것만 — 과탐 방지).

sweep·a11y·reduced-motion 하드게이트는 그대로. next/image 도입으로 이미지엔 alt·크기가 구조적으로 유도된다.

## 6. judge 렌즈 확장

두 타깃 judge 렌즈2("상용 완성도")에 심사 축 명시(SKILL 파라미터 표 + brief 반영):
> 에셋·인터랙션 풍부도 — 생성형/이미지 에셋을 의미있게 썼는가, 인터랙션이 데코가 아니라 정보·전환에 기여하는가, 그러면서 타깃 절제선(dash=서비스급 / landing=표현적)을 지켰는가. **장식 과잉·의미없는 모션은 감점**(v2세대 전원 탈락 사유 = 글로시·맥시멀 장식↑ 정보밀도↓ 재발 방지).

## 7. 문서·배선 변경

| 파일 | 변경 |
|---|---|
| `scripts/dash-static-check.mjs` (+test) | 이미지 규칙 3종 추가(no-raw-img·img-needs-alt·no-next-image-unopt) |
| `vault/00-principles/dash-brief-v3.md` | dash 에셋·인터랙션 조항(생성형 시각화 상향·인터랙션 4종·서비스급 절제 유지·이미지 규율) |
| `vault/00-principles/design-principles.md` | landing 에셋·인터랙션 조항(표현 상한 없음·framer-motion·스크롤 연출·히어로 이미지) |
| `.claude/skills/dash-evolve/SKILL.md` | 타깃 파라미터 표에 "에셋 수위" 행 + HARD GATE에 이미지 규칙 3종 언급 + judge 렌즈2 확장 |
| `app/next.config` | 외부 이미지 도메인 허용(images.remotePatterns — Unsplash 등) |

## 8. CSP·갤러리 정합

`/gallery`는 후보를 iframe으로 로드한다. 외부 이미지가 iframe 안에서 렌더되는지 확인 — next/image는 same-origin `/_next/image` 프록시로 서빙되므로 CSP·오프라인 이슈가 원시 CDN 링크보다 낮다. 스모크에서 갤러리 iframe 렌더 실증.

## 9. 검증

1. `npm test` — static-check 신규 규칙 테스트 3종+ 포함 전체 통과.
2. `node scripts/dash-static-check.mjs` — 기존 생존작(예: d29)에 신규 규칙 오탐 0(회귀).
3. **로컬 스모크 2라운드** (evolve/dash): dash 강제 1 + landing 강제 1 — 각 후보가 이미지·생성형 에셋·상향된 인터랙션을 쓰면서 하드게이트(이미지 규칙 포함) 통과, 갤러리 iframe에서 이미지 렌더 확인, 정본 불변식 0 diff.
4. next.config remotePatterns 적용 후 `npx next build` 통과.

## 10. 비범위

- 로컬 에셋 디렉토리(`public/` 큐레이션 이미지) — 사용자 미선택.
- Lottie·외부 애니메이션 라이브러리 추가(framer-motion만 활용).
- 사운드·비디오 에셋.
- 기존 생존작(/dash·/v)의 소급 개편 — 신규 라운드부터 적용.
