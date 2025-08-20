// app/docs/[[...slug]]/page.tsx
import { allDocs } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { BreadcrumbItemType } from '@/components/docs-breadcrumb';
import { getPageRoutes } from '@/lib/server/getRoutes';
import DocsClient from '@/components/docs-client';

type PageProps = {
    params: Promise<{ slug: string[] }>;
};

export default async function DocsPage(props: PageProps) {
    const params = await props.params;
    let { slug = [] } = params;

    // 根路径 /docs 特殊处理
    if (slug.length === 0) {
        const firstPage = getPageRoutes()[0];
        if (!firstPage) notFound();
        slug = firstPage.href.split('/').slice(1);
    }

    const pathName = slug.join('/');
    const doc = allDocs.find((doc) => doc.slug === pathName);

    if (!doc) notFound();

    const breadcrumbItems: BreadcrumbItemType[] = [];

    // 构建面包屑
    const slugParts = slug;
    let accumulatedSlug = '';
    for (let i = 0; i < slugParts.length; i++) {
        accumulatedSlug += (i === 0 ? '' : '/') + slugParts[i];
        const docItem = allDocs.find((d) => d.slug === accumulatedSlug);
        if (docItem) {
            breadcrumbItems.push({
                title: docItem.title,
                href: '/docs/' + accumulatedSlug,
                noLink: docItem.noLink || false,
            });
        } else {
            breadcrumbItems.push({
                title: slugParts[i],
                href: '/docs/' + accumulatedSlug,
                noLink: false,
            });
        }
    }

    return (
        <DocsClient
            title={doc.title}
            description={doc.description}
            code={doc.body.code}
            pathName={pathName}
        />
    );
}

export async function generateMetadata(props: PageProps) {
    const params = await props.params;
    let { slug = [] } = params;

    if (slug.length === 0) {
        const firstPage = getPageRoutes()[0];
        if (!firstPage) return {};
        slug = firstPage.href.split('/').slice(1);
    }

    const pathName = slug.join('/');
    const doc = allDocs.find((doc) => doc.slug === pathName);
    if (!doc) return {};
    return {
        title: doc.title,
        description: doc.description,
    };
}

export function generateStaticParams() {
    return allDocs.map((doc) => ({
        slug: doc.slugArray,
    }));
}
