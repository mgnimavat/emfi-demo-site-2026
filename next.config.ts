import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ["three"],
  async redirects() {
    return [
      {
        source: "/capabilities",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/intelligence",
        destination: "/services/research-execution",
        permanent: true,
      },
      {
        source: "/services/execution",
        destination: "/services/research-execution",
        permanent: true,
      },
      {
        source: "/services/wealth-managers",
        destination: "/services/wealth-asset-management",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
