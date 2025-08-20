/* eslint-disable @typescript-eslint/no-explicit-any */
// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypePrism from 'rehype-prism-plus';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeCodeTitles from 'rehype-code-titles';
import remarkGfm from 'remark-gfm';
import { getIconName, hasSupportedExtension } from './lib/utils';
import { visit } from 'unist-util-visit';
import GithubSlugger from 'github-slugger';

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

                // 每个文档使用独立的 slugger，保证同一文档内重复标题也会被去重处理（rehype-slug 的行为）
                const slugger = new GithubSlugger();

                const extracted: { level: number; text: string; href: string }[] = matches
                    .map((m) => {
                        let text = String(m[2] || '').trim();

                        // 简单清洗：去掉行内代码反引号、markdown 链接的 url 部分、强调符号等
                        // 这一步是为了让 slug 更接近 rehype-slug 对可见文本的处理
                        text = text
                            .replace(/`(.+?)`/g, '$1') // `code`
                            .replace(/\[(.*?)\]\((?:.*?)\)/g, '$1') // [text](url)
                            .replace(/^\s+|\s+$/g, '') // trim
                            .replace(/[*_~]/g, ''); // remove emphasis/strike chars

                        if (!text) return null;

                        // level: number of # (m[1] is like "##" or "###")
                        const level = (m[1] || '').length - 1; // ## => 1 (or keep 2..4 as you want)

                        // 生成与 rehype-slug 相同的 id（github-slugger）
                        const id = slugger.slug(text);

                        return {
                            level,
                            text,
                            href: `#${id}`,
                        };
                    })
                    .filter(Boolean) as { level: number; text: string; href: string }[];

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

// 自定义 rehype 插件
function rehypeCodeTitlesWithLogo() {
    return (tree: any) => {
        visit(tree, 'element', (node) => {
            if (
                node?.tagName === 'div' &&
                node?.properties?.className?.includes('rehype-code-title')
            ) {
                const titleTextNode = node.children.find((child: any) => child.type === 'text');
                if (!titleTextNode) return;

                const titleText = titleTextNode.value;
                const match = hasSupportedExtension(titleText);
                if (!match) return;

                const splittedNames = titleText.split('.');
                const ext = splittedNames[splittedNames.length - 1];
                const iconClass = `devicon-${getIconName(ext)}-plain text-[17px]`;

                if (iconClass) {
                    node.children.unshift({
                        type: 'element',
                        tagName: 'i',
                        properties: { className: [iconClass, 'code-icon'] },
                        children: [],
                    });
                }
            }
        });
    };
}

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
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            preProcess,
            rehypeCodeTitles,
            rehypeCodeTitlesWithLogo,
            rehypePrism as any,
            rehypeSlug,
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
