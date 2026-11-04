"use client";

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { responsiveTechnology } from '@/content/responsive-technology';
import { SettlementDashboard } from '@/containers/Sections/SettlementDashboard';
import { ExecutionWorkstation } from '@/containers/Sections/ExecutionWorkstation';
import styles from './ResponsiveTechnologyShowcase.module.css';

export const ResponsiveTechnologyShowcase = () => {
  const reduced = useReducedMotion();

  return (
    <div className={styles.stage} aria-hidden inert>
      <motion.div className={styles.dashboard} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.clip}>
          <div className={styles.dashboardScale}><SettlementDashboard /></div>
        </div>
      </motion.div>
      <motion.div className={styles.execution} initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: reduced ? 0 : 0.12 }}>
        <div className={styles.clip}>
          <div className={styles.executionScale}><ExecutionWorkstation /></div>
        </div>
      </motion.div>
      <motion.div className={styles.phones} initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: reduced ? 0 : 0.24 }}>
        {responsiveTechnology.showcase.screens.map((screen) => (
          <div key={screen.src} className={styles.phone}>
            <Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} unoptimized />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
