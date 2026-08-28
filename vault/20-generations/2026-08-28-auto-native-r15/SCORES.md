# SCORES — auto-native-r15

target: native · round: auto-native-r15 · date: 2026-08-28

## 게이트 (1차 클린 — 1-fix 루프 미소모)

전역 `tsc`가 3후보 소스를 함께 컴파일하는 native 특성상 한 후보의 타입 에러가 나머지 전원을 `blockedBy`로 막을 수 있는데, 이번 라운드는 3후보 모두 1차에서 12/12(tsc·export·render·iframe × 3) 전 항목 통과했다.

| 후보 | 화면 | tsc | export | render | iframe |
|---|---|---|---|---|---|
| a — Seller Storefront | `evolve-r15-a` | ✅ | ✅ | ✅ | ✅ |
| b — Bundle Offer Builder | `evolve-r15-b` | ✅ | ✅ | ✅ | ✅ |
| c — Safe-Exchange Location Picker | `evolve-r15-c` | ✅ | ✅ | ✅ | ✅ |

render 검사 문자열: a="Active Listings" · b="Build a bundle offer" · c="Choose a Safe Exchange Location" (전부 소스 grep으로 사전 확인 후 게이트 실행).

## 소스 해시 (judge 판정 대상 고정)

- a: `a6bd615748b15dbb55fe8a915ae30bdb407ee540`
- b: `3ae40aedcabcc6468bf42c8331f4f66d9f9227aa`
- c: `91fb335184afcbedc07bb2505f5903d81f9b9ad9`

## 환경 메모 (재현용)
웹 라운드와 동일 — `CHROME_PATH=/opt/pw-browsers/chromium` + `PW_NO_SANDBOX=1` + `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`를 export한 상태에서 `node scripts/gate.mjs --target native ...` 실행. `native/` 자체 의존성(`npm install` in `native/`)이 이 세션 부트스트랩에서 별도로 필요했다 — 루트/`app/` 설치만으로는 부족.

## 등록
후보 3개 전부 designer가 `native/src/screens.ts`·`native/screens.json`을 직접 수정하지 않고 컴포넌트 파일만 작성 — 3개 병렬 designer가 같은 공유 레지스트리 파일을 동시에 편집하면 경쟁 조건으로 서로의 등록을 지울 위험이 있어(스킬 문서화 안 된 이 세션 고유 리스크), 오케스트레이터가 3후보 완료 확인 후 순차로 직접 등록했다.
