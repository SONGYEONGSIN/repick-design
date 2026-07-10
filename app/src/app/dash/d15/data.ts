// BOXOUT — 매치 콘솔 더미 데이터
// 결정론적 데이터만 사용 (Math.random / Date.now 금지).
// hash()는 Math.sin 기반 고정 함수라 서버/클라이언트 렌더가 항상 동일하다.

export type Quarter = 1 | 2 | 3;

export type Shot = {
  x: number;
  y: number;
  made: boolean;
  pts: 2 | 3;
  q: Quarter;
  playerId: string;
};

export type Player = {
  id: string;
  no: number;
  name: string;
  pos: "PG" | "SG" | "SF" | "PF" | "C";
  starter: boolean;
  min: string;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  ftm: number;
  fta: number;
  plusMinus: number;
  fouls: number;
  load: number; // 0-100 체력 부하 지수
};

/** 고정 시드 해시. 같은 입력 -> 항상 같은 출력 (서버/클라 동일, 랜덤 아님). */
function hash(seed: number): number {
  const v = Math.sin(seed * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}

export const HOME = { name: "서울 볼트", short: "SEOUL VOLT", abbr: "SEO" };
export const AWAY = { name: "부산 타이푼", short: "BUSAN TYPHOON", abbr: "BUS" };

export const GAME_STATUS = {
  quarter: "3Q" as const,
  clock: "6:42",
  snapshotLabel: "3쿼터 6:42 남음 · 21:47 스냅샷",
};

export const QUARTER_SCORES: { q: string; home: number; away: number; live?: boolean }[] = [
  { q: "1Q", home: 24, away: 18 },
  { q: "2Q", home: 19, away: 22 },
  { q: "3Q", home: 25, away: 21, live: true },
];

export const HOME_SCORE = QUARTER_SCORES.reduce((s, q) => s + q.home, 0);
export const AWAY_SCORE = QUARTER_SCORES.reduce((s, q) => s + q.away, 0);

/** 경기 흐름(득실차) 스파크라인 — 약 2분 간격 스냅샷. */
export const MOMENTUM: number[] = [0, 2, 3, 5, 4, 2, -1, -2, 0, 3, 5, 6, 7, 7];

export const PLAYERS: Player[] = [
  {
    id: "p10", no: 10, name: "김도윤", pos: "PG", starter: true, min: "24:12",
    pts: 18, reb: 4, ast: 9, stl: 3, blk: 0, to: 2,
    fgm: 7, fga: 13, tpm: 2, tpa: 5, ftm: 2, fta: 2,
    plusMinus: 11, fouls: 2, load: 78,
  },
  {
    id: "p23", no: 23, name: "박세훈", pos: "SG", starter: true, min: "22:04",
    pts: 14, reb: 3, ast: 2, stl: 1, blk: 0, to: 1,
    fgm: 5, fga: 11, tpm: 3, tpa: 7, ftm: 1, fta: 1,
    plusMinus: 6, fouls: 3, load: 71,
  },
  {
    id: "p7", no: 7, name: "이재원", pos: "SF", starter: true, min: "20:51",
    pts: 11, reb: 6, ast: 3, stl: 2, blk: 1, to: 2,
    fgm: 4, fga: 9, tpm: 1, tpa: 3, ftm: 2, fta: 2,
    plusMinus: 8, fouls: 1, load: 64,
  },
  {
    id: "p44", no: 44, name: "최민석", pos: "PF", starter: true, min: "19:37",
    pts: 9, reb: 10, ast: 1, stl: 0, blk: 2, to: 3,
    fgm: 4, fga: 8, tpm: 0, tpa: 0, ftm: 1, fta: 2,
    plusMinus: 4, fouls: 4, load: 82,
  },
  {
    id: "p55", no: 55, name: "정우진", pos: "C", starter: true, min: "18:02",
    pts: 12, reb: 11, ast: 0, stl: 0, blk: 3, to: 1,
    fgm: 5, fga: 7, tpm: 0, tpa: 0, ftm: 2, fta: 3,
    plusMinus: 9, fouls: 4, load: 88,
  },
  {
    id: "p3", no: 3, name: "한지호", pos: "SG", starter: false, min: "9:44",
    pts: 4, reb: 1, ast: 2, stl: 1, blk: 0, to: 0,
    fgm: 2, fga: 4, tpm: 0, tpa: 1, ftm: 0, fta: 0,
    plusMinus: -2, fouls: 1, load: 35,
  },
  {
    id: "p21", no: 21, name: "오승민", pos: "SF", starter: false, min: "8:15",
    pts: 0, reb: 2, ast: 0, stl: 0, blk: 0, to: 1,
    fgm: 0, fga: 2, tpm: 0, tpa: 1, ftm: 0, fta: 0,
    plusMinus: -3, fouls: 2, load: 29,
  },
  {
    id: "p33", no: 33, name: "신동엽", pos: "C", starter: false, min: "6:33",
    pts: 0, reb: 3, ast: 0, stl: 0, blk: 1, to: 0,
    fgm: 0, fga: 1, tpm: 0, tpa: 0, ftm: 0, fta: 0,
    plusMinus: -1, fouls: 3, load: 24,
  },
];

export const TEAM_TOTALS = PLAYERS.reduce(
  (acc, p) => ({
    fgm: acc.fgm + p.fgm,
    fga: acc.fga + p.fga,
    tpm: acc.tpm + p.tpm,
    tpa: acc.tpa + p.tpa,
    ftm: acc.ftm + p.ftm,
    fta: acc.fta + p.fta,
    reb: acc.reb + p.reb,
    ast: acc.ast + p.ast,
    to: acc.to + p.to,
  }),
  { fgm: 0, fga: 0, tpm: 0, tpa: 0, ftm: 0, fta: 0, reb: 0, ast: 0, to: 0 }
);

const quarters: Quarter[] = [1, 2, 3];

function genShots(
  playerId: string,
  seedBase: number,
  twoM: number,
  twoA: number,
  threeM: number,
  threeA: number
): Shot[] {
  const shots: Shot[] = [];

  for (let i = 0; i < twoA; i++) {
    const made = i < twoM;
    const h1 = hash(seedBase + i * 2.1);
    const h2 = hash(seedBase + i * 2.1 + 0.37);
    const isPaint = hash(seedBase + i * 3.7) > 0.45;
    const x = isPaint ? 210 + h1 * 80 : 90 + h1 * 320;
    const y = isPaint ? 375 + h2 * 65 : 235 + h2 * 130;
    const q = quarters[Math.min(2, Math.floor(hash(seedBase + i * 5.3) * 3))];
    shots.push({ x, y, made, pts: 2, q, playerId });
  }

  for (let i = 0; i < threeA; i++) {
    const made = i < threeM;
    const h1 = hash(seedBase + 100 + i * 2.3);
    const h2 = hash(seedBase + 100 + i * 2.3 + 0.51);
    const corner = hash(seedBase + 100 + i * 4.1) > 0.6;
    const leftSide = hash(seedBase + 100 + i * 6.2) > 0.5;
    const x = corner ? (leftSide ? 36 + h1 * 20 : 444 - h1 * 20) : 130 + h1 * 240;
    const y = corner ? 305 + h2 * 135 : 95 + h2 * 140;
    const q = quarters[Math.min(2, Math.floor(hash(seedBase + 100 + i * 5.9) * 3))];
    shots.push({ x, y, made, pts: 3, q, playerId });
  }

  return shots;
}

export const SHOTS: Shot[] = PLAYERS.flatMap((p, idx) =>
  genShots(p.id, idx * 17.3 + 1, p.fgm - p.tpm, p.fga - p.tpa, p.tpm, p.tpa)
);

export function pct(made: number, att: number): number {
  if (att === 0) return 0;
  return Math.round((made / att) * 100);
}

export function loadTier(load: number): { label: string; tone: "calm" | "elevated" | "high" } {
  if (load >= 85) return { label: "높음", tone: "high" };
  if (load >= 60) return { label: "보통", tone: "elevated" };
  return { label: "낮음", tone: "calm" };
}
