'use client';

import * as React from 'react';
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
    td: TableCell, // 注意：这里原来写了 `t: TableCell`，应该是 `td`
};

interface MdxRendererProps {
    code: string;
}

export default function MdxRenderer({ code }: MdxRendererProps) {
    const MDXContent = useMDXComponent(code);
    return <MDXContent components={components} />;
}
