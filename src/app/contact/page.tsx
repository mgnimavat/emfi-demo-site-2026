import { ContactEnquirySection } from '@/containers/Sections/ContactEnquirySection';
import { About1Locations } from '@/components/sections/about-1-locations';
import { contact } from '@/content/contact';

export const metadata = { title: 'Contact', description: contact.heroBody };

const ContactPage = () => {
  return (
    <>
      <ContactEnquirySection />
      <About1Locations />
    </>
  );
};

export default ContactPage;
