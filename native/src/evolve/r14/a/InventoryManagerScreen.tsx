// native/src/evolve/r14/a/InventoryManagerScreen.tsx — auto-native-r14 candidate a.
//
// Bulk Relist / Inventory Manager: a seller's always-on browse-and-manage view over their active
// listings — NOT a blocked workflow with a finish line. The assigned interaction shell is
// multi-select + a contextual batch-action toolbar, new to this native catalog (long-press a row,
// or tap its leading checkbox, to enter selection; the toolbar itself only appears once something
// is selected). Per the round delta, this screen deliberately carries no bottom state-machine
// band — see GENERATION.md §3's read-only/always-available exception, extended here to an
// always-browsable manage screen: there is no "why can't I proceed" to report because there is no
// single path to the end. The selection toolbar is the only "band," and it is present exactly
// when — and only when — it has real batch work to offer.
//
// A11y: exactly one live-region pair on screen (GENERATION.md §4 — never more than one). It lives
// in the slim status line under the header, which is mounted for the screen's whole lifetime, so
// both ends of a transition can be announced through it: entering/leaving selection mode, and
// batch-action results. The toolbar itself carries no separate live region.
export function InventoryManagerScreen() {
  return <InventoryManagerScreenInner />;
}

import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  LISTINGS,
  PRICE_CUT_PERCENT,
  PROCESSING_DELAY_MS,
  cutPrice,
  formatWon,
  formatCount,
  type Listing,
  type ListingStatus,
  type ListingTab,
} from "./data";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

type ActionType = "cut" | "relist" | "takedown";
type PendingAction = { type: ActionType; ids: string[] };

function plural(n: number): string {
  return n === 1 ? "" : "s";
}

function InventoryManagerScreenInner() {
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [tab, setTab] = useState<ListingTab>("all");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmingTakedown, setConfirmingTakedown] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const activeCount = listings.filter((l) => l.status === "active").length;
  const pausedCount = listings.length - activeCount;
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);

  const filtered = listings.filter((l) => {
    if (tab === "active") return l.status === "active";
    if (tab === "paused") return l.status === "paused";
    return true;
  });

  const selectedCount = selectedIds.size;
  const processing = pendingAction !== null;

  function announce(message: string) {
    setAlertMessage(message);
  }

  function enterSelectionMode(initialId?: string) {
    setSelectionMode(true);
    setSelectedIds(initialId ? new Set([initialId]) : new Set());
    setConfirmingTakedown(false);
    announce(
      "Selection mode on. Tap a listing's checkbox to select it, then choose a bulk action below.",
    );
  }

  function exitSelectionMode(message: string) {
    setSelectionMode(false);
    setSelectedIds(new Set());
    setConfirmingTakedown(false);
    announce(message);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleCheckboxPress(id: string) {
    if (processing) return;
    if (selectionMode) {
      toggleSelect(id);
    } else {
      enterSelectionMode(id);
    }
  }

  function handleRowLongPress(id: string) {
    if (processing) return;
    if (selectionMode) {
      toggleSelect(id);
    } else {
      enterSelectionMode(id);
    }
  }

  function handleRowPress(_id: string) {
    if (processing) return;
    if (selectionMode) {
      toggleSelect(_id);
      return;
    }
    // Opening a single listing's own detail/edit screen is a follow-up flow this folder doesn't
    // build. A legitimate no-op placeholder rather than a disabled control — see the round delta
    // note (auto-native-r8 L1): an unbuilt subflow's Pressable stays normal-looking, it just does
    // nothing yet. Selecting listings (checkbox / long-press / header toggle) is fully wired.
  }

  function startCutPrice() {
    if (processing || selectedCount === 0) return;
    setPendingAction({ type: "cut", ids: [...selectedIds] });
  }

  function startRelist() {
    if (processing || selectedCount === 0) return;
    setPendingAction({ type: "relist", ids: [...selectedIds] });
  }

  function askTakedown() {
    if (processing || selectedCount === 0) return;
    setConfirmingTakedown(true);
  }

  function cancelTakedown() {
    setConfirmingTakedown(false);
  }

  function confirmTakedown() {
    const ids = [...selectedIds];
    setConfirmingTakedown(false);
    setPendingAction({ type: "takedown", ids });
  }

  useEffect(() => {
    if (!pendingAction) return;
    const timer = setTimeout(() => {
      const { type, ids } = pendingAction;
      setListings((prev) =>
        prev.map((l) => {
          if (!ids.includes(l.id)) return l;
          if (type === "cut") return { ...l, priceWon: cutPrice(l.priceWon) };
          if (type === "relist") {
            return {
              ...l,
              status: "active" as ListingStatus,
              relisted: true,
              views: 0,
              likes: 0,
              postedLabel: "Relisted just now",
            };
          }
          return { ...l, status: "paused" as ListingStatus };
        }),
      );
      const count = ids.length;
      const message =
        type === "cut"
          ? `Cut price by ${PRICE_CUT_PERCENT}% on ${count} listing${plural(count)}.`
          : type === "relist"
            ? `Relisted ${count} listing${plural(count)} — moved to the top with a fresh view count.`
            : `Took down ${count} listing${plural(count)}. They're paused and hidden from buyers.`;
      setPendingAction(null);
      exitSelectionMode(message);
    }, PROCESSING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pendingAction]);

  const renderTab = (value: ListingTab, label: string, count: number) => {
    const selected = tab === value;
    return (
      <Pressable
        key={value}
        onPress={() => setTab(value)}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${count} listing${plural(count)}`}
        accessibilityState={{ selected }}
        style={({ pressed }) => [
          styles.tabChip,
          selected && styles.tabChipSelected,
          pressed && styles.tabChipPressed,
        ]}
      >
        <Text style={[styles.tabChipText, selected && styles.tabChipTextSelected]}>
          {label} · {count}
        </Text>
      </Pressable>
    );
  };

  const header = (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title} accessibilityRole="header">
          My Listings
        </Text>
        <Pressable
          onPress={() =>
            selectionMode
              ? exitSelectionMode("Selection mode off.")
              : enterSelectionMode()
          }
          disabled={processing}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={selectionMode ? "Cancel selection" : "Select listings"}
          style={({ pressed }) => [
            styles.selectToggle,
            pressed && styles.selectTogglePressed,
            processing && styles.selectToggleDisabled,
          ]}
        >
          <Text style={styles.selectToggleText}>
            {selectionMode ? "Cancel" : "Select"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.statsLine}>
        {activeCount} active · {pausedCount} paused · {formatCount(totalViews)}{" "}
        total views
      </Text>

      <View style={styles.statusRegion} accessibilityLiveRegion="polite">
        {alertMessage ? (
          <Text style={styles.statusAlert} accessibilityRole="alert">
            {alertMessage}
          </Text>
        ) : (
          <Text style={styles.statusHint}>
            Long-press a listing, or tap its checkbox, to select more than one.
          </Text>
        )}
      </View>

      <View style={styles.tabRow}>
        {renderTab("all", "All", listings.length)}
        {renderTab("active", "Active", activeCount)}
        {renderTab("paused", "Paused", pausedCount)}
      </View>
    </View>
  );

  const emptyLabel: Record<ListingTab, { title: string; body: string; goTo: ListingTab; goToLabel: string }> = {
    all: {
      title: "No listings yet",
      body: "Items you list for sale will show up here.",
      goTo: "all",
      goToLabel: "Refresh",
    },
    active: {
      title: "No active listings",
      body: "Relist a paused listing to make it visible to buyers again.",
      goTo: "paused",
      goToLabel: "Go to Paused",
    },
    paused: {
      title: "No paused listings",
      body: "Listings you take down will appear here until you relist them.",
      goTo: "active",
      goToLabel: "Go to Active",
    },
  };

  const renderEmpty = () => {
    const info = emptyLabel[tab];
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>{info.title}</Text>
        <Text style={styles.emptyBody}>{info.body}</Text>
        {info.goTo !== tab && (
          <Pressable
            onPress={() => setTab(info.goTo)}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={info.goToLabel}
            style={({ pressed }) => [
              styles.emptyAction,
              pressed && styles.emptyActionPressed,
            ]}
          >
            <Text style={styles.emptyActionText}>{info.goToLabel}</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: Listing }) => {
    const selected = selectedIds.has(item.id);
    const isActive = item.status === "active";
    return (
      <Pressable
        onPress={() => handleRowPress(item.id)}
        onLongPress={() => handleRowLongPress(item.id)}
        disabled={processing}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${formatWon(item.priceWon)}, ${
          isActive ? "active" : "paused"
        }${selectionMode ? (selected ? ", selected" : ", not selected") : ""}`}
        accessibilityState={selectionMode ? { selected } : undefined}
        style={({ pressed }) => [
          styles.row,
          selected && styles.rowSelected,
          pressed && styles.rowPressed,
        ]}
      >
        <Pressable
          onPress={() => handleCheckboxPress(item.id)}
          disabled={processing}
          hitSlop={HIT_SLOP}
          accessibilityRole="checkbox"
          accessibilityLabel={`Select ${item.title}`}
          accessibilityState={{ checked: selected }}
          style={styles.checkboxTouch}
        >
          <View
            style={[styles.checkbox, selected && styles.checkboxChecked]}
          >
            {selected && <Text style={styles.checkboxGlyph}>{"✓"}</Text>}
          </View>
        </Pressable>

        <View style={styles.thumb}>
          <Text style={styles.thumbGlyph}>{"▤"}</Text>
        </View>

        <View style={styles.rowBody}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.rowCategory} numberOfLines={1}>
            {item.category}
          </Text>

          <View style={styles.rowMetaLine}>
            <Text style={styles.rowPrice}>{formatWon(item.priceWon)}</Text>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusDot,
                  isActive ? styles.statusDotActive : styles.statusDotPaused,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  isActive ? styles.statusTextActive : styles.statusTextPaused,
                ]}
              >
                {isActive ? "Active" : "Paused"}
              </Text>
            </View>
          </View>

          <View style={styles.rowMetaLine}>
            <Text style={styles.rowSubMeta}>
              {formatCount(item.views)} views · {formatCount(item.likes)} likes ·{" "}
              {item.postedLabel}
            </Text>
          </View>

          {item.relisted && (
            <View style={styles.relistedPill}>
              <Text style={styles.relistedPillText}>Relisted</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {selectionMode && selectedCount > 0 && (
        <View style={styles.toolbar}>
          {processing ? (
            <View
              style={styles.processingRow}
              accessibilityRole="button"
              accessibilityState={{ disabled: true, busy: true }}
              accessibilityLabel="Processing bulk action"
            >
              <ActivityIndicator color={tokens.color.onAccent} size="small" />
              <Text style={styles.processingText}>Processing…</Text>
            </View>
          ) : confirmingTakedown ? (
            <>
              <Text style={styles.confirmText}>
                Take down {selectedCount} listing{plural(selectedCount)}? They'll
                be hidden from buyers until you relist them.
              </Text>
              <View style={styles.toolbarButtonRow}>
                <Pressable
                  onPress={cancelTakedown}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel take down"
                  style={({ pressed }) => [
                    styles.toolbarBtn,
                    styles.toolbarBtnOutline,
                    styles.toolbarBtnFlex,
                    pressed && styles.toolbarBtnPressed,
                  ]}
                >
                  <Text style={styles.toolbarBtnOutlineText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={confirmTakedown}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel={`Confirm taking down ${selectedCount} listing${plural(selectedCount)}`}
                  style={({ pressed }) => [
                    styles.toolbarBtn,
                    styles.toolbarBtnSolid,
                    styles.toolbarBtnFlex,
                    pressed && styles.toolbarBtnPressed,
                  ]}
                >
                  <Text style={styles.toolbarBtnSolidText}>Confirm take down</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.selectedCountText}>
                {selectedCount} selected
              </Text>
              <View style={styles.toolbarButtonRow}>
                <Pressable
                  onPress={startCutPrice}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel={`Cut price by ${PRICE_CUT_PERCENT}% on ${selectedCount} selected listing${plural(selectedCount)}`}
                  style={({ pressed }) => [
                    styles.toolbarBtn,
                    styles.toolbarBtnOutline,
                    styles.toolbarBtnFlex,
                    pressed && styles.toolbarBtnPressed,
                  ]}
                >
                  <Text style={styles.toolbarBtnOutlineText}>
                    Cut price {PRICE_CUT_PERCENT}%
                  </Text>
                </Pressable>
                <Pressable
                  onPress={startRelist}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel={`Relist ${selectedCount} selected listing${plural(selectedCount)}`}
                  style={({ pressed }) => [
                    styles.toolbarBtn,
                    styles.toolbarBtnOutline,
                    styles.toolbarBtnFlex,
                    pressed && styles.toolbarBtnPressed,
                  ]}
                >
                  <Text style={styles.toolbarBtnOutlineText}>Relist</Text>
                </Pressable>
                <Pressable
                  onPress={askTakedown}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel={`Take down ${selectedCount} selected listing${plural(selectedCount)}`}
                  style={({ pressed }) => [
                    styles.toolbarBtn,
                    styles.toolbarBtnSolid,
                    styles.toolbarBtnFlex,
                    pressed && styles.toolbarBtnPressed,
                  ]}
                >
                  <Text style={styles.toolbarBtnSolidText}>Take down</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingBottom: tokens.space(8),
    flexGrow: 1,
  },

  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: tokens.color.ink,
  },
  selectToggle: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
  },
  selectTogglePressed: {
    backgroundColor: tokens.color.border,
  },
  selectToggleDisabled: {
    opacity: 0.5,
  },
  selectToggleText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  statsLine: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },

  statusRegion: {
    marginTop: tokens.space(3),
    minHeight: 18,
  },
  statusHint: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  statusAlert: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.accent,
  },

  tabRow: {
    flexDirection: "row",
    gap: tokens.space(2),
    marginTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  tabChip: {
    minHeight: 36,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  tabChipSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  tabChipPressed: {
    opacity: 0.85,
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  tabChipTextSelected: {
    color: tokens.color.onAccent,
  },

  row: {
    flexDirection: "row",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    alignItems: "flex-start",
  },
  rowSelected: {
    backgroundColor: "#eef2ff", // accent-tinted selection wash; only non-token color, kept local
  },
  rowPressed: {
    backgroundColor: tokens.color.border,
  },
  checkboxTouch: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -tokens.space(2),
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  checkboxChecked: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  checkboxGlyph: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },

  thumb: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbGlyph: {
    fontSize: 20,
    color: tokens.color.faint,
  },

  rowBody: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  rowCategory: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  rowMetaLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  rowPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusDotActive: {
    backgroundColor: tokens.color.accent,
  },
  statusDotPaused: {
    backgroundColor: tokens.color.faint,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusTextActive: {
    color: tokens.color.accent,
  },
  statusTextPaused: {
    color: tokens.color.muted,
  },
  rowSubMeta: {
    fontSize: 12,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  relistedPill: {
    alignSelf: "flex-start",
    marginTop: 3,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  relistedPillText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: tokens.color.accent,
    textTransform: "uppercase",
  },

  emptyState: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(8),
    paddingBottom: tokens.space(8),
    alignItems: "center",
    gap: tokens.space(2),
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  emptyBody: {
    fontSize: 13,
    color: tokens.color.muted,
    textAlign: "center",
    lineHeight: 19,
  },
  emptyAction: {
    marginTop: tokens.space(3),
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyActionPressed: {
    backgroundColor: "#eef2ff",
  },
  emptyActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  toolbar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(3),
  },
  selectedCountText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  confirmText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
    fontWeight: "600",
  },
  toolbarButtonRow: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  toolbarBtn: {
    minHeight: 48,
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbarBtnFlex: {
    flex: 1,
  },
  toolbarBtnOutline: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  toolbarBtnOutlineText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: tokens.color.ink2,
    textAlign: "center",
  },
  toolbarBtnSolid: {
    backgroundColor: tokens.color.accent,
  },
  toolbarBtnSolidText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: tokens.color.onAccent,
    textAlign: "center",
  },
  toolbarBtnPressed: {
    opacity: 0.8,
  },

  processingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.space(2),
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink2,
  },
  processingText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
