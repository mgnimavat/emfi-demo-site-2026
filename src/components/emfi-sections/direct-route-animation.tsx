"use client";

import { css } from './css';
import { MarkSwitch } from './mark-trace';
import type { dirVals } from './values';

type DirectRouteAnimationProps = {
  values: ReturnType<typeof dirVals>;
  stepLabel?: string;
  pinned?: boolean;
  ariaLabel?: string;
};

export const DirectRouteAnimation = ({
  values,
  stepLabel = 'Handover',
  pinned = false,
  ariaLabel = "An instruction moves from You to Settlement agent, Sub-custodian, Custodian and Depository. The same route then shortens to You, EMFI, Depository.",
}: DirectRouteAnimationProps) => {
  const { dNodes, dLines, dTok, dHand, dTags, dStageH, dBandOp, dBandS } = values;

  return (
    <div data-direct-route-animation data-route-title={values.dRouteTitle} role="img" aria-label={ariaLabel} style={{ position: "relative", height: pinned ? undefined : dStageH, flex: pinned ? "1 1 auto" : undefined, minHeight: pinned ? 0 : undefined }}>
      <span style={{ position: "absolute", zIndex: 0, borderRadius: 999, background: "linear-gradient(90deg,rgba(162,194,253,.22),rgba(128,152,204,.16),rgba(0,201,167,.22))", opacity: dBandOp, ...css(dBandS) }} />
      {dLines.map((line, index) => (
        <span key={index} style={{ position: "absolute", zIndex: 1, background: line.c, backgroundSize: line.size, backgroundRepeat: line.size ? "no-repeat" : undefined, opacity: line.op, ...css(line.s) }} />
      ))}
      {dNodes.map((n) => (
        <div key={n.name} style={{ position: "absolute", zIndex: 2, left: n.left, top: n.top, width: 0, height: 0, opacity: n.op }}>
          <span style={{ position: "absolute", left: 0, top: 0, display: "grid", placeItems: "center", transform: n.tf, transition: "background .25s ease", ...css(n.dot) }}>
            {n.sw && n.e ? <MarkSwitch draw={n.e} size={n.ms} /> : null}
          </span>
          <span style={{ position: "absolute", display: "flex", flexDirection: "column", gap: 3, ...css(n.ls) }}>
            <strong style={{ fontSize: n.fs, fontWeight: 800, lineHeight: 1.2, color: n.nc }}>{n.name}</strong>
            <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.25, color: n.subC, opacity: n.subOp }}>{n.sub}</span>
          </span>
        </div>
      ))}
      <span style={{ position: "absolute", zIndex: 3, left: dHand.left, top: dHand.top, transform: dHand.tf, fontSize: 12, fontWeight: 700, color: "#B1C0E2", whiteSpace: "nowrap", opacity: dHand.op }}>{stepLabel}</span>
      {dTags.map((tag, index) => (
        <span key={index} style={{ position: "absolute", zIndex: 3, left: tag.left, top: tag.top, transform: tag.tf, fontSize: 12, fontWeight: 700, color: "#B1C0E2", whiteSpace: "nowrap", opacity: tag.op }}>{tag.text}</span>
      ))}
      <span style={{ position: "absolute", zIndex: 4, left: dTok.left, top: dTok.top, width: 14, height: 14, margin: "-7px 0 0 -7px", borderRadius: "50%", background: dTok.bg, boxShadow: "0 0 0 4px #0E2242", opacity: dTok.op }} />
    </div>
  );
};
