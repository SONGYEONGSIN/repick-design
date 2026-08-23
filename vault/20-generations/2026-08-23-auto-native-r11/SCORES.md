# auto-native-r11 — 하드게이트

**판정 대상 해시**: `1087741bab0a63a6cd9efd618b7084f6ee9523ad` (c 1-fix 후 재동결)
1-fix 이전: `18918bba7e4a9d62b445883d9b4b623ee9176006`

**명령**: `node scripts/gate.mjs --target native --screens evolve-r11-a evolve-r11-b evolve-r11-c`

| 후보 | 화면 | tsc | export | render | iframe | 결과 |
|---|---|---|---|---|---|---|
| a | Payout statement | 통과 | 통과 | 통과 | 통과 | 생존 |
| b | Shipping method picker | 통과 | 통과 | 통과 | 통과 | 생존 |
| c | Membership tiers | 96→**통과** | 통과 | 통과 | 통과 | **1-fix 후 생존** |

**최종 12/12.**

## c 의 1-fix

```
src/evolve/r11/c/MembershipTiersScreen.tsx:146:35 TS2339
  Property 'sectionLabel' does not exist on type '{ safe … money }'
src/evolve/r11/c/MembershipTiersScreen.tsx:230:33 TS2339 (동일)
```

`StyleSheet.create` 에 `sectionLabel` 키가 없는데 두 곳에서 참조했다. 수정: `sectionLabel` 추가(`:65-71`, 12pt/700/`muted`/uppercase/letterSpacing 0.8) — `eyebrow`(11pt/`faint`)와 `statLabel`(11pt/600/`faint`) 사이 위계. **통제 실험 셀(`money` 스타일)과 `formatWon()` 은 무변경**임을 designer 가 보고에 명시했고 재게이트로 확인했다.

## ★ 한 후보의 타입 에러가 나머지 둘의 게이트를 막았다

1차 실행에서 c 의 `tsc` 에러가 a·b 의 `export·render·iframe` **6단계를 전부 `미실행`으로 실패**시켰다:

```
OK   evolve-r11-a/tsc     | 에러 0 — 다른 후보(evolve-r11-c)의 에러로 전역 tsc가 중단됨
FAIL evolve-r11-a/export  | 미실행 — 다른 후보(evolve-r11-c)의 tsc 에러로 중단
```

**웹 게이트는 후보별 라우트를 따로 돌려 이런 일이 없다.** native 는 한 RN 프로젝트를 공유하므로 `tsc` 가 한 번에 돈다.

게이트가 **누구 탓인지 정확히 적어 줘서**(`다른 후보(evolve-r11-c)의 에러로`) 오진 위험은 없었다. 다만 §3 의 1-fix 규칙상 문제가 된다 — a·b 는 자기 잘못이 아닌 이유로 "실패"를 한 번 기록했고, 규칙을 문면대로 읽으면 그게 그들의 1회 기회를 쓴 것으로 읽힐 수 있다. 이번엔 **c 만 고치고 셋 다 재게이트**하는 것으로 처리했다 — §6 질문으로 올린다.

## 게이트가 못 본 것

**폰트 웨이트** — 세 후보 **전원 4종**(a `{400,500,600,700}` · b·c `{400,600,700,800}`). 정본은 "정확히 3종"이다. **native 게이트에 `weights` 관문이 없어**(Q34) 12/12 를 통과했고, 렌즈 1 이 소스에서 잡았으나 비차별적이라 순위에 반영되지 않았다. 지난 주 `n14` 에 이은 **두 번째 피해 사례**.

## designer 예산 — 스킬 §2 수정의 첫 효과

| 후보 | 도구 호출 | 산출 |
|---|---|---|
| a | 22 | 완성 |
| b | **2** | 완성 |
| c | 4 | 완성 |

직전 라운드(`auto-landing-r11`, 수정 전)는 **31 · 35 · 37회를 쓰고 3후보 중 2개가 파일 0개**로 끊겼다. 이번 수정은 designer 에게 정본 *경로* 대신 **조립한 브리프 전문**을 넘기고 "아무 파일도 읽지 마라 · 기존 작품을 열지 마라 · 첫 도구 호출이 Write 여야 한다"를 명시한 것이다. **원인 진단(중복 금지 목록이 designer 를 기존 작품 8개의 `page.tsx` 로 보낸다)이 맞았다.**
