import { Doc, Blog } from 'contentlayer/generated';

declare global {
    type ContentlayerDocument = Doc | Blog;
}
