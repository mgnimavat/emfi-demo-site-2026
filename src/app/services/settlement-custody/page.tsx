import { settlement } from '@/content/settlement';
import { ServiceHero } from '@/containers/Sections/ServiceHero';
import { SettlementCustodySections } from '@/containers/Sections/SettlementCustodySections';
import styles from '@/containers/Sections/ServicePage.module.css';

export const metadata = { title: settlement.title, description: settlement.description };

const SettlementCustodyPage = () => (
  <div className={styles.page}>
    <ServiceHero
      lines={settlement.heroLines}
      phrases={settlement.heroPhrases}
      typewriter={settlement.heroTypewriter}
    />
    <SettlementCustodySections />
  </div>
);

export default SettlementCustodyPage;
