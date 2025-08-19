import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos",        pathname: "/**" },
      { protocol: "https", hostname: "placehold.co",         pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com",  pathname: "/**" },
      { protocol: "https", hostname: "source.unsplash.com",  pathname: "/**" },
    ]
  },
async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://localhost:5001/api/Properties/:path*",
      },
    ];
  },
};

export default withFlowbiteReact(nextConfig);
