import { HomePageSection } from '@/containers/Sections/HomePageSection';
import { marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';

const copy = marketingDictionaries.en.home;
export const metadata = {
  title: { absolute: copy.title },
  description: copy.description,
};
// Home: normal (native) mouse-wheel scrolling. The scroll-by-section effect lives on /home-25.
const HomePage = () => <HomePageSection nativeScroll />;
export default HomePage;
