import { Doc, Blog } from 'contentlayer/generated';

declare global {
    type ContentlayerDocument = Doc | Blog;
}

declare module 'contentlayer/generated' {
    export interface PageProps {
        params: { slug: string };
    }
}
