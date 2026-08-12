import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  BASES,
  BASIS_META,
  MAX_ABS_PCT,
  MAX_SHARE,
  NEXT_WINDOW_WEEKS,
  OWNED_ITEMS,
  READY_NOW,
  READY_NOW_VALUE,
  TOTAL_DELTA,
  TOTAL_NOW,
  TOTAL_PAID,
  TOTAL_PCT,
  basisRank,
  changeOf,
  pctWidth,
  shareOf,
  signedPct,
  signedUsd,
  usd,
  type Basis,
  type OwnedItem,
} from "./data";

const SHAPE_RADIUS = {
  sm: tokens.radius.sm,
  md: tokens.radius.md,
} as const;

function secondaryFor(item: OwnedItem, basis: Basis): string {
  if (basis === "value") return `${Math.round(shareOf(item))}% of total`;
  if (basis === "paid") return `Paid ${usd(item.paid)}`;
  return item.windowLabel;
}

function meterFor(item: OwnedItem, basis: Basis): number {
  if (basis === "value") return (shareOf(item) / MAX_SHARE) * 100;
  if (basis === "paid") return (Math.abs(changeOf(item).pct) / MAX_ABS_PCT) * 100;
  return item.timingScore;
}

function favorableFor(item: OwnedItem, basis: Basis): boolean {
  if (basis === "value") return true;
  if (basis === "paid") return changeOf(item).pct >= 0;
  return item.windowWeeks === 0;
}

export function OwnedGridScreen() {
  const [basis, setBasis] = useState<Basis>("value");
  const [marked, setMarked] = useState<string[]>([]);

  const activeBasis = BASIS_META[basis];

  const ordered = useMemo(() => {
    return OWNED_ITEMS.map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const aMarked = marked.includes(a.item.id) ? 1 : 0;
        const bMarked = marked.includes(b.item.id) ? 1 : 0;
        if (aMarked !== bMarked) return bMarked - aMarked;
        const byRank = basisRank(b.item, basis) - basisRank(a.item, basis);
        if (byRank !== 0) return byRank;
        return a.index - b.index;
      })
      .map((entry) => entry.item);
  }, [basis, marked]);

  const leader = useMemo(() => {
    return OWNED_ITEMS.reduce((best, item) =>
      basisRank(item, basis) > basisRank(best, basis) ? item : best,
    );
  }, [basis]);

  const markedValue = OWNED_ITEMS.filter((item) =>
    marked.includes(item.id),
  ).reduce((sum, item) => sum + item.now, 0);

  const hero =
    basis === "value"
      ? {
          value: usd(TOTAL_NOW),
          caption: "Estimated resale value of everything you still hold",
          chip: `${signedUsd(TOTAL_DELTA)} (${signedPct(TOTAL_PCT)})`,
          up: TOTAL_DELTA >= 0,
          showArrow: true,
        }
      : basis === "paid"
        ? {
            value: signedUsd(TOTAL_DELTA),
            caption: "Net result against what you originally paid",
            chip: signedPct(TOTAL_PCT),
            up: TOTAL_DELTA >= 0,
            showArrow: true,
          }
        : {
            value: usd(READY_NOW_VALUE),
            caption: "Held value already sitting in its best week to sell",
            chip: `${READY_NOW.length} of ${OWNED_ITEMS.length} items`,
            up: true,
            showArrow: false,
          };

  const stats =
    basis === "value"
      ? [
          { label: "Total now", value: usd(TOTAL_NOW) },
          { label: "Vs. paid", value: signedUsd(TOTAL_DELTA) },
          { label: "Items held", value: String(OWNED_ITEMS.length) },
        ]
      : basis === "paid"
        ? [
            { label: "Paid", value: usd(TOTAL_PAID) },
            { label: "Now", value: usd(TOTAL_NOW) },
            { label: "Net", value: signedUsd(TOTAL_DELTA) },
          ]
        : [
            { label: "Sell now", value: `${READY_NOW.length} items` },
            { label: "Worth", value: usd(READY_NOW_VALUE) },
            { label: "Next window", value: `${NEXT_WINDOW_WEEKS} wks` },
          ];

  const toggleMark = (id: string) => {
    setMarked((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  };

  const header = (
    <View style={styles.header}>
      <Text style={styles.title} accessibilityRole="header">
        Owned resale value
      </Text>
      <Text style={styles.subtitle}>
        Eight things you bought through repick, priced as of this week.
      </Text>

      <View style={styles.heroRow}>
        <Text style={styles.heroValue}>{hero.value}</Text>
        <View style={styles.heroChip}>
          {hero.showArrow ? (
            <Text
              style={[styles.chipArrow, hero.up ? styles.up : styles.down]}
            >
              {hero.up ? "▲" : "▼"}
            </Text>
          ) : null}
          <Text style={[styles.chipText, hero.up ? styles.up : styles.down]}>
            {hero.chip}
          </Text>
        </View>
      </View>
      <Text style={styles.heroCaption}>{hero.caption}</Text>

      <View style={styles.statRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      <View
        style={styles.basisRow}
        accessibilityLabel="Choose how the grid is ranked"
      >
        {BASES.map((option) => {
          const selected = option.id === basis;
          return (
            <Pressable
              key={option.id}
              onPress={() => setBasis(option.id)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Rank by ${option.label}`}
              style={({ pressed }) => [
                styles.basisChip,
                selected && styles.basisChipOn,
                pressed && styles.basisChipPressed,
              ]}
            >
              <Text
                style={[styles.basisText, selected && styles.basisTextOn]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.basisCaption}>{activeBasis.caption}</Text>

      <View style={styles.leaderRow}>
        <Text style={styles.leaderLabel}>{activeBasis.leaderPrefix}</Text>
        <Text style={styles.leaderName} numberOfLines={1}>
          {leader.name}
        </Text>
      </View>

      {marked.length > 0 ? (
        <View style={styles.markedBar}>
          <View style={styles.markedTextGroup}>
            <Text style={styles.markedTitle}>
              {`Marked to sell: ${marked.length} of ${OWNED_ITEMS.length}, ${usd(markedValue)}`}
            </Text>
            <Text style={styles.markedNote}>
              Marked things stay at the front of the grid.
            </Text>
          </View>
          <Pressable
            onPress={() => setMarked([])}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Clear every sell mark"
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.clearButtonPressed,
            ]}
          >
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  const renderItem = ({ item }: { item: OwnedItem }) => {
    const change = changeOf(item);
    const isMarked = marked.includes(item.id);
    const favorable = favorableFor(item, basis);
    const meter = pctWidth(meterFor(item, basis));
    const direction = change.up ? "up" : "down";

    return (
      <Pressable
        onPress={() => toggleMark(item.id)}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityState={{ selected: isMarked }}
        accessibilityLabel={`${item.name}, ${item.category}, worth ${usd(
          item.now,
        )} now, ${direction} ${signedPct(change.pct)} against the ${usd(
          item.paid,
        )} you paid. ${item.windowLabel}. ${
          isMarked ? "Marked to sell. Tap to unmark." : "Tap to mark for selling."
        }`}
        style={({ pressed }) => [
          styles.card,
          isMarked && styles.cardMarked,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.shapeBox}>
          <View
            style={[
              styles.shape,
              {
                width: item.shape.w,
                height: item.shape.h,
                borderRadius: SHAPE_RADIUS[item.shape.r],
              },
            ]}
          >
            {item.shape.inner === "dot" ? <View style={styles.shapeDot} /> : null}
            {item.shape.inner === "bar" ? <View style={styles.shapeBar} /> : null}
          </View>
        </View>

        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardCategory} numberOfLines={1}>
          {item.category}
        </Text>

        <Text style={styles.cardNow}>{usd(item.now)}</Text>

        <View style={styles.changeRow}>
          <Text style={[styles.changeArrow, change.up ? styles.up : styles.down]}>
            {change.up ? "▲" : "▼"}
          </Text>
          <Text style={[styles.changePct, change.up ? styles.up : styles.down]}>
            {signedPct(change.pct)}
          </Text>
          <Text style={styles.changeAmount} numberOfLines={1}>
            {signedUsd(change.delta)}
          </Text>
        </View>

        <View style={styles.meterTrack}>
          <View
            style={[
              styles.meterFill,
              favorable ? styles.meterFillOn : styles.meterFillOff,
              { width: meter },
            ]}
          />
        </View>

        <Text style={styles.cardSecondary} numberOfLines={1}>
          {secondaryFor(item, basis)}
        </Text>

        <Text
          style={[styles.cardState, isMarked && styles.cardStateOn]}
          numberOfLines={1}
        >
          {isMarked ? "Marked to sell" : "Tap to mark"}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={ordered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.content}
        ListHeaderComponent={header}
        ListFooterComponent={
          <Text style={styles.footer}>
            Estimates come from the same sweep that prices listings, so the grid
            and the marketplace never disagree.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  content: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(10),
  },
  column: {
    gap: tokens.space(3),
    marginBottom: tokens.space(3),
  },
  header: {
    paddingTop: tokens.space(5),
    paddingBottom: tokens.space(4),
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  heroRow: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    alignItems: "flex-end",
    gap: tokens.space(2),
  },
  heroValue: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.8,
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(1),
    paddingBottom: tokens.space(1),
  },
  chipArrow: {
    fontSize: 11,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  up: {
    color: tokens.color.accent,
  },
  down: {
    color: tokens.color.ink2,
  },
  heroCaption: {
    marginTop: tokens.space(1),
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
  },
  statRow: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    gap: tokens.space(3),
  },
  stat: {
    flex: 1,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  statLabel: {
    fontSize: 11,
    color: tokens.color.faint,
  },
  statValue: {
    marginTop: tokens.space(1),
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  basisRow: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    gap: tokens.space(2),
  },
  basisChip: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  basisChipOn: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  basisChipPressed: {
    borderColor: tokens.color.ink2,
  },
  basisText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  basisTextOn: {
    color: tokens.color.onAccent,
  },
  basisCaption: {
    marginTop: tokens.space(2),
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },
  leaderRow: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    paddingVertical: tokens.space(2),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: tokens.color.border,
  },
  leaderLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: tokens.color.accent,
  },
  leaderName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  markedBar: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    padding: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  markedTextGroup: {
    flex: 1,
  },
  markedTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  markedNote: {
    marginTop: tokens.space(1),
    fontSize: 11,
    color: tokens.color.muted,
  },
  clearButton: {
    minHeight: 44,
    minWidth: 64,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  clearButtonPressed: {
    borderColor: tokens.color.ink2,
  },
  clearText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  card: {
    flex: 1,
    padding: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  cardMarked: {
    borderColor: tokens.color.accent,
  },
  cardPressed: {
    borderColor: tokens.color.ink2,
  },
  shapeBox: {
    height: tokens.space(22),
    alignItems: "center",
    justifyContent: "center",
  },
  shape: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.border,
  },
  shapeDot: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.md,
    borderWidth: 2,
    borderColor: tokens.color.bg,
  },
  shapeBar: {
    width: "52%",
    height: 6,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.bg,
  },
  cardName: {
    marginTop: tokens.space(2),
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: tokens.color.ink,
  },
  cardCategory: {
    marginTop: tokens.space(1),
    fontSize: 11,
    color: tokens.color.faint,
  },
  cardNow: {
    marginTop: tokens.space(2),
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  changeRow: {
    marginTop: tokens.space(1),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(1),
  },
  changeArrow: {
    fontSize: 10,
  },
  changePct: {
    fontSize: 13,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  changeAmount: {
    flex: 1,
    fontSize: 11,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  meterTrack: {
    marginTop: tokens.space(3),
    height: 4,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  meterFill: {
    height: 4,
    borderRadius: tokens.radius.sm,
  },
  meterFillOn: {
    backgroundColor: tokens.color.accent,
  },
  meterFillOff: {
    backgroundColor: tokens.color.faint,
  },
  cardSecondary: {
    marginTop: tokens.space(2),
    fontSize: 12,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  cardState: {
    marginTop: tokens.space(2),
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  cardStateOn: {
    color: tokens.color.accent,
  },
  footer: {
    marginTop: tokens.space(2),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },
});
