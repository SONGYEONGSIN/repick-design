# auto-native-r33 — SCORES

Freeze hash (post 1-fix, judged state): `1762bf6acb1a259e7b613470490f000f1523937c`
(`cat native/src/evolve/r33/*/*.tsx native/src/evolve/r33/*/*.ts | shasum`)

| 후보 | tsc | export | render | iframe | 1-fix |
|---|---|---|---|---|---|
| a — Provenance Record | 통과 | 통과 | 통과 (1-fix) | 통과 | `textTransform:"uppercase"` 제거 (렌더 검사 문자열 대소문자 불일치) |
| b — Safety Recall Matches | 통과 | 통과 | 통과 | 통과 | — |
| c — Shipping Rate Cards | 통과 | 통과 | 통과 | 통과 | — |

하드게이트 12/12 클린 (a 1-fix 1건 포함). `violations: []` (재게이트 후).

## 1차 게이트 실패 상세 (a, 수정 전)
`native/scripts/validate.sh`의 render 단계는 `document.body.innerText`가 등록된 check 문자열(`"Provenance Record"`)을 리터럴로 포함하는지 본다. `styles.title`에 `textTransform: "uppercase"`가 걸려 있어 실제 렌더 텍스트가 `"PROVENANCE RECORD"`(전부 대문자)였고, 혼합 대소문자 문자열이 부재해 실패했다. JSX 소스 리터럴은 정확했으므로 소스 리뷰로는 안 보이는 종류의 결함이다 — 포커스 죽은 관용구·`sr-only` 겹침 계측과 같은 "소스≠렌더" 계열.

## 환경 비고
이 세션은 새 컨테이너에서 처음 돌았고 `native/`에 `npm install`이 안 되어 있어 `tsc`가 전역에서 JSX 플래그 에러를 냈다(기존 파일 `src/auction/LiveAuctionScreen.tsx`까지 영향) — 이는 환경 부트스트랩 누락이었고 세 후보의 결함이 아니다. `native/npm install` 실행 후 정상화됐다.
