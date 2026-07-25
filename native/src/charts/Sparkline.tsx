// native/src/charts/Sparkline.tsx — first native chart (S6): compact line with no axes/tooltip.
// charts.catalog "Trend Over Time" compact variant. Single accent stroke · static · deterministic.
import { View, StyleSheet } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { tokens } from "../tokens";

// data → "x,y x,y ..." (deterministic: min/max normalization + rounded to 2 decimals). Pure function.
export function sparkPoints(data: number[], width: number, height: number, pad = 2): string {
  if (data.length === 0) return "";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1; // keeps flat series centered without divide-by-zero
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return data
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = pad + innerH * (1 - (v - min) / span); // higher values render higher (toward the top)
      return `${round2(x)},${round2(y)}`;
    })
    .join(" ");
}

type SparklineProps = {
  data: number[];
  width: number;
  height: number;
  accessibilityLabel: string;
  strokeWidth?: number;
};

// Compact line sparkline. Accessibility is consolidated on a single container (inner SVG elements aren't announced individually).
export function Sparkline({ data, width, height, accessibilityLabel, strokeWidth = 2 }: SparklineProps) {
  const points = sparkPoints(data, width, height, strokeWidth);
  return (
    <View
      style={[styles.wrap, { width, height }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={tokens.color.accent}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "stretch", justifyContent: "center" },
});
