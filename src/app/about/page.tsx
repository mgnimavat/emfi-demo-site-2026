import { AboutPageSection } from '@/containers/Sections/AboutPageSection';
import { dictionaries } from '@/lib/i18n';

export const metadata = { title: dictionaries.en.about.title, description: dictionaries.en.about.description };
const AboutPage = () => <AboutPageSection />;
export default AboutPage;
