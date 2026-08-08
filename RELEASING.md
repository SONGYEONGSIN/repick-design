# 릴리즈 절차

`page-commission` 플러그인의 배포 단위는 `plugin/`, 마켓플레이스는 레포 루트 `.claude-plugin/marketplace.json`(`source: "./plugin"`). 설치 시 캐시에는 `plugin/`만 복사된다.

## 무엇이 실리나

| 실린다 | 왜 |
|---|---|
| `skills/page-commission/SKILL.md` | 인터뷰 — 이 플러그인의 본체 |
| `skills/page-commission/canon/*.md` (11종) | `page-brief-core` + 타입 프로파일 10종. 자율 루프가 60여 라운드로 쌓은 판정 근거 |
| `skills/page-commission/scripts/static-check.mjs` | `node:fs`만 쓴다 — `npm install` 없이 남의 레포에서 돈다 |

| 안 실린다 | 왜 |
|---|---|
| `page-brief-repo.md` | **이 레포의 바인딩** — 영문 전용 정책·폰트 변수명·Next 16 경로. 남의 레포에서 거짓이 된다 |
| `curation-criteria` · `questions-queue` · `*-deltas-provisional.jsonl` | 자율 루프의 내부 장부. 설치자에게 의미가 없다 |
| `gate.mjs` · `capture-shots.mjs` | Playwright·Lighthouse·dev 서버를 요구한다 |

번들의 `[[curation-criteria]]` 같은 링크는 **해소되지 않는 채로 남는다** — 의도된 것이고, 빌드가 목록을 출력한다.

## 사본은 생성물이다

`plugin/skills/page-commission/` 전체가 **빌드 산출물**이다. 손으로 고치지 마라. 원본은:

- 스킬 → `.claude/skills/page-commission/SKILL.md`
- 정본 → `vault/00-principles/`
- 검사기 → `scripts/dash-static-check.mjs`

바이트가 갈라지면 `npm test`가 막는다(`build-plugin.test.mjs` 드리프트 3종). **테스트가 실패하면 번들을 다시 만들라는 뜻이지 테스트를 고치라는 뜻이 아니다.**

## 버전 정책

| 자리수 | 언제 | 예 |
|---|---|---|
| **patch** | 정본 **데이터** 변경 (진화 라운드 승격·프로파일 추가) | 0.1.0 → 0.1.1 |
| **minor** | `SKILL.md`·검사기의 **계약** 변경 (인자·출력·인터페이스) | 0.1.5 → 0.2.0 |
| **major** | 파괴적 변경 | 0.9.0 → 1.0.0 |

**배포물이 바뀌면 반드시 버전을 올린다.** 안 올리면 기존 설치자에게 전달되지 않는다 — `claude plugin update`는 **버전을 비교해** 갱신 여부를 정한다. 형제 레포 `repick-prompt`의 2026-08-04 실측이 이것을 증명한다: main에 새 템플릿이 있고 캐시가 낡았는데 `plugin.json`을 안 올려 `"already at the latest version"`이 떴고, **새 데이터가 영영 전달되지 않았다.**

"설치자는 마켓플레이스가 main을 클론하니 항상 최신을 받는다"는 것은 **신규 설치에만** 참이다. 마켓플레이스를 특정 태그에 고정하는 방법이 없으므로 **버전 범프가 유일한 전달 수단**이다.

## 새 버전 릴리즈

1. **번들 재생성** — 볼트·스킬 변경을 배포물에 반영:
   ```bash
   npm run build:plugin && npm test
   ```
2. **버전 범프** — `plugin/.claude-plugin/plugin.json`의 `version`.
3. **커밋·PR·머지** — 레포 규약대로 conventional 제목.
4. **설치 확인** — 신규 설치와 기존 설치 양쪽:
   ```bash
   claude plugin marketplace add SONGYEONGSIN/repick-design
   claude plugin install page-commission@repick-design
   claude plugin update page-commission     # 버전이 올랐는지
   ```

## 설치자가 얻는 것

```
/page-commission  또는  "우리 회사 소개 페이지 만들어줘"
```

인터뷰가 타입·회사명·핵심 증명·도메인·**언어**를 확정하고, 그 레포의 라우트 디렉토리를 물어 거기에만 쓴다. 정적 검사는 그 레포의 폰트 변수로 갈아끼워 돌린다:

```bash
node <스킬>/scripts/static-check.mjs <파일…> --font-vars <그 레포 변수>
```

`sweep`·`a11y`·`perf`는 이 레포의 개발 환경에 묶여 있어 **실리지 않는다.** 스킬은 그것을 "미측정"으로 보고하며, 못 돌린 검사를 통과로 적지 않는다.
