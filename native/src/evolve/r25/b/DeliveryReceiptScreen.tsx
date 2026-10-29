// native/src/evolve/r25/b/DeliveryReceiptScreen.tsx — auto-native-r25 candidate b.
//
// Delivery Confirmation Receipt: a read-only record shown *after* a buyer has already
// confirmed receipt of an item and payment has already been released to the seller. Everything
// on this screen already happened — final price, delivery method/date, seller info, and the
// confirmation timestamp are all settled facts, not steps still in progress.
//
// This is deliberately NOT `certificate` (AuthenticationCertificateScreen), even though both are
// completed-record screens. Authentication certificate concept: an item PASSES OR FAILS a set of
// independent inspection checkpoints, and the whole page is organized around that pass/note
// verdict. This screen concept: a finished MONEY TRANSACTION (what was bought, what was paid,
// how it moved, when it arrived) — its structure is a price breakdown and a chronological
// delivery timeline, not a checklist of verdicts. Nothing here has a "pass" or "note" state; the
// timeline steps are all already complete, so the only visual distinction between them is which
// one is the terminus (the last-reached step gets a filled accent dot, everything before it gets
// a plain ink dot — there is no failure state to render). Section names, style keys, and the
// bottom bar's control flow are written fresh for this screen (no shared identifiers with
// AuthenticationCertificateScreen's `band`/`verdictCard`/`checkRow`/`sharePanel`/etc).
//
// Per GENERATION.md §3: a read-only completed record has no "why can't I proceed" gate, so the
// fixed bottom band here is a persistent, always-visible action bar, not a blocked-workflow state
// machine. Three real actions, each producing an immediate, visible change:
//   1. Share receipt  -> flips `shared` (label becomes "Shared") and posts a status line.
//   2. Save receipt   -> flips `saved` (label becomes "Saved") and posts a status line.
//   3. Report an issue -> a destructive-ish, consequential action, so per the doctrine's
//      band-to-confirm-row generalization (r13/a, r22/b) the bar itself swaps its 3-button row
//      for a Cancel/Confirm row instead of spawning a separate native Alert. Confirming replaces
//      the "Report an issue" button with a static "Reported" indicator; canceling restores the
//      original row untouched.
// All three actions write into ONE status line, which is the screen's only live region
// (`accessibilityLiveRegion="polite"` on the bar, `accessibilityRole="alert"` only on the Text
// that changes at each transition) — so a single button press never updates two live regions.
import { useState } from "react";
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
  CONFIRMED_ON_LABEL,
  DEFAULT_STATUS_LABEL,
  DELIVERY,
  DISCLOSURE_TEXT,
  ITEM,
  ORDER_ID,
  PRICE,
  REPORT_CANCELED_LABEL,
  REPORT_CONFIRMED_LABEL,
  REPORT_PROMPT_LABEL,
  SAVE_STATUS_LABEL,
  SELLER,
  SHARE_STATUS_LABEL,
  TIMELINE_STEPS,
  formatKrw,
  type TimelineStep,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type ReportStatus = "idle" | "confirming" | "reported";

function TimelineRow({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineRail}>
        <View
          style={[styles.timelineDot, step.isFinal && styles.timelineDotFinal]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        {!isLast ? <View style={styles.timelineLine} /> : null}
      </View>
      <View style={styles.timelineBody}>
        <View style={styles.timelineTopRow}>
          <Text style={styles.timelineLabel}>{step.label}</Text>
          <Text style={styles.timelineTime}>{step.timeLabel}</Text>
        </View>
        <Text style={styles.timelineDetail}>{step.detail}</Text>
      </View>
    </View>
  );
}

export function DeliveryReceiptScreen() {
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reportStatus, setReportStatus] = useState<ReportStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleShare = () => {
    setShared(true);
    setStatusMessage(SHARE_STATUS_LABEL);
  };

  const handleSave = () => {
    setSaved(true);
    setStatusMessage(SAVE_STATUS_LABEL);
  };

  const handleReportPress = () => {
    setReportStatus("confirming");
    setStatusMessage(REPORT_PROMPT_LABEL);
  };

  const handleReportCancel = () => {
    setReportStatus("idle");
    setStatusMessage(REPORT_CANCELED_LABEL);
  };

  const handleReportConfirm = () => {
    setReportStatus("reported");
    setStatusMessage(REPORT_CONFIRMED_LABEL);
  };

  const header = (
    <View style={styles.headerWrap}>
      <Text style={styles.eyebrow}>TRANSACTION COMPLETE</Text>
      <Text style={styles.heading} accessibilityRole="header">
        Delivery Receipt
      </Text>
      <Text style={styles.subheading}>
        Order {ORDER_ID} · Confirmed {CONFIRMED_ON_LABEL}
      </Text>

      <View style={styles.itemPanel}>
        <View
          style={styles.thumb}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Text style={styles.thumbGlyph}>{ITEM.brand.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.brandTag}>{ITEM.brand}</Text>
          <Text style={styles.itemName} numberOfLines={2}>
            {ITEM.title}
          </Text>
          <Text style={styles.itemAttr}>
            Size {ITEM.size} · {ITEM.conditionLabel}
          </Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle} accessibilityRole="header">
          Price Summary
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Item price</Text>
          <Text style={styles.priceValue}>{formatKrw(PRICE.itemKrw)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Shipping</Text>
          <Text style={styles.priceValue}>{formatKrw(PRICE.shippingKrw)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Buyer protection fee</Text>
          <Text style={styles.priceValue}>{formatKrw(PRICE.protectionFeeKrw)}</Text>
        </View>
        <View style={styles.priceDivider} />
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total paid</Text>
          <Text style={styles.totalValue}>{formatKrw(PRICE.totalKrw)}</Text>
        </View>
        <Text style={styles.paymentNote}>
          {PRICE.paymentMethodLabel} · {PRICE.releasedNoteLabel}
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle} accessibilityRole="header">
          Delivery Details
        </Text>
        <View style={styles.deliveryGrid}>
          <View style={styles.deliveryField}>
            <Text style={styles.fieldLabel}>Carrier</Text>
            <Text style={styles.fieldValue}>{DELIVERY.method}</Text>
          </View>
          <View style={styles.deliveryField}>
            <Text style={styles.fieldLabel}>Tracking number</Text>
            <Text style={styles.fieldValue}>{DELIVERY.trackingNumber}</Text>
          </View>
          <View style={styles.deliveryField}>
            <Text style={styles.fieldLabel}>Delivered to</Text>
            <Text style={styles.fieldValue}>{DELIVERY.deliveredAddressMasked}</Text>
          </View>
          <View style={styles.deliveryField}>
            <Text style={styles.fieldLabel}>Delivered on</Text>
            <Text style={styles.fieldValue}>{DELIVERY.deliveredOnLabel}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Order Timeline
      </Text>
    </View>
  );

  const footer = (
    <View style={styles.footerWrap}>
      <View
        style={styles.sellerCard}
        accessible
        accessibilityLabel={`Sold by ${SELLER.name}, ${SELLER.handle}, ${SELLER.ratingLabel}`}
      >
        <View style={styles.sellerAvatar}>
          <Text style={styles.sellerAvatarText}>{SELLER.initials}</Text>
        </View>
        <View style={styles.sellerDetails}>
          <Text style={styles.sellerName}>{SELLER.name}</Text>
          <Text style={styles.sellerMeta}>
            {SELLER.handle} · {SELLER.ratingLabel}
          </Text>
        </View>
      </View>
      <Text style={styles.disclosureText}>{DISCLOSURE_TEXT}</Text>
    </View>
  );

  const renderStep = ({ item, index }: { item: TimelineStep; index: number }) => (
    <TimelineRow step={item} isLast={index === TIMELINE_STEPS.length - 1} />
  );

  const statusIsAlert = statusMessage !== null;
  const displayedStatus = statusMessage ?? DEFAULT_STATUS_LABEL;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={TIMELINE_STEPS}
        keyExtractor={(step) => step.id}
        renderItem={renderStep}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.actionBar} accessibilityLiveRegion="polite">
        <Text
          style={statusIsAlert ? styles.statusTextAlert : styles.statusText}
          accessibilityRole={statusIsAlert ? "alert" : undefined}
        >
          {displayedStatus}
        </Text>

        {reportStatus === "confirming" ? (
          <View style={styles.confirmRow}>
            <Pressable
              onPress={handleReportCancel}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Cancel reporting an issue"
              style={({ pressed }) => [
                styles.confirmBtnCancel,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.confirmBtnCancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleReportConfirm}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Confirm reporting an issue with this order"
              style={({ pressed }) => [
                styles.confirmBtnConfirm,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.confirmBtnConfirmText}>Confirm report</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <Pressable
              onPress={handleShare}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={shared ? "Share receipt again" : "Share receipt"}
              style={({ pressed }) => [
                styles.actionButton,
                shared && styles.actionButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[styles.actionButtonText, shared && styles.actionButtonTextActive]}
                numberOfLines={1}
              >
                {shared ? "Shared" : "Share"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={saved ? "Receipt already saved, save again" : "Save receipt"}
              style={({ pressed }) => [
                styles.actionButton,
                saved && styles.actionButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[styles.actionButtonText, saved && styles.actionButtonTextActive]}
                numberOfLines={1}
              >
                {saved ? "Saved" : "Save"}
              </Text>
            </Pressable>

            {reportStatus === "reported" ? (
              <View style={styles.reportedPill}>
                <Text style={styles.reportedPillText} numberOfLines={1}>
                  Reported
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={handleReportPress}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
                accessibilityLabel="Report an issue with this order"
                style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
              >
                <Text style={styles.actionButtonText} numberOfLines={1}>
                  Report issue
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default DeliveryReceiptScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingBottom: tokens.space(6),
  },

  headerWrap: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
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
  subheading: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.faint,
  },

  itemPanel: {
    flexDirection: "row",
    gap: tokens.space(4),
    marginTop: tokens.space(5),
    paddingBottom: tokens.space(5),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.swatch1,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbGlyph: {
    fontSize: 22,
    fontWeight: "800",
    color: tokens.color.ink2,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },
  brandTag: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: 2,
  },
  itemAttr: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: 2,
  },

  panel: {
    marginTop: tokens.space(5),
    paddingBottom: tokens.space(5),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
  },
  priceLabel: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  priceDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginVertical: tokens.space(2),
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  paymentNote: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(3),
  },

  deliveryGrid: {
    gap: tokens.space(3),
  },
  deliveryField: {
    gap: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(5),
    marginBottom: tokens.space(1),
  },

  timelineRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(5),
  },
  timelineRail: {
    width: 16,
    alignItems: "center",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: tokens.color.ink2,
  },
  timelineDotFinal: {
    backgroundColor: tokens.color.accent,
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 3,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginTop: 2,
    backgroundColor: tokens.color.border,
  },
  timelineBody: {
    flex: 1,
    paddingBottom: tokens.space(4),
  },
  timelineTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: tokens.space(2),
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  timelineTime: {
    fontSize: 11,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  timelineDetail: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.muted,
    marginTop: 2,
  },

  footerWrap: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(2),
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerAvatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  sellerDetails: {
    flex: 1,
    gap: 2,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sellerMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  disclosureText: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
    marginTop: tokens.space(4),
  },

  actionBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(3),
  },
  statusText: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  statusTextAlert: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  actionRow: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  actionButtonActive: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  actionButtonTextActive: {
    color: tokens.color.accent,
  },
  reportedPill: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    backgroundColor: tokens.color.warningBg,
  },
  reportedPillText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.warning,
  },

  confirmRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  confirmBtnCancel: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  confirmBtnCancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  confirmBtnConfirm: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
  },
  confirmBtnConfirmText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },

  pressed: {
    opacity: 0.8,
  },
});
