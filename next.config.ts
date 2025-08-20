import type { NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer';

const nextConfig: NextConfig = {
    output: 'export',
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.freepik.com/**',
            },
        ],
    },
    productionBrowserSourceMaps: true, // ✅ 输出浏览器可用的 sourceMap（便于排查）
    reactStrictMode: true,
    // if used turbopack
    // transpilePackages: ["next-mdx-remote"],
};

export default withContentlayer(nextConfig);
