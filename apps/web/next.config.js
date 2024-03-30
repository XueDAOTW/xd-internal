/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "buzhidao.s3.amazonaws.com",
      "buzhidao.s3.us-east-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
