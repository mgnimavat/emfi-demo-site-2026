import { settlement } from '@/content/settlement';
import { ServiceHero } from '@/containers/Sections/ServiceHero';
import { SettlementCustodySections } from '@/containers/Sections/SettlementCustodySections';
import { ResearchExecutionHeroMockup } from '@/components/home-17/research-execution-hero';
import styles from '@/containers/Sections/ServicePage.module.css';

export const metadata = { title: settlement.title, description: settlement.description };
const heroViews = ['FloatingPhones'] as const;

const SettlementCustodyPage = () => (
  <div className={styles.page}>
    <ServiceHero
      lines={settlement.heroLines}
      phrases={settlement.heroPhrases}
      typewriter={settlement.heroTypewriter}
      visual={<ResearchExecutionHeroMockup views={heroViews} quietFrame square trimChrome appBar />}
    />
    <SettlementCustodySections />
  </div>
);

export default SettlementCustodyPage;
