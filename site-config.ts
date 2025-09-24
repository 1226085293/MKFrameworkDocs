class SiteConfig {
    /** 作者链接 */
    authorLink = 'https://github.com/1226085293';
    /** 项目 github 仓库 */
    projectGithubRepo = 'https://github.com/1226085293/MKFramework';
    /** 项目 gitee 仓库 */
    projectGiteeRepo = 'https://github.com/1226085293/MKFramework';
    /** cocos 帖子地址 */
    cocosPostUrl = 'https://forum.cocos.org/t/topic/159492';
    /** 站点仓库集合 */
    siteRepos: Record<string, string> = {
        github: 'https://github.com/1226085293/MKFrameworkDocs',
    };
    /** 项目 */
    projectsDiscussionUrl = 'https://github.com/1226085293/MKFrameworkDocs/discussions/3';
    /** 站点仓库 */
    repo = this.siteRepos.github;
    /** QQ 群信息 */
    qqGroupInfo = {
        link: 'https://qm.qq.com/q/l53vHThl3a',
        number: '348096019',
    };
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
