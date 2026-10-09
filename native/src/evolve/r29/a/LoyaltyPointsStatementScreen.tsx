// native/src/evolve/r29/a/LoyaltyPointsStatementScreen.tsx — auto-native-r29 candidate a.
//
// A loyalty points STATEMENT: every row on it already happened — points were
// already earned, already redeemed, or already expired — and nothing here is
// waiting on a decision. Per the native design doctrine this is a read-only
// completed-record screen, so it gets a persistent bottom action bar instead
// of a blocked-workflow state band. Both bar actions do real work: "Share
// Statement" calls React Native's own `Share.share(...)`, and "View Rules"
// flips a real `useState` toggle that expands an inline panel of actual
// redemption-rule text further up the scroll content — it is not a dead end.
//
// The hero "Current Balance" figure is never a second hand-typed number: it
// comes from `computeCurrentBalance`, which under the hood reduces the exact
// same `STATEMENT_TRANSACTIONS` array through the exact same running-balance
// fold (`computeStatementLedger`) that produces the rows this screen renders
// below it. See ./data.ts for that fold.
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Share,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { tokens } from "../../../tokens";
import {
  STATEMENT_PERIOD,
  STATEMENT_TRANSACTIONS,
  REDEMPTION_RULES,
  computeStatementLedger,
  computeCurrentBalance,
  formatPoints,
  formatSignedPoints,
  formatWithCommas,
  pointsToKrw,
  type LoyaltyLedgerEntry,
  type LoyaltyTransactionType,
} from "./data";

const TAP_PAD = { top: 10, bottom: 10, left: 10, right: 10 };

const TYPE_LABEL: Record<LoyaltyTransactionType, string> = {
  "earned-from-sale": "Sale Payout",
  "redeemed-for-store-credit": "Store Credit Redemption",
  expired: "Points Expired",
  "referral-bonus": "Referral Bonus",
};

type ShareOutcome = "idle" | "shared" | "dismissed" | "unavailable";

function deltaTone(type: LoyaltyTransactionType, pointsDelta: number): string {
  // Expired points are a loss and get the danger tone regardless of sign.
  // A redemption is a deliberate, intentional spend — not a bad outcome —
  // so it reads as neutral ink rather than danger even though it is negative.
  if (type === "expired") return tokens.color.danger;
  if (pointsDelta > 0) return tokens.color.success;
  return tokens.color.ink2;
}

function DirectionGlyph({ pointsDelta, tone }: { pointsDelta: number; tone: string }) {
  const isGain = pointsDelta > 0;
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Circle cx={11} cy={11} r={9.25} stroke={tone} strokeWidth={1.5} fill="none" />
      <Path
        d={isGain ? "M11 15.5V6.5M7 10.5L11 6.5L15 10.5" : "M11 6.5V15.5M7 11.5L11 15.5L15 11.5"}
        stroke={tone}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function Chevron({ pointingUp, tone }: { pointingUp: boolean; tone: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Path
        d={pointingUp ? "M4.5 11L9 6.5L13.5 11" : "M4.5 7L9 11.5L13.5 7"}
        stroke={tone}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function EntryRow({ entry, isLast }: { entry: LoyaltyLedgerEntry; isLast: boolean }) {
  const { transaction, runningBalance } = entry;
  const tone = deltaTone(transaction.type, transaction.pointsDelta);
  const deltaLabel = formatSignedPoints(transaction.pointsDelta);
  const balanceLabel = formatPoints(runningBalance);
  const rowSummary = `${transaction.dateLabel}. ${TYPE_LABEL[transaction.type]}. ${transaction.description}. ${deltaLabel}. Balance after this entry: ${balanceLabel}.`;

  return (
    <View
      style={[styles.entryRow, isLast && styles.entryRowLast]}
      accessible
      accessibilityLabel={rowSummary}
    >
      <DirectionGlyph pointsDelta={transaction.pointsDelta} tone={tone} />
      <View style={styles.entryBody}>
        <View style={styles.entryHeadLine}>
          <Text style={styles.entryTypeLabel}>{TYPE_LABEL[transaction.type]}</Text>
          <Text style={[styles.entryDeltaText, { color: tone }]}>{deltaLabel}</Text>
        </View>
        <Text style={styles.entryDescriptionText}>{transaction.description}</Text>
        <View style={styles.entryFootLine}>
          <Text style={styles.entryDateText}>{transaction.dateLabel}</Text>
          <Text style={styles.entryBalanceText}>Balance {balanceLabel}</Text>
        </View>
      </View>
    </View>
  );
}

export function LoyaltyPointsStatementScreen() {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [shareOutcome, setShareOutcome] = useState<ShareOutcome>("idle");

  const ledger = computeStatementLedger(STATEMENT_TRANSACTIONS, STATEMENT_PERIOD.openingBalance);
  const currentBalance = computeCurrentBalance(STATEMENT_TRANSACTIONS, STATEMENT_PERIOD.openingBalance);
  const creditValueKrw = pointsToKrw(currentBalance, STATEMENT_PERIOD.krwPerPoint);

  const shareMessage =
    `My repick Loyalty Points Statement for ${STATEMENT_PERIOD.startLabel} - ${STATEMENT_PERIOD.endLabel}: ` +
    `current balance ${formatPoints(currentBalance)} (${STATEMENT_PERIOD.memberTierLabel} tier), ` +
    `worth about KRW ${formatWithCommas(creditValueKrw)} in store credit.`;

  const handleShare = () => {
    Share.share({
      title: "Loyalty Points Statement",
      message: shareMessage,
    })
      .then((result) => {
        if (result.action === Share.sharedAction) {
          setShareOutcome("shared");
        } else if (result.action === Share.dismissedAction) {
          setShareOutcome("dismissed");
        }
      })
      .catch(() => {
        setShareOutcome("unavailable");
      });
  };

  const handleToggleRules = () => {
    setRulesOpen((open) => !open);
  };

  return (
    <SafeAreaView style={styles.screenRoot}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kickerText}>LOYALTY POINTS</Text>
        <Text style={styles.titleText} accessibilityRole="header">
          Loyalty Points Statement
        </Text>

        <View style={styles.periodRow}>
          <View style={styles.periodBlock}>
            <Text style={styles.periodCaptionText}>Statement Period</Text>
            <Text style={styles.periodValueText}>
              {STATEMENT_PERIOD.startLabel} – {STATEMENT_PERIOD.endLabel}
            </Text>
          </View>
          <View style={styles.periodBlock}>
            <Text style={styles.periodCaptionText}>Generated</Text>
            <Text style={styles.periodValueText}>{STATEMENT_PERIOD.generatedLabel}</Text>
          </View>
        </View>

        <View style={styles.tierBadge}>
          <Text style={styles.tierBadgeText}>{STATEMENT_PERIOD.memberTierLabel} Tier</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceCaptionText}>Current Balance</Text>
          <Text style={styles.balanceFigureText}>{formatPoints(currentBalance)}</Text>
          <Text style={styles.balanceFootnoteText}>
            About KRW {formatWithCommas(creditValueKrw)} in store credit value
          </Text>
          <Text style={styles.balanceOpeningText}>
            Opened the period at {formatPoints(STATEMENT_PERIOD.openingBalance)}
          </Text>
        </View>

        <Text style={styles.sectionLabelText} accessibilityRole="header">
          Activity This Period
        </Text>

        <View style={styles.statementCard}>
          {ledger.map((entry, index) => (
            <EntryRow key={entry.transaction.id} entry={entry} isLast={index === ledger.length - 1} />
          ))}
        </View>

        <Text style={styles.sectionLabelText} accessibilityRole="header">
          Redemption Rules
        </Text>
        <Text style={styles.rulesHintText}>
          {rulesOpen
            ? "How points are earned, valued, and expire:"
            : 'Tap "View Rules" below to see how points are earned, valued, and expire.'}
        </Text>
        {rulesOpen ? (
          <View style={styles.rulesPanel}>
            {REDEMPTION_RULES.map((rule, index) => (
              <View key={`rule-${index}`} style={styles.ruleRow}>
                <Text style={styles.ruleBulletText}>•</Text>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Text style={styles.closingNoteText}>
          This statement reflects settled activity only. Pending sales and pending redemptions
          post to your balance once they finalize and will appear on a future statement.
        </Text>
      </ScrollView>

      <View style={styles.actionDock}>
        <View style={styles.dockStatusArea} accessibilityLiveRegion="polite">
          {shareOutcome === "idle" ? (
            <Text style={styles.dockIdleText}>This statement reflects settled points only.</Text>
          ) : (
            <Text style={styles.dockStatusText} accessibilityRole="alert">
              {shareOutcome === "shared" && "Statement shared."}
              {shareOutcome === "dismissed" && "Share sheet closed without sharing."}
              {shareOutcome === "unavailable" && "Sharing isn't available on this device."}
            </Text>
          )}
        </View>

        <View style={styles.actionRow}>
          <Pressable
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Share statement"
            hitSlop={TAP_PAD}
            style={({ pressed }) => [styles.primaryActionButton, pressed && styles.actionPressedDim]}
          >
            <Text style={styles.primaryActionText}>Share Statement</Text>
          </Pressable>
          <Pressable
            onPress={handleToggleRules}
            accessibilityRole="button"
            accessibilityState={{ expanded: rulesOpen }}
            accessibilityLabel={rulesOpen ? "Hide redemption rules" : "View redemption rules"}
            hitSlop={TAP_PAD}
            style={({ pressed }) => [styles.secondaryActionButton, pressed && styles.actionPressedDim]}
          >
            <Text style={styles.secondaryActionText}>{rulesOpen ? "Hide Rules" : "View Rules"}</Text>
            <Chevron pointingUp={rulesOpen} tone={tokens.color.ink2} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scrollArea: {
    flex: 1,
  },
  scrollBody: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(9),
  },

  kickerText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    color: tokens.color.faint,
  },
  titleText: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: tokens.color.ink,
  },

  periodRow: {
    flexDirection: "row",
    marginTop: tokens.space(4),
    paddingBottom: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  periodBlock: {
    flex: 1,
    gap: tokens.space(1),
  },
  periodCaptionText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  periodValueText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },

  tierBadge: {
    marginTop: tokens.space(4),
    alignSelf: "flex-start",
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(1),
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  balanceCard: {
    marginTop: tokens.space(4),
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(1),
  },
  balanceCaptionText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  balanceFigureText: {
    fontSize: 34,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  balanceFootnoteText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  balanceOpeningText: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.faint,
  },

  sectionLabelText: {
    marginTop: tokens.space(5),
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  statementCard: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  entryRowLast: {
    borderBottomWidth: 0,
  },
  entryBody: {
    flex: 1,
    gap: tokens.space(1),
  },
  entryHeadLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: tokens.space(2),
  },
  entryTypeLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  entryDeltaText: {
    fontSize: 14,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  entryDescriptionText: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  entryFootLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryDateText: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  entryBalanceText: {
    fontSize: 12,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },

  rulesHintText: {
    marginTop: tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  rulesPanel: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(3),
  },
  ruleRow: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  ruleBulletText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.accent,
  },
  ruleText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
  },

  closingNoteText: {
    marginTop: tokens.space(5),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },

  actionDock: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(3),
  },
  dockStatusArea: {
    minHeight: 20,
  },
  dockIdleText: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  dockStatusText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  actionRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  primaryActionButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  secondaryActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(1),
    minHeight: 48,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  actionPressedDim: {
    opacity: 0.8,
  },
});
