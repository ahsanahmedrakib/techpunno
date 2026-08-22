import type { NextConfig } from "next";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
