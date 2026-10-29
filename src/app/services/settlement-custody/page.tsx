import { settlement } from '@/content/settlement';
import { ServiceHero } from '@/containers/Sections/ServiceHero';
import { SettlementCustodySections } from '@/containers/Sections/SettlementCustodySections';
import styles from '@/containers/Sections/ServicePage.module.css';

export const metadata = { title: settlement.title, description: settlement.body };

const SettlementCustodyPage = () => (
  <div className={styles.page}>
    <ServiceHero lines={settlement.heroLines} phrases={settlement.heroPhrases} />
    <SettlementCustodySections />
  </div>
);

export default SettlementCustodyPage;
