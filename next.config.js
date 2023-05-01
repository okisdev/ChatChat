const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ['prisma'],
    },
    images: {
        domains: ['avatars.githubusercontent.com'],
    },
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/profile',
                destination: '/profile/info',
                permanent: true,
            },
        ];
    },
});

module.exports = nextConfig;
