import withPlaiceholder from '@plaiceholder/next';

/** @type {import('next').NextConfig} */
const config = {
  ...(process.env.DEPLOYMENT_ENV === 'cloudflare'
    ? {
        output: 'export',
        async redirects() {
          return [];
        },
        images: {
          unoptimized: true,
          remotePatterns: [
            {
              protocol: 'https',
              hostname: 'i.scdn.co',
              port: '',
              pathname: '/image/**',
            },
            {
              protocol: 'https',
              hostname: 'images.unsplash.com',
              port: '',
              pathname: '/**',
            },
          ],
        },
      }
    : {
        images: {
          remotePatterns: [
            {
              protocol: 'https',
              hostname: 'i.scdn.co',
              port: '',
              pathname: '/image/**',
            },
            {
              protocol: 'https',
              hostname: 'images.unsplash.com',
              port: '',
              pathname: '/**',
            },
          ],
        },
      }),
};

export default withPlaiceholder(config);
