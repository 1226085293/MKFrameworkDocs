import { visit } from 'unist-util-visit';
import { encode } from 'plantuml-encoder';

export function rehypePlantuml() {
    return (tree: any) => {
        // 注意：index 可能为 undefined，所以用 number | null | undefined
        visit(tree, 'element', (node: any, index: number | null | undefined, parent: any) => {
            if (node?.tagName !== 'pre') return;
            const codeEl = node.children?.[0];
            if (!codeEl || codeEl.tagName !== 'code') return;

            const classNames: string[] = codeEl.properties?.className ?? [];
            const isPlantUml =
                classNames.join(' ').includes('plantuml') ||
                classNames.join(' ').includes('language-plantuml');

            if (!isPlantUml) return;

            const raw = (node.raw as string) ?? codeEl.children?.[0]?.value ?? '';
            if (!raw) return;

            const encoded = encode(raw.trim());
            const src = `https://www.plantuml.com/plantuml/svg/${encoded}`;

            const imgNode = {
                type: 'element',
                tagName: 'img',
                properties: {
                    src,
                    alt: 'PlantUML diagram',
                    className: ['plantuml-diagram'],
                },
                children: [],
            };

            // 在使用 index 前做检查（TypeScript 安全 & 运行时保护）
            if (parent && typeof index === 'number') {
                parent.children.splice(index, 1, imgNode);
            }
        });
    };
}
