// native/src/evolve/r45/a/WantListScreen.tsx
//
// Want List — a PRE-listing wishlist: criteria for items a buyer wants but
// that are not listed anywhere yet (brand, model/style, size, condition
// tier, max price). Distinct from this catalog's `watchlist` screen, which
// tracks items that already ARE listed. Nothing here points at a real
// listing — every card is a search the user is still waiting to match.
//
// Macro layout: form+list hybrid. A FlatList of saved want-criteria cards
// is the primary content; an "Add a want" row opens an inline add/edit
// form on this same screen (no separate route — single-screen RN app).
//
// Band mechanic (GENERATION.md §3, snapshot-equality-derived boolean,
// L2-established shape — first seen on Vacation Mode's toggle, second on
// Payout Method Order's reordering; this is a third, independent
// occurrence on want-criteria form fields, with its own names/strings):
// `wantDraftDiffersFromSaved` (native/src/evolve/r45/a/data.ts) compares
// the live draft against `savedFormSnapshot` — the entry's last-saved
// values when editing, or the empty baseline when adding — every render.
// The band mounts only while that comparison is true and unmounts the
// instant Save or Discard make it false again; there is no separate
// isWantFormDirty flag anywhere in this file.
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CONDITION_TIERS,
  EMPTY_WANT_FORM,
  WANT_ENTRIES,
  ADDED_TODAY_LABEL,
  entryToFormSnapshot,
  formatCentsAsPrice,
  formSnapshotToPriceCents,
  validateWantForm,
  wantDraftDiffersFromSaved,
  type ConditionTier,
  type WantEntry,
  type WantFormErrors,
  type WantFormSnapshot,
} from "./data";

type FormTarget = { kind: "closed" } | { kind: "new" } | { kind: "edit"; id: string };

export default function WantListScreen() {
  const [wants, setWants] = useState<WantEntry[]>(WANT_ENTRIES);
  const [formTarget, setFormTarget] = useState<FormTarget>({ kind: "closed" });

  // The last-saved snapshot for whatever the form currently targets — the
  // empty baseline for a new want, or that want's own values when editing.
  // null exactly when the form is closed, so there is nothing to diff.
  const [savedFormSnapshot, setSavedFormSnapshot] = useState<WantFormSnapshot | null>(null);

  const [draftBrand, setDraftBrand] = useState("");
  const [draftModelOrStyle, setDraftModelOrStyle] = useState("");
  const [draftSize, setDraftSize] = useState("");
  const [draftCondition, setDraftCondition] = useState<ConditionTier>("Any condition");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");

  const [formErrors, setFormErrors] = useState<WantFormErrors>({});

  const nextNewWantNumber = useRef(wants.length + 1);
  const listRef = useRef<FlatList<WantEntry>>(null);

  const currentDraftSnapshot: WantFormSnapshot = useMemo(
    () => ({
      brand: draftBrand,
      modelOrStyle: draftModelOrStyle,
      size: draftSize,
      condition: draftCondition,
      maxPrice: draftMaxPrice,
    }),
    [draftBrand, draftModelOrStyle, draftSize, draftCondition, draftMaxPrice]
  );

  // Single source of truth for band presence: a real snapshot-equality
  // check against the saved baseline, recomputed every render.
  const hasUnsavedWantDraft =
    savedFormSnapshot !== null &&
    wantDraftDiffersFromSaved(currentDraftSnapshot, savedFormSnapshot);

  function loadDraft(snapshot: WantFormSnapshot) {
    setDraftBrand(snapshot.brand);
    setDraftModelOrStyle(snapshot.modelOrStyle);
    setDraftSize(snapshot.size);
    setDraftCondition(snapshot.condition);
    setDraftMaxPrice(snapshot.maxPrice);
  }

  function openAddForm() {
    setFormTarget({ kind: "new" });
    setSavedFormSnapshot(EMPTY_WANT_FORM);
    loadDraft(EMPTY_WANT_FORM);
    setFormErrors({});
    requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: 0, animated: true }));
  }

  function openEditForm(entry: WantEntry) {
    const snapshot = entryToFormSnapshot(entry);
    setFormTarget({ kind: "edit", id: entry.id });
    setSavedFormSnapshot(snapshot);
    loadDraft(snapshot);
    setFormErrors({});
    requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: 0, animated: true }));
  }

  function closeForm() {
    setFormTarget({ kind: "closed" });
    setSavedFormSnapshot(null);
    setFormErrors({});
  }

  function handleDiscard() {
    if (savedFormSnapshot) {
      loadDraft(savedFormSnapshot);
    }
    setFormErrors({});
  }

  function handleSave() {
    const errors = validateWantForm(currentDraftSnapshot);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const maxPriceCents = formSnapshotToPriceCents(currentDraftSnapshot);

    if (formTarget.kind === "new") {
      const id = `w-new-${nextNewWantNumber.current}`;
      nextNewWantNumber.current += 1;
      const newEntry: WantEntry = {
        id,
        brand: currentDraftSnapshot.brand.trim(),
        modelOrStyle: currentDraftSnapshot.modelOrStyle.trim(),
        size: currentDraftSnapshot.size.trim(),
        condition: currentDraftSnapshot.condition,
        maxPriceCents,
        addedOnLabel: ADDED_TODAY_LABEL,
      };
      setWants((prev) => [newEntry, ...prev]);
    } else if (formTarget.kind === "edit") {
      const targetId = formTarget.id;
      setWants((prev) =>
        prev.map((entry) =>
          entry.id === targetId
            ? {
                ...entry,
                brand: currentDraftSnapshot.brand.trim(),
                modelOrStyle: currentDraftSnapshot.modelOrStyle.trim(),
                size: currentDraftSnapshot.size.trim(),
                condition: currentDraftSnapshot.condition,
                maxPriceCents,
              }
            : entry
        )
      );
    }
    closeForm();
  }

  const isFormOpen = formTarget.kind !== "closed";
  const formHeading = formTarget.kind === "edit" ? "Edit want" : "New want";

  const listHeader = (
    <View style={styles.header}>
      <Text accessibilityRole="header" style={styles.title}>
        Want List
      </Text>
      <Text style={styles.subtitle}>
        Save criteria for items you want that are not listed yet. We will not
        create a listing — this is only your own search, not a watch on a
        real item.
      </Text>

      {!isFormOpen ? (
        <Pressable
          onPress={openAddForm}
          accessibilityRole="button"
          accessibilityLabel="Add a want"
          accessibilityHint="Opens a form to describe a new item you're looking for."
          hitSlop={8}
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
        >
          <Text style={styles.addButtonText}>+ Add a want</Text>
        </Pressable>
      ) : (
        <View style={styles.formCard}>
          <Text accessibilityRole="header" style={styles.formHeading}>
            {formHeading}
          </Text>

          <FormField
            label="Brand"
            value={draftBrand}
            onChangeText={setDraftBrand}
            error={formErrors.brand}
            placeholder="e.g. Patagonia"
          />
          <FormField
            label="Model or style"
            value={draftModelOrStyle}
            onChangeText={setDraftModelOrStyle}
            error={formErrors.modelOrStyle}
            placeholder="e.g. Retro Pile Fleece Jacket"
          />
          <FormField
            label="Size"
            value={draftSize}
            onChangeText={setDraftSize}
            error={formErrors.size}
            placeholder="e.g. Men's M"
          />

          <Text style={styles.fieldLabel}>Condition</Text>
          <View style={styles.conditionRow}>
            {CONDITION_TIERS.map((tier) => {
              const selected = draftCondition === tier;
              return (
                <Pressable
                  key={tier}
                  onPress={() => setDraftCondition(tier)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Condition: ${tier}`}
                  hitSlop={6}
                  style={({ pressed }) => [
                    styles.conditionChip,
                    selected && styles.conditionChipSelected,
                    pressed && styles.conditionChipPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.conditionChipText,
                      selected && styles.conditionChipTextSelected,
                    ]}
                  >
                    {tier}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <FormField
            label="Max price (USD)"
            value={draftMaxPrice}
            onChangeText={setDraftMaxPrice}
            error={formErrors.maxPrice}
            placeholder="e.g. 90.00"
            keyboardType="decimal-pad"
          />

          {!hasUnsavedWantDraft ? (
            <Pressable
              onPress={closeForm}
              accessibilityRole="button"
              accessibilityLabel="Close form"
              accessibilityHint="Closes this form without changing your saved wants."
              hitSlop={8}
              style={({ pressed }) => [styles.closeFormButton, pressed && styles.closeFormButtonPressed]}
            >
              <Text style={styles.closeFormButtonText}>Close</Text>
            </Pressable>
          ) : (
            <Text style={styles.closeFormHint}>
              Save or discard your changes below to close this form.
            </Text>
          )}
        </View>
      )}

      <Text accessibilityRole="header" style={styles.sectionHeading}>
        {`Your wants (${wants.length})`}
      </Text>
    </View>
  );

  const listEmpty = (
    <Text style={styles.emptyText}>
      No wants saved yet. Tap "Add a want" to describe the first item you're
      looking for.
    </Text>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        ref={listRef}
        data={wants}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <WantCard
            entry={item}
            isBeingEdited={formTarget.kind === "edit" && formTarget.id === item.id}
            onPress={() => openEditForm(item)}
          />
        )}
      />

      {hasUnsavedWantDraft ? (
        <View
          accessibilityLiveRegion="polite"
          style={styles.band}
        >
          <Text accessibilityRole="alert" style={styles.bandText}>
            You have unsaved changes to this want.
          </Text>
          <View style={styles.bandActions}>
            <Pressable
              onPress={handleDiscard}
              accessibilityRole="button"
              accessibilityLabel="Discard changes"
              accessibilityHint="Reverts this want's fields back to their last saved values."
              hitSlop={6}
              style={({ pressed }) => [
                styles.bandButton,
                styles.bandButtonGhost,
                pressed && styles.bandButtonPressed,
              ]}
            >
              <Text style={styles.bandButtonGhostText}>Discard</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel="Save want"
              accessibilityHint="Saves this want's criteria to your list."
              hitSlop={6}
              style={({ pressed }) => [
                styles.bandButton,
                styles.bandButtonSolid,
                pressed && styles.bandButtonPressed,
              ]}
            >
              <Text style={styles.bandButtonSolidText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function FormField(props: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder: string;
  keyboardType?: "default" | "decimal-pad";
}) {
  const { label, value, onChangeText, error, placeholder, keyboardType } = props;
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.color.faint}
        keyboardType={keyboardType ?? "default"}
        accessibilityLabel={label}
        style={[styles.textInput, error && styles.textInputError]}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

function WantCard(props: {
  entry: WantEntry;
  isBeingEdited: boolean;
  onPress: () => void;
}) {
  const { entry, isBeingEdited, onPress } = props;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${entry.brand} ${entry.modelOrStyle}, size ${entry.size}, condition ${entry.condition}, max price ${formatCentsAsPrice(entry.maxPriceCents)}`}
      accessibilityHint="Opens this want so you can edit its criteria."
      style={({ pressed }) => [
        styles.card,
        isBeingEdited && styles.cardEditing,
        pressed && styles.cardPressed,
      ]}
    >
      {isBeingEdited ? <Text style={styles.editingTag}>EDITING</Text> : null}
      <Text style={styles.cardBrand}>{entry.brand}</Text>
      <Text style={styles.cardModel}>{entry.modelOrStyle}</Text>

      <View style={styles.chipRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{entry.size}</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{entry.condition}</Text>
        </View>
        <View style={[styles.chip, styles.chipMaxPrice]}>
          <Text style={[styles.chipText, styles.chipMaxPriceText, styles.tabularNums]}>
            {`Max ${formatCentsAsPrice(entry.maxPriceCents)}`}
          </Text>
        </View>
      </View>

      <Text style={styles.cardMeta}>{entry.addedOnLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  header: {
    paddingTop: tokens.space(4),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  subtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(4),
    lineHeight: 18,
  },
  addButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: tokens.space(5),
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  formCard: {
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(5),
  },
  formHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  fieldGroup: {
    marginBottom: tokens.space(3),
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
    marginBottom: tokens.space(1),
  },
  textInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    fontSize: 15,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  textInputError: {
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
  },
  fieldError: {
    fontSize: 12,
    color: tokens.color.danger,
    marginTop: tokens.space(1),
  },
  conditionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
    marginBottom: tokens.space(3),
  },
  conditionChip: {
    minHeight: 36,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  conditionChipSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  conditionChipPressed: {
    opacity: 0.7,
  },
  conditionChipText: {
    fontSize: 13,
    color: tokens.color.ink2,
    fontWeight: "600",
  },
  conditionChipTextSelected: {
    color: tokens.color.accent,
  },
  closeFormButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(1),
  },
  closeFormButtonPressed: {
    opacity: 0.6,
  },
  closeFormButtonText: {
    fontSize: 13,
    color: tokens.color.muted,
    fontWeight: "600",
  },
  closeFormHint: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  emptyText: {
    fontSize: 13,
    color: tokens.color.muted,
    paddingVertical: tokens.space(4),
  },
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
  },
  cardEditing: {
    borderColor: tokens.color.accent,
  },
  cardPressed: {
    opacity: 0.85,
  },
  editingTag: {
    fontSize: 10,
    fontWeight: "700",
    color: tokens.color.accent,
    letterSpacing: 0.5,
    marginBottom: tokens.space(1),
  },
  cardBrand: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  cardModel: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(2),
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
    marginBottom: tokens.space(2),
  },
  chip: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  chipMaxPrice: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  chipText: {
    fontSize: 12,
    color: tokens.color.ink2,
    fontWeight: "600",
  },
  chipMaxPriceText: {
    color: tokens.color.accent,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  cardMeta: {
    fontSize: 11,
    color: tokens.color.faint,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  bandText: {
    fontSize: 13,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
  },
  bandActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: tokens.space(3),
  },
  bandButton: {
    minHeight: 44,
    minWidth: 96,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  bandButtonGhost: {
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  bandButtonSolid: {
    backgroundColor: tokens.color.accent,
  },
  bandButtonPressed: {
    opacity: 0.8,
  },
  bandButtonGhostText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  bandButtonSolidText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
