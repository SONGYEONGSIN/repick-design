// native/src/evolve/r29/b/DraftListingsScreen.tsx
//
// Draft Listings — a seller's holding area for resale items they started
// listing but haven't published yet.
//
// Band form: selection-driven contextual bar (zero items selected => the bar
// is not in the tree at all; `selectedIds.size > 0` is the only thing that
// puts it there, so it is structurally impossible for it to appear empty).
//
// Real domain logic on top of plain multi-select:
//   1. "Ready to publish" is computed per draft from title + price + condition
//      (see data.ts `isReadyToPublish`) — never a stored/trusted boolean.
//   2. Publishing is honest about a mixed selection: it publishes only the
//      drafts that are actually ready and removes just those from the list,
//      leaving the not-ready drafts selected with an inline count of what
//      was skipped and why, instead of silently doing nothing or pretending
//      the whole batch went through.
//   3. Discarding is destructive, so pressing it does not open a native
//      Alert — the bar itself swaps its action row for a Cancel/Confirm
//      pair inside the same already-live container, so the confirmation
//      copy is announced through the same single live region as the
//      selection count, never a second competing one.
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { tokens } from "../../../tokens";
import {
  DraftListing,
  initialDrafts,
  isReadyToPublish,
  conditionLabel,
  formatPrice,
  swatchIndexFor,
} from "./data";

type DiscardStep = "idle" | "confirming";

const SWATCHES = [tokens.color.swatch1, tokens.color.swatch2, tokens.color.swatch3] as const;

function TickGlyph() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12.5L9.5 18L20 6"
        stroke={tokens.color.onAccent}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HangerGlyph() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="4.2" r="1.5" stroke={tokens.color.onAccent} strokeWidth={1.4} />
      <Path
        d="M12 5.7V7.6"
        stroke={tokens.color.onAccent}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <Path
        d="M12 7.6L3.2 14.6C2.3 15.3 2.8 16.8 3.9 16.8H20.1C21.2 16.8 21.7 15.3 20.8 14.6L12 7.6Z"
        stroke={tokens.color.onAccent}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function DraftListingsScreen() {
  const [drafts, setDrafts] = useState<DraftListing[]>(initialDrafts);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [discardStep, setDiscardStep] = useState<DiscardStep>("idle");
  const [publishNotice, setPublishNotice] = useState<string | null>(null);

  const selectedCount = selectedIds.size;
  const selectedDrafts = drafts.filter((d) => selectedIds.has(d.id));
  const readySelected = selectedDrafts.filter(isReadyToPublish);
  const notReadySelectedCount = selectedCount - readySelected.length;
  const canPublishSome = readySelected.length > 0;
  const allSelectedReady = selectedCount > 0 && notReadySelectedCount === 0;
  const readyTotal = drafts.filter(isReadyToPublish).length;
  const draftWord = selectedCount === 1 ? "draft" : "drafts";

  function toggleSelected(id: string) {
    setDiscardStep("idle");
    setPublishNotice(null);
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

  function requestDiscard() {
    setDiscardStep("confirming");
  }

  function cancelDiscard() {
    setDiscardStep("idle");
  }

  function confirmDiscard() {
    setDrafts((prev) => prev.filter((d) => !selectedIds.has(d.id)));
    setSelectedIds(new Set());
    setDiscardStep("idle");
    setPublishNotice(null);
  }

  function publishSelected() {
    if (!canPublishSome) return;
    const readyIds = new Set(readySelected.map((d) => d.id));
    const remaining = Array.from(selectedIds).filter((id) => !readyIds.has(id));
    setDrafts((prev) => prev.filter((d) => !readyIds.has(d.id)));
    setSelectedIds(new Set(remaining));
    setDiscardStep("idle");
    if (remaining.length > 0) {
      setPublishNotice(
        `Published ${readyIds.size} ${readyIds.size === 1 ? "draft" : "drafts"}. ${remaining.length} still selected ${remaining.length === 1 ? "isn't" : "aren't"} ready yet.`
      );
    } else {
      setPublishNotice(null);
    }
  }

  let liveMessage: string;
  if (discardStep === "confirming") {
    liveMessage = `Discard ${selectedCount} selected ${draftWord}? This can't be undone.`;
  } else if (publishNotice) {
    liveMessage = publishNotice;
  } else {
    liveMessage = `${selectedCount} ${draftWord} selected`;
  }

  function renderItem({ item, index }: { item: DraftListing; index: number }) {
    const checked = selectedIds.has(item.id);
    const ready = isReadyToPublish(item);
    const hasTitle = item.title.trim().length > 0;
    const displayTitle = hasTitle ? item.title : "Untitled draft";
    const hasPrice = item.priceCents !== null && item.priceCents > 0;
    const priceText = hasPrice ? formatPrice(item.priceCents as number) : "Price not set";
    const conditionText = conditionLabel(item.condition);
    const a11yLabel = `${displayTitle}, ${priceText}, ${conditionText}, ${
      ready ? "ready to publish" : "incomplete draft"
    }`;

    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => toggleSelected(item.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          accessibilityLabel={a11yLabel}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={({ pressed }) => [
            styles.toggleCircle,
            checked && styles.toggleCircleOn,
            pressed && styles.toggleCirclePressed,
          ]}
        >
          {checked ? <TickGlyph /> : null}
        </Pressable>

        <View style={[styles.thumbBox, { backgroundColor: SWATCHES[swatchIndexFor(index)] }]}>
          <HangerGlyph />
        </View>

        <View style={styles.cardMain}>
          <View style={styles.cardHeadRow}>
            <Text
              style={[styles.cardTitle, !hasTitle && styles.cardTitlePlaceholder]}
              numberOfLines={1}
            >
              {displayTitle}
            </Text>
            <View style={[styles.readyPill, ready ? styles.readyPillOn : styles.readyPillOff]}>
              <Text
                style={[
                  styles.readyPillText,
                  ready ? styles.readyPillTextOn : styles.readyPillTextOff,
                ]}
              >
                {ready ? "Ready" : "Incomplete"}
              </Text>
            </View>
          </View>

          <Text style={[styles.cardPrice, !hasPrice && styles.cardPriceUnset]}>{priceText}</Text>

          <Text style={styles.cardMeta} numberOfLines={1}>
            {item.category} {"·"} {conditionText} {"·"} {item.photoCount} photo
            {item.photoCount === 1 ? "" : "s"} {"·"} {item.editedNote}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBlock}>
        <Text accessibilityRole="header" style={styles.headerTitle}>
          Draft Listings
        </Text>
        <Text style={styles.headerSubtitle}>
          Finish a title, price, and condition on each draft to make it publishable.
        </Text>
        <Text style={styles.headerStat}>
          {readyTotal} of {drafts.length} draft{drafts.length === 1 ? "" : "s"} ready to publish
        </Text>
      </View>

      <FlatList
        data={drafts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listBody}
        ListEmptyComponent={
          <Text style={styles.emptyNote}>
            No drafts left here {"—"} everything has been published or discarded.
          </Text>
        }
      />

      {selectedCount > 0 ? (
        <View style={styles.contextBar}>
          <View accessibilityLiveRegion="polite" style={styles.liveRegionBox}>
            <Text accessibilityRole="alert" style={styles.liveRegionText}>
              {liveMessage}
            </Text>
          </View>

          {discardStep === "confirming" ? (
            <View style={styles.decisionActions}>
              <Pressable
                onPress={cancelDiscard}
                accessibilityRole="button"
                accessibilityLabel="Cancel discarding selected drafts"
                style={({ pressed }) => [
                  styles.decisionBtn,
                  styles.decisionBtnCancel,
                  pressed && styles.decisionBtnCancelPressed,
                ]}
              >
                <Text style={styles.decisionBtnLabel}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmDiscard}
                accessibilityRole="button"
                accessibilityLabel={`Confirm discarding ${selectedCount} selected ${draftWord}`}
                accessibilityHint="Permanently removes the selected drafts from this list"
                style={({ pressed }) => [
                  styles.decisionBtn,
                  styles.decisionBtnConfirm,
                  pressed && styles.decisionBtnConfirmPressed,
                ]}
              >
                <Text style={styles.decisionBtnLabelOnConfirm}>Confirm</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.barActions}>
              <View style={styles.barButtonRow}>
                <Pressable
                  onPress={publishSelected}
                  disabled={!canPublishSome}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !canPublishSome }}
                  accessibilityLabel={
                    allSelectedReady
                      ? `Publish ${selectedCount} selected ${draftWord}`
                      : canPublishSome
                        ? `Publish ${readySelected.length} ready ${readySelected.length === 1 ? "draft" : "drafts"}, skipping ${notReadySelectedCount} not ready`
                        : "Publish selected, disabled because none of the selected drafts are ready"
                  }
                  accessibilityHint={
                    canPublishSome
                      ? "Removes the ready drafts from this list and marks them published"
                      : undefined
                  }
                  style={({ pressed }) => [
                    styles.barBtn,
                    styles.barBtnPublish,
                    !canPublishSome && styles.barBtnDisabled,
                    pressed && canPublishSome && styles.barBtnPublishPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.barBtnLabel,
                      styles.barBtnLabelOnFill,
                      !canPublishSome && styles.barBtnLabelDisabled,
                    ]}
                  >
                    Publish Selected
                  </Text>
                </Pressable>

                <Pressable
                  onPress={requestDiscard}
                  accessibilityRole="button"
                  accessibilityLabel={`Discard ${selectedCount} selected ${draftWord}`}
                  accessibilityHint="Opens a confirmation step before permanently removing the selected drafts"
                  style={({ pressed }) => [
                    styles.barBtn,
                    styles.barBtnDiscard,
                    pressed && styles.barBtnDiscardPressed,
                  ]}
                >
                  <Text style={[styles.barBtnLabel, styles.barBtnLabelOnOutline]}>
                    Discard Selected
                  </Text>
                </Pressable>
              </View>

              {!allSelectedReady ? (
                <Text style={styles.inlineReason}>
                  {canPublishSome
                    ? `${notReadySelectedCount} selected ${notReadySelectedCount === 1 ? "draft needs" : "drafts need"} a title, price, and condition before it can publish.`
                    : "None of the selected drafts have a title, price, and condition yet."}
                </Text>
              ) : null}
            </View>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerBlock: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(1),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  headerSubtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  headerStat: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  listBody: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: tokens.space(2),
  },
  emptyNote: {
    fontSize: 13,
    color: tokens.color.faint,
    textAlign: "center",
    paddingVertical: tokens.space(6),
  },
  card: {
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
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  toggleCircleOn: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  toggleCirclePressed: {
    opacity: 0.7,
  },
  thumbBox: {
    width: 52,
    height: 52,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  cardMain: {
    flex: 1,
    gap: tokens.space(1),
  },
  cardHeadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: tokens.space(2),
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  cardTitlePlaceholder: {
    color: tokens.color.faint,
    fontStyle: "italic",
  },
  readyPill: {
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
  },
  readyPillOn: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  readyPillOff: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  readyPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  readyPillTextOn: {
    color: tokens.color.success,
  },
  readyPillTextOff: {
    color: tokens.color.warning,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  cardPriceUnset: {
    fontSize: 13,
    fontWeight: "400",
    fontStyle: "italic",
    color: tokens.color.faint,
  },
  cardMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  contextBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(2),
  },
  liveRegionBox: {
    minHeight: 20,
  },
  liveRegionText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  barActions: {
    gap: tokens.space(2),
  },
  barButtonRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  barBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
  },
  barBtnPublish: {
    backgroundColor: tokens.color.accent,
  },
  barBtnPublishPressed: {
    opacity: 0.85,
  },
  barBtnDisabled: {
    backgroundColor: tokens.color.border,
  },
  barBtnDiscard: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
  },
  barBtnDiscardPressed: {
    backgroundColor: tokens.color.dangerBg,
  },
  barBtnLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  barBtnLabelOnFill: {
    color: tokens.color.onAccent,
  },
  barBtnLabelDisabled: {
    color: tokens.color.faint,
  },
  barBtnLabelOnOutline: {
    color: tokens.color.danger,
  },
  inlineReason: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  decisionActions: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  decisionBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  decisionBtnCancel: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  decisionBtnCancelPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  decisionBtnConfirm: {
    backgroundColor: tokens.color.danger,
  },
  decisionBtnConfirmPressed: {
    opacity: 0.85,
  },
  decisionBtnLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  decisionBtnLabelOnConfirm: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});

export { DraftListingsScreen };
