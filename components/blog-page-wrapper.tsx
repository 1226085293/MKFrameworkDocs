'use client';

import dynamic from 'next/dynamic';

const BlogPageClient = dynamic(() => import('./blog-page-client'), {
    ssr: false,
});

export default function BlogPageWrapper({ blog }: { blog: any }) {
    return <BlogPageClient blog={blog} />;
}
