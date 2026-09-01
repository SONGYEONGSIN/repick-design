// native/src/evolve/r17/b/ItemAuthenticationScreen.tsx — auto-native-r17 candidate b.
//
// Item Authentication Submission: the BEFORE state of the existing (already-issued, read-only)
// certificate screen. A seller preparing one item for pre-listing third-party authentication
// works through a real requirement list — five required reference photos plus one accuracy
// declaration — that genuinely gates submission, then watches a real (non-decorative)
// review-pending timeline once submitted. Distinct from listing/ListingCreateScreen (which
// captures category/condition/price to publish a listing) and from disputes/DisputeCenterScreen
// (which resolves a completed order) — this screen assumes the item's basic listing details
// already exist elsewhere and is scoped tightly to what authentication itself needs: evidence
// photos and a submission that opens a lab review.
//
// Bottom-band choice: genuine blocked-workflow state machine (native-deltas §3.1). While any
// required photo is missing or the declaration is unconfirmed, the band names the exact blocker
// in one sentence and is itself the jump control — pressing it scrolls the list to, and visually
// highlights, that exact unresolved row (both halves implemented, per the r-prior lesson that a
// "why blocked" sentence alone is incomplete). Once every requirement is met the same control
// becomes the real "Submit for authentication" action. After submission the band becomes a
// static, non-pressable confirmation, and the body swaps to a real review-step timeline — this is
// not the persistent-always-visible-action-bar pattern (nothing stays actionable there; the band
// simply stops being a control) and not a multi-select batch bar (single item, no selection).
//
// Simulated capture, stated honestly: there is no real camera in this environment. Tapping an
// empty photo row deterministically flips that slot to "captured" (a fixed placeholder
// representation, not a real photo) — copy and accessibility hints say exactly this and never
// claim a camera opened.
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  DECLARATION_TEXT,
  ITEM,
  REQUIRED_PHOTO_SLOTS,
  REVIEW_STEPS,
  SUBMISSION,
  formatKrwDigits,
  type RequiredPhotoSlot,
  type ReviewStep,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type BuildItem =
  | { id: string; kind: "slot"; slot: RequiredPhotoSlot }
  | { id: "declaration"; kind: "declaration" };

const BUILD_ITEMS: BuildItem[] = [
  ...REQUIRED_PHOTO_SLOTS.map((slot) => ({ id: slot.id, kind: "slot" as const, slot })),
  { id: "declaration", kind: "declaration" as const },
];

type Blocking = { id: string; index: number; message: string } | null;

function CameraGlyph({ filled }: { filled: boolean }) {
  return (
    <View style={[styles.cameraGlyph, filled && styles.cameraGlyphFilled]}>
      <View style={[styles.cameraLens, filled && styles.cameraLensFilled]} />
      {filled ? (
        <View style={styles.cameraCheck}>
          <Text style={styles.cameraCheckGlyph}>✓</Text>
        </View>
      ) : null}
    </View>
  );
}

export function ItemAuthenticationScreen() {
  const [captured, setCaptured] = useState<Record<string, boolean>>({});
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const listRef = useRef<FlatList<BuildItem>>(null);

  const capturedCount = REQUIRED_PHOTO_SLOTS.filter((s) => captured[s.id]).length;
  const totalSlots = REQUIRED_PHOTO_SLOTS.length;
  const allCaptured = capturedCount === totalSlots;

  const blocking: Blocking = useMemo(() => {
    const firstEmpty = REQUIRED_PHOTO_SLOTS.findIndex((s) => !captured[s.id]);
    if (firstEmpty !== -1) {
      const slot = REQUIRED_PHOTO_SLOTS[firstEmpty];
      return {
        id: slot.id,
        index: firstEmpty,
        message: `Capture the ${slot.label.toLowerCase()} photo to continue (${capturedCount} of ${totalSlots} captured)`,
      };
    }
    if (!declared) {
      return {
        id: "declaration",
        index: BUILD_ITEMS.length - 1,
        message: "Confirm the accuracy declaration below to continue",
      };
    }
    return null;
  }, [captured, declared, capturedCount, totalSlots]);

  const toggleSlot = (id: string) => {
    setCaptured((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDeclared = () => {
    setDeclared((prev) => !prev);
  };

  const jumpToBlocker = () => {
    if (!blocking) return;
    listRef.current?.scrollToIndex({ index: blocking.index, viewPosition: 0.3, animated: true });
  };

  const handleBandPress = () => {
    if (blocking) {
      jumpToBlocker();
      return;
    }
    setSubmitted(true);
  };

  const renderBuildItem = ({ item }: { item: BuildItem }) => {
    const highlighted = !submitted && blocking?.id === item.id;

    if (item.kind === "slot") {
      const isCaptured = !!captured[item.slot.id];
      return (
        <Pressable
          onPress={() => toggleSlot(item.slot.id)}
          accessibilityRole="button"
          accessibilityLabel={`${item.slot.label}, ${isCaptured ? "captured" : "not yet captured"}`}
          accessibilityHint={
            isCaptured
              ? "Double tap to remove this simulated photo"
              : "Double tap to simulate capturing this photo — no camera opens"
          }
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.slotRow,
            highlighted && styles.slotRowHighlighted,
            pressed && styles.rowPressed,
          ]}
        >
          <CameraGlyph filled={isCaptured} />
          <View style={styles.slotBody}>
            <Text style={styles.slotLabel}>{item.slot.label}</Text>
            <Text style={styles.slotHint}>{item.slot.hint}</Text>
            <Text style={[styles.slotStatus, isCaptured && styles.slotStatusDone]}>
              {isCaptured ? "Captured" : "Required"}
            </Text>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        onPress={toggleDeclared}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: declared }}
        accessibilityLabel={DECLARATION_TEXT}
        accessibilityHint={declared ? "Double tap to remove confirmation" : "Double tap to confirm"}
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [
          styles.declarationRow,
          highlighted && styles.slotRowHighlighted,
          pressed && styles.rowPressed,
        ]}
      >
        <View style={[styles.checkbox, declared && styles.checkboxDone]}>
          {declared ? <Text style={styles.checkboxGlyph}>✓</Text> : null}
        </View>
        <Text style={styles.declarationText}>{DECLARATION_TEXT}</Text>
      </Pressable>
    );
  };

  const renderReviewItem = ({ item, index }: { item: ReviewStep; index: number }) => (
    <View style={styles.timelineRow}>
      <View style={styles.timelineTrack}>
        <View style={[styles.timelineDot, item.done && styles.timelineDotDone]} />
        {index < REVIEW_STEPS.length - 1 ? (
          <View style={[styles.timelineLine, item.done && styles.timelineLineDone]} />
        ) : null}
      </View>
      <View style={styles.timelineBody}>
        <Text style={[styles.timelineLabel, item.done && styles.timelineLabelDone]}>
          {item.label}
        </Text>
        <Text style={styles.timelineDate}>{item.dateLabel}</Text>
      </View>
    </View>
  );

  const itemCard = (
    <View style={styles.itemCard}>
      <View style={styles.itemCardTop}>
        <View style={styles.itemCardBody}>
          <Text style={styles.itemTitle}>{ITEM.title}</Text>
          <Text style={styles.itemSubtitle}>{ITEM.subtitle}</Text>
        </View>
        <View style={[styles.statusPill, submitted && styles.statusPillActive]}>
          <Text style={[styles.statusPillText, submitted && styles.statusPillTextActive]}>
            {submitted ? "Submitted" : "Not submitted"}
          </Text>
        </View>
      </View>
      <Text style={styles.itemCondition}>{ITEM.conditionLabel}</Text>
      <View style={styles.itemFactsRow}>
        <View style={styles.itemFact}>
          <Text style={styles.itemFactLabel}>Est. authentication fee</Text>
          <View style={styles.krwRow}>
            <Text style={styles.krwSymbol}>KRW </Text>
            <Text style={styles.krwDigits}>{formatKrwDigits(ITEM.estimatedFeeKrw)}</Text>
          </View>
        </View>
        <View style={styles.itemFact}>
          <Text style={styles.itemFactLabel}>Turnaround</Text>
          <Text style={styles.itemFactValue}>{ITEM.turnaroundLabel}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>REPICK AUTHENTICATION</Text>
        <Text style={styles.title} accessibilityRole="header">
          Submit for Authentication
        </Text>
        <Text style={styles.lede}>
          Capture five reference photos and confirm the declaration below. A partner lab reviews
          submissions before this item can go live as an authenticated listing.
        </Text>
      </View>

      {submitted ? (
        <FlatList
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          data={REVIEW_STEPS}
          keyExtractor={(step) => step.id}
          renderItem={renderReviewItem}
          ListHeaderComponent={
            <View>
              {itemCard}
              <View style={styles.submissionMeta}>
                <Text style={styles.submissionMetaLabel}>Submission</Text>
                <Text style={styles.submissionMetaValue}>
                  {SUBMISSION.id} · sent {SUBMISSION.submittedDateLabel}
                </Text>
              </View>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                Review status
              </Text>
            </View>
          }
          ListFooterComponent={
            <Text style={styles.footerNote}>
              You&apos;ll be notified at each step. Photos and the declaration are locked once a
              submission is under review.
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          ref={listRef}
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          data={BUILD_ITEMS}
          keyExtractor={(item) => item.id}
          renderItem={renderBuildItem}
          onScrollToIndexFailed={(info) => {
            listRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
          ListHeaderComponent={
            <View>
              {itemCard}
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle} accessibilityRole="header">
                  Required photos
                </Text>
                <Text style={styles.sectionCount}>
                  {capturedCount} of {totalSlots}
                </Text>
              </View>
            </View>
          }
          ListFooterComponent={
            <Text style={styles.footerNote}>
              Tapping a photo row simulates capturing it for this preview — no camera opens.
              {allCaptured ? "" : " All five are required before this submission can be sent."}
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.band} accessibilityLiveRegion="polite">
        {submitted ? (
          <View style={styles.bandDone}>
            <Text style={styles.bandDoneTitle} accessibilityRole="alert">
              Submitted — {SUBMISSION.id} received
            </Text>
            <Text style={styles.bandDoneHint}>
              Sent to the authentication lab on {SUBMISSION.submittedDateLabel}.{" "}
              {ITEM.turnaroundLabel}.
            </Text>
          </View>
        ) : blocking ? (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={`${blocking.message}. Tap to review.`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.bandBlocked, pressed && styles.bandPressed]}
          >
            <Text style={styles.bandBlockedTitle} accessibilityRole="alert">
              {blocking.message}
            </Text>
            <Text style={styles.bandBlockedHint}>Tap to review</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={`Submit ${ITEM.title} for authentication`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.bandReady, pressed && styles.bandPressed]}
          >
            <Text style={styles.bandReadyTitle}>Submit for authentication</Text>
            <Text style={styles.bandReadyHint}>All required photos and declaration complete</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ItemAuthenticationScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },

  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  kicker: { fontSize: 11, letterSpacing: 1.6, fontWeight: "700", color: tokens.color.faint },
  title: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  lede: { marginTop: tokens.space(1), fontSize: 13, lineHeight: 19, color: tokens.color.muted },

  body: { flex: 1 },
  bodyContent: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(6) },

  itemCard: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  itemCardTop: { flexDirection: "row", alignItems: "flex-start", gap: tokens.space(3) },
  itemCardBody: { flex: 1, gap: 2 },
  itemTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.ink },
  itemSubtitle: { fontSize: 12, color: tokens.color.muted },
  itemCondition: { fontSize: 12, lineHeight: 17, color: tokens.color.muted },

  statusPill: {
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  statusPillActive: { borderColor: tokens.color.accent },
  statusPillText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3, color: tokens.color.muted },
  statusPillTextActive: { color: tokens.color.accent },

  itemFactsRow: { flexDirection: "row", gap: tokens.space(5), marginTop: tokens.space(1) },
  itemFact: { gap: 2 },
  itemFactLabel: { fontSize: 11, fontWeight: "700", color: tokens.color.faint },
  itemFactValue: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  krwRow: { flexDirection: "row", alignItems: "baseline" },
  krwSymbol: { fontSize: 12, fontWeight: "700", color: tokens.color.ink2 },
  krwDigits: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },

  sectionHeaderRow: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.ink },
  sectionCount: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },

  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    minHeight: 44,
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  slotRowHighlighted: {
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
  },
  rowPressed: { opacity: 0.8 },
  slotBody: { flex: 1, gap: 1 },
  slotLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },
  slotHint: { fontSize: 12, lineHeight: 17, color: tokens.color.muted },
  slotStatus: { marginTop: 2, fontSize: 11, fontWeight: "700", color: tokens.color.faint },
  slotStatusDone: { color: tokens.color.accent },

  cameraGlyph: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraGlyphFilled: {
    borderStyle: "solid",
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  cameraLens: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: tokens.color.faint,
  },
  cameraLensFilled: { borderColor: tokens.color.onAccent },
  cameraCheck: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraCheckGlyph: { fontSize: 10, fontWeight: "700", color: tokens.color.onInk },

  declarationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    minHeight: 44,
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  checkbox: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  checkboxGlyph: { fontSize: 12, fontWeight: "700", color: tokens.color.onAccent },
  declarationText: { flex: 1, fontSize: 13, lineHeight: 19, color: tokens.color.ink2 },

  submissionMeta: {
    marginTop: tokens.space(4),
    gap: 2,
  },
  submissionMetaLabel: { fontSize: 11, fontWeight: "700", color: tokens.color.faint },
  submissionMetaValue: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },

  timelineRow: { flexDirection: "row", gap: tokens.space(3), marginTop: tokens.space(3) },
  timelineTrack: { alignItems: "center", width: 16 },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  timelineDotDone: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  timelineLine: {
    width: 1.5,
    flex: 1,
    minHeight: tokens.space(6),
    backgroundColor: tokens.color.border,
    marginTop: 2,
  },
  timelineLineDone: { backgroundColor: tokens.color.accent },
  timelineBody: { flex: 1, paddingBottom: tokens.space(1), gap: 1 },
  timelineLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.faint },
  timelineLabelDone: { color: tokens.color.ink2 },
  timelineDate: { fontSize: 11, color: tokens.color.faint },

  footerNote: {
    marginTop: tokens.space(4),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },

  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  bandPressed: { opacity: 0.85 },
  bandBlocked: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  bandBlockedTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  bandBlockedHint: { fontSize: 12, color: tokens.color.muted },
  bandReady: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  bandReadyTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.onAccent },
  bandReadyHint: { fontSize: 12, color: tokens.color.onAccent },
  bandDone: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  bandDoneTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.accent },
  bandDoneHint: { fontSize: 12, color: tokens.color.muted },
});
