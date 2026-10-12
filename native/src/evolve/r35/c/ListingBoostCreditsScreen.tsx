// native/src/evolve/r35/c/ListingBoostCreditsScreen.tsx
//
// Listing Boost Credits — a seller-facing, read-only ledger of every
// boost-credit earn/spend event. There is no blocked or pending state on
// this screen: it is a completed-history record, like a statement, so the
// macro interaction is a persistent, always-visible bottom action bar
// rather than a blocked-workflow state machine.
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Share,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  boostCreditLedgerNewestFirst,
  currentBoostBalance,
  totalEarned,
  totalSpent,
  formatCreditAmount,
  type BoostCreditLedgerRow,
} from "./data";

function LedgerRow({ row }: { row: BoostCreditLedgerRow }) {
  const isEarned = row.kind === "earned";
  const signPrefix = isEarned ? "+" : "−";
  const kindWord = isEarned ? "Earned" : "Spent";
  return (
    <View style={styles.row}>
      <View style={styles.rowTopLine}>
        <Text style={styles.rowKindTag}>{kindWord.toUpperCase()}</Text>
        <Text style={styles.rowDate}>{row.displayDate}</Text>
      </View>
      <Text style={styles.rowTitle}>{row.title}</Text>
      <Text style={styles.rowDetail}>{row.detail}</Text>
      <View style={styles.rowBottomLine}>
        <Text
          style={[
            styles.rowAmount,
            isEarned ? styles.rowAmountEarned : styles.rowAmountSpent,
          ]}
        >
          {signPrefix}
          {formatCreditAmount(row.amount)} credits
        </Text>
        <Text style={styles.rowBalance}>
          Balance: {formatCreditAmount(row.runningBalance)}
        </Text>
      </View>
    </View>
  );
}

function ExplainerPanel() {
  return (
    <View style={styles.explainerPanel}>
      <View style={styles.explainerLine}>
        <Text style={styles.explainerBullet}>{"•"}</Text>
        <Text style={styles.explainerText}>
          You earn credits automatically from weekly storefront activity,
          fast-shipping streaks, and review milestones.
        </Text>
      </View>
      <View style={styles.explainerLine}>
        <Text style={styles.explainerBullet}>{"•"}</Text>
        <Text style={styles.explainerText}>
          Spending credits boosts one listing higher in search results for a
          set number of days — the longer the boost, the more credits it
          costs.
        </Text>
      </View>
      <View style={styles.explainerLine}>
        <Text style={styles.explainerBullet}>{"•"}</Text>
        <Text style={styles.explainerText}>
          Credits never expire and have no cash value — this page is a
          running record, not a payout statement.
        </Text>
      </View>
    </View>
  );
}

export function ListingBoostCreditsScreen() {
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const toggleExplainer = useCallback(() => {
    setIsExplainerOpen((open) => !open);
  }, []);

  const shareMessage = useMemo(() => {
    return (
      `My repick boost balance: ${formatCreditAmount(currentBoostBalance)} credits.\n` +
      `Lifetime earned: ${formatCreditAmount(totalEarned)} · ` +
      `Lifetime spent: ${formatCreditAmount(totalSpent)}.`
    );
  }, []);

  const handleShare = useCallback(async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      await Share.share({
        message: shareMessage,
        title: "My Boost Credits Balance",
      });
    } finally {
      setIsSharing(false);
    }
  }, [isSharing, shareMessage]);

  const listHeader = useMemo(
    () => (
      <View style={styles.headerArea}>
        <Text accessibilityRole="header" style={styles.screenTitle}>
          Boost Credits
        </Text>
        <Text style={styles.screenSubtitle}>
          A full record of credits you have earned and spent boosting your
          listings.
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Current balance</Text>
          <Text style={styles.heroValue}>
            {formatCreditAmount(currentBoostBalance)}
          </Text>
          <Text style={styles.heroUnit}>credits available</Text>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>
                +{formatCreditAmount(totalEarned)}
              </Text>
              <Text style={styles.heroStatLabel}>Lifetime earned</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>
                {"−"}
                {formatCreditAmount(totalSpent)}
              </Text>
              <Text style={styles.heroStatLabel}>Lifetime spent</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={toggleExplainer}
          accessibilityRole="button"
          accessibilityState={{ expanded: isExplainerOpen }}
          style={({ pressed }) => [
            styles.explainerToggle,
            pressed && styles.explainerTogglePressed,
          ]}
        >
          <Text style={styles.explainerToggleText}>How credits work</Text>
          <Text style={styles.explainerToggleChevron}>
            {isExplainerOpen ? "−" : "+"}
          </Text>
        </Pressable>

        {isExplainerOpen ? <ExplainerPanel /> : null}

        <Text style={styles.sectionLabel}>Activity</Text>
      </View>
    ),
    [isExplainerOpen, toggleExplainer],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={boostCreditLedgerNewestFirst}
          keyExtractor={(row) => row.id}
          renderItem={({ item }) => <LedgerRow row={item} />}
          ListHeaderComponent={listHeader}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.actionBar}>
          <Pressable
            onPress={toggleExplainer}
            disabled={isSharing}
            accessibilityRole="button"
            accessibilityLabel="Toggle how boost credits work explainer"
            style={({ pressed }) => [
              styles.barButton,
              styles.barButtonSecondary,
              pressed && styles.barButtonPressed,
            ]}
          >
            <Text style={styles.barButtonSecondaryText}>
              {isExplainerOpen ? "Hide explainer" : "How it works"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleShare}
            disabled={isSharing}
            accessibilityRole="button"
            accessibilityLabel="Share my boost credits balance"
            style={({ pressed }) => [
              styles.barButton,
              styles.barButtonPrimary,
              pressed && styles.barButtonPressed,
              isSharing && styles.barButtonDisabled,
            ]}
          >
            <Text style={styles.barButtonPrimaryText}>
              {isSharing ? "Opening share sheet…" : "Share my balance"}
            </Text>
          </Pressable>
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
  container: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingBottom: tokens.space(8),
  },
  headerArea: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    lineHeight: 30,
  },
  screenSubtitle: {
    marginTop: tokens.space(1),
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },
  heroCard: {
    marginTop: tokens.space(5),
    backgroundColor: tokens.color.ink,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(6),
    paddingHorizontal: tokens.space(5),
  },
  heroLabel: {
    fontSize: 14,
    color: tokens.color.onInkMuted,
    textAlign: "center",
  },
  heroValue: {
    marginTop: tokens.space(1),
    fontSize: 48,
    fontWeight: "700",
    color: tokens.color.onInk,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  heroUnit: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.onInkMuted,
    textAlign: "center",
  },
  heroStatsRow: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
  },
  heroStatDivider: {
    width: 1,
    height: tokens.space(8),
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.onInk,
    fontVariant: ["tabular-nums"],
  },
  heroStatLabel: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.onInkMuted,
    textAlign: "center",
  },
  explainerToggle: {
    marginTop: tokens.space(4),
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  explainerTogglePressed: {
    backgroundColor: tokens.color.accentBg,
  },
  explainerToggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  explainerToggleChevron: {
    fontSize: 18,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  explainerPanel: {
    marginTop: tokens.space(2),
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
  },
  explainerLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: tokens.space(2),
  },
  explainerBullet: {
    fontSize: 16,
    lineHeight: 24,
    color: tokens.color.accent,
    marginRight: tokens.space(2),
  },
  explainerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.ink2,
  },
  sectionLabel: {
    marginTop: tokens.space(6),
    marginBottom: tokens.space(2),
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  rowTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.space(1),
  },
  rowKindTag: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.5,
  },
  rowDate: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
    lineHeight: 22,
  },
  rowDetail: {
    marginTop: tokens.space(1),
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },
  rowBottomLine: {
    marginTop: tokens.space(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowAmount: {
    fontSize: 16,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  rowAmountEarned: {
    color: tokens.color.success,
  },
  rowAmountSpent: {
    color: tokens.color.danger,
  },
  rowBalance: {
    fontSize: 13,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  separator: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginHorizontal: tokens.space(4),
  },
  actionBar: {
    flexDirection: "row",
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  barButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  barButtonPrimary: {
    backgroundColor: tokens.color.accent,
  },
  barButtonSecondary: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  barButtonPressed: {
    opacity: 0.85,
  },
  barButtonDisabled: {
    opacity: 0.6,
  },
  barButtonPrimaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  barButtonSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
});
