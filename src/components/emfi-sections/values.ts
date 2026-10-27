export type MarkDraw = { bd: string; [key: string]: string | number };

export type RouteNode = {
  e: MarkDraw | null;
  eb: string;
  left: string;
  top: string;
  op: number;
  tf: string;
  dot: string;
  sw: boolean;
  swOff: number;
  ms: string;
  name: string;
  sub: string;
  subOp: number;
  ls: string;
  fs: string;
  nc: string;
  subC: string;
};

type NodeOpts = {
  op?: number;
  sc?: number;
  dot: string;
  name: string;
  sub?: string;
  lp: string;
  sz: number;
  fs?: string;
  sw?: boolean;
  swOff?: number;
  ms?: string;
  nc?: string;
  subC?: string;
  wrap?: boolean;
};

export function H() {
  const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const sg = (t: number, a: number, b: number) => cl((t - a) / (b - a));
  const ez = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const lp = (a: number, b: number, k: number) => a + (b - a) * k;
  const lpp = (p: number[], q: number[], k: number) => [lp(p[0], q[0], k), lp(p[1], q[1], k)];
  return { cl, sg, ez, lp, lpp };
}

export function eSw(k: number): MarkDraw {
  const o: MarkDraw = { bd: k > 0.99 ? "#8098CC" : "#3A4A66" };
  for (let i = 0; i < 24; i++) {
    const f = Math.max(0, Math.min(1, k * 24 - i));
    o[`f${i}`] = (1 - f).toFixed(3);
    o[`o${i}`] = f > 0 ? 1 : 0;
  }
  return o;
}

export function rect(a: number[], b: number[], th: number) {
  if (Math.abs(a[0] - b[0]) < 0.01) return `left:${a[0]}%;top:${Math.min(a[1], b[1])}%;width:${th}px;height:${Math.abs(a[1] - b[1])}%;margin-left:-${th / 2}px`;
  return `left:${Math.min(a[0], b[0])}%;top:${a[1]}%;height:${th}px;width:${Math.abs(a[0] - b[0])}%;margin-top:-${th / 2}px`;
}

export function lab(pos: string, sz: number, wrap?: boolean) {
  const o = sz / 2 + 12;
  const ws = wrap ? "white-space:normal;width:max-content;max-width:120px" : "white-space:nowrap";
  if (pos === "b") return `left:0;top:${o}px;transform:translateX(-50%);align-items:center;text-align:center;${ws}`;
  if (pos === "a") return `left:0;bottom:${o}px;transform:translateX(-50%);align-items:center;text-align:center;${ws}`;
  if (pos === "bl") return `left:-9px;top:${o}px;align-items:flex-start;text-align:left;${ws}`;
  if (pos === "al") return `left:-9px;bottom:${o}px;align-items:flex-start;text-align:left;${ws}`;
  return `left:${o}px;top:0;transform:translateY(-50%);align-items:flex-start;text-align:left;${ws}`;
}

function dot(kind: string, on?: boolean, dark = true) {
  const bd = dark ? "#B1C0E2" : "#071832";
  const fill = dark ? "#A2C2FD" : "#071832";
  const bg = dark ? "#0E2242" : "#FFFFFF";
  if (kind === "c") return `width:18px;height:18px;border-radius:50%;background:${dark ? "#FFFFFF" : "#071832"}`;
  if (kind === "i") return `width:18px;height:18px;border-radius:4px;border:2px solid ${bd};background:${on ? fill : bg}`;
  if (kind === "r") return `width:16px;height:16px;border-radius:50%;border:2px solid #8098CC;background:${on ? "#8098CC" : bg}`;
  return `width:16px;height:16px;border-radius:50%;border:2px solid ${bd};background:${on ? fill : bg}`;
}

function swDot(sz: number, k: number, _ring: string, bump = 0) {
  return `width:${sz}px;height:${sz}px;border-radius:50%;background:#071832;border:1px solid ${k > 0.99 ? "#8098CC" : "#3A4A66"};box-shadow:0 0 ${Math.round(sz * (0.45 * bump + 0.17 * k))}px rgba(0,201,167,.45)`;
}

function node(pt: number[], o: NodeOpts): RouteNode {
  const mix = (k: number) => {
    const c = [[58, 255], [74, 255], [102, 255]].map(([x, y]) => Math.round(x + (y - x) * k));
    return `rgb(${c.join(",")})`;
  };
  const swOff = o.swOff ?? 100;
  return {
    e: o.sw ? eSw(1 - swOff / 100) : null,
    eb: mix(Math.max(0, Math.min(1, 1 - swOff / 100))),
    left: `${pt[0]}%`,
    top: `${pt[1]}%`,
    op: o.op ?? 1,
    tf: `translate(-50%,-50%) scale(${o.sc ?? 1})`,
    dot: o.dot,
    sw: !!o.sw,
    swOff,
    ms: o.ms || "0px",
    name: o.name,
    sub: o.sub || "",
    subOp: o.sub ? 1 : 0,
    ls: lab(o.lp, o.sz, o.wrap),
    fs: o.fs || "15px",
    nc: o.nc || "#FFFFFF",
    subC: o.subC || "#B1C0E2",
  };
}

function tok(p: number[], op: number, bg: string) {
  return { left: `${p[0]}%`, top: `${p[1]}%`, op, bg };
}

const CONVENTIONAL_END = 0.56;
const CONVENTIONAL_STRETCH = 1.75;
export const directTimelineScale = CONVENTIONAL_END * CONVENTIONAL_STRETCH + (1 - CONVENTIONAL_END);
const HOME12_CONV_MS = 20000;
const HOME12_EMFI_MS = 6500;
const HOME12_HOLD_MS = 30000;
const HOME12_TOTAL_MS = HOME12_CONV_MS + HOME12_EMFI_MS + HOME12_HOLD_MS;
const HOME12_EMFI_END = 0.92;

export type DirectPace = "home12";

export function directPaceScale(pace?: DirectPace) {
  return pace === "home12" ? HOME12_TOTAL_MS / 13000 : directTimelineScale;
}

function slowConventionalRoute(t: number) {
  const scaled = t * directTimelineScale;
  const firstSpan = CONVENTIONAL_END * CONVENTIONAL_STRETCH;
  return scaled <= firstSpan ? scaled / CONVENTIONAL_STRETCH : CONVENTIONAL_END + (scaled - firstSpan);
}

function home12Route(t: number) {
  const ms = t * HOME12_TOTAL_MS;
  if (ms <= HOME12_CONV_MS) return (ms / HOME12_CONV_MS) * CONVENTIONAL_END;
  if (ms <= HOME12_CONV_MS + HOME12_EMFI_MS) {
    const k = (ms - HOME12_CONV_MS) / HOME12_EMFI_MS;
    return CONVENTIONAL_END + k * (HOME12_EMFI_END - CONVENTIONAL_END);
  }
  return HOME12_EMFI_END;
}

export function dirVals(t: number, V: boolean, routeTitles?: { conventional: string; direct: string }, pace?: DirectPace) {
  const home12 = pace === "home12";
  t = home12 ? home12Route(t) : slowConventionalRoute(t);
  const { sg, ez, lp } = H();
  const P0 = [6, 28, 50, 72, 94];
  const ws = (i: number) => 0.06 + (i - 1) * 0.11;
  const k = ez(sg(t, 0.56, 0.72));
  const S = (a: number) => (V ? [14, a] : [a, 34]);
  const pos = V ? "r" : "b";
  const ap = (i: number) => sg(t, ws(i), ws(i) + 0.02);
  const arr = (i: number) => t >= ws(i) + 0.065;
  let tokA = P0[0];
  let trav = -1;
  let trackEnd = P0[0];
  for (let i = 1; i <= 4; i++) {
    if (t >= ws(i)) trackEnd = lp(P0[i - 1], P0[i], ap(i));
    if (t >= ws(i) + 0.02) {
      const f = ez(sg(t, ws(i) + 0.02, ws(i) + 0.065));
      tokA = lp(P0[i - 1], P0[i], f);
      if (f < 1) trav = i;
    }
  }
  const cpos = lp(6, 18, k);
  const dpos = lp(94, 82, k);
  const replay = t >= 0.72;
  let tokB = 18;
  let travB = -1;
  if (t >= 0.745) {
    const f1 = ez(sg(t, 0.745, 0.79));
    tokB = lp(18, 50, f1);
    if (f1 < 1) travB = 1;
  }
  if (t >= 0.825) {
    const f2 = ez(sg(t, 0.825, 0.87));
    tokB = lp(50, 82, f2);
    if (f2 < 1) travB = 2;
  }
  const depOn = (arr(4) && t < 0.56) || t >= 0.87;
  const fs = V ? "14px" : "14px";
  const emfiDone = home12 && t >= 0.87;
  const nodes = [node(S(cpos), { op: sg(t, 0, 0.03), dot: dot("c"), name: "Client", lp: pos, sz: 18, fs })];
  ["Settlement agent", "Sub-custodian", "Custodian"].forEach((name, j) => {
    const i = j + 1;
    const processingUntil = home12 ? ws(i + 1) + 0.065 : ws(i) + 0.11;
    const processingLabel = home12 ? "Processing" : name === "Custodian" ? "Received" : "Processing";
    nodes.push(node(S(lp(P0[i], 50, k)), { op: ap(i) * (1 - sg(t, 0.57, 0.67)), sc: 1 - 0.4 * k, dot: dot("p", arr(i)), name, sub: arr(i) && t < processingUntil ? processingLabel : "", lp: pos, sz: 16, fs }));
  });
  const depositorySub = !depOn ? "" : home12 && t < CONVENTIONAL_END ? "Received" : "Done";
  nodes.push(node(S(dpos), { op: ap(4), dot: dot("i", depOn), name: "Depository", sub: depositorySub, lp: pos, sz: 18, fs }));
  const es = V ? 52 : 64;
  const sk = ez(sg(t, 0.64, 0.71));
  nodes.push(node(S(50), {
    op: sg(t, 0.6, 0.66),
    sc: lp(0.6, 1, ez(sg(t, 0.6, 0.7))),
    dot: swDot(es, sk, "#0E2242", Math.max(Math.sin(Math.PI * sg(t, 0.67, 0.76)), Math.sin(Math.PI * sg(t, 0.785, 0.83)))),
    sw: true,
    swOff: 100 * (1 - sk),
    ms: `${V ? 28 : 35}px`,
    name: "EMFI",
    fs: "16px",
    sub: emfiDone ? "Received" : !home12 && t >= 0.79 && t < 0.825 ? "Received" : "",
    lp: pos,
    sz: es,
  }));
  const routeBlue = "#A2C2FD";
  const routeGradient = `linear-gradient(${V ? "180deg" : "90deg"},#A2C2FD,#8098CC,#00C9A7)`;
  const lines = [
    { s: rect(S(t >= 0.56 ? cpos : P0[0]), S(t >= 0.56 ? dpos : trackEnd), 2), c: "#3A4A66", op: 1 },
    { s: rect(S(replay ? 18 : P0[0]), S(replay ? tokB : tokA), replay ? 3 : 2), c: replay ? routeGradient : routeBlue, op: replay ? 1 : 1 - sg(t, 0.56, 0.6) },
  ];
  const hm = !replay && trav > 0 ? (P0[trav - 1] + P0[trav]) / 2 : replay && travB > 0 ? (travB === 1 ? 34 : 66) : null;
  const hp = S(hm ?? 50);
  const orderTf = V ? "translate(14px,-50%)" : "translate(-50%,-32px)";
  const orderTag = (along: number) => {
    const p = S(along);
    return { left: `${p[0]}%`, top: `${p[1]}%`, tf: orderTf, op: 1, text: "Order" };
  };
  let count = [1, 2, 3, 4].filter(arr).length;
  if (t >= 0.56) count = 4;
  if (replay) count = (t >= 0.79 ? 1 : 0) + (t >= 0.87 ? 1 : 0);
  return {
    dNodes: nodes,
    dLines: lines,
    dTok: tok(S(replay ? tokB : tokA), replay ? (t < 0.8 ? sg(t, 0.72, 0.74) * (1 - sg(t, 0.775, 0.79)) : sg(t, 0.825, 0.835)) : sg(t, 0.03, 0.05) * (1 - sg(t, 0.56, 0.6)), replay ? "linear-gradient(135deg,#A2C2FD,#00C9A7)" : routeBlue),
    dHand: { left: `${hp[0]}%`, top: `${hp[1]}%`, tf: V ? "translate(14px,-50%)" : "translate(-50%,-32px)", op: hm == null ? 0 : 1 },
    dTags: emfiDone ? [orderTag((cpos + 50) / 2), orderTag((50 + dpos) / 2)] : [],
    dCount: count,
    dNote: t >= 0.74 ? "Previously 4" : "",
    dRouteTitle: t >= 0.56 ? (routeTitles?.direct ?? "A Direct Route with EMFI") : (routeTitles?.conventional ?? "A conventional route"),
    dCap: t < 0.53 ? "Standard institutional route" : t < 0.74 ? "The same route, fewer layers" : "The same instruction, through EMFI",
    dStageH: V ? "400px" : "180px",
    dBandOp: sg(t, 0.74, 0.86),
    dBandS: V ? "left:14%;width:22px;margin-left:-11px;top:12%;height:76%" : "left:16%;width:68%;top:34%;height:22px;margin-top:-11px",
    dO0: sg(t, 0.88, 0.91),
    dO1: sg(t, 0.91, 0.94),
    dO2: sg(t, 0.94, 0.97),
  };
}

export function resVals(t: number, V: boolean) {
  const { sg, ez } = H();
  const P: Record<string, [string, string, string]> = {
    Received: ["rgba(162,194,253,.12)", "#A2C2FD", "rgba(162,194,253,.3)"],
    Processing: ["rgba(128,152,204,.18)", "#CBD2E8", "rgba(128,152,204,.35)"],
    Checked: ["rgba(0,201,167,.14)", "#00C9A7", "rgba(0,201,167,.35)"],
    "Issue raised": ["transparent", "#FFFFFF", "#8098CC"],
    "Team reviewing": ["rgba(162,194,253,.18)", "#FFFFFF", "rgba(162,194,253,.5)"],
    "Solution found": ["rgba(0,201,167,.2)", "#00C9A7", "#00C9A7"],
    Pending: ["transparent", "#8E9CB8", "rgba(142,156,184,.45)"],
    Completed: ["rgba(0,201,167,.2)", "#00C9A7", "#00C9A7"],
  };
  const seq = ["Received", "Processing", "Checked"];
  const cyc = (i: number) => (t < 0.3 ? seq[Math.max(0, Math.floor((t - i * 0.017) / 0.05)) % 3] : "Checked");
  const mk = (ref: string, type: string, st: string) => {
    const c = P[st];
    return { ref, type, st, bg: c[0], c: c[1], bd: c[2] };
  };
  const sst = t < 0.3 ? cyc(2) : t < 0.46 ? "Issue raised" : t < 0.66 ? "Team reviewing" : "Solution found";
  const rS = { ...mk("EM-2043", "Cross-border settlement", sst), hl: t >= 0.3 ? "rgba(162,194,253,.07)" : "transparent", bd2: t >= 0.66 ? "rgba(0,201,167,.45)" : t >= 0.3 ? "rgba(162,194,253,.4)" : "rgba(162,194,253,.08)" };
  const ek = ez(sg(t, 0.44, 0.505));
  return {
    rTop: [mk("EM-2041", "FX execution", cyc(0)), mk("EM-2042", "Bond settlement", cyc(1))],
    rBot: [mk("EM-2044", "Custody transfer", t < 0.3 ? cyc(3) : t < 0.72 ? "Pending" : "Completed")],
    rS,
    rCols: V ? "minmax(0,1fr) auto" : "72px minmax(0,1fr) auto",
    rRefD: V ? "none" : "block",
    rX: {
      h: `${Math.round(ez(sg(t, 0.32, 0.4)) * 80)}px`,
      op: sg(t, 0.34, 0.4),
      stdLbl: sg(t, 0.36, 0.4) * (1 - sg(t, 0.6, 0.64)),
      stdOp: 1 - 0.5 * sg(t, 0.6, 0.7),
      barOp: sg(t, 0.38, 0.41) * (1 - 0.4 * sg(t, 0.66, 0.72)),
      altClip: `${(100 * (1 - ez(sg(t, 0.52, 0.66)))).toFixed(2)}%`,
      wsOp: sg(t, 0.64, 0.7),
    },
    rConH: `${Math.round(ez(sg(t, 0.42, 0.46)) * 24)}px`,
    rTeamH: `${Math.round(ez(sg(t, 0.4, 0.46)) * 100)}px`,
    rChip: {
      e: eSw(ek),
      op: sg(t, 0.44, 0.5),
      st: t < 0.66 ? "Reviewing" : "Confirmed",
      c: t < 0.66 ? "#A2C2FD" : "#00C9A7",
      eOff: 100 * (1 - ek),
      glow: `${Math.round(16 * Math.sin(Math.PI * sg(t, 0.5, 0.66)) + 4 * ek)}px`,
    },
    rRtOp: sg(t, 0.06, 0.12),
    rEpOp: sg(t, 0.5, 0.56),
    rLive: t >= 1 ? 1 : (0.45 + 0.55 * Math.abs(Math.cos(t * 40))).toFixed(2),
    rF0: sg(t, 0.86, 0.89),
    rF1: sg(t, 0.89, 0.92),
    rF2: sg(t, 0.92, 0.95),
    rQ: sg(t, 0.95, 1),
  };
}

export function accVals(t: number, V: boolean) {
  const { sg, ez } = H();
  const owners = ["Execution", "Operations", "Settlement", "Custody"];
  const cs = [0.12, 0.22, 0.32];
  const lefts = V ? [46, 49, 52, 55] : [42, 47, 53, 58];
  void lefts;
  const idx = cs.filter((c) => t >= c).length;
  const left = 50;
  const em = t >= 0.52;
  const changes = [...cs, 0.52];
  let d = 0;
  let dir = 0;
  changes.forEach((c) => {
    const k = 1 - Math.min(1, Math.abs(t - c) / 0.025);
    if (k > d) {
      d = k;
      dir = t < c ? -1 : 1;
    }
  });
  const tw = cs.find((c) => t >= c - 0.045 && t < c - 0.005);
  const tr = tw ? "Transferred" : "";
  const trOp = tw ? Math.min(sg(t, tw - 0.045, tw - 0.035), 1 - sg(t, tw - 0.015, tw - 0.005)) : 0;
  const sk = ez(sg(t, 0.5, 0.57));
  const ewk = ez(sg(t, 0.47, 0.51));
  const aCard = {
    left: `${left}%`,
    top: V ? "34%" : "38%",
    op: sg(t, 0, 0.04),
    owner: em ? "EMFI Relationship Owner" : owners[Math.min(idx, 3)],
    oOp: 1 - d,
    oY: `${(dir * d * 6).toFixed(1)}px`,
    oc: em ? "#FFFFFF" : "#CBD2E8",
    tr,
    tOp: trOp,
    ew: `${Math.round(30 * ewk)}px`,
    gap: `${Math.round(10 * ewk)}px`,
    e: eSw(sk),
    glow: `${Math.round(18 * sg(t, 0.55, 0.62) * (1 - sg(t, 0.66, 0.76)) + 6 * sg(t, 0.66, 0.76))}px`,
    tm: "14px",
    th: "16px",
    bc: t >= 0.56 ? "rgba(0,201,167,.55)" : "rgba(162,194,253,.3)",
  };
  const aFns = owners.map((name, i) => {
    const a = 0.62 + i * 0.07;
    const done = t >= a + 0.045;
    const act = t >= a && !done;
    const quiet = done && t >= a + 0.09;
    return {
      name,
      op: sg(t, a - 0.02, a) * (quiet ? 0.6 : 1),
      sOp: sg(t, a + 0.045, a + 0.06),
      nc: act || (done && !quiet) ? "#FFFFFF" : "#CBD2E8",
      bc: act ? "#A2C2FD" : done && !quiet ? "#00C9A7" : "rgba(162,194,253,.3)",
    };
  });
  return {
    aCard,
    aFns,
    aFnCols: V ? "repeat(2,minmax(0,1fr))" : "repeat(4,minmax(0,1fr))",
    aStageH: V ? "400px" : "340px",
    aO0: sg(t, 0.9, 0.93),
    aF0: sg(t, 0.93, 0.95),
    aF1: sg(t, 0.95, 0.97),
    aF2: sg(t, 0.97, 0.99),
  };
}
