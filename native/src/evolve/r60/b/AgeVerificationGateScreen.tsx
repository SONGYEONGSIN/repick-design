// native/src/evolve/r60/b/AgeVerificationGateScreen.tsx — auto-native-r60 candidate b.
//
// Age/ID verification gate for a restricted-item purchase (buyer side). A buyer trying to
// check out with a 18+ restricted item confirms the date-of-birth-derived age and the ID
// photo Repick already has on file, then taps a single "Verify & Continue" action.
//
// This is a single-step gate, not a multi-step flow, so per the domain's band assignment
// there is NO bottom band: the one primary action (and its pending/approved/denied result)
// lives in-content, directly under the two confirmations it depends on. The result is
// rendered in a live region that only mounts content on the terminal outcome (approved or
// denied) — the transient "Verifying…" state lives on the button itself, outside that
// region, so exactly one accessibilityRole="alert" sentence fires per tap, not two.
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import { IDENTITY_ON_FILE, RESTRICTED_ITEM, VERIFY_PENDING_MS } from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type GateStatus = "idle" | "pending" | "approved" | "denied";

type CheckItem = {
  id: string;
  label: string;
  detail: string;
  confirmLabel: string;
};

const CHECK_ITEMS: CheckItem[] = [
  {
    id: "dob",
    label: "Date of birth on file",
    detail: `${IDENTITY_ON_FILE.dobLabel} · age ${IDENTITY_ON_FILE.ageOnFile} on file`,
    confirmLabel: "Yes, this is my date of birth",
  },
  {
    id: "id-photo",
    label: "ID photo on file",
    detail: `${IDENTITY_ON_FILE.idPhoto.statusLabel} · ${IDENTITY_ON_FILE.idPhoto.capturedLabel}`,
    confirmLabel: "Yes, this ID photo is still accurate",
  },
];

// Deterministic: a pure comparison of hardcoded dummy data, not a live computation.
const MEETS_AGE_REQUIREMENT =
  IDENTITY_ON_FILE.ageOnFile >= RESTRICTED_ITEM.minAge;

export function AgeVerificationGateScreen() {
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<GateStatus>("idle");
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
    };
  }, []);

  const bothConfirmed = CHECK_ITEMS.every((item) => confirmed[item.id]);
  const disabled = !bothConfirmed || status === "pending";

  const toggleConfirm = (id: string) => {
    setConfirmed((prev) => ({ ...prev, [id]: !prev[id] }));
    if (status === "approved" || status === "denied") {
      setStatus("idle");
    }
  };

  const handleVerify = () => {
    if (disabled) return;
    setStatus("pending");
    pendingTimer.current = setTimeout(() => {
      setStatus(MEETS_AGE_REQUIREMENT ? "approved" : "denied");
    }, VERIFY_PENDING_MS);
  };

  const renderCheckItem = ({ item }: { item: CheckItem }) => {
    const isConfirmed = !!confirmed[item.id];
    return (
      <Pressable
        onPress={() => toggleConfirm(item.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isConfirmed }}
        accessibilityLabel={`${item.confirmLabel}, ${isConfirmed ? "confirmed" : "not confirmed"}`}
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [
          styles.checkRow,
          isConfirmed && styles.checkRowDone,
          pressed && styles.rowPressed,
        ]}
      >
        <View style={[styles.checkbox, isConfirmed && styles.checkboxOn]}>
          {isConfirmed ? <Text style={styles.checkMark}>✓</Text> : null}
        </View>
        <View style={styles.checkBody}>
          <Text style={styles.checkLabel}>{item.label}</Text>
          <Text style={styles.checkDetail}>{item.detail}</Text>
          <Text
            style={[
              styles.checkConfirmText,
              isConfirmed && styles.checkConfirmTextDone,
            ]}
          >
            {item.confirmLabel}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={CHECK_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderCheckItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>AGE &amp; ID VERIFICATION</Text>
            <Text style={styles.title} accessibilityRole="header">
              Verify Your Age
            </Text>
            <Text style={styles.lede}>
              This item is age-restricted. Confirm the identity Repick
              already has on file before checkout can continue.
            </Text>

            <View style={styles.itemCard}>
              <View style={styles.itemSwatch} />
              <View style={styles.itemCardBody}>
                <Text style={styles.itemTitle}>{RESTRICTED_ITEM.title}</Text>
                <Text style={styles.itemSubtitle}>
                  {RESTRICTED_ITEM.subtitle} · {RESTRICTED_ITEM.categoryLabel}
                </Text>
                <Text style={styles.itemPrice}>
                  {RESTRICTED_ITEM.priceLabel}
                </Text>
              </View>
            </View>

            <View style={styles.restrictionBadge}>
              <View style={styles.restrictionIcon}>
                <Text style={styles.restrictionIconText}>!</Text>
              </View>
              <Text style={styles.restrictionText}>
                {RESTRICTED_ITEM.minAge}+ restricted item — age verification
                required before checkout
              </Text>
            </View>

            <Text style={styles.sectionTitle} accessibilityRole="header">
              Identity on file
            </Text>
            <Text style={styles.sectionLede}>
              Repick checks these two records against your account. Confirm
              each one below to continue.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={styles.statusRegion} accessibilityLiveRegion="polite">
              {status === "approved" ? (
                <View style={[styles.statusCard, styles.statusCardApproved]}>
                  <View
                    style={[styles.statusIcon, styles.statusIconApproved]}
                  >
                    <Text style={styles.statusIconText}>✓</Text>
                  </View>
                  <View style={styles.statusTextWrap}>
                    <Text style={styles.statusTitle} accessibilityRole="alert">
                      Age verified — you can continue to checkout
                    </Text>
                    <Text style={styles.statusDetail}>
                      Matched against the date of birth and ID photo on file.
                      Cleared for {RESTRICTED_ITEM.minAge}+ items.
                    </Text>
                  </View>
                </View>
              ) : status === "denied" ? (
                <View style={[styles.statusCard, styles.statusCardDenied]}>
                  <View style={[styles.statusIcon, styles.statusIconDenied]}>
                    <Text style={styles.statusIconText}>✕</Text>
                  </View>
                  <View style={styles.statusTextWrap}>
                    <Text style={styles.statusTitle} accessibilityRole="alert">
                      Verification denied — this item requires age{" "}
                      {RESTRICTED_ITEM.minAge}+
                    </Text>
                    <Text style={styles.statusDetail}>
                      The identity on file does not meet this item's age
                      requirement. Update your confirmations above to try
                      again.
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>

            {status === "idle" || status === "pending" ? (
              <Pressable
                onPress={handleVerify}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityState={{ disabled }}
                accessibilityLabel={
                  status === "pending"
                    ? "Verifying, please wait"
                    : bothConfirmed
                      ? "Verify and continue"
                      : "Verify and continue, confirm both items above first"
                }
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.verifyButton,
                  disabled && styles.verifyButtonDisabled,
                  pressed && !disabled && styles.verifyButtonPressed,
                ]}
              >
                {status === "pending" ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color={tokens.color.onAccent}
                    />
                    <Text style={styles.verifyButtonText}>Verifying…</Text>
                  </>
                ) : (
                  <Text style={styles.verifyButtonText}>
                    Verify &amp; Continue
                  </Text>
                )}
              </Pressable>
            ) : null}

            <Text style={styles.footerNote}>
              {status === "approved"
                ? "This checkout session is now cleared for age-restricted items."
                : status === "denied"
                  ? "No new ID copy was stored — only today's purchase was checked."
                  : bothConfirmed
                    ? "Verifying checks today's purchase only — Repick does not store a new copy of your ID."
                    : "Confirm both items above to enable verification."}
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(8),
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

  itemCard: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  itemSwatch: {
    width: 52,
    height: 52,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.swatch2,
  },
  itemCardBody: {
    flex: 1,
    gap: 2,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },
  itemPrice: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  restrictionBadge: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    backgroundColor: tokens.color.warningBg,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
  },
  restrictionIcon: {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.warning,
    alignItems: "center",
    justifyContent: "center",
  },
  restrictionIconText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.warning,
  },
  restrictionText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    color: tokens.color.warning,
  },

  sectionTitle: {
    marginTop: tokens.space(6),
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sectionLede: {
    marginTop: tokens.space(1),
    marginBottom: tokens.space(3),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.muted,
  },

  checkRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  checkRowDone: {
    borderColor: tokens.color.accent,
  },
  rowPressed: {
    opacity: 0.75,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkMark: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  checkBody: {
    flex: 1,
    gap: 2,
  },
  checkLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  checkDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
  },
  checkConfirmText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  checkConfirmTextDone: {
    color: tokens.color.accent,
  },

  footer: {
    marginTop: tokens.space(2),
  },
  statusRegion: {
    marginBottom: tokens.space(3),
  },
  statusCard: {
    flexDirection: "row",
    gap: tokens.space(3),
    borderWidth: 1.5,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  statusCardApproved: {
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
  },
  statusCardDenied: {
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
  },
  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIconApproved: {
    backgroundColor: tokens.color.success,
  },
  statusIconDenied: {
    backgroundColor: tokens.color.danger,
  },
  statusIconText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  statusTextWrap: {
    flex: 1,
    gap: 2,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  statusDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.ink2,
  },

  verifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.space(2),
    minHeight: 52,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
  },
  verifyButtonDisabled: {
    // Dim bg+text together (not a different bg color) so the text/background
    // contrast ratio is preserved while still reading as non-interactive.
    opacity: 0.45,
  },
  verifyButtonPressed: {
    opacity: 0.85,
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },

  footerNote: {
    marginTop: tokens.space(3),
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
    textAlign: "center",
  },
});
