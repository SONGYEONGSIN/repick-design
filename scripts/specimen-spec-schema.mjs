// scripts/specimen-spec-schema.mjs — G2 rich-spec completeness gate (shared by tests).
// 스펙 완전성 게이트가 지키는 작품 목록. 배치로 늘린다 — 여기에 없는 id 의 스펙을 데이터에
// 넣으면 "no strays" 테스트가 실패하고, 넣으면 그때부터 이 검사가 그 작품까지 지킨다.
export const SUBSET_IDS = [
  // 배치 (2026-08-26): 주간 apply 승격 3종 (dash r18 은 카피 언어 위반으로 승격 보류)
  "v17", "n16", "n17",
  // 배치 (2026-08-24): 주간 apply 승격 2종
  "v16", "n15",
  // 배치 (2026-08-21): 주간 apply 승격 4종
  "d49", "v14", "v15", "n14",
  // 배치 (2026-08-19): 주간 apply 승격 4종
  "d48", "v13", "n12", "n13",
  "d29", "d30", "d31", "d32", "d33", "d34", "d35", "d36", "d37", "d38", "d39", "d40",
  "v0", "v6", "v7", "v8", "v9", "v10",
  // 배치 1 (2026-08-14): native 7종
  "n1", "n2", "n3", "n4", "n5", "n6", "n7",
  // 배치 2a (2026-08-14): 신규 타입 7종
  "lg1", "nf1", "pf1", "bl1", "ab1", "ct1", "sc1",
  // 배치 2b (2026-08-14): careers·contact 계열 7종
  "cr1", "cr2", "cr3", "ct2", "ct3", "dv1", "ig1",
  // 배치 2c (2026-08-14): 신규 타입 마감 3종
  "pd1", "pw1", "mk1",
  // 배치 3 (2026-08-14): 최신 승격·주문 6종 — 이걸로 카탈로그 전 작품이 채워졌다
  "v11", "d41", "d42", "d43", "d44", "d45",
  // 2026-08-15 주간 반증 승격분 — 이 줄부터는 승격과 같은 PR에서 채운다(specimen-works-coverage 가 강제)
  "v12", "n8", "n9",
  // 2026-08-17 주간 반증 승격분 (auto-dash-r14/c · auto-native-r6/c)
  "d46", "n10",
  // auto-dash-r15/c · auto-native-r7/a
  "d47", "n11",
];

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
