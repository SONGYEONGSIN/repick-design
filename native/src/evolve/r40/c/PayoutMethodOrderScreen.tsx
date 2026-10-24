// native/src/evolve/r40/c/PayoutMethodOrderScreen.tsx
//
// Seller-side "Payout Method Order" screen. A compact settings-style list
// of the seller's linked payout methods in their current working priority
// order, with explicit Move Up / Move Down controls per row (no drag
// gesture). The bottom band is a dirty-state band: it mounts the instant
// the working order's id sequence differs from the last-saved snapshot,
// and unmounts again the instant they match — band presence is a derived
// boolean recomputed from that comparison every render, never a separate
// hand-set flag.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { persistedDisbursementSequence, profileForMethodId } from "./data";
import { PayoutMethodRow } from "./PayoutMethodRow";

const ANNOUNCEMENT_AUTOCLEAR_MS = 4000;

// Structural, by-id-sequence comparison — the thing the whole band
// mechanic hinges on. Deliberately not named anything generic like
// isDirty/hasChanges; this is specifically a sequence comparison.
function sequencesHoldSameOrder(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function withAdjacentPairSwapped(
  sequence: string[],
  indexA: number,
  indexB: number
): string[] {
  const next = sequence.slice();
  const holder = next[indexA];
  next[indexA] = next[indexB];
  next[indexB] = holder;
  return next;
}

export function PayoutMethodOrderScreen() {
  const [workingSequence, setWorkingSequence] = useState<string[]>(
    persistedDisbursementSequence
  );
  const [confirmedSequence, setConfirmedSequence] = useState<string[]>(
    persistedDisbursementSequence
  );
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const announcementClearHandle = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (announcementClearHandle.current) {
        clearTimeout(announcementClearHandle.current);
      }
    };
  }, []);

  // The single source of truth for whether the bottom band should be
  // mounted at all — recomputed from the two arrays every render, so it
  // can never drift out of sync with the actual order comparison.
  const workingSequenceDivergesFromSaved = useMemo(
    () => !sequencesHoldSameOrder(workingSequence, confirmedSequence),
    [workingSequence, confirmedSequence]
  );

  const totalMethodCount = workingSequence.length;

  const announce = useCallback((message: string) => {
    if (announcementClearHandle.current) {
      clearTimeout(announcementClearHandle.current);
    }
    setAnnouncementMessage(message);
    announcementClearHandle.current = setTimeout(() => {
      setAnnouncementMessage("");
      announcementClearHandle.current = null;
    }, ANNOUNCEMENT_AUTOCLEAR_MS);
  }, []);

  const handleRequestMoveUp = useCallback(
    (index: number) => {
      if (index <= 0) return;
      const movedProfile = profileForMethodId(workingSequence[index]);
      const newPositionOneBased = index;
      setWorkingSequence((prev) =>
        withAdjacentPairSwapped(prev, index, index - 1)
      );
      announce(
        `${movedProfile.displayName} moved to position ${newPositionOneBased} of ${totalMethodCount}`
      );
    },
    [workingSequence, totalMethodCount, announce]
  );

  const handleRequestMoveDown = useCallback(
    (index: number) => {
      if (index >= totalMethodCount - 1) return;
      const movedProfile = profileForMethodId(workingSequence[index]);
      const newPositionOneBased = index + 2;
      setWorkingSequence((prev) =>
        withAdjacentPairSwapped(prev, index, index + 1)
      );
      announce(
        `${movedProfile.displayName} moved to position ${newPositionOneBased} of ${totalMethodCount}`
      );
    },
    [workingSequence, totalMethodCount, announce]
  );

  const handleSaveOrder = useCallback(() => {
    setConfirmedSequence(workingSequence);
    announce("Payout order saved");
  }, [workingSequence, announce]);

  const handleResetToSaved = useCallback(() => {
    setWorkingSequence(confirmedSequence);
    announce("Reverted to last saved order");
  }, [confirmedSequence, announce]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenRoot}>
        <Text accessibilityRole="header" style={styles.screenHeading}>
          Payout Method Order
        </Text>

        <View
          accessibilityLiveRegion="polite"
          style={styles.liveAnnouncementRegion}
        >
          <Text
            accessibilityRole={announcementMessage ? "alert" : undefined}
            style={styles.liveAnnouncementText}
          >
            {announcementMessage}
          </Text>
        </View>

        <FlatList
          data={workingSequence}
          keyExtractor={(methodId) => methodId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <PayoutMethodRow
              profile={profileForMethodId(item)}
              positionIndex={index}
              totalMethodCount={totalMethodCount}
              onRequestMoveUp={() => handleRequestMoveUp(index)}
              onRequestMoveDown={() => handleRequestMoveDown(index)}
              moveUpIsDisabled={index === 0}
              moveDownIsDisabled={index === totalMethodCount - 1}
            />
          )}
          ListFooterComponent={
            <View style={styles.explainerBlock}>
              <Text style={styles.explainerText}>
                Payouts are attempted in this order. If the primary method
                fails, we try the next.
              </Text>
            </View>
          }
        />

        {workingSequenceDivergesFromSaved ? (
          <View style={styles.unsavedOrderBand}>
            <Text style={styles.unsavedOrderBandText}>
              You have unsaved changes to your payout order.
            </Text>
            <View style={styles.unsavedOrderBandButtonRow}>
              <Pressable
                onPress={handleResetToSaved}
                accessibilityRole="button"
                accessibilityLabel="Reset"
                accessibilityHint="Reverts your payout order back to the last saved order."
                style={({ pressed }) => [
                  styles.resetOrderButton,
                  pressed && styles.resetOrderButtonPressed,
                ]}
              >
                <Text style={styles.resetOrderButtonText}>Reset</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveOrder}
                accessibilityRole="button"
                accessibilityLabel="Save Order"
                accessibilityHint="Saves this order as your payout priority."
                style={({ pressed }) => [
                  styles.saveOrderButton,
                  pressed && styles.saveOrderButtonPressed,
                ]}
              >
                <Text style={styles.saveOrderButtonText}>Save Order</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  screenHeading: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: tokens.color.ink,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  liveAnnouncementRegion: {
    paddingHorizontal: tokens.space(4),
    minHeight: tokens.space(5),
  },
  liveAnnouncementText: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.accent,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(6),
  },
  explainerBlock: {
    marginTop: tokens.space(1),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  explainerText: {
    fontSize: 13,
    lineHeight: 20,
    color: tokens.color.faint,
  },
  unsavedOrderBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(5),
  },
  unsavedOrderBandText: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
  },
  unsavedOrderBandButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: tokens.space(3),
  },
  resetOrderButton: {
    minHeight: 48,
    minWidth: 96,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  resetOrderButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  resetOrderButtonText: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  saveOrderButton: {
    minHeight: 48,
    minWidth: 128,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  saveOrderButtonPressed: {
    opacity: 0.85,
  },
  saveOrderButtonText: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});

export default PayoutMethodOrderScreen;
