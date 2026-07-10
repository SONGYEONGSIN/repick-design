// Shared focus-visible treatment. No outline in the resting state (the CSS
// initial value for outline-style is already `none`); a high-contrast solid
// outline is drawn only on :focus-visible (WCAG 2.4.7). Tailwind v4's
// `outline-2` utility reads outline-style from the `--tw-outline-style`
// custom property, so `outline-solid` must be paired in to give it a
// concrete value — otherwise the outline never renders.
export const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hf-accent)]";
