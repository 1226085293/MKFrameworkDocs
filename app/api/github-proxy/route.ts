// app/api/github-proxy/route.ts - API 路由代理
import { NextRequest, NextResponse } from 'next/server';

interface GitHubDiscussion {
    id: string;
    number: number;
    title: string;
    body: string;
    url: string;
}

interface Project {
    id: number;
    title: string;
    description: string;
    image?: string;
    link?: string;
}

export async function POST(request: NextRequest) {
    try {
        const { owner, repo, discussionNumber } = await request.json();

        if (!owner || !repo || !discussionNumber) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // 从服务器端环境变量获取 token（不会暴露给客户端）
        const token = process.env.PROJECTS_GITHUB_TOKEN;

        if (!token) {
            console.error('GitHub token not configured on server');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
            body: JSON.stringify({
                query: `
                    query {
                        repository(owner: "${owner}", name: "${repo}") {
                            discussion(number: ${discussionNumber}) {
                                body
                                comments(first: 100) {
                                    nodes {
                                        id
                                        body
                                    }
                                }
                            }
                        }
                    }
                `,
            }),
        });

        const data = await response.json();

        if (data.errors) {
            console.error('GitHub API errors:', data.errors);
            return NextResponse.json(
                { error: data.errors.map((e: any) => e.message).join(', ') },
                { status: 500 }
            );
        }

        const discussion = data.data.repository.discussion;
        const projects: Project[] = [];

        projects.push(...parseProjectsFromBody(discussion.body));
        discussion.comments.nodes.forEach((comment: GitHubDiscussion) => {
            projects.push(...parseProjectsFromBody(comment.body));
        });

        return new NextResponse(JSON.stringify({ projects }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
        });
    } catch (error) {
        console.error('GitHub API proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch data from GitHub' }, { status: 500 });
    }
}

function parseProjectsFromBody(body: string): Project[] {
    const projectRegex =
        /title: (.*?)\s+description: (.*?)\s+link: (.*?)\s+image: (.*?)(?=\s+(?:title:|$))/gs;
    const projects: Project[] = [];
    let match;

    while ((match = projectRegex.exec(body)) !== null) {
        const [, title, description, link, image] = match;

        projects.push({
            id: projects.length + 1,
            title: title.trim(),
            description: description.trim(),
            link: link.trim() === 'null' ? undefined : link.trim(),
            image: image.trim() === 'null' ? undefined : image.trim(),
        });
    }

    return projects;
}
