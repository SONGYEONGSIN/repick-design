# auto-native-r12 — SCORES

target: native · round: auto-native-r12 · date: 2026-08-23

동결 해시(게이트 직전 소스 SHA-1): `90a6f459c349ac9f051f3c67208bf851acc97a7e`
게이트 후 재확인 해시: `90a6f459c349ac9f051f3c67208bf851acc97a7e` (동일 — 무효화 없음)

환경 고유 조치: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1` (r7~r11 선례와 동일 계열). 추가로 이번 부트스트랩에서 `native/` 자체의 `npm install`이 누락되어 있었음을 발견·조치(스킬 문서에 없는 환경 고유 절차 — 루트/`app/` install만으로는 `native/`가 비어 있어 `tsc`가 전 파일 JSX 플래그 에러로 폭발했다. `cd native && npm install` 후 정상.)

## 후보 × 4관문

| screen | tsc | export | render | iframe |
|---|:--:|:--:|:--:|:--:|
| evolve-r12-a (Return Request) | ✅ | ✅ | ✅ | ✅ |
| evolve-r12-b (Saved Search Alerts) | ✅ | ✅ | ✅ | ✅ |
| evolve-r12-c (Authentication Certificate) | ✅ | ✅ | ✅ | ✅ |

12/12 1차 통과 — 1-fix 루프 불요.

## 오케스트레이터 독립 확인
- SafeAreaView 최상위 래핑: 3후보 전원 확인(a:127, b:72, c:189 — 모두 `react-native`발 import, Q42 잠정가설 (다) 준수).
- 통화 표기: a·b는 `formatWon`/`formatKRW` 헬퍼로 `"₩ N,NNN"` 간격 규칙(r11 정본화) 적용 확인. c는 통화 표기 자체가 없음(설계 선택, 브리프에 정합).
- 라이브 리전: 3후보 전원 정확히 1개(`accessibilityLiveRegion="polite"` 컨테이너 1개 + `accessibilityRole="alert"` 전환 문장 1개)만 사용 — 스택 없음 확인.
