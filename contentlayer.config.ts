import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypePrism from 'rehype-prism-plus';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import GithubSlugger from 'github-slugger';
import { rehypePlantuml } from './lib/rehype-plugins/rehype-plantuml';
import { rehypeCodeTitlesWithLogo } from './lib/rehype-plugins/rehype-code-titles-with-logo';
import { rehypeSlugWithPath } from './lib/rehype-plugins/rehype-slug-with-path';

// 定义 Docs 文档类型
export const Doc = defineDocumentType(() => ({
    name: 'Doc',
    filePathPattern: `docs/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        description: { type: 'string', required: false },
        noLink: { type: 'boolean', default: false },
        tag: { type: 'string', required: false },
        order: { type: 'number', required: false },
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: (doc) => doc._raw.flattenedPath.replace(/^docs\//, ''),
        },
        slugArray: {
            type: 'json',
            resolve: (doc) => doc._raw.flattenedPath.replace(/^docs\//, '').split('/'),
        },
        toc: {
            type: 'json',
            resolve: (doc: any) => {
                const raw = (doc.body?.raw ?? '') as string;

                // 使用正则找到 markdown heading（H2~H4）
                const headingRegex = /^(#{2,4})\s+(.+)$/gm;
                const matches = Array.from(raw.matchAll(headingRegex));

                const slugger = new GithubSlugger();
                const stack: { level: number; slug: string }[] = []; // 维护标题层级栈
                const extracted: { level: number; text: string; href: string }[] = [];

                for (const m of matches) {
                    let text = String(m[2] || '').trim();

                    // 清洗文本（和之前一样）
                    text = text
                        .replace(/`(.+?)`/g, '$1')
                        .replace(/$$(.*?)$$$(?:.*?)$/g, '$1')
                        .replace(/^\s+|\s+$/g, '')
                        .replace(/[*\\~]/g, '');

                    if (!text) continue;

                    const level = (m[1] || '').length; // ## => 2, ### => 3, #### => 4

                    // 生成当前标题的 slug
                    const slug = slugger.slug(text);

                    // 更新栈：移除比当前 level 更深或同级的标题
                    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                        stack.pop();
                    }

                    // 压入当前标题
                    stack.push({ level, slug });

                    // 构建带前缀的路径：父级 slug 用 / 连接
                    const prefix = stack
                        .slice(0, -1)
                        .map((item) => item.slug)
                        .join('/');
                    const href = prefix ? `#${prefix}/${slug}` : `#${slug}`;

                    extracted.push({
                        level: level - 1, // 如果你希望 level 从 1 开始（H2=1, H3=2...），保留这行；否则用 level
                        text,
                        href,
                    });
                }

                return extracted;
            },
        },
    },
}));

// 定义 Blog 文档类型
export const Blog = defineDocumentType(() => ({
    name: 'Blog',
    filePathPattern: `blogs/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        description: { type: 'string', required: true },
        date: { type: 'date', required: true },
        authors: { type: 'json', required: true },
        cover: { type: 'string', required: true },
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: (blog) =>
                blog._raw.flattenedPath.replace(/^blogs\//, '').replace(/\.mdx$/, ''),
        },
    },
}));

const preProcess = () => (tree: any) => {
    visit(tree, (node) => {
        if (node?.type === 'element' && node?.tagName === 'pre') {
            const [codeEl] = node.children;
            if (codeEl.tagName !== 'code') return;
            node.raw = codeEl.children?.[0].value;
        }
    });
};

const postProcess = () => (tree: any) => {
    visit(tree, 'element', (node) => {
        if (node?.type === 'element' && node?.tagName === 'pre') {
            node.properties['raw'] = node.raw;
        }
    });
};

export default makeSource({
    contentDirPath: 'contents',
    documentTypes: [Doc, Blog],
    disableImportAliasWarning: true, // 添加这行来禁用警告
    mdx: {
        cwd: process.cwd(),
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            preProcess,
            rehypeCodeTitles,
            rehypeCodeTitlesWithLogo,
            rehypePlantuml,
            rehypePrism as any,
            rehypeSlugWithPath,
            [
                rehypeAutolinkHeadings,
                {
                    behavior: 'append', // 在标题后追加 #
                    properties: {
                        className: 'heading-anchor', // 只加 class
                        'aria-label': 'Anchor link to heading',
                        href: '', // 可以为空，不要跳转
                    },
                    content: { type: 'text', value: '#' },
                },
            ],
            postProcess,
        ],
    },
});
