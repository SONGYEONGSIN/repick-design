// native/src/evolve/r45/c/NegotiationHistoryScreen.tsx
//
// Negotiation History — a read-only, chronological ledger of every past
// price offer/counteroffer the current user has sent as a buyer, across
// different items. Each row shows the item, the user's offer, the
// seller's counter (if any), and a final status. This is distinct from
// `offer-thread` (a single still-live back-and-forth on one item) and
// from `offer-status` (the current status of one offer): this screen is
// the aggregate record across many already-resolved negotiations, not a
// live workspace for any one of them.
//
// Band-form note (GENERATION.md §3): nothing on this screen is a blocked
// workflow waiting on the user — every row already carries a final
// status — so this does NOT use the statusFor()/jumpTo() blocked-band
// state machine. Instead there is a single always-mounted bottom
// `ActionBar` with one genuinely working action: toggling the ledger's
// sort order between "most recent first" (the default) and "highest
// offer first". This is a real, visible re-sort of the on-screen list,
// not a decorative label or no-op — see the brief-gaps note in
// vault/.../candidates/c.md for why this action (rather than a
// cross-screen "jump to my live negotiation" jump) was chosen.
//
// Macro layout: a flat chronological FlatList, one row per negotiation,
// most recent first — no grouping, no filter UI, since this is a record
// screen rather than a management tool.
import React, { useMemo, useState } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { NEGOTIATIONS, type NegotiationRecord } from "./data";
import { ActionBar, NegotiationRow, type SortMode } from "./components";

export default function NegotiationHistoryScreen() {
  const [sortMode, setSortMode] = useState<SortMode>("recent");

  // NEGOTIATIONS is already stored most-recent-first; "highest offer"
  // sorts a copy by yourOffer descending, with a stable tie-break on the
  // original (recency) order so the re-sort is deterministic.
  const sortedNegotiations = useMemo<NegotiationRecord[]>(() => {
    if (sortMode === "recent") return NEGOTIATIONS;
    return [...NEGOTIATIONS].sort((a, b) => b.yourOffer - a.yourOffer);
  }, [sortMode]);

  const handleToggleSort = () => {
    setSortMode((prev) => (prev === "recent" ? "highestOffer" : "recent"));
  };

  const header = (
    <View style={styles.header}>
      <Text accessibilityRole="header" style={styles.heading}>
        Negotiation History
      </Text>
      <Text style={styles.subheading}>
        {`A record of your past price offers across ${NEGOTIATIONS.length} negotiations.`}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={sortedNegotiations}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <NegotiationRow item={item} />}
      />
      <ActionBar sortMode={sortMode} onToggleSort={handleToggleSort} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  header: {
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  subheading: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
});
