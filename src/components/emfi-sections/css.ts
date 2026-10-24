import type { CSSProperties } from "react";

export function css(input: string): CSSProperties {
  const parts: string[] = [];
  let depth = 0;
  let buf = "";
  for (const ch of input) {
    if (ch === "(") depth += 1;
    else if (ch === ")") depth -= 1;
    if (ch === ";" && depth === 0) {
      parts.push(buf);
      buf = "";
    } else buf += ch;
  }
  if (buf.trim()) parts.push(buf);
  const out: Record<string, string> = {};
  for (const part of parts) {
    const index = part.indexOf(":");
    if (index < 0) continue;
    const raw = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (!raw || !value) continue;
    const key = raw.replace(/^-ms-/, "ms-").replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    out[key] = value;
  }
  return out;
}

export const markMask = 'url("/emfi/emfi-mark.svg") center/contain no-repeat';

export const cardStyle: CSSProperties = {
  minWidth: 0,
  position: "relative",
  borderRadius: 28,
  background: "linear-gradient(160deg,#12294F,#0B1D3B)",
  border: "1px solid rgba(162,194,253,.22)",
  padding: "clamp(20px,2.6vw,36px)",
  paddingTop: "calc(clamp(20px,2.6vw,36px) + 34px)",
};
