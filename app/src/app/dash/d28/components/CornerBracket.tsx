import styles from "../console.module.css";

/** Decorative HUD-reticle corner framing. Purely presentational — aria-hidden. */
export function CornerBracket() {
  return (
    <span aria-hidden="true">
      <span className={`${styles.bracket} ${styles.bracketTl}`} />
      <span className={`${styles.bracket} ${styles.bracketTr}`} />
      <span className={`${styles.bracket} ${styles.bracketBl}`} />
      <span className={`${styles.bracket} ${styles.bracketBr}`} />
    </span>
  );
}
