// native/src/evolve/r5/c/SavedSearchesScreen.tsx — auto-native-r5 candidate c.
// Saved searches & alerts management: a flat, always-scrolling FlatList of saved search cards —
// no fixed header band, no fixed bottom action bar (per r2's validated settings-screen lesson).
// Structurally distinct from the account/Preferences settings screen it is closest in kind to:
// that screen is a SectionList of grouped field rows (toggle/segmented/stepper/display) under a
// pinned-feeling identity card; this screen is a single FlatList of self-contained per-item cards
// (one saved search = one card) where every control (alert toggle, frequency editor, remove) is
// scoped to that one row, not to a section. Every change applies immediately in place, confirmed
// with a small inline live-region tag next to the row it affects — no deferred "Save" step.
import { useState } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";
import {
  FREQUENCY_LABEL,
  FREQUENCY_ORDER,
  SAVED_SEARCHES,
  matchSummary,
  type FrequencyKey,
  type SavedSearch,
} from "./data";
import { tokens } from "../../../tokens";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

function StatusTag({ text }: { text: string }) {
  return (
    <Text style={styles.statusTag} accessibilityLiveRegion="polite">
      {text}
    </Text>
  );
}

function SavedSearchRow({
  item,
  isPendingRemove,
  isEditingFrequency,
  statusTag,
  onToggleAlert,
  onRequestRemove,
  onCancelRemove,
  onConfirmRemove,
  onStartEditFrequency,
  onCancelEditFrequency,
  onSetFrequency,
}: {
  item: SavedSearch;
  isPendingRemove: boolean;
  isEditingFrequency: boolean;
  statusTag?: string;
  onToggleAlert: () => void;
  onRequestRemove: () => void;
  onCancelRemove: () => void;
  onConfirmRemove: () => void;
  onStartEditFrequency: () => void;
  onCancelEditFrequency: () => void;
  onSetFrequency: (freq: FrequencyKey) => void;
}) {
  const hasMatches = item.newMatches > 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.queryCol}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.query}>{item.query}</Text>
        </View>
        <Pressable
          onPress={onToggleAlert}
          accessibilityRole="switch"
          accessibilityState={{ checked: item.alertEnabled }}
          accessibilityLabel={`Alert for ${item.query}, ${item.alertEnabled ? "on" : "off"}`}
          hitSlop={HIT_SLOP}
          style={[styles.track, item.alertEnabled ? styles.trackOn : styles.trackOff]}
        >
          <View style={[styles.thumb, item.alertEnabled ? styles.thumbOn : styles.thumbOff]} />
        </Pressable>
      </View>

      <View style={styles.matchRow}>
        <View style={[styles.matchDot, hasMatches ? styles.matchDotActive : styles.matchDotEmpty]} />
        <Text style={[styles.matchText, hasMatches && styles.matchTextActive]}>
          {matchSummary(item.newMatches)}
        </Text>
      </View>

      {statusTag ? <StatusTag text={statusTag} /> : null}

      <View style={styles.metaRow}>
        <Text style={styles.savedLabel}>{item.savedLabel}</Text>
        <Text style={styles.freqLabel}>Alerts: {FREQUENCY_LABEL[item.frequency]}</Text>
      </View>

      {isEditingFrequency ? (
        <View
          style={styles.freqEditor}
          accessibilityRole="radiogroup"
          accessibilityLabel={`Choose alert frequency for ${item.query}`}
        >
          {FREQUENCY_ORDER.map((key) => {
            const selected = key === item.frequency;
            return (
              <Pressable
                key={key}
                onPress={() => onSetFrequency(key)}
                accessibilityRole="radio"
                accessibilityState={{ selected, checked: selected }}
                accessibilityLabel={FREQUENCY_LABEL[key]}
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.freqOption,
                  selected && styles.freqOptionOn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.freqOptionLabel, selected && styles.freqOptionLabelOn]}>
                  {FREQUENCY_LABEL[key]}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={onCancelEditFrequency}
            accessibilityRole="button"
            accessibilityLabel="Close frequency editor"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.freqCancel, pressed && styles.pressed]}
          >
            <Text style={styles.freqCancelLabel}>Cancel</Text>
          </Pressable>
        </View>
      ) : isPendingRemove ? (
        <View style={styles.confirmRow}>
          <Text style={styles.confirmPrompt}>Remove this saved search?</Text>
          <View style={styles.confirmButtons}>
            <Pressable
              onPress={onConfirmRemove}
              accessibilityRole="button"
              accessibilityLabel={`Confirm remove ${item.query}`}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnStrong, pressed && styles.pressed]}
            >
              <Text style={styles.confirmBtnLabelOn}>Remove</Text>
            </Pressable>
            <Pressable
              onPress={onCancelRemove}
              accessibilityRole="button"
              accessibilityLabel="Cancel remove"
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnGhost, pressed && styles.pressed]}
            >
              <Text style={styles.confirmBtnLabelGhost}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <Pressable
            onPress={onStartEditFrequency}
            accessibilityRole="button"
            accessibilityLabel={`Edit alert frequency for ${item.query}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          >
            <Text style={styles.actionBtnLabel}>Edit frequency</Text>
          </Pressable>
          <Pressable
            onPress={onRequestRemove}
            accessibilityRole="button"
            accessibilityLabel={`Remove saved search ${item.query}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          >
            <Text style={styles.actionBtnLabelDestructive}>Remove</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function ScreenHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.h1} accessibilityRole="header">
        Saved searches
      </Text>
      <Text style={styles.sub}>
        Manage alerts for the searches you've saved. Every change here applies right away.
      </Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No saved searches</Text>
      <Text style={styles.emptyBody}>
        Save a search from any listings page and it will show up here with its own alert controls.
      </Text>
    </View>
  );
}

export function SavedSearchesScreen() {
  const [searches, setSearches] = useState<SavedSearch[]>(() => SAVED_SEARCHES.map((s) => ({ ...s })));
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [editingFrequencyId, setEditingFrequencyId] = useState<string | null>(null);
  const [statusTags, setStatusTags] = useState<Record<string, string>>({});

  const toggleAlert = (id: string) => {
    const current = searches.find((s) => s.id === id);
    const nextOn = current ? !current.alertEnabled : true;
    setSearches((prev) => prev.map((s) => (s.id === id ? { ...s, alertEnabled: nextOn } : s)));
    setStatusTags((prev) => ({ ...prev, [id]: nextOn ? "Alerts turned on" : "Alerts turned off" }));
  };

  const startEditFrequency = (id: string) => {
    setPendingRemoveId(null);
    setEditingFrequencyId(id);
  };

  const cancelEditFrequency = () => setEditingFrequencyId(null);

  const setFrequency = (id: string, freq: FrequencyKey) => {
    setSearches((prev) => prev.map((s) => (s.id === id ? { ...s, frequency: freq } : s)));
    setStatusTags((prev) => ({ ...prev, [id]: `Frequency set to ${FREQUENCY_LABEL[freq]}` }));
    setEditingFrequencyId(null);
  };

  const requestRemove = (id: string) => {
    setEditingFrequencyId(null);
    setPendingRemoveId(id);
  };

  const cancelRemove = () => setPendingRemoveId(null);

  const confirmRemove = (id: string) => {
    setSearches((prev) => prev.filter((s) => s.id !== id));
    setPendingRemoveId(null);
    setStatusTags((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={searches}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ScreenHeader}
        ListEmptyComponent={EmptyState}
        renderItem={({ item }) => (
          <SavedSearchRow
            item={item}
            isPendingRemove={pendingRemoveId === item.id}
            isEditingFrequency={editingFrequencyId === item.id}
            statusTag={statusTags[item.id]}
            onToggleAlert={() => toggleAlert(item.id)}
            onRequestRemove={() => requestRemove(item.id)}
            onCancelRemove={cancelRemove}
            onConfirmRemove={() => confirmRemove(item.id)}
            onStartEditFrequency={() => startEditFrequency(item.id)}
            onCancelEditFrequency={cancelEditFrequency}
            onSetFrequency={(freq) => setFrequency(item.id, freq)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },
  list: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(10) },

  header: { paddingTop: tokens.space(10), paddingBottom: tokens.space(4) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint, lineHeight: 18 },

  card: {
    marginBottom: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },

  cardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: tokens.space(3) },
  queryCol: { flex: 1, gap: 2 },
  category: { fontSize: 11, fontWeight: "700", color: tokens.color.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  query: { fontSize: 16, fontWeight: "700", color: tokens.color.ink, lineHeight: 21 },

  /* toggle switch — track (radius.md → pill) + thumb (radius.sm → circle), token radii only */
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

  /* match summary — shape (filled vs. hollow dot) carries the state, not color alone */
  matchRow: { marginTop: tokens.space(3), flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  matchDot: { width: 8, height: 8, borderRadius: tokens.radius.sm },
  matchDotActive: { backgroundColor: tokens.color.accent },
  matchDotEmpty: { backgroundColor: tokens.color.bg, borderWidth: 1, borderColor: tokens.color.border },
  matchText: { fontSize: 13, color: tokens.color.faint },
  matchTextActive: { color: tokens.color.accent, fontWeight: "700" },

  statusTag: { marginTop: tokens.space(2), fontSize: 11, fontWeight: "700", color: tokens.color.accent },

  metaRow: { marginTop: tokens.space(3), flexDirection: "row", justifyContent: "space-between" },
  savedLabel: { fontSize: 12, color: tokens.color.faint },
  freqLabel: { fontSize: 12, color: tokens.color.muted, fontWeight: "600" },

  actionRow: { marginTop: tokens.space(3), flexDirection: "row", gap: tokens.space(2) },
  actionBtn: {
    minHeight: 44,
    flexGrow: 1,
    flexBasis: 0,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  actionBtnLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },
  actionBtnLabelDestructive: { fontSize: 13, fontWeight: "700", color: tokens.color.ink },

  /* inline frequency editor — replaces the action row in place, no navigation away */
  freqEditor: { marginTop: tokens.space(3), gap: tokens.space(2) },
  freqOption: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
  },
  freqOptionOn: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  freqOptionLabel: { fontSize: 14, fontWeight: "600", color: tokens.color.ink2 },
  freqOptionLabelOn: { color: tokens.color.onAccent },
  freqCancel: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  freqCancelLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.faint },

  /* inline destructive confirm — replaces the action row in place */
  confirmRow: { marginTop: tokens.space(3), gap: tokens.space(2) },
  confirmPrompt: { fontSize: 13, fontWeight: "600", color: tokens.color.ink },
  confirmButtons: { flexDirection: "row", gap: tokens.space(2) },
  confirmBtn: {
    minHeight: 44,
    flexGrow: 1,
    flexBasis: 0,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  confirmBtnStrong: { backgroundColor: tokens.color.ink2 },
  confirmBtnGhost: { borderWidth: 1, borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  confirmBtnLabelOn: { fontSize: 13, fontWeight: "700", color: tokens.color.onAccent },
  confirmBtnLabelGhost: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },

  /* empty state — reached by removing every saved search */
  emptyState: { marginTop: tokens.space(10), alignItems: "center", paddingHorizontal: tokens.space(6) },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.ink },
  emptyBody: { marginTop: tokens.space(2), fontSize: 13, color: tokens.color.faint, textAlign: "center", lineHeight: 18 },

  pressed: { opacity: 0.85 },
});
