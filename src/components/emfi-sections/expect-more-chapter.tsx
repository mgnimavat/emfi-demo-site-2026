"use client";

import type { CSSProperties } from "react";
import { AccountableSection } from "./accountable-section";
import { DirectSection } from "./direct-section";
import { ExpectSection } from "./expect-section";
import { ResponsiveSection } from "./responsive-section";
import styles from "./sections.module.css";
import { useAnimTimeline } from "./use-anim-timeline";
import { dirVals } from "./values";

const markMask = 'url("/emfi/emfi-mark.svg") center/contain no-repeat';

function MarkShape({ blend, fill }: { blend?: CSSProperties["mixBlendMode"]; fill: string }) {
  return <span style={{ position: "absolute", inset: 0, background: fill, mixBlendMode: blend, WebkitMask: markMask, mask: markMask }} />;
}

function MarkProgress({ blend, progress, tint }: { blend?: CSSProperties["mixBlendMode"]; progress: number; tint: number }) {
  const hidden = `${Math.max(0, Math.min(100, (1 - progress) * 100))}%`;
  const wash = (alpha: number) => `linear-gradient(102deg, rgba(162,194,253,${alpha}) 0%, rgba(128,152,204,${alpha}) 48%, rgba(0,201,167,${alpha}) 100%)`;
  return (
    <span style={{ position: "absolute", inset: 0, mixBlendMode: blend }}>
      <span style={{ position: "absolute", inset: 0, WebkitMask: markMask, mask: markMask, maskMode: "alpha" }}>
        <span style={{ position: "absolute", inset: 0, background: wash(tint), clipPath: `inset(0 0 ${hidden} 0)` }} />
      </span>
    </span>
  );
}

function MarkArt({ blend, fill, stroke, strokeOpacity, strokeWidth, dashOffset }: { blend?: CSSProperties["mixBlendMode"]; fill: string; stroke: string; strokeOpacity: number; strokeWidth: number; dashOffset: string }) {
  return (
    <>
      <MarkShape blend={blend} fill={fill} />
      <svg viewBox="0 0 145 145" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", mixBlendMode: blend }}>
        <path d="M72 84 V13 A59 59 0 1 0 116 33" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" pathLength={100} strokeDasharray="100 101" strokeDashoffset={dashOffset} opacity={strokeOpacity} />
      </svg>
    </>
  );
}

export function ExpectMoreChapter({ showPoints = true, showRouteTitle = false, loop = false, stepLabel = "Handover", highlightSlides = false, staticStandards = false, lightBands = false, markFill = true }: { showPoints?: boolean; showRouteTitle?: boolean; loop?: boolean; stepLabel?: string; highlightSlides?: boolean; staticStandards?: boolean; lightBands?: boolean; markFill?: boolean }) {
  const { chapRef, dRef, w, hdr, chapP, tD, canReplay, replayD } = useAnimTimeline({ loopDirect: loop });
  const V = w < 760;
  const compact = w < 1000;
  const cCols = compact ? "minmax(0,1fr)" : "minmax(0,38fr) minmax(0,62fr)";
  const cColsR = V ? "minmax(0,1fr)" : compact ? "minmax(0,58fr) minmax(0,42fr)" : "minmax(0,62fr) minmax(0,38fr)";
  const trOff = (100 * (1 - chapP)).toFixed(2);

  return (
    <div ref={chapRef} className={styles.chapter} style={{ position: "relative", isolation: lightBands ? "isolate" : undefined, background: "#071832" }}>
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="emfiGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#A2C2FD" />
            <stop offset=".48" stopColor="#8098CC" />
            <stop offset="1" stopColor="#00C9A7" />
          </linearGradient>
        </defs>
      </svg>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: lightBands ? 1 : 0, pointerEvents: "none", overflow: "clip" }}>
        <div style={{ position: "sticky", top: `${hdr}px`, height: `calc(100vh - ${hdr}px)`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: V ? "-45vw" : "-18vw", top: V ? "calc(50% - 60vw)" : "calc(50% - min(55vh, 39vw))", width: V ? "120vw" : "min(110vh, 78vw)", aspectRatio: "1" }}>
            {lightBands ? (
              <>
                <MarkShape blend="screen" fill="rgba(186,206,236,.026)" />
                {markFill && <MarkProgress blend="screen" progress={chapP} tint={0.016} />}
                <MarkShape blend="multiply" fill="rgba(168,188,214,.032)" />
                {markFill && <MarkProgress blend="multiply" progress={chapP} tint={0.05} />}
              </>
            ) : (
              <MarkArt fill="rgba(162,194,253,.02)" stroke="url(#emfiGrad)" strokeOpacity={0.18} strokeWidth={V ? 0.9 : 0.45} dashOffset={trOff} />
            )}
          </div>
        </div>
      </div>
      <ExpectSection showPoints={showPoints} raiseContent={lightBands} />
      <DirectSection cols={cCols} cardRef={dRef} canReplay={canReplay} onReplay={replayD} values={dirVals(tD, V)} showRouteTitle={showRouteTitle} showReplay={!loop} stepLabel={stepLabel} light={lightBands} />
      <ResponsiveSection cols={cColsR} textOrder={V ? 0 : 2} highlightSlides={highlightSlides} light={lightBands} />
      <AccountableSection cols={cCols} canReplay={canReplay} showReplay={!loop} staticStandards={staticStandards} raiseContent={lightBands} />
    </div>
  );
}
