// native/src/evolve/r16/c/ReportListingScreen.tsx
// Report Listing — pre-purchase buyer trust & safety report.
// Deliberately the lightest form in this round: one reason to pick, one
// optional detail field, one submit action. No blocked-workflow band.

import { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from "react-native";
import { tokens } from "../../../tokens";
import { REPORT_REASONS, REPORTED_LISTING, type ReasonId } from "./data";

const MAX_DETAIL_LENGTH = 300;

function formatKrw(amount: number): string {
  // Small space between the Won sign and the digits so the glyph's stroke
  // doesn't visually run into the leading digit at body size.
  return `₩ ${amount.toLocaleString("en-US")}`;
}

export default function ReportListingScreen() {
  const [selectedReason, setSelectedReason] = useState<ReasonId | null>(null);
  const [detail, setDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submittedReasonRef = useRef<ReasonId | null>(null);
  const submittedDetailRef = useRef("");

  const canSubmit = selectedReason !== null;

  const handleSelectReason = useCallback((id: ReasonId) => {
    setSelectedReason((current) => (current === id ? current : id));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedReason) return;
    submittedReasonRef.current = selectedReason;
    submittedDetailRef.current = detail.trim();
    setSubmitted(true);
  }, [selectedReason, detail]);

  const submittedReason = submittedReasonRef.current
    ? REPORT_REASONS.find((r) => r.id === submittedReasonRef.current) ?? null
    : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Text accessibilityRole="header" style={styles.title}>
          Report Listing
        </Text>
        <Text style={styles.subtitle}>
          Tell us what's wrong with this listing. Our team reviews every
          report.
        </Text>

        {/* Non-interactive listing summary */}
        <View
          style={styles.listingCard}
          accessible
          accessibilityLabel={`Listing being reported: ${REPORTED_LISTING.title}, priced at ${formatKrw(REPORTED_LISTING.priceKrw)}`}
        >
          <View style={styles.photoPlaceholder}>
            <View style={styles.photoIconFrame} />
            <View style={styles.photoIconMountain} />
          </View>
          <View style={styles.listingText}>
            <Text style={styles.listingTitle} numberOfLines={2}>
              {REPORTED_LISTING.title}
            </Text>
            <Text style={styles.listingSeller}>
              Sold by {REPORTED_LISTING.seller}
            </Text>
            <Text style={[styles.listingPrice, styles.tabularNums]}>
              {formatKrw(REPORTED_LISTING.priceKrw)}
            </Text>
          </View>
        </View>

        {submitted ? (
          <View
            style={styles.confirmationCard}
            accessibilityLiveRegion="polite"
          >
            <View style={styles.confirmBadge}>
              <View style={styles.confirmCheckStemLong} />
              <View style={styles.confirmCheckStemShort} />
            </View>
            <Text accessibilityRole="alert" style={styles.confirmTitle}>
              Report submitted
            </Text>
            <Text style={styles.confirmBody}>
              Thanks — we've received your report for{" "}
              <Text style={styles.confirmEmphasis}>
                {REPORTED_LISTING.title}
              </Text>
              .
            </Text>
            <View style={styles.confirmSummaryRow}>
              <Text style={styles.confirmSummaryLabel}>Reason</Text>
              <Text style={styles.confirmSummaryValue}>
                {submittedReason?.label ?? "—"}
              </Text>
            </View>
            <View style={styles.confirmSummaryRow}>
              <Text style={styles.confirmSummaryLabel}>Detail</Text>
              <Text style={styles.confirmSummaryValue}>
                {submittedDetailRef.current.length > 0
                  ? submittedDetailRef.current
                  : "No additional details provided"}
              </Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Reason for reporting</Text>
            <View
              accessibilityRole="radiogroup"
              accessibilityLabel="Reason for reporting"
              style={styles.reasonList}
            >
              {REPORT_REASONS.map((reason) => {
                const checked = selectedReason === reason.id;
                return (
                  <Pressable
                    key={reason.id}
                    onPress={() => handleSelectReason(reason.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked }}
                    accessibilityLabel={reason.label}
                    accessibilityHint={reason.description}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    style={({ pressed }) => [
                      styles.reasonRow,
                      checked && styles.reasonRowSelected,
                      pressed && styles.reasonRowPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        checked && styles.radioOuterSelected,
                      ]}
                    >
                      {checked ? <View style={styles.radioInner} /> : null}
                    </View>
                    <View style={styles.reasonTextGroup}>
                      <Text
                        style={[
                          styles.reasonLabel,
                          checked && styles.reasonLabelSelected,
                        ]}
                      >
                        {reason.label}
                      </Text>
                      <Text style={styles.reasonDescription}>
                        {reason.description}
                      </Text>
                    </View>
                    {checked ? (
                      <View style={styles.checkBadge}>
                        <View style={styles.checkStemLong} />
                        <View style={styles.checkStemShort} />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>
              Additional detail{" "}
              <Text style={styles.sectionLabelOptional}>(optional)</Text>
            </Text>
            <TextInput
              style={styles.detailInput}
              placeholder="Add anything that helps us understand the issue"
              placeholderTextColor={tokens.color.faint}
              value={detail}
              onChangeText={setDetail}
              multiline
              numberOfLines={4}
              maxLength={MAX_DETAIL_LENGTH}
              accessibilityLabel="Additional detail, optional"
              accessibilityHint="Describe the issue in your own words"
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {detail.length}/{MAX_DETAIL_LENGTH}
            </Text>

            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              accessibilityRole="button"
              accessibilityLabel="Submit report"
              accessibilityState={{ disabled: !canSubmit }}
              accessibilityHint={
                canSubmit ? "Submits this report for review" : undefined
              }
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              style={({ pressed }) => [
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
                canSubmit && pressed && styles.submitButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  !canSubmit && styles.submitButtonTextDisabled,
                ]}
              >
                {canSubmit ? "Submit report" : "Select a reason to continue"}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  screen: {
    flex: 1,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(1),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },

  // Listing summary card
  listingCard: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    padding: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
  },
  photoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  photoIconFrame: {
    width: 26,
    height: 20,
    borderWidth: 2,
    borderColor: tokens.color.faint,
    borderRadius: 3,
  },
  photoIconMountain: {
    position: "absolute",
    bottom: 14,
    left: 16,
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: tokens.color.faint,
    transform: [{ rotate: "45deg" }],
  },
  listingText: {
    flex: 1,
    marginLeft: tokens.space(3),
    justifyContent: "center",
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  listingSeller: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.faint,
  },
  listingPrice: {
    marginTop: tokens.space(1),
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
  },

  // Section labels
  sectionLabel: {
    marginTop: tokens.space(6),
    marginBottom: tokens.space(2),
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  sectionLabelOptional: {
    fontSize: 13,
    fontWeight: "400",
    color: tokens.color.faint,
    textTransform: "none",
    letterSpacing: 0,
  },

  // Reason radio list
  reasonList: {
    gap: tokens.space(2),
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    padding: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
  },
  reasonRowSelected: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
    backgroundColor: "#f5f4ff",
    padding: tokens.space(3) - 1,
  },
  reasonRowPressed: {
    backgroundColor: "#f4f4f5",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: tokens.color.faint,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: tokens.color.accent,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.color.accent,
  },
  reasonTextGroup: {
    flex: 1,
    marginLeft: tokens.space(3),
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  reasonLabelSelected: {
    color: tokens.color.accent,
  },
  reasonDescription: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: tokens.color.faint,
  },
  checkBadge: {
    width: 18,
    height: 18,
    marginLeft: tokens.space(2),
  },
  checkStemLong: {
    position: "absolute",
    width: 2,
    height: 9,
    backgroundColor: tokens.color.accent,
    left: 10,
    top: 2,
    borderRadius: 1,
    transform: [{ rotate: "40deg" }],
  },
  checkStemShort: {
    position: "absolute",
    width: 2,
    height: 5,
    backgroundColor: tokens.color.accent,
    left: 4,
    top: 8,
    borderRadius: 1,
    transform: [{ rotate: "-40deg" }],
  },

  // Detail input
  detailInput: {
    minHeight: 88,
    padding: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    fontSize: 14,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  charCount: {
    marginTop: tokens.space(1),
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },

  // Submit button
  submitButton: {
    marginTop: tokens.space(6),
    marginBottom: tokens.space(6),
    minHeight: 48,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.accent,
  },
  submitButtonDisabled: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  submitButtonTextDisabled: {
    color: tokens.color.faint,
  },

  // Confirmation state
  confirmationCard: {
    marginTop: tokens.space(6),
    padding: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    alignItems: "flex-start",
  },
  confirmBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f4ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: tokens.space(3),
  },
  confirmCheckStemLong: {
    position: "absolute",
    width: 3,
    height: 16,
    backgroundColor: tokens.color.accent,
    left: 21,
    top: 10,
    borderRadius: 1.5,
    transform: [{ rotate: "40deg" }],
  },
  confirmCheckStemShort: {
    position: "absolute",
    width: 3,
    height: 9,
    backgroundColor: tokens.color.accent,
    left: 10,
    top: 18,
    borderRadius: 1.5,
    transform: [{ rotate: "-40deg" }],
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  confirmBody: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
  },
  confirmEmphasis: {
    fontWeight: "700",
    color: tokens.color.ink,
  },
  confirmSummaryRow: {
    flexDirection: "row",
    marginTop: tokens.space(4),
    width: "100%",
  },
  confirmSummaryLabel: {
    width: 64,
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
    textTransform: "uppercase",
  },
  confirmSummaryValue: {
    flex: 1,
    fontSize: 13,
    color: tokens.color.ink2,
  },
});
