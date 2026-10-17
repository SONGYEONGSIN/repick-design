// native/src/evolve/r24/a/ReportListingScreen.tsx — auto-native-r24 candidate a.
//
// Concept: "Report a Listing" — a trust-and-safety flow where a buyer flags a
// listing for a policy violation (counterfeit claim, misleading photos,
// prohibited item, harassment, etc.).
//
// Band form: blocked-workflow state machine, reusing the idea already proven
// by the shipment-pickup screen (native/src/pickup/ShipmentPickupScreen.tsx)
// — a fixed bottom bar is the single source of truth for "why can't I go
// yet," and pressing it while blocked jumps you to the unresolved field
// instead of just repeating the reason. The style keys, state names and copy
// below are original to this screen, not copied from that one:
//   - that screen: bandBlocked/bandBlockedTitle/bandBlockedHint/bandReady/bandDone
//   - this screen: statusBarWaiting/statusWaitingHeadline/statusWaitingDetail/
//     statusBarActive/statusBarSettled, and the hint copy is its own sentence
//     ("Finds the reason list for you.") rather than "Tap to go there".
//
// Unlike the pickup screen, this flow only has ONE required gate — the
// violation-reason picker — so there is no multi-stage lock/unlock ladder.
// Everything below the reason picker (free-text details, evidence photos) is
// genuinely optional: the band goes straight from blocked to ready the
// moment a reason is picked, with or without any of that optional content.
import { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ATTACHED_EVIDENCE,
  LISTING,
  MAX_EVIDENCE_PHOTOS,
  REASONS,
  buildReportRef,
  type ReasonId,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type SectionId = "listing" | "reason" | "evidence";
type SectionItem = { id: SectionId };
const SECTIONS: SectionItem[] = [{ id: "listing" }, { id: "reason" }, { id: "evidence" }];
const SECTION_INDEX: Record<SectionId, number> = { listing: 0, reason: 1, evidence: 2 };

const BLOCKED_SENTENCE = "Select a violation reason below before this report can be sent.";

export function ReportListingScreen() {
  const [reasonId, setReasonId] = useState<ReasonId | null>(null);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const listRef = useRef<FlatList<SectionItem>>(null);

  const selectedReason = REASONS.find((r) => r.id === reasonId) ?? null;
  const status: "blocked" | "ready" | "done" = submitted
    ? "done"
    : selectedReason
      ? "ready"
      : "blocked";
  const reportRef = selectedReason ? buildReportRef(selectedReason.id) : null;

  const jumpToReasonPicker = () => {
    listRef.current?.scrollToIndex({
      index: SECTION_INDEX.reason,
      viewPosition: 0,
      animated: true,
    });
  };

  const onSelectReason = (id: ReasonId) => {
    if (submitted) return;
    setReasonId(id);
  };

  const onBandPress = () => {
    if (status === "blocked") {
      jumpToReasonPicker();
      return;
    }
    if (status === "ready") {
      setSubmitted(true);
    }
    // status === "done": the band renders as a plain View below, not a
    // Pressable, so this branch is unreachable — kept only for clarity.
  };

  const renderListingSection = () => (
    <View style={styles.card}>
      <Text style={styles.cardKicker}>LISTING</Text>
      <Text style={styles.cardTitle} accessibilityRole="header">
        {LISTING.title}
      </Text>
      <Text style={styles.cardSub}>
        {LISTING.sellerHandle} · {LISTING.priceLabel} · {LISTING.listingId}
      </Text>
    </View>
  );

  const renderReasonSection = () => (
    <View style={styles.card}>
      <Text style={styles.cardKicker}>REQUIRED</Text>
      <Text style={styles.cardTitle} accessibilityRole="header">
        Why are you reporting this listing?
      </Text>
      <Text style={styles.cardSub}>
        Choose the option that fits best — this decides how our team routes your report.
      </Text>

      <View
        style={styles.reasonList}
        accessibilityRole="radiogroup"
        accessibilityLabel="Violation reason"
      >
        {REASONS.map((reason) => {
          const selected = reasonId === reason.id;
          return (
            <Pressable
              key={reason.id}
              onPress={() => onSelectReason(reason.id)}
              disabled={submitted}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: submitted }}
              accessibilityLabel={`${reason.label}. ${reason.description}`}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [
                styles.reasonRow,
                selected && styles.reasonRowOn,
                pressed && !submitted && styles.pressed,
              ]}
            >
              <View style={[styles.radioOuter, selected && styles.radioOuterOn]}>
                {selected ? <View style={styles.radioInner} /> : null}
              </View>
              <View style={styles.reasonBody}>
                <Text style={styles.reasonLabel}>{reason.label}</Text>
                <Text style={styles.reasonDescription}>{reason.description}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderEvidenceSection = () => (
    <View style={styles.card}>
      <Text style={styles.cardKicker}>OPTIONAL</Text>
      <Text style={styles.cardTitle} accessibilityRole="header">
        Add evidence
      </Text>
      <Text style={styles.cardSub}>
        Extra detail and photos help our team review faster, but aren't required to submit.
      </Text>

      <Text style={styles.fieldLabel}>Details</Text>
      <TextInput
        value={details}
        onChangeText={setDetails}
        editable={!submitted}
        multiline
        numberOfLines={4}
        placeholder="Describe what you noticed (optional)"
        placeholderTextColor={tokens.color.faint}
        accessibilityLabel="Additional details about this report"
        style={[styles.textArea, submitted && styles.textAreaDisabled]}
      />

      <Text style={styles.fieldLabel}>
        Photos ({ATTACHED_EVIDENCE.length}/{MAX_EVIDENCE_PHOTOS})
      </Text>
      <View style={styles.photoRow}>
        {ATTACHED_EVIDENCE.map((photo) => (
          <View
            key={photo.id}
            accessible
            accessibilityLabel="Attached evidence photo"
            style={[styles.photoSwatch, { backgroundColor: tokens.color[photo.token] }]}
          />
        ))}
        <Pressable
          onPress={() => {}}
          disabled={submitted}
          accessibilityRole="button"
          accessibilityLabel="Add photo"
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.addPhotoBtn,
            submitted && styles.addPhotoBtnDisabled,
            pressed && !submitted && styles.pressed,
          ]}
        >
          <Text style={styles.addPhotoGlyph}>+</Text>
          <Text style={styles.addPhotoText}>Add photo</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: SectionItem }) => {
    if (item.id === "listing") return renderListingSection();
    if (item.id === "reason") return renderReasonSection();
    return renderEvidenceSection();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={SECTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>TRUST & SAFETY</Text>
            <Text style={styles.title} accessibilityRole="header">
              Report a Listing
            </Text>
            <Text style={styles.lede}>
              Tell us what's wrong with this listing. Reports are reviewed by a person, not
              acted on automatically.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.statusBar} accessibilityLiveRegion="polite">
        {status === "done" ? (
          <View style={styles.statusBarSettled}>
            <Text style={styles.statusSettledHeadline} accessibilityRole="alert">
              Report submitted — our trust & safety team will review it.
            </Text>
            <Text style={styles.statusSettledDetail}>
              Reference {reportRef} · {selectedReason?.label}
            </Text>
          </View>
        ) : status === "blocked" ? (
          <Pressable
            onPress={onBandPress}
            accessibilityRole="button"
            accessibilityLabel={BLOCKED_SENTENCE}
            accessibilityHint="Scrolls to the reason list below"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.statusBarWaiting, pressed && styles.statusBarPressed]}
          >
            <Text style={styles.statusWaitingHeadline} accessibilityRole="alert">
              {BLOCKED_SENTENCE}
            </Text>
            <Text style={styles.statusWaitingDetail}>Finds the reason list for you.</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onBandPress}
            accessibilityRole="button"
            accessibilityLabel={`Submit report for ${selectedReason?.label}`}
            accessibilityHint="Sends this report to our trust and safety team"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.statusBarActive, pressed && styles.statusBarPressed]}
          >
            <Text style={styles.statusActiveHeadline} accessibilityRole="alert">
              Ready to submit this report
            </Text>
            <Text style={styles.statusActiveDetail}>
              {selectedReason?.label}
              {details.trim().length > 0 ? " · details added" : ""}
              {ATTACHED_EVIDENCE.length > 0
                ? ` · ${ATTACHED_EVIDENCE.length} photo${ATTACHED_EVIDENCE.length > 1 ? "s" : ""}`
                : ""}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ReportListingScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },
  separator: { height: tokens.space(3) },

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
    fontSize: 26,
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

  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(3),
  },
  cardKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: tokens.color.faint,
  },
  cardTitle: { fontSize: 17, fontWeight: "700", color: tokens.color.ink },
  cardSub: { fontSize: 12, lineHeight: 17, color: tokens.color.muted },

  reasonList: { gap: tokens.space(2) },
  reasonRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    minHeight: 56,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
  },
  reasonRowOn: { borderColor: tokens.color.accent, borderWidth: 1.5 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  radioOuterOn: { borderColor: tokens.color.accent },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.color.accent,
  },
  reasonBody: { flex: 1, gap: 2 },
  reasonLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.ink },
  reasonDescription: { fontSize: 12, lineHeight: 16, color: tokens.color.muted },
  pressed: { opacity: 0.8 },

  fieldLabel: { fontSize: 12, fontWeight: "700", color: tokens.color.ink2 },
  textArea: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    padding: tokens.space(3),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink,
    textAlignVertical: "top",
  },
  textAreaDisabled: { opacity: 0.6 },

  photoRow: { flexDirection: "row", gap: tokens.space(2) },
  photoSwatch: {
    width: 64,
    height: 64,
    borderRadius: tokens.radius.sm,
  },
  addPhotoBtn: {
    width: 64,
    height: 64,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  addPhotoBtnDisabled: { opacity: 0.4 },
  addPhotoGlyph: { fontSize: 16, fontWeight: "700", color: tokens.color.muted },
  addPhotoText: { fontSize: 9, fontWeight: "600", color: tokens.color.muted },

  statusBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  statusBarPressed: { opacity: 0.85 },
  statusBarWaiting: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  statusWaitingHeadline: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  statusWaitingDetail: { fontSize: 12, color: tokens.color.muted },
  statusBarActive: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  statusActiveHeadline: { fontSize: 16, fontWeight: "700", color: tokens.color.onAccent },
  statusActiveDetail: { fontSize: 12, color: tokens.color.onAccent },
  statusBarSettled: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  statusSettledHeadline: { fontSize: 15, fontWeight: "700", color: tokens.color.accent },
  statusSettledDetail: { fontSize: 12, color: tokens.color.muted },
});
