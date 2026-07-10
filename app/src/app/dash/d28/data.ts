// HOLDFIRE — Launch Operations Console
// Deterministic mock data only. No Math.random / Date.now (hydration-safe, honest static snapshot).

export type MilestoneStatus = "complete" | "holding" | "pending";
export type ChecklistState = "done" | "failed" | "pending";
export type PollStatus = "go" | "hold" | "nogo";

export interface ChecklistItem {
  id: string;
  label: string;
  state: ChecklistState;
}

export interface TelemetrySnapshot {
  boosterLoxPct: number;
  boosterCh4Pct: number;
  shipLoxPct: number;
  shipCh4Pct: number;
  groundWindKt: number;
  shearMarginKt: number;
  note: string;
}

export interface Milestone {
  id: string;
  index: number;
  tMinus: string;
  title: string;
  status: MilestoneStatus;
  station: string;
  relatedStations: string[];
  checklist: ChecklistItem[];
  telemetry: TelemetrySnapshot;
}

export interface Station {
  code: string;
  name: string;
  status: PollStatus;
  lastPoll: string;
  note: string;
}

export interface WeatherRow {
  parameter: string;
  limit: string;
  current: string;
  margin: string;
  status: "within" | "violation";
}

export interface HistoryEntry {
  tTime: string;
  duration: string;
  reason: string;
  calledBy: string;
  resolution: string;
  ongoing?: boolean;
}

export interface KpiTile {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  tone: "hold" | "go" | "default";
}

export interface MissionInfo {
  workspace: string;
  program: string;
  vehicle: string;
  propellant: string;
  pad: string;
  operator: string;
  operatorInitials: string;
  windowOpen: string;
  windowClose: string;
  snapshotAt: string;
}

export const mission: MissionInfo = {
  workspace: "Meridian Launch Systems",
  program: "ARC-14",
  vehicle: "Kestrel VI · Booster + Ship",
  propellant: "LOX / CH4 (methalox)",
  pad: "Pad LC-3 · OLM-1",
  operator: "C. Voss · Flight Director",
  operatorInitials: "CV",
  windowOpen: "14:32:00 UTC",
  windowClose: "16:02:00 UTC",
  snapshotAt: "T-00:04:00",
};

export const milestones: Milestone[] = [
  {
    id: "m1",
    index: 1,
    tMinus: "T-04:00:00",
    title: "Console Activation",
    status: "complete",
    station: "FLIGHT",
    relatedStations: ["FLIGHT"],
    checklist: [
      { id: "c1", label: "Stations manned & verified", state: "done" },
      { id: "c2", label: "Comm loops checked", state: "done" },
      { id: "c3", label: "Console self-test complete", state: "done" },
    ],
    telemetry: {
      boosterLoxPct: 0,
      boosterCh4Pct: 0,
      shipLoxPct: 0,
      shipCh4Pct: 0,
      groundWindKt: 6,
      shearMarginKt: 6.5,
      note: "All consoles manned. Proceeding nominal.",
    },
  },
  {
    id: "m2",
    index: 2,
    tMinus: "T-03:15:00",
    title: "Weather Briefing",
    status: "complete",
    station: "WX",
    relatedStations: ["WX", "RANGE"],
    checklist: [
      { id: "c1", label: "48-hr outlook reviewed", state: "done" },
      { id: "c2", label: "Range weather brief delivered", state: "done" },
      { id: "c3", label: "Launch commit criteria confirmed", state: "done" },
    ],
    telemetry: {
      boosterLoxPct: 0,
      boosterCh4Pct: 0,
      shipLoxPct: 0,
      shipCh4Pct: 0,
      groundWindKt: 7,
      shearMarginKt: 5.0,
      note: "Trending marginal for upper-level shear later in window.",
    },
  },
  {
    id: "m3",
    index: 3,
    tMinus: "T-02:30:00",
    title: "Propellant Load — LOX Start",
    status: "complete",
    station: "PROP",
    relatedStations: ["PROP", "BOOSTER", "SHIP"],
    checklist: [
      { id: "c1", label: "Booster LOX chilldown complete", state: "done" },
      { id: "c2", label: "Ship LOX chilldown complete", state: "done" },
      { id: "c3", label: "Loading arm engaged", state: "done" },
    ],
    telemetry: {
      boosterLoxPct: 38,
      boosterCh4Pct: 0,
      shipLoxPct: 41,
      shipCh4Pct: 0,
      groundWindKt: 7,
      shearMarginKt: 4.8,
      note: "Cryo load nominal, tank pressures within band.",
    },
  },
  {
    id: "m4",
    index: 4,
    tMinus: "T-01:15:00",
    title: "Propellant Load — CH4 Start",
    status: "complete",
    station: "PROP",
    relatedStations: ["PROP", "BOOSTER", "SHIP"],
    checklist: [
      { id: "c1", label: "Booster CH4 loading engaged", state: "done" },
      { id: "c2", label: "Ship CH4 loading engaged", state: "done" },
      { id: "c3", label: "Vent stack clear", state: "done" },
    ],
    telemetry: {
      boosterLoxPct: 82,
      boosterCh4Pct: 30,
      shipLoxPct: 85,
      shipCh4Pct: 28,
      groundWindKt: 8,
      shearMarginKt: 3.9,
      note: "Methane load tracking two minutes ahead of plan.",
    },
  },
  {
    id: "m5",
    index: 5,
    tMinus: "T-00:45:00",
    title: "Flight Termination System Arm",
    status: "complete",
    station: "RANGE",
    relatedStations: ["RANGE"],
    checklist: [
      { id: "c1", label: "FTS battery verified", state: "done" },
      { id: "c2", label: "Command receiver checks nominal", state: "done" },
      { id: "c3", label: "Safe/Arm switched to ARM", state: "done" },
    ],
    telemetry: {
      boosterLoxPct: 97,
      boosterCh4Pct: 74,
      shipLoxPct: 98,
      shipCh4Pct: 71,
      groundWindKt: 8,
      shearMarginKt: 2.6,
      note: "Range safety systems armed, tracking radar locked.",
    },
  },
  {
    id: "m6",
    index: 6,
    tMinus: "T-00:20:00",
    title: "Terminal Count Poll #1",
    status: "complete",
    station: "FLIGHT",
    relatedStations: ["FLIGHT", "BOOSTER", "SHIP", "PROP", "GNC", "RANGE", "WX", "GROUND", "COMM", "RECOVERY"],
    checklist: [
      { id: "c1", label: "All stations polled GO", state: "done" },
      { id: "c2", label: "No constraints outstanding", state: "done" },
      { id: "c3", label: "Terminal count sequencer armed", state: "done" },
    ],
    telemetry: {
      boosterLoxPct: 99,
      boosterCh4Pct: 96,
      shipLoxPct: 99,
      shipCh4Pct: 95,
      groundWindKt: 9,
      shearMarginKt: 1.1,
      note: "Unanimous GO at first terminal poll.",
    },
  },
  {
    id: "m7",
    index: 7,
    tMinus: "T-00:10:00",
    title: "Final Telemetry & Guidance Alignment",
    status: "complete",
    station: "GNC",
    relatedStations: ["GNC"],
    checklist: [
      { id: "c1", label: "Inertial platform aligned", state: "done" },
      { id: "c2", label: "Flight computer heartbeat nominal", state: "done" },
      { id: "c3", label: "Range telemetry lock confirmed", state: "done" },
    ],
    telemetry: {
      boosterLoxPct: 100,
      boosterCh4Pct: 99,
      shipLoxPct: 100,
      shipCh4Pct: 99,
      groundWindKt: 9,
      shearMarginKt: -1.8,
      note: "Guidance alignment within tolerance.",
    },
  },
  {
    id: "m8",
    index: 8,
    tMinus: "T-00:04:00",
    title: "Terminal Count Hold",
    status: "holding",
    station: "RANGE",
    relatedStations: ["RANGE", "WX"],
    checklist: [
      { id: "c1", label: "Upper-level wind shear check", state: "failed" },
      { id: "c2", label: "Recheck scheduled +00:03:00", state: "pending" },
      { id: "c3", label: "Range safety reviewing updated sounding", state: "pending" },
    ],
    telemetry: {
      boosterLoxPct: 100,
      boosterCh4Pct: 100,
      shipLoxPct: 100,
      shipCh4Pct: 100,
      groundWindKt: 9,
      shearMarginKt: -4.2,
      note: "HOLD called by RANGE — shear exceeds Rawinsonde limit by 4.2 kt at 42,000 ft.",
    },
  },
  {
    id: "m9",
    index: 9,
    tMinus: "T-00:03:00",
    title: "Terminal Count Resume (Pending)",
    status: "pending",
    station: "FLIGHT",
    relatedStations: ["FLIGHT", "WX"],
    checklist: [
      { id: "c1", label: "Awaiting updated shear sounding", state: "pending" },
      { id: "c2", label: "Recycle to T-00:04:00 if unresolved", state: "pending" },
      { id: "c3", label: "Weather station to re-poll", state: "pending" },
    ],
    telemetry: {
      boosterLoxPct: 100,
      boosterCh4Pct: 100,
      shipLoxPct: 100,
      shipCh4Pct: 100,
      groundWindKt: 9,
      shearMarginKt: -4.2,
      note: "Resume contingent on shear re-check at T-00:07:00 window.",
    },
  },
  {
    id: "m10",
    index: 10,
    tMinus: "T-00:00:45",
    title: "Flight Computer to Internal Power",
    status: "pending",
    station: "GNC",
    relatedStations: ["GNC", "GROUND"],
    checklist: [
      { id: "c1", label: "Auto sequencer start", state: "pending" },
      { id: "c2", label: "Ground power disconnect armed", state: "pending" },
      { id: "c3", label: "Final GO/NO-GO poll #2", state: "pending" },
    ],
    telemetry: {
      boosterLoxPct: 100,
      boosterCh4Pct: 100,
      shipLoxPct: 100,
      shipCh4Pct: 100,
      groundWindKt: 9,
      shearMarginKt: -4.2,
      note: "Awaiting terminal count resume.",
    },
  },
  {
    id: "m11",
    index: 11,
    tMinus: "T-00:00:00",
    title: "Liftoff",
    status: "pending",
    station: "FLIGHT",
    relatedStations: ["FLIGHT", "BOOSTER"],
    checklist: [
      { id: "c1", label: "Hold-down release", state: "pending" },
      { id: "c2", label: "Engine ignition confirm", state: "pending" },
      { id: "c3", label: "Tower clear", state: "pending" },
    ],
    telemetry: {
      boosterLoxPct: 100,
      boosterCh4Pct: 100,
      shipLoxPct: 100,
      shipCh4Pct: 100,
      groundWindKt: 9,
      shearMarginKt: -4.2,
      note: "Liftoff pending resolution of active hold.",
    },
  },
];

export const stations: Station[] = [
  { code: "FLIGHT", name: "Flight Director", status: "go", lastPoll: "T-00:04:02", note: "Standing by for updated shear data." },
  { code: "BOOSTER", name: "Booster Systems", status: "go", lastPoll: "T-00:05:10", note: "Tanks stable at flight pressure." },
  { code: "SHIP", name: "Ship Systems", status: "go", lastPoll: "T-00:05:08", note: "Header tanks stable, no faults." },
  { code: "PROP", name: "Propulsion", status: "go", lastPoll: "T-00:05:15", note: "Loads holding, boiloff within margin." },
  { code: "GNC", name: "Guidance, Nav & Control", status: "go", lastPoll: "T-00:05:20", note: "Platform aligned, no drift detected." },
  { code: "RANGE", name: "Range Safety", status: "nogo", lastPoll: "T-00:04:00", note: "Upper-level shear exceeds 95 kt limit at 42,000 ft." },
  { code: "WX", name: "Weather", status: "hold", lastPoll: "T-00:04:05", note: "New sounding balloon aloft, data expected T-00:07:00." },
  { code: "GROUND", name: "Ground Systems", status: "go", lastPoll: "T-00:05:00", note: "Pad systems nominal, no equipment faults." },
  { code: "COMM", name: "Telemetry & Comm", status: "go", lastPoll: "T-00:05:12", note: "Command and telemetry links nominal." },
  { code: "RECOVERY", name: "Recovery", status: "go", lastPoll: "T-00:05:18", note: "Downrange recovery assets on station." },
];

export const weatherRows: WeatherRow[] = [
  { parameter: "Ground Winds", limit: "≤ 32 kt", current: "9 kt", margin: "+23 kt", status: "within" },
  { parameter: "Upper-Level Shear (42k ft)", limit: "≤ 95 kt", current: "99.2 kt", margin: "-4.2 kt", status: "violation" },
  { parameter: "Cloud Ceiling", limit: "≥ 3,000 ft", current: "8,500 ft", margin: "+5,500 ft", status: "within" },
  { parameter: "Precipitation (Field)", limit: "None w/in 10 nmi", current: "None observed", margin: "clear", status: "within" },
  { parameter: "Lightning (Field Mill)", limit: "< 1,500 V/m", current: "410 V/m", margin: "+1,090 V/m", status: "within" },
  { parameter: "Propellant Temp Margin", limit: "±3°C of load spec", current: "+0.4°C", margin: "+2.6°C", status: "within" },
];

export const historyLog: HistoryEntry[] = [
  {
    tTime: "T-01:58:00",
    duration: "00:06:12",
    reason: "GSE fault — LOX transfer line pressure sensor",
    calledBy: "PROP",
    resolution: "Swapped to redundant sensor string, recheck passed.",
  },
  {
    tTime: "T-00:20:00",
    duration: "00:02:45",
    reason: "Vessel incursion, downrange keep-out zone",
    calledBy: "RANGE",
    resolution: "Range cleared, vessel escorted out of zone.",
  },
  {
    tTime: "T-00:04:00",
    duration: "00:04:41",
    reason: "Upper-level wind shear exceeds limit",
    calledBy: "RANGE",
    resolution: "Pending — awaiting updated sounding.",
    ongoing: true,
  },
];

export const kpis: KpiTile[] = [
  { id: "ttime", label: "Mission Clock", value: "T-00:04:00", sublabel: "Holding · called by RANGE", tone: "hold" },
  { id: "window", label: "Launch Window", value: "14:32–16:02", sublabel: "60m 30s margin if resumed now", tone: "default" },
  { id: "holds", label: "Holds This Count", value: "3", sublabel: "13m 38s cumulative, incl. active hold", tone: "default" },
  { id: "stations", label: "Stations GO", value: "8 / 10", sublabel: "2 constraints open — RANGE, WX", tone: "go" },
];

export const currentMilestoneId = "m8";
