// native/src/evolve/r18/b/SavedSearchesScreen.tsx
//
// Saved Searches & Price Alerts — a settings-type management screen, not a terminal-action
// workflow. The buyer's job here is never "done" by reaching a final submit; it's done
// continuously as they flip a notify toggle, nudge a price ceiling, or remove a search they no
// longer need. So there is no Save button, no draft state, and — per this archetype's
// established convention (see account/Preferences.tsx) — no fixed bottom chrome of any kind.
// Every row applies its own change immediately. "Add a saved search" lives as a header-level
// row inside the scroll, not pinned. Deleting a search is reversible and low-stakes, so it gets
// an inline "Removed · Undo" placeholder row instead of a modal confirmation.
import { useMemo, useRef, useState } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import {
  INITIAL_SAVED_SEARCHES,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
  clampPrice,
  filterSummary,
  formatKrw,
  matchesLabel,
  newSavedSearchTemplate,
  type Condition,
  type SavedSearch,
} from "./data";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

type ListRow = { kind: "search"; data: SavedSearch } | { kind: "removed"; data: SavedSearch };

/* ───────── header — title, blurb, and the in-flow "add" affordance ───────── */

function ScreenHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.h1} accessibilityRole="header">
        Saved Searches & Alerts
      </Text>
      <Text style={styles.sub}>
        Every change below applies right away — there's nothing to save.
      </Text>
      <Pressable
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel="Add a new saved search"
        style={({ pressed }) => [styles.addRow, pressed && styles.pressed]}
      >
        <View style={styles.addGlyphWrap}>
          <Text style={styles.addGlyph}>+</Text>
        </View>
        <Text style={styles.addLabel}>Add a saved search</Text>
      </Pressable>
    </View>
  );
}

/* ───────── size chip picker (inline edit field) ───────── */

function SizeChips({
  brand,
  options,
  index,
  onChange,
}: {
  brand: string;
  options: string[];
  index: number;
  onChange: (next: number) => void;
}) {
  return (
    <View>
      <Text style={styles.fieldLabel}>Size</Text>
      <View style={styles.chipGroup} accessibilityRole="radiogroup" accessibilityLabel={`Size for ${brand}`}>
        {options.map((opt, i) => {
          const selected = i === index;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(i)}
              accessibilityRole="radio"
              accessibilityState={{ selected, checked: selected }}
              accessibilityLabel={`Size ${opt}`}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [styles.chip, selected && styles.chipOn, pressed && styles.pressed]}
            >
              <Text style={[styles.chipLabel, selected && styles.chipLabelOn]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* ───────── price ceiling stepper (inline edit field) ───────── */

function PriceStepper({
  brand,
  value,
  onChange,
}: {
  brand: string;
  value: number;
  onChange: (next: number) => void;
}) {
  const atMin = value <= PRICE_MIN;
  const atMax = value >= PRICE_MAX;
  return (
    <View>
      <View style={styles.fieldHead}>
        <Text style={styles.fieldLabel}>Price ceiling</Text>
        <Text style={styles.fieldValue}>{formatKrw(value)}</Text>
      </View>
      <View style={styles.stepperControls}>
        <Pressable
          onPress={() => onChange(clampPrice(value - PRICE_STEP))}
          disabled={atMin}
          accessibilityRole="button"
          accessibilityLabel={`Lower price ceiling for ${brand} by ${formatKrw(PRICE_STEP)}`}
          accessibilityState={{ disabled: atMin }}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.step, atMin && styles.stepDisabled, pressed && !atMin && styles.pressed]}
        >
          <Text style={styles.stepGlyph}>−</Text>
        </Pressable>
        <Text style={styles.stepperRange}>
          {formatKrw(PRICE_MIN)} – {formatKrw(PRICE_MAX)}
        </Text>
        <Pressable
          onPress={() => onChange(clampPrice(value + PRICE_STEP))}
          disabled={atMax}
          accessibilityRole="button"
          accessibilityLabel={`Raise price ceiling for ${brand} by ${formatKrw(PRICE_STEP)}`}
          accessibilityState={{ disabled: atMax }}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.step, atMax && styles.stepDisabled, pressed && !atMax && styles.pressed]}
        >
          <Text style={styles.stepGlyph}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ───────── condition segmented control (inline edit field) ───────── */

function ConditionSegmented({
  brand,
  value,
  onChange,
}: {
  brand: string;
  value: Condition;
  onChange: (next: Condition) => void;
}) {
  const options: { key: Condition; label: string }[] = [
    { key: "any", label: "Any condition" },
    { key: "new", label: "New only" },
  ];
  return (
    <View>
      <Text style={styles.fieldLabel}>Condition</Text>
      <View style={styles.segmentGroup} accessibilityRole="radiogroup" accessibilityLabel={`Condition for ${brand}`}>
        {options.map((opt) => {
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
    </View>
  );
}

/* ───────── notify toggle (custom Pressable switch, matches Preferences.tsx) ───────── */

function NotifyToggle({ item, onChange }: { item: SavedSearch; onChange: (next: boolean) => void }) {
  const size = item.sizeOptions[item.sizeIndex];
  const label = `Notify me when new ${item.brand} size ${size} matches under ${formatKrw(item.priceMax)} appear`;
  return (
    <Pressable
      onPress={() => onChange(!item.notify)}
      accessibilityRole="switch"
      accessibilityState={{ checked: item.notify }}
      accessibilityLabel={label}
      hitSlop={HIT_SLOP}
      style={[styles.track, item.notify ? styles.trackOn : styles.trackOff]}
    >
      <View style={[styles.thumb, item.notify ? styles.thumbOn : styles.thumbOff]} />
    </Pressable>
  );
}

/* ───────── one saved-search row ───────── */

function SearchRow({
  item,
  editing,
  onToggleNotify,
  onToggleEdit,
  onDelete,
  onSizeChange,
  onPriceChange,
  onConditionChange,
}: {
  item: SavedSearch;
  editing: boolean;
  onToggleNotify: (id: string, next: boolean) => void;
  onToggleEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSizeChange: (id: string, index: number) => void;
  onPriceChange: (id: string, next: number) => void;
  onConditionChange: (id: string, next: Condition) => void;
}) {
  const hasMatches = item.newMatches > 0;
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardTopText}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.summary}>{filterSummary(item)}</Text>
          <View style={styles.matchRow}>
            {hasMatches ? (
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>{matchesLabel(item.newMatches)}</Text>
              </View>
            ) : (
              <Text style={styles.matchMuted}>{matchesLabel(item.newMatches)}</Text>
            )}
          </View>
        </View>
        <NotifyToggle item={item} onChange={(next) => onToggleNotify(item.id, next)} />
      </View>

      {editing ? (
        <View style={styles.editPanel}>
          <SizeChips
            brand={item.brand}
            options={item.sizeOptions}
            index={item.sizeIndex}
            onChange={(i) => onSizeChange(item.id, i)}
          />
          <PriceStepper brand={item.brand} value={item.priceMax} onChange={(v) => onPriceChange(item.id, v)} />
          <ConditionSegmented
            brand={item.brand}
            value={item.condition}
            onChange={(c) => onConditionChange(item.id, c)}
          />
        </View>
      ) : null}

      <View style={styles.cardFooter}>
        <Text style={styles.savedLabel}>{item.savedLabel}</Text>
        <View style={styles.footerActions}>
          <Pressable
            onPress={() => onToggleEdit(item.id)}
            accessibilityRole="button"
            accessibilityState={{ expanded: editing }}
            accessibilityLabel={`${editing ? "Done editing" : "Edit"} filters for ${item.brand}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.footerBtn, pressed && styles.pressed]}
          >
            <Text style={styles.footerBtnText}>{editing ? "Done" : "Edit"}</Text>
          </Pressable>
          <Pressable
            onPress={() => onDelete(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`Remove saved search for ${item.brand}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.footerBtn, pressed && styles.pressed]}
          >
            <Text style={styles.footerBtnTextDestructive}>Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ───────── inline undo placeholder — the only live region on screen ───────── */

function RemovedRow({
  item,
  onUndo,
  onDismiss,
}: {
  item: SavedSearch;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  return (
    <View style={styles.removedCard} accessibilityLiveRegion="polite">
      <Text accessibilityRole="alert" style={styles.removedText}>
        Removed {item.brand} · Undo
      </Text>
      <Pressable
        onPress={onUndo}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={`Undo removing ${item.brand}`}
        style={styles.removedAction}
      >
        <Text style={styles.removedActionText}>Undo</Text>
      </Pressable>
      <Pressable
        onPress={onDismiss}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel="Dismiss, finish removing"
        style={styles.removedDismiss}
      >
        <Text style={styles.removedDismissText}>{"✕"}</Text>
      </Pressable>
    </View>
  );
}

/* ───────── empty state ───────── */

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No saved searches yet</Text>
      <Text style={styles.emptyBody}>
        Save a search for the item you're hunting and we'll alert you when new matches list.
      </Text>
      <Pressable
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel="Add a new saved search"
        style={({ pressed }) => [styles.emptyAction, pressed && styles.pressed]}
      >
        <Text style={styles.emptyActionText}>Add a saved search</Text>
      </Pressable>
    </View>
  );
}

/* ───────── screen ───────── */

export function SavedSearchesScreen() {
  const [items, setItems] = useState<SavedSearch[]>(INITIAL_SAVED_SEARCHES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removed, setRemoved] = useState<{ item: SavedSearch; index: number } | null>(null);
  const newCounter = useRef(0);

  // Any interaction other than Undo/Dismiss counts as "moving on" — it commits whatever pending
  // removal is showing (there's nothing to restore; the item already left `items`).
  const settlePending = () => setRemoved(null);

  const handleAdd = () => {
    settlePending();
    newCounter.current += 1;
    const created = newSavedSearchTemplate(newCounter.current);
    setItems((prev) => [created, ...prev]);
    setEditingId(created.id); // opens straight into its live-editable fields — no separate draft step
  };

  const handleToggleEdit = (id: string) => {
    settlePending();
    setEditingId((prev) => (prev === id ? null : id));
  };

  const handleToggleNotify = (id: string, next: boolean) => {
    settlePending();
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, notify: next } : it)));
  };

  const handleSizeChange = (id: string, index: number) => {
    settlePending();
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, sizeIndex: index } : it)));
  };

  const handlePriceChange = (id: string, next: number) => {
    settlePending();
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, priceMax: next } : it)));
  };

  const handleConditionChange = (id: string, next: Condition) => {
    settlePending();
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, condition: next } : it)));
  };

  const handleDelete = (id: string) => {
    settlePending();
    const index = items.findIndex((it) => it.id === id);
    if (index === -1) return;
    const item = items[index];
    if (editingId === id) setEditingId(null);
    setItems((prev) => prev.filter((it) => it.id !== id));
    setRemoved({ item, index });
  };

  const handleUndo = () => {
    if (!removed) return;
    setItems((prev) => {
      const next = [...prev];
      const index = Math.min(removed.index, next.length);
      next.splice(index, 0, removed.item);
      return next;
    });
    setRemoved(null);
  };

  const handleDismissRemoved = () => setRemoved(null);

  const listData = useMemo<ListRow[]>(() => {
    const rows: ListRow[] = items.map((it) => ({ kind: "search", data: it }));
    if (removed) {
      const index = Math.min(removed.index, rows.length);
      rows.splice(index, 0, { kind: "removed", data: removed.item });
    }
    return rows;
  }, [items, removed]);

  return (
    <SafeAreaView style={styles.root}>
      <FlatList<ListRow>
        data={listData}
        keyExtractor={(row) => (row.kind === "removed" ? `removed-${row.data.id}` : row.data.id)}
        ListHeaderComponent={<ScreenHeader onAdd={handleAdd} />}
        ListEmptyComponent={<EmptyState onAdd={handleAdd} />}
        renderItem={({ item: row }) =>
          row.kind === "removed" ? (
            <RemovedRow item={row.data} onUndo={handleUndo} onDismiss={handleDismissRemoved} />
          ) : (
            <SearchRow
              item={row.data}
              editing={editingId === row.data.id}
              onToggleNotify={handleToggleNotify}
              onToggleEdit={handleToggleEdit}
              onDelete={handleDelete}
              onSizeChange={handleSizeChange}
              onPriceChange={handlePriceChange}
              onConditionChange={handleConditionChange}
            />
          )
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default SavedSearchesScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },
  list: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(10) },

  /* header — scrolls with everything else, nothing pinned */
  header: { paddingTop: tokens.space(10), paddingBottom: tokens.space(4) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint, lineHeight: 18 },

  addRow: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    borderStyle: "dashed",
    paddingHorizontal: tokens.space(4),
  },
  addGlyphWrap: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  addGlyph: { color: tokens.color.onAccent, fontSize: 15, fontWeight: "800", lineHeight: 16 },
  addLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.accent },

  /* saved-search card */
  card: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(3),
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: tokens.space(3) },
  cardTopText: { flex: 1, gap: 4 },
  brand: { fontSize: 16, fontWeight: "700", color: tokens.color.ink },
  summary: { fontSize: 13, color: tokens.color.muted, lineHeight: 18 },
  matchRow: { flexDirection: "row", marginTop: 2 },
  matchBadge: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: 3,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  matchBadgeText: { fontSize: 11, fontWeight: "700", color: tokens.color.onAccent, fontVariant: ["tabular-nums"] },
  matchMuted: { fontSize: 12, color: tokens.color.faint },

  /* inline edit panel */
  editPanel: {
    gap: tokens.space(4),
    paddingTop: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  fieldLabel: { fontSize: 11, fontWeight: "700", color: tokens.color.muted, letterSpacing: 0.4, textTransform: "uppercase" },
  fieldHead: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  fieldValue: { fontSize: 16, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },

  chipGroup: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space(2), marginTop: tokens.space(2) },
  chip: {
    minWidth: 44,
    minHeight: 36,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  chipOn: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  chipLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2, fontVariant: ["tabular-nums"] },
  chipLabelOn: { color: tokens.color.onAccent },

  stepperControls: {
    marginTop: tokens.space(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  stepperRange: { fontSize: 11, color: tokens.color.faint, fontVariant: ["tabular-nums"] },

  segmentGroup: {
    marginTop: tokens.space(2),
    flexDirection: "row",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: 2,
    gap: 2,
  },
  segmentOption: {
    flex: 1,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
  },
  segmentOptionOn: { backgroundColor: tokens.color.accent },
  segmentLabel: { fontSize: 12, fontWeight: "700", color: tokens.color.muted },
  segmentLabelOn: { color: tokens.color.onAccent },

  /* notify toggle — track (radius.md → pill) + thumb (radius.sm → circle) */
  track: {
    width: 40,
    height: 24,
    borderRadius: tokens.radius.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: tokens.space(1),
  },
  trackOn: { backgroundColor: tokens.color.accent, justifyContent: "flex-end" },
  trackOff: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    justifyContent: "flex-start",
  },
  thumb: { width: 12, height: 12, borderRadius: tokens.radius.sm },
  thumbOn: { backgroundColor: tokens.color.onAccent },
  thumbOff: { backgroundColor: tokens.color.faint },

  /* card footer — edit / remove */
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: tokens.space(2),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  savedLabel: { fontSize: 11, color: tokens.color.faint },
  footerActions: { flexDirection: "row", gap: tokens.space(4) },
  footerBtn: { minHeight: 44, justifyContent: "center" },
  footerBtnText: { fontSize: 13, fontWeight: "700", color: tokens.color.accent },
  footerBtnTextDestructive: { fontSize: 13, fontWeight: "700", color: tokens.color.muted },

  /* removed / undo placeholder row — the screen's single live region */
  removedCard: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    borderStyle: "dashed",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  removedText: { flex: 1, fontSize: 13, color: tokens.color.muted },
  removedAction: { minHeight: 44, justifyContent: "center" },
  removedActionText: { fontSize: 13, fontWeight: "800", color: tokens.color.accent },
  removedDismiss: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  removedDismissText: { fontSize: 14, color: tokens.color.faint },

  /* empty state */
  empty: { marginTop: tokens.space(10), alignItems: "center", paddingHorizontal: tokens.space(6), gap: tokens.space(3) },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: tokens.color.ink },
  emptyBody: { fontSize: 13, color: tokens.color.faint, textAlign: "center", lineHeight: 18 },
  emptyAction: {
    marginTop: tokens.space(2),
    minHeight: 44,
    paddingHorizontal: tokens.space(5),
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
  },
  emptyActionText: { fontSize: 14, fontWeight: "700", color: tokens.color.onAccent },

  pressed: { opacity: 0.85 },
});
