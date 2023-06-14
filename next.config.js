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
                source: '/dashboard/profile',
                destination: '/dashboard/profile/info',
                permanent: true,
            },
            {
                source: '/dashboard/team',
                destination: '/dashboard/team/info',
                permanent: true,
            },
        ];
    },
});

module.exports = nextConfig;
