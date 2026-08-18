import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ADDRESS,
  ITEM,
  ITEM_PRICE_WON,
  PAYMENT,
  SERVICE_FEE_WON,
  SHIPPING_FEE_WON,
  TOTAL_WON,
  formatWonAmount,
} from "./data";

// No step-machine bottom band here: address and payment are already on file and there is
// exactly one terminal action, so a single always-enabled CTA with a live total is the
// honest shape — inventing blocking states this screen doesn't have would be decoration,
// not function. See native/GENERATION.md §3.
function noop() {
  // "Change" affordances are real interactive elements (proper role + label) but are
  // intentionally no-ops for this exercise — there is nothing downstream to navigate to.
}

export function CheckoutScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.kicker}>REPICK CHECKOUT</Text>
        <Text style={styles.title} accessibilityRole="header">
          Review order
        </Text>
        <Text style={styles.lede}>
          Confirm the item, shipping, and payment below before you place the
          order.
        </Text>

        <View style={styles.itemCard}>
          <View style={styles.thumb}>
            <Text style={styles.thumbMark}>{ITEM.thumbnailMark}</Text>
          </View>
          <View style={styles.itemTextCol}>
            <Text style={styles.itemTitle}>{ITEM.title}</Text>
            <Text style={styles.itemCondition}>{ITEM.condition}</Text>
            <View style={styles.itemPriceRow}>
              <Text style={styles.itemPrice}>
                ₩{formatWonAmount(ITEM.priceWon)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.block}>
          <View style={styles.blockHeadRow}>
            <Text style={styles.blockTitle} accessibilityRole="header">
              Shipping address
            </Text>
            <Pressable
              onPress={noop}
              accessibilityRole="button"
              accessibilityLabel="Change shipping address"
              hitSlop={8}
              style={({ pressed }) => [
                styles.changeButton,
                pressed && styles.changeButtonPressed,
              ]}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </Pressable>
          </View>
          <Text style={styles.blockPrimary}>{ADDRESS.recipientName}</Text>
          <Text style={styles.blockSecondary}>{ADDRESS.line1}</Text>
          <Text style={styles.blockSecondary}>{ADDRESS.line2}</Text>
          <Text style={styles.blockSecondary}>{ADDRESS.phone}</Text>
        </View>

        <View style={styles.block}>
          <View style={styles.blockHeadRow}>
            <Text style={styles.blockTitle} accessibilityRole="header">
              Payment method
            </Text>
            <Pressable
              onPress={noop}
              accessibilityRole="button"
              accessibilityLabel="Change payment method"
              hitSlop={8}
              style={({ pressed }) => [
                styles.changeButton,
                pressed && styles.changeButtonPressed,
              ]}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </Pressable>
          </View>
          <Text style={styles.blockPrimary}>{PAYMENT.brand}</Text>
          <Text style={styles.blockSecondary}>
            {PAYMENT.label} · •••• {PAYMENT.last4}
          </Text>
          <Text style={styles.blockSecondary}>{PAYMENT.expiryLabel}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle} accessibilityRole="header">
            Price breakdown
          </Text>
          <View style={styles.priceLine}>
            <Text style={styles.priceLineLabel}>Item price</Text>
            <Text style={styles.priceLineValue}>
              ₩{formatWonAmount(ITEM_PRICE_WON)}
            </Text>
          </View>
          <View style={styles.priceLine}>
            <Text style={styles.priceLineLabel}>Shipping fee</Text>
            <Text style={styles.priceLineValue}>
              ₩{formatWonAmount(SHIPPING_FEE_WON)}
            </Text>
          </View>
          <View style={styles.priceLine}>
            <Text style={styles.priceLineLabel}>Service fee</Text>
            <Text style={styles.priceLineValue}>
              ₩{formatWonAmount(SERVICE_FEE_WON)}
            </Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceLine}>
            <Text style={styles.priceTotalLabel}>Total</Text>
            <Text style={styles.priceTotalValue}>
              ₩{formatWonAmount(TOTAL_WON)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.band}>
        <View style={styles.bandTotalCol}>
          <Text style={styles.bandTotalLabel}>Total</Text>
          <Text style={styles.bandTotalValue}>
            ₩{formatWonAmount(TOTAL_WON)}
          </Text>
        </View>
        <Pressable
          onPress={noop}
          accessibilityRole="button"
          accessibilityLabel={`Place order, total ₩${formatWonAmount(TOTAL_WON)}`}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaText}>Place order</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default CheckoutScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
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
    padding: tokens.space(4),
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbMark: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: tokens.color.onInk,
  },
  itemTextCol: {
    flex: 1,
    gap: 3,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemCondition: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },
  itemPriceRow: {
    marginTop: tokens.space(1),
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  block: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(1),
  },
  blockHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.space(1),
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  changeButton: {
    minHeight: 32,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
  },
  changeButtonPressed: {
    backgroundColor: tokens.color.border,
  },
  changeButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  blockPrimary: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  blockSecondary: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  priceLine: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: tokens.space(2),
    gap: tokens.space(3),
  },
  priceLineLabel: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  priceLineValue: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    textAlign: "right",
  },
  priceDivider: {
    marginTop: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  priceTotalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  priceTotalValue: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
    textAlign: "right",
  },
  band: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  bandTotalCol: {
    gap: 1,
  },
  bandTotalLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: tokens.color.faint,
  },
  bandTotalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  cta: {
    minHeight: 48,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(5),
    backgroundColor: tokens.color.accent,
  },
  ctaPressed: {
    opacity: 0.78,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
