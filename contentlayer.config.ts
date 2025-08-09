import { defineDocumentType, makeSource } from "@contentlayer2/source-files";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

export const Chapter = defineDocumentType(() => ({
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
  documentTypes: [Chapter, Wiki],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
  }
});
