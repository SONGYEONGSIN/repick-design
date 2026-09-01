// native/src/evolve/r17/a/components.tsx — presentational pieces for the Seller Performance
// Scorecard. Hand-drawn SVG icons (react-native-svg), no emoji — matches the convention in
// native/src/chat/ChatInbox.tsx.
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { tokens } from "../../../tokens";
import type { MetricTrend, MonthlyRating } from "./data";

/* ───────── trend arrow icon ───────── */

// One shape, mirrored for the opposite direction — keeps the visual vocabulary for "this metric
// moved" consistent no matter which way it moved. Color communicates nothing on its own: the
// caller always pairs this with a text label describing the movement in words.
function TrendArrowIcon({
  direction,
  color,
}: {
  direction: "up" | "down";
  color: string;
}) {
  const d =
    direction === "up"
      ? "M5 15L12 8L19 15M12 8.5V19"
      : "M5 9L12 16L19 9M12 15.5V5";
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d={d}
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ───────── metric card (response time / on-time shipping) ───────── */

export function MetricCard({
  label,
  value,
  trend,
  footnote,
}: {
  label: string;
  value: string;
  trend: MetricTrend;
  footnote: string;
}) {
  const color = trend.improved ? tokens.color.accent : tokens.color.faint;
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <View
        style={styles.trendRow}
        accessible
        accessibilityLabel={`${trend.improved ? "Improved" : "Changed"}: ${trend.label}`}
      >
        <TrendArrowIcon direction={trend.direction} color={color} />
        <Text style={[styles.trendLabel, { color }]}>{trend.label}</Text>
      </View>
      <Text style={styles.metricFootnote}>{footnote}</Text>
    </View>
  );
}

/* ───────── rating summary row ───────── */

export function RatingSummary({
  current,
  trend,
  reviewCount,
}: {
  current: number;
  trend: MetricTrend;
  reviewCount: number;
}) {
  const color = trend.improved ? tokens.color.accent : tokens.color.faint;
  return (
    <View style={styles.ratingSummary}>
      <View style={styles.ratingValueRow}>
        <Text style={styles.ratingValue}>{current.toFixed(2)}</Text>
        <Text style={styles.ratingValueOf}>/ 5.0</Text>
      </View>
      <View
        style={styles.trendRow}
        accessible
        accessibilityLabel={`${trend.improved ? "Improved" : "Changed"}: ${trend.label}`}
      >
        <TrendArrowIcon direction={trend.direction} color={color} />
        <Text style={[styles.trendLabel, { color }]}>{trend.label}</Text>
      </View>
      <Text style={styles.metricFootnote}>
        Based on {reviewCount} reviews in the last 90 days
      </Text>
    </View>
  );
}

/* ───────── monthly detail row (FlatList renderItem) ───────── */

export function MonthDetailRow({ item }: { item: MonthlyRating }) {
  return (
    <View
      style={styles.monthRow}
      accessible
      accessibilityLabel={`${item.monthLabel}: average rating ${item.rating.toFixed(2)} out of 5, from ${item.reviewCount} reviews`}
    >
      <Text style={styles.monthLabel}>{item.monthLabel}</Text>
      <Text style={styles.monthRating}>{item.rating.toFixed(2)}</Text>
      <Text style={styles.monthReviews}>
        {item.reviewCount} review{item.reviewCount === 1 ? "" : "s"}
      </Text>
    </View>
  );
}

export function MonthDetailHeader() {
  return (
    <View style={styles.monthHeadRow}>
      <Text style={styles.monthHeadLabel}>Month</Text>
      <Text style={styles.monthHeadRating}>Rating</Text>
      <Text style={styles.monthHeadReviews}>Reviews</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metricCard: {
    flex: 1,
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    gap: 2,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: "800",
    color: tokens.color.ink,
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: tokens.space(2),
  },
  trendLabel: {
    fontSize: 12,
    fontWeight: "700",
    flexShrink: 1,
  },
  metricFootnote: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: tokens.space(2),
  },

  ratingSummary: {
    marginTop: tokens.space(3),
  },
  ratingValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  ratingValueOf: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.faint,
  },

  monthHeadRow: {
    flexDirection: "row",
    paddingHorizontal: tokens.space(3),
    paddingBottom: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  monthHeadLabel: {
    flex: 1.3,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  monthHeadRating: {
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  monthHeadReviews: {
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
    textAlign: "right",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  monthLabel: {
    flex: 1.3,
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  monthRating: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  monthReviews: {
    flex: 1,
    fontSize: 12,
    color: tokens.color.muted,
    textAlign: "right",
  },
});
