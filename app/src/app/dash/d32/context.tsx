"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { AssetId, Period } from "./types";

interface PortfolioContextValue {
  selectedAssetId: AssetId;
  setSelectedAssetId: (id: AssetId) => void;
  period: Period;
  setPeriod: (period: Period) => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({
  children,
  defaultAssetId,
}: {
  children: ReactNode;
  defaultAssetId: AssetId;
}) {
  const [selectedAssetId, setSelectedAssetId] = useState<AssetId>(defaultAssetId);
  const [period, setPeriod] = useState<Period>("1D");

  const value = useMemo(
    () => ({ selectedAssetId, setSelectedAssetId, period, setPeriod }),
    [selectedAssetId, period],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return ctx;
}
