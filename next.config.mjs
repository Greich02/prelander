/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.redditstatic.com https://static.ads-twitter.com https://www.googletagmanager.com https://www.google-analytics.com",
              "script-src-elem 'self' 'unsafe-inline' https://www.redditstatic.com https://static.ads-twitter.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https: https://www.redditstatic.com",
              "font-src 'self' data:",
              "connect-src 'self' https://events.redditmedia.com https://www.redditstatic.com https://static.ads-twitter.com https://ads-twitter.com https://www.google-analytics.com https://www.googletagmanager.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;