/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    { source: '/', destination: '/manage/customers', permanent: true },
  ],
};

module.exports = nextConfig;
