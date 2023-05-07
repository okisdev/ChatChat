import '@/styles/globals.css';
import '@/styles/markdown.css';
import 'tippy.js/dist/tippy.css';

import { NextIntlClientProvider } from 'next-intl';

import { HotToaster } from '@/components/client/toaster';
import { ClientCommand } from '@/components/client/command';

import NotFound from '@/app/not-found';

export default async function LocaleLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
    let messages;

    try {
        messages = (await import(`../../locales/${locale}.json`)).default;
    } catch (error) {
        return <NotFound />;
    }

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <HotToaster />
            <ClientCommand />

            {children}
        </NextIntlClientProvider>
    );
}
