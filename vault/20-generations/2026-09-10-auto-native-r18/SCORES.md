# auto-native-r18 — SCORES

소스 해시(게이트 직전 동결, `cat native/src/evolve/r18/*/*.tsx native/src/evolve/r18/*/*.ts | shasum`):
`b2d8981c8bcdb0f073fce82adfd3feedab978e45`

`node scripts/gate.mjs --target native --screens evolve-r18-a evolve-r18-b evolve-r18-c` — 1차 실행, 1-fix 미소모.

| 후보 | tsc | export | render | iframe |
|---|---|---|---|---|
| a (My Impact) | ✅ | ✅ | ✅ | ✅ |
| b (Saved Searches & Alerts) | ✅ | ✅ | ✅ | ✅ |
| c (Condition Assessment) | ✅ | ✅ | ✅ | ✅ |

12/12 통과. `verdict.violations` 없음. 전역 `tsc`(native 프로젝트 전체) 1차 클린 — `blockedBy` 없음.

렌더 검사 문자열: a=`My Impact` · b=`Saved Searches & Alerts` · c=`Condition Assessment`
