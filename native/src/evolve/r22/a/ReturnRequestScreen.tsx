// native/src/evolve/r22/a/ReturnRequestScreen.tsx
// "Return & Refund Request" — buyer-facing, blocked-workflow bottom-band state machine.
//
// Flow: (1) check off which item(s) from the order to return, (2) pick exactly one
// return reason, (3) attach real (simulated) photo evidence for each item you're
// returning. Submission stays blocked — and the bottom band says exactly why — until
// all three are resolved; tapping the band while blocked jumps straight to the first
// unresolved row.

import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ListRenderItemInfo,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ORDER,
  LINE_ITEMS,
  REASONS,
  MAX_PHOTOS_PER_ITEM,
  RETURN_WINDOW_DAYS_LEFT,
  estimateRefundFor,
  formatKRW,
  ReturnLineItem,
  ReturnReason,
  ReturnReasonId,
} from "./data";

// ---- Row model for the single scrollable FlatList (header, sections, band-jump targets) ----

type Row =
  | { key: "proof"; kind: "proof" }
  | { key: string; kind: "sectionTitle"; title: string; required: boolean; helper: string }
  | { key: string; kind: "item"; item: ReturnLineItem }
  | { key: string; kind: "reason"; reason: ReturnReason }
  | { key: "photo-empty"; kind: "photoEmpty" }
  | { key: string; kind: "photoSlot"; item: ReturnLineItem }
  | { key: "footer"; kind: "footer" };

type BlockState =
  | { status: "blocked-items"; message: string; targetKey: string }
  | { status: "blocked-reason"; message: string; targetKey: string }
  | { status: "blocked-photos"; message: string; targetKey: string }
  | { status: "ready"; message: string }
  | { status: "submitting"; message: string }
  | { status: "submitted"; message: string };

export default function ReturnRequestScreen() {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState<ReturnReasonId | null>(null);
  const [photosByItemId, setPhotosByItemId] = useState<Record<string, number>>({});
  const [highlightKey, setHighlightKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const listRef = useRef<FlatList<Row>>(null);

  const toggleItem = useCallback((id: string) => {
    setHighlightKey(null);
    setSelectedItemIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const pickReason = useCallback((id: ReturnReasonId) => {
    setHighlightKey(null);
    setSelectedReason(id);
  }, []);

  const addPhoto = useCallback((itemId: string) => {
    setHighlightKey(null);
    setPhotosByItemId((prev) => {
      const current = prev[itemId] ?? 0;
      if (current >= MAX_PHOTOS_PER_ITEM) return prev;
      return { ...prev, [itemId]: current + 1 };
    });
  }, []);

  const removePhoto = useCallback((itemId: string) => {
    setPhotosByItemId((prev) => {
      const current = prev[itemId] ?? 0;
      if (current <= 0) return prev;
      return { ...prev, [itemId]: current - 1 };
    });
  }, []);

  // Clear a stale highlight automatically so it never lingers as false guidance.
  useEffect(() => {
    if (!highlightKey) return;
    const t = setTimeout(() => setHighlightKey(null), 2400);
    return () => clearTimeout(t);
  }, [highlightKey]);

  const selectedItems = useMemo(
    () => LINE_ITEMS.filter((it) => selectedItemIds.includes(it.id)),
    [selectedItemIds]
  );

  const itemsMissingPhoto = useMemo(
    () => selectedItems.filter((it) => (photosByItemId[it.id] ?? 0) === 0),
    [selectedItems, photosByItemId]
  );

  const refundEstimate = useMemo(
    () => estimateRefundFor(LINE_ITEMS, selectedItemIds),
    [selectedItemIds]
  );

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [{ key: "proof", kind: "proof" }];
    out.push({
      key: "items-title",
      kind: "sectionTitle",
      title: "Items to return",
      required: true,
      helper: "Select at least one item from this order.",
    });
    for (const item of LINE_ITEMS) out.push({ key: `item-${item.id}`, kind: "item", item });

    out.push({
      key: "reason-title",
      kind: "sectionTitle",
      title: "Return reason",
      required: true,
      helper: "Choose the one reason that best fits.",
    });
    for (const reason of REASONS) out.push({ key: `reason-${reason.id}`, kind: "reason", reason });

    out.push({
      key: "photo-title",
      kind: "sectionTitle",
      title: "Photo evidence",
      required: true,
      helper: "At least one photo per returned item, so the seller can review the claim.",
    });
    if (selectedItems.length === 0) {
      out.push({ key: "photo-empty", kind: "photoEmpty" });
    } else {
      for (const item of selectedItems) out.push({ key: `photo-${item.id}`, kind: "photoSlot", item });
    }

    out.push({ key: "footer", kind: "footer" });
    return out;
  }, [selectedItems]);

  const rowIndexByKey = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((r, i) => {
      map[r.key] = i;
    });
    return map;
  }, [rows]);

  const blockState: BlockState = useMemo(() => {
    if (submitted) {
      return {
        status: "submitted",
        message: `Return request submitted for ${selectedItemIds.length} item${
          selectedItemIds.length === 1 ? "" : "s"
        }. We'll review it and email you within 2 business days.`,
      };
    }
    if (submitting) {
      return { status: "submitting", message: "Submitting your return request…" };
    }
    if (selectedItemIds.length === 0) {
      return {
        status: "blocked-items",
        message: "Check off at least one item below before you can request a return.",
        targetKey: `item-${LINE_ITEMS[0].id}`,
      };
    }
    if (!selectedReason) {
      return {
        status: "blocked-reason",
        message: `Pick one return reason for the ${selectedItemIds.length} item${
          selectedItemIds.length === 1 ? "" : "s"
        } you selected.`,
        targetKey: `reason-${REASONS[0].id}`,
      };
    }
    if (itemsMissingPhoto.length > 0) {
      const first = itemsMissingPhoto[0];
      const extra = itemsMissingPhoto.length - 1;
      return {
        status: "blocked-photos",
        message:
          extra > 0
            ? `Add a photo of the issue for "${first.title}" and ${extra} other item${
                extra === 1 ? "" : "s"
              } before you can submit.`
            : `Add a photo of the issue for "${first.title}" before you can submit.`,
        targetKey: `photo-${first.id}`,
      };
    }
    return {
      status: "ready",
      message: `Ready to submit — review the ${selectedItemIds.length} item${
        selectedItemIds.length === 1 ? "" : "s"
      } above, then send your request.`,
    };
  }, [submitted, submitting, selectedItemIds, selectedReason, itemsMissingPhoto]);

  const jumpToUnresolved = useCallback(
    (targetKey: string) => {
      const index = rowIndexByKey[targetKey];
      if (index == null) return;
      setHighlightKey(targetKey);
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.25 });
    },
    [rowIndexByKey]
  );

  const onScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      listRef.current?.scrollToOffset({
        offset: Math.max(0, info.averageItemLength * info.index - 80),
        animated: true,
      });
      setTimeout(() => {
        listRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.25 });
      }, 60);
    },
    []
  );

  const handleBandPress = useCallback(() => {
    if (blockState.status === "ready") {
      setSubmitting(true);
      // Simulated network round-trip — deterministic fixed delay, not data.
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 700);
      return;
    }
    if (blockState.status === "submitted" || blockState.status === "submitting") return;
    jumpToUnresolved(blockState.targetKey);
  }, [blockState, jumpToUnresolved]);

  const renderRow = useCallback(
    ({ item: row }: ListRenderItemInfo<Row>) => {
      switch (row.kind) {
        case "proof":
          return (
            <ProofBlock
              selectedCount={selectedItemIds.length}
              refundEstimate={refundEstimate}
              photosReadyCount={selectedItems.length - itemsMissingPhoto.length}
              photosNeededCount={selectedItems.length}
            />
          );
        case "sectionTitle":
          return <SectionTitle title={row.title} required={row.required} helper={row.helper} />;
        case "item":
          return (
            <ItemRow
              item={row.item}
              selected={selectedItemIds.includes(row.item.id)}
              onToggle={() => toggleItem(row.item.id)}
              highlighted={highlightKey === `item-${row.item.id}`}
              disabled={submitted}
            />
          );
        case "reason":
          return (
            <ReasonRow
              reason={row.reason}
              selected={selectedReason === row.reason.id}
              onSelect={() => pickReason(row.reason.id)}
              highlighted={highlightKey === `reason-${row.reason.id}`}
              disabled={submitted}
            />
          );
        case "photoEmpty":
          return (
            <View style={styles.photoEmptyBox}>
              <Text style={styles.photoEmptyText}>
                Select an item above to add photo evidence for it.
              </Text>
            </View>
          );
        case "photoSlot":
          return (
            <PhotoSlotRow
              item={row.item}
              count={photosByItemId[row.item.id] ?? 0}
              onAdd={() => addPhoto(row.item.id)}
              onRemove={(n) => removePhoto(row.item.id)}
              highlighted={highlightKey === `photo-${row.item.id}`}
              disabled={submitted}
            />
          );
        case "footer":
          return <View style={styles.footerSpacer} />;
      }
    },
    [
      selectedItemIds,
      refundEstimate,
      selectedItems,
      itemsMissingPhoto,
      selectedReason,
      highlightKey,
      photosByItemId,
      submitted,
      toggleItem,
      pickReason,
      addPhoto,
      removePhoto,
    ]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <Text accessibilityRole="header" style={styles.headerTitle}>
          Return & Refund Request
        </Text>
        <Text style={styles.headerSubtitle}>
          Order {ORDER.orderId} · Delivered {ORDER.deliveredOn}
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={rows}
        keyExtractor={(r) => r.key}
        renderItem={renderRow}
        contentContainerStyle={styles.listContent}
        onScrollToIndexFailed={onScrollToIndexFailed}
        showsVerticalScrollIndicator={false}
      />

      <BottomBand state={blockState} onPress={handleBandPress} />
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------------
// Proof block — the screen's always-visible default core: how much you'd get back,
// how long the return window stays open, and how much evidence is still needed.
// Visible before any interaction, and strengthens live as the buyer makes choices.
// ---------------------------------------------------------------------------------

function ProofBlock({
  selectedCount,
  refundEstimate,
  photosReadyCount,
  photosNeededCount,
}: {
  selectedCount: number;
  refundEstimate: number;
  photosReadyCount: number;
  photosNeededCount: number;
}) {
  return (
    <View style={styles.proofCard}>
      <View style={styles.proofRow}>
        <Text style={styles.proofLabel}>Estimated refund</Text>
        <Text style={styles.proofValue}>{formatKRW(refundEstimate)}</Text>
      </View>
      <Text style={styles.proofCaption}>
        {selectedCount === 0
          ? "Select items below to estimate your refund."
          : `Based on ${selectedCount} selected item${selectedCount === 1 ? "" : "s"}, before any restocking check.`}
      </Text>

      <View style={styles.proofDivider} />

      <View style={styles.proofStatRow}>
        <View style={styles.proofStat}>
          <Text style={styles.proofStatValue}>{RETURN_WINDOW_DAYS_LEFT} days</Text>
          <Text style={styles.proofStatLabel}>left in return window</Text>
        </View>
        <View style={styles.proofStat}>
          <Text style={styles.proofStatValue}>
            {photosReadyCount}/{photosNeededCount}
          </Text>
          <Text style={styles.proofStatLabel}>items have photo evidence</Text>
        </View>
      </View>
    </View>
  );
}

function SectionTitle({ title, required, helper }: { title: string; required: boolean; helper: string }) {
  return (
    <View style={styles.sectionTitleWrap}>
      <View style={styles.sectionTitleRow}>
        <Text accessibilityRole="header" style={styles.sectionTitleText}>
          {title}
        </Text>
        {required ? (
          <View style={styles.requiredPill}>
            <Text style={styles.requiredPillText}>Required</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.sectionHelperText}>{helper}</Text>
    </View>
  );
}

function ItemRow({
  item,
  selected,
  onToggle,
  highlighted,
  disabled,
}: {
  item: ReturnLineItem;
  selected: boolean;
  onToggle: () => void;
  highlighted: boolean;
  disabled: boolean;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onToggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={`${item.title}, ${item.variant}, ${item.price}`}
      hitSlop={4}
      style={({ pressed }) => [
        styles.itemRow,
        highlighted && styles.rowHighlighted,
        pressed && !disabled && styles.rowPressed,
        disabled && styles.rowDisabled,
      ]}
    >
      <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
        {selected ? <Text style={styles.checkboxMark}>✓</Text> : null}
      </View>
      <View style={styles.thumbnail}>
        <Text style={styles.thumbnailText}>{item.thumbnailLabel}</Text>
      </View>
      <View style={styles.itemTextCol}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemVariant}>
          {item.variant} · Qty {item.qty}
        </Text>
      </View>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </Pressable>
  );
}

function ReasonRow({
  reason,
  selected,
  onSelect,
  highlighted,
  disabled,
}: {
  reason: ReturnReason;
  selected: boolean;
  onSelect: () => void;
  highlighted: boolean;
  disabled: boolean;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onSelect}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={`${reason.label}. ${reason.hint}`}
      style={({ pressed }) => [
        styles.reasonRow,
        highlighted && styles.rowHighlighted,
        pressed && !disabled && styles.rowPressed,
        disabled && styles.rowDisabled,
      ]}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
      <View style={styles.itemTextCol}>
        <Text style={styles.reasonLabel}>{reason.label}</Text>
        <Text style={styles.reasonHint}>{reason.hint}</Text>
      </View>
    </Pressable>
  );
}

function PhotoSlotRow({
  item,
  count,
  onAdd,
  onRemove,
  highlighted,
  disabled,
}: {
  item: ReturnLineItem;
  count: number;
  onAdd: () => void;
  onRemove: (n: number) => void;
  highlighted: boolean;
  disabled: boolean;
}) {
  const satisfied = count > 0;
  const canAddMore = count < MAX_PHOTOS_PER_ITEM;

  return (
    // NOTE: no `accessible` prop set on this wrapper — it contains independently
    // tappable chip-remove buttons and an "Add photo" button, which must each stay
    // individually reachable by screen readers, not collapsed into one unit.
    <View style={[styles.photoSlot, highlighted && styles.rowHighlighted]}>
      <View style={styles.photoSlotHeader}>
        <Text style={styles.photoSlotTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.photoStatusRow}>
          {satisfied ? (
            <Text style={styles.photoStatusDone}>✓ {count} photo{count === 1 ? "" : "s"} attached</Text>
          ) : (
            <Text style={styles.photoStatusMissing}>Required — no photo yet</Text>
          )}
        </View>
      </View>

      <View style={styles.chipRow}>
        {Array.from({ length: count }).map((_, i) => (
          <View key={`${item.id}-photo-${i}`} style={styles.photoChip}>
            <Text style={styles.photoChipText}>Photo {i + 1}</Text>
            <Pressable
              onPress={disabled ? undefined : () => onRemove(i)}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={`Remove photo ${i + 1} from ${item.title}`}
              accessibilityHint="Removes this attached photo from the return request"
              hitSlop={10}
              style={styles.photoChipRemove}
            >
              <Text style={styles.photoChipRemoveText}>Remove</Text>
            </Pressable>
          </View>
        ))}

        {canAddMore ? (
          <Pressable
            onPress={disabled ? undefined : onAdd}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={`Add photo evidence for ${item.title}`}
            accessibilityHint="Attaches one placeholder evidence photo to this item"
            style={({ pressed }) => [
              styles.addPhotoButton,
              pressed && !disabled && styles.rowPressed,
              disabled && styles.rowDisabled,
            ]}
          >
            <Text style={styles.addPhotoPlus}>+</Text>
            <Text style={styles.addPhotoText}>Add photo</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function BottomBand({ state, onPress }: { state: BlockState; onPress: () => void }) {
  const isBlocked =
    state.status === "blocked-items" || state.status === "blocked-reason" || state.status === "blocked-photos";
  const isReady = state.status === "ready";
  const isSubmitting = state.status === "submitting";
  const isSubmitted = state.status === "submitted";

  return (
    <Pressable
      onPress={isSubmitted || isSubmitting ? undefined : onPress}
      disabled={isSubmitted || isSubmitting}
      accessibilityRole="button"
      accessibilityLabel={
        isBlocked
          ? `Blocked: ${state.message} Activate to jump to what's missing.`
          : isReady
          ? "Submit return request"
          : state.message
      }
      style={({ pressed }) => [
        styles.band,
        isBlocked && styles.bandBlockedState,
        isReady && styles.bandReadyState,
        isSubmitted && styles.bandSubmittedState,
        pressed && isReady && styles.bandPressed,
      ]}
    >
      {/* Exactly one live region on the screen: announces every blocked→ready→submitted change. */}
      <View accessibilityLiveRegion="polite" style={styles.bandTextWrap}>
        <Text accessibilityRole="alert" style={[styles.bandMessage, isReady && styles.bandMessageReady]}>
          {isSubmitting ? "" : state.message}
        </Text>
      </View>
      {isSubmitting ? <ActivityIndicator color={tokens.color.onAccent} /> : null}
      {isReady ? <Text style={styles.bandCta}>Submit return</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.color.bg },
  headerBar: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(3),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.color.border,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: tokens.color.ink },
  headerSubtitle: { marginTop: tokens.space(1), fontSize: 13, color: tokens.color.muted },

  listContent: { paddingHorizontal: tokens.space(4), paddingBottom: tokens.space(6) },

  proofCard: {
    marginTop: tokens.space(4),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  proofRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  proofLabel: { fontSize: 13, color: tokens.color.muted },
  proofValue: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  proofCaption: { marginTop: tokens.space(1), fontSize: 12, color: tokens.color.faint },
  proofDivider: { height: StyleSheet.hairlineWidth, backgroundColor: tokens.color.border, marginVertical: tokens.space(3) },
  proofStatRow: { flexDirection: "row" },
  proofStat: { flex: 1 },
  proofStatValue: { fontSize: 16, fontWeight: "700", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  proofStatLabel: { fontSize: 12, color: tokens.color.muted, marginTop: 2 },

  sectionTitleWrap: { marginTop: tokens.space(6), marginBottom: tokens.space(2) },
  sectionTitleRow: { flexDirection: "row", alignItems: "center" },
  sectionTitleText: { fontSize: 16, fontWeight: "700", color: tokens.color.ink },
  requiredPill: {
    marginLeft: tokens.space(2),
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
  },
  requiredPillText: { fontSize: 10, fontWeight: "700", color: tokens.color.onInk, letterSpacing: 0.4 },
  sectionHelperText: { marginTop: tokens.space(1), fontSize: 12, color: tokens.color.faint },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    marginBottom: tokens.space(2),
    minHeight: 44,
    backgroundColor: tokens.color.bg,
  },
  rowPressed: { backgroundColor: "#fafafa" },
  rowHighlighted: { borderColor: tokens.color.accent, borderWidth: 2 },
  rowDisabled: { opacity: 0.5 },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  checkboxChecked: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  checkboxMark: { color: tokens.color.onAccent, fontSize: 14, fontWeight: "700" },

  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  thumbnailText: { color: tokens.color.onInk, fontSize: 12, fontWeight: "700" },

  itemTextCol: { flex: 1, marginRight: tokens.space(2) },
  itemTitle: { fontSize: 14, fontWeight: "600", color: tokens.color.ink },
  itemVariant: { fontSize: 12, color: tokens.color.muted, marginTop: 2 },
  itemPrice: { fontSize: 13, fontWeight: "600", color: tokens.color.ink, fontVariant: ["tabular-nums"] },

  reasonRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    marginBottom: tokens.space(2),
    minHeight: 44,
    backgroundColor: tokens.color.bg,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
    marginTop: 1,
  },
  radioOuterSelected: { borderColor: tokens.color.accent },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: tokens.color.accent },
  reasonLabel: { fontSize: 14, fontWeight: "600", color: tokens.color.ink },
  reasonHint: { fontSize: 12, color: tokens.color.muted, marginTop: 2 },

  photoEmptyBox: {
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: tokens.color.border,
    alignItems: "center",
  },
  photoEmptyText: { fontSize: 12, color: tokens.color.faint, textAlign: "center" },

  photoSlot: {
    padding: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    marginBottom: tokens.space(2),
    backgroundColor: tokens.color.bg,
  },
  photoSlotHeader: { marginBottom: tokens.space(2) },
  photoSlotTitle: { fontSize: 14, fontWeight: "600", color: tokens.color.ink },
  photoStatusRow: { marginTop: 2 },
  photoStatusDone: { fontSize: 12, color: tokens.color.ink, fontWeight: "600" },
  photoStatusMissing: { fontSize: 12, color: tokens.color.ink, fontWeight: "700" },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space(2) },
  photoChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink2,
  },
  photoChipText: { color: tokens.color.onInk, fontSize: 12, marginRight: tokens.space(2) },
  photoChipRemove: { minHeight: 24, minWidth: 44, justifyContent: "center", alignItems: "center" },
  photoChipRemoveText: { color: tokens.color.onInkMuted, fontSize: 11, fontWeight: "600" },

  addPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  addPhotoPlus: { color: tokens.color.accent, fontSize: 16, fontWeight: "700", marginRight: tokens.space(1) },
  addPhotoText: { color: tokens.color.accent, fontSize: 13, fontWeight: "600" },

  footerSpacer: { height: tokens.space(6) },

  band: {
    minHeight: 64,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bandBlockedState: { backgroundColor: tokens.color.ink2 },
  bandReadyState: { backgroundColor: tokens.color.accent },
  bandSubmittedState: { backgroundColor: tokens.color.ink },
  bandPressed: { opacity: 0.9 },
  bandTextWrap: { flex: 1, marginRight: tokens.space(3) },
  bandMessage: { color: tokens.color.onInk, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  bandMessageReady: { color: tokens.color.onAccent },
  bandCta: { color: tokens.color.onAccent, fontSize: 14, fontWeight: "700" },
});
