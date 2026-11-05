import { LocalizedServicePageSection } from '@/containers/Sections/LocalizedServicePageSection';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';

const copy = serviceDictionaries.en.wealth;
export const metadata = { title: copy.title, description: copy.description };
const ServicePage = () => <LocalizedServicePageSection service="wealth-asset-management" />;
export default ServicePage;
