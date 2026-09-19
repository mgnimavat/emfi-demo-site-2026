import type { CSSProperties } from "react";
import { BrandSign } from "@/components/brand/logo";

const heroGlassReveal = {
  accent: "var(--text-primary)",
  title: "EMFI",
  subtitle: "DIRECT ACCESS",
  duration: "10s",
  ease: "linear",
  width: 780,
  height: 472,
  panelWidth: 118,
  panelHeight: 292,
  panels: [
    { id: "L3", z: 1, x1: -40, r1: -18, x2: -92, r2: -12, x3: -158, r3: -10, x4: -236, r4: -8, o4: 0.5, x5: -310, r5: -6, o5: 0 },
    { id: "L2", z: 2, x1: -24, r1: -11, x2: -56, r2: -7, x3: -108, r3: -6, x4: -170, r4: -5, o4: 0.72, x5: -232, r5: -4, o5: 0.16 },
    { id: "L1", z: 3, x1: -8, r1: -5, x2: -24, r2: -3, x3: -62, r3: -3, x4: -122, r4: -2, o4: 1, x5: -172, r5: -2, o5: 1 },
    { id: "R1", z: 3, x1: 8, r1: 5, x2: 24, r2: 3, x3: 62, r3: 3, x4: 122, r4: 2, o4: 1, x5: 172, r5: 2, o5: 1 },
    { id: "R2", z: 2, x1: 24, r1: 11, x2: 56, r2: 7, x3: 108, r3: 6, x4: 170, r4: 5, o4: 0.72, x5: 232, r5: 4, o5: 0.16 },
    { id: "R3", z: 1, x1: 40, r1: 18, x2: 92, r2: 12, x3: 158, r3: 10, x4: 236, r4: 8, o4: 0.5, x5: 310, r5: 6, o5: 0 },
  ],
} as const;

type HeroGlassRevealProps = {
  accent?: string;
  title?: string;
  subtitle?: string;
  duration?: string;
  className?: string;
};

export function HeroGlassReveal({
  accent = heroGlassReveal.accent,
  title = heroGlassReveal.title,
  subtitle = heroGlassReveal.subtitle,
  duration = heroGlassReveal.duration,
  className,
}: HeroGlassRevealProps) {
  return (
    <section
      className={className}
      aria-label={`${title} ${subtitle}`}
      style={
        {
          "--glass-accent": accent,
          "--glass-duration": duration,
          "--glass-ease": heroGlassReveal.ease,
          "--glass-w": heroGlassReveal.width,
          "--glass-h": heroGlassReveal.height,
          "--glass-panel-w": `${heroGlassReveal.panelWidth}px`,
          "--glass-panel-h": `${heroGlassReveal.panelHeight}px`,
        } as CSSProperties
      }
    >
      <div className="emfi-glass-frame">
        <div className="emfi-glass-stage">
          <span className="emfi-glass-floor" aria-hidden />
          {heroGlassReveal.panels.map((panel) => (
            <div
              key={panel.id}
              aria-hidden
              className="emfi-glass-panel"
              style={
                {
                  "--z": panel.z,
                  "--x1": `${panel.x1}px`,
                  "--r1": `${panel.r1}deg`,
                  "--x2": `${panel.x2}px`,
                  "--r2": `${panel.r2}deg`,
                  "--x3": `${panel.x3}px`,
                  "--r3": `${panel.r3}deg`,
                  "--x4": `${panel.x4}px`,
                  "--r4": `${panel.r4}deg`,
                  "--o4": panel.o4,
                  "--x5": `${panel.x5}px`,
                  "--r5": `${panel.r5}deg`,
                  "--o5": panel.o5,
                } as CSSProperties
              }
            />
          ))}
          <div className="emfi-glass-center">
            <span className="emfi-glass-icon">
              <BrandSign className="h-14 w-14" />
            </span>
            <p className="emfi-glass-title">{title}</p>
            <p className="emfi-glass-subtitle">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
