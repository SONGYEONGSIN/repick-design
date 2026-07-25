// app/src/lib/specimen-specs.ts — G2 per-work design-system specs (authored, English-only content).
import data from "./specimen-specs.data.json";

export type Swatch = { token: string; hex: string; role: string; usage: string };
export type WorkSpec = {
  id: string;
  palette: Swatch[];
  typography: string;
  spacing: string;
  philosophy: string;
  dosDonts: { do: string; dont: string }[];
  agentPrompt: string;
};

export const SPECS: Record<string, WorkSpec> = data as Record<string, WorkSpec>;

export function getSpec(id: string): WorkSpec | undefined {
  return SPECS[id];
}
