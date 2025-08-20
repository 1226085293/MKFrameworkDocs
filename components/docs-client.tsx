'use client';

import dynamic from 'next/dynamic';
import { Typography } from '@/components/typography';
import Pagination from '@/components/pagination';
import Toc from '@/components/toc';

// 动态导入 MdxRenderer（这里才可以 ssr:false）
const DocsMdxWrapper = dynamic(() => import('@/components/docs-mdx-wrapper'), {
    ssr: false,
});

export default function DocsClient({
    code,
    title,
    description,
    pathName,
}: {
    code: string;
    title: string;
    description?: string;
    pathName: string;
}) {
    return (
        <div className="flex items-start gap-10">
            <div className="flex-[4.5] py-10 mx-auto">
                <div className="w-full mx-auto">
                    <Typography>
                        <h1 className="sm:text-3xl text-2xl !-mt-0.5">{title}</h1>
                        <p className="-mt-4 text-muted-foreground sm:text-[16.5px] text-[14.5px]">
                            {description}
                        </p>
                        <DocsMdxWrapper code={code} />
                        <Pagination pathname={pathName} />
                    </Typography>
                </div>
            </div>

            <Toc path={pathName} />
        </div>
    );
}
