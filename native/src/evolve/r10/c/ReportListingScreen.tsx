// native/src/evolve/r10/c/ReportListingScreen.tsx — auto-native-r10 candidate c.
//
// Report Listing / User: a trust & safety flow, untouched by any prior round. Opened from a
// listing detail page, so the report always carries both identities at once (the listing AND its
// seller) in a single read-only target card — Repick's actual reason list mixes listing-quality
// complaints ("Suspected counterfeit", "Inappropriate photos") with seller-conduct complaints
// ("Attempted scam", "Seller went silent"), so one screen covers both without a listing/user
// toggle (which would read as a tab switch, already tried and rejected in r8).
//
// Macro shape: a single non-collapsing scroll form — target summary card, then a vertical
// single-select reason list (not the horizontal reason-chip row disputes/r7 used), then a
// reason==="other"-gated free-text field, then a static "what happens next" notice, closed by a
// fixed bottom band. Distinct from every recent macro: no accordion (r6), no FlatList-timeline
// (r7), no multi-step wizard (r8), no header+tabs+dual-body (r8, rejected), no chrome-0 grid (r9).
//
// This IS a genuine terminal action (submitting a report), so GENERATION.md §3/§4 apply verbatim:
// the fixed band is a state machine — blocked names its blocker in a sentence and, pressed,
// scrolls/focuses the exact unfinished field; ready submits; submitted is a static confirmation.
// Blocked and submitted messages both carry accessibilityRole="alert" inside the band's single
// accessibilityLiveRegion="polite" container (ready does not — matches the validated r5/r6c/r7/r8
// convention of only alerting on the messages that actually change reachability). No confirm
// dialog before submit (a report isn't a destructive delete, per this round's brief), but both the
// band's ready hint and the submitted confirmation say in words that submitting can't be undone —
// ux-guidelines "에러 복구"/"성공 피드백" without inventing a second interruption.
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type LayoutChangeEvent,
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { tokens } from "../../../tokens";
import {
  OTHER_DETAILS_MAX_LENGTH,
  OTHER_DETAILS_MIN_LENGTH,
  REPORT_REASONS,
  REPORT_REFERENCE_ID,
  REPORT_TARGET,
  REVIEW_ETA_LABEL,
  SUBMIT_DELAY_MS,
  type ReportReasonId,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const SCROLL_OFFSET = 12;

type SubmitStatus = "idle" | "submitting" | "submitted";
type BlockTarget = "reason" | "other";
type Blocking = { target: BlockTarget; message: string } | null;

function ThumbnailGlyph() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Rect x={2.5} y={4.5} width={19} height={15} rx={2} stroke={tokens.color.faint} strokeWidth={1.5} />
      <Circle cx={8} cy={9.5} r={1.6} stroke={tokens.color.faint} strokeWidth={1.5} />
      <Path
        d="M4 17L9 12L13 15.5L16 12.5L20 16.5"
        stroke={tokens.color.faint}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PrivacyGlyph() {
  return (
    <Svg width={18} height={18} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1.5L13.5 3.4V7.2C13.5 10.6 11.2 13.4 8 14.5C4.8 13.4 2.5 10.6 2.5 7.2V3.4L8 1.5Z"
        stroke={tokens.color.ink2}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Path d="M5.7 8L7.3 9.6L10.4 6.2" stroke={tokens.color.ink2} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function RadioGlyph({ selected }: { selected: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Circle
        cx={10}
        cy={10}
        r={8.5}
        stroke={selected ? tokens.color.accent : tokens.color.border}
        strokeWidth={1.5}
        fill="none"
      />
      {selected ? <Circle cx={10} cy={10} r={4.5} fill={tokens.color.accent} /> : null}
    </Svg>
  );
}

export function ReportListingScreen() {
  const [reason, setReason] = useState<ReportReasonId | null>(null);
  const [otherDetails, setOtherDetails] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [otherFocused, setOtherFocused] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const otherInputRef = useRef<TextInput>(null);
  const reasonSectionY = useRef(0);
  const otherSectionY = useRef(0);
  const submitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimer.current) clearTimeout(submitTimer.current);
    };
  }, []);

  const otherTrimmedLength = otherDetails.trim().length;
  const needsOtherDetails = reason === "other";

  const blocking: Blocking = (() => {
    if (!reason) {
      return { target: "reason", message: "Choose a reason before you can submit this report." };
    }
    if (needsOtherDetails && otherTrimmedLength < OTHER_DETAILS_MIN_LENGTH) {
      const left = OTHER_DETAILS_MIN_LENGTH - otherTrimmedLength;
      return {
        target: "other",
        message: `Add ${left} more character${left === 1 ? "" : "s"} describing the issue before you can submit.`,
      };
    }
    return null;
  })();

  const canSubmit = !blocking && status === "idle";

  const onReasonSectionLayout = (e: LayoutChangeEvent) => {
    reasonSectionY.current = e.nativeEvent.layout.y;
  };
  const onOtherSectionLayout = (e: LayoutChangeEvent) => {
    otherSectionY.current = e.nativeEvent.layout.y;
  };

  const selectReason = (id: ReportReasonId) => {
    if (status !== "idle") return;
    setReason(id);
  };

  const jumpTo = (target: BlockTarget) => {
    const y = target === "reason" ? reasonSectionY.current : otherSectionY.current;
    scrollRef.current?.scrollTo({ y: Math.max(y - SCROLL_OFFSET, 0), animated: true });
    if (target === "other") {
      otherInputRef.current?.focus();
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setStatus("submitting");
    submitTimer.current = setTimeout(() => setStatus("submitted"), SUBMIT_DELAY_MS);
  };

  const handleBandPress = () => {
    if (status !== "idle") return;
    if (blocking) {
      jumpTo(blocking.target);
      return;
    }
    handleSubmit();
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>REPICK TRUST & SAFETY</Text>
          <Text style={styles.title} accessibilityRole="header">
            Report this listing
          </Text>
          <Text style={styles.lede}>
            Tell us what's wrong. Reports help keep Repick safe for every trader.
          </Text>
        </View>

        <View style={styles.targetCard}>
          <View style={styles.targetTopRow}>
            <View style={styles.thumbnail}>
              <ThumbnailGlyph />
            </View>
            <View style={styles.targetTextCol}>
              <Text style={styles.targetTitle} numberOfLines={2}>
                {REPORT_TARGET.listingTitle}
              </Text>
              <Text style={styles.targetPrice}>{REPORT_TARGET.listingPriceLabel}</Text>
              <Text style={styles.targetMeta}>
                {REPORT_TARGET.listingCategoryLabel} · {REPORT_TARGET.listingPostedLabel}
              </Text>
            </View>
          </View>
          <View style={styles.sellerDivider} />
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {REPORT_TARGET.sellerName.charAt(0)}
              </Text>
            </View>
            <View style={styles.sellerTextCol}>
              <Text style={styles.sellerName}>
                {REPORT_TARGET.sellerName}{" "}
                <Text style={styles.sellerHandle}>{REPORT_TARGET.sellerHandle}</Text>
              </Text>
              <Text style={styles.sellerRating}>{REPORT_TARGET.sellerRatingLabel}</Text>
            </View>
          </View>
        </View>

        <View
          style={[styles.section, blocking?.target === "reason" && styles.sectionHighlighted]}
          onLayout={onReasonSectionLayout}
        >
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>What's the issue?</Text>
            <Text style={styles.requiredMark}>Required</Text>
          </View>
          <View
            style={styles.radioGroup}
            accessibilityRole="radiogroup"
            accessibilityLabel="Reason for this report"
          >
            {REPORT_REASONS.map((option) => {
              const selected = reason === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => selectReason(option.id)}
                  disabled={status !== "idle"}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, checked: selected, disabled: status !== "idle" }}
                  accessibilityLabel={`${option.label}. ${option.helper}`}
                  hitSlop={HIT_SLOP}
                  style={({ pressed }) => [
                    styles.radioRow,
                    selected && styles.radioRowSelected,
                    pressed && styles.radioRowPressed,
                  ]}
                >
                  <RadioGlyph selected={selected} />
                  <View style={styles.radioTextCol}>
                    <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>
                      {option.label}
                    </Text>
                    <Text style={styles.radioHelper}>{option.helper}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {needsOtherDetails ? (
          <View
            style={[styles.section, blocking?.target === "other" && styles.sectionHighlighted]}
            onLayout={onOtherSectionLayout}
          >
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Describe the issue</Text>
              <Text style={styles.requiredMark}>Required</Text>
            </View>
            <TextInput
              ref={otherInputRef}
              value={otherDetails}
              onChangeText={setOtherDetails}
              onFocus={() => setOtherFocused(true)}
              onBlur={() => setOtherFocused(false)}
              editable={status === "idle"}
              multiline
              maxLength={OTHER_DETAILS_MAX_LENGTH}
              placeholder="What happened? Include any details that would help our team review this."
              placeholderTextColor={tokens.color.faint}
              accessibilityLabel="Describe the issue, required"
              accessibilityHint={`Minimum ${OTHER_DETAILS_MIN_LENGTH} characters`}
              textAlignVertical="top"
              style={[styles.textInput, otherFocused && styles.textInputFocused]}
            />
            <Text style={styles.charCount}>
              {otherTrimmedLength} / {OTHER_DETAILS_MIN_LENGTH} minimum · {otherDetails.length}/
              {OTHER_DETAILS_MAX_LENGTH}
            </Text>
          </View>
        ) : null}

        <View style={styles.noticeCard}>
          <PrivacyGlyph />
          <View style={styles.noticeTextCol}>
            <Text style={styles.noticeLine}>
              Your identity stays private — the seller won't see who filed this report.
            </Text>
            <Text style={styles.noticeLine}>
              Repick's trust & safety team reviews reports {REVIEW_ETA_LABEL}.
            </Text>
            <Text style={styles.noticeLine}>
              Once submitted, a report can't be edited or withdrawn.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.band} accessibilityLiveRegion="polite">
        {status === "submitted" ? (
          <View style={styles.bandDone}>
            <Text style={styles.bandDoneTitle} accessibilityRole="alert">
              Report submitted — {REPORT_REFERENCE_ID}
            </Text>
            <Text style={styles.bandDoneHint}>
              This can't be undone. Our team will review it {REVIEW_ETA_LABEL}.
            </Text>
          </View>
        ) : blocking ? (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={`${blocking.message} Tap to review.`}
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
            disabled={status === "submitting"}
            accessibilityRole="button"
            accessibilityState={{ disabled: status === "submitting", busy: status === "submitting" }}
            accessibilityLabel={status === "submitting" ? "Submitting report" : "Submit report"}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.bandReady,
              status === "submitting" && styles.bandSubmitting,
              pressed && status === "idle" && styles.bandPressed,
            ]}
          >
            <Text style={styles.bandReadyTitle}>
              {status === "submitting" ? "Submitting…" : "Submit report"}
            </Text>
            <Text style={styles.bandReadyHint}>
              {status === "submitting" ? "Please wait" : "This can't be undone once sent"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default ReportListingScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
  },

  header: {
    paddingBottom: tokens.space(2),
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  lede: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  targetCard: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  targetTopRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  targetTextCol: {
    flex: 1,
    gap: 2,
  },
  targetTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  targetPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  targetMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  sellerDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginVertical: tokens.space(3),
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  sellerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  sellerTextCol: {
    flex: 1,
    gap: 2,
  },
  sellerName: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sellerHandle: {
    fontSize: 12,
    fontWeight: "500",
    color: tokens.color.faint,
  },
  sellerRating: {
    fontSize: 12,
    color: tokens.color.muted,
  },

  section: {
    marginTop: tokens.space(5),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.bg,
    padding: tokens.space(2),
  },
  sectionHighlighted: {
    borderColor: tokens.color.accent,
    borderWidth: 1.5,
    padding: tokens.space(2) - 0.5,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  requiredMark: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.accent,
    letterSpacing: 0.3,
  },

  radioGroup: {
    marginTop: tokens.space(2),
    gap: tokens.space(2),
  },
  radioRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
  },
  radioRowSelected: {
    borderColor: tokens.color.accent,
    borderWidth: 1.5,
  },
  radioRowPressed: {
    opacity: 0.8,
  },
  radioTextCol: {
    flex: 1,
    gap: 1,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  radioLabelSelected: {
    color: tokens.color.accent,
  },
  radioHelper: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.color.muted,
  },

  textInput: {
    marginTop: tokens.space(2),
    minHeight: 100,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink,
  },
  textInputFocused: {
    borderColor: tokens.color.accent,
    borderWidth: 1.5,
  },
  charCount: {
    marginTop: tokens.space(1),
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "right",
  },

  noticeCard: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  noticeTextCol: {
    flex: 1,
    gap: tokens.space(1),
  },
  noticeLine: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
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
  bandSubmitting: {
    opacity: 0.7,
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
