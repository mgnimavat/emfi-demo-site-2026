import { HeroDashboardScreen } from '@/components/home-17/operating-view';
import styles from './SettlementDashboard.module.css';

export const SettlementDashboard = () => (
  <div
    className={styles.viewport}
    role="region"
    aria-label="Illustrative portfolio dashboard"
    tabIndex={0}
  >
    <div className={styles.preview}>
      <HeroDashboardScreen bare trimChrome />
    </div>
  </div>
);
