// components/mdx-renderer.tsx
'use client';

import * as React from 'react';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom/client';

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

// 条件导入 next-contentlayer/hooks 的 useMDXComponent
let useNextContentlayerMDXComponent: ((code: string) => any) | undefined;
if (process.env.NODE_ENV === 'development') {
    const { useMDXComponent: nextUseMDXComponent } = require('next-contentlayer/hooks');
    useNextContentlayerMDXComponent = nextUseMDXComponent;
}

// 自定义 useMDXComponent（生产模式）
const CustomUseMDXComponent = (code: string, globals: Record<string, any> = {}) => {
    return React.useMemo(() => {
        const scope = {
            React,
            ReactDOM,
            _jsx_runtime: ReactJSXRuntime,
            process: { env: { NODE_ENV: process?.env?.NODE_ENV || 'development' } },
            ...globals,
        };

        return function MDXContent(props: any) {
            const fn = new Function(...Object.keys(scope), code);
            const Component = fn(...Object.values(scope)).default;
            return <Component {...props} />;
        };
    }, [code, globals]);
};

interface MdxRendererProps {
    code: string;
}

export default function MdxRenderer({ code }: MdxRendererProps) {
    const useMDXComponent =
        process.env.NODE_ENV === 'development'
            ? useNextContentlayerMDXComponent!
            : CustomUseMDXComponent;

    const MDXContent = useMDXComponent(code);

    return <MDXContent components={components} />;
}
