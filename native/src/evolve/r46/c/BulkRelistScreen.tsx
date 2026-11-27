// native/src/evolve/r46/c/BulkRelistScreen.tsx
//
// Ended Listings — a seller's queue of their own listings that ran out without
// selling (expired or drew no offers). Pick any number of them and relist the
// whole batch in one action.
//
// Band shape: a selection-derived contextual tray. It does not exist in the
// tree at all while nothing is picked; it mounts the instant pickedCount > 0,
// and that visibility is read straight off the Set's size (pickedCount > 0),
// never a separate boolean a later edit could leave stale. The tray's primary
// action genuinely relists the batch — picked listings are removed from this
// ended pool (relistedTotal climbs, items leave the list) — not a no-op.
//
// Mutually exclusive with an undo overlay: once relisting succeeds, the tray
// unmounts (pickedCount drops to 0 because the Set is cleared) and a single
// confirmation panel takes its place at the bottom. The two never render
// together, and the screen only ever keeps one accessibilityLiveRegion in the
// tree — whichever of the tray's count text or the confirmation's line is on
// screen carries accessibilityRole="alert" inside it.
import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { ENDED_LISTINGS, type EndedListing } from "./data";

type RelistConfirmation = {
  count: number;
};

function formatKrw(amount: number): string {
  // KRW spelled in Latin letters — sidesteps the ₩-glyph/tabular-nums collision
  // entirely rather than relying on spacing to keep the stroke off the digits.
  return `KRW ${amount.toLocaleString("en-US")}`;
}

export function BulkRelistScreen() {
  const [pool, setPool] = useState<EndedListing[]>(ENDED_LISTINGS);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [confirmation, setConfirmation] = useState<RelistConfirmation | null>(null);
  const [relistedTotal, setRelistedTotal] = useState<number>(0);

  // Derived, not a tracked flag — reading the live Set is what keeps this
  // honest. A boolean sibling state could drift if a future edit forgets to
  // flip it; a derived count cannot.
  const pickedCount = picked.size;
  const trayShown = pickedCount > 0;

  const togglePick = useCallback((id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearPicks = useCallback(() => setPicked(new Set()), []);

  const relistPicked = useCallback(() => {
    const ids = picked;
    if (ids.size === 0) return;
    setPool((prev) => prev.filter((listing) => !ids.has(listing.id)));
    setRelistedTotal((prev) => prev + ids.size);
    setConfirmation({ count: ids.size });
    setPicked(new Set());
  }, [picked]);

  const dismissConfirmation = useCallback(() => setConfirmation(null), []);

  const renderItem = useCallback(
    ({ item }: { item: EndedListing }) => {
      const isPicked = picked.has(item.id);
      const stateWord = isPicked ? "picked" : "not picked";

      return (
        <Pressable
          onPress={() => togglePick(item.id)}
          hitSlop={4}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isPicked }}
          accessibilityLabel={`${item.title}, ${formatKrw(item.originalPrice)}, ${item.endReason}, ${stateWord}`}
          style={({ pressed }) => [styles.row, isPicked && styles.rowPicked, pressed && styles.rowPressed]}
        >
          <View style={[styles.mark, isPicked && styles.markFilled]}>
            {isPicked ? <Text style={styles.markGlyph}>{"✓"}</Text> : null}
          </View>

          <View style={styles.preview}>
            <Text style={styles.previewText}>{item.previewTag}</Text>
          </View>

          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.rowPrice}>{formatKrw(item.originalPrice)}</Text>
            <View style={styles.metaLine}>
              <View
                style={[
                  styles.reasonBadge,
                  item.endReason === "Expired" ? styles.reasonBadgeExpired : styles.reasonBadgeNoOffers,
                ]}
              >
                <Text style={styles.reasonBadgeText}>{item.endReason}</Text>
              </View>
              <Text style={styles.metaText}>Ran {item.daysRun} days</Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [picked, togglePick]
  );

  const subtitle = useMemo(() => {
    if (pool.length === 0) {
      return "All caught up — every ended listing has been relisted.";
    }
    return `${pool.length} listing${pool.length > 1 ? "s" : ""} ended without a sale. Pick any to relist them together.`;
  }, [pool.length]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.heading}>
          Ended Listings
        </Text>
        <Text style={styles.subheading}>{subtitle}</Text>
        {relistedTotal > 0 ? (
          <Text style={styles.tally}>
            {relistedTotal} relisted this session
          </Text>
        ) : null}
      </View>

      <FlatList
        data={pool}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          (trayShown || confirmation) && styles.listContentWithBottomSpace,
          pool.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No ended listings right now.</Text>
          </View>
        }
      />

      {trayShown ? (
        <View style={styles.tray}>
          <View accessibilityLiveRegion="polite" style={styles.trayCountWrap}>
            <Text accessibilityRole="alert" style={styles.trayCountText}>
              {pickedCount} item{pickedCount > 1 ? "s" : ""} picked
            </Text>
          </View>
          <Pressable
            onPress={clearPicks}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Clear picks"
            style={styles.trayGhostButton}
          >
            <Text style={styles.trayGhostButtonText}>Clear</Text>
          </Pressable>
          <Pressable
            onPress={relistPicked}
            accessibilityRole="button"
            accessibilityLabel={`Relist ${pickedCount} item${pickedCount > 1 ? "s" : ""}`}
            style={({ pressed }) => [styles.trayPrimaryButton, pressed && styles.trayPrimaryButtonPressed]}
          >
            <Text style={styles.trayPrimaryButtonText}>Relist {pickedCount} item{pickedCount > 1 ? "s" : ""}</Text>
          </Pressable>
        </View>
      ) : null}

      {!trayShown && confirmation ? (
        <View style={styles.confirmPanel}>
          <View accessibilityLiveRegion="polite" style={styles.confirmTextWrap}>
            <Text accessibilityRole="alert" style={styles.confirmText}>
              Relisted {confirmation.count} listing{confirmation.count > 1 ? "s" : ""}. {confirmation.count > 1 ? "They're" : "It's"} live again in your active inventory.
            </Text>
          </View>
          <Pressable
            onPress={dismissConfirmation}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Dismiss confirmation"
            style={styles.confirmDoneButton}
          >
            <Text style={styles.confirmDoneText}>Done</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export default BulkRelistScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(1),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  tally: {
    marginTop: tokens.space(1),
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: tokens.space(4),
    gap: tokens.space(3),
  },
  listContentWithBottomSpace: {
    paddingBottom: tokens.space(28),
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(10),
  },
  emptyStateText: {
    fontSize: 14,
    color: tokens.color.faint,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    padding: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    minHeight: 44,
  },
  rowPicked: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
    backgroundColor: tokens.color.accentBg,
  },
  rowPressed: {
    opacity: 0.85,
  },
  mark: {
    width: 22,
    height: 22,
    marginTop: tokens.space(1),
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  markFilled: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  markGlyph: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  preview: {
    width: 52,
    height: 52,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.swatch1,
    alignItems: "center",
    justifyContent: "center",
  },
  previewText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  rowInfo: {
    flex: 1,
    gap: tokens.space(1),
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  rowPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    marginTop: tokens.space(1),
  },
  reasonBadge: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  reasonBadgeExpired: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  reasonBadgeNoOffers: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  reasonBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  metaText: {
    fontSize: 12,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  tray: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.ink,
    borderTopLeftRadius: tokens.radius.md,
    borderTopRightRadius: tokens.radius.md,
  },
  trayCountWrap: {
    flexShrink: 1,
  },
  trayCountText: {
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  trayGhostButton: {
    marginLeft: "auto",
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.onInkMuted,
  },
  trayGhostButtonText: {
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "600",
  },
  trayPrimaryButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  trayPrimaryButtonPressed: {
    opacity: 0.8,
  },
  trayPrimaryButtonText: {
    color: tokens.color.onAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  confirmPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.successBg,
    borderTopWidth: 1,
    borderTopColor: tokens.color.successBorder,
  },
  confirmTextWrap: {
    flex: 1,
  },
  confirmText: {
    color: tokens.color.success,
    fontSize: 13,
    fontWeight: "600",
  },
  confirmDoneButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDoneText: {
    color: tokens.color.success,
    fontSize: 13,
    fontWeight: "700",
  },
});
