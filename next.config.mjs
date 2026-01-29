/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "vrun-public-bucket.s3.us-east-2.amazonaws.com",
      "www.nanditoyota.com",
    ],
  },
};

export default nextConfig;
