import { wealth } from '@/containers/Sections/ArchivedServices/a3d0954/content/wealth';
import { ServiceHero } from '@/containers/Sections/ArchivedServices/a3d0954/containers/Sections/ServiceHero';
import { WealthAssetSections } from '@/containers/Sections/ArchivedServices/a3d0954/containers/Sections/WealthAssetSections';
import styles from '@/containers/Sections/ServicePage.module.css';

export const metadata = { title: wealth.title, description: wealth.body };

const WealthAssetManagementPage = () => (
  <div className={styles.page}>
    <ServiceHero lines={wealth.heroLines} phrases={wealth.heroPhrases} />
    <WealthAssetSections />
  </div>
);

export default WealthAssetManagementPage;
