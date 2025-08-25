// app/blog/[slug]/page.tsx
import { allBlogs } from 'contentlayer/generated';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Authors } from '@/components/authors';
import MdxRenderer from '@/components/mdx-renderer';
import { Typography } from '@/components/typography';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

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
                    <p className="text-sm text-muted-foreground">来自于</p>
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
