import { getAllPost } from '@/lib/hooks/use-postlib';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL;
  const curDate = new Date().toISOString();

  const routes = ['', '/blog', '/projects', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: curDate,
  }));

  try {
    const posts = await getAllPost();
    const blogs = posts.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.date).toISOString(),
    }));

    return [...routes, ...blogs];
  } catch (error) {
    console.warn(
      'No blog posts found or error accessing blog directory:',
      error,
    );
    return routes;
  }
}
