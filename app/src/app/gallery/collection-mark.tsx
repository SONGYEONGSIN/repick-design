export function CollectionMark({ sections }: { sections: { label: string; count: number }[] }) {
  const TICK = 3;
  const GAP = 2;
  const GROUP_GAP = 12;
  const H = 20;
  const rects: { x: number }[] = [];
  let x = 0;
  sections.forEach((s, si) => {
    for (let i = 0; i < s.count; i++) {
      rects.push({ x: Number(x.toFixed(2)) });
      x += TICK + GAP;
    }
    if (si < sections.length - 1) x += GROUP_GAP;
  });
  const width = Number(Math.max(x - GAP, TICK).toFixed(2));
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={H}
      viewBox={`0 0 ${width} ${H}`}
      className="mt-6 h-5 max-w-full text-zinc-300"
      preserveAspectRatio="xMinYMid meet"
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={0} width={TICK} height={H} rx={1} className="fill-current" />
      ))}
    </svg>
  );
}
