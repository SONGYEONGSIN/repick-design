import { Thermometer, Droplets, Gauge, Sun, FlaskConical, TestTube, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { vitals, type Trend } from "./data";

const ICONS: Record<string, typeof Thermometer> = {
  temp: Thermometer,
  humidity: Droplets,
  vpd: Gauge,
  dli: Sun,
  ec: FlaskConical,
  ph: TestTube,
};

const TREND_ICON: Record<Trend, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

function Sparkline({ data }: { data: number[] }) {
  const w = 100;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-full" aria-hidden="true" focusable="false">
      <polyline points={points.join(" ")} fill="none" stroke="var(--lin-sepia)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function VitalsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {vitals.map((v, i) => {
        const Icon = ICONS[v.id];
        const TrendIcon = TREND_ICON[v.trend];
        return (
          <div key={v.id} className={`reveal lin-delay-${i} lin-card flex flex-col gap-3 p-4`}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium leading-tight text-[var(--lin-ink)]">
                {v.label}
                <span className="block text-xs font-normal text-[var(--lin-ink-muted)]">{v.labelKo}</span>
              </h3>
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--lin-sage-deep)]" />
            </div>

            <p className="plate-serif text-3xl italic leading-none text-[var(--lin-ink)]">
              {v.value}
              <span className="ml-1 text-sm not-italic text-[var(--lin-ink-muted)]">{v.unit}</span>
            </p>

            <Sparkline data={v.spark} />

            <div className="flex items-center justify-between gap-2 border-t border-[var(--lin-border)] pt-2">
              <span className="inline-flex items-center gap-1 text-xs text-[var(--lin-ink-muted)]">
                <TrendIcon aria-hidden="true" className="h-3.5 w-3.5" />
                {v.delta}
              </span>
              <span className="text-right text-[11px] leading-tight text-[var(--lin-ink-muted)]">{v.note}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
