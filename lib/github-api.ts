import siteConfig from '@/site-config';

// lib/github-api.ts
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

export async function fetchProjectsFromGitHub(): Promise<Project[]> {
    try {
        if (!process.env.PROJECTS_GITHUB_TOKEN) {
            return [];
        }

        const urlStrList = siteConfig.projectsDiscussionUrl.split('/');
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `bearer ${process.env.GITHUB_PROJECTS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                        query {
                            repository(owner: "${urlStrList.slice(-4)[0]}", name: "${
                    urlStrList.slice(-3)[0]
                }") {
                                discussion(number: ${urlStrList.slice(-1)[0]}) {
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
            next: { revalidate: 3600 }, // 每小时重新验证一次
        });

        const data = await response.json();

        if (data.errors) {
            console.error('GitHub API Error:', data.errors);
            return [];
        }

        const discussion = data.data.repository.discussion;
        const projects: Project[] = [];

        // 解析讨论内容中的项目
        projects.push(...parseProjectsFromBody(discussion.body));

        // 解析评论中的项目
        discussion.comments.nodes.forEach((comment: GitHubDiscussion) => {
            projects.push(...parseProjectsFromBody(comment.body));
        });

        return projects;
    } catch (error) {
        console.error('Failed to fetch projects from GitHub:', error);
        return [];
    }
}

function parseProjectsFromBody(body: string): Project[] {
    // 使用正则表达式匹配项目格式
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
