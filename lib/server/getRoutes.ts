import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type EachRoute = {
	title: string;
	href: string;
	noLink?: boolean; // noLink will create a route segment (section) but cannot be navigated
	items?: EachRoute[];
	tag?: string;
	/** 排序顺序 */
	order?: number;
};

export type Page = { title: string; href: string };

export function getRoutes(): EachRoute[] {
	return _getRoutes("contents/docs/");
}

export function getPageRoutes(): Page[] {
	// 不把根节点当成一个页面返回，只返回其子项
	const routes = getRoutes();

	// 假设只有一个根节点 /docs
	return routes.flatMap((it) => {
		// 只返回 children
		return it.items
			? it.items
					.map((sub) =>
						getRecurrsiveAllLinks({ ...sub, href: `${it.href}${sub.href}` })
					)
					.flat()
			: [];
	});
}

function readFrontmatter(dir: string) {
	const indexFile = path.join(dir, "index.mdx");
	const content = fs.readFileSync(indexFile, "utf-8");
	return matter(content).data as Partial<EachRoute>;
}

function _getRoutes(dir: string): EachRoute[] {
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((e) => e.isDirectory())
		.map((e) => {
			const folder = path.join(dir, e.name);
			const fm = readFrontmatter(folder);

			// href 总是仅使用当前的目录名
			const href = `/${e.name}`;

			// 用 folder 作为递归路径，不拼在 href 中
			const children = _getRoutes(folder);

			return {
				title: fm.title!,
				href,
				noLink: fm.noLink,
				tag: fm.tag,
				items: children.length > 0 ? children : undefined,
				order: fm.order,
			};
		})
		.sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
}

function getRecurrsiveAllLinks(node: EachRoute) {
	const ans: Page[] = [];
	if (!node.noLink) {
		ans.push({ title: node.title, href: node.href });
	}
	node.items?.forEach((subNode) => {
		const temp = { ...subNode, href: `${node.href}${subNode.href}` };
		ans.push(...getRecurrsiveAllLinks(temp));
	});
	return ans;
}
