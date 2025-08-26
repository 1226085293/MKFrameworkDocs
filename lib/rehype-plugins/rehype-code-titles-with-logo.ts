import { getIconName, hasSupportedExtension } from '../utils';
import { visit } from 'unist-util-visit';

// 自定义 rehype 插件
export function rehypeCodeTitlesWithLogo() {
    return (tree: any) => {
        visit(tree, 'element', (node) => {
            if (
                node?.tagName === 'div' &&
                node?.properties?.className?.includes('rehype-code-title')
            ) {
                const titleTextNode = node.children.find((child: any) => child.type === 'text');
                if (!titleTextNode) return;

                const titleText = titleTextNode.value;
                const match = hasSupportedExtension(titleText);
                if (!match) return;

                const splittedNames = titleText.split('.');
                const ext = splittedNames[splittedNames.length - 1];
                const iconClass = `devicon-${getIconName(ext)}-plain text-[17px]`;

                if (iconClass) {
                    node.children.unshift({
                        type: 'element',
                        tagName: 'i',
                        properties: { className: [iconClass, 'code-icon'] },
                        children: [],
                    });
                }
            }
        });
    };
}
