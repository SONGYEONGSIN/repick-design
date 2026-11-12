import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { counterpart, initialFields } from "./data";
import type { ProposalField } from "./data";

type BandMode = "summary" | "cancelConfirm" | "finalized" | "none";

function cycleIndex(current: number, avoid: number, length: number): number {
  let next = (current + 1) % length;
  if (length > 1 && next === avoid) {
    next = (next + 1) % length;
  }
  return next;
}

export default function GearSwapTermsScreen() {
  const [fields, setFields] = useState<ProposalField[]>(initialFields);
  const [phase, setPhase] = useState<"negotiating" | "finalized" | "cancelled">(
    "negotiating"
  );
  const [cancelPending, setCancelPending] = useState(false);
  const [finalizedAcknowledged, setFinalizedAcknowledged] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const rowPositions = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!highlightedId) return;
    const timer = setTimeout(() => setHighlightedId(null), 1600);
    return () => clearTimeout(timer);
  }, [highlightedId]);

  // Derived fresh on every render — never cached — so reopening an
  // already-agreed term (see reopenField) is reflected immediately.
  const agreedCount = fields.filter((f) => f.status === "agreed").length;
  const totalCount = fields.length;
  const allAgreed = agreedCount === totalCount;
  const unresolved = fields.filter((f) => f.status !== "agreed");
  const nextField =
    unresolved.find((f) => f.status === "awaiting_you") ?? unresolved[0];

  // Single derived mode: the band can only ever be in one of these states,
  // never two at once, because this is the one value every render reads.
  const bandMode: BandMode =
    phase === "cancelled"
      ? "none"
      : phase === "finalized"
      ? finalizedAcknowledged
        ? "none"
        : "finalized"
      : cancelPending
      ? "cancelConfirm"
      : "summary";

  const statusLine =
    phase === "cancelled"
      ? "Negotiation cancelled."
      : phase === "finalized"
      ? "All terms confirmed — swap finalized."
      : `${agreedCount} of ${totalCount} terms agreed`;

  function acceptTheirs(id: string) {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, yourIndex: f.theirIndex, status: "agreed" } : f
      )
    );
  }

  function counterField(id: string) {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const newYourIndex = cycleIndex(
          f.yourIndex,
          f.theirIndex,
          f.options.length
        );
        return { ...f, yourIndex: newYourIndex, status: "awaiting_them" };
      })
    );
  }

  function reopenField(id: string) {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== id || f.status !== "agreed") return f;
        const newYourIndex = cycleIndex(
          f.yourIndex,
          f.theirIndex,
          f.options.length
        );
        return { ...f, yourIndex: newYourIndex, status: "awaiting_them" };
      })
    );
  }

  function jumpToNext() {
    if (!nextField) return;
    const y = rowPositions.current[nextField.id] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(y - 12, 0), animated: true });
    setHighlightedId(nextField.id);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text accessibilityRole="header" style={styles.heading}>
          Gear Swap Terms
        </Text>
        <Text style={styles.subheading}>
          Trading your {counterpart.yourItem} for {counterpart.name}&apos;s{" "}
          {counterpart.theirItem}
        </Text>

        <View accessibilityLiveRegion="polite" style={styles.liveRegion}>
          <Text accessibilityRole="alert" style={styles.statusLine}>
            {statusLine}
          </Text>
        </View>

        {phase === "cancelled" ? (
          <View style={styles.cancelledCard}>
            <Text style={styles.cancelledTitle}>This negotiation ended</Text>
            <Text style={styles.cancelledBody}>
              No terms were changed on either listing. {counterpart.name} has
              been notified.
            </Text>
          </View>
        ) : (
          <View style={styles.fieldList}>
            {fields.map((field) => {
              const isHighlighted = highlightedId === field.id;
              const cardStyle = [
                styles.card,
                isHighlighted ? styles.cardHighlighted : null,
              ];

              return (
                <View
                  key={field.id}
                  style={cardStyle}
                  onLayout={(e) => {
                    rowPositions.current[field.id] = e.nativeEvent.layout.y;
                  }}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <StatusBadge status={field.status} />
                  </View>
                  <Text style={styles.fieldHelp}>{field.helpText}</Text>

                  {field.status === "agreed" ? (
                    <View style={styles.cardBody}>
                      <Text style={styles.valueAgreed}>
                        Agreed: {field.options[field.yourIndex]}
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Reopen the ${field.label} term`}
                        hitSlop={10}
                        style={styles.linkButton}
                        onPress={() => reopenField(field.id)}
                      >
                        <Text style={styles.linkButtonText}>
                          Reopen this term
                        </Text>
                      </Pressable>
                    </View>
                  ) : field.status === "awaiting_you" ? (
                    <View style={styles.cardBody}>
                      <Text style={styles.valueIncoming}>
                        Their counter: {field.options[field.theirIndex]}
                      </Text>
                      <Text style={styles.valuePreviousStrike}>
                        Your previous offer:{" "}
                        {field.options[field.yourIndex]} (previous)
                      </Text>
                      <View style={styles.actionRow}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Accept ${counterpart.name}'s counter of ${field.options[field.theirIndex]} for ${field.label}`}
                          style={styles.primaryButton}
                          onPress={() => acceptTheirs(field.id)}
                        >
                          <Text style={styles.primaryButtonText}>Accept</Text>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Propose a different value for ${field.label}`}
                          style={styles.secondaryButton}
                          onPress={() => counterField(field.id)}
                        >
                          <Text style={styles.secondaryButtonText}>
                            Counter
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.cardBody}>
                      <Text style={styles.valueOutgoing}>
                        Your offer: {field.options[field.yourIndex]}
                      </Text>
                      <Text style={styles.valueSecondary}>
                        Their last position:{" "}
                        {field.options[field.theirIndex]}
                      </Text>
                      <Text style={styles.waitingText}>
                        Waiting for {counterpart.name} to respond
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Change your offer for ${field.label}`}
                        style={styles.secondaryButton}
                        onPress={() => counterField(field.id)}
                      >
                        <Text style={styles.secondaryButtonText}>
                          Change your offer
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {phase === "finalized" ? (
          <View style={styles.recapCard}>
            <Text style={styles.recapTitle}>Final agreed terms</Text>
            {fields.map((f) => (
              <View key={f.id} style={styles.recapRow}>
                <Text style={styles.recapLabel}>{f.label}</Text>
                <Text style={styles.recapValue}>
                  {f.options[f.yourIndex]}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>

      {bandMode === "summary" ? (
        <View style={styles.band}>
          {allAgreed ? (
            <>
              <Text style={styles.bandText}>
                All {totalCount} terms agreed — ready to finalize
              </Text>
              <View style={styles.bandActionRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Finalize the swap"
                  style={styles.bandPrimaryButton}
                  onPress={() => setPhase("finalized")}
                >
                  <Text style={styles.primaryButtonText}>Finalize Swap</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cancel this negotiation"
                  hitSlop={10}
                  style={styles.bandLinkButton}
                  onPress={() => setCancelPending(true)}
                >
                  <Text style={styles.bandLinkText}>Cancel negotiation</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.bandText}>
                {agreedCount} of {totalCount} terms agreed — next:{" "}
                {nextField?.label}
              </Text>
              <View style={styles.bandActionRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Review the ${nextField?.label} term`}
                  style={styles.bandPrimaryButton}
                  onPress={jumpToNext}
                >
                  <Text style={styles.primaryButtonText}>Review</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cancel this negotiation"
                  hitSlop={10}
                  style={styles.bandLinkButton}
                  onPress={() => setCancelPending(true)}
                >
                  <Text style={styles.bandLinkText}>Cancel negotiation</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      ) : null}

      {bandMode === "cancelConfirm" ? (
        <View style={styles.bandDanger}>
          <Text style={styles.bandDangerText}>
            Cancel this negotiation? Progress on all terms will be lost.
          </Text>
          <View style={styles.bandActionRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Keep negotiating"
              style={styles.secondaryButton}
              onPress={() => setCancelPending(false)}
            >
              <Text style={styles.secondaryButtonText}>Keep negotiating</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Confirm cancelling the negotiation"
              style={styles.dangerButton}
              onPress={() => {
                setCancelPending(false);
                setPhase("cancelled");
              }}
            >
              <Text style={styles.dangerButtonText}>Cancel negotiation</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {bandMode === "finalized" ? (
        <View style={styles.bandSuccess}>
          <Text style={styles.bandSuccessText}>
            Terms confirmed. {counterpart.name} will schedule the pickup next.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss the confirmation banner"
            style={styles.bandPrimaryButton}
            onPress={() => setFinalizedAcknowledged(true)}
          >
            <Text style={styles.primaryButtonText}>Done</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function StatusBadge({
  status,
}: {
  status: ProposalField["status"];
}) {
  if (status === "agreed") {
    return (
      <View style={styles.badgeAgreed}>
        <Text style={styles.badgeAgreedText}>Agreed</Text>
      </View>
    );
  }
  if (status === "awaiting_you") {
    return (
      <View style={styles.badgeYourTurn}>
        <Text style={styles.badgeYourTurnText}>Your turn</Text>
      </View>
    );
  }
  return (
    <View style={styles.badgeWaiting}>
      <Text style={styles.badgeWaitingText}>Waiting</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  liveRegion: {
    marginTop: tokens.space(3),
  },
  statusLine: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  fieldList: {
    marginTop: tokens.space(4),
    gap: tokens.space(3),
  },
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  cardHighlighted: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  fieldHelp: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.faint,
  },
  cardBody: {
    marginTop: tokens.space(3),
    gap: tokens.space(2),
  },
  valueAgreed: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.success,
  },
  valueIncoming: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  valuePreviousStrike: {
    fontSize: 13,
    color: tokens.color.faint,
    textDecorationLine: "line-through",
  },
  valueOutgoing: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  valueSecondary: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  waitingText: {
    fontSize: 13,
    color: tokens.color.faint,
    fontStyle: "italic",
  },
  actionRow: {
    flexDirection: "row",
    gap: tokens.space(2),
    marginTop: tokens.space(1),
  },
  primaryButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: tokens.color.ink2,
    fontSize: 14,
    fontWeight: "600",
  },
  linkButton: {
    minHeight: 44,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  linkButtonText: {
    color: tokens.color.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  badgeAgreed: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
  },
  badgeAgreedText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.success,
  },
  badgeYourTurn: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
  },
  badgeYourTurnText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  badgeWaiting: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  badgeWaitingText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  cancelledCard: {
    marginTop: tokens.space(4),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  cancelledTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  cancelledBody: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  recapCard: {
    marginTop: tokens.space(4),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
  },
  recapTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  recapRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: tokens.space(1),
  },
  recapLabel: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  recapValue: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(2),
  },
  bandText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  bandActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  bandPrimaryButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  bandLinkButton: {
    minHeight: 44,
    justifyContent: "center",
  },
  bandLinkText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.danger,
  },
  bandDanger: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(2),
  },
  bandDangerText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.danger,
  },
  dangerButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerButtonText: {
    color: tokens.color.onInk,
    fontSize: 14,
    fontWeight: "700",
  },
  bandSuccess: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(2),
  },
  bandSuccessText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.success,
  },
});
