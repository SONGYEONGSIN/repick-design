# SCORES — auto-landing-r16

target: landing · round: auto-landing-r16 · date: 2026-08-28

## 1-fix — 전 후보 동일 원인 (오케스트레이터 귀책)

1차 게이트에서 **3후보 전원**이 `focus` 게이트에서 하드페일했다(a 10건 · b 8건 · c 9건, 전부 `[default] 포커스해도 보이는 표시가 생기지 않는다`). 원인은 후보 코드가 아니라 designer 프롬프트 — GENERATE 단계에서 오케스트레이터가 "안전한 패턴"이라고 지시한 `focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[accent]`가 실은 **정본이 경고한 바로 그 죽은 관용구**(`outline-none`이 뒤의 `focus-visible:outline`을 취소한다, [[page-brief-core]] §2)였다 — 순서를 반대로 이해하고 지시했다. 세 후보 모두 지시를 성실히 따라 똑같이 걸렸다.

**수정**: `focus:outline-none `substring을 세 후보 전 파일에서 제거(오케스트레이터가 직접 — 세 후보의 원인이 동일한 기계적 오류라 designer 왕복 없이 정정). `focus-visible:outline-*` 유틸리티만 남기니 즉시 통과. 각 후보의 1-fix 기회를 이걸로 소진.

## 후보별 게이트 (1-fix 후, 전원 통과)

| 후보 | route/types/static/lint | weights | sweep | focus | console | a11y | perf | pass |
|---|---|---|---|---|---|---|---|---|
| a — Quarterly Disclosure | 0 | 3종(렌더) | 오버플로 0 | 0건 누락 | 결함 0 | 100 (bf-cache만) | 63 | ✅ |
| b — Comparables Radius | 0 | 3종(렌더) | 오버플로 0 | 0건 누락 | 결함 0 | 100 (bf-cache만) | 55 | ✅ |
| c — AI Redline | 0 | 3종(렌더) | 오버플로 0 | 0건 누락 | 결함 0 | 100 (bf-cache만) | 64 | ✅ |

`bf-cache`는 승격 감사 목록(heading-order·definition-list·target-size·skip-link·color-contrast·button-name·label-content-name-mismatch)에 없어 기록만 — 하드페일 아님.

## 소스 해시 (1-fix 반영 후, judge 판정 대상 고정)

- a: `ccb1d54e2dcc967fae94e5fafc09629fb3d4c5e6`
- b: `e124177bd503fdaeb5c28b6e612b30ec1c4357e7`
- c: `5d0acdc441e04d6293d23f54a8dd3f25088e4003`

## 환경 메모 (재현용)
Lighthouse가 이 샌드박스에서 기본 설정으론 `unavailable`을 반환했다 — 원인은 (1) Chrome 실행 파일 미지정 (2) sandbox 권한 부재. `CHROME_PATH=/opt/pw-browsers/chromium`(사전 설치된 Playwright chromium 재사용) + `PW_NO_SANDBOX=1`(`gate.mjs`가 이 값을 보면 `--no-sandbox` chrome-flag를 추가) + `PW_CHROMIUM_PATH`(Playwright 자체 브라우저)를 함께 export하면 정상 동작한다. 이 세 환경변수는 스킬 문서에 없는 이 샌드박스 고유 값이다.
