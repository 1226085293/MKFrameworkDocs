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
                    style: 'max-width:100%; width:auto; height:auto; display:block; margin:0 auto;',
                },
                children: [],
            };

            // 把 img 放进 wrapper，便于控制横向滚动或最大高度
            const wrapperNode = {
                type: 'element',
                tagName: 'div',
                properties: {
                    // 使用内联样式，避免依赖 Tailwind JIT safelist
                    style: 'width:100%; overflow:auto; margin:1rem 0; max-height:60vh; -webkit-overflow-scrolling: touch;',
                    // 如果你不想限制高度，把 max-height:60vh 去掉即可
                },
                children: [imgNode],
            };

            if (parent && typeof index === 'number') {
                parent.children.splice(index, 1, wrapperNode);
            }
        });
    };
}
