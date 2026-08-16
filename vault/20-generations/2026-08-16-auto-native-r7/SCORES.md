# SCORES — auto-native-r7

State hashes (frozen, `cat <files> | shasum`):
- a: `d27b860a5e8b9e4a696a0c54cfa90585e04d8791`
- b: `c122315c976fc2c851021fa0df97ea9c2f125d7c`
- c: `d9d9e2392f71b99368f4978c5e81ae999554c855`

`node scripts/gate.mjs --target native --screens evolve-r7-a evolve-r7-b evolve-r7-c` — single dispatcher invocation covering all 3 screens sequentially (avoids the port-8091/`dist`-directory race that the 3 designer agents hit when each independently ran `validate.sh` concurrently during GENERATE — noted by candidate a and confirmed transient by candidate c).

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| a — Dispute & Return Center | ✅ | ✅ | ✅ | ✅ |
| b — Search Results | ✅ | ✅ | ✅ | ✅ |
| c — Price Alerts | ✅ | ✅ | ✅ | ✅ |

12/12 pass, 1차 통과, 수정 없음.

## 오케스트레이터 수동 확인 (게이트 미검사 항목 — `auto-native-r1` 델타)
- **SafeAreaView 최상위 래핑**: a/b/c 전부 `SafeAreaView`가 파일의 최상위 반환 요소(grep 확인, `screen.tsx` 최상단 open/close 태그) — 전원 통과, r4/r5/r6에 이은 연속 무위반.
- **₩+tabular-nums 렌더링 아티팩트 (L2 델타)**: a는 ₩ 표기에 tabular-nums 미사용(위험 회피). b는 파일 상단 주석으로 tabular-nums 전면 미사용을 명시(₩ 인접 위험 회피). c는 유일하게 ₩ 금액을 tabular-nums로 정렬 표기하나, `WonText` 헬퍼가 정확히 델타가 요구하는 구조(₩ 심볼과 tabular-nums 숫자를 **비-스타일 View 아래 형제 Text**로 분리, 부모-자식 관계 아님)로 구현됨 — 소스 확인(`PriceAlertsScreen.tsx:39-61`). 요약 텍스트(`alerts.length … watching … reached`)에도 tabular-nums가 걸려 있으나 ₩ 기호가 그 문자열에 없어 안전.

## 생존
전 후보(a/b/c) 3개 전원 생존 — judge 3렌즈 패널로 진행.
