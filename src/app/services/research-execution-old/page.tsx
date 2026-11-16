import { LocalizedServicePageSection } from '@/containers/Sections/LocalizedServicePageSection';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';

const copy = serviceDictionaries.en.research;
export const metadata = {
  title: copy.title,
  description: copy.description,
  robots: { index: false, follow: true },
};

const ResearchExecutionOldPage = () => (
  <LocalizedServicePageSection service="research-execution" researchVariant="archived" />
);

export default ResearchExecutionOldPage;
