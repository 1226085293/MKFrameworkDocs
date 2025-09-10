class SiteConfig {
    /** 作者链接 */
    authorLink = 'https://github.com/1226085293';
    /** 项目仓库 */
    projectRepo = 'https://github.com/1226085293/MKFramework';
    /** 站点仓库集合 */
    siteRepos: Record<string, string> = {
        github: 'https://github.com/1226085293/MKFrameworkDocs',
    };
    /** 项目 */
    projectsDiscussionUrl = 'https://github.com/1226085293/MKFrameworkDocs/discussions/3';
    /** 站点仓库 */
    repo = this.siteRepos.github;
    /** 评论系统配置 */
    giscus = {
        repo: this.siteRepos.github.replace('https://github.com/', '') as `${string}/${string}`,
        repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID as string,
        category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY as string,
        categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID as string,
    };
}

const siteConfig = new SiteConfig();

export default siteConfig;
