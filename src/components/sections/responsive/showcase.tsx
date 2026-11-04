'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { responsiveTechnology } from '@/content/responsive-technology';
import { SettlementDashboard } from '@/containers/Sections/SettlementDashboard';
import { ExecutionWorkstation } from '@/containers/Sections/ExecutionWorkstation';
import styles from './showcase.module.css';

const compactQuery = '(max-width: 899px)';
const subscribeToLayout = (onChange: () => void) => {
  const query = window.matchMedia(compactQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const isCompact = () => window.matchMedia(compactQuery).matches;
const serverLayout = () => false;
const dashboardFrames = [
  { opacity: 1, x: '0%', y: '-50%' },
  { opacity: 0, x: '-110%', y: '-50%' },
];
const workstationFrames = [
  { opacity: 0, x: '110%', y: '-50%' },
  { opacity: 1, x: '0%', y: '-50%' },
];
const compactFrame = { opacity: 1, x: 0, y: 0 };

export const ResponsiveShowcase = () => {
  const reduced = useReducedMotion();
  const compact = useSyncExternalStore(subscribeToLayout, isCompact, serverLayout);
  const stageRef = useRef<HTMLDivElement>(null);
  const visible = useInView(stageRef, { amount: 0.15 });
  const [phase, setPhase] = useState(0);
  const activePhase = reduced ? 0 : phase;

  useEffect(() => {
    if (reduced || compact || !visible) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setPhase((current) => (current + 1) % dashboardFrames.length);
    }, responsiveTechnology.showcase.heroSequenceStepMs);
    return () => window.clearInterval(timer);
  }, [compact, reduced, visible]);

  return (
    <div ref={stageRef} className={styles.stage} data-preview-phase={activePhase} aria-hidden inert>
      <motion.div className={styles.dashboard} initial={false} animate={compact ? compactFrame : dashboardFrames[activePhase]} transition={{ duration: reduced ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}>
        <div className={styles.clip}><div className={styles.dashboardScale}><SettlementDashboard /></div></div>
      </motion.div>
      <motion.div className={styles.execution} initial={false} animate={compact ? compactFrame : workstationFrames[activePhase]} transition={{ duration: reduced ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}>
        <div className={styles.clip}><div className={styles.executionScale}><ExecutionWorkstation /></div></div>
      </motion.div>
    </div>
  );
};
