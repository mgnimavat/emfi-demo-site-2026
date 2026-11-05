import { LocalizedServicePageSection } from '@/containers/Sections/LocalizedServicePageSection';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';

const copy = serviceDictionaries.en.settlement;
export const metadata = { title: copy.title, description: copy.description };
const ServicePage = () => <LocalizedServicePageSection service="settlement-custody" />;
export default ServicePage;
