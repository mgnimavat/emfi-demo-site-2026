import { wealth } from '@/content/wealth';
import { ServiceHero } from '@/containers/Sections/ServiceHero';
import { WealthAssetSections } from '@/containers/Sections/WealthAssetSections';
import wealthStyles from '@/containers/Sections/WealthAssetSections.module.css';
import styles from '@/containers/Sections/ServicePage.module.css';

export const metadata = { title: wealth.title, description: wealth.description };

const WealthAssetManagementPage = () => (
  <div className={styles.page}>
    <ServiceHero
      lines={wealth.heroLines}
      phrases={wealth.heroPhrases}
      typewriter={wealth.heroTypewriter}
      taglineClassName={wealthStyles.heroTagline}
    />
    <WealthAssetSections />
  </div>
);

export default WealthAssetManagementPage;
