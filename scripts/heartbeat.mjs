// 야간 라운드가 조용히 빠졌는지 판정한다.
//
// 2026-08-09 사고: 라운드가 발화하지 않았는데 **아무 신호도 없었다.** 사용자가 "발화했나"를 물어서야
// 알았고, 그때까지 하루가 통째로 비어 있었다. 스케줄러가 무엇이든(리모트컨트롤·크론·Actions) 연결이
// 끊기면 실행이 **시작조차 안 되므로 실패 로그도 남지 않는다.** 침묵과 정상은 겉보기가 같다.
//
// 무엇을 신호로 쓰나 — 두 번 틀리고 세 번째다:
//
//   ① `feat(dash-evolve)` 커밋을 찾는다  → 틀렸다. 주간 반증 apply가 `evolve/dash`를 main으로
//      리셋하면 그 주의 야간 커밋이 squash 하나로 접혀 접두어가 사라진다(실측: 브랜치에 0건).
//      매주 apply 직후마다 "이력 없음"을 내는데, 하필 그때가 제일 조용히 빠지기 쉽다.
//
//   ② 원장 파일을 건드린 마지막 커밋 시각 → 틀렸다. **사람의 유지보수가 누락을 가린다.**
//      2026-08-09에 apply 머지 커밋이 원장을 건드려 하트비트가 갱신됐는데, 정작 그날 라운드는
//      돌지 않았다. "파일이 최근에 바뀌었다"는 "루프가 돌았다"가 아니다.
//
//   ③ 원장 마지막 항목의 `date`를 **발화 스케줄과 대조** → 이것. 라운드가 스스로 적는 값이지만,
//      바로 그래서 "라운드가 완주했다"의 유일한 증거다. 게이트까지 통과하고 원장에 적히지 않았다면
//      그 라운드는 완주하지 않은 것이고, 그건 경보가 맞다.

import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

/** 야간 발화 시각(UTC). `dash-evolve`가 매일 이 시각에 돈다. */
export const FIRING_UTC_HOUR = 18;

/**
 * 발화 직후 유예. 도는 중인 라운드를 누락으로 부르면 매일 거짓 경보가 뜨고, 그 습관이 진짜 경보를
 * 무디게 만든다.
 *
 * 3시간인 근거는 실측이다 — 2026-08-08 발화는 18:00 UTC에 시작해 **19:05 UTC에 2라운드가 끝났다**
 * (`about r3` 18:00~18:40, `careers r3` 18:50~19:05). 첫 원장 항목은 40분쯤에 적힌다. 관측치의
 * 약 3배를 유예로 두되, 그보다 길게 잡으면(6시간으로 시작했다) 이번 사고를 알아챈 21:39 UTC조차
 * 유예 안에 들어가 감지가 반나절 늦는다.
 */
export const SETTLE_HOURS = 3;

const ymd = (ms) => new Date(ms).toISOString().slice(0, 10);

/** 이 시점 기준으로 **마지막에 돌았어야 하는** 라운드의 날짜(UTC). */
export function expectedLastRoundDate(now) {
  const d = new Date(now);
  if (d.getUTCHours() >= FIRING_UTC_HOUR) return ymd(now);
  return ymd(now - 86400_000);
}

/**
 * @param {{now: number, lastRoundDate: string|null}} input  lastRoundDate = 'YYYY-MM-DD'
 * @returns {{stale: boolean, unknown: boolean, missedDays: number|null, expected: string|null, detail: string}}
 */
export function evaluateHeartbeat({ now, lastRoundDate }) {
  // 이력 없음은 "밀렸다"가 아니라 "모른다"다. 둘을 같게 취급하면 첫 실행에서 거짓 경보가 뜬다.
  if (!lastRoundDate) {
    return { stale: false, unknown: true, missedDays: null, expected: null, detail: '라운드 이력 없음 — 판정 불가' };
  }
  const expected = expectedLastRoundDate(now);
  const missedDays = Math.round((Date.parse(expected) - Date.parse(lastRoundDate)) / 86400_000);

  // 오늘 발화분이 아직 안 적혔을 때만 유예를 적용한다. 어제 것까지 비어 있으면 유예와 무관하게 밀린 것이다.
  const withinSettle =
    missedDays === 1 &&
    expected === ymd(now) &&
    new Date(now).getUTCHours() < FIRING_UTC_HOUR + SETTLE_HOURS;

  const stale = missedDays > 0 && !withinSettle;
  return {
    stale,
    unknown: false,
    missedDays: Math.max(0, missedDays),
    expected,
    detail: stale
      ? `${expected} 라운드가 원장에 없다 — ${missedDays}일 누락. 마지막 완주는 ${lastRoundDate}. 스케줄러 연결을 확인하라`
      : withinSettle
        ? `${expected} 라운드 진행 중일 수 있다 (발화 후 ${SETTLE_HOURS}시간 유예)`
        : `최신 — 마지막 완주 ${lastRoundDate}`,
  };
}

export const LEDGER = 'vault/30-ledger/auto-ledger.jsonl';

/** 원장 마지막 항목의 라운드 날짜. 파일이 없거나 비면 null. */
export function lastRoundDateFromLedger(path = LEDGER) {
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    return null;
  }
  const lines = text.trim().split('\n').filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const d = JSON.parse(lines[i]);
      if (d.date) return d.date;
    } catch {
      // 손상된 줄은 건너뛴다 — 원장은 append-only라 뒤에서부터 온전한 줄을 찾으면 된다
    }
  }
  return null;
}

const isMain = process.argv[1] && process.argv[1].endsWith('heartbeat.mjs');
if (isMain) {
  // 원장은 evolve/dash에 쌓이므로 그 브랜치의 최신 내용을 본다 — 로컬 워킹트리가 main일 수 있다.
  spawnSync('git', ['fetch', '-q', 'origin'], { encoding: 'utf8' });
  const show = spawnSync('git', ['show', `origin/evolve/dash:${LEDGER}`], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  let lastRoundDate = null;
  if (show.status === 0 && show.stdout) {
    for (const l of show.stdout.trim().split('\n').filter(Boolean).reverse()) {
      try {
        const d = JSON.parse(l);
        if (d.date) { lastRoundDate = d.date; break; }
      } catch { /* 손상된 줄 건너뜀 */ }
    }
  } else {
    lastRoundDate = lastRoundDateFromLedger();
  }
  const v = evaluateHeartbeat({ now: Date.now(), lastRoundDate });
  console.log(JSON.stringify({ ...v, lastRoundDate }, null, 2));
  process.exit(v.stale ? 1 : 0);
}
