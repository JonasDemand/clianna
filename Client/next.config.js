/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    CLIANNA_API_URL: process.env.CLIANNA_API_URL ?? 'https://localhost:4000',
  },
  redirects: async () => [
    { source: '/', destination: '/manage/customers', permanent: true },
  ],
};

module.exports = nextConfig;
