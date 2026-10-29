import { wealth } from '@/content/wealth';
import { ServiceHero } from '@/containers/Sections/ServiceHero';
import { WealthAssetSections } from '@/containers/Sections/WealthAssetSections';
import styles from '@/containers/Sections/ServicePage.module.css';

export const metadata = { title: wealth.title, description: wealth.body };

const WealthAssetManagementPage = () => (
  <div className={styles.page}>
    <ServiceHero lines={wealth.heroLines} phrases={wealth.heroPhrases} />
    <WealthAssetSections />
  </div>
);

export default WealthAssetManagementPage;
