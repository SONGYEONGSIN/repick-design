// native/src/evolve/r36/c/ReturnInspectionDecisionScreen.tsx
//
// Seller-facing screen: a buyer's returned item has physically arrived back
// with the seller. The seller reviews the buyer's stated return reason, the
// item's originally listed condition, and the photos the buyer submitted,
// then makes one terminal call: Accept Return (refund issued) or Reject
// Return (dispute opened). Both outcomes are irreversible once confirmed, so
// both go through the same confirm-before-commit band transform — never a
// native Alert.
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { returnInspectionCase, type SubmittedPhoto } from "./data";

type DecisionPhase =
  | "choice"
  | "confirmAccept"
  | "confirmReject"
  | "resultAccepted"
  | "resultRejected";

const ANNOUNCEMENT_LIFETIME_MS = 4000;

function formatWon(amountWon: number): string {
  // "KRW" notation avoids the ₩ glyph crowding adjacent digits at body size.
  return `KRW ${amountWon.toLocaleString("en-US")}`;
}

function swatchColorFor(key: SubmittedPhoto["swatchKey"]): string {
  if (key === "swatch1") return tokens.color.swatch1;
  if (key === "swatch2") return tokens.color.swatch2;
  return tokens.color.swatch3;
}

export function ReturnInspectionDecisionScreen() {
  const data = returnInspectionCase;

  const [phase, setPhase] = useState<DecisionPhase>("choice");
  const [disputeNote, setDisputeNote] = useState("");
  const [noteMissing, setNoteMissing] = useState(false);
  const [bandAnnouncement, setBandAnnouncement] = useState("");
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

  function announceTransition(message: string) {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setBandAnnouncement(message);
    clearTimer.current = setTimeout(() => {
      setBandAnnouncement("");
    }, ANNOUNCEMENT_LIFETIME_MS);
  }

  function goChooseAccept() {
    setPhase("confirmAccept");
    announceTransition(
      "Accept Return selected. Review the refund amount, then confirm or cancel."
    );
  }

  function goChooseReject() {
    setNoteMissing(false);
    setPhase("confirmReject");
    announceTransition(
      "Reject Return selected. Enter a reason, then confirm or cancel."
    );
  }

  function goBackToChoice() {
    setPhase("choice");
    setDisputeNote("");
    setNoteMissing(false);
    announceTransition("Decision cancelled. Choose Accept Return or Reject Return.");
  }

  function commitAccept() {
    setPhase("resultAccepted");
    announceTransition(
      `Return accepted. A refund of ${formatWon(data.refundAmountWon)} has been issued to the buyer.`
    );
  }

  function commitReject() {
    if (disputeNote.trim().length === 0) {
      setNoteMissing(true);
      announceTransition("Add a reason for rejecting before confirming.");
      return;
    }
    setPhase("resultRejected");
    announceTransition("Return rejected. A dispute has been opened with your note.");
  }

  function onNoteChange(text: string) {
    setDisputeNote(text);
    if (noteMissing && text.trim().length > 0) setNoteMissing(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenRoot}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text accessibilityRole="header" style={styles.screenTitle}>
            Return Inspection
          </Text>
          <Text style={styles.orderMeta}>
            Order {data.orderCode} · {data.arrivedOnLabel}
          </Text>

          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>{data.itemTitle}</Text>
            <View style={styles.conditionRow}>
              <Text style={styles.conditionLabel}>Listed condition</Text>
              <Text style={styles.conditionValue}>{data.listedCondition}</Text>
            </View>
          </View>

          <View style={styles.reasonCard}>
            <Text accessibilityRole="header" style={styles.sectionHeading}>
              What the Buyer Said
            </Text>
            <View style={styles.reasonBadge}>
              <Text style={styles.reasonBadgeText}>{data.buyerStatedReason}</Text>
            </View>
            <Text style={styles.buyerNote}>{data.buyerNote}</Text>
          </View>

          <View style={styles.photoSection}>
            <Text accessibilityRole="header" style={styles.sectionHeading}>
              Buyer's Submitted Photos
            </Text>
            <FlatList
              data={data.photos}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photoStripContent}
              renderItem={({ item }) => (
                <View style={styles.photoCell}>
                  <View
                    style={[
                      styles.photoSwatch,
                      { backgroundColor: swatchColorFor(item.swatchKey) },
                    ]}
                    accessibilityRole="image"
                    accessibilityLabel={`Buyer photo: ${item.caption}`}
                  />
                  <Text style={styles.photoCaption}>{item.caption}</Text>
                </View>
              )}
            />
          </View>

          {/* Spacer so scroll content never hides behind the decision band */}
          <View style={styles.scrollEndSpacer} />
        </ScrollView>

        <View style={styles.decisionBand} accessibilityLiveRegion="polite">
          {bandAnnouncement.length > 0 ? (
            <Text accessibilityRole="alert" style={styles.bandAnnouncementText}>
              {bandAnnouncement}
            </Text>
          ) : null}

          {phase === "choice" ? (
            <View style={styles.bandChoiceRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.choiceButton,
                  styles.acceptChoiceButton,
                  pressed && styles.choiceButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Accept return"
                accessibilityHint="Shows a confirmation with the refund amount before anything is issued."
                onPress={goChooseAccept}
              >
                <Text style={styles.acceptChoiceButtonText}>Accept Return</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.choiceButton,
                  styles.rejectChoiceButton,
                  pressed && styles.choiceButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Reject return"
                accessibilityHint="Shows a confirmation that requires a reason before a dispute is opened."
                onPress={goChooseReject}
              >
                <Text style={styles.rejectChoiceButtonText}>Reject Return</Text>
              </Pressable>
            </View>
          ) : null}

          {phase === "confirmAccept" ? (
            <View style={styles.bandConfirmPanel}>
              <Text style={styles.bandConfirmCopy}>
                Confirm accepting this return. A refund of{" "}
                <Text style={styles.bandConfirmAmount}>
                  {formatWon(data.refundAmountWon)}
                </Text>{" "}
                will be issued to the buyer. This can't be undone.
              </Text>
              <View style={styles.bandActionRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryActionButton,
                    pressed && styles.choiceButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel accepting return"
                  onPress={goBackToChoice}
                >
                  <Text style={styles.secondaryActionButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryAcceptButton,
                    pressed && styles.choiceButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Confirm accept return"
                  accessibilityHint="Issues the refund to the buyer immediately."
                  onPress={commitAccept}
                >
                  <Text style={styles.primaryAcceptButtonText}>Confirm Refund</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {phase === "confirmReject" ? (
            <View style={styles.bandConfirmPanel}>
              <Text style={styles.bandConfirmCopy}>
                Rejecting reopens this order as a dispute instead of a refund.
              </Text>
              <Text style={styles.bandFieldLabel}>Reason for rejecting (required)</Text>
              <TextInput
                style={[
                  styles.bandFieldInput,
                  noteMissing && styles.bandFieldInputError,
                ]}
                value={disputeNote}
                onChangeText={onNoteChange}
                placeholder="e.g. Item matches the listing, no pilling found"
                placeholderTextColor={tokens.color.faint}
                multiline
                accessibilityLabel="Reason for rejecting this return"
                accessibilityHint="Required. Describe how the item differs from the buyer's stated return reason."
              />
              {noteMissing ? (
                <Text style={styles.bandFieldErrorText}>
                  Add a reason before confirming — this field is required.
                </Text>
              ) : null}
              <View style={styles.bandActionRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryActionButton,
                    pressed && styles.choiceButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel rejecting return"
                  onPress={goBackToChoice}
                >
                  <Text style={styles.secondaryActionButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryRejectButton,
                    pressed && styles.choiceButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Confirm reject return"
                  accessibilityHint="Opens a dispute using the reason entered above. This can't be undone."
                  onPress={commitReject}
                >
                  <Text style={styles.primaryRejectButtonText}>Confirm Rejection</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {phase === "resultAccepted" ? (
            <View style={styles.bandResultPanel}>
              <View style={styles.resultBadgeAccept}>
                <Text style={styles.resultBadgeAcceptText}>Return accepted</Text>
              </View>
              <Text style={styles.bandResultCopy}>
                Refund of {formatWon(data.refundAmountWon)} issued to the buyer. No
                further action is needed on this return.
              </Text>
            </View>
          ) : null}

          {phase === "resultRejected" ? (
            <View style={styles.bandResultPanel}>
              <View style={styles.resultBadgeReject}>
                <Text style={styles.resultBadgeRejectText}>Return rejected</Text>
              </View>
              <Text style={styles.bandResultCopy}>
                A dispute has been opened with your note: "{disputeNote.trim()}"
              </Text>
            </View>
          ) : null}
        </View>
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
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
  },
  screenTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  orderMeta: {
    marginTop: tokens.space(1),
    fontSize: 14,
    lineHeight: 22,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  itemCard: {
    marginTop: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  itemTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  conditionRow: {
    marginTop: tokens.space(3),
  },
  conditionLabel: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  conditionValue: {
    marginTop: tokens.space(1),
    fontSize: 16,
    lineHeight: 26,
    color: tokens.color.ink2,
  },
  reasonCard: {
    marginTop: tokens.space(5),
  },
  sectionHeading: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  reasonBadge: {
    marginTop: tokens.space(3),
    alignSelf: "flex-start",
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(3),
  },
  reasonBadgeText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600",
    color: tokens.color.warning,
  },
  buyerNote: {
    marginTop: tokens.space(3),
    fontSize: 16,
    lineHeight: 26,
    color: tokens.color.ink2,
  },
  photoSection: {
    marginTop: tokens.space(6),
  },
  photoStripContent: {
    marginTop: tokens.space(3),
    paddingBottom: tokens.space(1),
    gap: tokens.space(3),
  },
  photoCell: {
    width: 104,
  },
  photoSwatch: {
    width: 104,
    height: 104,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  photoCaption: {
    marginTop: tokens.space(2),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  scrollEndSpacer: {
    height: tokens.space(10),
  },
  decisionBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(5),
  },
  bandAnnouncementText: {
    fontSize: 14,
    lineHeight: 22,
    color: tokens.color.muted,
    marginBottom: tokens.space(2),
  },
  bandChoiceRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  choiceButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
  },
  choiceButtonPressed: {
    opacity: 0.85,
  },
  acceptChoiceButton: {
    backgroundColor: tokens.color.accent,
  },
  acceptChoiceButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  rejectChoiceButton: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
  },
  rejectChoiceButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.danger,
  },
  bandConfirmPanel: {
    gap: tokens.space(2),
  },
  bandConfirmCopy: {
    fontSize: 16,
    lineHeight: 26,
    color: tokens.color.ink2,
  },
  bandConfirmAmount: {
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  bandFieldLabel: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  bandFieldInput: {
    minHeight: 64,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    fontSize: 16,
    lineHeight: 24,
    color: tokens.color.ink,
    textAlignVertical: "top",
  },
  bandFieldInputError: {
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
  },
  bandFieldErrorText: {
    fontSize: 14,
    lineHeight: 22,
    color: tokens.color.danger,
  },
  bandActionRow: {
    marginTop: tokens.space(2),
    flexDirection: "row",
    gap: tokens.space(3),
  },
  secondaryActionButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  primaryAcceptButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryAcceptButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  primaryRejectButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryRejectButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  bandResultPanel: {
    gap: tokens.space(2),
  },
  resultBadgeAccept: {
    alignSelf: "flex-start",
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(3),
  },
  resultBadgeAcceptText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.success,
  },
  resultBadgeReject: {
    alignSelf: "flex-start",
    backgroundColor: tokens.color.dangerBg,
    borderColor: tokens.color.dangerBorder,
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(3),
  },
  resultBadgeRejectText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.danger,
  },
  bandResultCopy: {
    fontSize: 16,
    lineHeight: 26,
    color: tokens.color.ink2,
  },
});

export default ReturnInspectionDecisionScreen;
