import { HomePageSection } from '@/containers/Sections/HomePageSection';
import { marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';

const copy = marketingDictionaries.en.home;
export const metadata = {
  title: { absolute: copy.title },
  description: copy.description,
};
const HomePage = () => <HomePageSection />;
export default HomePage;
