import { LocalizedServicePageSection } from '@/containers/Sections/LocalizedServicePageSection';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';

const copy = serviceDictionaries.en.wealth;

export const metadata = {
  title: `${copy.redesign.hero.title} (Glass)`,
  description: copy.description,
  robots: { index: false, follow: true },
};

const WealthAssetManagementGlassPage = () => (
  <LocalizedServicePageSection service="wealth-asset-management" wealthVariant="glass" />
);

export default WealthAssetManagementGlassPage;
