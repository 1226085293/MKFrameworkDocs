// components/markdown/outlet.tsx
import Link from 'next/link';
import { allDocs } from 'contentlayer/generated';
import { sortRoutes } from '@/lib/server/getRoutes';

// 定义基础的前言类型
export interface BaseMdxFrontmatter {
    title: string;
    description?: string;
    noLink?: boolean;
}

// 获取指定路径下的所有子文档
function getAllChilds(path: string) {
    if (!path) return [];

    // 过滤出以指定路径开头的所有文档
    const children = allDocs.filter(
        (doc) =>
            doc.slug.startsWith(`${path}/`) &&
            // 确保是直接子级（路径深度只多一级）
            doc.slug.split('/').length === path.split('/').length + 1
    );

    // 按照 order 字段排序，如果没有 order 则按标题排序
    return sortRoutes(children).map((doc) => ({
        title: doc.title,
        description: doc.description || '',
        href: `/docs/${doc.slug}`,
        noLink: doc.noLink || false,
    }));
}

export default function Outlet({ path }: { path: string }) {
    if (!path) throw new Error('path not provided');

    const output = getAllChilds(path);

    return (
        <div className="grid md:grid-cols-2 gap-5">
            {output.map((child) => (
                <ChildCard {...child} key={child.title} />
            ))}
        </div>
    );
}

type ChildCardProps = BaseMdxFrontmatter & { href: string };

function ChildCard({ description, href, title }: ChildCardProps) {
    return (
        <Link href={href} className="border rounded-md p-4 no-underline flex flex-col gap-0.5">
            <h4 className="!my-0">{title}</h4>
            <p className="text-sm text-muted-foreground !my-0">{description}</p>
        </Link>
    );
}
