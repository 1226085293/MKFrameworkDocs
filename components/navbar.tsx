'use client';

import { ModeToggle } from '@/components/theme-toggle';
import { CommandIcon, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Anchor from './anchor';
import { SheetLeftbar } from './leftbar';
import { SheetClose } from '@/components/ui/sheet';
import AlgoliaSearch from './algolia-search';
import { getRoutes } from '@/lib/server/getRoutes';
import siteConfig from '@/site-config';
import { useState, useRef, useEffect } from 'react';

const algolia_props = {
    appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX!,
    apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
};

export function Navbar() {
    return (
        <nav className="w-full border-b h-16 sticky top-0 z-50 bg-background">
            <div className="sm:container mx-auto w-[95vw] h-full flex items-center sm:justify-between md:gap-2">
                <div className="flex items-center sm:gap-5 gap-2.5">
                    <SheetLeftbar />
                    <div className="flex items-center gap-6">
                        <div className="md:flex hidden">
                            <Logo />
                        </div>
                        <div className="md:flex hidden items-center gap-4 text-sm font-medium text-muted-foreground">
                            <NavMenu />
                        </div>
                    </div>
                </div>

                <div className="flex items-center sm:justify-normal justify-between sm:gap-3 ml-1 sm:w-fit w-[90%]">
                    <AlgoliaSearch {...algolia_props} />
                    <div className="flex items-center justify-between sm:gap-2">
                        <div className="flex ml-4 sm:ml-0">
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export function Logo(
    {
        className,
        href = '/',
        ...props
    }: {
        className?: string;
        href?: string;
        [x: string]: any;
    },
    ref?: React.Ref<HTMLAnchorElement>
) {
    return (
        <Link
            href={href}
            ref={ref}
            {...props}
            className={`flex items-center gap-2.5 ${className ?? ''}`}
        >
            <CommandIcon className="w-6 h-6 text-muted-foreground" strokeWidth={2} />
            <h2 className="text-md font-bold font-code">MKFramework</h2>
        </Link>
    );
}

export function NavMenu({ isSheet = false }: { isSheet?: boolean }) {
    const routes = getRoutes();

    const NAVLINKS = [
        {
            title: '文档',
            href: routes.length > 0 ? `/docs${routes[0].href}` : '/docs',
        },
        { title: '博客', href: '/blog' },
        { title: '项目', href: '/projects' },
        {
            title: '交流',
            hrefs: {
                'QQ / 微信': '/group',
                'Cocos 论坛': siteConfig.cocosPostUrl,
            },
        },
        {
            title: '仓库',
            hrefs: {
                GitHub: siteConfig.projectGithubRepo,
                Gitee: siteConfig.projectGiteeRepo,
            },
        },
        { title: '捐赠🌷', href: '/donate' },
    ];

    return (
        <>
            {NAVLINKS.map((item) => {
                if (item.href) {
                    const Comp = (
                        <Anchor
                            key={item.title + item.href}
                            activeClassName="!text-primary dark:font-medium font-semibold"
                            absolute
                            className="flex items-center gap-1 sm:text-sm text-[14.5px] dark:text-stone-300/85 text-stone-800"
                            href={item.href}
                        >
                            {item.title}
                        </Anchor>
                    );
                    return isSheet ? (
                        <SheetClose key={item.title + item.href} asChild>
                            {Comp}
                        </SheetClose>
                    ) : (
                        Comp
                    );
                } else if (item.hrefs) {
                    return isSheet ? (
                        <DiscussMenuItemMobile key={item.title} item={item} />
                    ) : (
                        <DiscussMenuItemDesktop key={item.title} item={item} />
                    );
                }
                return null;
            })}
        </>
    );
}

// 桌面端讨论菜单项
function DiscussMenuItemDesktop({ item }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 200);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className="group/discuss relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button className="flex items-center gap-1 sm:text-sm text-[14.5px] dark:text-stone-300/85 text-stone-800 hover:text-primary transition-colors">
                {item.title}
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover/discuss:rotate-180" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 bg-card border rounded-lg shadow-lg z-50 p-2 flex flex-col gap-1">
                    {Object.entries(item.hrefs).map(([platform, url]: [string, any]) => {
                        // 判断是否为内部链接（以 / 开头）
                        const isInternalLink = typeof url === 'string' && url.startsWith('/');

                        return isInternalLink ? (
                            <Link
                                key={platform}
                                href={url}
                                className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {platform}
                            </Link>
                        ) : (
                            <Anchor
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {platform}
                            </Anchor>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// 移动端讨论菜单项
function DiscussMenuItemMobile({ item }: any) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="group/discuss">
            <button
                className="w-full flex items-center justify-between sm:text-sm text-[14.5px] dark:text-stone-300/85 text-stone-800 hover:text-primary transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{item.title}</span>
                <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div className="ml-4 mt-2 flex flex-col gap-1">
                    {Object.entries(item.hrefs).map(([platform, url]: [string, any]) => {
                        // 判断是否为内部链接（以 / 开头）
                        const isInternalLink = typeof url === 'string' && url.startsWith('/');

                        return isInternalLink ? (
                            <SheetClose key={platform} asChild>
                                <Link
                                    href={url}
                                    className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
                                >
                                    {platform}
                                </Link>
                            </SheetClose>
                        ) : (
                            <SheetClose key={platform} asChild>
                                <Anchor
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
                                >
                                    {platform}
                                </Anchor>
                            </SheetClose>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
