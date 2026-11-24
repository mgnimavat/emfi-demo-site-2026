'use client';

import { useEffect, useState } from 'react';
import { useServiceLocale } from '@/ui/hooks/useServiceLocale';
import { DirectRouteAnimation } from '@/components/emfi-sections/direct-route-animation';
import { useAnimTimeline } from '@/components/emfi-sections/use-anim-timeline';
import { infraRouteVals } from '@/components/emfi-sections/values';
import styles from './SettlementHeroAnimation.module.css';

const compactRouteWidth = 500;
/** ~6.9s loop (was ~3.9s; +3s). */
const infraRouteScale = 6900 / 13000;

type InfraStep = { label: string; detail?: string };

export const InfrastructureRouteDiagram = ({
  steps,
  label,
}: {
  steps: readonly InfraStep[];
  label?: string;
}) => {
  const { t } = useServiceLocale();
  const { chapRef, dRef, tD } = useAnimTimeline({ loopDirect: true, directScale: infraRouteScale });
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

  const routeSteps = [
    steps[0] ?? { label: 'Client Instruction' },
    steps[1] ?? { label: 'EMFI' },
    steps[2] ?? { label: 'Market infrastructure' },
  ] as const;
  const values = infraRouteVals(tD, compact, routeSteps);

  return (
    <div ref={chapRef} className={styles.visual}>
      <div ref={dRef} className={`${styles.infraRoute} ${compact ? styles.compactCard : ''}`}>
        <DirectRouteAnimation
          values={{
            ...values,
            dNodes: values.dNodes.map((node) => ({ ...node, name: t(node.name), sub: t(node.sub) })),
          }}
          stepLabel={t('Handover')}
          ariaLabel={label ?? t('Client instruction moves through EMFI to market infrastructure.')}
        />
      </div>
    </div>
  );
};
