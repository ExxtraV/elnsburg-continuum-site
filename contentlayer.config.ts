import { defineDocumentType, makeSource } from "@contentlayer2/source-files";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import remarkWikiLinks from "./lib/remark-wikilinks";

export const Wiki = defineDocumentType(() => ({
  name: "Wiki",
  filePathPattern: `wiki/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, required: false }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => `/wiki/${doc._raw.flattenedPath.split("/").at(-1)}`
    }
  }
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Wiki],
  mdx: {
    remarkPlugins: [remarkGfm, remarkWikiLinks],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
  }
});
