import { notFound } from "next/navigation";
import { LegalHtml, LegalPage } from "@/components/legal/legal-page";
import notices from "@/content/legal-notices.json";

const ids = ["eea-users", "global-employees", "eea-employees"] as const;

export function generateStaticParams() {
  return ids.map((notice) => ({ notice }));
}

export async function generateMetadata({ params }: { params: Promise<{ notice: string }> }) {
  const { notice } = await params;
  const doc = notices[notice as keyof typeof notices];
  return { title: doc?.title ?? "Privacy Policy" };
}

export default async function PrivacyNoticePage({ params }: { params: Promise<{ notice: string }> }) {
  const { notice } = await params;
  const doc = notices[notice as keyof typeof notices];
  if (!doc || notice === "privacy-policy" || notice === "scam-alert") notFound();
  return <LegalPage title={doc.title}><LegalHtml html={doc.html} /></LegalPage>;
}
