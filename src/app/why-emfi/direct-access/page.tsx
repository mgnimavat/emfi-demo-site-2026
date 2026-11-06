import { LocalizedWhyPageSection } from '@/containers/Sections/LocalizedWhyPageSection';
import { marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';

const copy = marketingDictionaries.en.direct;
export const metadata = { title: copy.title, description: copy.description };
const Page = () => <LocalizedWhyPageSection page="direct-access" />;
export default Page;
