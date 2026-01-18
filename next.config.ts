import type { NextConfig } from 'next';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '7w57immd3n.ufs.sh',
        port: '',
        pathname: '/f/**',
      },
    ],
  },
};

export default nextConfig;
