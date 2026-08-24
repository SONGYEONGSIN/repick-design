// native/src/evolve/r12/b/SavedSearchAlertsScreen.tsx — auto-native-r12 candidate b.
//
// Archetype: Saved Search Alerts — a management screen for the buyer's saved *queries*
// (not tracked items, that's `watchlist`; not general settings, that's `account`). There is no
// terminal action here: every row change (frequency, edit, delete) applies immediately in place.
//
// Per r9's proven lesson, the jobs a fixed bottom band would normally do — current state, what's
// actionable — are distributed inline instead: an always-visible top counter plus per-row state
// that's visible without any interaction. No fixed bottom band.
import { useState } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { INITIAL_SAVED_SEARCHES, frequencyLabel, type AlertFrequency, type SavedSearch } from "./data";
import { SavedSearchRow } from "./components";
import { tokens } from "../../../tokens";

function CounterBar({ searches }: { searches: SavedSearch[] }) {
  const active = searches.filter((s) => s.frequency !== "off").length;
  const paused = searches.length - active;
  const summary =
    searches.length === 0
      ? "No saved searches yet."
      : `${active} active alert${active === 1 ? "" : "s"} · ${paused} paused · ${searches.length} saved searches total`;
  return (
    <View style={styles.counterBar}>
      <Text style={styles.counterText}>{summary}</Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No saved searches left</Text>
      <Text style={styles.emptyBody}>
        Save a search from any results screen and it will show up here with its own alert settings.
      </Text>
    </View>
  );
}

export function SavedSearchAlertsScreen() {
  const [searches, setSearches] = useState<SavedSearch[]>(INITIAL_SAVED_SEARCHES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string>("");

  const setFrequency = (id: string, next: AlertFrequency) => {
    setSearches((prev) => prev.map((s) => (s.id === id ? { ...s, frequency: next } : s)));
    const query = searches.find((s) => s.id === id)?.query ?? "Saved search";
    setAnnouncement(`${query}: alerts set to ${frequencyLabel(next)}.`);
  };

  const changePrice = (id: string, next: number) => {
    setSearches((prev) => prev.map((s) => (s.id === id ? { ...s, priceCeiling: next } : s)));
  };

  const removeFilter = (id: string, index: number) => {
    setSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, filters: s.filters.filter((_, i) => i !== index) } : s)),
    );
  };

  const confirmDelete = (id: string) => {
    const query = searches.find((s) => s.id === id)?.query ?? "Saved search";
    setSearches((prev) => prev.filter((s) => s.id !== id));
    setConfirmDeleteId(null);
    if (editingId === id) setEditingId(null);
    setAnnouncement(`Deleted “${query}”. You will no longer get alerts for it.`);
  };

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={searches}
        keyExtractor={(s) => s.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.h1} accessibilityRole="header">
              Saved Search Alerts
            </Text>
            <Text style={styles.sub}>
              Every change below applies right away — there is nothing to save separately.
            </Text>
            <CounterBar searches={searches} />
            <View accessibilityLiveRegion="polite">
              {announcement.length > 0 && (
                <Text style={styles.announcement} accessibilityRole="alert">
                  {announcement}
                </Text>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <SavedSearchRow
            item={item}
            isEditing={editingId === item.id}
            isConfirmingDelete={confirmDeleteId === item.id}
            onSetFrequency={(next) => setFrequency(item.id, next)}
            onToggleEdit={() => setEditingId((cur) => (cur === item.id ? null : item.id))}
            onRemoveFilter={(index) => removeFilter(item.id, index)}
            onChangePrice={(next) => changePrice(item.id, next)}
            onRequestDelete={() => setConfirmDeleteId(item.id)}
            onCancelDelete={() => setConfirmDeleteId(null)}
            onConfirmDelete={() => confirmDelete(item.id)}
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
  list: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(10), gap: tokens.space(3) },

  header: { paddingTop: tokens.space(10), paddingBottom: tokens.space(4) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint, lineHeight: 18 },

  counterBar: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  counterText: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },

  announcement: { marginTop: tokens.space(3), fontSize: 12, fontWeight: "700", color: tokens.color.accent },

  empty: { paddingTop: tokens.space(10), alignItems: "center", gap: tokens.space(2) },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.ink2 },
  emptyBody: {
    fontSize: 13,
    color: tokens.color.faint,
    lineHeight: 18,
    textAlign: "center",
    maxWidth: 280,
  },
});
