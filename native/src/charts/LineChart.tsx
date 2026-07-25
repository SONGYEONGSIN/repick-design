// native/src/charts/LineChart.tsx — S8 full Line/Area: axes, ticks, area fill + touch tooltip.
// charts.catalog "Trend Over Time". Single accent · low-opacity area · static · deterministic.
import { useMemo, useRef, useState } from "react";
import { View, PanResponder, StyleSheet, type GestureResponderEvent } from "react-native";
import Svg, { Polyline, Polygon, Line, Circle, Rect, Text as SvgText } from "react-native-svg";
import { tokens } from "../tokens";

export type PricePoint = { day: string; price: number };

const PAD = { l: 46, r: 10, t: 12, b: 22 } as const;
const round2 = (n: number) => Math.round(n * 100) / 100;

// Deterministic scale/nearest-index — pure functions (testable).
export function makeScales(prices: number[], width: number, height: number) {
  const n = prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const innerW = width - PAD.l - PAD.r;
  const innerH = height - PAD.t - PAD.b;
  const stepX = n > 1 ? innerW / (n - 1) : 0;
  const baseline = PAD.t + innerH;
  const scaleX = (i: number) => round2(PAD.l + stepX * i);
  const scaleY = (v: number) => round2(PAD.t + innerH * (1 - (v - min) / span));
  return { n, min, max, innerW, innerH, stepX, baseline, scaleX, scaleY };
}

export function nearestIndex(locationX: number, n: number, width: number): number {
  const innerW = width - PAD.l - PAD.r;
  const stepX = n > 1 ? innerW / (n - 1) : 0;
  if (stepX === 0) return 0;
  const idx = Math.round((locationX - PAD.l) / stepX);
  return Math.max(0, Math.min(idx, n - 1));
}

type Props = {
  points: PricePoint[];
  width: number;
  height: number;
  accessibilityLabel: string;
  formatY?: (n: number) => string;
};

export function LineChart({ points, width, height, accessibilityLabel, formatY = String }: Props) {
  const prices = useMemo(() => points.map((p) => p.price), [points]);
  const s = useMemo(() => makeScales(prices, width, height), [prices, width, height]);
  const [active, setActive] = useState(points.length - 1); // defaults to the latest point

  const onTouch = (e: GestureResponderEvent) => setActive(nearestIndex(e.nativeEvent.locationX, s.n, width));
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: onTouch,
      onPanResponderMove: onTouch,
    }),
  ).current;

  const linePts = points.map((p, i) => `${s.scaleX(i)},${s.scaleY(p.price)}`).join(" ");
  const areaPts = `${s.scaleX(0)},${round2(s.baseline)} ${linePts} ${s.scaleX(s.n - 1)},${round2(s.baseline)}`;
  const yTicks = [s.max, round2((s.min + s.max) / 2), s.min];
  const xIdx = [0, Math.floor((s.n - 1) / 2), s.n - 1];

  const ax = s.scaleX(active);
  const ay = s.scaleY(points[active].price);
  const bw = 96;
  const bh = 32;
  const bx = Math.max(PAD.l, Math.min(ax - bw / 2, width - PAD.r - bw));
  const by = ay - bh - 8 < PAD.t ? ay + 8 : ay - bh - 8;

  return (
    <View
      style={[styles.wrap, { width, height }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      {...pan.panHandlers}
    >
      <Svg width={width} height={height}>
        {/* Y grid + ticks */}
        {yTicks.map((t, i) => {
          const y = s.scaleY(t);
          return (
            <Line key={`g${i}`} x1={PAD.l} y1={y} x2={PAD.l + s.innerW} y2={y} stroke={tokens.color.border} strokeWidth={1} />
          );
        })}
        {yTicks.map((t, i) => (
          <SvgText key={`yl${i}`} x={PAD.l - 6} y={s.scaleY(t) + 3} fill={tokens.color.faint} fontSize={10} textAnchor="end">
            {formatY(t)}
          </SvgText>
        ))}
        {/* Area + line */}
        <Polygon points={areaPts} fill={tokens.color.accent} fillOpacity={0.14} />
        <Polyline points={linePts} fill="none" stroke={tokens.color.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {/* X labels */}
        {xIdx.map((idx, i) => (
          <SvgText key={`xl${i}`} x={s.scaleX(idx)} y={height - 6} fill={tokens.color.faint} fontSize={10} textAnchor="middle">
            {points[idx].day}
          </SvgText>
        ))}
        {/* Tooltip: crosshair + dot + value bubble */}
        <Line x1={ax} y1={PAD.t} x2={ax} y2={s.baseline} stroke={tokens.color.faint} strokeWidth={1} strokeDasharray="3 3" />
        <Circle cx={ax} cy={ay} r={3.5} fill={tokens.color.accent} />
        <Rect x={bx} y={by} width={bw} height={bh} rx={6} fill={tokens.color.ink} />
        <SvgText x={bx + 8} y={by + 13} fill={tokens.color.faint} fontSize={10}>
          {points[active].day}
        </SvgText>
        <SvgText x={bx + 8} y={by + 26} fill="#ffffff" fontSize={12} fontWeight="700">
          {formatY(points[active].price)}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: "stretch" },
});
