// types/content.ts
import { Doc, Blog } from 'contentlayer/generated';

export type ContentDocument = Doc | Blog;

export interface BaseMdxFrontmatter {
    title: string;
    description?: string;
    noLink?: boolean;
}

export interface DocFrontmatter extends BaseMdxFrontmatter {
    tag?: string;
    order?: number;
}

export interface BlogFrontmatter extends BaseMdxFrontmatter {
    date: string;
    authors: Array<{
        avatar?: string;
        handle: string;
        username: string;
        handleUrl: string;
    }>;
    cover: string;
}
