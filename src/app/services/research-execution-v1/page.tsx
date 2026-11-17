import { LocalizedServicePageSection } from '@/containers/Sections/LocalizedServicePageSection';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';

const copy = serviceDictionaries.en.research;
export const metadata = { title: copy.title, description: copy.description };
const ServicePage = () => <LocalizedServicePageSection service="research-execution" />;
export default ServicePage;
