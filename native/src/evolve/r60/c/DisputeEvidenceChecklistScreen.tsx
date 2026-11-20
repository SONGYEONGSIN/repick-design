// native/src/evolve/r60/c/DisputeEvidenceChecklistScreen.tsx
//
// Dispute Evidence Upload Checklist — a buyer assembles required evidence
// (photos, receipt, chat messages, etc.) before submitting an "item not as
// described" dispute. Each row is a deterministic attached/not-attached
// toggle placeholder (no real file picker).
//
// Bottom band form: Selection-count-derived contextual bar. The band is
// absent while attachedCount === 0, appears once 1+ items are attached, and
// always reflects live derived state (never a separate boolean flag). It is
// mutually exclusive with any post-hoc "undo" overlay pattern — there is no
// undo affordance here, only the live checklist state itself.

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
import { disputeCase, initialEvidence, MIN_REQUIRED } from "./data";
import type { EvidenceItem } from "./data";

export function DisputeEvidenceChecklistScreen() {
  const [items, setItems] = useState<EvidenceItem[]>(initialEvidence);

  const attachedCount = useMemo(
    () => items.filter((it) => it.attached).length,
    [items]
  );
  const totalCount = items.length;
  const bandVisible = attachedCount > 0;
  const canSubmit = attachedCount >= MIN_REQUIRED;

  function toggleItem(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, attached: !it.attached } : it))
    );
  }

  const bandSentence = canSubmit
    ? `${attachedCount} of ${totalCount} attached — Submit available`
    : `${attachedCount} of ${totalCount} attached — Submit available at ${MIN_REQUIRED}`;

  const listHeader = (
    <View style={styles.headerBlock}>
      <Text accessibilityRole="header" style={styles.title}>
        Dispute Evidence Checklist
      </Text>
      <Text style={styles.subtitle}>
        Attach the evidence below before you submit this dispute.
      </Text>

      <View style={styles.reasonCard}>
        <Text style={styles.reasonOrder}>{disputeCase.orderId}</Text>
        <Text style={styles.reasonItemTitle}>{disputeCase.itemTitle}</Text>
        <View style={styles.reasonTagRow}>
          <View style={styles.reasonTag}>
            <Text style={styles.reasonTagText}>{disputeCase.reason}</Text>
          </View>
          <Text style={styles.reasonFiledOn}>{disputeCase.filedOn}</Text>
        </View>
        <Text style={styles.reasonDetail}>{disputeCase.reasonDetail}</Text>
      </View>

      <Text accessibilityRole="header" style={styles.sectionHeading}>
        Evidence Checklist
      </Text>
      <Text style={styles.sectionHint}>
        Tap an item to mark it attached. At least {MIN_REQUIRED} of{" "}
        {totalCount} are needed to submit.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <EvidenceRow item={item} onToggle={() => toggleItem(item.id)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
      />

      {bandVisible ? (
        <View
          style={styles.band}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          <View style={styles.bandTextBlock}>
            <Text style={styles.bandCount} accessibilityRole="alert">
              {bandSentence}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Submit dispute"
            accessibilityState={{ disabled: !canSubmit }}
            disabled={!canSubmit}
            hitSlop={8}
            style={({ pressed }) => [
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
              pressed && canSubmit && styles.submitButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.submitButtonText,
                !canSubmit && styles.submitButtonTextDisabled,
              ]}
            >
              Submit
            </Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function EvidenceRow({
  item,
  onToggle,
}: {
  item: EvidenceItem;
  onToggle: () => void;
}) {
  const checked = item.attached;
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={item.title}
      accessibilityHint={
        checked
          ? "Marks this evidence item as not attached"
          : "Marks this evidence item as attached"
      }
      hitSlop={6}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Checkbox checked={checked} />
      <View style={styles.rowTextBlock}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowDescription}>{item.description}</Text>
      </View>
      <StatusChip attached={checked} />
    </Pressable>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View
      style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}
    >
      {checked ? (
        <View style={styles.checkmarkWrap}>
          <View style={styles.checkmarkStem} />
          <View style={styles.checkmarkKick} />
        </View>
      ) : null}
    </View>
  );
}

function StatusChip({ attached }: { attached: boolean }) {
  return (
    <View style={[styles.chip, attached ? styles.chipAttached : styles.chipNeeded]}>
      <Text style={[styles.chipText, attached ? styles.chipTextAttached : styles.chipTextNeeded]}>
        {attached ? "Attached" : "Needed"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingBottom: tokens.space(8),
  },
  headerBlock: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: tokens.color.muted,
    marginBottom: tokens.space(4),
  },
  reasonCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(6),
  },
  reasonOrder: {
    fontSize: 12,
    fontWeight: "500",
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
  },
  reasonItemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  reasonTagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: tokens.space(2),
  },
  reasonTag: {
    backgroundColor: tokens.color.dangerBg,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    marginRight: tokens.space(2),
  },
  reasonTagText: {
    fontSize: 12,
    fontWeight: "500",
    color: tokens.color.danger,
  },
  reasonFiledOn: {
    fontSize: 12,
    fontWeight: "400",
    color: tokens.color.faint,
  },
  reasonDetail: {
    fontSize: 13,
    fontWeight: "400",
    color: tokens.color.muted,
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  sectionHint: {
    fontSize: 13,
    fontWeight: "400",
    color: tokens.color.muted,
    marginBottom: tokens.space(2),
  },
  rowSeparator: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginHorizontal: tokens.space(5),
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(4),
    minHeight: 44,
  },
  rowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  rowTextBlock: {
    flex: 1,
    marginLeft: tokens.space(3),
    marginRight: tokens.space(2),
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  rowDescription: {
    fontSize: 13,
    fontWeight: "400",
    color: tokens.color.muted,
    lineHeight: 18,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: tokens.radius.sm,
    borderWidth: 2,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(1),
  },
  checkboxBoxChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkmarkWrap: {
    width: 14,
    height: 14,
  },
  checkmarkStem: {
    position: "absolute",
    width: 2,
    height: 7,
    backgroundColor: tokens.color.onAccent,
    left: 3,
    top: 4,
    borderRadius: 1,
    transform: [{ rotate: "45deg" }],
  },
  checkmarkKick: {
    position: "absolute",
    width: 2,
    height: 11,
    backgroundColor: tokens.color.onAccent,
    left: 8,
    top: 1,
    borderRadius: 1,
    transform: [{ rotate: "-45deg" }],
  },
  chip: {
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderWidth: 1,
    alignSelf: "flex-start",
    marginTop: tokens.space(1),
  },
  chipAttached: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  chipNeeded: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  chipTextAttached: {
    color: tokens.color.accent,
  },
  chipTextNeeded: {
    color: tokens.color.faint,
  },
  band: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: tokens.color.ink,
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.ink2,
  },
  bandTextBlock: {
    flex: 1,
    marginRight: tokens.space(3),
  },
  bandCount: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  submitButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(3),
    minHeight: 44,
    minWidth: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonDisabled: {
    backgroundColor: tokens.color.ink2,
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  submitButtonTextDisabled: {
    color: tokens.color.onInkMuted,
  },
});

export default DisputeEvidenceChecklistScreen;
