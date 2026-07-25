import { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { WATCHLIST, formatKRW, priceChange, pctLabel, type WatchItem } from "./data";
import { Sparkline } from "../charts/Sparkline";
import { tokens } from "../tokens";

// Price alert toggle — local state (initial value is a deterministic fixed value from data).
function AlertToggle({ initialOn, title }: { initialOn: boolean; title: string }) {
  const [on, setOn] = useState(initialOn);
  return (
    <Pressable
      onPress={() => setOn((v) => !v)}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={`${title} price alert ${on ? "on" : "off"}`}
      style={[styles.track, on ? styles.trackOn : styles.trackOff]}
    >
      <View style={[styles.thumb, on ? styles.thumbOn : styles.thumbOff]} />
    </Pressable>
  );
}

// Price change badge — drops are highlighted with the accent color, rises/no-change use a subdued outline.
function PriceBadge({ item }: { item: WatchItem }) {
  const change = priceChange(item);
  const box = change.kind === "drop" ? styles.badgeDrop : styles.badgeQuiet;
  const label =
    change.kind === "drop"
      ? styles.badgeDropLabel
      : change.kind === "rise"
        ? styles.badgeRiseLabel
        : styles.badgeFlatLabel;
  return (
    <View style={[styles.badge, box]}>
      <Text style={[styles.badgeLabel, label]}>{change.label}</Text>
    </View>
  );
}

function WatchRow({ item }: { item: WatchItem }) {
  return (
    <View style={styles.card}>
      <Pressable
        style={styles.info}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${item.title}`}
      >
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.current}>{formatKRW(item.current)}</Text>
          <Text style={styles.original}>{formatKRW(item.original)}</Text>
          <View style={styles.trend}>
            <Sparkline
              data={item.priceSeries}
              width={60}
              height={22}
              accessibilityLabel={`${item.title} price trend, last ${item.priceSeries.length} days, change ${pctLabel(item.priceSeries)}`}
            />
            <Text style={styles.trendPct}>{pctLabel(item.priceSeries)}</Text>
          </View>
        </View>
        <View style={styles.badgeWrap}>
          <PriceBadge item={item} />
        </View>
      </Pressable>
      <View style={styles.alertCol}>
        <AlertToggle initialOn={item.alertOn} title={item.title} />
        <Text style={styles.alertCaption}>Price alert</Text>
      </View>
    </View>
  );
}

export function WatchList() {
  const dropCount = WATCHLIST.filter((w) => w.current < w.original).length;
  return (
    <View style={styles.root}>
      <Text style={styles.h1} accessibilityRole="header">
        Watchlist
      </Text>
      <Text style={styles.sub}>
        {WATCHLIST.length} saved items · {dropCount} price drops
      </Text>
      <FlatList
        data={WATCHLIST}
        keyExtractor={(w) => w.id}
        renderItem={({ item }) => <WatchRow item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(14),
  },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint },
  list: { paddingVertical: tokens.space(5), gap: tokens.space(3) },

  // Horizontal card: info block on the left + alert column on the right (distinct from MatchList's vertical stack).
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: "600", color: tokens.color.ink2, lineHeight: 21 },

  // Original vs. current price comparison: current price emphasized + original price strikethrough.
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: tokens.space(2), marginTop: 8 },
  current: { fontSize: 17, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  original: {
    fontSize: 13,
    color: tokens.color.faint,
    textDecorationLine: "line-through",
    fontVariant: ["tabular-nums"],
  },

  // Price trend: right-aligned sparkline + change % text (direction shown by sign, not color — single-accent DNA).
  trend: { marginLeft: "auto", alignSelf: "center", flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  trendPct: { fontSize: 12, fontWeight: "600", color: tokens.color.muted, fontVariant: ["tabular-nums"] },

  badgeWrap: { flexDirection: "row", marginTop: 10 },
  badge: { paddingHorizontal: tokens.space(2), paddingVertical: 3, borderRadius: tokens.radius.sm },
  badgeDrop: { backgroundColor: tokens.color.accent },
  badgeQuiet: { borderWidth: 1, borderColor: tokens.color.border },
  badgeLabel: { fontSize: 12, fontWeight: "700", fontVariant: ["tabular-nums"] },
  badgeDropLabel: { color: tokens.color.onAccent },
  badgeRiseLabel: { color: tokens.color.ink2 },
  badgeFlatLabel: { color: tokens.color.faint },

  // Alert switch: track (radius.md → pill) + thumb (radius.sm → circle), using only token radii.
  alertCol: { alignItems: "center", gap: 6 },
  track: {
    width: 40,
    height: 24,
    borderRadius: tokens.radius.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: tokens.space(1),
  },
  trackOn: { backgroundColor: tokens.color.accent, justifyContent: "flex-end" },
  trackOff: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    justifyContent: "flex-start",
  },
  thumb: { width: 12, height: 12, borderRadius: tokens.radius.sm },
  thumbOn: { backgroundColor: tokens.color.onAccent },
  thumbOff: { backgroundColor: tokens.color.faint },
  alertCaption: { fontSize: 11, color: tokens.color.faint },
});
