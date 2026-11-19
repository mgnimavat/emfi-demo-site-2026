import type { MetadataRoute } from "next";

const authEnabled = Boolean(process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASSWORD);

export default function robots(): MetadataRoute.Robots {
  if (authEnabled) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/demo/"],
    },
  };
}
