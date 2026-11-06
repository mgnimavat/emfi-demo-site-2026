import { LocalizedWhyPageSection } from '@/containers/Sections/LocalizedWhyPageSection';
import { marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';

const copy = marketingDictionaries.en.dependable;
export const metadata = { title: copy.title, description: copy.description };
const Page = () => <LocalizedWhyPageSection page="dependable-operations" />;
export default Page;
