// native/src/evolve/r46/b/PriceHistoryScreen.tsx
//
// "Watched Item Price History" — a READ-ONLY RECORD screen, not a gated
// workflow. Per native/GENERATION.md §3: an already-sold-nothing, already-
// recorded history like this has no blocked step to explain, so a
// blocked/ready/done state machine would be structurally wrong here — there
// is no "why can't I proceed" to say. The bottom band is instead a
// persistent, always-available action bar with exactly one control, a
// history sort-order toggle, that does real and checkable work: it reverses
// the order the price points render in, and an onscreen + screen-reader
// confirmation reports the new order. The per-point delta/percent/day-gap
// numbers are precomputed in fixed chronological order in data.ts, so
// toggling the *display* order can never change what those numbers say —
// only which row they sit next to. That is what makes the sort control
// provably correct rather than a decorative shuffle.
//
// To avoid the thin-screen trap this band shape has failed on before, the
// non-interactive rows carry real computed content (KRW delta, percent
// change, and days since the previous price point) rather than being bare
// "date + price" lines with nothing else happening on the screen.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  WATCHED_ITEM,
  PRICE_POINTS,
  REFERENCE_TODAY_ISO,
  buildEnrichedHistory,
  daysBetweenIso,
  formatKRW,
  formatSignedPercent,
  formatHistoryDate,
  kindLabel,
  EnrichedPricePoint,
} from "./data";

type HistoryOrder = "earliestFirst" | "latestFirst";

const ORDER_NOTICE_LIFETIME_MS = 5000;

export default function PriceHistoryScreen() {
  const [historyOrder, setHistoryOrder] = useState<HistoryOrder>("earliestFirst");
  const [orderNotice, setOrderNotice] = useState<string>("");

  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  // Chronological, with delta/percent/day-gap baked in once — the sort
  // control below only ever reorders a copy of this, never recomputes it.
  const chronologicalHistory = useMemo(() => buildEnrichedHistory(PRICE_POINTS), []);

  const visibleHistory = useMemo(() => {
    return historyOrder === "earliestFirst"
      ? chronologicalHistory
      : [...chronologicalHistory].reverse();
  }, [chronologicalHistory, historyOrder]);

  const currentPoint = chronologicalHistory[chronologicalHistory.length - 1];
  const listedPoint = chronologicalHistory[0];

  const summary = useMemo(() => {
    const totalDeltaKRW = currentPoint.priceKRW - listedPoint.priceKRW;
    const totalDeltaPercent = (totalDeltaKRW / listedPoint.priceKRW) * 100;
    const watchedDays = daysBetweenIso(listedPoint.dateISO, REFERENCE_TODAY_ISO);
    const sinceLastChangeDays = daysBetweenIso(currentPoint.dateISO, REFERENCE_TODAY_ISO);
    return { totalDeltaKRW, totalDeltaPercent, watchedDays, sinceLastChangeDays };
  }, [currentPoint, listedPoint]);

  const toggleHistoryOrder = useCallback(() => {
    setHistoryOrder((current) => {
      const next: HistoryOrder = current === "earliestFirst" ? "latestFirst" : "earliestFirst";
      const rangeStart = formatHistoryDate(listedPoint.dateISO);
      const rangeEnd = formatHistoryDate(currentPoint.dateISO);
      const message =
        next === "earliestFirst"
          ? `Showing oldest first: ${chronologicalHistory.length} price points, ${rangeStart} through ${rangeEnd}.`
          : `Showing newest first: ${chronologicalHistory.length} price points, ${rangeEnd} back through ${rangeStart}.`;

      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
      setOrderNotice(message);
      noticeTimerRef.current = setTimeout(() => {
        setOrderNotice((existing) => (existing === message ? "" : existing));
      }, ORDER_NOTICE_LIFETIME_MS);

      return next;
    });
  }, [chronologicalHistory.length, currentPoint.dateISO, listedPoint.dateISO]);

  const renderHistoryRow = useCallback(
    ({ item, index }: { item: EnrichedPricePoint; index: number }) => (
      <HistoryRow point={item} isLastRow={index === visibleHistory.length - 1} />
    ),
    [visibleHistory.length]
  );

  return (
    <SafeAreaView style={styles.screenRoot}>
      <View style={styles.watchHeaderBlock}>
        <Text accessibilityRole="header" style={styles.screenTitle}>
          Price History
        </Text>

        <View style={styles.itemRow}>
          <View style={styles.itemPhotoPlaceholder}>
            <Text style={styles.itemPhotoMark}>{WATCHED_ITEM.placeholderMark}</Text>
          </View>
          <View style={styles.itemTextBlock}>
            <Text style={styles.itemNameText}>{WATCHED_ITEM.name}</Text>
            <Text style={styles.itemMetaText}>
              {WATCHED_ITEM.categoryLabel} · {WATCHED_ITEM.conditionLabel}
            </Text>
            <Text style={styles.watchingSinceText}>
              Watching since {formatHistoryDate(listedPoint.dateISO)} · {summary.watchedDays} days
            </Text>
          </View>
        </View>

        <View style={styles.currentPriceCard}>
          <View style={styles.currentPriceColumn}>
            <Text style={styles.currentPriceLabel}>Current price</Text>
            <Text style={styles.currentPriceValue}>{formatKRW(currentPoint.priceKRW)}</Text>
            <Text style={styles.sinceLastChangeText}>
              Unchanged for {summary.sinceLastChangeDays} days
            </Text>
          </View>
          <View style={styles.totalChangeColumn}>
            <Text style={styles.totalChangeLabel}>Since listed</Text>
            <Text
              style={[
                styles.totalChangeValue,
                summary.totalDeltaKRW < 0 ? styles.changeDownText : styles.changeUpText,
              ]}
            >
              {formatSignedPercent(summary.totalDeltaPercent)}
            </Text>
            <Text style={styles.totalChangeAmountText}>
              {formatKRW(Math.abs(summary.totalDeltaKRW))} {summary.totalDeltaKRW < 0 ? "lower" : "higher"}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.historySectionLabel}>
        Recorded price points ({chronologicalHistory.length})
      </Text>

      <FlatList
        data={visibleHistory}
        keyExtractor={(point) => point.id}
        renderItem={renderHistoryRow}
        extraData={historyOrder}
        contentContainerStyle={styles.historyListContent}
        ListFooterComponent={
          <Text style={styles.historyFootnote}>
            End of recorded history. This item has not sold — repick keeps recording
            price points only while it stays listed and watched.
          </Text>
        }
      />

      {/* One live region for the whole screen, carried by the persistent
          action bar itself: the sort toggle is the only control here whose
          press changes something a screen-reader user needs to be told
          about. The alert role sits only on the confirmation line, not on
          this whole container. */}
      <View style={styles.sortBarContainer} accessibilityLiveRegion="polite">
        <View style={styles.sortBarRow}>
          <View style={styles.sortBarLabelColumn}>
            <Text style={styles.sortBarLabelText}>History order</Text>
            <Text style={styles.sortBarValueText}>
              {historyOrder === "earliestFirst" ? "Oldest first" : "Newest first"}
            </Text>
          </View>
          <Pressable
            onPress={toggleHistoryOrder}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              historyOrder === "earliestFirst"
                ? "Switch price history to newest first"
                : "Switch price history to oldest first"
            }
            accessibilityHint="Reorders the price points list below."
            style={({ pressed }) => [
              styles.sortToggleButton,
              pressed ? styles.sortToggleButtonPressed : null,
            ]}
          >
            <Text style={styles.sortToggleButtonText}>
              {historyOrder === "earliestFirst" ? "Show newest first" : "Show oldest first"}
            </Text>
            <SortDirectionMark pointsUp={historyOrder === "earliestFirst"} />
          </Pressable>
        </View>
        {orderNotice ? (
          <Text style={styles.sortOrderNoticeText} accessibilityRole="alert">
            {orderNotice}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function SortDirectionMark({ pointsUp }: { pointsUp: boolean }) {
  return (
    <View
      style={[styles.sortDirectionMark, pointsUp ? styles.sortDirectionMarkUp : styles.sortDirectionMarkDown]}
    />
  );
}

function HistoryRow({ point, isLastRow }: { point: EnrichedPricePoint; isLastRow: boolean }) {
  const isFirstEver = point.deltaKRW === null;
  return (
    <View style={[styles.historyRow, isLastRow ? styles.historyRowLast : null]}>
      <View style={styles.historyRowTimelineColumn}>
        <View style={styles.historyRowDot} />
        {isLastRow ? null : <View style={styles.historyRowLine} />}
      </View>
      <View style={styles.historyRowBody}>
        <Text style={styles.historyRowDateText}>{formatHistoryDate(point.dateISO)}</Text>
        <Text style={styles.historyRowEventText}>
          {kindLabel(point.kind, isFirstEver)} {formatKRW(point.priceKRW)}
        </Text>
        {isFirstEver ? (
          <Text style={styles.historyRowGapText}>Initial listing price</Text>
        ) : (
          <View style={styles.historyRowDeltaRow}>
            <View
              style={[
                styles.historyRowDeltaBadge,
                point.deltaKRW! < 0 ? styles.historyRowDeltaBadgeDown : styles.historyRowDeltaBadgeUp,
              ]}
            >
              <Text
                style={[
                  styles.historyRowDeltaBadgeText,
                  point.deltaKRW! < 0 ? styles.historyRowDeltaBadgeTextDown : styles.historyRowDeltaBadgeTextUp,
                ]}
              >
                {formatSignedPercent(point.deltaPercent!)}
              </Text>
            </View>
            <Text style={styles.historyRowGapText}>
              {formatKRW(Math.abs(point.deltaKRW!))} {point.deltaKRW! < 0 ? "lower" : "higher"} · {point.daysSincePrevious}{" "}
              {point.daysSincePrevious === 1 ? "day" : "days"} after the previous point
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  watchHeaderBlock: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
  },
  screenTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: "row",
    marginTop: tokens.space(3),
  },
  itemPhotoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.swatch1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  itemPhotoMark: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  itemTextBlock: {
    flex: 1,
    justifyContent: "center",
  },
  itemNameText: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemMetaText: {
    fontSize: 12,
    color: tokens.color.muted,
    marginTop: tokens.space(1) / 2,
  },
  watchingSinceText: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  currentPriceCard: {
    flexDirection: "row",
    marginTop: tokens.space(4),
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  currentPriceColumn: {
    flex: 1,
  },
  totalChangeColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  currentPriceLabel: {
    fontSize: 11,
    color: tokens.color.faint,
  },
  currentPriceValue: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.accent,
    marginTop: tokens.space(1) / 2,
    fontVariant: ["tabular-nums"],
  },
  sinceLastChangeText: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  totalChangeLabel: {
    fontSize: 11,
    color: tokens.color.faint,
  },
  totalChangeValue: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: tokens.space(1) / 2,
    fontVariant: ["tabular-nums"],
  },
  totalChangeAmountText: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  changeDownText: {
    color: tokens.color.success,
  },
  changeUpText: {
    color: tokens.color.warning,
  },
  historySectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    marginTop: tokens.space(4),
    marginBottom: tokens.space(1),
  },
  historyListContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  historyRow: {
    flexDirection: "row",
    paddingTop: tokens.space(2),
  },
  historyRowLast: {
    paddingBottom: tokens.space(1),
  },
  historyRowTimelineColumn: {
    width: 16,
    alignItems: "center",
  },
  historyRowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.color.accent,
    marginTop: tokens.space(1),
  },
  historyRowLine: {
    flex: 1,
    width: 1,
    backgroundColor: tokens.color.border,
    marginTop: tokens.space(1) / 2,
  },
  historyRowBody: {
    flex: 1,
    paddingLeft: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  historyRowDateText: {
    fontSize: 11,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  historyRowEventText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
    marginTop: tokens.space(1) / 2,
    fontVariant: ["tabular-nums"],
  },
  historyRowDeltaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(1),
    flexWrap: "wrap",
  },
  historyRowDeltaBadge: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
    borderRadius: tokens.radius.sm,
    marginRight: tokens.space(2),
    marginBottom: tokens.space(1) / 2,
  },
  historyRowDeltaBadgeDown: {
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
  },
  historyRowDeltaBadgeUp: {
    backgroundColor: tokens.color.warningBg,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
  },
  historyRowDeltaBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  historyRowDeltaBadgeTextDown: {
    color: tokens.color.success,
  },
  historyRowDeltaBadgeTextUp: {
    color: tokens.color.warning,
  },
  historyRowGapText: {
    fontSize: 12,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  historyFootnote: {
    fontSize: 12,
    color: tokens.color.faint,
    textAlign: "center",
    paddingHorizontal: tokens.space(6),
    paddingTop: tokens.space(2),
  },
  sortBarContainer: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  sortBarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortBarLabelColumn: {
    flex: 1,
  },
  sortBarLabelText: {
    fontSize: 11,
    color: tokens.color.faint,
  },
  sortBarValueText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(1) / 2,
  },
  sortToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  sortToggleButtonPressed: {
    opacity: 0.85,
  },
  sortToggleButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
    marginRight: tokens.space(2),
  },
  sortDirectionMark: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  sortDirectionMarkUp: {
    borderBottomWidth: 6,
    borderBottomColor: tokens.color.onAccent,
  },
  sortDirectionMarkDown: {
    borderTopWidth: 6,
    borderTopColor: tokens.color.onAccent,
  },
  sortOrderNoticeText: {
    fontSize: 12,
    color: tokens.color.ink2,
    marginTop: tokens.space(2),
  },
});
