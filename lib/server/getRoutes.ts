// lib/server/getRoutes.ts
import { allDocs } from 'contentlayer/generated';

export interface RouteItem {
    title: string;
    href: string;
    items?: RouteItem[];
    tag?: string;
    order?: number;
    noLink?: boolean;
}

export interface TocItem {
    level: number;
    text: string;
    href: string;
}

// 获取前后页面
export function getPreviousNext(pathname: string) {
    const pages = getPageRoutes().filter((page) => !page.noLink);
    const fullPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const currentIndex = pages.findIndex((page) => page.href === fullPath);

    return {
        prev: currentIndex > 0 ? pages[currentIndex - 1] : undefined,
        next: currentIndex < pages.length - 1 ? pages[currentIndex + 1] : undefined,
    };
}

// 排序
export function sortRoutes<T extends { order?: number; title: string }>(routes: T[]): T[] {
    return routes.sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;

        if (orderA !== orderB) {
            return orderA - orderB;
        }

        return a.title.localeCompare(b.title);
    });
}

export function getRoutes(): RouteItem[] {
    const routes: RouteItem[] = [];

    // 首先按路径深度排序，确保父级在处理子级之前被处理
    const sortedDocs = [...allDocs].sort((a, b) => a.slugArray.length - b.slugArray.length);

    sortedDocs.forEach((doc) => {
        if (!doc.slugArray || doc.slugArray.length === 0) return;

        let currentLevel = routes;
        let currentPath = '';

        for (let i = 0; i < doc.slugArray.length; i++) {
            const slugPart = doc.slugArray[i];
            currentPath += (i === 0 ? '' : '/') + slugPart;

            const isLast = i === doc.slugArray.length - 1;

            let existingItem = currentLevel.find((item) => item.href === `/${slugPart}`);

            if (!existingItem) {
                // 查找当前路径的文档以获取标题
                const currentDoc = allDocs.find((d) => d.slug === currentPath);

                existingItem = {
                    title: currentDoc?.title || slugPart,
                    href: `/${slugPart}`,
                    items: [],
                    tag: currentDoc?.tag,
                    order: currentDoc?.order,
                    noLink: currentDoc?.noLink,
                };
                currentLevel.push(existingItem);
            }

            if (!isLast && existingItem.items) {
                currentLevel = existingItem.items;
            }
        }
    });

    // 排序
    const _sortRoutes = (routes: RouteItem[]): RouteItem[] => {
        return sortRoutes(routes).map((route) => {
            const items = _sortRoutes(route.items!);
            return {
                ...route,
                items: items.length ? items : undefined,
            };
        });
    };

    return _sortRoutes(routes);
}

export function getPageRoutes(): RouteItem[] {
    const flattenRoutes = (routes: RouteItem[], parentPath = ''): RouteItem[] => {
        return routes.flatMap((route) => {
            // 拼接父路径
            const fullPath = `${parentPath}${route.href}`;
            const flatRoute = {
                title: route.title,
                href: fullPath, // 使用完整路径
                tag: route.tag,
                order: route.order,
                noLink: route.noLink,
            } as RouteItem;
            return route.items ? [flatRoute, ...flattenRoutes(route.items, fullPath)] : [flatRoute];
        });
    };

    return flattenRoutes(getRoutes());
}

// 新增：获取指定路径的所有子文档
export function getChildRoutes(path: string): RouteItem[] {
    const pathParts = path.split('/').filter((p) => p);
    const routes = getRoutes();

    let currentLevel = routes;
    for (const part of pathParts) {
        const found = currentLevel.find((item) => item.href === `/${part}`);
        if (!found || !found.items) return [];
        currentLevel = found.items;
    }

    return currentLevel;
}
