import styles from "./flap.module.css";

type Tone = "amber" | "red" | "green" | "white" | "dim";
type Align = "left" | "right" | "center";

function padValue(value: string, length?: number, align: Align = "left") {
  if (!length) return value;
  const clipped = value.slice(0, length);
  if (clipped.length >= length) return clipped;
  const gap = length - clipped.length;
  if (align === "right") return " ".repeat(gap) + clipped;
  if (align === "center") {
    const left = Math.floor(gap / 2);
    const right = gap - left;
    return " ".repeat(left) + clipped + " ".repeat(right);
  }
  return clipped + " ".repeat(gap);
}

/**
 * 스플릿플랩 보드 셀 텍스트. 문자 단위로 분리해 개별 셀에 렌더링하고
 * 마운트될 때(= 필터 결과로 행이 새로 나타날 때, 또는 key 변경으로 강제 리마운트될 때)
 * 순차적으로 플립되는 진입 애니메이션을 재생한다.
 * 시각적으로는 문자가 조각나 있으므로 접근성 트리에는 하나의 텍스트로만 노출한다.
 */
export function FlapText({
  value,
  length,
  align = "left",
  tone = "amber",
  className,
  ariaLabel,
}: {
  value: string;
  length?: number;
  align?: Align;
  tone?: Tone;
  className?: string;
  ariaLabel?: string;
}) {
  const chars = padValue(value, length, align).split("");
  return (
    <span
      className={`${styles.board} ${className ?? ""}`}
      role="img"
      aria-label={ariaLabel ?? value.trim()}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`${styles.cell} ${styles[tone]}`}
          style={{ animationDelay: `${i * 26}ms` }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
