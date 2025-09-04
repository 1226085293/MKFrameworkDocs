'use client';

import { TocItem } from '@/lib/server/getRoutes';
import clsx from 'clsx';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

type Props = { data: TocItem[] };

export default function TocObserver({ data }: Props) {
    const [activeId, setActiveId] = useState<string>(data?.[0]?.href.slice(1) || '');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const rafRef = useRef<number | null>(null);
    const elementsCache = useRef<Map<string, HTMLElement>>(new Map());

    useEffect(() => {
        if (!data || data.length === 0) return;

        // 预缓存所有元素引用
        data.forEach(({ href }) => {
            const id = href.slice(1);
            const element = document.getElementById(id);
            if (element) {
                elementsCache.current.set(id, element);
            }
        });

        const handleScroll = () => {
            // 使用requestAnimationFrame来优化性能
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const windowHeight = window.innerHeight;
                const docHeight = document.documentElement.scrollHeight;

                // 滚动到底部，高亮最后一个标题
                if (scrollTop + windowHeight >= docHeight - 5) {
                    const lastId = data[data.length - 1].href.slice(1);
                    setActiveId(lastId);

                    // 使用debounce更新URL
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    timeoutRef.current = setTimeout(() => {
                        history.replaceState(null, '', `#${lastId}`);
                    }, 100);
                    return;
                }

                // 找到最靠近顶部的标题
                let closest: { id: string; top: number } = null!;

                data.forEach(({ href }) => {
                    const id = href.slice(1);
                    const el = elementsCache.current.get(id);
                    if (!el) return;

                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 100) {
                        if (!closest || rect.top > closest.top) {
                            closest = { id, top: rect.top };
                        }
                    }
                });

                if (closest) {
                    setActiveId(closest.id);

                    // 使用debounce更新URL
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    timeoutRef.current = setTimeout(() => {
                        history.replaceState(null, '', `#${closest!.id}`);
                    }, 100);
                } else if (scrollTop < 100) {
                    // 在页面顶部时，选择第一个标题
                    const firstId = data[0].href.slice(1);
                    setActiveId(firstId);

                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    timeoutRef.current = setTimeout(() => {
                        history.replaceState(null, '', `#${firstId}`);
                    }, 100);
                }
            });
        };

        // 使用被动事件监听器提高滚动性能
        window.addEventListener('scroll', handleScroll, { passive: true });

        // 初始检查
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [data]);

    return (
        <div className="flex flex-col gap-2.5 text-sm dark:text-stone-300/85 text-stone-800 ml-0.5">
            {data.map(({ href, level, text }, index) => {
                // 根据标题级别确定缩进
                const indentClass =
                    level === 1 ? 'pl-0' : level === 2 ? 'pl-4' : level === 3 ? 'pl-8' : 'pl-12';

                return (
                    <Link
                        key={href + text + level + index}
                        href={`#${href.slice(1)}`}
                        className={clsx(
                            indentClass, // 应用缩进类
                            {
                                'dark:font-medium font-semibold text-primary':
                                    activeId === href.slice(1),
                            }
                        )}
                    >
                        {text}
                    </Link>
                );
            })}
        </div>
    );
}
