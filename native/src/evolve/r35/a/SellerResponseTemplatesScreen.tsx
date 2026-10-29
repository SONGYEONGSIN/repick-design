// native/src/evolve/r35/a/SellerResponseTemplatesScreen.tsx
//
// Seller Response Templates — a seller-facing library of canned reply
// snippets for answering buyer messages. Selection is press-to-select
// (tapping a row's checkbox toggles it, no swipe gesture). A contextual
// bottom bar is not mounted while zero templates are selected; the moment
// one or more are selected it appears, announces the live count, and
// offers two real bulk actions (Duplicate, Delete-with-confirm). The bar
// and the post-action toast are mutually exclusive: the toast only ever
// renders once the selection has been cleared back to zero.
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import { initialTemplates, ResponseTemplate } from "./data";

function formatCount(n: number): string {
  // Deterministic thousands-separator formatter — avoids relying on
  // Intl/toLocaleString availability in the RN JS engine.
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

type ToastAction = {
  label: string;
  onPress: () => void;
};

export function SellerResponseTemplatesScreen() {
  const [templates, setTemplates] = useState<ResponseTemplate[]>(initialTemplates);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [toastAction, setToastAction] = useState<ToastAction | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Derived every render from the Set itself — never hand-tracked, so it
  // can never drift out of sync with what's actually selected.
  const selectedCount = selectedIds.size;

  function presentToast(message: string, action: ToastAction | null) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    setToastAction(action);
    // "Just happened" announcements are not re-derived each render, so they
    // must be actively cleared — otherwise the alert role would get stuck
    // permanently "on" after the first read-out.
    toastTimerRef.current = setTimeout(() => {
      setToastMessage("");
      setToastAction(null);
    }, 4000);
  }

  function dismissToast() {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage("");
    setToastAction(null);
  }

  function toggleRow(id: string) {
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

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleDuplicate() {
    const picked = templates.filter((t) => selectedIds.has(t.id));
    if (picked.length === 0) return;
    const startIndex = templates.length;
    const duplicates: ResponseTemplate[] = picked.map((t, i) => ({
      ...t,
      id: `${t.id}-copy-${startIndex + i}`,
      title: `${t.title} (copy)`,
      usageCount: 0,
    }));
    setTemplates((prev) => [...prev, ...duplicates]);
    const count = picked.length;
    clearSelection();
    presentToast(
      `Duplicated ${count} ${pluralize(count, "template", "templates")}.`,
      null
    );
  }

  function handleDeleteRequest() {
    const count = selectedIds.size;
    if (count === 0) return;
    Alert.alert(
      `Delete ${count} ${pluralize(count, "template", "templates")}?`,
      "Buyers won't be affected — this only removes the saved reply from your library. You can undo for a few seconds after deleting.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => performDelete(),
        },
      ]
    );
  }

  function performDelete() {
    const idsToRemove = selectedIds;
    const snapshotBeforeDelete = templates;
    const removedCount = templates.filter((t) => idsToRemove.has(t.id)).length;
    setTemplates((prev) => prev.filter((t) => !idsToRemove.has(t.id)));
    clearSelection();
    presentToast(
      `Deleted ${removedCount} ${pluralize(removedCount, "template", "templates")}.`,
      {
        label: "Undo",
        onPress: () => {
          setTemplates(snapshotBeforeDelete);
          dismissToast();
        },
      }
    );
  }

  function handleRestoreDefaults() {
    setTemplates(initialTemplates);
  }

  return (
    <SafeAreaView style={styles.screenRoot}>
      <View style={styles.headerBlock}>
        <Text accessibilityRole="header" style={styles.headerTitle}>
          Response Templates
        </Text>
        <Text style={styles.headerSubtitle}>
          Saved replies you can reuse when answering buyer messages.
        </Text>
        <Text style={styles.libraryCountLabel}>
          {templates.length} {pluralize(templates.length, "template", "templates")} saved
        </Text>
      </View>

      <FlatList
        style={styles.listFlex}
        data={templates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyLibraryState onRestore={handleRestoreDefaults} />}
        renderItem={({ item }) => (
          <TemplateRow
            item={item}
            isSelected={selectedIds.has(item.id)}
            onToggle={() => toggleRow(item.id)}
          />
        )}
      />

      {selectedCount > 0 && (
        <View style={styles.selectionBar} accessibilityLiveRegion="polite">
          <View style={styles.selectionTopRow}>
            <Pressable
              onPress={clearSelection}
              style={styles.selectionClearButton}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Clear selection"
            >
              <Text style={styles.selectionClearGlyph}>✕</Text>
            </Pressable>
            <Text
              style={styles.selectionCountText}
              accessibilityRole={selectedCount > 0 ? "alert" : undefined}
            >
              {selectedCount} {pluralize(selectedCount, "template", "templates")} selected
            </Text>
          </View>
          <View style={styles.selectionActionsRow}>
            <Pressable
              onPress={handleDuplicate}
              style={({ pressed }) => [
                styles.selectionActionButton,
                pressed && styles.selectionActionButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Duplicate ${selectedCount} selected ${pluralize(
                selectedCount,
                "template",
                "templates"
              )}`}
            >
              <Text style={styles.selectionActionLabel}>Duplicate</Text>
            </Pressable>
            <Pressable
              onPress={handleDeleteRequest}
              style={({ pressed }) => [
                styles.selectionActionButton,
                styles.selectionActionButtonDanger,
                pressed && styles.selectionActionButtonDangerPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${selectedCount} selected ${pluralize(
                selectedCount,
                "template",
                "templates"
              )}`}
            >
              <Text style={[styles.selectionActionLabel, styles.selectionActionLabelDanger]}>
                Delete
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {selectedCount === 0 && toastMessage !== "" && (
        <View style={styles.toastBar} accessibilityLiveRegion="polite">
          <Text style={styles.toastText} accessibilityRole="alert">
            {toastMessage}
          </Text>
          {toastAction && (
            <Pressable
              onPress={toastAction.onPress}
              style={styles.toastActionButton}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={toastAction.label}
            >
              <Text style={styles.toastActionLabel}>{toastAction.label}</Text>
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

function TemplateRow({
  item,
  isSelected,
  onToggle,
}: {
  item: ResponseTemplate;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={`${item.title}, ${item.category} template, used ${formatCount(
        item.usageCount
      )} times${isSelected ? ", selected" : ""}`}
      style={({ pressed }) => [
        styles.templateCard,
        isSelected && styles.templateCardSelected,
        pressed && styles.templateCardPressed,
      ]}
    >
      <View style={[styles.checkMark, isSelected && styles.checkMarkChecked]}>
        {isSelected && <Text style={styles.checkMarkGlyph}>✓</Text>}
      </View>
      <View style={styles.cardTextColumn}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitleText}>{item.title}</Text>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.cardBodyText} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.cardUsageText}>
          Used {formatCount(item.usageCount)} times
        </Text>
      </View>
    </Pressable>
  );
}

function EmptyLibraryState({ onRestore }: { onRestore: () => void }) {
  return (
    <View style={styles.emptyLibraryWrap}>
      <Text style={styles.emptyLibraryTitle}>No templates saved</Text>
      <Text style={styles.emptyLibraryBody}>
        Saved replies you add will show up here so you can reuse them when answering buyers.
      </Text>
      <Pressable
        onPress={onRestore}
        style={({ pressed }) => [
          styles.restoreSamplesButton,
          pressed && styles.restoreSamplesButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Restore sample templates"
      >
        <Text style={styles.restoreSamplesLabel}>Restore sample templates</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerBlock: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
    gap: tokens.space(1),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: tokens.color.muted,
  },
  libraryCountLabel: {
    marginTop: tokens.space(1),
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  listFlex: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(8),
    gap: tokens.space(3),
  },
  templateCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    paddingVertical: tokens.space(4),
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    minHeight: 44,
  },
  templateCardSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  templateCardPressed: {
    opacity: 0.85,
  },
  checkMark: {
    width: 24,
    height: 24,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(1),
  },
  checkMarkChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkMarkGlyph: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  cardTextColumn: {
    flex: 1,
    gap: tokens.space(1),
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(2),
  },
  cardTitleText: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  categoryChip: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  cardBodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: tokens.color.ink2,
  },
  cardUsageText: {
    fontSize: 13,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  emptyLibraryWrap: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(10),
    alignItems: "center",
    gap: tokens.space(2),
  },
  emptyLibraryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  emptyLibraryBody: {
    fontSize: 16,
    lineHeight: 24,
    color: tokens.color.muted,
    textAlign: "center",
  },
  restoreSamplesButton: {
    marginTop: tokens.space(3),
    minHeight: 44,
    paddingHorizontal: tokens.space(5),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  restoreSamplesButtonPressed: {
    opacity: 0.85,
  },
  restoreSamplesLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  selectionBar: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(5),
    gap: tokens.space(3),
    backgroundColor: tokens.color.ink,
    borderTopLeftRadius: tokens.radius.md,
    borderTopRightRadius: tokens.radius.md,
  },
  selectionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  selectionClearButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionClearGlyph: {
    fontSize: 18,
    color: tokens.color.onInk,
  },
  selectionCountText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.onInk,
  },
  selectionActionsRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  selectionActionButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.onInkMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionActionButtonPressed: {
    opacity: 0.7,
  },
  selectionActionButtonDanger: {
    borderColor: tokens.color.danger,
    backgroundColor: tokens.color.danger,
  },
  selectionActionButtonDangerPressed: {
    opacity: 0.8,
  },
  selectionActionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.onInk,
  },
  selectionActionLabelDanger: {
    color: tokens.color.onInk,
  },
  toastBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(3),
    marginHorizontal: tokens.space(5),
    marginBottom: tokens.space(5),
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.ink2,
    minHeight: 44,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    color: tokens.color.onInk,
  },
  toastActionButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(2),
    alignItems: "center",
    justifyContent: "center",
  },
  toastActionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onInk,
    textDecorationLine: "underline",
  },
});

export default SellerResponseTemplatesScreen;
