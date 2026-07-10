// CALDERA/OS — static demo dataset for a fictional volcanic monitoring network.
// All series are generated with deterministic trigonometric functions (no
// Math.random / Date), so server and client render identical markup.

export type ColorCode = "GREEN" | "YELLOW" | "ORANGE" | "RED";
export type LogLevel = "INFO" | "WARN" | "CRIT";

export interface LogEntry {
  /** time-before-now, mission-control style, e.g. "-00:14" or "-2D:06" */
  t: string;
  level: LogLevel;
  msg: string;
}

export interface Station {
  code: string;
  name: string;
  region: string;
  coords: string;
  elevation: string;
  colorCode: ColorCode;
  summary: string;
  lastEruption: string;
  population: string;
  thermalLabel: string;
  thermalUnit: string;
  thermal: number[];
  so2: number[];
  tilt: number[];
  seismicEvents: number[];
  plumeHeightKm: number;
  plumeDirectionDeg: number | null;
  logs: LogEntry[];
}

/** Deterministic pseudo-organic series: base + two sine harmonics. */
function series(base: number, amp: number, freq: number, phase: number, n = 30, min = 0): number[] {
  return Array.from({ length: n }, (_, i) => {
    const v = base + amp * Math.sin(freq * i + phase) + amp * 0.35 * Math.sin(freq * 2.4 * i + phase * 1.6);
    return Math.max(min, Math.round(v * 10) / 10);
  });
}

function ints(base: number, amp: number, freq: number, phase: number, n = 30): number[] {
  return series(base, amp, freq, phase, n, 0).map((v) => Math.round(v));
}

export const COLOR_CODE_DEFINITION: Record<ColorCode, string> = {
  GREEN: "Volcano in normal, non-eruptive background state.",
  YELLOW: "Elevated unrest above known background level.",
  ORANGE: "Heightened unrest, or eruption underway with minor ash.",
  RED: "Eruption imminent or underway with significant ash emission.",
};

export const STATIONS: Station[] = [
  {
    code: "ETNA-04",
    name: "Mount Etna",
    region: "Sicily, Italy",
    coords: "37.75°N 14.99°E",
    elevation: "3,357 m",
    colorCode: "ORANGE",
    summary: "Strombolian activity intensifying at Southeast Crater",
    lastEruption: "2025-02-10",
    population: "~3.1M within 30 km",
    thermalLabel: "Lava Lake Temp",
    thermalUnit: "°C",
    thermal: series(985, 18, 0.42, 0.4),
    so2: series(3200, 900, 0.36, 1.1),
    tilt: series(-2, 3.2, 0.3, 0.2),
    seismicEvents: ints(18, 11, 0.5, 0.6),
    plumeHeightKm: 4.2,
    plumeDirectionDeg: 210,
    logs: [
      { t: "-00:14", level: "CRIT", msg: "Lava fountain observed, SE crater — column est. FL140" },
      { t: "-02:05", level: "WARN", msg: "Harmonic tremor amplitude +38% over 6h rolling window" },
      { t: "-05:40", level: "WARN", msg: "Tiltmeter EAST-1 shows continued inflation trend" },
      { t: "-11:20", level: "INFO", msg: "INGV overflight confirms new spatter cone at SE rim" },
      { t: "-1D:02", level: "INFO", msg: "SO2 flux exceeds 7-day mean by 22%" },
      { t: "-2D:16", level: "INFO", msg: "Routine seismometer calibration completed, no anomalies" },
    ],
  },
  {
    code: "KILAUEA-E",
    name: "Kīlauea — East Rift",
    region: "Hawai'i, USA",
    coords: "19.42°N 155.29°W",
    elevation: "1,222 m",
    colorCode: "RED",
    summary: "Effusive eruption ongoing, Fissure 17 actively venting",
    lastEruption: "Ongoing",
    population: "~200K within 30 km",
    thermalLabel: "Lava Lake Temp",
    thermalUnit: "°C",
    thermal: series(1145, 22, 0.5, 2.1),
    so2: series(5200, 1300, 0.4, 0.3),
    tilt: series(6, 4.4, 0.34, 1.4),
    seismicEvents: ints(33, 15, 0.55, 0.1),
    plumeHeightKm: 1.8,
    plumeDirectionDeg: 135,
    logs: [
      { t: "-00:06", level: "CRIT", msg: "Fissure 17 fountaining 60–80 m, flow advancing SE" },
      { t: "-01:30", level: "CRIT", msg: "SO2 emission rate exceeds 5,000 t/day, Kona wind advisory issued" },
      { t: "-04:10", level: "WARN", msg: "Summit tiltmeter UWD records rapid deflation-inflation cycle" },
      { t: "-09:45", level: "INFO", msg: "HVO field crew deployed to Fissure 17 for thermal survey" },
      { t: "-1D:08", level: "WARN", msg: "New spatter rampart forming, channel overflow on west levee" },
      { t: "-3D:02", level: "INFO", msg: "Webcam KE-cam03 restored after connectivity loss" },
    ],
  },
  {
    code: "MERAPI-7",
    name: "Gunung Merapi",
    region: "Central Java, Indonesia",
    coords: "7.54°S 110.44°E",
    elevation: "2,930 m",
    colorCode: "ORANGE",
    summary: "Lava dome growth, pyroclastic flow risk on SW flank",
    lastEruption: "2024-11-30",
    population: "~1.2M within 30 km",
    thermalLabel: "Dome Surface Temp",
    thermalUnit: "°C",
    thermal: series(640, 45, 0.46, 1.6),
    so2: series(900, 320, 0.38, 2.0),
    tilt: series(3, 2.4, 0.32, 0.9),
    seismicEvents: ints(46, 19, 0.6, 0.2),
    plumeHeightKm: 2.6,
    plumeDirectionDeg: 300,
    logs: [
      { t: "-00:40", level: "WARN", msg: "Pyroclastic flow, Kali Bebeng drainage, runout ~1.5 km" },
      { t: "-03:15", level: "WARN", msg: "Dome volume growth +12,000 m³ over 24h (drone survey)" },
      { t: "-07:50", level: "INFO", msg: "Lava avalanche count: 24 events, max runout 1.2 km SW" },
      { t: "-1D:04", level: "INFO", msg: "Exclusion zone unchanged at 5 km radius, SW sector 7 km" },
      { t: "-2D:11", level: "WARN", msg: "RSAM trend rising ahead of expected dome collapse cycle" },
      { t: "-4D:20", level: "INFO", msg: "BPPTKG bulletin issued — activity level unchanged (Siaga)" },
    ],
  },
  {
    code: "SAKURA-2",
    name: "Sakurajima",
    region: "Kagoshima, Japan",
    coords: "31.59°N 130.66°E",
    elevation: "1,117 m",
    colorCode: "YELLOW",
    summary: "Routine Vulcanian explosions within normal cycle",
    lastEruption: "2025-06-22",
    population: "~600K within 30 km",
    thermalLabel: "Vent Temp",
    thermalUnit: "°C",
    thermal: series(215, 26, 0.4, 0.8),
    so2: series(1400, 420, 0.35, 1.9),
    tilt: series(-1, 1.6, 0.28, 0.5),
    seismicEvents: ints(12, 7, 0.44, 1.2),
    plumeHeightKm: 1.2,
    plumeDirectionDeg: 90,
    logs: [
      { t: "-01:12", level: "INFO", msg: "Vulcanian explosion, Minamidake crater, ash to 1,200 m" },
      { t: "-06:30", level: "INFO", msg: "Ashfall advisory for Kagoshima City, light dusting expected" },
      { t: "-10:05", level: "INFO", msg: "Explosion count today: 3 (within seasonal average)" },
      { t: "-1D:14", level: "WARN", msg: "Infrasound array detects slightly elevated blast pressure" },
      { t: "-2D:03", level: "INFO", msg: "JMA alert level unchanged at 3 (do not approach crater)" },
    ],
  },
  {
    code: "POPO-1",
    name: "Popocatépetl",
    region: "Puebla, Mexico",
    coords: "19.02°N 98.62°W",
    elevation: "5,393 m",
    colorCode: "YELLOW",
    summary: "Persistent low-level degassing, occasional ash puffs",
    lastEruption: "2025-09-04",
    population: "~25M within regional fallout zone",
    thermalLabel: "Vent Temp",
    thermalUnit: "°C",
    thermal: series(180, 22, 0.3, 2.4),
    so2: series(2100, 550, 0.33, 0.6),
    tilt: series(1, 1.1, 0.26, 1.8),
    seismicEvents: ints(8, 6, 0.4, 2.1),
    plumeHeightKm: 0.9,
    plumeDirectionDeg: 45,
    logs: [
      { t: "-02:20", level: "INFO", msg: "Low-intensity exhalation, steam and gas, no ash reported" },
      { t: "-08:00", level: "INFO", msg: "24h exhalation count: 14, within background range" },
      { t: "-1D:06", level: "WARN", msg: "Minor ashfall reported in Santiago Xalitzintla" },
      { t: "-2D:19", level: "INFO", msg: "CENAPRED maintains Semáforo Amarillo Fase 2" },
      { t: "-5D:01", level: "INFO", msg: "Glacier monitoring station GLA-3 back online" },
    ],
  },
  {
    code: "AGUNG-3",
    name: "Mount Agung",
    region: "Bali, Indonesia",
    coords: "8.34°S 115.51°E",
    elevation: "3,031 m",
    colorCode: "GREEN",
    summary: "Seismicity within background levels, no surface change",
    lastEruption: "2019-05-16",
    population: "~800K within 30 km",
    thermalLabel: "Vent Temp",
    thermalUnit: "°C",
    thermal: series(95, 8, 0.24, 0.3),
    so2: series(150, 60, 0.3, 1.4),
    tilt: series(0.2, 0.5, 0.2, 0.7),
    seismicEvents: ints(3, 3, 0.36, 0.9),
    plumeHeightKm: 0,
    plumeDirectionDeg: null,
    logs: [
      { t: "-04:00", level: "INFO", msg: "Daily seismicity summary: 2 shallow VT events, background" },
      { t: "-1D:02", level: "INFO", msg: "No visible degassing observed from Rendang observation post" },
      { t: "-3D:15", level: "INFO", msg: "Quarterly gravimeter survey completed, no deformation" },
      { t: "-6D:08", level: "INFO", msg: "PVMBG maintains activity level I (Normal)" },
    ],
  },
];

export const RANGES = [
  { key: "24H", label: "24H", n: 8, span: "24 hours" },
  { key: "7D", label: "7D", n: 16, span: "7 days" },
  { key: "30D", label: "30D", n: 30, span: "30 days" },
] as const;

export type RangeKey = (typeof RANGES)[number]["key"];
