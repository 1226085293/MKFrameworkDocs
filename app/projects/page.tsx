// app/projects/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { fetchProjectsFromGitHub } from '@/lib/github-api';
import siteConfig from '@/site-config';

export const metadata: Metadata = {
    title: 'MKFrameworkDocs - 项目展示',
};

export default async function ProjectsPage() {
    const projects = await fetchProjectsFromGitHub();

    return (
        <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2 w-full">
            <div className="mb-7 flex flex-col gap-2">
                <h1 className="sm:text-3xl text-2xl font-extrabold">项目展示</h1>
                <p className="text-muted-foreground sm:text-[16.5px] text-[14.5px]">
                    社区贡献的项目展示区，填写简单信息便可展示，不需要公开源码
                </p>
            </div>

            {/* 固定宽度的flex布局 */}
            <div className="flex flex-wrap gap-6 mb-5">
                {/* 提交项目按钮卡片 */}
                <div key="submit-card">
                    <SubmitProjectCard />
                </div>

                {/* 项目列表 */}
                {projects.map((project, kNum) => (
                    <ProjectCard
                        key={`project-${kNum}`} // 确保唯一性
                        title={project.title}
                        description={project.description}
                        image={project.image}
                        link={project.link}
                    />
                ))}
            </div>
        </div>
    );
}

// 提交项目按钮卡片组件
// 修改 SubmitProjectCard 组件
function SubmitProjectCard() {
    return (
        <Link
            href={siteConfig.projectsDiscussionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center border border-dashed border-muted-foreground/30 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 w-[360px] h-[400px]"
        >
            <div className="flex flex-col items-center gap-6 text-center">
                {' '}
                {/* 增加gap */}
                <div className="flex items-center justify-center w-full">
                    <Plus
                        className="w-[180px] h-[180px] text-primary/20 group-hover:text-primary/40 transition-colors"
                        strokeWidth={1} // 细描边避免过粗
                    />
                </div>
                {/* 提交项目文字 */}
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

interface ProjectCardProps {
    title: string;
    description: string;
    image?: string;
    link?: string;
}

function ProjectCard({ title, description, image, link }: ProjectCardProps) {
    return (
        <div className="group flex flex-col border rounded-lg overflow-hidden bg-card hover:shadow-md transition-all duration-200 w-[360px] h-[400px]">
            {/* 图片区域 - 强制16:9比例 */}
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

            {/* 内容区域 */}
            <div className="flex flex-col flex-1 p-4">
                <div className="flex flex-col gap-3 mb-auto">
                    <h3 className="text-lg font-semibold line-clamp-1 leading-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* 访问按钮 */}
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
