import { markMask } from "./css";
import { markPaths } from "./mark-paths";
import type { MarkDraw } from "./values";

export function MarkTrace({ draw }: { draw: MarkDraw }) {
  return (
    <svg viewBox="0 0 145 145" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {markPaths.map((path, index) => (
        <path
          key={path.d}
          d={path.d}
          fill="none"
          stroke={path.stroke}
          strokeWidth={32}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 2"
          strokeDashoffset={draw[`f${index}`]}
          opacity={draw[`o${index}`]}
        />
      ))}
    </svg>
  );
}

export function MarkSwitch({ draw, size }: { draw: MarkDraw; size: number | string }) {
  return (
    <span style={{ position: "relative", display: "block", width: size, height: size, background: "#3A4A66", WebkitMask: markMask, mask: markMask }}>
      <MarkTrace draw={draw} />
    </span>
  );
}
