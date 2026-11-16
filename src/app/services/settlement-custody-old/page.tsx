import { LocalizedServicePageSection } from '@/containers/Sections/LocalizedServicePageSection';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';

const copy = serviceDictionaries.en.settlement;
export const metadata = {
  title: copy.title,
  description: copy.description,
  robots: { index: false, follow: true },
};

const SettlementCustodyOldPage = () => (
  <LocalizedServicePageSection service="settlement-custody" settlementVariant="archived" />
);

export default SettlementCustodyOldPage;
