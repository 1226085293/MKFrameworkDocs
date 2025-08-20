'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

type AnchorProps = ComponentProps<typeof Link> & {
    absolute?: boolean;
    activeClassName?: string;
    disabled?: boolean;
};

export default function Anchor({
    absolute,
    className = '',
    activeClassName = '',
    disabled,
    children,
    ...props
}: AnchorProps) {
    const path = usePathname();
    const isMatch = absolute
        ? props.href.toString().split('/')[1] === path.split('/')[1]
        : path === props.href;

    const hrefStr = props.href.toString();
    const isExternal = hrefStr.startsWith('http');

    if (disabled) return <div className={cn(className, 'cursor-not-allowed')}>{children}</div>;

    if (isExternal) {
        return (
            <a href={hrefStr} className={className} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }

    return (
        <Link className={cn(className, isMatch && activeClassName)} {...props}>
            {children}
        </Link>
    );
}
