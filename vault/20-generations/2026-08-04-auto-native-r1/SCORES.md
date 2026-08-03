# SCORES — auto-native-r1

게이트: `node scripts/gate.mjs --target native --screens evolve-r1-a evolve-r1-b evolve-r1-c`

native 브랜치는 웹의 static·sweep·Lighthouse 대신 후보별 **4단계**(tsc·export·render·iframe)를 검사한다. Expo Web export를 자체 수행·서브하므로 3100 dev 서버는 쓰지 않는다.

| 후보 | tsc | export | render | iframe |
|---|---|---|---|---|
| a | ✓ 통과 | ✓ 통과 | ✓ 통과 | ✓ 통과 |
| b | ✓ 통과 | ✓ 통과 | ✓ 통과 | ✓ 통과 |
| c | ✓ 통과 | ✓ 통과 | ✓ 통과 | ✓ 통과 |

**판정: 전원 생존 (12/12 통과)** · 1-fix 루프 불요.

## 재게이트 이력

최초 게이트(06:46)는 **낡은 상태를 쟀다** — 후보 b의 designer가 파일 생성 뒤에도 편집을 계속해 `OfferThread.tsx`가 06:50에 다시 쓰였다. 파일이 디스크에 나타난 것을 작업 완료로 오인한 오케스트레이션 결함이며, 판정 시작 후 렌즈3이 "후보 파일이 첫 읽기 이후 바뀌었다"고 감지해 드러났다.

조치: 진행 중이던 judge 3개 중단 → 파일 해시가 20초간 불변임을 확인해 상태 동결 → **전 후보 재게이트 + 전 프레임 재캡처** → 판정 재시작.

**판정 대상 상태 해시**: `38e915e4857ed39b500d4e2c2c8954689af6fb51` (후보 3개의 `.tsx` + `data.ts` 연결 SHA-1). 이 해시가 게이트·스크린샷·judge가 모두 같은 산출물을 본 증거다.

## 스크린샷

후보별 2폭(390 폰 · 768 태블릿), 총 6장. 빈 프레임 0건.
