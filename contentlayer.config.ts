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
                const headingRegex = /^(#{2,4})\s(.+)$/gm;
                const matches = Array.from(raw.matchAll(headingRegex));
                const extracted: { level: number; text: string; href: string }[] = matches
                    .map((m) => {
                        return {
                            level: m[1].split('#').length - 1,
                            text: String(m[2]).trim(),
                            href: `#${m[2]}`,
                        };
                    })
                    .filter((it) => it.text);
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
            rehypeAutolinkHeadings,
            postProcess,
        ],
    },
});
