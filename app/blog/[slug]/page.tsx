// app/blog/[slug]/page.tsx
import { allBlogs } from 'contentlayer/generated';
import { Typography } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import MdxRenderer from '@/components/mdx-renderer'; // 导入新的客户端组件

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps) {
    const params = await props.params;
    const { slug } = params;
    const blog = allBlogs.find((blog) => blog.slug === slug);
    if (!blog) return {};
    return {
        title: blog.title,
        description: blog.description,
    };
}

export async function generateStaticParams() {
    return allBlogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogPage(props: PageProps) {
    const params = await props.params;
    const { slug } = params;

    const blog = allBlogs.find((blog) => blog.slug === slug);
    if (!blog) notFound();

    return (
        <div className="lg:w-[60%] sm:[95%] md:[75%] mx-auto">
            <Link
                className={buttonVariants({
                    variant: 'link',
                    className: '!mx-0 !px-0 mb-7 !-ml-1 ',
                })}
                href="/blog"
            >
                <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Back to blog
            </Link>
            <div className="flex flex-col gap-3 pb-7 w-full mb-2">
                <p className="text-muted-foreground text-sm">{formatDate(blog.date)}</p>
                <h1 className="sm:text-3xl text-2xl font-extrabold">{blog.title}</h1>
                <div className="mt-6 flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">Posted by</p>
                    <Authors authors={blog.authors} />
                </div>
            </div>
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
        </div>
    );
}

function Authors({ authors }: { authors: any[] }) {
    return (
        <div className="flex items-center gap-8 flex-wrap">
            {authors.map((author: any) => {
                return (
                    <Link
                        href={author.handleUrl}
                        className="flex items-center gap-2"
                        key={author.username}
                    >
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={author.avatar} />
                            <AvatarFallback>
                                {author.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="">
                            <p className="text-sm font-medium">{author.username}</p>
                            <p className="font-code text-[13px] text-muted-foreground">
                                @{author.handle}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
