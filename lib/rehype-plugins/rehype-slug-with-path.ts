import { visit } from 'unist-util-visit';
import GithubSlugger from 'github-slugger';

export function rehypeSlugWithPath() {
    return (tree: any) => {
        const slugger = new GithubSlugger();
        const stack: { depth: number; slug: string }[] = [];

        visit(tree, 'element', (node) => {
            if (!node.tagName.match(/^h[2-4]$/)) return;

            const depth = Number(node.tagName[1]); // h2 => 2, h3 => 3
            const text = node.children
                ?.filter((n: any) => n.type === 'text' || n.type === 'inlineCode')
                .map((n: any) => n.value)
                .join('')
                .trim()
                .replace(/`(.+?)`/g, '$1')
                .replace(/$$(.*?)$$$(?:.*?)$/g, '$1')
                .replace(/[*\\~]/g, '');

            if (!text) return;

            const slug = slugger.slug(text);

            // 更新栈：移除同级或更深
            while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
                stack.pop();
            }
            stack.push({ depth, slug });

            // 构建完整路径
            const id = stack.map((s) => s.slug).join('/');

            node.properties = node.properties || {};
            node.properties.id = id;
        });
    };
}
