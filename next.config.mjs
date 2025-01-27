/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  experimental: {
    runtime: 'edge',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '*',
        pathname: '**',
      },
    ],
  },
};

export default config;
