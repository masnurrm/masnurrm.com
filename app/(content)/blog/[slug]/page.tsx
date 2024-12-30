import { getFiles, getPostBySlug } from '@/lib/hooks/use-postlib';
import type { Metadata } from 'next';
import { ArticleJsonLd } from 'next-seo';
import dayjs from 'dayjs';
import Link from 'next/link';

// Gunakan SearchParams dan Props sesuai dokumentasi Next.js
type SearchParams = { [key: string]: string | string[] | undefined };

type Props = {
  params: { slug: string };
  searchParams: SearchParams;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { frontmatter } = await getPostBySlug(params.slug);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      images: [frontmatter.image],
    },
  };
}

export default async function Post({ params }: Props) {
  const { body, frontmatter } = await getPostBySlug(params.slug);

  return (
    <section className="max-w-screen-md space-y-4 md:mx-12">
      <ArticleJsonLd
        type="BlogPosting"
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${params.slug}`}
        title={frontmatter.title}
        description={frontmatter.description}
        images={[frontmatter.image]}
        datePublished={frontmatter.date}
        authorName="Akha"
        useAppDir={true}
      />
      <h1 className="text-pretty text-4xl md:text-6xl">{frontmatter.title}</h1>
      <p>{frontmatter.description}</p>
      <div className="flex items-center text-sm text-muted-foreground">
        <p>
          <Link href="/about" className="font-bold text-foreground">
            Akha
          </Link>
          {' / '}
          {dayjs(frontmatter.date).format('MMM DD, YYYY')}
        </p>
        <p className="ml-auto">
          {`${frontmatter.readingTime.text} • ${frontmatter.readingTime.words} words`}
        </p>
      </div>
      <hr className="border-t-2 border-dashed" />
      <article className="prose max-w-full dark:prose-invert">{body}</article>
    </section>
  );
}

export async function generateStaticParams() {
  const posts = await getFiles();
  return posts.map((post) => ({
    slug: post.replace(/\.mdx?$/, ''),
  }));
}
