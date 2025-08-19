// components/mdx-renderer.tsx
'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Pre from '@/components/markdown/pre';
import Note from '@/components/markdown/note';
import { Stepper, StepperItem } from '@/components/markdown/stepper';
import Image from '@/components/markdown/image';
import Link from '@/components/markdown/link';
import Outlet from '@/components/markdown/outlet';
import Files from '@/components/markdown/files';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const components = {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    pre: Pre,
    Note,
    Stepper,
    StepperItem,
    img: Image,
    a: Link,
    Outlet,
    Files,
    table: Table,
    thead: TableHeader,
    th: TableHead,
    tr: TableRow,
    tbody: TableBody,
    t: TableCell,
};

interface MdxRendererProps {
    code: string;
}

export default function MdxRenderer({ code }: MdxRendererProps) {
    // ---- 防护：在浏览器端注入最小 process polyfill ----
    if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-prototype-builtins
        if (!(window as any).process) {
            // 只提供 env 对象，避免暴露任何敏感值
            (window as any).process = { env: {} };
            // 可选：在开发环境打印提示，帮助定位哪个模块用到了 process
            if (process.env.NODE_ENV === 'development') {
                // 注意这里的 process 现在是我们刚注入的对象
                console.warn('[polyfill] window.process injected for MDX client runtime');
            }
        }
    }
    // ------------------------------------------------

    const MDXContent = useMDXComponent(code);
    return <MDXContent components={components} />;
}
