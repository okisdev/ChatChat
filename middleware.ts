import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['en', 'zh-CN', 'zh-HK', 'ja'],

    defaultLocale: 'en',
});

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
