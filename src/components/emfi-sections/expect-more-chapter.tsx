"use client";

import { AccountableSection } from "./accountable-section";
import { DirectSection } from "./direct-section";
import { ExpectSection } from "./expect-section";
import { ResponsiveSection } from "./responsive-section";
import styles from "./sections.module.css";
import { useAnimTimeline } from "./use-anim-timeline";
import { dirVals } from "./values";

export function ExpectMoreChapter({ fontClass }: { fontClass: string }) {
  const { chapRef, dRef, w, hdr, chapP, tD, canReplay, replayD } = useAnimTimeline();
  const V = w < 760;
  const compact = w < 1000;
  const cCols = compact ? "minmax(0,1fr)" : "minmax(0,38fr) minmax(0,62fr)";
  const cColsR = V ? "minmax(0,1fr)" : compact ? "minmax(0,58fr) minmax(0,42fr)" : "minmax(0,62fr) minmax(0,38fr)";
  const trOff = (100 * (1 - chapP)).toFixed(2);

  return (
    <div ref={chapRef} className={`${fontClass} ${styles.chapter}`} style={{ position: "relative", background: "#071832" }}>
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="emfiGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#A2C2FD" />
            <stop offset=".48" stopColor="#8098CC" />
            <stop offset="1" stopColor="#00C9A7" />
          </linearGradient>
        </defs>
      </svg>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "clip" }}>
        <div style={{ position: "sticky", top: `${hdr}px`, height: `calc(100vh - ${hdr}px)`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: V ? "-45vw" : "-18vw", top: "50%", width: V ? "120vw" : "min(110vh, 78vw)", aspectRatio: "1", transform: "translateY(-50%)" }}>
            <span style={{ position: "absolute", inset: 0, background: "rgba(162,194,253,.02)", WebkitMask: 'url("/emfi/emfi-mark.svg") center/contain no-repeat', mask: 'url("/emfi/emfi-mark.svg") center/contain no-repeat' }} />
            <svg viewBox="0 0 145 145" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
              <path d="M72 84 V13 A59 59 0 1 0 116 33" fill="none" stroke="url(#emfiGrad)" strokeWidth={V ? ".9" : ".45"} strokeLinecap="round" pathLength={100} strokeDasharray="100 101" strokeDashoffset={trOff} opacity=".18" />
            </svg>
          </div>
        </div>
      </div>
      <ExpectSection />
      <DirectSection cols={cCols} cardRef={dRef} canReplay={canReplay} onReplay={replayD} values={dirVals(tD, V)} />
      <ResponsiveSection cols={cColsR} textOrder={V ? 0 : 2} />
      <AccountableSection cols={cCols} canReplay={canReplay} />
    </div>
  );
}
