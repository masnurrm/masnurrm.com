import type { ReadTimeResults } from 'reading-time';

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  image: string;
  readingTime: ReadTimeResults;
  slug: string;
}

export interface MDXFrontmatter {
  title: string;
  description: string;
  date: string;
  image: string;
}
