import { PostFrontmatter, MDXFrontmatter } from '@/types/blog';
import matter from 'gray-matter';
import readingTime, { ReadTimeResults } from 'reading-time';
import { Gist, Pre } from '@/components/code-block';
import { Hr, Img, Quote } from '@/components/mdx-components';
import { compileMDX } from 'next-mdx-remote/rsc';
import fs from 'node:fs';
import path from 'path';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import codeTitle from 'remark-code-title';
import remarkMath from 'remark-math';

const root = process.cwd();
const articlesPath = path.join(root, 'data/blog');

const MdxComponent = {
  hr: Hr,
  pre: Pre,
  Img,
  Gist,
  Quote,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateFrontmatter(data: any): data is MDXFrontmatter {
  return (
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    typeof data.date === 'string' &&
    typeof data.image === 'string'
  );
}

function createPostFrontmatter(
  data: MDXFrontmatter,
  slug: string,
  readingTimeResult: ReadTimeResults,
): PostFrontmatter {
  return {
    title: data.title,
    description: data.description,
    date: data.date,
    image: data.image,
    slug: slug,
    readingTime: readingTimeResult,
  };
}

export async function getFiles() {
  return fs.readdirSync(articlesPath);
}

export async function getPostBySlug(slug: string) {
  const articleDir = path.join(articlesPath, `${slug}.mdx`);
  const source = fs.readFileSync(articleDir);
  const { content, data } = matter(source);

  if (!validateFrontmatter(data)) {
    throw new Error(`Invalid frontmatter in ${slug}.mdx`);
  }

  const { content: body } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        remarkPlugins: [codeTitle, remarkMath],
        rehypePlugins: [
          rehypePrism,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [rehypeKatex, { output: 'html' }],
        ],
      },
    },
    components: MdxComponent,
  });

  return {
    body,
    frontmatter: createPostFrontmatter(data, slug, readingTime(content)),
  };
}

export async function getAllPost(): Promise<PostFrontmatter[]> {
  const articles = fs.readdirSync(articlesPath);

  return articles.reduce<PostFrontmatter[]>((allArticles, articleSlug) => {
    const source = fs.readFileSync(
      path.join(articlesPath, articleSlug),
      'utf-8',
    );
    const { data, content } = matter(source);

    if (!validateFrontmatter(data)) {
      console.warn(`Invalid frontmatter in ${articleSlug}`);
      return allArticles;
    }

    const post = createPostFrontmatter(
      data,
      articleSlug.replace('.mdx', ''),
      readingTime(content),
    );

    return [post, ...allArticles];
  }, []);
}
