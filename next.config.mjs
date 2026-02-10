/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.ads-twitter.com https://ads-twitter.com https://ads-api.twitter.com https://analytics.twitter.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://static.ads-twitter.com https://ads-twitter.com https://ads-api.twitter.com https://analytics.twitter.com https://t.co;
      font-src 'self';
      connect-src 'self' https://static.ads-twitter.com https://ads-twitter.com https://ads-api.twitter.com https://analytics.twitter.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `;

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;