// native/src/evolve/r44/a/AuthenticityEscalationScreen.tsx — auto-native-r44
// candidate a.
//
// Concept: Authenticity Escalation Case — a buyer who has already received an
// item opens this screen when they suspect it is counterfeit, to build and
// file a case with repick's authentication team against the specific order.
// This is NOT native/src/evolve/r24/a/ReportListingScreen (a pre-purchase,
// policy-violation flag against a live listing) and NOT
// native/src/evolve/r42/b/ReportBuyerScreen (seller-side misconduct about a
// buyer's behavior) — this screen is item-authenticity-specific, anchored to
// one completed order, and surfaces that order's PRIOR repick authentication
// record (native/src/certificate, native/src/authentication) as load-bearing
// context: the sharper case this data models is a buyer contesting a result
// repick's own lab already certified, not an unvetted listing.
//
// Macro layout: a single-focus ScrollView, not FlatList — this is a short,
// bounded record-building form (order summary + evidence grid + text area),
// not a long virtualizable list, so ScrollView is the right choice here, not
// a workaround.
//
// Band mechanic: blocked/ready/done state machine (native/GENERATION.md §3),
// with this screen's own key family and copy — "caseBand" /
// "caseBandLocked(Headline|Note)" / "caseBandReady(Headline|Note)" /
// "caseBandFiled(Headline|Note)" — distinct from the already-reused
// bandBlocked*/bandReady*/bandDone* family (native/src/disputes,
// native/src/authentication) and from r24's statusBarWaiting/statusBarActive/
// statusBarSettled family. The gate gets held open by exactly two
// requirements that line up with this domain's own idea of a filable case:
// at least one evidence photo AND a written description of what looks wrong.
// Pressing the band while locked scrolls the page to whichever requirement is
// still missing; once both are met the same control becomes "Submit for
// Review"; pressing it then transitions the band to a filed confirmation
// state and swaps the form body for a read-only case summary. That
// stage change is the only accessibilityLiveRegion on screen (the band
// container) and only its headline carries accessibilityRole="alert", per
// native/GENERATION.md §4.
//
// Simulated capture, stated honestly: there is no real camera in this
// environment. Tapping "Add evidence photo" deterministically appends a
// fixed placeholder tile — copy and accessibility labels say exactly that and
// never claim a camera opened.
import { useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CASE_REFERENCE,
  FILED_DATE_LABEL,
  ISSUE_AREAS,
  MAX_DESCRIPTION_LENGTH,
  MAX_PHOTOS,
  MIN_DESCRIPTION_LENGTH,
  MIN_PHOTOS,
  ORDER,
  PRIOR_AUTH,
  REVIEW_WINDOW_LABEL,
  formatWon,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const SCROLL_OFFSET = 12;

type CaseStage = "incomplete" | "fileable" | "filed";
type MissingField = "evidence" | "description" | null;

export function AuthenticityEscalationScreen() {
  const [photos, setPhotos] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());
  const [filed, setFiled] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const evidenceY = useRef(0);
  const descriptionY = useRef(0);

  const descriptionTrimmed = description.trim();
  const hasEvidence = photos.length >= MIN_PHOTOS;
  const hasDescription = descriptionTrimmed.length >= MIN_DESCRIPTION_LENGTH;

  const stage: CaseStage = filed
    ? "filed"
    : hasEvidence && hasDescription
      ? "fileable"
      : "incomplete";

  const missing: MissingField = !hasEvidence
    ? "evidence"
    : !hasDescription
      ? "description"
      : null;

  const lockedMessage =
    missing === "evidence" && !hasDescription
      ? "Add an evidence photo and describe the issue before this case can be filed."
      : missing === "evidence"
        ? `Add at least ${MIN_PHOTOS} evidence photo to file this case.`
        : `Describe what looks wrong before this case can be filed (${descriptionTrimmed.length} of ${MIN_DESCRIPTION_LENGTH} characters).`;

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addPhoto = () => {
    setPhotos((prev) => (prev.length >= MAX_PHOTOS ? prev : [...prev, prev.length + 1]));
  };

  const removePhoto = (n: number) => {
    setPhotos((prev) => prev.filter((x) => x !== n).map((_, i) => i + 1));
  };

  const jumpToMissing = () => {
    if (missing === "evidence") {
      scrollRef.current?.scrollTo({ y: Math.max(evidenceY.current - SCROLL_OFFSET, 0), animated: true });
    } else if (missing === "description") {
      scrollRef.current?.scrollTo({ y: Math.max(descriptionY.current - SCROLL_OFFSET, 0), animated: true });
    }
  };

  const handleBandPress = () => {
    if (stage === "incomplete") {
      jumpToMissing();
      return;
    }
    if (stage === "fileable") {
      setFiled(true);
    }
  };

  const selectedAreaLabels = ISSUE_AREAS.filter((a) => selectedAreas.has(a.id)).map(
    (a) => a.label,
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>REPICK AUTHENTICATION TEAM</Text>
          <Text style={styles.title} accessibilityRole="header">
            Authenticity Escalation Case
          </Text>
          <Text style={styles.lede}>
            Tell us what looks wrong with this item. Your case goes directly to
            the authentication team, not the seller.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Order</Text>
          <Text style={styles.orderTitle}>{ORDER.itemTitle}</Text>
          <Text style={styles.orderMeta}>
            {ORDER.brand} · {ORDER.variant}
          </Text>
          <View style={styles.orderFactsRow}>
            <View style={styles.orderFact}>
              <Text style={styles.orderFactLabel}>Paid</Text>
              <Text style={styles.orderFactValue}>{formatWon(ORDER.priceWon)}</Text>
            </View>
            <View style={styles.orderFact}>
              <Text style={styles.orderFactLabel}>Received</Text>
              <Text style={styles.orderFactValue}>{ORDER.receivedDateLabel}</Text>
            </View>
            <View style={styles.orderFact}>
              <Text style={styles.orderFactLabel}>Seller</Text>
              <Text style={styles.orderFactValue}>{ORDER.sellerName}</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            PRIOR_AUTH.status === "certified" && styles.priorAuthCardCertified,
          ]}
        >
          <Text style={styles.cardLabel}>Prior authentication record</Text>
          <Text style={styles.priorAuthSummary}>{PRIOR_AUTH.summary}</Text>
          {PRIOR_AUTH.certId ? (
            <Text style={styles.priorAuthDetail}>
              Certificate {PRIOR_AUTH.certId} · issued {PRIOR_AUTH.dateLabel}
            </Text>
          ) : null}
          <Text style={styles.priorAuthNote}>
            This case will ask the lab to re-examine that result against the
            item you actually received.
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>What doesn&apos;t match (optional)</Text>
          <Text style={styles.fieldHint}>
            Select any areas that look off — this helps the lab triage faster.
          </Text>
          <View style={styles.chipGroup}>
            {ISSUE_AREAS.map((area) => {
              const checked = selectedAreas.has(area.id);
              return (
                <Pressable
                  key={area.id}
                  onPress={() => toggleArea(area.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  accessibilityLabel={area.label}
                  hitSlop={HIT_SLOP}
                  style={({ pressed }) => [
                    styles.chip,
                    checked && styles.chipOn,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.chipText, checked && styles.chipTextOn]}>
                    {area.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={[styles.field, missing === "evidence" && styles.fieldFlagged]}
          onLayout={(e) => {
            evidenceY.current = e.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.fieldLabel}>Evidence photos</Text>
          <Text style={styles.fieldHint}>
            At least {MIN_PHOTOS} photo of the actual item is required. Up to{" "}
            {MAX_PHOTOS} total.
          </Text>
          {/* Small, fixed-count user-added set (a handful of photo tiles) — a
             plain row is enough here; this is not the long virtualizable
             list the ScrollView-vs-FlatList choice above is about. */}
          <View style={styles.evidenceRow}>
            {photos.map((n) => (
              <View key={n} style={styles.evidenceTile}>
                <View style={styles.evidenceGlyph}>
                  <View style={styles.evidenceGlyphCorner} />
                </View>
                <Text style={styles.evidenceTileLabel}>Photo {n}</Text>
                <Pressable
                  onPress={() => removePhoto(n)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove evidence photo ${n}`}
                  hitSlop={HIT_SLOP}
                  style={({ pressed }) => [
                    styles.evidenceRemove,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.evidenceRemoveGlyph}>✕</Text>
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
                  styles.evidenceAdd,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.evidenceAddGlyph}>
                  <View style={styles.evidenceAddBarH} />
                  <View style={styles.evidenceAddBarV} />
                </View>
                <Text style={styles.evidenceAddLabel}>Add photo</Text>
              </Pressable>
            ) : null}
          </View>
          <Text style={styles.fieldCount}>
            {photos.length} of {MIN_PHOTOS} minimum added
          </Text>
        </View>

        <View
          style={[styles.field, missing === "description" && styles.fieldFlagged]}
          onLayout={(e) => {
            descriptionY.current = e.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.fieldLabel}>Describe the issue</Text>
          <Text style={styles.fieldHint}>
            What specifically looks, feels, or smells wrong, and when did you
            notice it?
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. The logo stitching is uneven and the hardware feels lighter than the certified reference photos."
            placeholderTextColor={tokens.color.faint}
            multiline
            numberOfLines={5}
            maxLength={MAX_DESCRIPTION_LENGTH}
            accessibilityLabel="Describe the issue"
            accessibilityHint={`Minimum ${MIN_DESCRIPTION_LENGTH} characters`}
            style={styles.textInput}
          />
          <Text style={styles.fieldCount}>
            {descriptionTrimmed.length} / {MIN_DESCRIPTION_LENGTH} minimum
          </Text>
        </View>

        {filed ? (
          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>Case summary</Text>
            <Text style={styles.summaryRow}>Reference · {CASE_REFERENCE}</Text>
            <Text style={styles.summaryRow}>Filed · {FILED_DATE_LABEL}</Text>
            <Text style={styles.summaryRow}>Evidence · {photos.length} photo(s)</Text>
            {selectedAreaLabels.length > 0 ? (
              <Text style={styles.summaryRow}>
                Flagged areas · {selectedAreaLabels.join(", ")}
              </Text>
            ) : null}
            <View style={styles.summaryNote}>
              <Text style={styles.summaryNoteLabel}>Your description</Text>
              <Text style={styles.summaryNoteText}>{descriptionTrimmed}</Text>
            </View>
            <Text style={styles.summaryNextStep}>{REVIEW_WINDOW_LABEL}</Text>
          </View>
        ) : (
          <Text style={styles.footerNote}>
            Filing this case pauses the seller&apos;s payout on this order
            until the lab reaches a decision. You can keep adding evidence
            before you file, not after.
          </Text>
        )}
      </ScrollView>

      <View style={styles.caseBand} accessibilityLiveRegion="polite">
        {stage === "filed" ? (
          <View style={styles.caseBandFiled}>
            <Text style={styles.caseBandFiledHeadline} accessibilityRole="alert">
              Case {CASE_REFERENCE} filed
            </Text>
            <Text style={styles.caseBandFiledNote}>{REVIEW_WINDOW_LABEL}</Text>
          </View>
        ) : stage === "incomplete" ? (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={`${lockedMessage} Tap to go there.`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.caseBandLocked,
              pressed && styles.caseBandPressed,
            ]}
          >
            <Text style={styles.caseBandLockedHeadline} accessibilityRole="alert">
              {lockedMessage}
            </Text>
            <Text style={styles.caseBandLockedNote}>Tap to go there</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={`Submit authenticity escalation case for ${ORDER.itemTitle}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.caseBandReady,
              pressed && styles.caseBandPressed,
            ]}
          >
            <Text style={styles.caseBandReadyHeadline} accessibilityRole="alert">
              Submit for Review
            </Text>
            <Text style={styles.caseBandReadyNote}>
              Evidence and description complete
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export default AuthenticityEscalationScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
    gap: tokens.space(4),
  },

  header: { gap: tokens.space(2) },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  lede: { fontSize: 14, lineHeight: 21, color: tokens.color.muted },

  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(1),
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: tokens.color.faint,
  },
  orderTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.ink },
  orderMeta: { fontSize: 13, color: tokens.color.muted },
  orderFactsRow: {
    flexDirection: "row",
    gap: tokens.space(5),
    marginTop: tokens.space(2),
  },
  orderFact: { gap: 2 },
  orderFactLabel: { fontSize: 10, fontWeight: "700", color: tokens.color.faint },
  orderFactValue: { fontSize: 12, fontWeight: "600", color: tokens.color.ink2 },

  priorAuthCardCertified: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  priorAuthSummary: { fontSize: 14, fontWeight: "600", color: tokens.color.ink },
  priorAuthDetail: { fontSize: 12, color: tokens.color.muted },
  priorAuthNote: {
    marginTop: tokens.space(1),
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },

  field: {
    gap: tokens.space(2),
    borderRadius: tokens.radius.md,
    padding: tokens.space(1),
  },
  fieldFlagged: {
    borderWidth: 1.5,
    borderColor: tokens.color.danger,
    padding: tokens.space(1) - 0.5,
    backgroundColor: tokens.color.dangerBg,
  },
  fieldLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.ink },
  fieldHint: { fontSize: 12, lineHeight: 17, color: tokens.color.muted },
  fieldCount: { fontSize: 11, color: tokens.color.faint },

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

  evidenceRow: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space(3) },
  evidenceTile: { width: 72, alignItems: "center", gap: 3 },
  evidenceGlyph: {
    width: 64,
    height: 64,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    overflow: "hidden",
  },
  evidenceGlyphCorner: {
    position: "absolute",
    bottom: -10,
    right: -10,
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: tokens.color.border,
    transform: [{ rotate: "45deg" }],
  },
  evidenceTileLabel: { fontSize: 10, color: tokens.color.muted },
  evidenceRemove: {
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
  evidenceRemoveGlyph: { fontSize: 10, fontWeight: "700", color: tokens.color.onInk },
  evidenceAdd: {
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
  evidenceAddGlyph: { width: 16, height: 16, alignItems: "center", justifyContent: "center" },
  evidenceAddBarH: {
    position: "absolute",
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: tokens.color.faint,
  },
  evidenceAddBarV: {
    position: "absolute",
    width: 2,
    height: 14,
    borderRadius: 1,
    backgroundColor: tokens.color.faint,
  },
  evidenceAddLabel: { fontSize: 10, fontWeight: "700", color: tokens.color.muted },

  textInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink,
    textAlignVertical: "top",
  },

  footerNote: { fontSize: 12, lineHeight: 18, color: tokens.color.faint },

  summaryCard: {
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(1),
    backgroundColor: tokens.color.accentBg,
  },
  summaryRow: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  summaryNote: {
    marginTop: tokens.space(2),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    backgroundColor: tokens.color.bg,
    gap: 3,
  },
  summaryNoteLabel: { fontSize: 11, fontWeight: "700", color: tokens.color.faint },
  summaryNoteText: { fontSize: 13, lineHeight: 19, color: tokens.color.ink2 },
  summaryNextStep: {
    marginTop: tokens.space(2),
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  caseBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  caseBandPressed: { opacity: 0.85 },
  caseBandLocked: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  caseBandLockedHeadline: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  caseBandLockedNote: { fontSize: 12, color: tokens.color.muted },
  caseBandReady: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  caseBandReadyHeadline: { fontSize: 16, fontWeight: "700", color: tokens.color.onAccent },
  caseBandReadyNote: { fontSize: 12, color: tokens.color.onAccent },
  caseBandFiled: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  caseBandFiledHeadline: { fontSize: 16, fontWeight: "700", color: tokens.color.accent },
  caseBandFiledNote: { fontSize: 12, color: tokens.color.muted },
});
