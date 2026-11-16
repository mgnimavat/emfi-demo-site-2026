import { ServiceHero } from '@/containers/Sections/ServiceHero';
import { ServiceLocaleProvider } from '@/ui/hooks/useServiceLocale';
import heroStyles from '@/components/sections/execution/page.module.css';
import styles from '@/containers/Sections/ServicePage.module.css';
import localeStyles from '@/containers/Sections/LocalizedServicePageSection.module.css';
import { WealthAssetSections } from './WealthAssetSections';
import copy from './wealth.json';

export const WealthAssetManagementPageSection = () => (
  <ServiceLocaleProvider locale="en" messages={copy.ui}>
    <div data-service="wealth-asset-management" lang="en" dir="ltr"
      className={`${styles.page} ${localeStyles.page}`}>
      <ServiceHero lines={copy.heroLines} phrases={copy.heroPhrases}
        typewriter={copy.heroTypewriter} taglineClassName={heroStyles.wealthTagline}
        headlineClassName={heroStyles.wideHeadline} />
      <WealthAssetSections />
    </div>
  </ServiceLocaleProvider>
);
