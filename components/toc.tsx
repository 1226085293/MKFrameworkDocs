// components/toc.tsx
'use client';

import React, { useMemo } from 'react';
import { allDocs } from 'contentlayer/generated';
import TocObserver from './toc-observer';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Toc({ path }: { path: string }) {
    const doc = allDocs.find(
        (d) =>
            d.slug === path ||
            d._raw?.flattenedPath === `docs/${path}/index` ||
            d._raw?.flattenedPath === `docs/${path}`
    );

    // 解析出 items（兼顾 computed field 和回退方案）
    const items = useMemo(() => doc?.toc ?? [], [doc]);

    if (!doc) return null;

    // 使用你原来的布局和 ScrollArea + TocObserver（保持样式与交互）
    return (
        <div className="xl:flex toc hidden w-[20rem] py-9 sticky top-16 h-[96.95vh] pl-6">
            <div className="flex flex-col gap-3 w-full pl-2">
                <h3 className="font-medium text-sm">On this page</h3>
                <ScrollArea className="pb-2 pt-0.5 overflow-y-auto">
                    <TocObserver data={items} />
                </ScrollArea>
            </div>
        </div>
    );
}
