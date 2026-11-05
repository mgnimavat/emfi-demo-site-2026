'use client';

import { useEffect, useState } from 'react';
import { DirectRouteAnimation } from '@/components/emfi-sections/direct-route-animation';
import { cardStyle } from '@/components/emfi-sections/css';
import { useAnimTimeline } from '@/components/emfi-sections/use-anim-timeline';
import { directPaceScale, dirVals } from '@/components/emfi-sections/values';
import routeStyles from '@/components/emfi-sections/sections.module.css';
import styles from './SettlementHeroAnimation.module.css';

const routeTitles = { conventional: 'Conventional Route', direct: 'EMFI Route' };
const compactRouteWidth = 500;
const heroRouteStops = [4, 26, 54, 76, 96] as const;

export const SettlementHeroAnimation = ({ showTitle = true }: { showTitle?: boolean }) => {
  const { chapRef, dRef, tD } = useAnimTimeline({
    loopDirect: true,
    directScale: directPaceScale('home12'),
  });
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const element = dRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setCompact(entry.contentRect.width < compactRouteWidth);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [dRef]);

  const values = dirVals(tD, compact, routeTitles, 'home12', compact ? undefined : heroRouteStops);

  return (
    <div ref={chapRef} className={styles.visual}>
      <div ref={dRef} className={`${styles.routeCard} ${compact ? styles.compactCard : ''}`} style={showTitle ? cardStyle : { ...cardStyle, paddingTop: cardStyle.padding }}>
        {showTitle ? <p className={routeStyles.routeTitle}>
          <span className={values.dRouteTitle === routeTitles.direct
            ? routeStyles.routeTitleEmfi
            : routeStyles.routeTitleConventional}>
            {values.dRouteTitle}
          </span>
        </p> : null}
        <DirectRouteAnimation values={values} />
      </div>
    </div>
  );
};
