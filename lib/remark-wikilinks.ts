import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text, PhrasingContent, Link } from 'mdast';

// remark plugin to transform [[slug]] into wiki links
const remarkWikiLinks: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      const value = node.value;
      const regex = /\[\[([^\]]+)\]\]/g;
      let match: RegExpExecArray | null;
      let lastIndex = 0;
      const newNodes: PhrasingContent[] = [];
      while ((match = regex.exec(value)) !== null) {
        const [full, slug] = match;
        const start = match.index;
        if (start > lastIndex) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, start) });
        }
        const linkNode: Link = {
          type: 'link',
          url: `/wiki/${slug}`,
          children: [{ type: 'text', value: slug }],
        };
        newNodes.push(linkNode);
        lastIndex = start + full.length;
      }
      if (newNodes.length) {
        if (lastIndex < value.length) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex) });
        }
        parent!.children.splice(index!, 1, ...newNodes);
      }
    });
  };
};

export default remarkWikiLinks;
