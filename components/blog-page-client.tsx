'use client';
import MdxRenderer from '@/components/mdx-renderer';
import Image from 'next/image';
import { Typography } from '@/components/typography';
import { Authors } from './authors';
import { formatDate } from '@/lib/utils';

export default function BlogPageClient({ blog }: any) {
    return (
        <>
            <div className="flex flex-col gap-3 pb-7 w-full mb-2">
                <p className="text-muted-foreground text-sm">{formatDate(blog.date)}</p>
                <h1 className="sm:text-3xl text-2xl font-extrabold">{blog.title}</h1>
                <div className="mt-6 flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">Posted by</p>
                    <Authors authors={blog.authors} />
                </div>
            </div>
            {/* <div className="mt-6 flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">Posted by</p>
                <Authors authors={blog.authors} />
            </div> */}
            <div className="!w-full">
                <div className="w-full mb-7">
                    <Image
                        src={blog.cover}
                        alt="cover"
                        width={700}
                        height={400}
                        className="w-full h-[400px] rounded-md border object-cover"
                    />
                </div>
                <Typography>
                    <MdxRenderer code={blog.body.code} />
                </Typography>
            </div>
        </>
    );
}
