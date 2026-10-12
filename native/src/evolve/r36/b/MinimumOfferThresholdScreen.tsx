// native/src/evolve/r36/b/MinimumOfferThresholdScreen.tsx
//
// Seller-facing screen: a single scrolling list of the seller's own active
// listings, each with its own inline, non-destructive numeric editor for
// that listing's "minimum acceptable offer" floor. Offers below the floor
// are auto-declined instead of notifying the seller — the live effect copy
// on each row always reflects the value currently being edited.
//
// Macro form: no fixed bottom band. Single FlatList; intro copy lives in
// ListHeaderComponent instead of a second ScrollView.

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from "react-native";
import { tokens } from "../../../tokens";
import { listingThresholds, type ListingThreshold } from "./data";

function formatKRW(amount: number): string {
  // Deliberate gap between the ₩ glyph and the digits — on the -apple-system
  // stack at body size the glyph visually runs into adjacent digits without it.
  const safeAmount = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `₩ ${safeAmount.toLocaleString("en-US")}`;
}

const STEP = 1000;
const CONFIRMATION_VISIBLE_MS = 3000;

type RowState = {
  isEditing: boolean;
  draftText: string;
  error: string | null;
};

function initialRowState(item: ListingThreshold): RowState {
  return { isEditing: false, draftText: String(item.initialThreshold), error: null };
}

export function MinimumOfferThresholdScreen() {
  const [thresholds, setThresholds] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    listingThresholds.forEach((item) => {
      map[item.id] = item.initialThreshold;
    });
    return map;
  });
  const [rows, setRows] = useState<Record<string, RowState>>(() => {
    const map: Record<string, RowState> = {};
    listingThresholds.forEach((item) => {
      map[item.id] = initialRowState(item);
    });
    return map;
  });
  // Transient "just happened" confirmation (pattern 1) — must be cleared
  // back to empty after a readable interval so the alert role does not
  // stick "on" forever.
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const confirmationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
    };
  }, []);

  function announceConfirmation(message: string) {
    if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
    setConfirmationMessage(message);
    confirmationTimer.current = setTimeout(() => {
      setConfirmationMessage("");
      confirmationTimer.current = null;
    }, CONFIRMATION_VISIBLE_MS);
  }

  function startEdit(item: ListingThreshold) {
    setRows((prev) => {
      const next: Record<string, RowState> = {};
      // Only one row editable at a time, so at most one live preview is
      // actively changing and no two live regions announce together.
      Object.keys(prev).forEach((id) => {
        next[id] = id === item.id ? prev[id] : { ...prev[id], isEditing: false };
      });
      next[item.id] = {
        isEditing: true,
        draftText: String(thresholds[item.id]),
        error: null,
      };
      return next;
    });
  }

  function cancelEdit(item: ListingThreshold) {
    setRows((prev) => ({
      ...prev,
      [item.id]: initialRowState({ ...item, initialThreshold: thresholds[item.id] }),
    }));
  }

  function changeDraft(item: ListingThreshold, text: string) {
    const digitsOnly = text.replace(/[^0-9]/g, "");
    setRows((prev) => ({
      ...prev,
      [item.id]: { ...prev[item.id], draftText: digitsOnly, error: null },
    }));
  }

  function adjustDraft(item: ListingThreshold, delta: number) {
    setRows((prev) => {
      const current = Number(prev[item.id]?.draftText ?? "0") || 0;
      const clamped = Math.max(0, Math.min(item.price, current + delta));
      return {
        ...prev,
        [item.id]: { ...prev[item.id], draftText: String(clamped), error: null },
      };
    });
  }

  function validate(item: ListingThreshold, draftText: string): string | null {
    if (draftText.trim().length === 0) return "Enter a minimum offer amount.";
    const value = Number(draftText);
    if (!Number.isFinite(value)) return "Enter a valid number.";
    if (value < 0) return "Minimum offer can't be negative.";
    if (value > item.price) {
      return `Minimum offer can't exceed the listed price of ${formatKRW(item.price)}.`;
    }
    return null;
  }

  function saveEdit(item: ListingThreshold) {
    const draftText = rows[item.id]?.draftText ?? "0";
    const error = validate(item, draftText);
    if (error) {
      setRows((prev) => ({ ...prev, [item.id]: { ...prev[item.id], error } }));
      return;
    }
    const value = Math.round(Number(draftText));
    setThresholds((prev) => ({ ...prev, [item.id]: value }));
    setRows((prev) => ({
      ...prev,
      [item.id]: { isEditing: false, draftText: String(value), error: null },
    }));
    announceConfirmation(
      `Minimum offer updated for ${item.title}: offers below ${formatKRW(value)} will now be auto-declined.`
    );
  }

  function renderItem({ item }: { item: ListingThreshold }) {
    const row = rows[item.id];
    const saved = thresholds[item.id];
    const previewValue = row.isEditing ? Number(row.draftText) || 0 : saved;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.swatch} />
          <View style={styles.cardHeaderText}>
            <Text style={styles.listingTitle}>{item.title}</Text>
            <Text style={styles.listingMeta}>
              {item.category} · Listed at {formatKRW(item.price)}
            </Text>
          </View>
        </View>

        <View
          style={styles.previewBox}
          accessibilityLiveRegion={row.isEditing ? "polite" : "none"}
        >
          <Text style={styles.previewText}>
            Offers below{" "}
            <Text style={styles.previewAmount}>{formatKRW(previewValue)}</Text> are
            auto-declined.
          </Text>
        </View>

        {!row.isEditing ? (
          <View style={styles.rowFooter}>
            <Text style={styles.floorLabel}>
              Current floor: <Text style={styles.floorValue}>{formatKRW(saved)}</Text>
            </Text>
            <Pressable
              onPress={() => startEdit(item)}
              style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Edit minimum offer for ${item.title}`}
              accessibilityHint="Opens an inline field to change this listing's minimum acceptable offer."
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.editor}>
            <Text style={styles.fieldLabel}>Minimum offer (KRW)</Text>
            <View style={styles.editorRow}>
              <Pressable
                onPress={() => adjustDraft(item, -STEP)}
                style={({ pressed }) => [styles.stepperButton, pressed && styles.stepperButtonPressed]}
                accessibilityRole="button"
                accessibilityLabel={`Decrease minimum offer for ${item.title} by ${STEP.toLocaleString("en-US")} won`}
                accessibilityHint="Lowers the draft minimum offer amount by one thousand won."
              >
                <Text style={styles.stepperButtonText}>−</Text>
              </Pressable>
              <TextInput
                style={styles.input}
                value={row.draftText}
                onChangeText={(text) => changeDraft(item, text)}
                keyboardType="number-pad"
                returnKeyType="done"
                accessibilityLabel={`Minimum offer in won for ${item.title}, currently ${formatKRW(
                  Number(row.draftText) || 0
                )}`}
              />
              <Pressable
                onPress={() => adjustDraft(item, STEP)}
                style={({ pressed }) => [styles.stepperButton, pressed && styles.stepperButtonPressed]}
                accessibilityRole="button"
                accessibilityLabel={`Increase minimum offer for ${item.title} by ${STEP.toLocaleString("en-US")} won`}
                accessibilityHint="Raises the draft minimum offer amount by one thousand won."
              >
                <Text style={styles.stepperButtonText}>+</Text>
              </Pressable>
            </View>

            {row.error ? (
              <Text
                style={styles.errorText}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                {row.error}
              </Text>
            ) : null}

            <View style={styles.editorActions}>
              <Pressable
                onPress={() => cancelEdit(item)}
                style={({ pressed }) => [styles.cancelButton, pressed && styles.cancelButtonPressed]}
                accessibilityRole="button"
                accessibilityLabel={`Cancel editing minimum offer for ${item.title}`}
                accessibilityHint="Discards the draft amount and keeps the previous minimum offer."
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => saveEdit(item)}
                style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
                accessibilityRole="button"
                accessibilityLabel={`Save minimum offer for ${item.title}`}
                accessibilityHint="Saves the draft amount as this listing's new minimum acceptable offer."
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={listingThresholds}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">
              Minimum Offer Settings
            </Text>
            <Text style={styles.subtitle}>
              Set the lowest offer you'll accept on each active listing. Offers at or
              above your floor reach you as normal. Offers below it are auto-declined
              automatically, so you're never notified about lowball offers.
            </Text>
            <View
              style={styles.confirmationSlot}
              accessibilityLiveRegion="polite"
            >
              {confirmationMessage ? (
                <Text style={styles.confirmationText} accessibilityRole="alert">
                  {confirmationMessage}
                </Text>
              ) : null}
            </View>
          </View>
        }
        ListFooterComponent={<View style={styles.footerSpace} />}
      />
    </SafeAreaView>
  );
}

const S = tokens.space;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: S(4),
    paddingBottom: S(6),
  },
  header: {
    paddingTop: S(4),
    paddingBottom: S(3),
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    lineHeight: 32,
  },
  subtitle: {
    marginTop: S(2),
    fontSize: 16,
    lineHeight: 26,
    color: tokens.color.muted,
  },
  confirmationSlot: {
    minHeight: 0,
  },
  confirmationText: {
    marginTop: S(3),
    fontSize: 16,
    lineHeight: 26,
    color: tokens.color.success,
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingVertical: S(2),
    paddingHorizontal: S(3),
  },
  card: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: S(4),
    marginBottom: S(3),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.swatch1,
  },
  cardHeaderText: {
    marginLeft: S(3),
    flex: 1,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
    lineHeight: 24,
  },
  listingMeta: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 22,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  previewBox: {
    marginTop: S(3),
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
    paddingVertical: S(2),
    paddingHorizontal: S(3),
  },
  previewText: {
    fontSize: 16,
    lineHeight: 26,
    color: tokens.color.ink2,
  },
  previewAmount: {
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  rowFooter: {
    marginTop: S(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  floorLabel: {
    fontSize: 14,
    lineHeight: 22,
    color: tokens.color.muted,
  },
  floorValue: {
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  editButton: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: S(4),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonPressed: {
    backgroundColor: tokens.color.border,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  editor: {
    marginTop: S(3),
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.muted,
    marginBottom: S(2),
  },
  editorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepperButton: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderColor: tokens.color.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  stepperButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  input: {
    flex: 1,
    marginHorizontal: S(2),
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderColor: tokens.color.border,
    borderWidth: 1,
    paddingHorizontal: S(3),
    fontSize: 16,
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  errorText: {
    marginTop: S(2),
    fontSize: 16,
    lineHeight: 26,
    color: tokens.color.danger,
    backgroundColor: tokens.color.dangerBg,
    borderColor: tokens.color.dangerBorder,
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingVertical: S(2),
    paddingHorizontal: S(3),
  },
  editorActions: {
    marginTop: S(3),
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: S(4),
    borderRadius: tokens.radius.sm,
    borderColor: tokens.color.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: S(2),
  },
  cancelButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  saveButton: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: S(4),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  footerSpace: {
    height: S(6),
  },
});
