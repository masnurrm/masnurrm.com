import 'katex/dist/katex.min.css';

import { getFiles, getPostBySlug } from '@/lib/hooks/use-postlib';
import dayjs from 'dayjs';
import type { Metadata } from 'next';
import { ArticleJsonLd } from 'next-seo';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { frontmatter } = await getPostBySlug(resolvedParams.slug);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      images: frontmatter.image,
    },
  };
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { body, frontmatter } = await getPostBySlug(resolvedParams.slug);

  return (
    <section className="max-w-screen-md space-y-4 md:mx-12">
      <ArticleJsonLd
        useAppDir={true}
        authorName="Nur Muhammad"
        url={process.env.BASE_URL! + '/blog/' + resolvedParams.slug}
        title={frontmatter.title}
        description={frontmatter.description}
        images={[frontmatter.image]}
        datePublished={frontmatter.date}
      />
      <h1 className="text-pretty text-4xl md:text-6xl">{frontmatter.title}</h1>
      <p>{frontmatter.description}</p>
      <div className="flex items-center text-sm text-muted-foreground">
        <p>
          <Link href="/about" className="font-bold text-foreground">
            Nur Muhammad
          </Link>
          {' / '}
          {dayjs(frontmatter.date).format('MMM DD, YYYY')}
        </p>
        <p className="ml-auto">
          {`${frontmatter.readingTime.text} • ${frontmatter.readingTime.words} word(s)`}
        </p>
      </div>
      <hr className="border-t-2 border-dashed" />
      <div className="prose max-w-full dark:prose-invert">{body}</div>
    </section>
  );
}

export async function generateStaticParams() {
  const posts = await getFiles();
  return posts.map((post) => {
    const slug = post.replace(/\.mdx/, '');
    return {
      slug: slug,
    };
  });
}
