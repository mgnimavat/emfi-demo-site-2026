"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { ExecutionWorkstation } from "@/containers/Sections/ExecutionWorkstation";
import { SettlementDashboard } from "@/containers/Sections/SettlementDashboard";
import styles from "./scaled-mockup.module.css";

/** Scales a mockup so the union of its `panels` (not its own padding) exactly fills the box. */
function ScaledMockup({ width, panels, stretch = false, children }: { width: number; panels: string; stretch?: boolean; children: ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    // Layout offsets, not client rects, so entrance animations on the panels don't skew the fit.
    const bounds = () => {
      let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
      inner.querySelectorAll<HTMLElement>(panels).forEach((el) => {
        if (!el.offsetWidth || !el.offsetHeight) return;
        let x = 0, y = 0;
        for (let node: HTMLElement | null = el; node && node !== inner; node = node.offsetParent as HTMLElement | null) {
          x += node.offsetLeft;
          y += node.offsetTop;
        }
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x + el.offsetWidth);
        bottom = Math.max(bottom, y + el.offsetHeight);
      });
      return Number.isFinite(left) ? { left, top, width: right - left, height: bottom - top } : { left: 0, top: 0, width: inner.offsetWidth, height: inner.offsetHeight };
    };
    const measure = () => {
      const boxW = box.clientWidth;
      const boxH = box.clientHeight;
      if (!boxW || !boxH) return;
      inner.style.transform = "none";
      // Re-flow the mockup at a width whose panel shape matches the box, so it fills both axes.
      let w = width;
      let b = bounds();
      for (let i = 0; i < 6; i++) {
        inner.style.width = `${w}px`;
        b = bounds();
        const next = Math.min(width * 1.6, Math.max(width * 0.8, w + b.height * (boxW / boxH) - b.width));
        if (Math.abs(next - w) < 1) break;
        w = next;
      }
      inner.style.width = `${w}px`;
      inner.style.removeProperty("--mockup-fill-h");
      b = bounds();
      let scale = Math.min(boxW / b.width, boxH / b.height);
      if (stretch && b.height * scale < boxH - 1) {
        // Panels can't reshape by width alone; grow them to the box height instead.
        inner.style.setProperty("--mockup-fill-h", `${boxH / scale + inner.offsetHeight - b.height}px`);
        b = bounds();
        scale = Math.min(boxW / b.width, boxH / b.height);
      }
      const x = (boxW - b.width * scale) / 2 - b.left * scale;
      const y = (boxH - b.height * scale) / 2 - b.top * scale;
      inner.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [width, panels, stretch]);

  return (
    <div ref={boxRef} className={styles.box}>
      <div ref={innerRef} className={styles.inner} style={{ width }}>
        {children}
      </div>
    </div>
  );
}

export function SettlementDashboardFit() {
  return (
    <ScaledMockup width={960} panels="article" stretch>
      <SettlementDashboard />
    </ScaledMockup>
  );
}

export function ExecutionWorkstationFit() {
  return (
    <ScaledMockup width={1160} panels="fieldset > div > figure, fieldset > div > div > form, fieldset > div > section">
      <ExecutionWorkstation maskVariant="initial-stars" />
    </ScaledMockup>
  );
}
