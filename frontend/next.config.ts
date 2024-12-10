import type { NextConfig } from "next";

// const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  images: {
    unoptimized: true
  },
  experimental: {
    reactCompiler: true
  }
};

// if (!isDev) {
//   nextConfig.assetPrefix = ".";
// }

export default nextConfig;
