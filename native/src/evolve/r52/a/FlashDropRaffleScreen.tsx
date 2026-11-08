// native/src/evolve/r52/a/FlashDropRaffleScreen.tsx
//
// Flash Drop Raffle Entry — a time-boxed raffle/queue entry flow for a
// scarce limited-drop item. Before a fixed entry deadline, the user can tap
// to put their name in the drawing. At the deadline entry closes outright
// (no silent disable — the band explains why). After results are posted
// (a fixed, deterministic outcome — see RAFFLE_OUTCOME in data.ts) the band
// becomes a terminal state: a real working "claim" action on a win, or a
// no-op "browse similar" affordance on a loss.
//
// --- Precedent read, before writing this file ---------------------------
//
// AuctionScreen (native/src/auction/LiveAuctionScreen.tsx) is the nearest
// neighbor for countdown/time-bound mechanics: it derives a single boolean
// (`auctionClosed`) from a locally-ticked counter compared against a fixed
// close timestamp, and uses that boolean to gate one Pressable, with the
// destructive-confirmation band form for the actual "place bid" commitment
// (because a bid is binding money).
//
// ItemSwapProposalScreen (evolve/r51/a) is the nearest neighbor for an
// "externally-gated block": once a proposal is sent, the only external
// event that can move things forward is the counterpart accepting or
// declining — a single event the user cannot trigger — modeled as one
// hand-written phase string (`SwapPhase`), with a withdraw-confirmation
// sub-state the user themselves can still choose to enter.
//
// This screen's gate is a materially different animal from both:
//   - Like Auction, the first boundary (entry deadline) is a wall clock,
//     not a response — so it's legitimate to reuse Auction's tick-vs-fixed-
//     anchor *mechanism* (a locally incremented counter compared against
//     fixed ms constants, never Date.now()). That part of the "form" is
//     sanctioned reuse, per the brief, as long as naming/architecture is
//     original — see the rename table in the vault writeup.
//   - Unlike Auction, a clock boundary alone isn't the whole story: after
//     the clock closes entry, there is a SECOND, separately-timed external
//     event (results posting) that the user also cannot trigger. ItemSwap
//     only ever has one external unblock event, so one phase enum sufficed
//     there. Here, modeling it as one hand-rolled enum would conflate "the
//     clock closed" with "results are in," which are different facts from
//     different sources (a timer vs. a platform decision) and need to be
//     tested independently. So the clock portion is a *derived* phase
//     (`RafflePhase`, a pure function of elapsed ms — see getRafflePhase in
//     data.ts) exactly like Auction's derived boolean, while "did the user
//     enter" and "has the win been claimed" are separate, independently-
//     settable booleans/enums that a wall clock can never flip by itself.
//     Four small orthogonal pieces of state, not one phase string and not
//     one boolean — because the triggers themselves are orthogonal.
//   - Unlike ItemSwap's withdraw sub-state, there is no destructive action
//     anywhere in this flow (entering costs nothing and has no undo-worthy
//     weight; claiming a win is additive, not destructive), so the
//     Cancel/Confirm band form is deliberately not used here at all.
//
// All style keys, component names, and state field names below are
// originated fresh for this screen (see RaffleEntryBand.tsx's header for
// the explicit non-overlap note).

import { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import {
  DROP_FACTS,
  ITEM_NAME,
  ITEM_BRAND,
  ITEM_THUMBNAIL_INITIALS,
  RAFFLE_OUTCOME,
  describeRaffleBand,
  getRafflePhase,
  msUntilEntryDeadline,
  type ClaimPhase,
} from "./data";
import { DropFactRow } from "./DropFactRow";
import { RaffleEntryBand } from "./RaffleEntryBand";

export default function FlashDropRaffleScreen() {
  // The clock side of the gate: a locally-ticked counter compared against
  // fixed ms constants (never Date.now() / no-arg `new Date()`). The phase
  // itself is derived, not stored — same shape as Auction's `auctionClosed`,
  // renamed and generalized to three values instead of a boolean.
  const [elapsedTicks, setElapsedTicks] = useState(0);
  const elapsedMs = elapsedTicks * 1000;
  const clockPhase = getRafflePhase(elapsedMs);

  // The user-action side of the gate: neither of these can ever be flipped
  // by the clock, which is exactly why they're separate fields instead of
  // folded into one phase enum.
  const [hasEntered, setHasEntered] = useState(false);
  const [claimPhase, setClaimPhase] = useState<ClaimPhase>("unclaimed");

  useEffect(() => {
    if (clockPhase === "resultsPosted") return;
    const id = setInterval(() => setElapsedTicks((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [clockPhase]);

  const band = describeRaffleBand({
    phase: clockPhase,
    entered: hasEntered,
    outcome: RAFFLE_OUTCOME,
    claimPhase,
    remainingToDeadlineMs: msUntilEntryDeadline(elapsedMs),
  });

  function handleEnter() {
    if (clockPhase !== "open" || hasEntered) return;
    setHasEntered(true);
  }

  function handleClaim() {
    if (claimPhase !== "unclaimed") return;
    setClaimPhase("claimed");
  }

  function handleBrowseSimilar() {
    // Intentional no-op — see RaffleEntryBand.tsx. Nothing real exists to
    // navigate to yet, so this deliberately does nothing beyond the
    // Pressable's own press feedback.
  }

  const header = (
    <View>
      <Text accessibilityRole="header" style={styles.screenTitle}>
        Flash Drop Raffle
      </Text>
      <Text style={styles.screenSubtitle}>
        One scarce item, one short entry window. Everyone who enters before
        the deadline has an equal shot — no first-come, first-served rush.
      </Text>

      <View style={styles.dropCard}>
        <View style={styles.dropThumb}>
          <Text style={styles.dropThumbText}>{ITEM_THUMBNAIL_INITIALS}</Text>
        </View>
        <View style={styles.dropTextCol}>
          <Text style={styles.dropName} numberOfLines={2}>
            {ITEM_NAME}
          </Text>
          <Text style={styles.dropBrand}>{ITEM_BRAND}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Drop details</Text>
    </View>
  );

  const footer = (
    <Text style={styles.footerNote}>
      Winners are chosen at random from everyone entered before the
      deadline. Entering doesn't cost anything and doesn't guarantee a win.
    </Text>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={DROP_FACTS}
        keyExtractor={(fact) => fact.id}
        renderItem={({ item }) => <DropFactRow fact={item} />}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      <RaffleEntryBand
        message={band.message}
        action={band.action}
        entered={hasEntered}
        itemName={ITEM_NAME}
        onEnter={handleEnter}
        onClaim={handleClaim}
        onBrowseSimilar={handleBrowseSimilar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(3),
    marginBottom: tokens.space(1),
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
    marginBottom: tokens.space(4),
  },
  dropCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  dropThumb: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dropThumbText: {
    color: tokens.color.onInk,
    fontSize: 16,
    fontWeight: "700",
  },
  dropTextCol: {
    flex: 1,
  },
  dropName: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  dropBrand: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginTop: tokens.space(5),
    marginBottom: tokens.space(1),
  },
  footerNote: {
    fontSize: 12,
    color: tokens.color.faint,
    textAlign: "center",
    marginTop: tokens.space(4),
    paddingHorizontal: tokens.space(2),
    lineHeight: 17,
  },
});
