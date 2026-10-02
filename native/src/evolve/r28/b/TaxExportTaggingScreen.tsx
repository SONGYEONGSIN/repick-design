// native/src/evolve/r28/b/TaxExportTaggingScreen.tsx
//
// Tax Export Tagging — a peer-to-peer marketplace screen where a seller/buyer
// tags their completed transactions (sale vs. purchase, each with its own
// tax-category vocabulary) before locking a batch into a 1099-style export.
//
// Band form: selection-driven contextual bar (GENERATION.md §3, third form).
// It exists purely as a derived view of `pickedIds.size > 0` — there is no
// separate boolean toggling it, so it is structurally impossible for the bar
// to show while nothing is selected. There is no undo toast anywhere on this
// screen, so the bar and a toast never compete for the bottom of the screen.
//
// Real domain logic layered on top of plain multi-select, not just the bar
// mechanism:
//   1. Rows already folded into a prior finalized export are `locked` and
//      cannot be selected at all (a business-rule gate, not a style tweak).
//   2. Sale rows and purchase rows have deliberately disjoint tag
//      vocabularies (taxable income / personal sale vs. business expense /
//      personal purchase) — selecting a mix of both collapses the bar's
//      quick-tag chips down to an explanatory message instead of chips.
//   3. The bar's running figure is a real signed sum of the selected rows
//      (sales add, purchases subtract), recomputed from state every render.
//   4. Locking a batch is irreversible, so the bar's primary action turns
//      the bar itself into a Cancel/Confirm row rather than opening a native
//      Alert, and the same live region reads out the confirmation copy.
import React, { useState } from "react";
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
  Transaction,
  Direction,
  initialTransactions,
  formatMoney,
  signedAmountCents,
  directionLabel,
  commonTagOptions,
  nextExportBatchId,
} from "./data";

type LockStep = "idle" | "confirming";

const TAG_TONE: Record<string, { bg: string; border: string; text: string }> = {
  "Taxable Income": {
    bg: tokens.color.warningBg,
    border: tokens.color.warningBorder,
    text: tokens.color.warning,
  },
  "Business Expense": {
    bg: tokens.color.successBg,
    border: tokens.color.successBorder,
    text: tokens.color.success,
  },
  "Personal Sale": {
    bg: tokens.color.bg,
    border: tokens.color.border,
    text: tokens.color.muted,
  },
  "Personal Purchase": {
    bg: tokens.color.bg,
    border: tokens.color.border,
    text: tokens.color.muted,
  },
};

const FALLBACK_TAG_TONE = {
  bg: tokens.color.bg,
  border: tokens.color.border,
  text: tokens.color.muted,
};

export default function TaxExportTaggingScreen() {
  const [rows, setRows] = useState<Transaction[]>(initialTransactions);
  const [pickedIds, setPickedIds] = useState<Set<string>>(new Set());
  const [lockStep, setLockStep] = useState<LockStep>("idle");

  const pickedRows = rows.filter((r) => pickedIds.has(r.id));
  const pickedCount = pickedRows.length;
  const netPickedCents = pickedRows.reduce((sum, r) => sum + signedAmountCents(r), 0);
  const pickedDirections = pickedRows.map((r) => r.direction);
  const isMixedSelection = new Set(pickedDirections).size > 1;
  const sharedTagOptions = commonTagOptions(pickedDirections);
  const everyPickedIsTagged = pickedCount > 0 && pickedRows.every((r) => r.tag !== null);
  const openRows = rows.filter((r) => !r.locked);
  const untaggedOpenCount = openRows.filter((r) => !r.tag).length;
  const upcomingExportId = nextExportBatchId(rows);

  function togglePick(id: string) {
    setLockStep("idle");
    setPickedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function applyTagToPicked(tag: string) {
    setRows((prev) =>
      prev.map((r) => (pickedIds.has(r.id) && !r.locked ? { ...r, tag } : r))
    );
  }

  function requestLock() {
    if (!everyPickedIsTagged) return;
    setLockStep("confirming");
  }

  function cancelLock() {
    setLockStep("idle");
  }

  function confirmLock() {
    const batchId = upcomingExportId;
    setRows((prev) =>
      prev.map((r) =>
        pickedIds.has(r.id) ? { ...r, locked: true, exportBatchId: batchId } : r
      )
    );
    setPickedIds(new Set());
    setLockStep("idle");
  }

  const announcement =
    lockStep === "confirming"
      ? `Lock ${pickedCount} transaction${pickedCount === 1 ? "" : "s"} into export ${upcomingExportId}? This can't be undone.`
      : `${pickedCount} selected · Net ${formatMoney(netPickedCents)}`;

  function renderRow({ item }: { item: Transaction }) {
    const isPicked = pickedIds.has(item.id);
    const tone = item.tag ? TAG_TONE[item.tag] ?? FALLBACK_TAG_TONE : null;
    const amountLabel = `${item.direction === "purchase" ? "-" : "+"}${formatMoney(item.amountCents)}`;
    const accLabel = `${directionLabel(item.direction)}, ${item.counterparty}, ${formatMoney(item.amountCents)}, ${item.tag ?? "untagged"}${
      item.locked ? `, locked, included in export ${item.exportBatchId}` : ""
    }`;

    return (
      <Pressable
        onPress={() => togglePick(item.id)}
        disabled={item.locked}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isPicked, disabled: item.locked }}
        accessibilityLabel={accLabel}
        style={({ pressed }) => [
          styles.row,
          isPicked && styles.rowPicked,
          item.locked && styles.rowLocked,
          pressed && !item.locked && styles.rowPressed,
        ]}
      >
        <View
          style={[
            styles.checkbox,
            isPicked && styles.checkboxChecked,
            item.locked && styles.checkboxLocked,
          ]}
        >
          {isPicked ? <Text style={styles.checkboxMark}>{"✓"}</Text> : null}
        </View>

        <View style={styles.rowBody}>
          <View style={styles.rowTopLine}>
            <Text style={styles.rowCounterparty} numberOfLines={1}>
              {item.counterparty}
            </Text>
            <Text
              style={[
                styles.rowAmount,
                item.direction === "purchase" && styles.rowAmountPurchase,
              ]}
            >
              {amountLabel}
            </Text>
          </View>

          <View style={styles.rowBottomLine}>
            <Text style={styles.rowMeta}>
              {item.date} {"·"} {directionLabel(item.direction)}
            </Text>
            {tone ? (
              <View style={[styles.tagBadge, { backgroundColor: tone.bg, borderColor: tone.border }]}>
                <Text style={[styles.tagBadgeText, { color: tone.text }]}>{item.tag}</Text>
              </View>
            ) : (
              <Text style={styles.rowUntagged}>Untagged</Text>
            )}
          </View>

          {item.locked ? (
            <Text style={styles.rowLockedNote}>
              Locked {"·"} included in export {item.exportBatchId}
            </Text>
          ) : null}
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Tax Export Tagging
        </Text>
        <Text style={styles.subtitle}>
          Tag each completed sale or purchase before you generate your 1099 export.
        </Text>
        <Text style={styles.summaryLine}>
          {untaggedOpenCount} of {openRows.length} open transaction{openRows.length === 1 ? "" : "s"} still need a tag
        </Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        contentContainerStyle={styles.listContent}
      />

      {pickedCount > 0 ? (
        <View style={styles.bar}>
          <View accessibilityLiveRegion="polite" style={styles.announceRegion}>
            <Text accessibilityRole="alert" style={styles.announceText}>
              {announcement}
            </Text>
          </View>

          {lockStep === "confirming" ? (
            <View style={styles.confirmRow}>
              <Pressable
                onPress={cancelLock}
                accessibilityRole="button"
                accessibilityLabel="Cancel locking selected transactions"
                style={({ pressed }) => [
                  styles.barButton,
                  styles.barButtonSecondary,
                  pressed && styles.barButtonSecondaryPressed,
                ]}
              >
                <Text style={styles.barButtonSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmLock}
                accessibilityRole="button"
                accessibilityLabel={`Confirm locking ${pickedCount} transactions into export ${upcomingExportId}`}
                style={({ pressed }) => [
                  styles.barButton,
                  styles.barButtonPrimary,
                  pressed && styles.barButtonPrimaryPressed,
                ]}
              >
                <Text style={styles.barButtonPrimaryText}>Confirm Lock</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {isMixedSelection ? (
                <Text style={styles.mixedNote}>
                  Selection mixes sales and purchases {"—"} tag each group separately.
                </Text>
              ) : sharedTagOptions.length > 0 ? (
                <View style={styles.chipRow}>
                  {sharedTagOptions.map((tag) => {
                    const tone = TAG_TONE[tag] ?? FALLBACK_TAG_TONE;
                    return (
                      <Pressable
                        key={tag}
                        onPress={() => applyTagToPicked(tag)}
                        accessibilityRole="button"
                        accessibilityLabel={`Apply tag ${tag} to ${pickedCount} selected transaction${pickedCount === 1 ? "" : "s"}`}
                        style={({ pressed }) => [
                          styles.chip,
                          { borderColor: tone.border, backgroundColor: tone.bg },
                          pressed && styles.chipPressed,
                        ]}
                      >
                        <Text style={[styles.chipText, { color: tone.text }]}>{tag}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}

              <Pressable
                onPress={requestLock}
                disabled={!everyPickedIsTagged}
                accessibilityRole="button"
                accessibilityLabel={
                  everyPickedIsTagged
                    ? `Lock ${pickedCount} tagged transaction${pickedCount === 1 ? "" : "s"} into export ${upcomingExportId}`
                    : "Lock selected transactions, disabled until every selected row has a tag"
                }
                style={({ pressed }) => [
                  styles.barButton,
                  styles.barButtonPrimary,
                  !everyPickedIsTagged && styles.barButtonDisabled,
                  pressed && everyPickedIsTagged && styles.barButtonPrimaryPressed,
                ]}
              >
                <Text
                  style={[
                    styles.barButtonPrimaryText,
                    !everyPickedIsTagged && styles.barButtonPrimaryTextDisabled,
                  ]}
                >
                  {everyPickedIsTagged ? `Lock ${pickedCount} for Export` : "Tag all selected to continue"}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(1),
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  summaryLine: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: tokens.space(2),
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    minHeight: 44,
  },
  rowPicked: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  rowLocked: {
    opacity: 0.55,
  },
  rowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkboxLocked: {
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.border,
  },
  checkboxMark: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },
  rowBody: {
    flex: 1,
    gap: tokens.space(1),
  },
  rowTopLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: tokens.space(2),
  },
  rowCounterparty: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  rowAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  rowAmountPurchase: {
    color: tokens.color.muted,
  },
  rowBottomLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: tokens.space(2),
  },
  rowMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  rowUntagged: {
    fontSize: 12,
    color: tokens.color.faint,
    fontStyle: "italic",
  },
  rowLockedNote: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  tagBadge: {
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  bar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(2),
  },
  announceRegion: {
    minHeight: 20,
  },
  announceText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  mixedNote: {
    fontSize: 12,
    color: tokens.color.muted,
    paddingVertical: tokens.space(1),
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  chip: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  barButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  barButtonPrimary: {
    backgroundColor: tokens.color.accent,
  },
  barButtonPrimaryPressed: {
    opacity: 0.85,
  },
  barButtonPrimaryText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  barButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  barButtonPrimaryTextDisabled: {
    color: tokens.color.faint,
  },
  barButtonSecondary: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    flex: 1,
  },
  barButtonSecondaryPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  barButtonSecondaryText: {
    color: tokens.color.ink,
    fontSize: 15,
    fontWeight: "600",
  },
  confirmRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
});

export { TaxExportTaggingScreen };
