import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'masnurrm',
    description:
      'Pretending as a Software Engineer focusing on Cloud, DevSecOps, and Backend evelopment. Psst, talking about business too (lagi BU)!',
    background_color: '#fff',
    theme_color: '#fff',
    display: 'standalone',
    start_url: '/',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon1.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'icon2.png',
        sizes: '384x384',
        type: 'image/png',
      },
    ],
  };
}
