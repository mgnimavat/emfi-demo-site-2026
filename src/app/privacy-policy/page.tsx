import { LegalHtml, LegalPage } from "@/components/legal/legal-page";
import notices from "@/content/legal-notices.json";

const notice = notices["privacy-policy"];

export const metadata = { title: notice.title, description: "EMFI privacy policy." };

export default function PrivacyPolicyPage() {
  return <LegalPage title={notice.title}><LegalHtml html={notice.html} /></LegalPage>;
}
