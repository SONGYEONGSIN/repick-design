# auto-native-r9 — 하드게이트

**소스 해시(동결)**: `4ba146ab345cc452d7e14c72f59f776b49e8703c`
게이트·스크린샷·judge 가 같은 산출물을 봤다는 증거. 판정 중 이 값이 바뀌면 라운드 무효.

**명령**: `node scripts/gate.mjs --target native --screens evolve-r9-a evolve-r9-b evolve-r9-c`

| 후보 | 화면 | tsc | export | render | iframe | 결과 |
|---|---|---|---|---|---|---|
| a | Meetup spot picker (공간 캔버스 + 바텀시트) | 통과 | 통과 | 통과 | 통과 | **생존** |
| b | Seller trust profile (정체성·통계) | 통과 | 통과 | 통과 | 통과 | **생존** |
| c | Meetup slot grid (날짜 × 시간대 2축) | 통과 | 통과 | 통과 | 통과 | **생존** |

**12/12 1차 통과 · violations 0 · 1-fix 루프 미발동.**

## 게이트가 이번에 못 본 것

- **폰트 웨이트** — native 게이트는 4단계뿐이라 웹의 `weights` 관문이 없다. 후보 c 가 `page-brief-core` §3("정확히 3종")을 따르면서 **기존 native 화면들이 `"800"` 을 흔히 쓰는 선례와 어긋난다**고 자진 신고했다. 어느 쪽이 정본인지 아무도 재고 있지 않다 — §6 질문 대상.
- **`tabular-nums` + ₩ 중첩** — `r6/c` L2 규칙은 렌더 실측으로만 확인된다. 세 후보 모두 소스 기준으로는 안전을 주장했고(a 는 ₩ 를 아예 0개로 두어 회피), 390px 샷에서 확인한다.
- **포커스·대비** — 웹 `focus`·`a11y` 관문에 해당하는 것이 native 에 없다. 후보들이 `accessibilityRole`·`accessibilityState`·live region 을 스스로 걸었고 judge 렌즈1 이 대조한다.

## 오케스트레이션 사고 — designer 3명 전원이 도구 호출 31~34회에서 중단

세 designer 가 **파일은 완성한 채 보고 없이** 멈췄다(a 32회 · b 34회 · c 31회). 스킬 §4 가 judge 에 대해 기록해 둔 `maxTurns: 10` 소진 패턴과 같은 모양이 designer 에서도 나타난다. `SendMessage` 로 이어 돌려 셋 다 완주했고 **재디스패치는 0회** — 스킬의 "이어 돌려라, 새로 띄우지 마라"가 designer 에도 그대로 유효했다.

또 하나: **designer 에이전트에 Bash 가 없다**(`Read·Grep·Glob·Skill·Write·Edit`). 프롬프트에 넣은 "`tsc --noEmit` 직접 확인" 은 실행 불가능한 지시였고, 세 designer 모두 그것을 정직하게 보고한 뒤 `.d.ts`·레포 선례 대조로 대체했다 — 그 대체 작업이 턴 예산을 상당히 태웠다. 타입 검사는 게이트 1단계가 실측하므로 designer 프롬프트에서 뺀다.
