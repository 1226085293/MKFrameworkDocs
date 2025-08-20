'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Next.js 13+ app router

export default function HeadingAnchorHandler() {
    const pathname = usePathname(); // 监听路由变化

    useEffect(() => {
        const links = document.querySelectorAll('.heading-anchor') as NodeListOf<HTMLElement>;

        const handleClick = (e: MouseEvent) => {
            e.preventDefault();

            const target = (e.currentTarget as HTMLElement).parentElement;
            if (!target) return;

            // 滚动到标题
            target.scrollIntoView({ behavior: 'smooth' });

            // 复制完整 URL
            const url = window.location.origin + window.location.pathname + '#' + target.id;
            navigator.clipboard.writeText(url).then(() => {
                console.log('Copied URL:', url);
            });
        };

        links.forEach((link) => link.addEventListener('click', handleClick));

        // 清理事件
        return () => {
            links.forEach((link) => link.removeEventListener('click', handleClick));
        };
    }, [pathname]); // 路由变化或文章切换时重新执行

    return null;
}
