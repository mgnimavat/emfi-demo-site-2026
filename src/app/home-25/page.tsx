import { HomePageSection } from '@/containers/Sections/HomePageSection';
import { marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';

const copy = marketingDictionaries.en.home;
export const metadata = {
  title: { absolute: copy.title },
  description: copy.description,
};
// Home 25: the original home, keeping the one-wheel-step-per-section scroll effect.
const Home25Page = () => <HomePageSection />;
export default Home25Page;
