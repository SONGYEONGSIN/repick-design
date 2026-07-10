// STELE — deterministic dummy data (static snapshot, no Date.now()/Math.random()).

export type EndangermentStatus =
  | "vulnerable"
  | "definitely_endangered"
  | "severely_endangered"
  | "critically_endangered"
  | "dormant";

export const statusLabel: Record<EndangermentStatus, string> = {
  vulnerable: "Vulnerable",
  definitely_endangered: "Definitely Endangered",
  severely_endangered: "Severely Endangered",
  critically_endangered: "Critically Endangered",
  dormant: "Dormant",
};

export type Language = {
  code: string;
  name: string;
  family: string;
  region: string;
  speakers: number;
  status: EndangermentStatus;
  hoursArchived: number;
};

export const languages: Language[] = [
  { code: "KLV", name: "Kelevi", family: "Kelevic", region: "Andes highlands", speakers: 940, status: "critically_endangered", hoursArchived: 182.5 },
  { code: "OMP", name: "Ompari", family: "Ompar–Sahdu", region: "Sahel corridor", speakers: 12800, status: "vulnerable", hoursArchived: 96.0 },
  { code: "SHD", name: "Sahdu", family: "Ompar–Sahdu", region: "Sahel corridor", speakers: 3100, status: "definitely_endangered", hoursArchived: 64.25 },
  { code: "WNT", name: "Wentaq", family: "Wentaq (isolate)", region: "Bering coast", speakers: 210, status: "critically_endangered", hoursArchived: 41.75 },
  { code: "NRG", name: "Nurong", family: "Nurong–Ilbek", region: "Kra highlands", speakers: 5400, status: "severely_endangered", hoursArchived: 58.5 },
  { code: "ILB", name: "Ilbek", family: "Nurong–Ilbek", region: "Kra highlands", speakers: 1870, status: "severely_endangered", hoursArchived: 33.0 },
  { code: "DZR", name: "Dzerai", family: "Dzerai (isolate)", region: "Caucasus ridge", speakers: 62, status: "dormant", hoursArchived: 12.5 },
  { code: "KWL", name: "Kwalinu", family: "Kwalinu–Miskeo", region: "Torres Strait", speakers: 4300, status: "vulnerable", hoursArchived: 88.25 },
];

export const totalHoursArchived = Number(
  languages.reduce((sum, l) => sum + l.hoursArchived, 0).toFixed(2)
);

// Aggregate by endangerment status (drives the donut).
export const statusBreakdown: { status: EndangermentStatus; hours: number }[] = (
  Object.keys(statusLabel) as EndangermentStatus[]
)
  .map((status) => ({
    status,
    hours: Number(
      languages.filter((l) => l.status === status).reduce((s, l) => s + l.hoursArchived, 0).toFixed(2)
    ),
  }))
  .filter((s) => s.hours > 0);

// Aggregate by language family (drives the corpus bar chart).
export const languageFamilies: { family: string; hours: number; languageCount: number }[] = Array.from(
  languages.reduce((map, l) => {
    const prev = map.get(l.family) ?? { hours: 0, languageCount: 0 };
    map.set(l.family, { hours: prev.hours + l.hoursArchived, languageCount: prev.languageCount + 1 });
    return map;
  }, new Map<string, { hours: number; languageCount: number }>())
).map(([family, v]) => ({ family, hours: Number(v.hours.toFixed(2)), languageCount: v.languageCount }))
  .sort((a, b) => b.hours - a.hours);

export type StageKey = "capture" | "transcription" | "review" | "translation" | "archived";

export const stageLabel: Record<StageKey, string> = {
  capture: "Field Capture",
  transcription: "Transcription",
  review: "Phonetic Review",
  translation: "Translation",
  archived: "Archived",
};

export const pipelineStages: { key: StageKey; count: number }[] = [
  { key: "capture", count: 428 },
  { key: "transcription", count: 261 },
  { key: "review", count: 154 },
  { key: "translation", count: 97 },
  { key: "archived", count: 62 },
];

export type QueueItem = {
  shelfmark: string;
  languageCode: string;
  dialect: string;
  contributor: string;
  stage: StageKey;
  duration: string;
  daysInStage: number;
};

export const queue: QueueItem[] = [
  { shelfmark: "STELE-2026-0388", languageCode: "KLV", dialect: "Highland Kelevi", contributor: "R. Toponce", stage: "translation", duration: "38:12", daysInStage: 6 },
  { shelfmark: "STELE-2026-0391", languageCode: "WNT", dialect: "Coastal Wentaq", contributor: "I. Auyong", stage: "review", duration: "12:45", daysInStage: 21 },
  { shelfmark: "STELE-2026-0402", languageCode: "OMP", dialect: "Ompari (Central)", contributor: "F. Nabaweesi", stage: "transcription", duration: "54:30", daysInStage: 3 },
  { shelfmark: "STELE-2026-0405", languageCode: "SHD", dialect: "Sahdu (Riverine)", contributor: "H. Delacroix-Osei", stage: "translation", duration: "29:08", daysInStage: 9 },
  { shelfmark: "STELE-2026-0410", languageCode: "NRG", dialect: "Nurong (Upper)", contributor: "T. Marchetti", stage: "review", duration: "17:52", daysInStage: 16 },
  { shelfmark: "STELE-2026-0413", languageCode: "DZR", dialect: "Dzerai", contributor: "R. Toponce", stage: "transcription", duration: "08:20", daysInStage: 4 },
  { shelfmark: "STELE-2026-0417", languageCode: "KWL", dialect: "Kwalinu (Island)", contributor: "I. Auyong", stage: "archived", duration: "44:00", daysInStage: 0 },
  { shelfmark: "STELE-2026-0421", languageCode: "ILB", dialect: "Ilbek (Lowland)", contributor: "F. Nabaweesi", stage: "capture", duration: "61:10", daysInStage: 2 },
  { shelfmark: "STELE-2026-0424", languageCode: "WNT", dialect: "Inland Wentaq", contributor: "H. Delacroix-Osei", stage: "translation", duration: "22:35", daysInStage: 13 },
];

export const STALL_THRESHOLD_DAYS = 14;

export const attentionItems = queue.filter((q) => q.daysInStage >= STALL_THRESHOLD_DAYS);

export type Contributor = {
  name: string;
  role: string;
  hoursThisQuarter: number;
  languageCount: number;
};

export const contributors: Contributor[] = [
  { name: "R. Toponce", role: "Field Archivist", hoursThisQuarter: 142.5, languageCount: 3 },
  { name: "I. Auyong", role: "Phonetic Reviewer", hoursThisQuarter: 118.0, languageCount: 4 },
  { name: "F. Nabaweesi", role: "Transcriptionist", hoursThisQuarter: 96.25, languageCount: 2 },
  { name: "H. Delacroix-Osei", role: "Translator", hoursThisQuarter: 88.75, languageCount: 3 },
  { name: "T. Marchetti", role: "Phonetic Reviewer", hoursThisQuarter: 74.5, languageCount: 2 },
  { name: "M. Okonkwo-Reyes", role: "Field Archivist · Lead", hoursThisQuarter: 61.0, languageCount: 5 },
];

export type TimeRange = "7D" | "30D" | "90D" | "ALL";

export const submissionsByRange: Record<TimeRange, number[]> = {
  "7D": [4, 6, 5, 7, 9, 6, 8],
  "30D": [12, 15, 14, 18, 21, 19, 23, 26, 24, 28],
  "90D": [38, 45, 41, 52, 58, 55, 63, 70, 68, 75],
  ALL: [96, 118, 134, 152, 171, 188, 204, 221, 238, 261],
};

export const deltaByRange: Record<TimeRange, string> = {
  "7D": "+6.4% vs. prior 7 days",
  "30D": "+11.2% vs. prior 30 days",
  "90D": "+18.9% vs. prior quarter",
  ALL: "+142% since project launch",
};

export const medianDaysToArchive = 34;

export const asOfLabel = "Ledger synced — 04 JUL 2026, 09:12 UTC";
