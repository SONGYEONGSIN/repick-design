// native/src/evolve/r52/a/RaffleEntryBand.tsx
//
// The bottom-pinned band for Flash Drop Raffle Entry.
//
// Band-form reasoning (read AuctionScreen + ItemSwapProposalScreen first —
// see the header comment in FlashDropRaffleScreen.tsx for the full writeup):
// this is neither the destructive-confirmation form (Auction's bid bar —
// nothing here is a binding commitment that needs a Cancel/Confirm flip; a
// raffle entry costs nothing and simply "placing" your name has no undo-
// worthy weight) nor the single manual phase-enum the swap screen uses
// (that gate has exactly one external unblock event — the counterpart's
// reply — so a hand-written phase string was the right fit there). Here
// there are TWO distinct external unblock events a clock boundary (entries
// close) and a results post, neither of which the user can trigger or
// cancel. So this band's content is a pure function of (derived clock
// phase) × (whether the user acted) × (externally-posted outcome), not a
// single state field — see describeRaffleBand in data.ts. Every key below
// is its own name; none of it reuses bidBar*/bandButton*/auction* naming
// from the two neighbor files.
//
// Live region: exactly one — this whole band is wrapped in a single
// accessibilityLiveRegion="polite" container, and the one sentence that
// actually changes across every phase/outcome transition carries
// accessibilityRole="alert". No second live region exists anywhere on this
// screen, so none can ever be active at the same time as this one.

import { Text, Pressable, View, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import type { BandAction } from "./data";

export function RaffleEntryBand({
  message,
  action,
  entered,
  itemName,
  onEnter,
  onClaim,
  onBrowseSimilar,
}: {
  message: string;
  action: BandAction;
  entered: boolean;
  itemName: string;
  onEnter: () => void;
  onClaim: () => void;
  onBrowseSimilar: () => void;
}) {
  return (
    <View style={styles.shell} accessibilityLiveRegion="polite">
      <Text accessibilityRole="alert" style={styles.statusLine}>
        {message}
      </Text>

      {action.kind === "enter" ? (
        <Pressable
          onPress={onEnter}
          accessibilityRole="button"
          accessibilityLabel={`Enter raffle for ${itemName}`}
          accessibilityHint="Places your name in the drawing for this drop"
          style={({ pressed }) => [styles.primaryCta, pressed && styles.pressedFeedback]}
        >
          <Text style={styles.primaryCtaText}>Enter Raffle</Text>
        </Pressable>
      ) : null}

      {action.kind === "claim" ? (
        <Pressable
          onPress={onClaim}
          accessibilityRole="button"
          accessibilityLabel={`Claim ${itemName}`}
          accessibilityHint="Reserves your item and starts checkout"
          style={({ pressed }) => [styles.primaryCta, pressed && styles.pressedFeedback]}
        >
          <Text style={styles.primaryCtaText}>Claim Your Item</Text>
        </Pressable>
      ) : null}

      {action.kind === "browseSimilar" ? (
        // Intentional no-op per brief: nothing real to navigate to yet, so
        // this Pressable gets NO accessibilityHint promising navigation —
        // just an accurate label. It still shows press feedback since
        // there's no hover to lean on.
        <Pressable
          onPress={onBrowseSimilar}
          accessibilityRole="button"
          accessibilityLabel="Browse similar items"
          style={({ pressed }) => [styles.ghostCta, pressed && styles.pressedFeedback]}
        >
          <Text style={styles.ghostCtaText}>Browse Similar Items</Text>
        </Pressable>
      ) : null}

      {action.kind === "none" && entered ? (
        <View style={styles.statusChip}>
          <Text style={styles.statusChipGlyph}>{"✓"}</Text>
          <Text style={styles.statusChipText}>Entered</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  statusLine: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
  },
  primaryCta: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3.5),
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryCtaText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  ghostCta: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3.5),
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  ghostCtaText: {
    color: tokens.color.ink,
    fontSize: 15,
    fontWeight: "600",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.space(1.5),
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    minHeight: 44,
  },
  statusChipGlyph: {
    color: tokens.color.success,
    fontSize: 15,
    fontWeight: "700",
  },
  statusChipText: {
    color: tokens.color.success,
    fontSize: 14,
    fontWeight: "700",
  },
  pressedFeedback: {
    opacity: 0.7,
  },
});
