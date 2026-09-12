# auto-native-r20 — SCORES

target: native · round: auto-native-r20 · date: 2026-09-12

frozen-state SHA1 (candidate sources, post 1-fix): `cb4189035e249f8934a01dda5e35fb8d2f05f44a` (pre-fix hash from candidate a's original `../../tokens` import; superseded by post-fix re-gate below — recorded for traceability of the 1-fix event)

## 1-fix loop
- **evolve-r20-a**: 1차 `tsc` 실패 — `TradeProposalScreen.tsx:39` `../../tokens` (틀린 상대경로, orchestrator 브리프의 오류였음 — 3후보 전원에게 같은 문구를 줬으나 b·c는 스스로 올바른 `../../../tokens`로 작성함). **1-fix 소모**: `../../../tokens`로 정정 후 재게이트 → 통과.
- **evolve-r20-b/c**: 1차 `tsc` 통과 — 다른 후보(a)의 전역 tsc 에러로 인한 `blockedBy` 표시만 있었고 자체 에러는 0건. 1-fix 미소모(native 전역 tsc 공유 규칙, GENERATION.md/SKILL §3).
- 환경 조치 (스킬 밖 절차, 후보 코드 무관): 사전 캐시된 Playwright 크로미움 리비전(1194)이 native의 `playwright-core`가 요구하는 리비전(1228)과 불일치해 render 게이트가 전원 실패 — `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`로 우회(native/scripts/validate.sh 기존 지원 변수, r16에서도 동일 조치 선례).

## 최종 게이트 (재게이트 후, 12/12 클린)

| 후보 | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r20-a (Trade Proposal) | ✅ | ✅ | ✅ | ✅ |
| evolve-r20-b (Link a payout method) | ✅ | ✅ | ✅ | ✅ |
| evolve-r20-c (Build a Saved Search) | ✅ | ✅ | ✅ | ✅ |

3후보 전원 생존 → §4 JUDGE 패널로 진행.

## 코드 표면 재사용 자진 고지
- 후보 b designer가 작업 중 금지목록에 있는 `listing/ListingCreateScreen.tsx`를 스타일 관례 참고 목적으로 전문 열람했다고 자진 신고했다. 결과 보고에 따르면 구조적·어휘적 재사용은 없었고(그 파일이 밴드 패턴을 쓰지 않는 폼形 화면이라 재사용할 밴드 어휘 자체가 없음), b가 실제로 피하려 한 것은 `verification`/`disputes` 계열의 `bandBlocked/bandReady/bandDone`·"Tap to go there" 어휘였다. 판정에 영향 없음으로 판단하고 §0-0 편차 고지와 별개로 여기 기록만 남긴다.
