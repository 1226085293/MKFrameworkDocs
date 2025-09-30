'use client';
import { buttonVariants } from '@/components/ui/button';
import { getRoutes } from '@/lib/server/getRoutes';
import siteConfig from '@/site-config';
import Link from 'next/link';

export default function Home() {
    const routes = getRoutes();

    return (
        <div className="flex sm:min-h-[87.5vh] min-h-[82vh] flex-col sm:items-center justify-center text-center sm:py-8 py-14">
            <h1 className="text-[1.80rem] leading-8 sm:px-8 md:leading-[4.5rem] font-bold mb-4 sm:text-6xl text-left sm:text-center">
                MKFramework 游戏框架
            </h1>
            <h1 className="text-[1.0rem] leading-8 sm:px-8 md:leading-[4.5rem] font-bold mb-4 sm:text-2xl text-left sm:text-center">
                适用于 CocosCreator 游戏引擎
            </h1>
            <p className="mb-8 md:text-lg text-base max-w-[1200px] text-muted-foreground text-left sm:text-center">
                免费，开源，类型安全，完善的生命周期/新手引导/资源管理系统，支持纯脚本/组件式开发，支持单脚本多预制
            </p>
            <div className="sm:flex sm:flex-row grid grid-cols-2 items-center sm:gap-5 gap-3 mb-8">
                {routes.length > 0 && (
                    <Link
                        href={`/docs${routes[0].href}`}
                        className={buttonVariants({ className: 'px-6', size: 'lg' })}
                    >
                        快速开始
                    </Link>
                )}
                <Link
                    href="/blog"
                    className={buttonVariants({
                        variant: 'secondary',
                        className: 'px-6',
                        size: 'lg',
                    })}
                >
                    阅读博客
                </Link>
            </div>

            {/* ================== 赞助列表 ================== */}
            <div className="w-full max-w-3xl flex flex-col items-center justify-center absolute bottom-24">
                <h2 className="text-2xl md:text-2xl font-bold mb-8 ">赞助列表</h2>
                <div className="flex justify-center items-center relative -space-x-4">
                    {/* 最初展示的siteConfig.donateList数据 */}
                    {siteConfig.donateList.slice(0, 5).map((sponsor, index) => (
                        <div
                            key={index}
                            className="group relative z-10 transition-all duration-300 hover:z-30 hover:scale-110"
                            style={{ zIndex: index + 1 }}
                        >
                            <div className="bg-gray-200 rounded-full w-14 h-14 flex items-center justify-center p-1">
                                <img
                                    src={sponsor.avatar}
                                    alt={sponsor.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            {/* 即时悬停提示 - 使用CSS实现 */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                {sponsor.name}
                            </div>
                        </div>
                    ))}

                    {/* 补充的默认头像 */}
                    {Array.from({ length: 5 }, (v, index) => (
                        <div
                            key={`default-${index}`}
                            className="group relative z-10 transition-all duration-300 hover:z-30 hover:scale-110"
                            style={{ zIndex: siteConfig.donateList.length + index + 1 }}
                        >
                            <div className="bg-gray-200 rounded-full w-14 h-14 flex items-center justify-center p-0">
                                <svg
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="2051"
                                    width="200"
                                    height="200"
                                >
                                    <path
                                        d="M956.69248 512.75776c0 245.26848-199.04512 444.13952-444.61056 444.13952-245.53472 0-444.5184-198.8608-444.5184-444.13952 0-188.2624 117.17632-349.11232 282.6752-413.7472a431.68768 431.68768 0 0 1 161.85344-31.31392A431.73888 431.73888 0 0 1 674.02752 99.0208c165.4784 64.64512 282.6752 225.4848 282.6752 413.7472z m-615.4752-93.66528c0 74.8544 38.3488 139.65312 94.09536 171.3664 23.12192 13.1584 49.152 20.74624 76.76928 20.74624 26.64448 0 51.77344-7.09632 74.2912-19.3536 57.05728-31.11936 96.64512-96.7168 96.64512-172.7488 0-105.86112-76.66688-192.04096-170.93632-192.04096-94.208 0-170.86464 86.1696-170.86464 192.03072z m172.66688 509.0304c129.88416 0 245.76-59.74016 321.6896-153.22112-8.97024-73.73824-80.82432-136.50944-182.51776-167.8336-38.4 34.56-87.47008 55.3472-140.98432 55.3472-54.70208 0-104.77568-21.9136-143.55456-57.9584-98.9184 28.23168-171.37664 85.82144-188.3648 154.8288 75.35616 102.36928 196.8128 168.82688 333.73184 168.82688z"
                                        p-id="2052"
                                        fill="#bfbfbf"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    ))}

                    {/* 末尾+号按钮 - 最高层级 */}
                    <Link
                        href="/donate"
                        className="group relative transition-all duration-300 hover:scale-110"
                        style={{ zIndex: 100 }}
                    >
                        <div className="bg-gray-200 rounded-full w-14 h-14 flex items-center justify-center p-1 border-2 border-dashed border-gray-400">
                            <span className="text-2xl text-gray-500 font-light">+</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
