// scripts/specimen-spec-schema.mjs — G2 rich-spec completeness gate (shared by tests).
export const SUBSET_IDS = ["d29", "d30", "d31", "d32", "d33", "d34", "d35", "d36", "d37", "d38", "v0", "v6", "v7", "v8", "n1"];

export function validateSpec(spec) {
  const errs = [];
  if (!spec || typeof spec !== "object") return ["not an object"];
  if (!Array.isArray(spec.palette) || spec.palette.length < 3) errs.push("palette needs >=3 swatches");
  else for (const s of spec.palette) {
    if (!/^#[0-9a-f]{6}$/.test(s?.hex || "")) errs.push(`bad hex: ${s?.hex}`);
    if (!s?.token || !s?.role || !s?.usage) errs.push("swatch missing token/role/usage");
  }
  for (const f of ["typography", "spacing", "philosophy", "agentPrompt"]) {
    if (typeof spec[f] !== "string" || spec[f].trim().length < 10) errs.push(`${f} too short`);
  }
  if (!Array.isArray(spec.dosDonts) || spec.dosDonts.length < 3) errs.push("dosDonts needs >=3");
  else for (const d of spec.dosDonts) if (!d?.do || !d?.dont) errs.push("dosDont missing do/dont");
  return errs;
}
