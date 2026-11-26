import { LocalizedServicePageSection } from '@/containers/Sections/LocalizedServicePageSection';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';

const copy = serviceDictionaries.en.wealth;

export const metadata = {
  title: `${copy.redesign.hero.title} (v2)`,
  description: copy.description,
  robots: { index: false, follow: true },
};

const WealthAssetManagementV2Page = () => (
  <LocalizedServicePageSection service="wealth-asset-management" wealthVariant="v2" />
);

export default WealthAssetManagementV2Page;
