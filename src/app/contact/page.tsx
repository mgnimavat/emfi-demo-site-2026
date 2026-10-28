import { ContactEnquirySection } from '@/containers/Sections/ContactEnquirySection';
import { contact } from '@/content/contact';

export const metadata = { title: 'Contact', description: contact.heroBody };

const ContactPage = () => {
  return <ContactEnquirySection />;
};

export default ContactPage;
