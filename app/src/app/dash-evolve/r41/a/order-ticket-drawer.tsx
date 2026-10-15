"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { formatPrice } from "./data";
import { FOCUS_RING, SegmentedControl, Tabs } from "./ui";

const ORDER_TYPE_TABS = [
  { value: "market", label: "Market" },
  { value: "limit", label: "Limit" },
];

const SIDE_OPTIONS: { value: "buy" | "sell"; label: string }[] = [
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
];

export function OrderTicketDrawer({
  open,
  onClose,
  symbol,
  name,
  decimals,
  lastPrice,
}: {
  open: boolean;
  onClose: () => void;
  symbol: string;
  name: string;
  decimals: number;
  lastPrice: number;
}) {
  const [orderType, setOrderType] = useState<string>("market");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("1.00");
  const [limitPrice, setLimitPrice] = useState(lastPrice.toFixed(decimals));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset the whole ticket whenever it is (re)opened or the instrument underneath it changes,
  // so it never shows a stale price or a leftover "submitted" state from a previous ticket.
  const resetKey = `${open}:${symbol}`;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    if (open) {
      setOrderType("market");
      setSide("buy");
      setQuantity("1.00");
      setLimitPrice(lastPrice.toFixed(decimals));
      setSubmitting(false);
      setSubmitted(false);
    }
  }

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const qtyNum = Number.parseFloat(quantity) || 0;
  const priceNum = orderType === "limit" ? Number.parseFloat(limitPrice) || 0 : lastPrice;
  const estTotal = qtyNum * priceNum;

  function handleSubmit() {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close order ticket" onClick={onClose} className="fixed inset-0 bg-zinc-950/40" />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`New order for ${symbol}`}
        className={`relative flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white motion-safe:animate-[rise_200ms_ease-out] ${FOCUS_RING}`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3.5">
          <div>
            <p className="font-semibold text-sm text-zinc-900">New Order</p>
            <p className="font-normal text-xs text-zinc-500">
              {symbol} · {name}
            </p>
          </div>
          <button type="button" aria-label="Close order ticket" onClick={onClose} className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 p-4">
          {submitted ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <Check className="h-8 w-8 text-emerald-700" aria-hidden="true" />
              <p className="font-semibold text-sm text-emerald-800">Order submitted</p>
              <p className="font-normal text-xs text-emerald-700">
                {side === "buy" ? "Buy" : "Sell"} {quantity} {symbol} {orderType === "limit" ? `at ${formatPrice(priceNum, decimals)}` : "at market"} queued for the desk.
              </p>
              <button type="button" onClick={onClose} className={`mt-2 flex h-9 items-center rounded-lg border border-emerald-300 px-3 font-medium text-sm text-emerald-800 hover:bg-emerald-100 ${FOCUS_RING}`}>
                Done
              </button>
            </div>
          ) : (
            <>
              <Tabs tabs={ORDER_TYPE_TABS} value={orderType} onChange={setOrderType} idBase="order-type" />

              <div className="mt-4">
                <span className="mb-1.5 block font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">Side</span>
                <SegmentedControl ariaLabel="Order side" options={SIDE_OPTIONS} value={side} onChange={setSide} />
              </div>

              <label className="mt-4 block">
                <span className="mb-1.5 block font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">Quantity</span>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`h-11 w-full rounded-lg border border-zinc-200 px-3 font-normal text-sm tabular-nums text-zinc-900 ${FOCUS_RING}`}
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-1.5 block font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">Price</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={orderType === "market"}
                  value={orderType === "market" ? lastPrice.toFixed(decimals) : limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className={`h-11 w-full rounded-lg border border-zinc-200 px-3 font-normal text-sm tabular-nums text-zinc-900 disabled:bg-zinc-50 disabled:text-zinc-500 ${FOCUS_RING}`}
                />
              </label>

              <div className="mt-4 flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2.5">
                <span className="font-medium text-xs uppercase tracking-[0.04em] text-zinc-600">Est. Total</span>
                <span className="font-semibold text-sm tabular-nums text-zinc-900">${formatPrice(estTotal, 2)}</span>
              </div>

              <button
                type="button"
                disabled={submitting || qtyNum <= 0}
                onClick={handleSubmit}
                className={`mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg px-3 font-medium text-sm text-white motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  side === "buy" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                } ${FOCUS_RING}`}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
                {submitting ? "Submitting…" : `${side === "buy" ? "Buy" : "Sell"} ${symbol}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
