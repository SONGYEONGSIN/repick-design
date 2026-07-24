// native/src/charts/BarBreakdown.tsx — S7 Bar: 매칭 근거 분해(가로 막대).
// charts.catalog "Compare Categories". 단일 액센트·값 상시·내림차순·정적·결정론.
import { View, Text, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { tokens } from "../tokens";

export type BarDatum = { label: string; value: number };

// 내림차순 정렬 순수함수(원본 불변 — charts.catalog "always sort descending by value").
export function sortDesc(data: BarDatum[]): BarDatum[] {
  return [...data].sort((a, b) => b.value - a.value);
}

// 채움 폭(결정론: 소수 2자리). value를 [0,max]로 클램프 후 barWidth에 스케일.
export function fillWidth(value: number, max: number, barWidth: number): number {
  const v = Math.max(0, Math.min(value, max));
  return Math.round((v / max) * barWidth * 100) / 100;
}

type Props = { data: BarDatum[]; max?: number; accessibilityLabel: string; barWidth?: number };

export function BarBreakdown({ data, max = 100, accessibilityLabel, barWidth = 120 }: Props) {
  const rows = sortDesc(data);
  const H = 8; // 바 높이
  return (
    <View style={styles.wrap} accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      {rows.map((d) => (
        <View key={d.label} style={styles.row}>
          <Text style={styles.label} numberOfLines={1}>
            {d.label}
          </Text>
          <Svg width={barWidth} height={H}>
            <Rect x={0} y={0} width={barWidth} height={H} rx={H / 2} fill={tokens.color.border} />
            <Rect x={0} y={0} width={fillWidth(d.value, max, barWidth)} height={H} rx={H / 2} fill={tokens.color.accent} />
          </Svg>
          <Text style={styles.value}>{d.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 12, gap: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  label: { width: 52, fontSize: 12, color: tokens.color.muted },
  value: { width: 26, fontSize: 12, fontWeight: "700", color: tokens.color.ink2, fontVariant: ["tabular-nums"], textAlign: "right" },
});
