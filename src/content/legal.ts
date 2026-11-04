export const legalDocuments = [
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Privacy Policy: EEA Users", href: "/privacy-policy/eea-users" },
  { label: "Privacy Policy: Global Employees", href: "/privacy-policy/global-employees" },
  { label: "Privacy Policy: EEA Employees", href: "/privacy-policy/eea-employees" },
  { label: "Cookies Policy", href: "/cookies-policy" },
  { label: "Scam Alert", href: "/scam-alert" },
] as const;

export const cookiesPolicy = [
  {
    id: "intro",
    title: null,
    locked: false,
    body: "We use cookies to provide you with a safe, effective and user-friendly website. Please visit our Privacy Policy if you want to learn more about our privacy and cookies policy. If you do not agree to this Statement, do not proceed to further web pages of the EMFI Website.",
  },
  {
    id: "performance",
    title: "Performance & tracking cookies",
    locked: false,
    body: "We use performance & tracking cookies to further improve our website in order to always provide you with the best possible online experience tailored to your needs. We never store any personal data which might identify you personally (such as your IP address) or as a client of EMFI.",
  },
  {
    id: "userPref",
    title: "User preference cookies",
    locked: false,
    body: "User preference cookies are used to facilitate your access to emfi.uk. We use them to show you the correct EMFI homepage and language for your country and to remember these settings when you visit emfi.uk the next time.",
  },
  {
    id: "technical",
    title: "Technical cookies",
    locked: true,
    body: "Technical cookies are strictly necessary for emfi.uk to work properly. We use them to remember your entries in a form or to provide you access to login restricted areas of the website. Technical cookies cannot be deactivated.",
  },
] as const;
