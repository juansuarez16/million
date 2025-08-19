import withFlowbiteReact from "flowbite-react/plugin/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      // agrega aquí tu CDN si cambias de host
    ],
  },
};
export default withFlowbiteReact(nextConfig);