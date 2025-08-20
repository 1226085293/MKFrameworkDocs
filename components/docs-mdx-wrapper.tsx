'use client';

import MdxRenderer from '@/components/mdx-renderer';

export default function DocsMdxWrapper({ code }: { code: string }) {
    return <MdxRenderer code={code} />;
}
