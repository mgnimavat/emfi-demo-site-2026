import { contact } from "@/content/contact-old";
import LegacyContactPage from "@/components/sections/legacy/contact-page";

export const metadata = {
  title: "Contact (old design)",
  description: contact.body,
  robots: { index: false, follow: true },
};

export default function ContactOldPage() {
  return <LegacyContactPage />;
}
