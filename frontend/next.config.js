/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demo.achromatic.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;