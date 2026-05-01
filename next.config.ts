import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath: "/flaneur",
        assetPrefix: "/flaneur/",
        images: {
          unoptimized: true,
        },
      }
    : {}),
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
