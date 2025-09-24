// app/projects/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Plus, ChevronUp } from 'lucide-react';
import siteConfig from '@/site-config';

// 工具函数
function extractImageUrl(imageTag: string): string {
    const match = imageTag.match(/src="([^"]+)"/);
    return match ? match[1] : '';
}

function parseProjectsFromBody(body: string) {
    const projectBlocks = body.split(/(?=title:)/).filter((block) => block.trim());
    const projects = [];

    for (const block of projectBlocks) {
        const titleMatch = block.match(/title:\s*(.*?)\s*$/m);
        const descriptionMatch = block.match(/description:\s*(.*?)\s*$/m);
        const imageMatch = block.match(/<img[^>]*src="([^"]+)"/);

        const linkMatches = [...block.matchAll(/link:\s*(.*?)\s*$/gm)];

        const title = titleMatch ? titleMatch[1].trim() : '';
        const description = descriptionMatch ? descriptionMatch[1].trim() : '';
        const imageUrl = imageMatch ? imageMatch[1] : '';

        const links = linkMatches
            .map((match) => {
                const linkData = match[1].trim();
                if (linkData.includes('|')) {
                    const [name, url] = linkData.split('|').map((item) => item.trim());
                    return { name, url };
                } else {
                    return { name: '访问项目', url: linkData };
                }
            })
            .filter((link) => link.url && link.url.startsWith('http'));

        projects.push({
            title,
            description,
            image: imageUrl,
            links,
        });
    }

    return projects;
}

// 获取缓存时间：开发时 0，生产时 60 秒
const getCacheTime = () => {
    return process.env.NODE_ENV === 'production' ? 60 : 0;
};

// GitHub 请求函数（带缓存控制）
const fetchProjects = async (token: string) => {
    const urlStrList = siteConfig.projectsDiscussionUrl.split('/');
    const [owner, repo, , number] = [
        urlStrList.slice(-4)[0],
        urlStrList.slice(-3)[0],
        urlStrList.slice(-2)[0],
        urlStrList.slice(-1)[0],
    ];

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'MKFrameworkDocs-Client',
        },
        body: JSON.stringify({
            query: `
        query {
          repository(owner: "${owner}", name: "${repo}") {
            discussion(number: ${number}) {
              body
              comments(first: 100) {
                nodes {
                  body
                }
              }
            }
          }
        }
      `,
        }),
        next: {
            revalidate: getCacheTime(),
        },
        cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'force-cache',
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
        console.error('GitHub API Error:', data.errors);
        throw new Error(data.errors[0]?.message || 'GitHub API Error');
    }

    const discussion = data.data?.repository?.discussion;
    if (!discussion) throw new Error('Discussion not found');

    return discussion.comments.nodes.flatMap((c: any) => parseProjectsFromBody(c.body));
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    const loadProjects = async () => {
        if (!token) {
            setError('配置错误：缺少 GitHub Token');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await fetchProjects(token);
            setProjects(data);
        } catch (err: any) {
            console.error('Load failed:', err);
            setError(err.message || '加载失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    return (
        <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2 w-full">
            <div className="mb-7 flex flex-col gap-2">
                <h1 className="sm:text-3xl text-2xl font-extrabold">项目展示</h1>
                <p className="text-muted-foreground sm:text-[16.5px] text-[14.5px]">
                    相关项目展示区，填写简单信息便可展示，无需公开源码
                </p>
            </div>

            <div className="flex flex-wrap gap-6 mb-5">
                <SubmitProjectCard />

                {loading ? (
                    Array(2)
                        .fill(0)
                        .map((_, i) => (
                            <div
                                key={i}
                                className="w-[360px] h-[400px] bg-muted rounded-lg animate-pulse"
                            />
                        ))
                ) : error ? (
                    <div className="w-full p-6 text-center">
                        <div className="text-destructive mb-2">{error}</div>
                        <button
                            onClick={loadProjects}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                            重试
                        </button>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="w-full p-6 text-center text-muted-foreground">
                        暂无项目数据，请添加项目
                    </div>
                ) : (
                    projects.map((project, idx) => (
                        <ProjectCard key={`${project.title}-${idx}`} {...project} />
                    ))
                )}
            </div>
        </div>
    );
}

// 项目卡片组件
function ProjectCard({ title, description, image, links }: any) {
    const hasMultipleLinks = links && links.length > 1;
    const hasSingleLink = links && links.length === 1;

    return (
        <div className="group flex flex-col border rounded-lg overflow-hidden bg-card hover:shadow-md transition-all duration-200 w-[360px] h-[400px]">
            {/* 图片容器 - 添加悬停缩放效果 */}
            <div className="relative w-full aspect-video overflow-hidden">
                {image ? (
                    <div className="w-full h-full transition-transform duration-300 hover:scale-105">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder-error.svg';
                            }}
                        />
                    </div>
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">无预览图</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 p-4">
                <div className="flex flex-col gap-3 mb-auto">
                    <h3 className="text-lg font-semibold line-clamp-1 leading-tight">
                        {title || '未命名项目'}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                        {description || '暂无项目描述'}
                    </p>
                </div>

                {/* 修改点：按钮容器改为右下角对齐 */}
                <div className="mt-3 flex justify-end">
                    {hasMultipleLinks ? (
                        <div className="group/link relative">
                            <button className="inline-flex items-center justify-between gap-2 text-sm font-medium text-primary bg-primary/5 rounded-full px-4 py-2 cursor-default">
                                <span>访问项目 ({links.length})</span>
                                <ChevronUp className="h-4 w-4 transition-transform duration-200 group-hover/link:rotate-180" />
                            </button>
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover/link:flex flex-col gap-2 bg-card border rounded-lg p-2 shadow-lg z-10 min-w-[180px]">
                                {links.map((link: any, index: number) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center justify-between"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span>{link.name}</span>
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : hasSingleLink ? (
                        <Link
                            href={links[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 rounded-full px-4 py-2"
                        >
                            <span>访问项目</span>
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

// 提交项目卡片
function SubmitProjectCard() {
    return (
        <Link
            href={siteConfig.projectsDiscussionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center border border-dashed border-muted-foreground/30 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 w-[360px] h-[400px]"
        >
            <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex items-center justify-center w-full">
                    <Plus
                        className="w-[180px] h-[180px] text-primary/20 group-hover:text-primary/40 transition-colors"
                        strokeWidth={1}
                    />
                </div>
                <span className="text-xl font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    添加项目
                </span>
            </div>
            <span className="mt-2 text-base font-medium text-muted-foreground/60 group-hover:text-primary/70 transition-colors">
                需开启代理访问
            </span>
        </Link>
    );
}
