// native/src/review/WriteReviewScreen.tsx — auto-native-r8 winner (promoted).
//
// Post-transaction review composer: a single continuous form, not a wizard, not a chronological
// thread, not a checklist-with-band. Macro shape is (a) a read-only summary of what/who is being
// reviewed, (b) a genuinely interactive 1-5 star selector, (c) a multi-select quick-tag chip row,
// (d) a multiline free-text field with an always-visible label, (e) a gated submit control. Only
// the star rating is required; tags and text are optional. Distinct from every shipped screen and
// from every macro shape already attempted in past rounds (no wizard steps, no timeline, no
// accordion, no feed, no ledger).
//
// Bottom-band lesson applied deliberately in its non-reuse form: this form has exactly one hard
// requirement, so a full "blocked/ready/done state machine + jump-to-field" band would be
// over-engineering for a one-field gate. Instead the submit control disables until a rating is
// picked and a plain, visible hint (not a silently greyed button) says why — the loading -> success
// transition still gets its own explicit state and an accessibilityRole="alert" announcement,
// because that is what the Forms catalog asks for on submit feedback, independent of the band
// pattern.
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { tokens } from "../tokens";
import {
  FEEDBACK_MAX_LENGTH,
  QUICK_TAGS,
  RATING_LABELS,
  REVIEW_SUBJECT,
  STAR_POLYGON_POINTS,
  SUBMIT_DELAY_MS,
  type QuickTag,
} from "./data";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const STAR_VALUES = [1, 2, 3, 4, 5] as const;

type SubmitStatus = "idle" | "submitting" | "submitted";

function StarIcon({ active }: { active: boolean }) {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24">
      <Polygon
        points={STAR_POLYGON_POINTS}
        fill={active ? tokens.color.accent : "none"}
        stroke={active ? tokens.color.accent : tokens.color.border}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WriteReviewScreen() {
  const [rating, setRating] = useState(0);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const submitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimer.current) clearTimeout(submitTimer.current);
    };
  }, []);

  const rateStar = (value: number) => {
    if (status !== "idle") return;
    setRating((prev) => (prev === value ? prev : value));
  };

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id],
    );
  };

  const canSubmit = rating > 0 && status === "idle";

  const handleSubmit = () => {
    if (!canSubmit) return;
    setStatus("submitting");
    submitTimer.current = setTimeout(() => setStatus("submitted"), SUBMIT_DELAY_MS);
  };

  const renderTag: ListRenderItem<QuickTag> = ({ item }) => {
    const selected = selectedTagIds.includes(item.id);
    return (
      <Pressable
        onPress={() => toggleTag(item.id)}
        disabled={status !== "idle"}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled: status !== "idle" }}
        accessibilityLabel={`${item.label}, quick tag${selected ? ", selected" : ""}`}
        accessibilityHint="Press again to clear this tag"
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [
          styles.chip,
          selected && styles.chipSelected,
          pressed && styles.chipPressed,
        ]}
      >
        <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{item.label}</Text>
      </Pressable>
    );
  };

  const ratingHelperText =
    rating === 0
      ? "Tap a star to rate this order"
      : `${rating} out of 5 — ${RATING_LABELS[rating]}`;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.header}>
          <Text style={styles.kicker}>REPICK REVIEWS</Text>
          <Text style={styles.title} accessibilityRole="header">
            Write a review
          </Text>
          <Text style={styles.lede}>
            Your feedback about this order helps other members trade with confidence.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading} accessibilityRole="header">
            Reviewing this order
          </Text>
          <View style={styles.summaryTopRow}>
            <View style={styles.initialsBadge}>
              <Text style={styles.initialsText}>{REVIEW_SUBJECT.initials}</Text>
            </View>
            <View style={styles.summaryItemText}>
              <Text style={styles.itemTitle}>{REVIEW_SUBJECT.itemTitle}</Text>
              <Text style={styles.itemDetail}>{REVIEW_SUBJECT.itemDetail}</Text>
            </View>
          </View>
          <View style={styles.summaryMetaRow}>
            <Text style={styles.summaryMetaText}>
              {REVIEW_SUBJECT.counterpartyName} · {REVIEW_SUBJECT.counterpartyRole}
            </Text>
            <Text style={styles.summaryMetaText}>Completed {REVIEW_SUBJECT.completedOn}</Text>
          </View>
          <Text style={styles.summaryOrderId}>Order {REVIEW_SUBJECT.orderId}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>Your rating</Text>
            <Text style={styles.requiredMark}>Required</Text>
          </View>
          <View style={styles.starRow}>
            {STAR_VALUES.map((value) => (
              <Pressable
                key={value}
                onPress={() => rateStar(value)}
                disabled={status !== "idle"}
                accessibilityRole="button"
                accessibilityState={{ selected: rating >= value, disabled: status !== "idle" }}
                accessibilityLabel={`Rate ${value} out of 5 stars`}
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [styles.starButton, pressed && styles.starButtonPressed]}
              >
                <StarIcon active={rating >= value} />
              </Pressable>
            ))}
          </View>
          <Text style={styles.ratingHelper}>{ratingHelperText}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>Quick tags</Text>
            <Text style={styles.optionalMark}>Optional</Text>
          </View>
          <Text style={styles.sectionHint}>Select any that apply.</Text>
          <FlatList
            data={QUICK_TAGS}
            keyExtractor={(tag) => tag.id}
            scrollEnabled={false}
            renderItem={renderTag}
            contentContainerStyle={styles.chipWrap}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>Your written feedback</Text>
            <Text style={styles.optionalMark}>Optional</Text>
          </View>
          <TextInput
            style={styles.feedbackInput}
            value={feedback}
            onChangeText={setFeedback}
            editable={status === "idle"}
            multiline
            maxLength={FEEDBACK_MAX_LENGTH}
            placeholder="What stood out about this transaction?"
            placeholderTextColor={tokens.color.faint}
            accessibilityLabel="Your written feedback, optional"
            textAlignVertical="top"
          />
          <Text style={styles.feedbackCounter}>
            {feedback.length}/{FEEDBACK_MAX_LENGTH}
          </Text>
        </View>

        <View style={styles.submitSection}>
          {status === "submitted" ? (
            <View style={styles.successBox} accessibilityRole="alert" accessibilityLiveRegion="polite">
              <Text style={styles.successTitle}>Review submitted</Text>
              <Text style={styles.successBody}>
                Thanks — your {rating} out of 5 rating{selectedTagIds.length > 0 ? " and tags" : ""}
                {feedback.length > 0 ? " and written feedback" : ""} are now visible on this order.
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.submitHint}>
                {rating === 0
                  ? "Choose a star rating above before you can submit."
                  : "You can still change your rating, tags, or feedback until you submit."}
              </Text>
              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit}
                accessibilityRole="button"
                accessibilityState={{ disabled: !canSubmit, busy: status === "submitting" }}
                accessibilityLabel={
                  rating === 0
                    ? "Submit review, disabled until you choose a star rating"
                    : status === "submitting"
                      ? "Submitting review"
                      : "Submit review"
                }
                style={({ pressed }) => [
                  styles.submitButton,
                  !canSubmit && styles.submitButtonDisabled,
                  pressed && canSubmit && styles.submitButtonPressed,
                ]}
              >
                <Text
                  style={[styles.submitButtonText, !canSubmit && styles.submitButtonTextDisabled]}
                >
                  {status === "submitting" ? "Submitting…" : "Submit review"}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    paddingBottom: tokens.space(8),
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

  summaryCard: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  summaryHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.2,
  },
  summaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  initialsBadge: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  summaryItemText: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemDetail: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  summaryMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  summaryMetaText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  summaryOrderId: {
    fontSize: 11,
    color: tokens.color.faint,
  },

  section: {
    marginTop: tokens.space(5),
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
  optionalMark: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.faint,
    letterSpacing: 0.3,
  },
  sectionHint: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },

  starRow: {
    flexDirection: "row",
    gap: tokens.space(2),
    marginTop: tokens.space(3),
  },
  starButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
  },
  starButtonPressed: {
    opacity: 0.7,
  },
  ratingHelper: {
    marginTop: tokens.space(1),
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
    marginTop: tokens.space(2),
  },
  chip: {
    minHeight: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  chipPressed: {
    opacity: 0.75,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  chipLabelSelected: {
    color: tokens.color.onAccent,
  },

  feedbackInput: {
    marginTop: tokens.space(2),
    minHeight: 120,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink,
  },
  feedbackCounter: {
    marginTop: tokens.space(1),
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "right",
  },

  submitSection: {
    marginTop: tokens.space(6),
    gap: tokens.space(2),
  },
  submitHint: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  submitButton: {
    minHeight: 52,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1.5,
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

  successBox: {
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(1),
  },
  successTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  successBody: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink,
  },
});
