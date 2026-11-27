// native/src/evolve/r51/c/AuthenticatorReviewQueueScreen.tsx
//
// Authenticator Review Queue — a staff-facing screen for the authenticator
// role (not a buyer or seller): a queue of items sellers have submitted for
// authentication before a certificate can be issued.
//
// Core mechanic: a claim-based lock. Tapping "Start review" on an open case
// claims it for this authenticator — the lock is granted the moment they
// take ownership, not once they finish anything. A claimed case can be
// released back to the open queue. Exactly one case can be actively claimed
// at a time: trying to start a second one while one is already held is a
// deliberate, explained conflict (shown inline on the case you tried to
// start, never silent), and the authenticator chooses whether to keep their
// current claim or release it and switch.
//
// This is a fresh state shape built for ownership-claiming, not a
// completion-gated step flow — there is deliberately no "done" state here,
// no progress bar, and no borrowed control-flow from a blocked/ready/done
// screen elsewhere in the catalog.

import React, { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { AUTHENTICATOR_CASES, type AuthenticatorCase } from "./data";
import { ReviewCaseRow, type RowLockState } from "./ReviewCaseRow";

const INITIAL_STATUS_MESSAGE =
  "No case claimed yet. Tap Start review on an open case below to begin.";

function lockStateFor(
  item: AuthenticatorCase,
  claimedCaseId: string | null
): RowLockState {
  if (item.lockedByOtherName) return "held-elsewhere";
  if (claimedCaseId === item.id) return "held-by-me";
  return "open";
}

export function AuthenticatorReviewQueueScreen() {
  // The single claim-based lock this authenticator can hold. Exactly one
  // case id, or none — there is no set/array of held cases, which is what
  // makes "only one active claim" structural rather than a rule to remember
  // to enforce elsewhere.
  const [claimedCaseId, setClaimedCaseId] = useState<string | null>(null);
  // The case currently showing its Cancel / Confirm-release pair in place of
  // its usual Release button. At most one row is ever in this shape.
  const [confirmingReleaseId, setConfirmingReleaseId] = useState<
    string | null
  >(null);
  // The open case the authenticator just tried to start while already
  // holding a different one. Shows the inline "case in the way" choice on
  // that one row only.
  const [blockedCaseId, setBlockedCaseId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    INITIAL_STATUS_MESSAGE
  );

  const handleStartReview = useCallback(
    (caseId: string) => {
      if (claimedCaseId === null) {
        setClaimedCaseId(caseId);
        setBlockedCaseId(null);
        setConfirmingReleaseId(null);
        setStatusMessage(
          `Case ${caseId} claimed. It's now locked to you — release it below when you're done.`
        );
        return;
      }
      if (claimedCaseId === caseId) {
        // Already held by this authenticator; Start review shouldn't even
        // be the visible control here, but guard it anyway.
        return;
      }
      setBlockedCaseId(caseId);
      setStatusMessage(
        `You already hold case ${claimedCaseId}. Release it before starting case ${caseId}.`
      );
    },
    [claimedCaseId]
  );

  const handleReleaseThenClaim = useCallback(
    (newCaseId: string) => {
      const previousCaseId = claimedCaseId;
      setClaimedCaseId(newCaseId);
      setBlockedCaseId(null);
      setConfirmingReleaseId(null);
      setStatusMessage(
        `Case ${previousCaseId} released. Case ${newCaseId} is now locked to you.`
      );
    },
    [claimedCaseId]
  );

  const handleDismissBlocked = useCallback(() => {
    setBlockedCaseId(null);
    setStatusMessage(
      claimedCaseId
        ? `Still reviewing case ${claimedCaseId}.`
        : INITIAL_STATUS_MESSAGE
    );
  }, [claimedCaseId]);

  const handleRequestRelease = useCallback((caseId: string) => {
    setConfirmingReleaseId(caseId);
  }, []);

  const handleCancelRelease = useCallback(() => {
    setConfirmingReleaseId(null);
  }, []);

  const handleConfirmRelease = useCallback((caseId: string) => {
    setClaimedCaseId(null);
    setConfirmingReleaseId(null);
    setBlockedCaseId(null);
    setStatusMessage(`Case ${caseId} released. It's back in the open queue.`);
  }, []);

  const { openCount, heldByMeCount, heldElsewhereCount } = useMemo(() => {
    let open = 0;
    let mine = 0;
    let elsewhere = 0;
    for (const item of AUTHENTICATOR_CASES) {
      const state = lockStateFor(item, claimedCaseId);
      if (state === "open") open += 1;
      else if (state === "held-by-me") mine += 1;
      else elsewhere += 1;
    }
    return { openCount: open, heldByMeCount: mine, heldElsewhereCount: elsewhere };
  }, [claimedCaseId]);

  const renderCaseRow = useCallback(
    ({ item }: { item: AuthenticatorCase }) => (
      <ReviewCaseRow
        item={item}
        lockState={lockStateFor(item, claimedCaseId)}
        isConfirmingRelease={confirmingReleaseId === item.id}
        isBlockedByOtherClaim={blockedCaseId === item.id}
        myActiveCaseId={claimedCaseId}
        onStartReview={handleStartReview}
        onRequestRelease={handleRequestRelease}
        onCancelRelease={handleCancelRelease}
        onConfirmRelease={handleConfirmRelease}
        onDismissBlocked={handleDismissBlocked}
        onReleaseThenClaim={handleReleaseThenClaim}
      />
    ),
    [
      claimedCaseId,
      confirmingReleaseId,
      blockedCaseId,
      handleStartReview,
      handleRequestRelease,
      handleCancelRelease,
      handleConfirmRelease,
      handleDismissBlocked,
      handleReleaseThenClaim,
    ]
  );

  const listHeader = (
    <View style={styles.headerBlock}>
      <Text style={styles.headerTitle} accessibilityRole="header">
        Authenticator Review Queue
      </Text>
      <Text style={styles.headerSubtitle}>
        Claim a case to begin verifying it before a certificate is issued.
        You can hold one active claim at a time.
      </Text>

      {/* The single live region for this screen. Every claim / release /
          conflict transition updates this one sentence; no other container
          on this screen is tagged as a live region, so only one is ever
          announcing at once. */}
      <View style={styles.statusStrip} accessibilityLiveRegion="polite">
        <Text style={styles.statusStripText} accessibilityRole="alert">
          {statusMessage}
        </Text>
      </View>

      <Text style={styles.summaryLine}>
        {openCount} open · {heldByMeCount} claimed by you ·{" "}
        {heldElsewhereCount} claimed by teammates
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screenRoot}>
      <FlatList
        data={AUTHENTICATOR_CASES}
        keyExtractor={(item) => item.id}
        renderItem={renderCaseRow}
        extraData={[claimedCaseId, confirmingReleaseId, blockedCaseId]}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  headerBlock: {
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(2),
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  statusStrip: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    marginBottom: tokens.space(2),
  },
  statusStripText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  summaryLine: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
    marginBottom: tokens.space(3),
  },
});

export default AuthenticatorReviewQueueScreen;
