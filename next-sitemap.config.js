// next-sitemap.config.js
const fs = require('fs');
const path = require('path');

// 手动读取 JSON 文件
function readJsonFile(filePath) {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(fileContent);
}

const allBlogs = readJsonFile('./.contentlayer/generated/Blog/_index.json');
const allDocs = readJsonFile('./.contentlayer/generated/Doc/_index.json');

module.exports = {
    siteUrl: 'https://mkframework.muzzik.cc', // 替换为你的域名
    generateRobotsTxt: true, // 自动生成 robots.txt
    outputDir: './out', // 指定输出目录为 'out'
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' },
            // 可以添加更多策略，例如：
            // { userAgent: '*', disallow: ['/admin', '/private'] }
        ],
    },
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000, // 每个 sitemap 文件的最大 URL 数
    generateIndexSitemap: false, // 禁用生成 sitemap index 文件
    exclude: ['/404', '/500'], // 排除特定页面

    // 动态处理每个 URL 的配置
    transform: async (config, path) => {
        // 处理博客页面
        if (path.startsWith('/blog/')) {
            const slug = path.split('/')[2];
            const blog = allBlogs.find((blog) => blog.slug === slug);
            if (blog) {
                return {
                    loc: path,
                    changefreq: 'weekly',
                    priority: 0.8,
                    lastmod: new Date(blog.date).toISOString(),
                };
            }
        }

        // 处理文档页面
        if (path.startsWith('/docs/') || path === '/docs') {
            let slug = path === '/docs' ? [] : path.split('/').slice(2);
            let pathName = slug.join('/');
            const doc = allDocs.find((doc) => doc.slug === pathName);

            if (doc) {
                return {
                    loc: path,
                    changefreq: 'monthly',
                    priority: 0.9,
                    lastmod: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
                };
            }
        }

        // 默认处理静态页面
        return {
            loc: path,
            changefreq: config.changefreq,
            priority: config.priority,
            lastmod: new Date().toISOString(),
        };
    },

    // 生成额外的路径（例如，博客和文档）
    additionalPaths: async () => {
        const result = [];

        // 添加博客页面
        allBlogs.forEach((blog) => {
            result.push({
                loc: `/blog/${blog.slug}`,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: new Date(blog.date).toISOString(),
            });
        });

        // 添加文档页面
        allDocs.forEach((doc) => {
            result.push({
                loc: `/docs/${doc.slug}`,
                changefreq: 'monthly',
                priority: 0.9,
                lastmod: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
            });
        });

        // 添加根路径 /docs
        const firstPage = getPageRoutes()[0];
        if (firstPage) {
            result.push({
                loc: '/docs',
                changefreq: 'monthly',
                priority: 0.9,
                lastmod: new Date().toISOString(),
            });
        }

        return result;
    },
};

// 辅助函数：获取页面路由
function getPageRoutes() {
    // 这里需要根据你的实际逻辑实现
    // 例如，从 allDocs 中获取所有页面路由
    return allDocs.map((doc) => ({
        href: `/docs/${doc.slug}`,
        title: doc.title,
    }));
}