// native/src/evolve/r30/c/PromoCodeWallet.tsx
//
// Promo Code Wallet — a buyer's collected promo/discount codes, active,
// expiring-soon and expired entries mixed in one list. Supports multi-select
// (any row, any status) to bulk-archive codes out of the wallet view.
//
// Export style: default export (default function PromoCodeWallet()).

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { PROMO_CODES, type PromoCode, type PromoCodeStatus } from "./data";

function statusPresentation(status: PromoCodeStatus): {
  label: string;
  bg: string;
  border: string;
  text: string;
} {
  switch (status) {
    case "active":
      return {
        label: "Active",
        bg: tokens.color.successBg,
        border: tokens.color.successBorder,
        text: tokens.color.success,
      };
    case "expiringSoon":
      return {
        label: "Expiring soon",
        bg: tokens.color.warningBg,
        border: tokens.color.warningBorder,
        text: tokens.color.warning,
      };
    case "expired":
      return {
        label: "Expired",
        bg: tokens.color.bg,
        border: tokens.color.border,
        text: tokens.color.faint,
      };
  }
}

function StatusPill({ status }: { status: PromoCodeStatus }) {
  const presentation = statusPresentation(status);
  return (
    <View
      style={[
        styles.statusPill,
        { backgroundColor: presentation.bg, borderColor: presentation.border },
      ]}
    >
      <Text style={[styles.statusPillText, { color: presentation.text }]}>
        {presentation.label}
      </Text>
    </View>
  );
}

export default function PromoCodeWallet() {
  const [codes, setCodes] = useState<PromoCode[]>(PROMO_CODES);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set<string>(),
  );

  // Derived directly from the Set on every render — never a counter kept in
  // sync by hand, never a boolean toggle.
  const selectedCount = selectedIds.size;

  const expiringSoonCount = useMemo(
    () => codes.filter((c) => c.status === "expiringSoon").length,
    [codes],
  );

  function toggleSelected(id: string) {
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

  function cancelSelection() {
    setSelectedIds(new Set());
  }

  function archiveSelected() {
    setCodes((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
  }

  function renderRow({ item }: { item: PromoCode }) {
    const isSelected = selectedIds.has(item.id);
    return (
      <View style={[styles.codeRow, isSelected && styles.codeRowSelected]}>
        <Pressable
          onPress={() => toggleSelected(item.id)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`${isSelected ? "Deselect" : "Select"} promo code ${item.code}`}
          accessibilityState={{ selected: isSelected }}
          style={({ pressed }) => [
            styles.selectToggle,
            pressed && styles.selectTogglePressed,
          ]}
        >
          <View
            style={[
              styles.selectMark,
              isSelected && styles.selectMarkChecked,
            ]}
          >
            {isSelected ? <Text style={styles.selectMarkGlyph}>✓</Text> : null}
          </View>
        </Pressable>

        <View style={styles.codeBody}>
          <View style={styles.codeHeaderLine}>
            <Text style={styles.codeText}>{item.code}</Text>
            <StatusPill status={item.status} />
          </View>
          <Text style={styles.codeTitleText}>{item.title}</Text>
          <View style={styles.codeValueLine}>
            <Text style={styles.discountText}>{item.discountLabel}</Text>
            {item.minSpendLabel ? (
              <Text style={styles.minSpendText}>{item.minSpendLabel}</Text>
            ) : null}
          </View>
          <Text style={styles.codeMetaText}>
            {item.sourceLabel} · {item.expiryLabel}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerBlock}>
        <Text accessibilityRole="header" style={styles.screenTitle}>
          Promo Code Wallet
        </Text>
        <Text style={styles.screenSubtitle}>
          {codes.length} {codes.length === 1 ? "code" : "codes"} saved ·{" "}
          {expiringSoonCount} expiring soon
        </Text>
      </View>

      <FlatList
        data={codes}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No promo codes saved to this wallet.
          </Text>
        }
      />

      {selectedCount > 0 ? (
        <View style={styles.selectionBar} accessibilityLiveRegion="polite">
          <Text style={styles.selectionCountText} accessibilityRole="alert">
            {selectedCount} {selectedCount === 1 ? "code" : "codes"} selected
          </Text>
          <View style={styles.selectionActionRow}>
            <Pressable
              onPress={cancelSelection}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Cancel selection"
              style={({ pressed }) => [
                styles.cancelAction,
                pressed && styles.cancelActionPressed,
              ]}
            >
              <Text style={styles.cancelActionText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={archiveSelected}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={`Archive ${selectedCount} selected ${selectedCount === 1 ? "code" : "codes"}`}
              style={({ pressed }) => [
                styles.archiveAction,
                pressed && styles.archiveActionPressed,
              ]}
            >
              <Text style={styles.archiveActionText}>Archive</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerBlock: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  screenSubtitle: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(4),
  },
  rowSeparator: {
    height: tokens.space(3),
  },
  emptyText: {
    marginTop: tokens.space(8),
    textAlign: "center",
    fontSize: 14,
    color: tokens.color.faint,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  codeRowSelected: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  selectToggle: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  selectTogglePressed: {
    opacity: 0.6,
  },
  selectMark: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  selectMarkChecked: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  selectMarkGlyph: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  codeBody: {
    flex: 1,
    marginLeft: tokens.space(1),
  },
  codeHeaderLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    letterSpacing: 0.3,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) - 1,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  codeTitleText: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.ink2,
  },
  codeValueLine: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: tokens.space(2),
    columnGap: tokens.space(2),
  },
  discountText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  minSpendText: {
    fontSize: 12,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  codeMetaText: {
    marginTop: tokens.space(2),
    fontSize: 12,
    color: tokens.color.faint,
  },
  selectionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.ink,
    borderTopWidth: 1,
    borderTopColor: tokens.color.ink2,
  },
  selectionCountText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onInk,
    fontVariant: ["tabular-nums"],
  },
  selectionActionRow: {
    flexDirection: "row",
    columnGap: tokens.space(2),
  },
  cancelAction: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
  },
  cancelActionPressed: {
    backgroundColor: tokens.color.ink2,
  },
  cancelActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onInkMuted,
  },
  archiveAction: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  archiveActionPressed: {
    opacity: 0.85,
  },
  archiveActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
