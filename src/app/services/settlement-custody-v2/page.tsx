import { LocalizedServicePageSection } from '@/containers/Sections/LocalizedServicePageSection';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';

const copy = serviceDictionaries.en.settlement;

export const metadata = {
  title: `${copy.title} (v2)`,
  description: copy.description,
  robots: { index: false, follow: true },
};

const SettlementCustodyV2Page = () => (
  <LocalizedServicePageSection service="settlement-custody" settlementVariant="v2" />
);

export default SettlementCustodyV2Page;
