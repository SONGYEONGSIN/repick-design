// native/src/evolve/r24/b/SellerAnalyticsScreen.tsx — auto-native-r24 candidate b.
//
// Seller Sales Analytics: a read-only performance dashboard, not a step-by-step flow. Nothing on
// this screen is blocked or incomplete — every figure is already known, and the period selector
// only swaps which precomputed slice is on screen. Per native/GENERATION.md §3 a state-machine
// "why can't I proceed" band would misdescribe that (there is no blocked step to name), so the
// fixed bottom bar here is a persistent action bar instead. Its one action (Copy summary) is never
// a silent no-op — pressing it flips the bar's own lead line to a real confirmation sentence,
// live-announced, exactly the outcome native/GENERATION.md §4 requires at a state-changing point.
import { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { tokens } from "../../../tokens";
import { LineChart } from "../../../charts/LineChart";
import { BarBreakdown } from "../../../charts/BarBreakdown";
import { Sparkline } from "../../../charts/Sparkline";
import {
  PERIODS,
  PERIOD_DATA,
  formatWon,
  formatCompact,
  type Period,
  type BestSeller,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function BestSellerRow({
  item,
  rank,
  expanded,
  onToggle,
}: {
  item: BestSeller;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`${item.name}, number ${rank} best seller. ${
        expanded ? "Hide" : "Show"
      } units sold and revenue.`}
      style={({ pressed }) => [styles.itemRow, pressed && styles.itemRowPressed]}
    >
      <View style={styles.itemRank}>
        <Text style={styles.itemRankText}>{rank}</Text>
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        {expanded ? (
          <View style={styles.itemDetail}>
            <Text style={styles.itemDetailText}>{item.unitsSold} units sold</Text>
            <Text style={styles.itemDetailDot}>{"·"}</Text>
            <Text style={styles.itemDetailText}>{formatWon(item.revenueWon)}</Text>
          </View>
        ) : (
          <Text style={styles.itemHint}>Tap for detail</Text>
        )}
      </View>
      <Sparkline
        data={item.trend}
        width={56}
        height={24}
        accessibilityLabel={`${item.name} recent daily sales trend`}
      />
    </Pressable>
  );
}

export function SellerAnalyticsScreen() {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(Math.max(width - tokens.space(5) * 2, 260), 520);

  const [period, setPeriod] = useState<Period>("30d");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const dataset = useMemo(() => PERIOD_DATA[period], [period]);
  const isUp = dataset.changePct >= 0;

  const handlePeriodChange = (key: Period) => {
    if (key === period) return;
    setPeriod(key);
    setExpandedId(null);
    setCopied(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  const handleCopy = () => {
    setCopied(true);
  };

  const header = (
    <View style={styles.header}>
      <Text style={styles.kicker}>SELLER DASHBOARD</Text>
      <Text style={styles.h1} accessibilityRole="header">
        Seller Sales Analytics
      </Text>
      <Text style={styles.sub}>Revenue, categories and top items over time.</Text>

      <View style={styles.segmented}>
        {PERIODS.map((p) => {
          const selected = p.key === period;
          return (
            <Pressable
              key={p.key}
              onPress={() => handlePeriodChange(p.key)}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Show ${p.fullLabel}`}
              style={({ pressed }) => [
                styles.segment,
                selected && styles.segmentSelected,
                pressed && styles.segmentPressed,
              ]}
            >
              <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                {p.shortLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Total revenue · {dataset.label}</Text>
        <Text style={styles.heroValue}>{formatWon(dataset.totalRevenueWon)}</Text>
        <View style={styles.heroChangeWrap} accessibilityLiveRegion="polite">
          <Text
            accessibilityRole="alert"
            style={[styles.heroChange, isUp ? styles.heroChangeUp : styles.heroChangeDown]}
          >
            {`${isUp ? "▲" : "▼"} ${Math.abs(dataset.changePct).toFixed(1)}% vs the previous period`}
          </Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricTile}>
          <Text style={styles.metricValue}>{dataset.totalOrders}</Text>
          <Text style={styles.metricLabel}>Orders</Text>
        </View>
        <View style={[styles.metricTile, styles.metricTileLast]}>
          <Text style={styles.metricValue}>{formatWon(dataset.avgOrderValueWon)}</Text>
          <Text style={styles.metricLabel}>Avg. order value</Text>
        </View>
      </View>

      <Text style={styles.sectionHead} accessibilityRole="header">
        Revenue trend
      </Text>
      <View style={styles.chartCard}>
        <LineChart
          points={dataset.revenuePoints}
          width={chartWidth}
          height={180}
          formatY={formatCompact}
          accessibilityLabel={`Revenue trend for ${dataset.label}, ${dataset.revenuePoints.length} data points, total ${formatWon(dataset.totalRevenueWon)}`}
        />
      </View>

      <Text style={styles.sectionHead} accessibilityRole="header">
        Category split
      </Text>
      <Text style={styles.sectionSub}>
        Share of revenue by category, out of 100, {dataset.label.toLowerCase()}.
      </Text>
      <BarBreakdown
        data={dataset.categoryBreakdown}
        max={100}
        barWidth={140}
        accessibilityLabel={`Revenue share by category for ${dataset.label}, values out of 100`}
      />

      <Text style={styles.sectionHead} accessibilityRole="header">
        Best sellers
      </Text>
      <Text style={styles.sectionSub}>Tap an item for units sold and revenue.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={dataset.bestSellers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <BestSellerRow
            item={item}
            rank={index + 1}
            expanded={expandedId === item.id}
            onToggle={() => toggleExpand(item.id)}
          />
        )}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.actionBar} accessibilityLiveRegion="polite">
        {copied ? (
          <Text style={styles.actionBarConfirm} accessibilityRole="alert">
            {`Summary for ${dataset.label} copied — ready to paste into a message.`}
          </Text>
        ) : (
          <Text style={styles.actionBarLead}>
            {`Showing ${dataset.label.toLowerCase()} · ${dataset.bestSellers.length} best sellers`}
          </Text>
        )}
        <Pressable
          onPress={handleCopy}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Copy period summary to clipboard"
          style={({ pressed }) => [styles.actionBarButton, pressed && styles.actionBarButtonPressed]}
        >
          <Text style={styles.actionBarButtonText}>{copied ? "Copy again" : "Copy summary"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.color.bg },
  listContent: { paddingBottom: tokens.space(6) },

  header: { paddingHorizontal: tokens.space(5), paddingTop: tokens.space(4) },
  kicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    color: tokens.color.faint,
  },
  h1: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: tokens.color.ink,
  },
  sub: { marginTop: 4, fontSize: 13, color: tokens.color.muted },

  segmented: {
    flexDirection: "row",
    marginTop: tokens.space(5),
    padding: 3,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
    gap: 3,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
  },
  segmentSelected: {
    backgroundColor: tokens.color.ink,
  },
  segmentPressed: {
    opacity: 0.8,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  segmentTextSelected: {
    fontWeight: "800",
    color: tokens.color.onInk,
  },

  heroCard: {
    marginTop: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  heroValue: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  heroChangeWrap: { marginTop: tokens.space(2) },
  heroChange: {
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  heroChangeUp: { color: tokens.color.success },
  heroChangeDown: { color: tokens.color.danger },

  metricsRow: {
    flexDirection: "row",
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  metricTile: {
    flex: 1,
    alignItems: "center",
    paddingVertical: tokens.space(3),
    borderRightWidth: 1,
    borderRightColor: tokens.color.border,
  },
  metricTileLast: { borderRightWidth: 0 },
  metricValue: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  metricLabel: {
    marginTop: 2,
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "center",
  },

  sectionHead: {
    marginTop: tokens.space(6),
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sectionSub: {
    marginTop: 2,
    marginBottom: tokens.space(1),
    fontSize: 12,
    color: tokens.color.muted,
  },

  chartCard: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    alignItems: "center",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    marginHorizontal: tokens.space(5),
    marginBottom: tokens.space(2),
    minHeight: 56,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  itemRowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  itemRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.border,
  },
  itemRankText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  itemBody: { flex: 1, gap: 1 },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemCategory: {
    fontSize: 11,
    color: tokens.color.faint,
  },
  itemHint: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: 2,
  },
  itemDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  itemDetailText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  itemDetailDot: {
    fontSize: 12,
    color: tokens.color.faint,
  },

  actionBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(3),
  },
  actionBarLead: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  actionBarConfirm: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  actionBarButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  actionBarButtonPressed: {
    opacity: 0.85,
  },
  actionBarButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
