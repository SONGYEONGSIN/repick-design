import Image from "next/image";

const SIZE_MAP = {
  sm: 24,
  md: 32,
  lg: 40,
} as const;

export function Avatar({
  src,
  name,
  size = "md",
  className = "",
}: {
  src: string;
  name: string;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}) {
  const px = SIZE_MAP[size];
  return (
    <Image
      src={src}
      alt={`${name}'s profile photo`}
      width={px}
      height={px}
      sizes={`${px}px`}
      className={`shrink-0 rounded-full border border-zinc-200 object-cover ${className}`}
      style={{ width: px, height: px }}
    />
  );
}
