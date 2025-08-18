import DocsBreadcrumb, {
	BreadcrumbItemType,
} from "@/components/docs-breadcrumb";
import Pagination from "@/components/pagination";
import Toc from "@/components/toc";
import { notFound } from "next/navigation";
import { getCompiledDocsForSlug, getDocFrontmatter } from "@/lib/markdown";
import { Typography } from "@/components/typography";
import { getPageRoutes } from "@/lib/server/getRoutes";

type PageProps = {
	params: Promise<{ slug: string[] }>;
};

export default async function DocsPage(props: PageProps) {
	const params = await props.params;
	let { slug = [] } = params;

	// 根路径 /docs 特殊处理：自动使用第一个页面
	if (slug.length === 0) {
		const firstPage = getPageRoutes()[0];
		if (!firstPage) notFound();
		slug = firstPage.href.split("/").slice(1);
	}

	const pathName = slug.join("/");

	let res;
	try {
		res = await getCompiledDocsForSlug(pathName);
	} catch (err) {
		console.warn("MDX file not found:", pathName, err);
		notFound();
	}

	let breadcrumbItems: BreadcrumbItemType[] = [];

	// 构建每一级路径和 title
	let accumulatedSlug = "";
	for (let i = 0; i < slug.length; i++) {
		accumulatedSlug += (i === 0 ? "" : "/") + slug[i];
		const docFrontmatter = await getDocFrontmatter(accumulatedSlug);
		if (docFrontmatter) {
			breadcrumbItems.push({
				title: docFrontmatter.title,
				href: "/docs/" + accumulatedSlug,
				noLink: docFrontmatter.noLink,
			});
		} else {
			breadcrumbItems.push({
				title: slug[i], // 如果没找到 title，就用 slug
				href: "/docs/" + accumulatedSlug,
				noLink: false,
			});
		}
	}

	return (
		<div className="flex items-start gap-10">
			<div className="flex-[4.5] py-10 mx-auto">
				<div className="w-full mx-auto">
					<DocsBreadcrumb items={breadcrumbItems} />
					{res && (
						<Typography>
							<h1 className="sm:text-3xl text-2xl !-mt-0.5">
								{res.frontmatter.title}
							</h1>
							<p className="-mt-4 text-muted-foreground sm:text-[16.5px] text-[14.5px]">
								{res.frontmatter.description}
							</p>
							<div>{res.content}</div>
							<Pagination pathname={pathName} />
						</Typography>
					)}
				</div>
			</div>

			<Toc path={pathName} />
		</div>
	);
}

export async function generateMetadata(props: PageProps) {
	const params = await props.params;
	let { slug = [] } = params;

	// 根路径 /docs 特殊处理
	if (slug.length === 0) {
		const firstPage = getPageRoutes()[0];
		if (!firstPage) return {};
		slug = firstPage.href.split("/").slice(1);
	}

	const pathName = slug.join("/");
	const res = await getDocFrontmatter(pathName);
	if (!res) return {};
	const { title, description } = res;
	return {
		title,
		description,
	};
}

export function generateStaticParams() {
	return getPageRoutes().map((item) => ({
		slug: item.href.split("/").slice(1),
	}));
}
