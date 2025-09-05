// components/giscus-component.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Giscus from '@giscus/react';
import siteConfig from '@/site-config';

export default function GiscusComponent() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    console.log(siteConfig.giscus);

    return (
        <Giscus
            repo={siteConfig.giscus.repo}
            repoId={siteConfig.giscus.repositoryId}
            category={siteConfig.giscus.category}
            categoryId={siteConfig.giscus.categoryId}
            mapping="pathname"
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={theme === 'dark' ? 'dark' : 'light'}
            lang="zh-CN"
            loading="lazy"
        />
    );
}
