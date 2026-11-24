import { Home24PageSection } from '@/containers/Sections/Home24PageSection';
import { marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';

const copy = marketingDictionaries.en.home;
export const metadata = {
  title: "Home 24",
  description: copy.description,
};
const Home24Page = () => <Home24PageSection />;
export default Home24Page;
