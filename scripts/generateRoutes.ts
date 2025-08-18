import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { EachRoute } from "../lib/routes-config";

function readFrontmatter(dir: string) {
	const indexFile = path.join(dir, "index.mdx");
	const content = fs.readFileSync(indexFile, "utf-8");
	return matter(content).data as Partial<EachRoute>;
}

function getRoutes(dir: string): EachRoute[] {
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((e) => e.isDirectory())
		.map((e) => {
			const folder = path.join(dir, e.name);
			const fm = readFrontmatter(folder);

			// href 总是仅使用当前的目录名
			const href = `/${e.name}`;

			// 用 folder 作为递归路径，不拼在 href 中
			const children = getRoutes(folder);

			return {
				title: fm.title!,
				href,
				noLink: fm.noLink,
				tag: fm.tag,
				items: children.length > 0 ? children : undefined,
			};
		})
		.sort((a, b) =>
			a.title.localeCompare(b.href.slice(1), "en", { numeric: true })
		);
}

// 生成 routes.json
const routes = getRoutes("contents/docs");
fs.writeFileSync(
	"lib/page_routes.json",
	JSON.stringify(routes, null, 2),
	"utf-8"
);
console.log("✅ page_routes.json generated.");
