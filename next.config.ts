import type { NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.freepik.com/**',
            },
        ],
    },
    // if used turbopack
    // transpilePackages: ["next-mdx-remote"],
};

export default withContentlayer(nextConfig);
