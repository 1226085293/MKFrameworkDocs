'use client';

import { ModeToggle } from '@/components/theme-toggle';
import { GithubIcon, CommandIcon } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import Anchor from './anchor';
import { SheetLeftbar } from './leftbar';
import { SheetClose } from '@/components/ui/sheet';
import AlgoliaSearch from './algolia-search';
import { getRoutes } from '@/lib/server/getRoutes';
import siteConfig from '@/site-config';

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
                            <Link
                                target="_blank"
                                rel="noopener noreferrer"
                                href={siteConfig.projectRepo}
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'icon',
                                })}
                            >
                                <GithubIcon className="h-[1.1rem] w-[1.1rem]" />
                            </Link>
                            {/* <Link
								href="#"
								className={buttonVariants({
									variant: "ghost",
									size: "icon",
								})}
							>
								<TwitterIcon className="h-[1.1rem] w-[1.1rem]" />
							</Link> */}
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
        // 注意：把 ref 和所有 props 传给 next/link
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

    // ✅ 根据 pageRoutes 动态生成 NAVLINKS
    const NAVLINKS = [
        {
            title: '文档',
            href: routes.length > 0 ? `/docs${routes[0].href}` : '/docs',
        },
        { title: '博客', href: '/blog' },
        { title: '项目', href: '/projects' },
        // { title: "Guides", href: "#" },
        {
            title: '讨论',
            href: siteConfig.discussionUrl,
        },
    ];

    return (
        <>
            {NAVLINKS.map((item) => {
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
            })}
        </>
    );
}
