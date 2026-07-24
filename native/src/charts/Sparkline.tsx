// native/src/charts/Sparkline.tsx — 첫 native 차트(S6): 축·툴팁 없는 압축 라인.
// charts.catalog "Trend Over Time" 압축형. 단일 액센트 stroke·정적·결정론.
import { View, StyleSheet } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { tokens } from "../tokens";

// data → "x,y x,y ..." (결정론: min/max 정규화 + 소수 2자리 반올림). 순수 함수.
export function sparkPoints(data: number[], width: number, height: number, pad = 2): string {
  if (data.length === 0) return "";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1; // 평평한 계열도 0-나눗셈 없이 중앙선
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return data
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = pad + innerH * (1 - (v - min) / span); // 값이 클수록 위로
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

// compact 라인 스파크라인. 컨테이너 하나로 a11y 통합(내부 SVG 요소 개별 낭독 X).
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
