// native/src/detail/PriceDetail.tsx — S8 price history detail screen (full Line/Area chart + tooltip).
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { LineChart } from "../charts/LineChart";
import { DETAIL, formatManwon, formatWon, historyChangePct, pctText } from "./data";
import { tokens } from "../tokens";

export function PriceDetail() {
  const { width } = useWindowDimensions();
  const chartW = Math.min(Math.max(width - tokens.space(5) * 2, 260), 520);
  const pct = historyChangePct(DETAIL.history);
  const start = DETAIL.history[0];

  return (
    <View style={styles.root}>
      <Text style={styles.h1} accessibilityRole="header">
        Price History
      </Text>
      <Text style={styles.title} numberOfLines={2}>
        {DETAIL.title}
      </Text>
      <View style={styles.priceRow}>
        <Text style={styles.current}>{formatWon(DETAIL.current)}</Text>
        <Text style={styles.pct}>{pctText(pct)}</Text>
      </View>
      <Text style={styles.caption}>Last {DETAIL.history.length} days' price trend · Tap the chart to see values</Text>
      <View style={styles.chartCard}>
        <LineChart
          points={DETAIL.history}
          width={chartW}
          height={200}
          formatY={formatManwon}
          accessibilityLabel={`${DETAIL.title} price trend, from ${start.day} ${formatWon(start.price)} to today ${formatWon(DETAIL.current)}, change ${pctText(pct)}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg, paddingHorizontal: tokens.space(5), paddingTop: tokens.space(14) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  title: { marginTop: 10, fontSize: 15, fontWeight: "600", color: tokens.color.ink2, lineHeight: 21 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: tokens.space(2), marginTop: 8 },
  current: { fontSize: 24, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  pct: { fontSize: 14, fontWeight: "700", color: tokens.color.muted, fontVariant: ["tabular-nums"] },
  caption: { marginTop: 4, fontSize: 12, color: tokens.color.faint },
  chartCard: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
});
