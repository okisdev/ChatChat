import createMiddleware from 'next-intl/middleware';

import { languageId } from '@/config/i18n';

export default createMiddleware({
    locales: languageId,

    defaultLocale: 'en',

    localePrefix: 'never',
});

export const config = {
    matcher: ['/', '/search', '/(de|en|es|fr|it|ja|ko|nl|pt|ru|zh-CN|zh-HK|zh-TW)/:path*'],
};
