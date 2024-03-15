import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['en'],

    defaultLocale: 'en',
});

export const config = {
    matcher: ['/', '/(en)/:path*'],
};
