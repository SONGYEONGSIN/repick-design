// native/src/disputes/DisputeCenterScreen.tsx — auto-native-r7 candidate a.
//
// Dispute & Return Center: a buyer's single screen for tracking open/past disputes on completed
// orders AND building a new return/dispute request against the one order still inside its return
// window. Content shape (not mechanics) is deliberately unlike this app's other multi-step screen
// (evolve/r6/c SellerVerificationScreen, an identity-document checklist) and unlike its other
// terminal-action wizard (listing/ListingCreateScreen): here the "steps" are heterogeneous form
// fields (single-select reason, free-text description, an add/remove evidence-photo array,
// single-select resolution) living inside ONE accordion card, and read-only history cards render
// a vertical timeline rather than a checklist.
//
// Fixed-chrome decision: opening a dispute is a genuine terminal/blocking action (per
// native-deltas-provisional L2, auto-native-r3/r5/r6c), so this screen keeps a single fixed
// bottom band that behaves as a state machine — while a required field is missing it names the
// exact blocker in a sentence and, on press, expands + scrolls to the draft card (the unresolved
// item); once every field is filled the same control becomes the real submit action; after
// submit it becomes a static, non-pressable confirmation. The confirmation and blocking title
// are both promoted to accessibilityRole="alert" inside an accessibilityLiveRegion="polite" band
// container (the r5/r6c refinement) so the state transition reaches screen readers, not just
// sighted users. This is NOT a browse/settings screen (auto-native-r2's zero-fixed-chrome
// pattern), so that alternative was not appropriate here.
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { tokens } from "../tokens";
import {
  ELIGIBLE_ORDER,
  MAX_PHOTOS,
  MIN_DESCRIPTION_LENGTH,
  MIN_PHOTOS,
  NEW_CASE_ID,
  NEW_CASE_LABEL,
  PRIOR_DISPUTES,
  REASON_OPTIONS,
  RESOLUTION_OPTIONS,
  STATUS_TEXT,
  SUBMITTED_DATE_LABEL,
  type DisputeRecord,
  type DisputeStatus,
  type ReasonId,
  type ResolutionId,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type ExpandedDispute = DisputeRecord & {
  resolutionLabel?: string;
  descriptionSnippet?: string;
  photoCount?: number;
};

type CardItem =
  | { id: "draft"; kind: "draft" }
  | { id: string; kind: "record"; record: ExpandedDispute };

type BlockTarget = "reason" | "description" | "photos" | "resolution";
type Blocking = { target: BlockTarget; message: string } | null;

function StatusPill({ status }: { status: DisputeStatus }) {
  return (
    <View
      style={[
        styles.statusPill,
        status === "in_review" && styles.statusPillActive,
        status === "submitted" && styles.statusPillActive,
        status === "resolved" && styles.statusPillNeutral,
        status === "draft" && styles.statusPillDraft,
      ]}
    >
      <Text
        style={[
          styles.statusPillText,
          (status === "in_review" || status === "submitted") &&
            styles.statusPillTextActive,
        ]}
      >
        {STATUS_TEXT[status]}
      </Text>
    </View>
  );
}

function PlusGlyph() {
  return (
    <View style={styles.plusGlyph}>
      <View style={styles.plusBarH} />
      <View style={styles.plusBarV} />
    </View>
  );
}

export function DisputeCenterScreen() {
  const [expandedId, setExpandedId] = useState<string | null>("draft");
  const [reason, setReason] = useState<ReasonId | null>(null);
  const [description, setDescription] = useState("");
  const [resolution, setResolution] = useState<ResolutionId | null>(null);
  const [photos, setPhotos] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<ExpandedDispute | null>(
    null,
  );
  const listRef = useRef<FlatList<CardItem>>(null);

  const descriptionTrimmed = description.trim();

  const blocking: Blocking = useMemo(() => {
    if (!reason) {
      return { target: "reason", message: "Choose a reason for this return to continue" };
    }
    if (descriptionTrimmed.length < MIN_DESCRIPTION_LENGTH) {
      const left = MIN_DESCRIPTION_LENGTH - descriptionTrimmed.length;
      return {
        target: "description",
        message: `Add ${left} more character${left === 1 ? "" : "s"} describing what happened`,
      };
    }
    if (photos.length < MIN_PHOTOS) {
      return {
        target: "photos",
        message: `Attach at least ${MIN_PHOTOS} evidence photos (${photos.length} of ${MIN_PHOTOS} added)`,
      };
    }
    if (!resolution) {
      return { target: "resolution", message: "Choose the resolution you're requesting" };
    }
    return null;
  }, [reason, descriptionTrimmed, photos, resolution]);

  const highlight = (field: BlockTarget) =>
    !submitted && expandedId === "draft" && blocking?.target === field;

  const listData = useMemo<CardItem[]>(() => {
    const items: CardItem[] = [];
    if (submitted && submittedRecord) {
      items.push({ id: NEW_CASE_ID, kind: "record", record: submittedRecord });
    } else {
      items.push({ id: "draft", kind: "draft" });
    }
    for (const record of PRIOR_DISPUTES) {
      items.push({ id: record.id, kind: "record", record });
    }
    return items;
  }, [submitted, submittedRecord]);

  const inReviewCount = PRIOR_DISPUTES.filter((d) => d.status === "in_review").length;
  const resolvedCount = PRIOR_DISPUTES.filter((d) => d.status === "resolved").length;

  const jumpToDraft = () => {
    setExpandedId("draft");
    listRef.current?.scrollToIndex({ index: 0, viewPosition: 0, animated: true });
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const addPhoto = () => {
    setPhotos((prev) => (prev.length >= MAX_PHOTOS ? prev : [...prev, prev.length + 1]));
  };

  const removePhoto = (n: number) => {
    setPhotos((prev) => prev.filter((x) => x !== n).map((_, i) => i + 1));
  };

  const handleBandPress = () => {
    if (blocking) {
      jumpToDraft();
      return;
    }
    const reasonLabel = REASON_OPTIONS.find((r) => r.id === reason)?.label ?? "";
    const resolutionLabel =
      RESOLUTION_OPTIONS.find((r) => r.id === resolution)?.label ?? "";
    const record: ExpandedDispute = {
      id: NEW_CASE_ID,
      caseLabel: NEW_CASE_LABEL,
      orderTitle: ELIGIBLE_ORDER.title,
      orderMeta: ELIGIBLE_ORDER.meta,
      status: "submitted",
      reasonLabel,
      openedLabel: SUBMITTED_DATE_LABEL,
      resolutionLabel,
      descriptionSnippet: descriptionTrimmed,
      photoCount: photos.length,
      timeline: [
        { id: "n1", label: "Request opened", dateLabel: SUBMITTED_DATE_LABEL, done: true },
        {
          id: "n2",
          label: `Evidence photos submitted (${photos.length})`,
          dateLabel: SUBMITTED_DATE_LABEL,
          done: true,
        },
        { id: "n3", label: "Awaiting seller response", dateLabel: "Expected by Aug 19, 2026", done: false },
      ],
    };
    setSubmittedRecord(record);
    setSubmitted(true);
    setExpandedId(NEW_CASE_ID);
  };

  const renderRecordBody = (record: ExpandedDispute) => (
    <View style={styles.cardBody}>
      <View style={styles.recordMetaBlock}>
        <Text style={styles.recordMetaLabel}>Order</Text>
        <Text style={styles.recordMetaValue}>{record.orderTitle}</Text>
        <Text style={styles.recordMetaSub}>{record.orderMeta}</Text>
      </View>
      <View style={styles.recordFactsRow}>
        <View style={styles.recordFact}>
          <Text style={styles.recordFactLabel}>Reason</Text>
          <Text style={styles.recordFactValue}>{record.reasonLabel}</Text>
        </View>
        {record.resolutionLabel ? (
          <View style={styles.recordFact}>
            <Text style={styles.recordFactLabel}>Requested</Text>
            <Text style={styles.recordFactValue}>{record.resolutionLabel}</Text>
          </View>
        ) : null}
      </View>
      {record.descriptionSnippet ? (
        <View style={styles.recordNote}>
          <Text style={styles.recordNoteLabel}>Your description</Text>
          <Text style={styles.recordNoteText}>{record.descriptionSnippet}</Text>
          {typeof record.photoCount === "number" ? (
            <Text style={styles.recordNoteMeta}>
              {record.photoCount} evidence photo{record.photoCount === 1 ? "" : "s"} attached
            </Text>
          ) : null}
        </View>
      ) : null}
      {record.refundLabel ? (
        <View style={styles.refundNote}>
          <Text style={styles.refundNoteText}>
            {record.refundLabel} on {record.resolvedLabel}
          </Text>
        </View>
      ) : null}
      <View style={styles.timeline}>
        {record.timeline.map((event, i) => (
          <View key={event.id} style={styles.timelineRow}>
            <View style={styles.timelineTrack}>
              <View style={[styles.timelineDot, event.done && styles.timelineDotDone]} />
              {i < record.timeline.length - 1 ? (
                <View
                  style={[styles.timelineLine, event.done && styles.timelineLineDone]}
                />
              ) : null}
            </View>
            <View style={styles.timelineBody}>
              <Text
                style={[styles.timelineLabel, event.done && styles.timelineLabelDone]}
              >
                {event.label}
              </Text>
              <Text style={styles.timelineDate}>{event.dateLabel}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderDraftBody = () => (
    <View style={styles.cardBody}>
      <View style={styles.recordMetaBlock}>
        <Text style={styles.recordMetaLabel}>Order</Text>
        <Text style={styles.recordMetaValue}>{ELIGIBLE_ORDER.title}</Text>
        <Text style={styles.recordMetaSub}>{ELIGIBLE_ORDER.meta}</Text>
        <Text style={styles.windowNote}>{ELIGIBLE_ORDER.windowLabel}</Text>
      </View>

      <View style={[styles.field, highlight("reason") && styles.fieldHighlighted]}>
        <Text style={styles.fieldLabel}>Reason for return</Text>
        <View
          style={styles.chipGroup}
          accessibilityRole="radiogroup"
          accessibilityLabel="Reason for return"
        >
          {REASON_OPTIONS.map((option) => {
            const selected = reason === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setReason(option.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected, checked: selected }}
                accessibilityLabel={option.label}
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.chip,
                  selected && styles.chipOn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        style={[styles.field, highlight("description") && styles.fieldHighlighted]}
      >
        <Text style={styles.fieldLabel}>Describe what happened</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What happened, and when did you notice it?"
          placeholderTextColor={tokens.color.faint}
          multiline
          numberOfLines={4}
          maxLength={300}
          accessibilityLabel="Describe what happened"
          accessibilityHint={`Minimum ${MIN_DESCRIPTION_LENGTH} characters`}
          style={styles.textInput}
        />
        <Text style={styles.charCount}>
          {descriptionTrimmed.length} / {MIN_DESCRIPTION_LENGTH} minimum
        </Text>
      </View>

      <View style={[styles.field, highlight("photos") && styles.fieldHighlighted]}>
        <Text style={styles.fieldLabel}>Evidence photos</Text>
        <View style={styles.photoRow}>
          {photos.map((n) => (
            <View key={n} style={styles.photoSlot}>
              <View style={styles.photoIcon}>
                <View style={styles.photoIconMountain} />
                <View style={styles.photoIconSun} />
              </View>
              <Text style={styles.photoLabel}>Photo {n}</Text>
              <Pressable
                onPress={() => removePhoto(n)}
                accessibilityRole="button"
                accessibilityLabel={`Remove photo ${n}`}
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.photoRemove,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.photoRemoveText}>✕</Text>
              </Pressable>
            </View>
          ))}
          {photos.length < MAX_PHOTOS ? (
            <Pressable
              onPress={addPhoto}
              accessibilityRole="button"
              accessibilityLabel={`Add evidence photo, ${photos.length} of ${MAX_PHOTOS} added`}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [
                styles.photoAdd,
                pressed && styles.pressed,
              ]}
            >
              <PlusGlyph />
              <Text style={styles.photoAddText}>Add photo</Text>
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.charCount}>
          {photos.length} of {MIN_PHOTOS} minimum · up to {MAX_PHOTOS}
        </Text>
      </View>

      <View
        style={[styles.field, highlight("resolution") && styles.fieldHighlighted]}
      >
        <Text style={styles.fieldLabel}>Desired resolution</Text>
        <View
          style={styles.chipGroup}
          accessibilityRole="radiogroup"
          accessibilityLabel="Desired resolution"
        >
          {RESOLUTION_OPTIONS.map((option) => {
            const selected = resolution === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setResolution(option.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected, checked: selected }}
                accessibilityLabel={option.label}
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.chip,
                  selected && styles.chipOn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={styles.footerNote}>
        Submitting sends this request to the seller and Repick support. You can
        add more evidence before it&apos;s submitted, not after.
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: CardItem }) => {
    const expanded = expandedId === item.id;
    if (item.kind === "draft") {
      return (
        <View style={styles.card}>
          <Pressable
            onPress={() => toggleExpand("draft")}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            accessibilityLabel={`New request, ${ELIGIBLE_ORDER.title}, ${STATUS_TEXT.draft}${expanded ? ", expanded" : ", collapsed"}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.cardHeader,
              pressed && styles.cardHeaderPressed,
            ]}
          >
            <View style={styles.cardHeaderBody}>
              <Text style={styles.cardKicker}>NEW REQUEST</Text>
              <Text style={styles.cardTitle} accessibilityRole="header">
                {ELIGIBLE_ORDER.title}
              </Text>
            </View>
            <View style={styles.cardHeaderRight}>
              <StatusPill status="draft" />
              <Text style={styles.chevron}>{expanded ? "▾" : "▸"}</Text>
            </View>
          </Pressable>
          {expanded ? renderDraftBody() : null}
        </View>
      );
    }

    const record = item.record;
    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => toggleExpand(item.id)}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={`${record.caseLabel}, ${record.orderTitle}, ${STATUS_TEXT[record.status]}${expanded ? ", expanded" : ", collapsed"}`}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.cardHeader,
            pressed && styles.cardHeaderPressed,
          ]}
        >
          <View style={styles.cardHeaderBody}>
            <Text style={styles.cardKicker}>{record.caseLabel}</Text>
            <Text style={styles.cardTitle} accessibilityRole="header">
              {record.orderTitle}
            </Text>
          </View>
          <View style={styles.cardHeaderRight}>
            <StatusPill status={record.status} />
            <Text style={styles.chevron}>{expanded ? "▾" : "▸"}</Text>
          </View>
        </Pressable>
        {expanded ? renderRecordBody(record) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>REPICK SUPPORT</Text>
            <Text style={styles.title} accessibilityRole="header">
              Disputes & Returns
            </Text>
            <Text style={styles.lede}>
              Open a return or dispute on a recent order, or check the status of
              one you already filed.
            </Text>
            <Text style={styles.summary}>
              {inReviewCount} in review · {resolvedCount} resolved
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.band} accessibilityLiveRegion="polite">
        {submitted ? (
          <View style={styles.bandDone}>
            <Text style={styles.bandDoneTitle} accessibilityRole="alert">
              Submitted — {NEW_CASE_LABEL} opened
            </Text>
            <Text style={styles.bandDoneHint}>
              Sent to the seller and Repick support on {SUBMITTED_DATE_LABEL}.
            </Text>
          </View>
        ) : blocking ? (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={`${blocking.message}. Tap to review.`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.bandBlocked,
              pressed && styles.bandPressed,
            ]}
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
            accessibilityLabel={`Submit return request for ${ELIGIBLE_ORDER.title}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.bandReady,
              pressed && styles.bandPressed,
            ]}
          >
            <Text style={styles.bandReadyTitle}>Submit request</Text>
            <Text style={styles.bandReadyHint}>All required fields complete</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export default DisputeCenterScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },

  header: {
    paddingTop: tokens.space(4),
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
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  lede: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },
  summary: {
    marginTop: tokens.space(4),
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  card: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  cardHeaderPressed: { opacity: 0.8 },
  cardHeaderBody: { flex: 1, gap: 2 },
  cardKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: tokens.color.faint,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.ink },
  cardHeaderRight: { alignItems: "flex-end", gap: tokens.space(1) },
  chevron: { fontSize: 13, color: tokens.color.faint },
  cardBody: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(4),
    paddingTop: tokens.space(1),
    gap: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },

  statusPill: {
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  statusPillActive: { borderColor: tokens.color.accent },
  statusPillNeutral: { borderColor: tokens.color.border },
  statusPillDraft: { borderColor: tokens.color.border },
  statusPillText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: tokens.color.muted,
  },
  statusPillTextActive: { color: tokens.color.accent },

  recordMetaBlock: { gap: 2 },
  recordMetaLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  recordMetaValue: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },
  recordMetaSub: { fontSize: 12, lineHeight: 17, color: tokens.color.muted },
  windowNote: {
    marginTop: tokens.space(1),
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  recordFactsRow: { flexDirection: "row", gap: tokens.space(5) },
  recordFact: { gap: 2 },
  recordFactLabel: { fontSize: 11, fontWeight: "700", color: tokens.color.faint },
  recordFactValue: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },

  recordNote: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    gap: 3,
  },
  recordNoteLabel: { fontSize: 11, fontWeight: "700", color: tokens.color.faint },
  recordNoteText: { fontSize: 13, lineHeight: 19, color: tokens.color.ink2 },
  recordNoteMeta: { fontSize: 11, color: tokens.color.faint },

  refundNote: {
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  refundNoteText: { fontSize: 13, fontWeight: "700", color: tokens.color.ink },

  timeline: { gap: 0 },
  timelineRow: { flexDirection: "row", gap: tokens.space(3) },
  timelineTrack: { alignItems: "center", width: 16 },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  timelineDotDone: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    minHeight: tokens.space(6),
    backgroundColor: tokens.color.border,
    marginTop: 2,
  },
  timelineLineDone: { backgroundColor: tokens.color.accent },
  timelineBody: { flex: 1, paddingBottom: tokens.space(3), gap: 1 },
  timelineLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.faint },
  timelineLabelDone: { color: tokens.color.ink2 },
  timelineDate: { fontSize: 11, color: tokens.color.faint },

  field: {
    gap: tokens.space(2),
    borderRadius: tokens.radius.md,
    padding: tokens.space(1),
  },
  fieldHighlighted: {
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    padding: tokens.space(1) - 0.5,
    backgroundColor: tokens.color.bg,
  },
  fieldLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.ink },

  chipGroup: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space(2) },
  chip: {
    minHeight: 36,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(3),
    justifyContent: "center",
  },
  chipOn: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  chipText: { fontSize: 12, fontWeight: "600", color: tokens.color.ink2 },
  chipTextOn: { color: tokens.color.onAccent },
  pressed: { opacity: 0.8 },

  textInput: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink,
    textAlignVertical: "top",
  },
  charCount: { fontSize: 11, color: tokens.color.faint },

  photoRow: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space(3) },
  photoSlot: { width: 72, alignItems: "center", gap: 3 },
  photoIcon: {
    width: 64,
    height: 64,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  photoIconMountain: {
    position: "absolute",
    bottom: -8,
    left: 6,
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: tokens.color.border,
    transform: [{ rotate: "45deg" }],
  },
  photoIconSun: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.color.border,
  },
  photoLabel: { fontSize: 10, color: tokens.color.muted },
  photoRemove: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  photoRemoveText: { fontSize: 10, fontWeight: "700", color: tokens.color.onInk },
  photoAdd: {
    width: 72,
    height: 64,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: tokens.color.faint,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  photoAddText: { fontSize: 10, fontWeight: "700", color: tokens.color.muted },
  plusGlyph: { width: 16, height: 16, alignItems: "center", justifyContent: "center" },
  plusBarH: {
    position: "absolute",
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: tokens.color.faint,
  },
  plusBarV: {
    position: "absolute",
    width: 2,
    height: 14,
    borderRadius: 1,
    backgroundColor: tokens.color.faint,
  },

  footerNote: { fontSize: 12, lineHeight: 18, color: tokens.color.faint },

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
