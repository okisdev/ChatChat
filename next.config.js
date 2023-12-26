const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

module.exports = withNextIntl(
    withPWA({
        experimental: {
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
    })
);
