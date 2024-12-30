import { getImage } from '@/lib/hooks/use-placeholder';
import { getAllPost } from '@/lib/hooks/use-postlib';
import dayjs from 'dayjs';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Some tech stuff and my life updates.',
};

export default async function Blog() {
  const posts = await getAllPost();
  const filteredBlogPosts = posts.sort(
    (a, b) => Number(new Date(b.date)) - Number(new Date(a.date)),
  );

  return (
    <section className="px-4 md:px-12 lg:container lg:px-24 xl:px-32">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-muted-foreground">
          I will write here (mirroring my medium). But let me sleep first.
        </p>
      </div>
      {filteredBlogPosts.length ? (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredBlogPosts.map(async (frontMatter, i) => {
            const base64 = await getImage(frontMatter.image);
            return (
              <Link
                key={i}
                className="block overflow-hidden rounded-lg border border-border transition-colors hover:bg-muted/50"
                href={`/blog/${frontMatter.slug}`}
              >
                <div className="relative">
                  <Image
                    src={frontMatter.image}
                    alt={frontMatter.title}
                    className="aspect-[16/9] w-full object-cover"
                    width={540}
                    height={270}
                    placeholder="blur"
                    blurDataURL={base64}
                  />
                </div>
                <div className="space-y-2 p-4">
                  <h4 className="line-clamp-2 text-xl font-medium">
                    {frontMatter.title}
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    {dayjs(frontMatter.date).format('MMMM DD, YYYY')}
                    {` • ${frontMatter.readingTime.text}`}
                    {` • ${frontMatter.readingTime.words} word(s)`}
                  </div>
                  <p className="line-clamp-2 text-muted-foreground">
                    {frontMatter.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="pt-4">No blog post.</p>
      )}
    </section>
  );
}
