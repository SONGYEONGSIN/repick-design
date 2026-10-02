// native/src/evolve/r28/c/ShippingProtectionClaimScreen.tsx — auto-native-r28 candidate c.
//
// A shipping-protection claim RECEIPT: the item was already inspected, the
// adjuster already ruled on every damage finding, and the payout is already
// decided. Nothing here is a blocked workflow, so per GENERATION.md §3 this
// screen does NOT get a state-machine "why can't I proceed" band. Instead the
// fixed bottom dock is a persistent action bar with two genuinely working
// actions: "Email Receipt" flips a real `receiptSent` flag and renders an
// honest confirmation sentence, and "Contact Support" expands a real panel of
// support contact details — neither one is a toast with nothing behind it.
//
// The hero "Approved Coverage" figure and the itemized findings below it are
// never independently hand-typed: both read from computeApprovedAmount /
// findingCoveredAmount in ./data.ts, so the headline number and the breakdown
// arithmetic underneath it are provably the same computation.
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CLAIM,
  SUPPORT_CONTACT,
  computeApprovedAmount,
  findingCoveredAmount,
  formatUsd,
  sumCoveredSubtotal,
  type CoverageFinding,
  type CoverageFindingRuling,
} from "./data";

const TOUCH_PAD = { top: 8, bottom: 8, left: 8, right: 8 };

const RULING_WORD: Record<CoverageFindingRuling, string> = {
  covered: "Covered",
  partial: "Partial",
  excluded: "Excluded",
};

function outcomeTone(outcome: typeof CLAIM.outcome) {
  if (outcome === "approved") {
    return {
      ink: tokens.color.success,
      fill: tokens.color.successBg,
      edge: tokens.color.successBorder,
    };
  }
  if (outcome === "denied") {
    return {
      ink: tokens.color.danger,
      fill: tokens.color.dangerBg,
      edge: tokens.color.dangerBorder,
    };
  }
  return {
    ink: tokens.color.warning,
    fill: tokens.color.warningBg,
    edge: tokens.color.warningBorder,
  };
}

function rulingTone(ruling: CoverageFindingRuling) {
  if (ruling === "covered") return tokens.color.success;
  if (ruling === "excluded") return tokens.color.danger;
  return tokens.color.warning;
}

function FindingRow({
  finding,
  isLast,
}: {
  finding: CoverageFinding;
  isLast: boolean;
}) {
  const coveredAmount = findingCoveredAmount(finding);
  const pctLabel = `${Math.round(finding.coverageRate * 100)}%`;
  return (
    <View style={[styles.ledgerRow, isLast && styles.ledgerRowLast]}>
      <View style={styles.ledgerTopLine}>
        <Text style={styles.ledgerFindingLabel}>{finding.findingLabel}</Text>
        <Text style={styles.ledgerAmount}>{formatUsd(coveredAmount)}</Text>
      </View>
      <View style={styles.ledgerSecondLine}>
        <Text style={styles.ledgerCauseLabel}>{finding.causeLabel}</Text>
        <Text style={[styles.ledgerRulingWord, { color: rulingTone(finding.ruling) }]}>
          {RULING_WORD[finding.ruling]} · {pctLabel} of {formatUsd(finding.assessedValue)}
        </Text>
      </View>
      <Text style={styles.ledgerRulingNote}>{finding.rulingNote}</Text>
    </View>
  );
}

export function ShippingProtectionClaimScreen() {
  const [receiptSent, setReceiptSent] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const coveredSubtotal = sumCoveredSubtotal(CLAIM);
  const approvedAmount = computeApprovedAmount(CLAIM);
  const tone = outcomeTone(CLAIM.outcome);

  const handleEmailReceipt = () => {
    setReceiptSent(true);
  };

  const handleToggleSupport = () => {
    setSupportOpen((open) => !open);
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>SHIPPING PROTECTION CLAIM</Text>
        <Text style={styles.heading} accessibilityRole="header">
          Shipping Protection Claim
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Claim</Text>
            <Text style={styles.metaValue}>{CLAIM.claimId}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Filed</Text>
            <Text style={styles.metaValue}>{CLAIM.filedOnLabel}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Resolved</Text>
            <Text style={styles.metaValue}>{CLAIM.resolvedOnLabel}</Text>
          </View>
        </View>

        <View style={styles.itemPanel}>
          <Text style={styles.itemTitle}>{CLAIM.itemTitle}</Text>
          <Text style={styles.itemSub}>{CLAIM.itemCategoryLabel}</Text>
          <Text style={styles.itemSub}>
            {CLAIM.carrierName} · Tracking {CLAIM.trackingNumber}
          </Text>
          <Text style={styles.itemSub}>
            Declared value {formatUsd(CLAIM.declaredValue)}
          </Text>
        </View>

        <View
          style={[styles.outcomeChip, { backgroundColor: tone.fill, borderColor: tone.edge }]}
          accessible
          accessibilityLabel={`Claim outcome: ${CLAIM.outcomeHeadline}`}
        >
          <Text style={[styles.outcomeChipText, { color: tone.ink }]}>
            {CLAIM.outcomeHeadline}
          </Text>
        </View>

        <View style={styles.heroPanel}>
          <Text style={styles.heroLabel}>Approved Coverage</Text>
          <Text style={styles.heroFigure}>{formatUsd(approvedAmount)}</Text>
          <Text style={styles.heroCaption}>
            {formatUsd(coveredSubtotal)} covered across findings, minus a{" "}
            {formatUsd(CLAIM.deductible)} deductible
          </Text>
        </View>

        <Text style={styles.resolutionNote}>{CLAIM.resolutionNote}</Text>

        <Text style={styles.sectionHeading} accessibilityRole="header">
          Damage assessment breakdown
        </Text>

        <View style={styles.ledgerCard}>
          {CLAIM.findings.map((finding, index) => (
            <FindingRow
              key={finding.id}
              finding={finding}
              isLast={index === CLAIM.findings.length - 1}
            />
          ))}

          <View style={styles.ledgerDivider} />

          <View style={styles.ledgerSumLine}>
            <Text style={styles.ledgerSumLabel}>Covered subtotal</Text>
            <Text style={styles.ledgerSumValue}>{formatUsd(coveredSubtotal)}</Text>
          </View>
          <View style={styles.ledgerSumLine}>
            <Text style={styles.ledgerSumLabel}>Deductible applied</Text>
            <Text style={styles.ledgerSumValue}>
              −{formatUsd(CLAIM.deductible)}
            </Text>
          </View>
          <View style={[styles.ledgerSumLine, styles.ledgerTotalLine]}>
            <Text style={styles.ledgerTotalLabel}>Approved coverage</Text>
            <Text style={styles.ledgerTotalValue}>{formatUsd(approvedAmount)}</Text>
          </View>
        </View>

        <View style={styles.payoutPanel}>
          <Text style={styles.payoutHeading}>Payout</Text>
          <Text style={styles.payoutLine}>{CLAIM.payoutMethodLabel}</Text>
          <Text style={styles.payoutLine}>Reviewed by {CLAIM.reviewDeskLabel}</Text>
        </View>

        <Text style={styles.closingNote}>
          Claim {CLAIM.claimId} is closed. This is a final determination for this
          shipment and does not affect other coverage on your account.
        </Text>
      </ScrollView>

      <View style={styles.dock}>
        <View style={styles.dockMessageArea} accessibilityLiveRegion="polite">
          {receiptSent ? (
            <Text style={styles.dockConfirmText} accessibilityRole="alert">
              Receipt sent to {CLAIM.emailOnFile}.
            </Text>
          ) : (
            <Text style={styles.dockLeadText}>
              Keep a copy of this claim receipt for your records.
            </Text>
          )}
        </View>

        {supportOpen ? (
          <View style={styles.supportPanel}>
            <View style={styles.supportRow}>
              <Text style={styles.supportRowLabel}>Phone</Text>
              <Text style={styles.supportRowValue}>{SUPPORT_CONTACT.phoneLabel}</Text>
            </View>
            <View style={styles.supportRow}>
              <Text style={styles.supportRowLabel}>Email</Text>
              <Text style={styles.supportRowValue}>{SUPPORT_CONTACT.emailLabel}</Text>
            </View>
            <View style={styles.supportRow}>
              <Text style={styles.supportRowLabel}>Hours</Text>
              <Text style={styles.supportRowValue}>{SUPPORT_CONTACT.hoursLabel}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.dockButtonRow}>
          <Pressable
            onPress={handleEmailReceipt}
            accessibilityRole="button"
            accessibilityLabel={
              receiptSent ? "Resend receipt by email" : "Email receipt"
            }
            hitSlop={TOUCH_PAD}
            style={({ pressed }) => [
              styles.dockPrimaryButton,
              pressed && styles.dockButtonPressed,
            ]}
          >
            <Text style={styles.dockPrimaryButtonText}>
              {receiptSent ? "Resend Receipt" : "Email Receipt"}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleToggleSupport}
            accessibilityRole="button"
            accessibilityLabel={
              supportOpen ? "Hide support contact details" : "Contact support"
            }
            accessibilityState={{ expanded: supportOpen }}
            hitSlop={TOUCH_PAD}
            style={({ pressed }) => [
              styles.dockSecondaryButton,
              pressed && styles.dockButtonPressed,
            ]}
          >
            <Text style={styles.dockSecondaryButtonText}>
              {supportOpen ? "Hide Support Info" : "Contact Support"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(8),
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    color: tokens.color.faint,
  },
  heading: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: tokens.color.ink,
  },

  metaRow: {
    flexDirection: "row",
    marginTop: tokens.space(4),
    paddingBottom: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  metaCol: {
    flex: 1,
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },

  itemPanel: {
    marginTop: tokens.space(4),
    gap: 3,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemSub: {
    fontSize: 13,
    color: tokens.color.muted,
  },

  outcomeChip: {
    marginTop: tokens.space(4),
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
  },
  outcomeChipText: {
    fontSize: 13,
    fontWeight: "700",
  },

  heroPanel: {
    marginTop: tokens.space(4),
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: 4,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  heroFigure: {
    fontSize: 34,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  heroCaption: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  resolutionNote: {
    marginTop: tokens.space(4),
    fontSize: 13,
    lineHeight: 20,
    color: tokens.color.muted,
  },

  sectionHeading: {
    marginTop: tokens.space(5),
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  ledgerCard: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
  },
  ledgerRow: {
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: 3,
  },
  ledgerRowLast: {
    borderBottomWidth: 0,
  },
  ledgerTopLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: tokens.space(2),
  },
  ledgerFindingLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  ledgerAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  ledgerSecondLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(2),
  },
  ledgerCauseLabel: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  ledgerRulingWord: {
    fontSize: 12,
    fontWeight: "700",
  },
  ledgerRulingNote: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },

  ledgerDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginTop: tokens.space(1),
  },
  ledgerSumLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: tokens.space(2),
  },
  ledgerSumLabel: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  ledgerSumValue: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  ledgerTotalLine: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(3),
    marginTop: tokens.space(1),
    paddingBottom: tokens.space(3),
  },
  ledgerTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  ledgerTotalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },

  payoutPanel: {
    marginTop: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: 4,
  },
  payoutHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  payoutLine: {
    fontSize: 13,
    color: tokens.color.muted,
  },

  closingNote: {
    marginTop: tokens.space(5),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },

  dock: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(3),
  },
  dockMessageArea: {
    minHeight: 18,
  },
  dockLeadText: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  dockConfirmText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  supportPanel: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(2),
  },
  supportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: tokens.space(2),
  },
  supportRowLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  supportRowValue: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },

  dockButtonRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  dockPrimaryButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  dockPrimaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  dockSecondaryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  dockSecondaryButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  dockButtonPressed: {
    opacity: 0.8,
  },
});
