import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.emfi.uk";
  const paths = [
    "/",
    "/services",
    "/services/research-execution",
    "/services/settlement-custody",
    "/services/wealth-asset-management",
    "/why-emfi",
    "/about",
    "/contact",
    "/terms-of-use",
    "/privacy-policy",
    "/privacy-policy/eea-users",
    "/privacy-policy/global-employees",
    "/privacy-policy/eea-employees",
    "/cookies-policy",
    "/scam-alert",
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
