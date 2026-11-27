# Candidate b — "Dispute Replay"

**Theme / accent / face**: dark / rose (`#FB7185` text+icon+fill-with-dark-ink, `#F43F5E`
large-text-only) / `--font-display-mono`

**One-line concept**: A horizontal frame scrubber (`<input type="range">`, 5 steps, native
keyboard support) replays five inspection checkpoints — intake photo match, serial/IMEI scan,
battery health, cosmetic grading, final reconciliation. Scrubbing recomputes the running
deduction total, the resulting price, and an overall confidence score at every stop, not only at
the end. A second, independent toggle ("route flagged checks to a human reviewer") branches
specifically — and only — the battery-health frame's deduction from $45 to $15 with a different
cited reason, rather than applying a flat discount across every frame. Each deduction row is
keyboard-expandable (a real `<button aria-expanded>`, not a hover tooltip) to show the frame's
own note or, when human review is on and that frame has an override, the reviewer's note instead.

**Archetype**: continuous-index scrubber + boolean override-one-frame toggle -> running
deduction + price + confidence. Distinct from the catalog's existing timeline/scrubbed devices
(`Trace`, r12 — a scroll-position-driven SVG path reveal) in that the scrub axis here is a
discrete frame index the visitor drives directly with a range input, not page scroll, and the
human-review toggle is deliberately non-monotonic (it only ever touches one frame, and only
sometimes lowers its deduction) rather than a uniform multiplier.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 다크 테마에서 accent 채움 위에 올릴 텍스트 색(흰색 vs 어두운 잉크).
   **무엇으로 정했나**: rose-400(`#FB7185`) 채움 위에는 어두운 잉크(`#09090B`, 7.39:1)를 쓰고, 흰 텍스트(2.69:1, 3:1 미달)는 전혀 쓰지 않음.
   **왜 그렇게 정했나**: `design-principles.md` §Color Tokens의 Q29 판정(`auto-landing-r10` 실측)이 정확히 이 분기("흰색이 아니라 어두운 잉크"가 실측과 반대였던 사례)를 다뤄서, 두 방향 모두 직접 계산해 실측과 맞는 쪽을 선택했다.
2. **무엇을 정해야 했나**: `role="switch"` 버튼의 트랙 색(off 상태)이 다크 배경에서 충분한 대비를 갖는가.
   **무엇으로 정했나**: off 트랙을 `#52525B`(zinc-600, 비텍스트 요소라 3:1 논텍스트 기준만 요구됨)로, 토글 노브는 흰색 원으로 고정.
   **왜 그렇게 정했나**: 코어 브리프 §2가 "색+텍스트 병행"을 요구하므로 토글 라벨 텍스트("Route flagged checks to a human reviewer")가 상태를 이미 말로 전달하고, 트랙 색은 보조 신호로만 둠.
3. **무엇을 정해야 했나**: 범위 입력(`<input type="range">`)의 포커스 가시성 — 브라우저 기본 스타일이 `appearance-none`과 함께 사라지는 경우가 많음.
   **무엇으로 정했나**: 다른 모든 인터랙티브 요소와 동일한 `FOCUS_RING`(실제 `outline`, `outline-none`과 페어링되지 않음) 클래스를 range input 자체에도 명시 적용.
   **왜 그렇게 정했나**: 코어 브리프 §2가 "포커스 표시"를 하드게이트로 적어 뒀고, `outline-none` 단독 사용이 죽은 관용구로 이미 두 번 반증됐다는 경고를 읽었기 때문.
