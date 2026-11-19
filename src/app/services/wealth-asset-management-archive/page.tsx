import { LocalizedServicePageSection } from '@/containers/Sections/LocalizedServicePageSection';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';

const copy = serviceDictionaries.en.wealth;
export const metadata = {
  title: copy.title,
  description: copy.description,
  robots: { index: false, follow: true },
};

const WealthAssetManagementArchivePage = () => (
  <LocalizedServicePageSection service="wealth-asset-management" wealthVariant="archive" />
);

export default WealthAssetManagementArchivePage;
