import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  consignmentPartners,
  initiallyEndedPartnerIds,
  formatUsd,
  type ConsignmentPartner,
} from "./data";

/**
 * A single shared cursor for the destructive row flow. Only one partner can
 * ever be mid-confirmation at a time because there is exactly one of these
 * for the whole screen — "at most one live region active" falls out of
 * that structurally, it isn't something each row has to coordinate.
 */
type EndFlowCursor = {
  partnerId: string | null;
  stage: "resting" | "awaitingConfirm";
};

export default function ConsignmentPartnersScreen() {
  const [endFlow, setEndFlow] = useState<EndFlowCursor>({
    partnerId: null,
    stage: "resting",
  });
  const [closedPartnerIds, setClosedPartnerIds] = useState<string[]>(
    initiallyEndedPartnerIds
  );
  // The one partner whose "ended" text should carry the live-region alert
  // right now, because the user just caused that transition in this
  // session. Partners closed before the screen mounted (seed data) render
  // as plain settled text instead — nothing just happened for them.
  const [justClosedPartnerId, setJustClosedPartnerId] = useState<
    string | null
  >(null);

  const openPartnerCount = useMemo(
    () => consignmentPartners.length - closedPartnerIds.length,
    [closedPartnerIds]
  );

  function startEndRequest(partnerId: string) {
    setEndFlow({ partnerId, stage: "awaitingConfirm" });
  }

  function abortEndRequest() {
    setEndFlow({ partnerId: null, stage: "resting" });
  }

  function finishEndRequest(partnerId: string) {
    setClosedPartnerIds((prev) =>
      prev.includes(partnerId) ? prev : [...prev, partnerId]
    );
    setJustClosedPartnerId(partnerId);
    setEndFlow({ partnerId: null, stage: "resting" });
  }

  function renderPartner({ item }: { item: ConsignmentPartner }) {
    const isClosed = closedPartnerIds.includes(item.id);
    const isAwaitingConfirm =
      endFlow.stage === "awaitingConfirm" && endFlow.partnerId === item.id;

    return (
      <View style={styles.partnerCard}>
        <Text style={styles.partnerName}>{item.name}</Text>
        <Text style={styles.partnerMeta}>{item.memberSinceLabel}</Text>

        <View style={styles.statRow}>
          <View style={styles.statCell}>
            <Text style={[styles.statValue, styles.tabularNums]}>
              {item.itemsConsigned}
            </Text>
            <Text style={styles.statLabel}>consigned</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={[styles.statValue, styles.tabularNums]}>
              {item.itemsSold}
            </Text>
            <Text style={styles.statLabel}>sold</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={[styles.statValue, styles.tabularNums]}>
              {formatUsd(item.totalPayoutCents)}
            </Text>
            <Text style={styles.statLabel}>paid out</Text>
          </View>
        </View>

        {isClosed ? (
          justClosedPartnerId === item.id ? (
            <View
              style={styles.closedNotice}
              accessibilityLiveRegion="polite"
            >
              <Text
                style={styles.closedNoticeText}
                accessibilityRole="alert"
              >
                Partnership with {item.name} has ended. They can no longer
                send you items to resell.
              </Text>
            </View>
          ) : (
            <View style={styles.closedNotice}>
              <Text style={styles.closedNoticeText}>
                Partnership ended. They can no longer send you items to
                resell.
              </Text>
            </View>
          )
        ) : isAwaitingConfirm ? (
          <View
            style={styles.confirmPanel}
            accessibilityLiveRegion="polite"
          >
            <Text
              style={styles.confirmPanelText}
              accessibilityRole="alert"
            >
              Ending the partnership with {item.name} is permanent. Any
              items still with you will need to be returned separately.
            </Text>
            <View style={styles.confirmPanelActions}>
              <Pressable
                onPress={abortEndRequest}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Keep partnership with ${item.name}`}
                style={styles.keepButton}
              >
                <Text style={styles.keepButtonText}>Keep partner</Text>
              </Pressable>
              <Pressable
                onPress={() => finishEndRequest(item.id)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Confirm ending partnership with ${item.name}`}
                style={styles.finalizeEndButton}
              >
                <Text style={styles.finalizeEndButtonText}>
                  End partnership
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => startEndRequest(item.id)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`End partnership with ${item.name}`}
            accessibilityHint="Opens a confirmation before permanently ending this partnership"
            style={styles.requestEndButton}
          >
            <Text style={styles.requestEndButtonText}>End partnership</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerBlock}>
        <Text style={styles.heading} accessibilityRole="header">
          Consignment Partners
        </Text>
        <Text style={styles.subheading}>
          People who send you items to resell on their behalf.
        </Text>
        <Text style={[styles.countLine, styles.tabularNums]}>
          {openPartnerCount} active · {closedPartnerIds.length} ended
        </Text>
      </View>

      <FlatList
        data={consignmentPartners}
        keyExtractor={(item) => item.id}
        renderItem={renderPartner}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              No consignment partners yet
            </Text>
            <Text style={styles.emptyStateBody}>
              When someone asks you to resell items on their behalf, they
              will show up here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerBlock: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  countLine: {
    marginTop: tokens.space(2),
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(4),
  },
  separator: {
    height: tokens.space(3),
  },
  partnerCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  partnerMeta: {
    marginTop: tokens.space(1) / 2,
    fontSize: 13,
    color: tokens.color.faint,
  },
  statRow: {
    flexDirection: "row",
    marginTop: tokens.space(3),
    gap: tokens.space(4),
  },
  statCell: {
    minWidth: 64,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.muted,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  requestEndButton: {
    marginTop: tokens.space(4),
    alignSelf: "flex-start",
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
  },
  requestEndButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.danger,
  },
  confirmPanel: {
    marginTop: tokens.space(4),
    padding: tokens.space(3),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.dangerBg,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
  },
  confirmPanelText: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.danger,
  },
  confirmPanelActions: {
    flexDirection: "row",
    marginTop: tokens.space(3),
    gap: tokens.space(2),
  },
  keepButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  keepButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  finalizeEndButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
  },
  finalizeEndButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onInk,
  },
  closedNotice: {
    marginTop: tokens.space(4),
    padding: tokens.space(3),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
  },
  closedNoticeText: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  emptyState: {
    paddingVertical: tokens.space(8),
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  emptyStateBody: {
    marginTop: tokens.space(2),
    fontSize: 14,
    color: tokens.color.muted,
    textAlign: "center",
    maxWidth: 260,
  },
});
