// native/src/evolve/r39/c/data.ts
//
// Fixed, deterministic dummy data for the Two-Factor Backup Codes screen.
// No Math.random / Date.now / argumentless `new Date()` anywhere — both the
// "current" set and the "regenerated" set are hand-written literal strings.

export interface BackupCode {
  id: string;
  code: string;
  used: boolean;
}

// The 8 codes currently on file for this account. Three of them are already
// marked "used" (a fixed, deterministic subset — not computed at render
// time) so the grid has a real mix of states to show.
export const currentBackupCodes: BackupCode[] = [
  { id: "code-1", code: "7F3K-9QPL", used: false },
  { id: "code-2", code: "2M8X-4RTD", used: true },
  { id: "code-3", code: "9B6N-1WZC", used: false },
  { id: "code-4", code: "5H2Y-8KVA", used: true },
  { id: "code-5", code: "3T9F-6LXE", used: false },
  { id: "code-6", code: "8R4Q-2NBP", used: false },
  { id: "code-7", code: "1C7M-5JYW", used: true },
  { id: "code-8", code: "6Z3D-9HTG", used: false },
];

// The replacement set written to the account the moment "Confirm" is
// pressed. Fixed literal strings, every one starting out unused, and
// disjoint from currentBackupCodes so it's visually obvious the swap
// actually happened.
export const refreshedBackupCodes: BackupCode[] = [
  { id: "code-1", code: "4V8L-2QXN", used: false },
  { id: "code-2", code: "6K1D-7MZS", used: false },
  { id: "code-3", code: "9P4T-3HRC", used: false },
  { id: "code-4", code: "2W8F-5NYE", used: false },
  { id: "code-5", code: "8J6B-1TQV", used: false },
  { id: "code-6", code: "5X3M-9LDK", used: false },
  { id: "code-7", code: "1N7Y-4GPW", used: false },
  { id: "code-8", code: "3C9R-6VHZ", used: false },
];

export const totalCodeCount = currentBackupCodes.length;

export function countUnused(codes: BackupCode[]): number {
  return codes.filter((entry) => !entry.used).length;
}
