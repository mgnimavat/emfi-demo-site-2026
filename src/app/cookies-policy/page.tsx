import { CookieSettings } from "@/components/legal/cookie-settings";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata = { title: "Cookies Policy", description: "How EMFI uses cookies on this website." };

export default function CookiesPolicyPage() {
  return <LegalPage title="Cookies Policy"><CookieSettings /></LegalPage>;
}
