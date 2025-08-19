"use client";
import { buttonVariants } from "@/components/ui/button";
import { EachRoute } from "@/lib/server/getRoutes";
import { MoveUpRightIcon, TerminalSquareIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
	const [routes, setRoutes] = useState<EachRoute[]>([]);

	useEffect(() => {
		fetch("/api/routes")
			.then((r) => r.json())
			.then((data) => setRoutes(data));
	}, []);

	// const [pageRoutes, setPageRoutes] = useState<EachRoute[]>([]);

	// useEffect(() => {
	// 	fetch("/api/pageRoutes")
	// 		.then((r) => r.json())
	// 		.then((data) => setPageRoutes(data));
	// }, []);

	return (
		<div className="flex sm:min-h-[87.5vh] min-h-[82vh] flex-col sm:items-center justify-center text-center sm:py-8 py-14">
			{/* <Link
				href="https://github.com/nisabmohd/Aria-Docs"
				target="_blank"
				className="mb-5 sm:text-lg flex items-center gap-2 underline underline-offset-4 sm:-mt-12"
			>
				Follow along on GitHub{" "}
				<MoveUpRightIcon className="w-4 h-4 font-extrabold" />
			</Link> */}
			<h1 className="text-[1.80rem] leading-8 sm:px-8 md:leading-[4.5rem] font-bold mb-4 sm:text-6xl text-left sm:text-center">
				MKFramework 游戏框架
			</h1>
			<h1 className="text-[1.0rem] leading-8 sm:px-8 md:leading-[4.5rem] font-bold mb-4 sm:text-2xl text-left sm:text-center">
				适用于 CocosCreator 游戏引擎
			</h1>
			<p className="mb-8 md:text-lg text-base  max-w-[1200px] text-muted-foreground text-left sm:text-center">
				免费，开源，类型安全，完善的生命周期/新手引导/资源管理系统，支持纯脚本/组件式开发，支持单脚本多预制
			</p>
			<div className="sm:flex sm:flex-row grid grid-cols-2 items-center sm;gap-5 gap-3 mb-8">
				{routes.length > 0 && (
					<Link
						href={`/docs${routes[0].href}`}
						className={buttonVariants({ className: "px-6", size: "lg" })}
					>
						快速开始
					</Link>
				)}
				<Link
					href="/blog"
					className={buttonVariants({
						variant: "secondary",
						className: "px-6",
						size: "lg",
					})}
				>
					阅读博客
				</Link>
			</div>
			{/* <span className="sm:flex hidden flex-row items-start sm:gap-2 gap-0.5 text-muted-foreground text-md mt-5 -mb-12 max-[800px]:mb-12 font-code sm:text-base text-sm font-medium">
				<TerminalSquareIcon className="w-5 h-5 sm:mr-1 mt-0.5" />
				{"npx create-aria-doc <project-directory>"}
			</span> */}
		</div>
	);
}
