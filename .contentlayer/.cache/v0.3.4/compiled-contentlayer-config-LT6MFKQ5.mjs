// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
var Chapter = defineDocumentType(() => ({
  name: "Chapter",
  filePathPattern: `novels/**/chapters/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    chapter: { type: "number", required: true },
    date: { type: "date", required: true },
    series: { type: "string", required: true },
    synopsis: { type: "string", required: false },
    status: { type: "string", required: false },
    characters: { type: "list", of: { type: "string" }, required: false }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const series = parts[1];
        const file = parts.at(-1)?.replace(/\.mdx?$/, "") || "chapter";
        return `/novels/${series}/${file}`;
      }
    },
    seriesSlug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/")[1]
    }
  }
}));
var Wiki = defineDocumentType(() => ({
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
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Chapter, Wiki],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
  }
});
export {
  Chapter,
  Wiki,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-LT6MFKQ5.mjs.map
