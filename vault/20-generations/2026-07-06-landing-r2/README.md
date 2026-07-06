# 2026-07-06-landing-r2 — 폐루프 증명용 (정식 회차 아님)

이 디렉토리는 **1회차 학습이 2회차 생성에 반영되는지 증명**하기 위한 검증용이다. 정식 루프 회차가 아니므로 `SCORES.md`/`DECISION.md`가 없다.

- 목적: 1회차 결정(C 승자 → "폰트 웨이트 3종 정리")이 RETRIEVE를 통해 다음 생성에 전파되는지 확인.
- 결과: `candidates/a.md` — 1회차 C의 폰트 웨이트 4종(light/400/medium/semibold/bold)을 **정확히 3종**(normal/semibold/bold)으로 좁혀 학습을 반영함. 폐루프 성립.
- 정식 다음 회차는 `/design-evolve "landing"` 재실행으로 SCORES/DECISION까지 완주할 것.
