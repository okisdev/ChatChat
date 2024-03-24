import createNextIntlPlugin from 'next-intl/plugin';

import nextPWA from 'next-pwa';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const withPWA = nextPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

export default withNextIntl(
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
