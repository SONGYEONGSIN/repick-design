"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ClipboardList,
  Flame,
  Minus,
  Mountain,
  Radio,
  Thermometer,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Wind,
} from "lucide-react";
import "./console.css";
import {
  COLOR_CODE_DEFINITION,
  RANGES,
  STATIONS,
  type ColorCode,
  type RangeKey,
  type Station,
} from "./data";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cal-amber)]";

const LED_CLASS: Record<ColorCode, string> = {
  GREEN: "d5-led d5-led--green",
  YELLOW: "d5-led d5-led--yellow",
  ORANGE: "d5-led d5-led--orange",
  RED: "d5-led d5-led--red",
};

const CODE_TEXT_CLASS: Record<ColorCode, string> = {
  GREEN: "text-[var(--cal-green)]",
  YELLOW: "text-[var(--cal-yellow)]",
  ORANGE: "text-[var(--cal-amber)]",
  RED: "text-[var(--cal-red)]",
};

const CODE_VAR: Record<ColorCode, string> = {
  GREEN: "var(--cal-green)",
  YELLOW: "var(--cal-yellow)",
  ORANGE: "var(--cal-amber)",
  RED: "var(--cal-red)",
};

/* ---------- pure chart helpers (deterministic, no randomness) ---------- */

function buildLinePoints(values: number[], w: number, h: number, pad = 6) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / Math.max(values.length - 1, 1);
  return values
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = pad + (1 - (v - min) / span) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function polarPoint(cx: number, cy: number, r: number, bearingDeg: number): [number, number] {
  const mathRad = ((90 - bearingDeg) * Math.PI) / 180;
  return [cx + r * Math.cos(mathRad), cy - r * Math.sin(mathRad)];
}

const COMPASS_TICKS: { label: string; deg: number }[] = [
  { label: "N", deg: 0 },
  { label: "E", deg: 90 },
  { label: "S", deg: 180 },
  { label: "W", deg: 270 },
];

/* precomputed gauge geometry — 4 fixed 45° arcs + 4 fixed needle tips */
const GAUGE_SEGMENTS: { code: ColorCode; d: string }[] = [
  { code: "GREEN", d: "M14,62 A46,46 0 0,1 27.5,29.5" },
  { code: "YELLOW", d: "M27.5,29.5 A46,46 0 0,1 60,16" },
  { code: "ORANGE", d: "M60,16 A46,46 0 0,1 92.5,29.5" },
  { code: "RED", d: "M92.5,29.5 A46,46 0 0,1 106,62" },
];
const GAUGE_NEEDLE_TIP: Record<ColorCode, [number, number]> = {
  GREEN: [26.74, 48.22],
  YELLOW: [46.22, 28.74],
  ORANGE: [73.78, 28.74],
  RED: [93.26, 48.22],
};

/* ---------- small chart primitives ---------- */

function Gauge({ code }: { code: ColorCode }) {
  const tip = GAUGE_NEEDLE_TIP[code];
  return (
    <svg viewBox="0 0 120 70" className="h-24 w-full max-w-[220px]" aria-hidden="true">
      {GAUGE_SEGMENTS.map((seg) => (
        <path
          key={seg.code}
          d={seg.d}
          fill="none"
          stroke={CODE_VAR[seg.code]}
          strokeWidth={12}
          opacity={seg.code === code ? 1 : 0.35}
        />
      ))}
      <line x1={60} y1={62} x2={tip[0]} y2={tip[1]} stroke="var(--cal-text)" strokeWidth={3} strokeLinecap="round" />
      <circle cx={60} cy={62} r={5} fill="var(--cal-bg-panel)" stroke="var(--cal-border-strong)" strokeWidth={2} />
    </svg>
  );
}

function EventBars({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  const w = 100;
  const h = 56;
  const n = values.length;
  const bw = (w / n) * 0.6;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-14 w-full" aria-hidden="true">
      {values.map((v, i) => {
        const bh = (v / max) * (h - 4);
        const x = i * (w / n) + (w / n - bw) / 2;
        const y = h - bh;
        return <rect key={i} x={x} y={y} width={bw} height={bh} fill={color} />;
      })}
    </svg>
  );
}

function LineSpark({ values, color, height = 64 }: { values: number[]; color: string; height?: number }) {
  const w = 200;
  const points = buildLinePoints(values, w, height);
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="h-16 w-full" aria-hidden="true">
      <polygon points={`6,${height - 6} ${points} ${w - 6},${height - 6}`} fill={color} opacity={0.12} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
}

function MiniSpark({ values, color }: { values: number[]; color: string }) {
  const w = 56;
  const h = 20;
  const points = buildLinePoints(values, w, h, 2);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-5 w-14" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

function WindCompass({ heightKm, directionDeg }: { heightKm: number; directionDeg: number | null }) {
  const cx = 60;
  const cy = 60;
  const maxR = 46;
  const active = directionDeg !== null && heightKm > 0;
  const arrowLen = active ? Math.max(0.18, Math.min(heightKm / 6, 1)) * maxR : 0;
  const tip = active ? polarPoint(cx, cy, arrowLen, directionDeg as number) : null;

  return (
    <svg viewBox="0 0 120 120" className="mx-auto h-32 w-32" aria-hidden="true">
      {[16, 31, 46].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--cal-border)" strokeWidth={1} />
      ))}
      {COMPASS_TICKS.map((tick) => {
        const [x, y] = polarPoint(cx, cy, maxR + 8, tick.deg);
        return (
          <text key={tick.label} x={x} y={y} fill="var(--cal-text-dim)" fontSize={8} textAnchor="middle" dominantBaseline="middle">
            {tick.label}
          </text>
        );
      })}
      <circle cx={cx} cy={cy} r={3} fill="var(--cal-text-dim)" />
      {tip && (
        <line x1={cx} y1={cy} x2={tip[0]} y2={tip[1]} stroke="var(--cal-cyan)" strokeWidth={3} strokeLinecap="round" />
      )}
    </svg>
  );
}

/* ---------- header widgets ---------- */

function ClockBadge() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }).format(new Date());
    const tick = () => setNow(format());
    const kickoff = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="flex flex-col items-end leading-tight">
      <span className="text-[10px] uppercase tracking-widest text-[var(--cal-text-dim)]">System Clock</span>
      <span className="font-semibold" aria-hidden="true">
        {now ?? "--:--:--"} <span className="text-[var(--cal-text-dim)]">UTC</span>
      </span>
      <span className="sr-only" role="status">
        {now ? `System clock ${now} UTC` : "System clock loading"}
      </span>
    </div>
  );
}

function NetworkSummary({ stations }: { stations: Station[] }) {
  const counts: Record<ColorCode, number> = { RED: 0, ORANGE: 0, YELLOW: 0, GREEN: 0 };
  for (const s of stations) counts[s.colorCode] += 1;
  const order: ColorCode[] = ["RED", "ORANGE", "YELLOW", "GREEN"];
  return (
    <ul className="hidden items-center gap-3 sm:flex">
      {order.map((code) => (
        <li key={code} className="flex items-center gap-1.5">
          <span className={LED_CLASS[code]} aria-hidden="true" />
          <span>
            {counts[code]} {code}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- main component ---------- */

export default function CalderaConsole() {
  const [selectedCode, setSelectedCode] = useState(STATIONS[0].code);
  const [rangeKey, setRangeKey] = useState<RangeKey>("24H");

  const station = useMemo(
    () => STATIONS.find((s) => s.code === selectedCode) ?? STATIONS[0],
    [selectedCode],
  );
  const range = useMemo(() => RANGES.find((r) => r.key === rangeKey) ?? RANGES[0], [rangeKey]);
  const accent = CODE_VAR[station.colorCode];

  const seismicSlice = station.seismicEvents.slice(-range.n);
  const thermalSlice = station.thermal.slice(-range.n);
  const so2Slice = station.so2.slice(-range.n);
  const tiltSlice = station.tilt.slice(-range.n);

  const thermalNow = station.thermal[station.thermal.length - 1];
  const thermalPrev = station.thermal[station.thermal.length - 2];
  const thermalDelta = Math.round((thermalNow - thermalPrev) * 10) / 10;
  const TrendIcon = thermalDelta > 0.05 ? TrendingUp : thermalDelta < -0.05 ? TrendingDown : Minus;

  const totalEvents = seismicSlice.reduce((a, b) => a + b, 0);

  return (
    <div className="d5-scope min-h-dvh bg-[var(--cal-bg)] font-mono text-[var(--cal-text)] antialiased">
      <a
        href="#d5-main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:bg-[var(--cal-amber)] focus:px-3 focus:py-2 focus:text-black focus:font-bold ${FOCUS_RING}`}
      >
        Skip to console
      </a>

      <header className="d5-scanline sticky top-0 z-20 border-b-2 border-[var(--cal-border-strong)] bg-[var(--cal-bg)]">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Mountain aria-hidden="true" className="h-7 w-7 text-[var(--cal-amber)]" />
            <div>
              <h1 className="text-xl font-bold uppercase leading-none tracking-tight sm:text-2xl">
                CALDERA<span className="text-[var(--cal-amber)]">/OS</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-[var(--cal-text-dim)] sm:text-[11px]">
                Volcanic Network Operations Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <NetworkSummary stations={STATIONS} />
            <ClockBadge />
            <div className="flex items-center gap-2 border-l-2 border-[var(--cal-border)] pl-4">
              <span className="hidden text-right leading-tight text-[var(--cal-text-dim)] sm:block">
                On Duty
                <br />
                J. Tanaka
              </span>
              <span
                aria-hidden="true"
                className="grid h-9 w-9 shrink-0 place-items-center border-2 border-[var(--cal-border-strong)] bg-[var(--cal-bg-raised)] text-xs font-bold"
              >
                JT
              </span>
            </div>
          </div>
        </div>
      </header>

      <nav aria-label="Monitoring stations" className="border-b-2 border-[var(--cal-border)] bg-[var(--cal-bg-raised)]">
        <ul className="mx-auto flex max-w-[1600px] min-w-max list-none overflow-x-auto px-2 sm:px-4">
          {STATIONS.map((s) => {
            const isSelected = s.code === station.code;
            return (
              <li key={s.code} className="min-w-max">
                <button
                  type="button"
                  aria-current={isSelected ? "true" : undefined}
                  onClick={() => setSelectedCode(s.code)}
                  className={`flex min-h-11 items-center gap-2 border-r border-[var(--cal-border)] px-3 py-2 text-left transition-colors ${FOCUS_RING} ${
                    isSelected ? "bg-[var(--cal-bg-panel)]" : "hover:bg-[var(--cal-bg-panel)]/60"
                  }`}
                >
                  <span className={LED_CLASS[s.colorCode]} aria-hidden="true" />
                  <span className="flex flex-col leading-tight">
                    <span className={`text-xs font-bold ${isSelected ? CODE_TEXT_CLASS[s.colorCode] : ""}`}>{s.code}</span>
                    <span className="text-[10px] uppercase tracking-wide text-[var(--cal-text-dim)]">{s.region.split(",")[0]}</span>
                  </span>
                  <MiniSpark values={s.seismicEvents.slice(-12)} color={isSelected ? CODE_VAR[s.colorCode] : "var(--cal-text-dim)"} />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <p aria-live="polite" className="sr-only" role="status">
        {`Now viewing ${station.name} (${station.code}). Aviation colour code ${station.colorCode}: ${COLOR_CODE_DEFINITION[station.colorCode]} Showing ${range.span} of telemetry.`}
      </p>

      <div className="d5-grid-bg">
        <main id="d5-main" className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight sm:text-xl">{station.name}</h2>
              <p className="text-xs uppercase tracking-widest text-[var(--cal-text-dim)]">
                {station.region} · {station.coords} · Elev {station.elevation}
              </p>
            </div>

            <div role="group" aria-label="Time range" className="flex border-2 border-[var(--cal-border-strong)]">
              {RANGES.map((r, i) => {
                const active = r.key === rangeKey;
                return (
                  <button
                    key={r.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRangeKey(r.key)}
                    className={`min-h-11 min-w-14 border-[var(--cal-border-strong)] px-3 text-xs font-bold uppercase tracking-wide transition-colors ${FOCUS_RING} ${
                      i > 0 ? "border-l-2" : ""
                    } ${active ? "bg-[var(--cal-amber)] text-black" : "bg-transparent text-[var(--cal-text-dim)] hover:text-[var(--cal-text)]"}`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="d5-bento">
            {/* ALERT LEVEL */}
            <section aria-labelledby="d5-h-alert" className="d5-panel d5-area-alert flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <TriangleAlert aria-hidden="true" className="h-4 w-4 text-[var(--cal-text-dim)]" />
                <h3 id="d5-h-alert" className="text-xs font-bold uppercase tracking-widest text-[var(--cal-text-dim)]">
                  Alert Level
                </h3>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                <Gauge code={station.colorCode} />
                <p className={`text-2xl font-bold uppercase tracking-wide ${CODE_TEXT_CLASS[station.colorCode]}`}>
                  {station.colorCode}
                </p>
                <p className="max-w-[26ch] text-xs text-[var(--cal-text-dim)]">{COLOR_CODE_DEFINITION[station.colorCode]}</p>
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t-2 border-[var(--cal-border)] pt-3 text-[11px]">
                <div>
                  <dt className="uppercase text-[var(--cal-text-dim)]">Last Eruption</dt>
                  <dd className="font-semibold">{station.lastEruption}</dd>
                </div>
                <div>
                  <dt className="uppercase text-[var(--cal-text-dim)]">Population</dt>
                  <dd className="font-semibold">{station.population}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="uppercase text-[var(--cal-text-dim)]">Status</dt>
                  <dd className="font-semibold">{station.summary}</dd>
                </div>
              </dl>
            </section>

            {/* SEISMIC ACTIVITY */}
            <section aria-labelledby="d5-h-seismic" className="d5-panel d5-area-seismic flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Activity aria-hidden="true" className="h-4 w-4 text-[var(--cal-text-dim)]" />
                  <h3 id="d5-h-seismic" className="text-xs font-bold uppercase tracking-widest text-[var(--cal-text-dim)]">
                    Seismic Activity
                  </h3>
                </div>
                <p className="text-[11px] uppercase text-[var(--cal-text-dim)]">Last {range.span}</p>
              </div>
              <p className="text-3xl font-bold">
                {totalEvents}
                <span className="ml-1 text-xs font-normal uppercase text-[var(--cal-text-dim)]">events recorded</span>
              </p>
              <EventBars values={seismicSlice} color={accent} />
              <div className="flex justify-between text-[10px] uppercase text-[var(--cal-text-dim)]">
                <span>−{range.span}</span>
                <span>now</span>
              </div>
            </section>

            {/* THERMAL */}
            <section aria-labelledby="d5-h-thermal" className="d5-panel d5-area-thermal flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Thermometer aria-hidden="true" className="h-4 w-4 text-[var(--cal-text-dim)]" />
                <h3 id="d5-h-thermal" className="text-xs font-bold uppercase tracking-widest text-[var(--cal-text-dim)]">
                  {station.thermalLabel}
                </h3>
              </div>
              <p className="flex items-baseline gap-2 text-2xl font-bold">
                {thermalNow}
                {station.thermalUnit}
                <span className={`flex items-center gap-1 text-xs font-semibold ${thermalDelta > 0.05 ? "text-[var(--cal-amber)]" : thermalDelta < -0.05 ? "text-[var(--cal-cyan)]" : "text-[var(--cal-text-dim)]"}`}>
                  <TrendIcon aria-hidden="true" className="h-3.5 w-3.5" />
                  {thermalDelta > 0 ? "+" : ""}
                  {thermalDelta}
                </span>
              </p>
              <LineSpark values={thermalSlice} color="var(--cal-amber)" />
            </section>

            {/* GAS EMISSIONS */}
            <section aria-labelledby="d5-h-gas" className="d5-panel d5-area-gas flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Flame aria-hidden="true" className="h-4 w-4 text-[var(--cal-text-dim)]" />
                <h3 id="d5-h-gas" className="text-xs font-bold uppercase tracking-widest text-[var(--cal-text-dim)]">
                  SO₂ Flux
                </h3>
              </div>
              <p className="text-2xl font-bold">
                {station.so2[station.so2.length - 1].toLocaleString("en-US")}
                <span className="ml-1 text-xs font-normal uppercase text-[var(--cal-text-dim)]">t / day</span>
              </p>
              <LineSpark values={so2Slice} color="var(--cal-red)" />
            </section>

            {/* GROUND DEFORMATION */}
            <section aria-labelledby="d5-h-deform" className="d5-panel d5-area-deform flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Radio aria-hidden="true" className="h-4 w-4 text-[var(--cal-text-dim)]" />
                <h3 id="d5-h-deform" className="text-xs font-bold uppercase tracking-widest text-[var(--cal-text-dim)]">
                  Ground Deformation
                </h3>
              </div>
              <p className="text-2xl font-bold">
                {station.tilt[station.tilt.length - 1]}
                <span className="ml-1 text-xs font-normal uppercase text-[var(--cal-text-dim)]">µrad tilt</span>
              </p>
              <LineSpark values={tiltSlice} color="var(--cal-cyan)" />
            </section>

            {/* ASH PLUME */}
            <section aria-labelledby="d5-h-plume" className="d5-panel d5-area-plume flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Wind aria-hidden="true" className="h-4 w-4 text-[var(--cal-text-dim)]" />
                <h3 id="d5-h-plume" className="text-xs font-bold uppercase tracking-widest text-[var(--cal-text-dim)]">
                  Ash Plume Dispersion
                </h3>
              </div>
              <WindCompass heightKm={station.plumeHeightKm} directionDeg={station.plumeDirectionDeg} />
              <p className="text-center text-xs text-[var(--cal-text-dim)]">
                {station.plumeHeightKm > 0 && station.plumeDirectionDeg !== null
                  ? `${station.plumeHeightKm} km altitude · bearing ${station.plumeDirectionDeg}°`
                  : "No emission detected"}
              </p>
            </section>

            {/* STATION LOG */}
            <section aria-labelledby="d5-h-log" className="d5-panel d5-area-log flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <ClipboardList aria-hidden="true" className="h-4 w-4 text-[var(--cal-text-dim)]" />
                <h3 id="d5-h-log" className="text-xs font-bold uppercase tracking-widest text-[var(--cal-text-dim)]">
                  Station Log
                </h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <caption className="sr-only">
                    Recent monitoring log entries for {station.name}, most recent first
                  </caption>
                  <thead>
                    <tr className="border-b-2 border-[var(--cal-border)] text-[10px] uppercase tracking-widest text-[var(--cal-text-dim)]">
                      <th scope="col" className="w-20 py-2 pr-2 font-bold">T-</th>
                      <th scope="col" className="w-16 py-2 pr-2 font-bold">Level</th>
                      <th scope="col" className="py-2 font-bold">Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {station.logs.map((entry, i) => (
                      <tr
                        key={`${station.code}-${i}`}
                        data-level={entry.level}
                        className="d5-log-row border-b border-[var(--cal-border)] align-top last:border-none"
                      >
                        <td className="py-2 pl-2 pr-2 text-[var(--cal-text-dim)]">{entry.t}</td>
                        <td className="py-2 pr-2 font-bold">
                          <span
                            className={
                              entry.level === "CRIT"
                                ? "text-[var(--cal-red)]"
                                : entry.level === "WARN"
                                  ? "text-[var(--cal-amber)]"
                                  : "text-[var(--cal-text-dim)]"
                            }
                          >
                            {entry.level}
                          </span>
                        </td>
                        <td className="py-2 pr-2">{entry.msg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <footer className="mt-4 border-t-2 border-[var(--cal-border)] pt-3 text-[10px] uppercase tracking-widest text-[var(--cal-text-dim)]">
            <p>Station telemetry: static snapshot, not a live feed · System clock: live · Demonstration data only</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
