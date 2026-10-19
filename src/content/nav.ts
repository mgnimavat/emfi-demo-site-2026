import navigation from "./site-navigation.json";

export const servicePages = [
  { label: "Research & Execution", href: "/services/research-execution" },
  { label: "Settlement & Custody", href: "/services/settlement-custody" },
  { label: "Wealth & Asset Management", href: "/services/wealth-asset-management" },
] as const;

export const navLinks = navigation.links;

export { default as footer } from "./site-footer.json";
