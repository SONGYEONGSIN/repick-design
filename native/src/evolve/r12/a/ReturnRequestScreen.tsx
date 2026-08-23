import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  type LayoutChangeEvent,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ORDER,
  RETURN_REASONS,
  REFUND_METHODS,
  MAX_PHOTOS,
  RETURN_REQUEST_ID,
  REVIEW_WINDOW_TEXT,
  formatWon,
  type ReturnReason,
  type RefundMethod,
} from "./data";

type SectionKey = "reason" | "evidence" | "refund";

export function ReturnRequestScreen() {
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
  const [photoSlots, setPhotoSlots] = useState<boolean[]>(
    () => new Array(MAX_PHOTOS).fill(false)
  );
  const [selectedRefundId, setSelectedRefundId] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<SectionKey | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef<Record<SectionKey, number>>({
    reason: 0,
    evidence: 0,
    refund: 0,
  });

  const selectedReason =
    RETURN_REASONS.find((r) => r.id === selectedReasonId) ?? null;
  const evidenceRequired = selectedReason?.requiresEvidence ?? false;
  const photoCount = photoSlots.filter(Boolean).length;

  const reasonOk = selectedReasonId !== null;
  const evidenceOk = !evidenceRequired || photoCount >= 1;
  const refundOk = selectedRefundId !== null;
  const allOk = reasonOk && evidenceOk && refundOk;

  function statusFor(): { text: string; target: SectionKey | null } {
    if (!reasonOk) {
      return {
        text: "Select a reason for your return to continue.",
        target: "reason",
      };
    }
    if (!evidenceOk) {
      return {
        text: "Add at least one photo showing the item's condition.",
        target: "evidence",
      };
    }
    if (!refundOk) {
      return {
        text: "Choose how you'd like to be refunded.",
        target: "refund",
      };
    }
    return { text: "Ready to submit your return request.", target: null };
  }

  const status = statusFor();

  function onSectionLayout(key: SectionKey) {
    return (e: LayoutChangeEvent) => {
      sectionY.current[key] = e.nativeEvent.layout.y;
    };
  }

  function jumpTo(key: SectionKey) {
    setHighlighted(key);
    const y = sectionY.current[key];
    scrollRef.current?.scrollTo({ y: Math.max(y - tokens.space(4), 0), animated: true });
  }

  function handleBandPress() {
    if (submitted) return;
    if (allOk) {
      setSubmitted(true);
      return;
    }
    if (status.target) jumpTo(status.target);
  }

  function selectReason(id: string) {
    if (submitted) return;
    setSelectedReasonId(id);
    if (highlighted === "reason") setHighlighted(null);
    // Switching to a reason that no longer requires evidence clears the
    // evidence highlight too, since that unresolved item may now be moot.
    const next = RETURN_REASONS.find((r) => r.id === id);
    if (highlighted === "evidence" && next && !next.requiresEvidence) {
      setHighlighted(null);
    }
  }

  function togglePhoto(index: number) {
    if (submitted) return;
    setPhotoSlots((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
    if (highlighted === "evidence") setHighlighted(null);
  }

  function selectRefund(id: string) {
    if (submitted) return;
    setSelectedRefundId(id);
    if (highlighted === "refund") setHighlighted(null);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading} accessibilityRole="header">
          Request a return
        </Text>
        <Text style={styles.subheading}>
          Tell us what happened with this order — one submission starts your
          request.
        </Text>

        <View style={styles.orderCard}>
          <View style={styles.orderThumb}>
            <Text style={styles.orderThumbText}>IMG</Text>
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle} numberOfLines={2}>
              {ORDER.itemTitle}
            </Text>
            <Text style={styles.orderMeta}>Sold by {ORDER.seller}</Text>
            <Text style={styles.orderMeta}>
              Delivered {ORDER.deliveredOn} · Order {ORDER.id}
            </Text>
            <Text style={styles.orderPrice}>{formatWon(ORDER.priceWon)}</Text>
          </View>
        </View>

        <View
          onLayout={onSectionLayout("reason")}
          style={[
            styles.section,
            highlighted === "reason" && styles.sectionHighlighted,
          ]}
        >
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Why are you returning this?
          </Text>
          <FlatList
            data={RETURN_REASONS}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ReasonRow
                reason={item}
                selected={item.id === selectedReasonId}
                disabled={submitted}
                onPress={() => selectReason(item.id)}
              />
            )}
          />
        </View>

        <View
          onLayout={onSectionLayout("evidence")}
          style={[
            styles.section,
            highlighted === "evidence" && styles.sectionHighlighted,
          ]}
        >
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Add condition evidence
          </Text>
          <Text style={styles.sectionHelper}>
            {evidenceRequired
              ? "Required for this reason — add at least 1 photo."
              : selectedReason
              ? "Optional for this reason, but photos help speed up review."
              : "Optional — add photos showing the item's condition."}
          </Text>
          <View style={styles.photoGrid}>
            {photoSlots.map((filled, index) => (
              <PhotoSlot
                key={index}
                index={index}
                filled={filled}
                disabled={submitted}
                onToggle={() => togglePhoto(index)}
              />
            ))}
          </View>
        </View>

        <View
          onLayout={onSectionLayout("refund")}
          style={[
            styles.section,
            highlighted === "refund" && styles.sectionHighlighted,
          ]}
        >
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Refund method
          </Text>
          <FlatList
            data={REFUND_METHODS}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <RefundRow
                method={item}
                selected={item.id === selectedRefundId}
                disabled={submitted}
                onPress={() => selectRefund(item.id)}
              />
            )}
          />
        </View>

        {submitted && (
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Request on file</Text>
            <Text style={styles.confirmLine}>
              Request ID {RETURN_REQUEST_ID}
            </Text>
            <Text style={styles.confirmLine}>
              Reason: {selectedReason?.label}
            </Text>
            <Text style={styles.confirmLine}>
              Refund to:{" "}
              {REFUND_METHODS.find((m) => m.id === selectedRefundId)?.label}
            </Text>
            <Text style={styles.confirmHelper}>
              Track progress and messages with the seller in Dispute Center
              once a reviewer picks this up.
            </Text>
          </View>
        )}

        <View style={styles.bandSpacer} />
      </ScrollView>

      <View style={styles.band} accessibilityLiveRegion="polite">
        <Text
          style={[
            styles.bandStatus,
            allOk && !submitted && styles.bandStatusReady,
            submitted && styles.bandStatusReady,
          ]}
          accessibilityRole="alert"
        >
          {submitted
            ? `Return request submitted. We'll review it ${REVIEW_WINDOW_TEXT}.`
            : status.text}
        </Text>
        {!submitted && (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={allOk ? "Submit return request" : "Continue to next required step"}
            style={({ pressed }) => [
              styles.bandButton,
              allOk ? styles.bandButtonReady : styles.bandButtonWaiting,
              pressed && styles.bandButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.bandButtonText,
                allOk ? styles.bandButtonTextReady : styles.bandButtonTextWaiting,
              ]}
            >
              {allOk ? "Submit return request" : "Continue"}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function ReasonRow({
  reason,
  selected,
  disabled,
  onPress,
}: {
  reason: ReturnReason;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={`${reason.label}. ${reason.helper}`}
      style={({ pressed }) => [
        styles.optionRow,
        selected && styles.optionRowSelected,
        pressed && !disabled && styles.optionRowPressed,
        disabled && styles.optionRowDisabled,
      ]}
    >
      <View style={[styles.radioDot, selected && styles.radioDotSelected]} />
      <View style={styles.optionTextWrap}>
        <Text style={styles.optionLabel}>{reason.label}</Text>
        <Text style={styles.optionHelper}>{reason.helper}</Text>
      </View>
    </Pressable>
  );
}

function RefundRow({
  method,
  selected,
  disabled,
  onPress,
}: {
  method: RefundMethod;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={`${method.label}. ${method.subtitle}`}
      style={({ pressed }) => [
        styles.optionRow,
        selected && styles.optionRowSelected,
        pressed && !disabled && styles.optionRowPressed,
        disabled && styles.optionRowDisabled,
      ]}
    >
      <View style={[styles.radioDot, selected && styles.radioDotSelected]} />
      <View style={styles.optionTextWrap}>
        <Text style={styles.optionLabel}>{method.label}</Text>
        <Text style={styles.optionHelper}>{method.subtitle}</Text>
      </View>
    </Pressable>
  );
}

function PhotoSlot({
  index,
  filled,
  disabled,
  onToggle,
}: {
  index: number;
  filled: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const label = filled
    ? `Photo ${index + 1} attached. Double tap to remove.`
    : `Add photo ${index + 1}`;

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={filled ? undefined : { top: 4, bottom: 4, left: 4, right: 4 }}
      style={({ pressed }) => [
        styles.photoSlot,
        filled ? styles.photoSlotFilled : styles.photoSlotEmpty,
        pressed && !disabled && styles.photoSlotPressed,
        disabled && styles.photoSlotDisabled,
      ]}
    >
      {filled ? (
        <>
          <Text style={styles.photoSlotCheck}>✓</Text>
          <Text style={styles.photoSlotLabel}>Photo {index + 1}</Text>
        </>
      ) : (
        <>
          <Text style={styles.photoSlotPlus}>+</Text>
          <Text style={styles.photoSlotLabel}>Add photo</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.color.bg },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(5),
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    fontSize: 14,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
    lineHeight: 20,
  },
  orderCard: {
    flexDirection: "row",
    marginTop: tokens.space(5),
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    gap: tokens.space(4),
  },
  orderThumb: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  orderThumbText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  orderInfo: { flex: 1, gap: tokens.space(1) },
  orderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  orderMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginTop: tokens.space(1),
  },
  section: {
    marginTop: tokens.space(7),
    borderRadius: tokens.radius.md,
    padding: tokens.space(1),
  },
  sectionHighlighted: {
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
    paddingHorizontal: tokens.space(3),
  },
  sectionHelper: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
    paddingHorizontal: tokens.space(3),
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    padding: tokens.space(3),
    marginHorizontal: tokens.space(2),
    marginBottom: tokens.space(2),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    minHeight: 44,
    backgroundColor: tokens.color.bg,
  },
  optionRowSelected: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
    padding: tokens.space(3) - 1,
  },
  optionRowPressed: {
    backgroundColor: tokens.color.border,
  },
  optionRowDisabled: {
    opacity: 0.55,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: tokens.color.faint,
    marginTop: 2,
  },
  radioDotSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  optionTextWrap: { flex: 1, gap: tokens.space(1) },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  optionHelper: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(3),
  },
  photoSlot: {
    width: 76,
    height: 76,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.space(1),
  },
  photoSlotEmpty: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: tokens.color.faint,
    backgroundColor: tokens.color.bg,
  },
  photoSlotFilled: {
    borderWidth: 2,
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.bg,
  },
  photoSlotPressed: {
    backgroundColor: tokens.color.border,
  },
  photoSlotDisabled: {
    opacity: 0.55,
  },
  photoSlotPlus: {
    fontSize: 20,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  photoSlotCheck: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  photoSlotLabel: {
    fontSize: 10,
    color: tokens.color.faint,
    textAlign: "center",
  },
  confirmCard: {
    marginTop: tokens.space(7),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.bg,
    gap: tokens.space(1),
  },
  confirmTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  confirmLine: {
    fontSize: 13,
    color: tokens.color.ink2,
  },
  confirmHelper: {
    fontSize: 12,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
    lineHeight: 17,
  },
  bandSpacer: { height: tokens.space(10) },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
    gap: tokens.space(3),
  },
  bandStatus: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  bandStatusReady: {
    color: tokens.color.accent,
    fontWeight: "600",
  },
  bandButton: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonReady: {
    backgroundColor: tokens.color.accent,
  },
  bandButtonWaiting: {
    backgroundColor: tokens.color.ink,
  },
  bandButtonPressed: {
    opacity: 0.85,
  },
  bandButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  bandButtonTextReady: {
    color: tokens.color.onAccent,
  },
  bandButtonTextWaiting: {
    color: tokens.color.onInk,
  },
});
