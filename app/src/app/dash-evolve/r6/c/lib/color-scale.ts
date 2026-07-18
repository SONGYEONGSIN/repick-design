import type { MetricId } from "./data";

// 접근성 원칙: 색은 보조 신호일 뿐 — 셀에는 항상 %가 숫자로 인쇄된다(색만으로 정보 전달 금지).
// retention = 인디고, revenue = 에메랄드 램프. 동일 강도 스케일을 매트릭스·범례·스파크라인이 공유한다.
const RAMP: Record<MetricId, [number, number, number]> = {
  retention: [79, 70, 229], // indigo-600
  revenue: [5, 150, 105], // emerald-600
};

export interface CellColor {
  style: { backgroundColor: string };
  isDark: boolean;
}

export function cellColor(value: number, max: number, metric: MetricId): CellColor {
  const intensity = Math.min(1, Math.max(0, value / max));
  const alpha = Math.round((0.08 + intensity * 0.72) * 100) / 100;
  const [r, g, b] = RAMP[metric];
  return {
    style: { backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})` },
    isDark: alpha > 0.5,
  };
}

export function rampSwatch(metric: MetricId, stop: number): string {
  const [r, g, b] = RAMP[metric];
  const alpha = Math.round((0.08 + stop * 0.72) * 100) / 100;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
