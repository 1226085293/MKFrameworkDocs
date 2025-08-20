// app/blog/[slug]/page.tsx
import { allBlogs } from 'contentlayer/generated';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogPageWrapper from '@/components/blog-page-wrapper'; // ✅

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

            {/* 将 blog 数据交给专门的客户端组件去渲染 */}
            <BlogPageWrapper blog={blog} />
        </div>
    );
}
