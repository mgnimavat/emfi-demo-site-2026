import type { RefObject } from 'react';
import styles from './WealthServiceHero.module.css';

type WealthLiquidGlassProps = {
  id: string;
  path: string;
  plot: { width: number; height: number };
  pointerGradientRef: RefObject<SVGRadialGradientElement | null>;
  pointerLightRef: RefObject<SVGPathElement | null>;
};

export const WealthLiquidGlass = ({ id, path, plot, pointerGradientRef, pointerLightRef }: WealthLiquidGlassProps) => (
  <g className={styles.liquidGlass} data-liquid-glass>
    <defs>
      <linearGradient id={`${id}-tint`} x1="0" x2=".12" y1="0" y2="1">
        <stop stopColor="var(--liquid-top, var(--color-blue-300))" stopOpacity=".85" />
        <stop offset="55%" stopColor="var(--liquid-mid, var(--color-blue-200))" stopOpacity=".7" />
        <stop offset="100%" stopColor="var(--liquid-base, var(--color-blue-200))" stopOpacity=".56" />
      </linearGradient>
      <radialGradient id={`${id}-aqua`} cx="23%" cy="77%" r="61%">
        <stop stopColor="var(--liquid-aqua)" stopOpacity=".65" />
        <stop offset="61%" stopColor="var(--liquid-aqua)" stopOpacity=".33" />
        <stop offset="100%" stopColor="var(--liquid-aqua)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-reflection`} cx="72%" cy="48%" r="44%" fx="68%" fy="42%">
        <stop stopColor="var(--bg-page)" stopOpacity=".46" />
        <stop offset="54%" stopColor="var(--bg-page)" stopOpacity=".19" />
        <stop offset="100%" stopColor="var(--bg-page)" stopOpacity="0" />
      </radialGradient>
      <clipPath id={`${id}-sheen-clip`}><path d={path} /></clipPath>
      <radialGradient id={`${id}-sheen`}>
        <stop stopColor="var(--bg-page)" stopOpacity=".34" />
        <stop offset="42%" stopColor="var(--bg-page)" stopOpacity=".2" />
        <stop offset="100%" stopColor="var(--bg-page)" stopOpacity="0" />
      </radialGradient>
      <radialGradient ref={pointerGradientRef} id={`${id}-pointer-light`}
        gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1">
        <stop stopColor="var(--bg-page)" stopOpacity=".72" />
        <stop offset="25%" stopColor="var(--bg-page)" stopOpacity=".51" />
        <stop offset="64%" stopColor="var(--color-blue-25)" stopOpacity=".21" />
        <stop offset="100%" stopColor="var(--color-blue-25)" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path d={path} fill={`url(#${id}-tint)`} />
    <path d={path} fill={`url(#${id}-aqua)`} />
    <path d={path} fill={`url(#${id}-reflection)`} />
    <g clipPath={`url(#${id}-sheen-clip)`}>
      <ellipse data-liquid-sheen className={styles.liquidSheen} fill={`url(#${id}-sheen)`}
        cx={plot.width * .54} cy={plot.height * .57} rx={plot.width * .28} ry={plot.height * .17} />
    </g>
    <path ref={pointerLightRef} d={path} fill={`url(#${id}-pointer-light)`}
      className={styles.liquidPointerLight} data-liquid-focus />
  </g>
);
