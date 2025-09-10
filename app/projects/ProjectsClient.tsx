// app/projects/ProjectsClient.tsx - 客户端组件
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import siteConfig from '@/site-config';
import useSWR from 'swr';

// 项目接口定义
interface Project {
    id: number;
    title: string;
    description: string;
    image?: string;
    link?: string;
}

// 提交项目按钮卡片组件
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

// 项目卡片组件
interface ProjectCardProps {
    title: string;
    description: string;
    image?: string;
    link?: string;
}

function ProjectCard({ title, description, image, link }: ProjectCardProps) {
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

// 从MDX格式的image中提取图片URL
function extractImageUrl(imageTag: string): string {
    const match = imageTag.match(/src="([^"]+)"/);
    return match ? match[1] : '';
}

// 获取 GitHub 数据
async function fetchGitHubData(): Promise<Project[]> {
    try {
        // 不再从客户端获取 token，完全由 API 路由处理
        const urlStrList = siteConfig.projectsDiscussionUrl.split('/');

        const response = await fetch('/api/github-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // 只发送必要的信息，token 由服务器端处理
                owner: urlStrList.slice(-4)[0],
                repo: urlStrList.slice(-3)[0],
                discussionNumber: urlStrList.slice(-1)[0],
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        return data.projects || [];
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return [];
    }
}

// 主组件
export default function ProjectsClient() {
    const { data, error, isLoading } = useSWR('projects', fetchGitHubData, {
        refreshInterval: () => {
            return process.env.NODE_ENV === 'development' ? 10000 : 60000;
        },
        revalidateOnFocus: false,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        loadingTimeout: 10000,
    });

    const projects = data || [];
    const loading = isLoading;

    // 加载状态 - 修改这里
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[88vh] w-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground text-lg font-medium">正在加载项目...</p>
                    <p className="text-muted-foreground/70 text-sm">请稍等片刻</p>
                </div>
            </div>
        );
    }

    // 错误状态 - 也改进一下
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[88vh] w-full">
                <div className="flex flex-col items-center gap-4 max-w-md text-center">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-destructive"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-destructive mb-2">加载失败</h3>
                        <p className="text-muted-foreground mb-4">
                            {error.message || '无法获取项目数据，可能是网络问题或服务器暂时不可用'}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                                刷新页面
                            </button>
                            <button
                                onClick={() =>
                                    window.open(siteConfig.projectsDiscussionUrl, '_blank')
                                }
                                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                            >
                                查看 GitHub
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2 w-full">
            <div className="mb-7 flex flex-col gap-2">
                <h1 className="sm:text-3xl text-2xl font-extrabold">项目展示</h1>
                <p className="text-muted-foreground sm:text-[16.5px] text-[14.5px]">
                    社区贡献的项目展示区，填写简单信息便可展示，不需要公开源码
                </p>
            </div>

            <div className="flex flex-wrap gap-6 mb-5">
                <div key="submit-card">
                    <SubmitProjectCard />
                </div>

                {projects.length > 0 ? (
                    projects.map((project, kNum) => (
                        <ProjectCard
                            key={`project-${kNum}`}
                            title={project.title}
                            description={project.description}
                            image={project.image}
                            link={project.link}
                        />
                    ))
                ) : (
                    // 空状态
                    <div className="flex flex-col items-center justify-center w-full py-16">
                        <div className="text-center max-w-md">
                            <h3 className="text-xl font-medium text-muted-foreground mb-2">
                                暂无项目
                            </h3>
                            <p className="text-muted-foreground/70 mb-6">
                                目前还没有项目展示，成为第一个提交项目的人吧！
                            </p>
                            <a
                                href={siteConfig.projectsDiscussionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                提交项目
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
