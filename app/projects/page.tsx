// app/projects/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import siteConfig from '@/site-config';

// 工具函数
function extractImageUrl(imageTag: string): string {
    const match = imageTag.match(/src="([^"]+)"/);
    return match ? match[1] : '';
}

function parseProjectsFromBody(body: string) {
    const projectRegex =
        /title: (.*?)\s+description: (.*?)\s+link: (.*?)\s+image: (.*?)(?=\s+(?:title:|$))/gs;
    const projects = [];
    let match;
    while ((match = projectRegex.exec(body)) !== null) {
        const [, title, description, link, image] = match;
        projects.push({
            title: title.trim(),
            description: description.trim(),
            link: link.trim() === 'null' ? undefined : link.trim(),
            image: image.trim() === 'null' ? undefined : image.trim(),
        });
    }
    return projects;
}

// 获取缓存时间：开发时 0，生产时 60 秒
const getCacheTime = () => {
    // 判断是否为生产环境
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
            revalidate: getCacheTime(), // ← 关键：开发 0，生产 60 秒
        },
        // 生产环境：允许使用缓存；开发环境：强制绕过缓存
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

    return [
        ...parseProjectsFromBody(discussion.body),
        ...discussion.comments.nodes.flatMap((c: any) => parseProjectsFromBody(c.body)),
    ];
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

    // 用户手动刷新页面时触发（仅首次加载）
    useEffect(() => {
        loadProjects();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2 w-full">
            <div className="mb-7 flex flex-col gap-2">
                <h1 className="sm:text-3xl text-2xl font-extrabold">项目展示</h1>
                <p className="text-muted-foreground sm:text-[16.5px] text-[14.5px]">
                    社区贡献的项目展示区，填写简单信息便可展示，不需要公开源码
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
                            className="text-sm text-primary hover:underline"
                        >
                            重新加载
                        </button>
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
function ProjectCard({ title, description, image, link }: any) {
    return (
        <div className="group flex flex-col border rounded-lg overflow-hidden bg-card hover:shadow-md transition-all duration-200 w-[360px] h-[400px]">
            <div className="relative w-full aspect-video overflow-hidden">
                {image ? (
                    <Image
                        src={extractImageUrl(image)}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">无预览图</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 p-4">
                <div className="flex flex-col gap-3 mb-auto">
                    <h3 className="text-lg font-semibold line-clamp-1 leading-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                        {description}
                    </p>
                </div>

                {link && (
                    <div className="flex justify-end mt-3">
                        <Link
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 rounded-full px-4 py-2"
                        >
                            访问项目
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
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
                    提交项目
                </span>
            </div>
            <span className="mt-2 text-base font-medium text-muted-foreground/60 group-hover:text-primary/70 transition-colors">
                需开启代理访问
            </span>
        </Link>
    );
}
