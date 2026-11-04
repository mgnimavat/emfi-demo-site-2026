import { LegalHtml, LegalPage } from "@/components/legal/legal-page";
import notices from "@/content/legal-notices.json";

const notice = notices["scam-alert"];

export const metadata = { title: notice.title, description: "EMFI scam alert." };

export default function ScamAlertPage() {
  return <LegalPage title={notice.title}><LegalHtml html={notice.html} /></LegalPage>;
}
