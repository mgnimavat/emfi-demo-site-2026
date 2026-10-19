import styles from "./landing.module.css";
import navigation from "@/content/site-navigation.json";

export function BrandMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  return <svg viewBox="0 0 145 145" className={className} aria-hidden="true" focusable="false">
    <path className={animated ? "landing-mark-fill" : undefined} d={navigation.markPath} fill="currentColor" />
    {animated && <path className="landing-mark-trace" d={navigation.markPath} fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" />}
  </svg>;
}
export function ArrowIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
export function TechnologyIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="5" width="24" height="22" rx="4" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M4 11h24M10 16h6M10 21h12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><circle cx="8" cy="8" r=".9" fill="currentColor" /><circle cx="11" cy="8" r=".9" fill="currentColor" /></svg>;
}
export function PeopleIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M4.5 26v-2.5a7.5 7.5 0 0 1 15 0V26H4.5ZM22 7a4 4 0 0 1 0 8M22.5 19a6.5 6.5 0 0 1 5 6.5V26h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function RelationshipIcon() {
  return <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="17" cy="18" r="6" /><circle cx="31" cy="18" r="6" /><path d="M6 37c0-6 4.5-10 11-10s11 4 11 10M22 30c2.1-2 5.1-3 9-3 6.5 0 11 4 11 10" /></svg>;
}
export function ResponsibilityIcon() {
  return <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M24 5 39 11v11c0 10-6.3 16.4-15 21-8.7-4.6-15-11-15-21V11L24 5Z" /><path d="m16.5 24 5 5 10-11" /></svg>;
}
export function ConnectedIcon() {
  return <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="24" r="4" /><circle cx="25" cy="24" r="4" /><circle cx="40" cy="24" r="4" /><path d="M14 24h7m8 0h7" /></svg>;
}
// Exact endpoint geometry recovered from the supplied Archive 10 SVG markup.
export function ClientIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.1" /><path d="M5.2 19.2v-.8a4.6 4.6 0 0 1 4.6-4.6h4.4a4.6 4.6 0 0 1 4.6 4.6v.8" /></svg>;
}
export function DepositoryIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 20.5h17M6 20.5v-7M10 20.5v-7M14 20.5v-7M18 20.5v-7M12 3.2l8.2 5.2H3.8L12 3.2z" /></svg>;
}

export function SectionCurve() {
  return <div className={styles.curve} aria-hidden="true" />;
}
