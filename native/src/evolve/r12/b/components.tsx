// native/src/evolve/r12/b/components.tsx — row-level pieces for SavedSearchAlertsScreen,
// split out to keep the screen file focused on list/state wiring.
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  FREQUENCY_OPTIONS,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
  formatKRW,
  type AlertFrequency,
  type SavedSearch,
} from "./data";
import { tokens } from "../../../tokens";

export const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

/* ───────── frequency control — every option always visible, no hover-only state ───────── */

export function FrequencySegmented({
  value,
  onChange,
  label,
}: {
  value: AlertFrequency;
  onChange: (next: AlertFrequency) => void;
  label: string;
}) {
  return (
    <View style={styles.segmentGroup} accessibilityRole="radiogroup" accessibilityLabel={`${label} alert frequency`}>
      {FREQUENCY_OPTIONS.map((opt) => {
        const selected = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected }}
            accessibilityLabel={opt.label}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.segmentOption,
              selected && styles.segmentOptionOn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.segmentLabel, selected && styles.segmentLabelOn]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ───────── filter chips — static display chips, and removable chips inside the edit panel ───────── */

export function FilterChip({ text }: { text: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

export function RemovableChip({ text, onRemove }: { text: string; onRemove: () => void }) {
  return (
    <View style={[styles.chip, styles.chipRemovable]}>
      <Text style={styles.chipText}>{text}</Text>
      <Pressable
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={`Remove filter: ${text}`}
        hitSlop={HIT_SLOP}
        style={styles.chipRemoveBtn}
      >
        <Text style={styles.chipRemoveGlyph}>×</Text>
      </Pressable>
    </View>
  );
}

/* ───────── price ceiling stepper — the editable numeric part of the query ───────── */

export function PriceCeilingStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  const atMin = value <= PRICE_MIN;
  const atMax = value >= PRICE_MAX;
  return (
    <View style={styles.stepperRow}>
      <Pressable
        onPress={() => onChange(Math.max(PRICE_MIN, value - PRICE_STEP))}
        disabled={atMin}
        accessibilityRole="button"
        accessibilityLabel={`Lower price ceiling by ${formatKRW(PRICE_STEP)}`}
        accessibilityState={{ disabled: atMin }}
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [styles.step, atMin && styles.stepDisabled, pressed && !atMin && styles.pressed]}
      >
        <Text style={styles.stepGlyph}>−</Text>
      </Pressable>
      <Text style={styles.stepperValue} accessibilityLabel={`Price ceiling ${formatKRW(value)}`}>
        {formatKRW(value)}
      </Text>
      <Pressable
        onPress={() => onChange(Math.min(PRICE_MAX, value + PRICE_STEP))}
        disabled={atMax}
        accessibilityRole="button"
        accessibilityLabel={`Raise price ceiling by ${formatKRW(PRICE_STEP)}`}
        accessibilityState={{ disabled: atMax }}
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [styles.step, atMax && styles.stepDisabled, pressed && !atMax && styles.pressed]}
      >
        <Text style={styles.stepGlyph}>+</Text>
      </Pressable>
    </View>
  );
}

/* ───────── delete confirm — inline two-tap confirm, consistent with the rest of the catalog ───────── */

export function DeleteConfirmRow({
  query,
  onConfirm,
  onCancel,
}: {
  query: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <View style={styles.confirmStack}>
      <Text style={styles.confirmPrompt}>Delete “{query}”? You’ll stop getting alerts for it.</Text>
      <View style={styles.confirmRow}>
        <Pressable
          onPress={onConfirm}
          accessibilityRole="button"
          accessibilityLabel={`Confirm delete: ${query}`}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnStrong, pressed && styles.pressed]}
        >
          <Text style={styles.confirmBtnLabelOn}>Delete</Text>
        </Pressable>
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel delete"
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnGhost, pressed && styles.pressed]}
        >
          <Text style={styles.confirmBtnLabelGhost}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ───────── whole row ───────── */

export function SavedSearchRow({
  item,
  isEditing,
  isConfirmingDelete,
  onSetFrequency,
  onToggleEdit,
  onRemoveFilter,
  onChangePrice,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  item: SavedSearch;
  isEditing: boolean;
  isConfirmingDelete: boolean;
  onSetFrequency: (next: AlertFrequency) => void;
  onToggleEdit: () => void;
  onRemoveFilter: (index: number) => void;
  onChangePrice: (next: number) => void;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.query} accessibilityRole="header" numberOfLines={2}>
        {item.query}
      </Text>

      <View style={styles.chipRow}>
        <FilterChip text={`Under ${formatKRW(item.priceCeiling)}`} />
        {item.filters.map((f, i) => (
          <FilterChip key={`${item.id}-f-${i}`} text={f} />
        ))}
      </View>

      <Text style={styles.metaLine}>
        {item.matchesThisWeek} match{item.matchesThisWeek === 1 ? "" : "es"} this week · saved {item.savedOn}
      </Text>

      <View style={styles.frequencyBlock}>
        <Text style={styles.frequencyLabel}>Alert me</Text>
        <FrequencySegmented value={item.frequency} onChange={onSetFrequency} label={item.query} />
      </View>

      {isConfirmingDelete ? (
        <DeleteConfirmRow query={item.query} onConfirm={onConfirmDelete} onCancel={onCancelDelete} />
      ) : (
        <View style={styles.actionRow}>
          <Pressable
            onPress={onToggleEdit}
            accessibilityRole="button"
            accessibilityLabel={isEditing ? `Done editing ${item.query}` : `Edit filters for ${item.query}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          >
            <Text style={styles.actionBtnLabel}>{isEditing ? "Done" : "Edit"}</Text>
          </Pressable>
          <Pressable
            onPress={onRequestDelete}
            accessibilityRole="button"
            accessibilityLabel={`Delete saved search: ${item.query}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.actionBtn, styles.actionBtnGhost, pressed && styles.pressed]}
          >
            <Text style={styles.actionBtnLabelMuted}>Delete</Text>
          </Pressable>
        </View>
      )}

      {isEditing && (
        <View style={styles.editPanel}>
          <Text style={styles.editPanelLabel}>Price ceiling</Text>
          <PriceCeilingStepper value={item.priceCeiling} onChange={onChangePrice} />

          <Text style={[styles.editPanelLabel, styles.editPanelLabelSpaced]}>Other filters</Text>
          {item.filters.length === 0 ? (
            <Text style={styles.noFiltersText}>No extra filters — matches every listing under the price ceiling.</Text>
          ) : (
            <View style={styles.chipRow}>
              {item.filters.map((f, i) => (
                <RemovableChip key={`${item.id}-edit-${i}`} text={f} onRemove={() => onRemoveFilter(i)} />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  category: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  query: { marginTop: 2, fontSize: 17, fontWeight: "800", color: tokens.color.ink, lineHeight: 22 },

  chipRow: { marginTop: tokens.space(3), flexDirection: "row", flexWrap: "wrap", gap: tokens.space(2) },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 5,
  },
  chipRemovable: { paddingRight: 4, gap: 6 },
  chipText: { fontSize: 12, fontWeight: "600", color: tokens.color.muted },
  chipRemoveBtn: { alignItems: "center", justifyContent: "center", width: 18, height: 18 },
  chipRemoveGlyph: { fontSize: 14, fontWeight: "700", color: tokens.color.faint, lineHeight: 16 },

  metaLine: { marginTop: tokens.space(3), fontSize: 12, color: tokens.color.faint },

  frequencyBlock: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(2),
  },
  frequencyLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },

  segmentGroup: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: 2,
    gap: 2,
  },
  segmentOption: {
    minHeight: 32,
    paddingHorizontal: tokens.space(2),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
  },
  segmentOptionOn: { backgroundColor: tokens.color.accent },
  segmentLabel: { fontSize: 12, fontWeight: "700", color: tokens.color.muted },
  segmentLabelOn: { color: tokens.color.onAccent },

  actionRow: { marginTop: tokens.space(4), flexDirection: "row", gap: tokens.space(2) },
  actionBtn: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.ink2,
  },
  actionBtnGhost: { backgroundColor: tokens.color.bg, borderWidth: 1, borderColor: tokens.color.border },
  actionBtnLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.onAccent },
  actionBtnLabelMuted: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },

  editPanel: {
    marginTop: tokens.space(4),
    paddingTop: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  editPanelLabel: { fontSize: 12, fontWeight: "700", color: tokens.color.muted },
  editPanelLabelSpaced: { marginTop: tokens.space(4) },
  noFiltersText: { marginTop: tokens.space(2), fontSize: 12, color: tokens.color.faint, lineHeight: 16 },

  stepperRow: {
    marginTop: tokens.space(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  step: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDisabled: { opacity: 0.4 },
  stepGlyph: { fontSize: 20, fontWeight: "700", color: tokens.color.ink2, lineHeight: 22 },
  stepperValue: { fontSize: 15, fontWeight: "800", color: tokens.color.ink },

  confirmStack: { marginTop: tokens.space(4), gap: tokens.space(2) },
  confirmPrompt: { fontSize: 13, color: tokens.color.ink2, lineHeight: 18 },
  confirmRow: { flexDirection: "row", gap: tokens.space(2) },
  confirmBtn: {
    flexGrow: 1,
    flexBasis: 0,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  confirmBtnStrong: { backgroundColor: tokens.color.accent },
  confirmBtnGhost: { borderWidth: 1, borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  confirmBtnLabelOn: { fontSize: 13, fontWeight: "700", color: tokens.color.onAccent },
  confirmBtnLabelGhost: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },

  pressed: { opacity: 0.85 },
});
