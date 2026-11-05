import { ContactPageSection } from '@/containers/Sections/ContactPageSection';
import { dictionaries } from '@/lib/i18n';

export const metadata = { title: dictionaries.en.contact.title, description: dictionaries.en.contact.description };
const ContactPage = () => <ContactPageSection />;
export default ContactPage;
