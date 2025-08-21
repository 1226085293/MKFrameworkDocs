import type { NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer';

const isProd = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
    output: 'export',
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // 允许所有域名
            },
            {
                protocol: 'http',
                hostname: '**', // 如果有 HTTP 图片也允许
            },
        ],
        unoptimized: true, // 禁用 Next.js 图片优化器
    },
    productionBrowserSourceMaps: true, // ✅ 输出浏览器可用的 sourceMap（便于排查）
    reactStrictMode: true,
    basePath: isProd ? '/MKFrameworkDocs' : '',
    assetPrefix: isProd ? '/MKFrameworkDocs/' : '',
};

export default withContentlayer(nextConfig);
