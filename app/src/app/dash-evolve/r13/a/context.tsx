"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_SHIPMENT_ID } from "./data";
import type { Period } from "./types";

interface OpsContextValue {
  selectedShipmentId: string;
  setSelectedShipmentId: (id: string) => void;
  period: Period;
  setPeriod: (period: Period) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
}

const OpsContext = createContext<OpsContextValue | null>(null);

export function OpsProvider({ children }: { children: ReactNode }) {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(DEFAULT_SHIPMENT_ID);
  const [period, setPeriod] = useState<Period>("30D");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const value = useMemo(
    () => ({ selectedShipmentId, setSelectedShipmentId, period, setPeriod, paletteOpen, setPaletteOpen }),
    [selectedShipmentId, period, paletteOpen],
  );

  return <OpsContext.Provider value={value}>{children}</OpsContext.Provider>;
}

export function useOps(): OpsContextValue {
  const ctx = useContext(OpsContext);
  if (!ctx) throw new Error("useOps must be used within an OpsProvider");
  return ctx;
}
