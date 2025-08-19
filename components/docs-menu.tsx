'use client';

import { useState, useEffect } from 'react';
import SubLink from './sublink';
import { usePathname } from 'next/navigation';
import { RouteItem } from '@/lib/server/getRoutes';

export default function DocsMenu({ isSheet = false }) {
    const pathname = usePathname();
    if (!pathname.startsWith('/docs')) return null;

    const [routes, setRoutes] = useState<RouteItem[]>([]);

    useEffect(() => {
        fetch('/api/routes')
            .then((r) => r.json())
            .then((data) => setRoutes(data));
    }, []);

    return (
        <div className="flex flex-col gap-3.5 mt-5 pr-2 pb-6 sm:text-base text-[14.5px]">
            {routes.map((item, index) => {
                const modifiedItems = {
                    ...item,
                    href: `/docs${item.href}`,
                    level: 0,
                    isSheet,
                };
                return <SubLink key={item.title + index} {...modifiedItems} />;
            })}
        </div>
    );
}
